"use client";
// import SchoolDashboard from "@/app/(dashboard)/(admin)/_components/SchoolDashboard";
import { useAuth } from "@/context/Auth";
// import { useDashboardData } from "@/hooks/useDashboard";

export default function DashboardPage() {
  // const { user } = useAuth();
  // const { data, error, isLoading } = useDashboardData(user?.roles);

  // if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Error loading dashboard</p>;

  // return (
  //   <SchoolDashboard
  //     classes={data.classes[0].list}
  //     staff={data.staff}
  //     studentsCount={data.studentsCount}
  //   />
  // );

  return <>Home</>;
}
