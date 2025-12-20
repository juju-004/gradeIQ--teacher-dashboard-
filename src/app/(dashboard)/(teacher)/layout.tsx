import { WorkspaceProvider } from "@/context/Workspace";
import { getSession } from "@/server/actions";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (session?.roles.includes("teacher")) {
    return <WorkspaceProvider>{children}</WorkspaceProvider>;
  } else redirect("/login");
}
