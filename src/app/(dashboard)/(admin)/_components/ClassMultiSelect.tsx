"use client";

import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import fetcher from "@/lib/fetcher";
import { IDName } from "@/server/types";

export function ClassMultiSelect({
  value,
  onChange,
  name = "formClass",
  defaultClasses,
}: {
  value: string[];
  defaultClasses?: string[];
  onChange: (val: string[]) => void;
  name?: string; // so we can generate hidden fields
}) {
  const { data, isLoading } = useSWR("/api/admin/classes", fetcher);
  const classes: IDName[] = defaultClasses
    ? defaultClasses
    : data?.classes || [];

  const toggleValue = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <>
      {/* Hidden fields for server actions */}
      {value.map((cls) => (
        <input key={cls} type="hidden" name={name} value={cls} />
      ))}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {value.length === 0 ? "Select Form Classes" : value.join(", ")}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" sideOffset={4} className="w-full p-2">
          {isLoading && <p className="text-sm">Loading...</p>}

          <div className="space-y-1">
            {classes.map((cls) => (
              <button
                type="button"
                key={cls._id}
                onClick={() => toggleValue(cls.name)}
                className="flex w-full items-center justify-between rounded px-2 py-1 hover:bg-muted"
              >
                <span>{cls.name}</span>
                {value.includes(cls.name) && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
