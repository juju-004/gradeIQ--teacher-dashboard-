"use client";
import SchoolDashboard from "@/app/(dashboard)/(admin)/_components/SchoolDashboard";
import { useDashboardData } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { data, error, isLoading } = useDashboardData();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading dashboard</p>;

  return (
    <SchoolDashboard
      classes={data.classes[0].list}
      staff={data.staff}
      studentsCount={data.studentsCount}
    />
  );
}
