"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchX, Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center text-center py-14 space-y-5">
          {/* Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-c1/10">
            <SearchX className="h-8 w-8 text-c1" />
          </div>

          {/* Text */}
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">404</h1>
            <p className="text-sm text-muted-foreground">
              The page you’re looking for doesn’t exist or was moved.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go back
            </Button>

            <Button
              className="bg-c1 text-white hover:bg-c1/90"
              onClick={() => router.push("/")}
            >
              <Home className="h-4 w-4 mr-2" />
              Go home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
