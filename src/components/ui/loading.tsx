"use client";

import { Loader2 } from "lucide-react";

export default function PageLoader({
  label = "Loading...",
}: {
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin mb-4" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
