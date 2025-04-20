import { companySchema } from "@/utils/zodSchemas";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const CompanyForm = () => {
  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      about: "",
      location: "",
      logo: "",
      website: "",
      xAccount: "",
    },
  });
  return <div>CompanyForm</div>;
};

export default CompanyForm;
