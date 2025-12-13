"use client";

import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import fetcher from "@/lib/fetcher";
import { IDName } from "@/server/types";

export function MultiSelect({
  value,
  onChange,
  name = "formClass",
}: {
  value: string[];
  onChange: (val: string[]) => void;
  name?: string; // so we can generate hidden fields
}) {
  const { data, isLoading } = useSWR("/api/gen/staff", fetcher);
  const classes: IDName[] = data?.teachers || [];

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
            asChild
          >
            <div>
              {value.length === 0
                ? "Select Teacher"
                : value
                    .map((id) => classes.find((c) => c._id === id)?.name)
                    .filter(Boolean)
                    .join(", ")}

              <div className="flex items-center gap-3">
                {value.length !== 0 && (
                  <span
                    onClick={() => onChange([])}
                    className="flex items-center gap-1 cursor-pointer text-gray-500 hover:text-gray-700"
                    title="Clear selection"
                  >
                    <X size={14} />
                  </span>
                )}
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              </div>
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" sideOffset={4} className="w-full p-2">
          {isLoading && <p className="text-sm">Loading...</p>}

          <div className="space-y-1">
            {classes.map((cls) => (
              <button
                type="button"
                key={cls._id}
                onClick={() => toggleValue(cls._id)}
                className="flex w-full items-center justify-between rounded px-2 py-1 hover:bg-muted"
              >
                <span>{cls.name}</span>
                {value.includes(cls._id) && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
