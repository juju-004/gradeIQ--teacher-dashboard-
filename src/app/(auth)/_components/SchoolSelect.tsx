"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export type SchoolSelectProps = {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
};

export default function SchoolSelect({
  value,
  onChange,
  error,
}: SchoolSelectProps) {
  const [schools, setSchools] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get("/api/schools");
        const names = data.map((s: { name: string }) => s.name);
        setSchools(names);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <FormItem>
      <FormLabel>School Name</FormLabel>
      <FormControl>
        <Select value={value ?? ""} onValueChange={(val) => onChange(val)}>
          <SelectTrigger aria-invalid={error}>
            <SelectValue
              placeholder={
                loading ? "Loading Schools..." : "Select your school"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {schools.map((sch, i) => (
              <SelectItem key={i} value={sch}>
                {sch}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
