"use client";

import { PasswordCell } from "@/app/(dashboard)/(admin)/_components/PasswordCell";
import StaffSheet from "@/app/(dashboard)/(admin)/_components/StaffSheet";
import { Staff } from "@/app/(dashboard)/(admin)/staff/page";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit2, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ColumnActions = {
  onEdit: (staff: Staff) => void;
};

export const staffColumns = (actions: ColumnActions): ColumnDef<Staff>[] => [
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
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    header: "Roles",
    cell: ({ row }) => {
      return row.original.roles.join(", ");
    },
  },
  {
    header: "Form Class(es)",
    cell: ({ row }) => {
      const staff = row.original;
      return staff.formClass ? staff.formClass.join(", ") : "-";
    },
  },
  {
    header: "Password",
    cell: ({ row }) => {
      const staff = row.original;
      return staff.password ? <PasswordCell value={staff.password} /> : "-";
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
