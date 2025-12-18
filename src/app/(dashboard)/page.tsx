"use client";

import { useAuth } from "@/context/Auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// import SchoolDashboard from "@/app/(dashboard)/(admin)/_components/SchoolDashboard";
// import { useAuth } from "@/context/Auth";
// import { useDashboardData } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
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

  useEffect(() => {
    if (user?.roles.includes("admin")) {
      router.replace("/staff");
    } else if (user?.roles.includes("form teacher")) {
      router.replace("/my-class");
    }
  }, []);

  return <>Home</>;
}
