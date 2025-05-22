import JsonToHtml from "@/components/general/JsonToHtml";
import SaveButton from "@/components/general/SaveButton";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { jobTypes } from "@/constants/PostJob";
import { saveJobPost, unSaveJobPost } from "@/lib/actions";
import { getClient } from "@/lib/security";
import { getJobMutation } from "@/lib/Services";
import { cn } from "@/lib/utils";
import { auth } from "@/utils/auth";
import { getFlagEmoji } from "@/utils/countriesList";
import { benefits } from "@/utils/listOfBenefits";
import { request } from "@arcjet/next";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Params = Promise<{ id: string }>;
const page = async ({ params }: { params: Params }) => {
  const { id } = await params;

  const session = await auth();
  const req = await request();
  const decision = await getClient(!!session).protect(req, {
    requested: 10,
    fingerprint: `${session?.user?.id}`
  });

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }
  const { jobData: data, savedJob } = await getJobMutation(id, session?.user?.id);

  if (!data) {
    return;
  }

  const locationFlag = getFlagEmoji(data?.location as string);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 pb-12">
      <div className="space-y-8 col-1 md:col-span-2">
        {/* header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{data.jobTitle}</h1>
            <div className="flex items-center gap-2 mt-3">
              <p className="font-medium">{data.company.name}</p>
              <span className="hidden md:inline text-muted-foreground">•</span>
              <Badge className="rounded-full" variant="secondary">
                {jobTypes.find(
                  (jobType) => jobType.value === data.employmentType
                )?.label || data.employmentType}
              </Badge>
              <span className="hidden md:inline text-muted-foreground">•</span>

              <Badge className="rounded-full text-white">
                {locationFlag && <span className="mr-1">{locationFlag}</span>}
                {data.location}
              </Badge>
            </div>
          </div>

          {session?.user ? (
            <form
              action={
                savedJob
                  ? unSaveJobPost.bind(null, savedJob.id)
                  : saveJobPost.bind(null, id)
              }
            >
              <SaveButton savedJob={!!savedJob} />
            </form>
          ) : (
            <Link
            href="/login"
            className={`${buttonVariants({ variant: "outline" })} !shadow-none`}
          >
            <Heart className="size-4" />
            Save Job
          </Link>
          )}

          
        </div>

        <section>
          <JsonToHtml json={JSON.parse(data.jobDescription)} />
        </section>

        <section>
          <h3 className="font-semibold mb-4">
            Benefits{" "}
            <span className="text-sm text-muted-foreground font-normal">
              (green is offered)
            </span>
          </h3>

          <div className="flex flex-wrap gap-3">
            {benefits.map((benefit) => {
              const isOffered = data.benefits.includes(benefit.id);
              return (
                <Badge
                  className={cn(
                    isOffered ? "text-white" : "opacity-75 cursor-not-allowed",
                    "text-sm px-4 py-1.5 rounded-full"
                  )}
                  key={benefit.id}
                  variant={isOffered ? "default" : "outline"}
                >
                  <span className="flex items-center gap-2">
                    {benefit.icon}
                    {benefit.label}
                  </span>
                </Badge>
              );
            })}
          </div>
        </section>
      </div>

      <div className="space-y-6 grid-cols-1">
        <Card className="p-6 shadow-none">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold">Apply now</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Please let {data.company.name} know you found this job on
                JobMarshal. This helps us grow!
              </p>
            </div>

            <Button className="w-full text-white cursor-pointer">Apply now</Button>
          </div>
        </Card>

        {/* Job details card */}
        <Card className="p-6  shadow-none">
          <h3 className="font-semibold">About the Job</h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Apply before
              </span>

              <span className="text-sm">
                {new Date(
                  data.createdAt.getTime() +
                    data.listingDuration * 24 * 60 * 60 * 1000
                ).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex justify-between flex-wrap gap-1.5">
              <span className="text-sm text-muted-foreground text-nowrap">Posted on</span>

              <span className="text-sm">
                {data.createdAt.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex justify-between  flex-wrap gap-1.5">
              <span className="text-sm text-muted-foreground text-nowrap">
                Employment Type
              </span>

              <span className="text-sm">{data.employmentType}</span>
            </div>

            <div className="flex justify-between  flex-wrap gap-1.5">
              <span className="text-sm text-muted-foreground text-nowrap">Location</span>

              <span className="text-sm">
                {locationFlag && <span className="mr-1">{locationFlag}</span>}
                {data.location}
              </span>
            </div>
          </div>
        </Card>

        {/* Company Card */}
        <Card className="p-6  shadow-none">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Image
                src={data.company.logo}
                alt={"Company logo"}
                width={48}
                height={48}
                className="rounded-md size-12"
              />

              <div className="flex flex-col gap-2">
                <h3 className="font-semibold">{data.company.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {data.company.about}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default page;
