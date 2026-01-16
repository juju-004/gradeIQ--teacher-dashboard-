"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type Results = {
  _id: string;
  studentId: { name: string };
  score: string;
  answers: string[];
  percentage: string;
};

type ColumnActions = {
  onView: (student: Results) => void;
};

export const resultsColumns = (
  actions: ColumnActions
): ColumnDef<Results>[] => [
  // Student name
  {
    accessorFn: (row) => row.studentId.name,
    id: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium ml-3">{row.original.studentId.name}</span>
    ),
  },

  {
    accessorKey: "score",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
      >
        Score
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium ml-3">
        {row.original.score}{" "}
        <span className="opacity-60">/ {row.original.answers.length}</span>
      </span>
    ),
  },
  {
    accessorKey: "percentage",
    header: "Percentage",
    cell: ({ row }) => (
      <span className="text-center text-c1 font-bold">
        {row.original.percentage}%
      </span>
    ),
  },
  {
    accessorKey: "attempted",
    header: "Attempted",
    cell: ({ row }) => (
      <span className="text-center font-medium">
        {row.original.answers.filter((answer) => answer !== "-").length}{" "}
        <span className="opacity-60">/ {row.original.answers.length}</span>
      </span>
    ),
  },

  // View action
  {
    id: "actions",
    size: 50,
    cell: ({ row }) => {
      const student = row.original;

      return (
        <Button variant="outline" onClick={() => actions.onView(student)}>
          View full result
        </Button>
      );
    },
  },
];
