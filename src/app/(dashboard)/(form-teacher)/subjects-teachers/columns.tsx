"use client";

import { SubjectWithTeachers } from "@/app/(dashboard)/(form-teacher)/subjects-teachers/page";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit2 } from "lucide-react";

type ColumnActions = {
  onEdit: (student: SubjectWithTeachers) => void;
};

export const subjectColumns = (
  actions: ColumnActions,
): ColumnDef<SubjectWithTeachers>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
      />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Subject
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <span className="ml-3">{row.original.name}</span>,
  },
  {
    id: "teachers",
    header: "Teachers",
    cell: ({ row }) => {
      const teachers = row.original.teachers;

      return (
        <span className="text-sm">
          {teachers.length === 0
            ? "No teacher assigned"
            : teachers.map((t) => t.name).join(", ")}
        </span>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const staff = row.original;

      return (
        <Button
          onClick={() => actions.onEdit(staff)}
          variant="ghost"
          className="h-8 w-8 p-0"
        >
          <span className="sr-only">Open Edit menu</span>
          <Edit2 className="h-4 w-4" />
        </Button>
      );
    },
  },
];
