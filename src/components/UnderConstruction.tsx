"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnderConstruction() {
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center text-center py-12 space-y-5">
          {/* Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-c1/10">
            <Construction className="h-8 w-8 text-c1" />
          </div>

          {/* Title & Description */}
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Under Construction</h1>
            <p className="text-sm text-muted-foreground">
              This page is currently being worked on. Please check back later.
            </p>
          </div>

          {/* Action */}
          <Button variant="secondary" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
