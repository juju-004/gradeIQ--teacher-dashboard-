// components/RoleProviders.tsx
"use client";

import { ReactNode } from "react";
import { useAuth, User } from "@/context/Auth";
import { FormClassProvider } from "@/context/FormClass";
import { WorkspaceProvider } from "@/context/Workspace";

export default function RoleProviders({
  children,
  roles,
}: {
  children: ReactNode;
  roles: User["roles"];
}) {
  if (roles.includes("form teacher") && roles.includes("teacher")) {
    return (
      <FormClassProvider>
        <WorkspaceProvider>{children}</WorkspaceProvider>
      </FormClassProvider>
    );
  } else if (roles.includes("form teacher")) {
    return <FormClassProvider>{children}</FormClassProvider>;
  } else if (roles.includes("teacher")) {
    return <WorkspaceProvider>{children}</WorkspaceProvider>;
  }

  return children;
}
