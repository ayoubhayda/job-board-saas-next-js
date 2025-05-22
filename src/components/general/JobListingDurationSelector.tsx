"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormControl } from "../ui/form";
import { ControllerRenderProps } from "react-hook-form";
import { jobListingDurationPricing } from "@/utils/pricingTiers";
import { cn } from "@/lib/utils";

interface JobListingDurationSelectorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, "listingDuration">;
}

const JobListingDurationSelector = ({
  field,
}: JobListingDurationSelectorProps) => {
  return (
    <FormControl>
      <RadioGroup
        value={field.value?.toString()}
        onValueChange={(value) => field.onChange(parseInt(value))}
      >
        <div className="grid gap-4">
          {jobListingDurationPricing.map((duration) => (
            <div key={duration.days} className="relative">
              <RadioGroupItem
                value={duration.days.toString()}
                id={duration.days.toString()}
                className="peer sr-only"
              />
              <Label
                htmlFor={duration.days.toString()}
                className="flex flex-col cursor-pointer"
              >
                <Card
                  className={cn(field.value === duration.days ? "border-primary bg-primary/10" : "hover:bg-secondary/50", "p-4 border transition-all w-full shadow-none")}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg">
                        {duration.days} Days
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {duration.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl">${duration.price}</p>
                      <p className="text-sm text-muted-foreground">
                        ${(duration.price / duration.days).toFixed(2)}/day
                      </p>
                    </div>
                  </div>
                </Card>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </FormControl>
  );
};

export default JobListingDurationSelector;
