"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/Auth";
import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";

function FormClassSelector() {
  const { user } = useAuth();
  const classes = user?.formClass ?? []; // example: ["JSS 1A", "JSS 2B"]

  const [activeClass, setActiveClass] = useState(classes[0] ?? "");

  return (
    <>
      {classes.length > 0 && (
        <SidebarGroup className="px-2 w-full">
          <SidebarGroupLabel className="px-2 text-foreground">
            <Select value={activeClass} onValueChange={setActiveClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SidebarGroupLabel>
        </SidebarGroup>
      )}
    </>
  );
}

export default FormClassSelector;
