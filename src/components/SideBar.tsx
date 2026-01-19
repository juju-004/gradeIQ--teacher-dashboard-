"use client";

import {
  Users,
  Settings,
  FileText,
  User2,
  LogOut,
  LucideProps,
  Clipboard,
  BookOpen,
  BarChart3,
  FileCheck,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import Link from "next/link";
import { useAuth } from "@/context/Auth";
import { logout } from "@/server/actions";
import { ForwardRefExoticComponent, RefAttributes, useState } from "react";
import { usePathname } from "next/navigation";
import FormClassSelector from "@/components/FormClassSelector";
import { WorkspaceSelector } from "@/components/WorkSpaceSelector";

type MenuItem = {
  title: string;
  url: string;
  suburl?: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

// Role-based tabs
const roleTabs: Record<string, Array<MenuItem>> = {
  admin: [
    { title: "Manage Staff", url: "/", icon: Users },
    { title: "Manage Classes", url: "/classes", icon: Clipboard },
    { title: "School Settings", url: "/settings", icon: Settings },
  ],
  formteacher: [
    { title: "My Class", url: "/my-class", icon: Users },
    { title: "Subjects & Teachers", url: "/subjects-teachers", icon: BookOpen },
    { title: "Class Results", url: "/class-results", icon: FileText },
  ],
  teacher: [
    { title: "My Students", url: "/my-students", icon: Users },
    { title: "Upload & Mark", url: "/assessment", icon: FileCheck },
    { title: "Library", url: "/library", icon: BarChart3 },
    { title: "Settings", url: "/settings", icon: Settings },
  ],
};

const ASidebar = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  const [text, setText] = useState("Log Out");

  const menuByRole: Record<string, MenuItem[]> = {};

  if (user?.roles) {
    user.roles.forEach((role) => {
      const crole = role.split(" ").join("").toLowerCase();

      if (roleTabs[crole]) {
        menuByRole[role] = roleTabs[crole];
      }
    });
  }

  return (
    <Sidebar
      collapsible="icon"
      className="!rounded-r-[10%] w-48 relative sm:w-44 md:w-56 shadow-lg border-r border-neutral-200 dark:border-neutral-800"
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
        <SidebarGroup className="dark:bg-black/30 pb-24 bg-c4 flex-1 rounded-t-3xl">
          <SidebarGroupContent>
            <SidebarMenu>
              {Object.entries(menuByRole).map(([role, items]) => (
                <div key={role}>
                  {/* Role Label */}
                  <div className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
                    {role}
                  </div>

                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        onClick={toggleSidebar}
                        className={`px-2 h-11 ${
                          item.url === pathname ? "bg-white/5" : ""
                        }`}
                      >
                        <Link
                          className="flex items-center gap-3"
                          href={item.url}
                        >
                          <item.icon
                            size={20}
                            className={item.url === pathname ? "text-c1" : ""}
                          />
                          <span className="text-sm">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </div>
              ))}

              {/* Logout */}
              <form onSubmit={() => setText("Logging Out...")} action={logout}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="active:opacity-70 h-11 duration-150 px-2 py-1"
                    disabled={text === "Logging Out..."}
                  >
                    <button className="flex items-center gap-3 text-destructive">
                      <LogOut size={20} />
                      <span className="text-sm">{text}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </form>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="absolute from-transparent to-c4 bg-gradient-to-b bottom-0 fx left-0 w-full">
        <div className="sm:hidden bg-muted shadow px-3 py-3 mb-2 rounded-3xl w-[90%] flex gap-1 flex-col">
          {user?.roles.includes("form teacher") && <FormClassSelector />}
          {user?.roles.includes("teacher") && <WorkspaceSelector />}
        </div>
      </div>
    </Sidebar>
  );
};

export default ASidebar;
