"use client";

import WelcomeAdminPage from "@/app/(dashboard)/(admin)/_components/AdminWelcome";
import { useAuth } from "@/context/Auth";
import { useRouter } from "next/navigation";

const Homepage = () => {
  const router = useRouter();
  const { user } = useAuth();
  if (user?.roles.includes("admin")) {
    return <WelcomeAdminPage></WelcomeAdminPage>;
  } else router.push("/");
};

export default Homepage;
