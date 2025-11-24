import type { Metadata } from "next";
// import AppSidebar from "@/components/AppSideBar";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { getSession } from "@/server/actions";
import { redirect } from "next/navigation";
import { AuthProvider } from "@/context/Auth";

export const metadata: Metadata = {
  title: "Grade IQ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (!session.id) {
    redirect("/login");
  }

  const { id, roles, name, email, assignedSubjects, formClass } = session;

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <AuthProvider
      initialUser={{ id, roles, name, email, assignedSubjects, formClass }}
    >
      <SidebarProvider defaultOpen={defaultOpen}>
        {/* <AppSidebar /> */}
        <main className="w-full">
          <Navbar />
          <div className="px-4">{children}</div>
        </main>
      </SidebarProvider>
    </AuthProvider>
  );
}
