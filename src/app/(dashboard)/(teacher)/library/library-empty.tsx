"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileX, PlusCircle } from "lucide-react";
import Link from "next/link";

export function LibraryEmpty() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        {/* Icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-c1/10">
          <FileX className="h-7 w-7 text-c1" />
        </div>

        {/* Text */}
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">No assessments yet</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Students haven’t taken any assessments for this class and subject
            yet. Once they do, results will appear here.
          </p>
        </div>

        <Separator className="w-40" />

        {/* Action */}
        <Link href={"/assessment"}>
          <Button className="bg-c1 text-white hover:bg-c1/90">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create assessment
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
