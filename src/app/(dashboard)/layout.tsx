import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { getSession } from "@/server/actions";
import { redirect } from "next/navigation";
import { AuthProvider } from "@/context/Auth";
import ASidebar from "@/components/SideBar";
import { FormClassProvider } from "@/context/FormClass";
// import { WorkspaceProvider } from "@/context/Workspace";

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

  const { id, roles, name, email, formClass, schoolName } = session;

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <AuthProvider
      initialUser={{
        id,
        roles,
        name,
        email,
        formClass,
        school: schoolName,
      }}
    >
      <FormClassProvider init={formClass ? formClass[0] : null}>
        {/* <WorkspaceProvider> */}
        <SidebarProvider defaultOpen={defaultOpen}>
          <ASidebar />
          <main className="w-full">
            <Navbar />
            <div className="px-4">{children}</div>
          </main>
        </SidebarProvider>
        {/* </WorkspaceProvider> */}
      </FormClassProvider>
    </AuthProvider>
  );
}
