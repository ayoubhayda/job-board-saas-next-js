import { prisma } from "@/utils/prisma";
import { inngest } from "./client";
import {Resend} from "resend";
import { formatSalary, generateEmailTemplate } from "@/utils/helpers";

const resend = new Resend(process.env.RESEND_API_KEY);

// This function is triggered when a new job is created.
export const handleJobExpiration = inngest.createFunction(
  { id: "job-expiration" },
  { event: "job/created" },
  async ({ event, step }) => {
    // Check if the job is already expired
    const { jobId, expirationDays } = event.data;

    // Check if the job is already expired
    await step.sleep("wait-for-job-expiration", `${expirationDays}d`);

    // If the job is still active, update its status to EXPIRED
    await step.run("update-job-status", async () => {
      await prisma.job.update({
        where: { id: jobId },
        data: { status: "EXPIRED" },
      });
    });

    // Send a notification to the user
    return { message: `Job ${jobId} has expired.` };
  }
);


export const sendPeriodicJobListings = inngest.createFunction(
  { id: "send-job-listings" },
  { event: "jobseeker/created" },

  async ({ event, step }) => {
    const { userId } = event.data;

    const totalDays = 30;
    const intervalDays = 2;
    let currentDay = 0;

    while (currentDay < totalDays) {
      await step.sleep("wait-interval", `${intervalDays}d`);
      currentDay += intervalDays;

      const recentJobs = await step.run("fetch-recent-jobs", async () => {
        return await prisma.job.findMany({
          where:{
            status: "ACTIVE",
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
          include:{
            company: {
              select: {
                name: true,
                logo: true,
              },
            },
          }
        });
      })

      if (recentJobs.length > 0) {
        await step.run("send-email", async () => {
          // Generate job cards HTML with improved design
          const jobListingHtml = recentJobs.map((job) => `
            <div style="margin-bottom: 24px; padding: 20px; border-radius: 8px; background-color: #f9f9f9; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                ${job.company.logo ? 
                  `<img src="${job.company.logo}" alt="${job.company.name} logo" style="width: 40px; height: 40px; border-radius: 4px; margin-right: 12px; object-fit: contain;">` : 
                  `<div style="width: 40px; height: 40px; border-radius: 4px; background-color: #e0e0e0; margin-right: 12px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #666;">${job.company.name.charAt(0)}</div>`
                }
                <div>
                  <h3 style="margin: 0; font-size: 18px; color: #333;">${job.jobTitle}</h3>
                  <p style="margin: 4px 0 0; font-size: 14px; color: #666;">${job.company.name}</p>
                </div>
              </div>
              <div style="margin-top: 12px;">
                <p style="margin: 0; display: flex; align-items: center; font-size: 14px; color: #555;">
                  <span style="margin-right: 8px; display: inline-flex; align-items: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    ${job.location}
                  </span>
                  <span style="display: inline-flex; align-items: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    ${formatSalary(job.salaryFrom, job.salaryTo)}
                  </span>
                </p>
              </div>
              <div style="margin-top: 16px;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/job" style="display: inline-block; font-size: 14px; font-weight: 500; color: #00c951; text-decoration: none;">
                  View Job Details →
                </a>
              </div>
            </div>
          `).join("");

          await resend.emails.send({
            from: 'JobMarshal <onboarding@resend.dev>',
            to: ['ayoubhayda01@gmail.com'],
            subject: 'Curated Job Opportunities Just For You',
            html: generateEmailTemplate(jobListingHtml),
          });
        });
      }
    }

    return {userId, message:"Completed 30 day job listing notification."};
  }
)
