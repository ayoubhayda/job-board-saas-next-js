"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { benefits } from "@/utils/listOfBenefits";

interface BenefitsSelectorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any; // Replace with proper type if needed
}

const BenefitsSelector = ({ field }: BenefitsSelectorProps) => {
  const toggleBenefit = (benefitId: string) => {
    const currentBenefits = field.value || [];
    const newBenefits = currentBenefits.includes(benefitId)
      ? currentBenefits.filter((id: string) => id !== benefitId)
      : [...currentBenefits, benefitId];

    field.onChange(newBenefits);
  };

  return (
    <div className="">
      <div className="flex flex-wrap gap-3">
        {benefits.map((benefit) => {
          const isSelected = (field.value || []).includes(benefit.id);
          return (
            <Badge
              key={benefit.id}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all hover:bg-muted select-none text-sm px-4 py-1.5 rounded-full ${
                isSelected ? "text-white hover:bg-primary/85" : ""
              }`}
              onClick={() => toggleBenefit(benefit.id)}
            >
              <span className="flex items-center gap-2">
                {benefit.icon}
                {benefit.label}
              </span>
            </Badge>
          );
        })}
      </div>
      <div className="mt-4 text-sm text-muted-foreground">
        Selected benefits:{" "}
        <span className="text-primary">{(field.value || []).length}</span>
      </div>
    </div>
  );
};

export default BenefitsSelector;
