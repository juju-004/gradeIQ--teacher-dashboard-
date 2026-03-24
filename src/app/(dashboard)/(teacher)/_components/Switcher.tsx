import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";

function Switcher({
  uploadType,
  setUploadType,
}: {
  uploadType: "P" | "H";
  setUploadType: React.Dispatch<React.SetStateAction<"P" | "H">>;
}) {
  return (
    <Select
      value={uploadType}
      onValueChange={(v) => setUploadType(v as "P" | "H")}
    >
      <SelectTrigger className="">
        <SelectValue placeholder="Select scheme type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="P">Prnt</SelectItem>
        <SelectItem value="H">Hwr</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default Switcher;
