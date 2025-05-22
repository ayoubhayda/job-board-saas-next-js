import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";
import { Label } from "../ui/label";
import { jobTypes } from "@/constants/PostJob";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
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

const JobFilterSection = () => {
  return (
    <Card className="col-span-1 shadow-none h-fit">
      <CardHeader className="space-y-4">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-semibold">Filters</CardTitle>
          <Button
            variant="destructive"
            size="sm"
            className="h-8 cursor-pointer"
          >
            <span>Clear All</span>
            <XIcon className="size-4 ml-1" />
          </Button>
        </div>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Job Type</Label>
          <div className="grid grid-cols-2 gap-4">
            {jobTypes.map((jobType) => (
              <div key={jobType.id} className="flex items-center space-x-2">
                <Checkbox id={jobType.value} className="cursor-pointer" />
                <Label
                  className="text-sm font-medium cursor-pointer"
                  htmlFor={jobType.value}
                >
                  {jobType.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Location</Label>
          <Select>
            <SelectTrigger className="!w-full cursor-pointer">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Worldwide</SelectLabel>
                <SelectItem value="worldwide" className="cursor-pointer">
                  <span>🌍</span>
                  <span className="pl-1">Worldwide / Remote</span>
                </SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Location</SelectLabel>
                {countryList.map((country) => (
                  <SelectItem value={country.name} key={country.name} className="cursor-pointer">
                    <span>{country.flagEmoji}</span>
                    <span className="pl-1">{country.name}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobFilterSection;
