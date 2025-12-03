"use client";

import useSWR from "swr";
import axios from "axios";
import { useState, useTransition } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import fetcher from "@/lib/fetcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Loader2, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FAB } from "@/components/ui/floating-button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import AddProduct from "@/components/AddProduct";
import StaffSheet from "@/app/(dashboard)/(admin)/_components/StaffSheet";
import { PasswordCell } from "@/app/(dashboard)/(admin)/_components/PasswordCell";
import { filterError } from "@/server/lib";

export default function StaffPage() {
  const { data, isLoading, mutate } = useSWR("/api/admin/staff", fetcher);
  const [isDeleting, startTransition] = useTransition();

  const onEdit = (staff: any) => {
    // open modal or sheet
    console.log("Edit staff:", staff);
  };

  const onDelete = async (id: string) => {
    startTransition(async () => {
      try {
        console.log(id);

        await axios.delete(`/api/admin/staff/${id}`);
        toast.success("Deleted");
        mutate(); // refresh the table
      } catch (error: unknown) {
        toast.error(filterError(error));
      }
    });
  };

  return (
    <div className="sm:p-6 p-3">
      <h1 className="text-2xl font-bold mb-6">Staff Management</h1>

      {/* <div className="mb-4 flex gap-4">
        <Button onClick={() => document.getElementById("excel-input")?.click()}>
          Upload Excel
        </Button>

        <input
          type="file"
          id="excel-input"
          className="hidden"
          accept=".xlsx,.xls"
          onChange={handleUpload}
        />
      </div> */}

      {/* Staff Table */}

      <div className="border rounded-lg p-2 shadow-sm bg-white dark:bg-neutral-900">
        <Table>
          <TableHeader>
            <TableRow className="opacity-60">
              <TableHead></TableHead>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Form Class</TableHead>
              <TableHead>Password</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6}>Loading...</TableCell>
              </TableRow>
            )}

            {data?.staff?.map((staff: any, idx: number) => (
              <TableRow
                key={staff._id}
                className={"even:bg-muted/80 rounded-lg"}
              >
                <TableCell>
                  <div className="hidden sm:flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(staff)}
                    >
                      <Edit />
                    </Button>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive"
                        >
                          <Trash2 />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-72">
                        <p className="font-medium">Confirm Delete?</p>
                        <p className="text-sm text-muted-foreground mb-3">
                          This cannot be undone.
                        </p>

                        <div className="flex justify-end space-x-2">
                          <Button size="sm" variant="destructive">
                            Delete
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Mobile Dropdown */}
                  <div className="sm:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          ⋮
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(staff)}>
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onDelete(staff._id)}
                          disabled={isDeleting}
                          className="text-destructive"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
                <TableCell className="text-c1 font-medium">
                  #{idx + 1}
                </TableCell>
                <TableCell className="font-medium">{staff.name}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>{staff.roles.join(", ")}</TableCell>
                <TableCell>
                  {staff.assignedSubjects?.join(", ") || "-"}
                </TableCell>
                <TableCell>{staff.formClass || "-"}</TableCell>
                <TableCell>
                  {staff.password ? (
                    <PasswordCell value={staff.password} />
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <FAB />
        </SheetTrigger>
        <StaffSheet refresh={() => mutate()} title="Add New Staff Member" />
      </Sheet>
    </div>
  );
}
