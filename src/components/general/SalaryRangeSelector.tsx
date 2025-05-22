import React, { useEffect, useState } from "react";
import { Slider } from "../ui/slider";
import { formatCurrency } from "@/utils/formatCurrency";
import { Control, useController } from "react-hook-form";

interface SalaryRangeSelectorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  minSalary?: number;
  maxSalary?: number;
  step?: number;
  currency?: string;
}

const SalaryRangeSelector = ({
  control,
  minSalary = 30000,
  maxSalary = 200000,
  step = 1000,
}: SalaryRangeSelectorProps) => {
  const { field: fromField } = useController({
    name: "salaryFrom",
    control,
  });

  const { field: toField } = useController({
    name: "salaryTo",
    control,
  });

  const [range, setRange] = useState<[number, number]>([
    fromField.value || minSalary,
    toField.value || maxSalary / 2,
  ]);

  const handleRangeChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setRange(newRange);
    fromField.onChange(newRange[0]);
    toField.onChange(newRange[1]);
  };

  // Update range when form values change externally
  useEffect(() => {
    setRange([fromField.value || minSalary, toField.value || maxSalary / 2]);
  }, [fromField.value, toField.value, minSalary, maxSalary]);

  return (
    <div className="w-full space-y-2.5">
      <Slider
        min={minSalary}
        max={maxSalary}
        step={step}
        value={range}
        onValueChange={handleRangeChange}
        className="mt-[2px]"
      />

      <div className="flex justify-between">
        <span className="text-xs text-muted-foreground">
          {formatCurrency(range[0])}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatCurrency(range[1])}
        </span>
      </div>
    </div>
  );
};

export default SalaryRangeSelector;
