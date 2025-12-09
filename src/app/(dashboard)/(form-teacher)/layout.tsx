import { getSession } from "@/server/actions";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (session?.roles.includes("form teacher")) {
    return <>{children}</>;
  } else redirect("/login");
}
