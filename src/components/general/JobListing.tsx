import { getJobsDataMutation } from "@/lib/Services";
import React from "react";
import EmptyState from "./EmptyState";
import JobCard from "./JobCard";

const JobListing = async () => {
  const jobsList = await getJobsDataMutation();
  return (
    <>
      {jobsList.length > 0 ? (
        <div className="flex flex-col gap-6">
          {jobsList.map((job) => (
            <JobCard key={job.id} job={job}/>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No jobs found"
          description="Try searching for a different job title or location."
          buttonText="Clear all filters"
          href="/"
        />
      )}
    </>
  );
};

export default JobListing;
