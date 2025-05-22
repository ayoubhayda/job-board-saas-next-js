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

const aj = arcjet
  .withRule(shield({ mode: "LIVE" }))
  .withRule(detectBot({ mode: "LIVE", allow: [] }));

export async function createCompany(data: z.infer<typeof companySchema>) {
  const user = await userConected();

  const req = await request();
  const decision = await aj.protect(req, {
    fingerprint: `${user.id}`
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
    fingerprint: `${user.id}`
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
    fingerprint: `${user.id}`
  });

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validatedData = jobSchema.parse(data);
  const company = await prisma.company.findUnique({
    where:{
      userId: user.id
    },
    select:{
      id:true,
      user:{
        select:{
          stripeCustomerId: true,
        }
      }
    }
  })

  if(!company?.id){
    return redirect("/");
  }

  let stripeCustomerId = company.user.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email as string,
      name: user.name as string,
    })

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
    select:{
      id: true
    }
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
    data:{
      jobId: newJob.id,
      expirationDays: validatedData.listingDuration,
    }
  });

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: "payment",
    line_items:[
      {
        price_data:{
          product_data:{
            name: `Job Posting - ${pricingTier.days} Days`,
            description: pricingTier.description,
            images:[
              "https://6sn8pk7mrd.ufs.sh/f/1T4FQGtliscoUH0EOjYNw3ovf0YHX4peAMF9Dtk5qE1K6mRr"
            ]
          },
          unit_amount: pricingTier.price * 100,
          currency: "USD",
        },
        quantity: 1,
      }
    ],
    metadata:{
      jobId: newJob.id
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
  })


  return redirect(session.url as string);
}
