import JobFilterSection from "@/components/general/JobFilterSection";
import JobListing from "@/components/general/JobListing";
import React from "react";

export default function Home() {
  return (
    <div className="grid grid-cols-3 gap-8">
      <JobFilterSection />

      <div className="col-span-2 flex flex-col gap-6">
        <JobListing />
      </div>
    </div>
  );
}
