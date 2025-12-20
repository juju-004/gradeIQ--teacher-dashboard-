"use client";

import {
  Home,
  Users,
  Settings,
  FileText,
  User2,
  LogOut,
  LucideProps,
  Clipboard,
  BookOpen,
  BarChart3,
  TrendingUp,
  Library,
  FileCheck,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Link from "next/link";
import { useAuth } from "@/context/Auth";
import { logout } from "@/server/actions";
import { ForwardRefExoticComponent, RefAttributes, useState } from "react";
import { usePathname } from "next/navigation";
import FormClassSelector from "@/components/FormClassSelector";

// Role-based tabs
const roleTabs: Record<
  string,
  Array<{
    title: string;
    url: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
  }>
> = {
  admin: [
    // { title: "Dashboard", url: "/", icon: Home },
    { title: "Manage Staff", url: "/staff", icon: Users },
    { title: "Manage Classes", url: "/classes", icon: Clipboard },
    { title: "School Settings", url: "/settings", icon: Settings },
  ],
  formteacher: [
    { title: "My Class", url: "/my-class", icon: Users },
    { title: "Subjects & Teachers", url: "/subjects-teachers", icon: BookOpen },
    { title: "Class Results", url: "/class-results", icon: FileText },
  ],
  teacher: [
    { title: "Overview", url: "/", icon: Home },
    { title: "My Students", url: "/my-students", icon: Users },
    { title: "Upload & Mark", url: "/assessments", icon: FileCheck },
    { title: "Library", url: "/library", icon: Library },
    { title: "Analytics", url: "/analytics", icon: TrendingUp },
    { title: "Reports", url: "/reports", icon: BarChart3 },
    { title: "Settings", url: "/settings", icon: Settings },
  ],
};

const ASidebar = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const [text, setText] = useState("Log Out");

  // Aggregate tabs based on roles
  const menuItems: Array<{
    title: string;
    url: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
  }> = [];
  if (user?.roles) {
    user.roles.forEach((role) => {
      const crole = role.split(" ").join("").toLowerCase();
      if (roleTabs[crole]) {
        roleTabs[crole].forEach((tab) => {
          // avoid duplicates
          if (!menuItems.find((i) => i.url === tab.url)) menuItems.push(tab);
        });
      }
    });
  }

  return (
    <Sidebar
      collapsible="icon"
      className="!rounded-r-[10%] w-48 sm:w-44 md:w-52 shadow-lg border-r border-neutral-200 dark:border-neutral-800"
    >
      <SidebarContent>
        {/* User Info */}
        <SidebarGroup className="mt-5">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="h-auto py-1 px-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 font-semibold text-base"
                >
                  <User2 size={25} className="text-c1" />
                  <span className="flex flex-col">
                    <span className="font-bold text-base">{user?.name}</span>
                    <span className="opacity-70 font-light text-sm">
                      {user?.roles.join(", ")}
                    </span>
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Application Menu */}
        <SidebarGroup className="dark:bg-black/30 bg-black/5 flex-1 rounded-t-3xl">
          <SidebarGroupLabel className="text-sm px-2 opacity-50">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`"px-2 py-1 ${
                      item.url === pathname ? " bg-white/5" : ""
                    }`}
                  >
                    <Link className="flex items-center gap-3 " href={item.url}>
                      <item.icon
                        className={`${item.url === pathname ? "text-c1" : ""}`}
                        size={20}
                      />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Logout */}
              <form onSubmit={() => setText("Logging Out...")} action={logout}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="active:opacity-70 duration-150 px-2 py-1"
                    asChild
                    disabled={text === "Logging Out..."}
                  >
                    <button className="flex items-center gap-3 text-destructive">
                      <LogOut size={20} />
                      <span>{text}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </form>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default ASidebar;
