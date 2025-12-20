"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface Workspace {
  value: string; // e.g., "JSS 1A - Mathematics"
  classId: string;
  subjectId: string;
}

interface WorkspaceContextType {
  workspace: Workspace | null;
  setWorkspace: (ws: Workspace) => void;
  workspaces: Workspace[];
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);

  // Fetch all available workspaces for the teacher
  useEffect(() => {
    axios.get("/api/teacher/assignments").then(({ data }) => {
      setWorkspaces(data);
      if (data.length > 0) setWorkspace(data[0]);
    });
  }, []);

  return (
    <WorkspaceContext.Provider value={{ workspace, setWorkspace, workspaces }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

// Hook to use workspace anywhere
export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context)
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  return context;
}
