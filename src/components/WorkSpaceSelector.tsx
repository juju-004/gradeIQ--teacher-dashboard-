"use client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/context/Workspace";

export function WorkspaceSelector() {
  const { workspace, setWorkspace, workspaces } = useWorkspace();

  return (
    <>
      {workspace ? (
        <Select
          value={workspace?.value ?? ""}
          onValueChange={(val) => {
            const ws = workspaces.find((w) => w.value === val);
            if (ws) setWorkspace(ws);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Workspace" />
          </SelectTrigger>
          <SelectContent>
            {workspaces.map((ws) => (
              <SelectItem key={ws.value} value={ws.value}>
                {ws.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Skeleton className="h-9 w-32" />
      )}
    </>
  );
}
