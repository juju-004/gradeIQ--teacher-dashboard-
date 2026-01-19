"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormClass } from "@/context/FormClass";
import { Skeleton } from "@/components/ui/skeleton";

function FormClassSelector() {
  const { activeClass, setActiveClass, formClasses } = useFormClass();

  return (
    <>
      {activeClass ? (
        <Select value={activeClass} onValueChange={setActiveClass}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {formClasses.map((cls) => (
              <SelectItem key={cls} value={cls}>
                {cls}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Skeleton className="h-9 w-32" />
      )}
    </>
  );
}

export default FormClassSelector;
