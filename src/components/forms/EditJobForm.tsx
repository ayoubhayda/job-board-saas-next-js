"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { z } from "zod";
import { jobSchema } from "@/utils/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { countryList } from "@/utils/countriesList";
import SalaryRangeSelector from "../general/SalaryRangeSelector";
import JobDescriptionEditor from "../richTextEditor/JobDescriptionEditor";
import BenefitsSelector from "../general/BenefitsSelector";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";
import { UploadDropzone } from "@/app/utils/uploadthing";
import { jobTypes } from "@/constants/PostJob";
import { editJobPost } from "@/lib/actions";

interface EditJobFormProps {
  job: {
    id: string;
    company: {
      name: string;
      location: string;
      about: string;
      website: string;
      logo: string;
      xAccount: string | null;
    };
    jobTitle: string;
    jobDescription: string;
    employmentType: string;
    location: string;
    salaryFrom: number;
    salaryTo: number;
    benefits: string[];
  };
}
const EditJobForm = ({ job }: EditJobFormProps) => {
  const [pending, setPending] = useState(false);
  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      jobTitle: job.jobTitle,
      jobDescription: job.jobDescription,
      location: job.location,
      employmentType: job.employmentType,
      salaryFrom: job.salaryFrom,
      salaryTo: job.salaryTo,
      benefits: job.benefits,
      companyName: job.company.name,
      companyAbout: job.company.about,
      companyLocation: job.company.location,
      companyLogo: job.company.logo,
      companyWebsite: job.company.website,
      companyXAccount: job.company.xAccount || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof jobSchema>) => {
    try {
      setPending(true);
      await editJobPost(data, job.id);
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        console.error("Error creating job:", error);
      }
    } finally {
      setPending(false);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="col-span-1 lg:col-span-2 flex flex-col gap-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Job Title and Employment Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter job title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Employment Type */}
              <FormField
                control={form.control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel>Employment Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="!w-full cursor-pointer">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Employment Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Employment Type</SelectLabel>
                            {jobTypes.map((type) => (
                              <SelectItem
                                key={type.id}
                                value={type.value}
                                className="cursor-pointer"
                              >
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="!w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Worldwid</SelectLabel>
                            <SelectItem value="worldwide">
                              <span>🌍</span>
                              <span className="pl-1">Worldwide / Remote</span>
                            </SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Location</SelectLabel>
                            {countryList.map((country) => (
                              <SelectItem
                                value={country.name}
                                key={country.code}
                              >
                                <span>{country.flagEmoji}</span>
                                <span className="pl-1">{country.name}</span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Salary */}
              <FormItem className="space-y-0.5">
                <FormLabel>Salary Range</FormLabel>
                <FormControl>
                  <SalaryRangeSelector
                    control={form.control}
                    minSalary={30000}
                    maxSalary={1000000}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.salaryFrom?.message ||
                    form.formState.errors.salaryTo?.message}
                </FormMessage>
              </FormItem>
            </div>

            {/* Job Description */}
            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <JobDescriptionEditor field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Job Benefits */}
            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel>Benefits</FormLabel>
                  <FormControl>
                    <BenefitsSelector field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Company Name */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Company Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Company Location */}
              <FormField
                control={form.control}
                name="companyLocation"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel>Company Location</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="!w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Company Location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Worldwide</SelectLabel>
                          <SelectItem value="worldwide">
                            <span>🌍</span>
                            <span className="pl-1">Worldwide</span>
                          </SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Location</SelectLabel>
                          {countryList.map((country) => (
                            <SelectItem value={country.name} key={country.name}>
                              <span>{country.flagEmoji}</span>
                              <span className="pl-1">{country.name}</span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Company website */}
              <FormField
                control={form.control}
                name="companyWebsite"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel>Company Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourcompany.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyXAccount"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel>Company X Account</FormLabel>
                    <FormControl>
                      <Input placeholder="@yourcompany" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="companyAbout"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel>Company Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Company Description"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Logo field */}
            <FormField
              control={form.control}
              name="companyLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Logo</FormLabel>
                  <FormControl>
                    {field.value ? (
                      <div className="relative w-fit mt-2">
                        <Image
                          src={field.value}
                          alt="Company Logo"
                          width={100}
                          height={100}
                          className="rounded-lg "
                        />
                        <Button
                          variant="destructive"
                          type="button"
                          size="icon"
                          className="absolute -top-2 -right-2 rounded-full cursor-pointer !bg-red-600/80 hover:!bg-red-600/95 transition-all duration-200 ease-in-out !size-8"
                          onClick={() => {
                            field.onChange("");
                          }}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <UploadDropzone
                        endpoint={"imageUploader"}
                        onClientUploadComplete={(files) => {
                          field.onChange(files[0].ufsUrl);
                        }}
                        onUploadError={() => {
                          console.log("Error uploading file");
                        }}
                        className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 ut-label:text-muted-foreground ut-button:cursor-pointer ut-allowed-content:text-muted-foreground border-primary"
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={pending}
          className="w-full cursor-pointer text-white"
        >
          {pending ? "Submitting..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};

export default EditJobForm;
