"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye } from "lucide-react";

export type MyStudent = {
  _id: string;
  name: string;
  sex: string;
  averageScore: number | null;
  assessmentCount: number;
};

type ColumnActions = {
  onView: (student: MyStudent) => void;
};

export const myStudentsColumns = (
  actions: ColumnActions
): ColumnDef<MyStudent>[] => [
  // Student name
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Student
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  // Sex
  {
    accessorKey: "sex",
    header: "Sex",
    cell: ({ row }) => (
      <span className="uppercase text-muted-foreground">
        {row.original.sex}
      </span>
    ),
  },

  // Assessments count
  {
    accessorKey: "assessmentCount",
    header: "Assessments",
    cell: ({ row }) => (
      <span className="text-center">{row.original.assessmentCount}</span>
    ),
  },

  // Average score
  {
    accessorKey: "averageScore",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Average
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const avg = row.original.averageScore;

      return avg === null ? (
        <span className="text-muted-foreground italic">No scores</span>
      ) : (
        <span className="font-medium">{avg}%</span>
      );
    },
  },

  // View action
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;

      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => actions.onView(student)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      );
    },
  },
];
