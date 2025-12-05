"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/Auth";

export interface DashboardProps {
  classes: string[];
  staff: Array<{
    name: string;
    email: string;
    roles: string[];
    subject?: string;
    formClass?: string;
  }>;
  studentsCount: number;
}

export default function SchoolDashboard({
  classes,
  staff,
  studentsCount,
}: DashboardProps) {
  const { user } = useAuth();
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">
          {user?.school}
          {"'"}s Dashboard {"("}
          {user?.roles}
          {")"}
        </h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/classes">
              <Plus className="mr-2" /> Add Class
            </Link>
          </Button>
          <Button asChild>
            <Link href="/staff">
              <Plus className="mr-2" /> Add Staff
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Total Classes</CardTitle>
            <BookOpen />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{classes?.length}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Total Staff</CardTitle>
            <Users />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{staff?.length}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Total Students</CardTitle>
            <Calendar />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{studentsCount}</span>
          </CardContent>
        </Card>
      </div>

      {/* Optional: Add Charts here for performance stats */}
      {/* <div>Charts Placeholder</div> */}
    </div>
  );
}
