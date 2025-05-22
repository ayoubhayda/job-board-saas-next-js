import EmptyState from "@/components/general/EmptyState";
import JobCard from "@/components/general/JobCard";
import { getFavoritesMutation } from "@/lib/Services";
import { userConected } from "@/utils/userConected";
import React from "react";

const page = async () => {
  const user = await userConected();
  const data = await getFavoritesMutation(user?.id as string);

  if (data.length === 0) {
    return (
      <div className="min-h-[calc(100vh-100px)] flex items-center justify-center">
        <EmptyState
          className="border-none"
          title="No Favorites found"
          description="You dont have any favorites yet."
          buttonText="Find a job"
          href="/"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 mt-5 gap-4 pt-4 pb-10">
      {data.map((favorite) => (
        <JobCard key={favorite.job.id} job={favorite.job} />
      ))}
    </div>
  );
};

export default page;
