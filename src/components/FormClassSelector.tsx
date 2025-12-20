"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { useFormClass } from "@/context/FormClass";
import { Skeleton } from "@/components/ui/skeleton";

function FormClassSelector() {
  const { activeClass, setActiveClass, formClasses } = useFormClass();

  return (
    <>
      {activeClass ? (
        <SidebarGroup className="px-2 w-full">
          <SidebarGroupLabel className="px-2 text-foreground">
            <Select value={activeClass} onValueChange={setActiveClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {formClasses.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SidebarGroupLabel>
        </SidebarGroup>
      ) : (
        <Skeleton className="h-9 w-32" />
      )}
    </>
  );
}

export default FormClassSelector;
