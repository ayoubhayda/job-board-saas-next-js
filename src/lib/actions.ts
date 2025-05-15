"use server";

import arcjet, { detectBot, shield } from "@/utils/arcjet";
import { prisma } from "@/utils/prisma";
import { userConected } from "@/utils/userConected";
import { companySchema, jobSeekerSchema } from "@/utils/zodSchemas";
import { request } from "@arcjet/next";
import { redirect } from "next/navigation";
import { z } from "zod";

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
