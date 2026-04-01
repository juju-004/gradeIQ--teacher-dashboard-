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
import { loadingService } from "@/services/loading";

export function WorkspaceSelector() {
  const { workspace, setWorkspace, workspaces } = useWorkspace();

  const refreshPage = (value: string) => {
    const ws = workspaces.find((w) => w.value === value);
    if (ws) {
      setWorkspace(ws);
      localStorage.setItem("workspace", value);
      loadingService.show();

      window.location.reload();
    }
  };
  return (
    <>
      {workspace ? (
        <Select value={workspace?.value ?? ""} onValueChange={refreshPage}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Workspace" />
          </SelectTrigger>
          <SelectContent className="w-full">
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
