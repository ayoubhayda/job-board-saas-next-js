import CreateJobForm from "@/components/forms/CreateJobForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { companies, stats, testimonials } from "@/constants/PostJob";
import { getCompany } from "@/lib/Services";
import { userConected } from "@/utils/userConected";
import Image from "next/image";
import React from "react";

const page = async () => {
  const user = await userConected();
  const companydata = await getCompany(user.id as string);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
      {/* Create Job Form */}
      <CreateJobForm
        companyName={companydata.name}
        companyAbout={companydata.about}
        companyLocation={companydata.location}
        companyLogo={companydata.logo}
        companyWebsite={companydata.website}
        companyXAccount={companydata.xAccount}
      />

      {/* Trusted by Industry Leaders */}
      {/* This card will contain company logos, testimonials, and stats */}
      <Card className="col-span-1 h-fit">
        <CardHeader>
          <CardTitle className="text-xl">Trusted by Industry Leaders</CardTitle>
          <CardDescription>
            Join thousands of companies hiring top talent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company logos */}
          <div className="grid grid-cols-3 gap-4">
            {companies.map((company) => (
              <Image
                key={company.id}
                src={company.logo}
                alt={company.name}
                width={80}
                height={80}
                className="rounded-lg border border-muted-foreground/15 hover:border-muted-foreground/40 transition-all duration-200 ease-in-out"
              />
            ))}
          </div>

          {/* Testimonials */}
          <div className="space-y-4">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <blockquote
                key={index}
                className="border-l-2 border-primary pl-4"
              >
                <p className="text-sm italic text-muted-foreground">
                  &quot;{testimonial.quote}&quot;
                </p>
                <footer className="mt-2 text-sm font-medium">
                  - {testimonial.author}, {testimonial.company}
                </footer>
              </blockquote>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="rounded-lg bg-muted p-4">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
