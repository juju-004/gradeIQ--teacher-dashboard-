"use client";

import StaffPage from "@/app/(dashboard)/(admin)/staff/Staff";
import StudentsPage from "@/app/(dashboard)/(form-teacher)/my-class/myClass";
import StudentsAverageTable from "@/app/(dashboard)/(teacher)/my-students/my-students";
import { useAuth } from "@/context/Auth";

export default function HomePage() {
  const { user } = useAuth();

  if (user?.roles.includes("admin")) {
    return <StaffPage />;
  } else if (user?.roles.includes("form teacher")) {
    return <StudentsPage />;
  } else if (user?.roles.includes("teacher")) {
    return <StudentsAverageTable />;
  } else return <></>;
}
