import { z } from "zod";

// Company Schema
export const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  location: z.string().min(1, "Location must be defined"),
  about: z
    .string()
    .min(10, "Please provide some information about your company"),
  logo: z.string().min(1, "Please upload a logo"),
  website: z.string().url("Please enter a valid URL"),
  xAccount: z.string().optional(),
});

// Job Seeker Schema
export const jobSeekerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  about: z.string().min(10, "Please provide some information about yourself"),
  resume: z.string().min(1, "Please upload a resume"),
});

// Job Schema
export const jobSchema = z.object({
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  jobDescription: z.string().min(10, "Please provide a job description"),
  location: z.string().min(1, "Please select a location"),
  employmentType: z.string().min(1, "Please select an employment type"),
  salaryFrom: z.number().min(1, "Salary from is required"),
  salaryTo: z.number().min(1, "Salary to is required"),
  listingDuration: z.number().min(1, "Listing duration is required"),
  benefits: z.array(z.string()).min(1, "Please select at least one benefit"),

  companyName: z.string().min(1, "Company name is required"),
  companyAbout: z
    .string()
    .min(10, "Please provide some information about your company"),
  companyLocation: z.string().min(1, "Company location is required"),
  companyLogo: z.string().min(1, "Company logo is required"),
  companyWebsite: z.string().url("Please enter a valid URL"),
  companyXAccount: z.string().optional(),
});
