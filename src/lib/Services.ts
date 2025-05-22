import { prisma } from "@/utils/prisma";
import { redirect } from "next/navigation";

export const getCompany = async (userId: string) => {
  const data = await prisma.company.findUnique({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      name: true,
      logo: true,
      location: true,
      about: true,
      xAccount: true,
      website: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!data) {
    return redirect("/");
  }

  return data;
};

// Get all active jobs
export const getJobsDataMutation = async () => {
  const data = await prisma.job.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      id: true,
      jobTitle: true,
      salaryFrom: true,
      salaryTo: true,
      employmentType: true,
      location: true,
      createdAt: true,
      company: {
        select: {
          id: true,
          name: true,
          logo: true,
          location: true,
          about: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
};

// Get Job Details
export const getJobMutation = async (jobId: string) => {
  const jobData = await prisma.job.findUnique({
    where: {
      status: "ACTIVE",
      id: jobId,
    },
    select: {
      jobTitle: true,
      jobDescription: true,
      location: true,
      employmentType: true,
      benefits: true,
      createdAt: true,
      listingDuration: true,
      company: {
        select: {
          name: true,
          logo: true,
          location: true,
          about: true,
        },
      },
    },
  });

  return jobData;
};
