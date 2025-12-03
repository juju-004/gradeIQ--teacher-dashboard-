"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
            <Link href="/add-class">
              <Plus className="mr-2" /> Add Class
            </Link>
          </Button>
          <Button asChild>
            <Link href="/add-staff">
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

      {/* Classes Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Classes</h2>
        <ScrollArea className="h-48 border rounded-md p-2">
          {classes.map((cls, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center py-1 px-2 border-b last:border-b-0"
            >
              <span className="font-medium">{cls}</span>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
          ))}
          {classes?.length === 0 && (
            <p className="text-center text-sm text-neutral-500 mt-2">
              No classes added yet.
            </p>
          )}
        </ScrollArea>
      </div>

      {/* Staff Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Staff Members</h2>
        <ScrollArea className="h-48 border rounded-md p-2">
          {staff.map((member, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center py-1 px-2 border-b last:border-b-0"
            >
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm opacity-70">
                  {member.email} | {member.roles.join(", ")}
                  {member.subject && ` | Subject: ${member.subject}`}
                  {member.formClass && ` | Form Class: ${member.formClass}`}
                </p>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
          ))}
          {staff?.length === 0 && (
            <p className="text-center text-sm text-neutral-500 mt-2">
              No staff added yet.
            </p>
          )}
        </ScrollArea>
      </div>

      {/* Optional: Add Charts here for performance stats */}
      {/* <div>Charts Placeholder</div> */}
    </div>
  );
}
