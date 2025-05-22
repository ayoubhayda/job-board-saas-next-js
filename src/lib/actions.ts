"use server";

import arcjet, { detectBot, shield } from "@/utils/arcjet";
import { prisma } from "@/utils/prisma";
import { userConected } from "@/utils/userConected";
import { companySchema, jobSchema, jobSeekerSchema } from "@/utils/zodSchemas";
import { request } from "@arcjet/next";
import { redirect } from "next/navigation";
import { z } from "zod";
import { stripe } from "./stripe";
import { jobListingDurationPricing } from "@/utils/pricingTiers";
import { inngest } from "@/inngest/client";
import { revalidatePath } from "next/cache";

const aj = arcjet
  .withRule(shield({ mode: "LIVE" }))
  .withRule(detectBot({ mode: "LIVE", allow: [] }));

export async function createCompany(data: z.infer<typeof companySchema>) {
  const user = await userConected();

  const req = await request();
  const decision = await aj.protect(req, {
    fingerprint: `${user.id}`,
  });

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validatedData = companySchema.parse(data);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      onboardingComplete: true,
      userType: "COMPANY",
      company: {
        create: {
          ...validatedData,
        },
      },
    },
  });

  return redirect("/");
}

export async function createJobSeeker(data: z.infer<typeof jobSeekerSchema>) {
  const user = await userConected();

  const req = await request();
  const decision = await aj.protect(req, {
    fingerprint: `${user.id}`,
  });

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validatedData = jobSeekerSchema.parse(data);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      onboardingComplete: true,
      userType: "JOB_SEEKER",
      JobSeeker: {
        create: {
          ...validatedData,
        },
      },
    },
  });

  return redirect("/");
}

export async function createJob(data: z.infer<typeof jobSchema>) {
  const user = await userConected();

  const req = await request();
  const decision = await aj.protect(req, {
    fingerprint: `${user.id}`,
  });

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validatedData = jobSchema.parse(data);
  const company = await prisma.company.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      user: {
        select: {
          stripeCustomerId: true,
        },
      },
    },
  });

  if (!company?.id) {
    return redirect("/");
  }

  let stripeCustomerId = company.user.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email as string,
      name: user.name as string,
    });

    stripeCustomerId = customer.id;

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        stripeCustomerId: customer.id,
      },
    });
  }

  const newJob = await prisma.job.create({
    data: {
      jobTitle: validatedData.jobTitle,
      jobDescription: validatedData.jobDescription,
      location: validatedData.location,
      employmentType: validatedData.employmentType,
      salaryFrom: validatedData.salaryFrom,
      salaryTo: validatedData.salaryTo,
      listingDuration: validatedData.listingDuration,
      benefits: validatedData.benefits,
      companyId: company.id,
    },
    select: {
      id: true,
    },
  });

  const pricingTier = jobListingDurationPricing.find(
    (tier) => tier.days === validatedData.listingDuration
  );

  if (!pricingTier) {
    throw new Error("Invalid listing duration selected");
  }

  // Send the job creation event to Inngest
  await inngest.send({
    name: "job/created",
    data: {
      jobId: newJob.id,
      expirationDays: validatedData.listingDuration,
    },
  });

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: "payment",
    line_items: [
      {
        price_data: {
          product_data: {
            name: `Job Posting - ${pricingTier.days} Days`,
            description: pricingTier.description,
            images: [
              "https://6sn8pk7mrd.ufs.sh/f/1T4FQGtliscoUH0EOjYNw3ovf0YHX4peAMF9Dtk5qE1K6mRr",
            ],
          },
          unit_amount: pricingTier.price * 100,
          currency: "USD",
        },
        quantity: 1,
      },
    ],
    metadata: {
      jobId: newJob.id,
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
  });

  return redirect(session.url as string);
}

// Sever action to save a job post
// This function is called when the user clicks the save button
export async function saveJobPost(jobId: string) {
  const user = await userConected();

  const req = await request();

  const decision = await aj.protect(req, {
    fingerprint: `${user.id}`,
  });

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  await prisma.savedJob.create({
    data: {
      jobId: jobId,
      userId: user.id as string,
    },
  });

  revalidatePath(`/job/${jobId}`);
}

// Sever action to unsave a job post
// This function is called when the user clicks the unsave button
export async function unSaveJobPost(savedJobPostId: string) {
  const user = await userConected();

  const req = await request();

  const decision = await aj.protect(req, {
    fingerprint: `${user.id}`,
  });

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const data = await prisma.savedJob.delete({
    where: {
      id: savedJobPostId,
      userId: user.id,
    },
    select: {
      jobId: true,
    },
  });

  revalidatePath(`/job/${data.jobId}`);
}

// Action to update a job post
export async function editJobPost(
  data: z.infer<typeof jobSchema>,
  jobId: string
) {
  const user = await userConected();

  const req = await request();

  const decision = await aj.protect(req, {
    fingerprint: `${user.id}`,
  });

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validateData = jobSchema.parse(data);

  await prisma.job.update({
    where: {
      id: jobId,
      company: {
        userId: user.id,
      },
    },
    data: {
      jobDescription: validateData.jobDescription,
      jobTitle: validateData.jobTitle,
      employmentType: validateData.employmentType,
      location: validateData.location,
      salaryFrom: validateData.salaryFrom,
      salaryTo: validateData.salaryTo,
      listingDuration: validateData.listingDuration,
      benefits: validateData.benefits,
    },
  });

  return redirect("/my-jobs");
}
