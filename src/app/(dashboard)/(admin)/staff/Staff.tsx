"use client";

import useSWR from "swr";
import axios from "axios";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import fetcher from "@/lib/fetcher";
import { staffColumns } from "@/app/(dashboard)/(admin)/staff/columns";
import { DataTable } from "@/components/ui/data-table";
import StaffSheet from "@/app/(dashboard)/(admin)/_components/StaffSheet";
import { FAB } from "@/components/ui/floating-button";

export interface Staff {
  _id: string;
  name: string;
  email: string;
  roles: ("teacher" | "form teacher")[];
  school: string;
  schoolId: string;

  // Optional fields depending on whether teachers have them
  formClass?: string[];

  // Optional encrypted password object
  password?: string;
  passwordHash?: string;

  createdAt?: string;
  updatedAt?: string;
}

export default function StaffPage() {
  const { data, isLoading, mutate } = useSWR("/api/admin/staff", fetcher);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isPending, startTransition] = useTransition();

  const columns = useMemo(
    () =>
      staffColumns({
        onEdit: (staff) => {
          setSelectedStaff(staff);
          setOpen(true);
        },
      }),
    []
  );

  const handleDeleteSelected = (ids: any[]) => {
    let toReturn = false;

    startTransition(async () => {
      try {
        const { data } = await axios.delete("/api/admin/staff", {
          data: { ids },
        });

        toast.success(`${data?.deletedCount} staff member(s) deleted`);
        mutate();
        toReturn = true;
      } catch {
        toast.error("Failed to delete");
      }
    });

    return toReturn;
  };

  return (
    <div className="sm:p-6 p-3">
      <div className="flex justify-between items-center pr-4">
        <h1 className="text-2xl font-bold mb-6">Staff Management</h1>
        <FAB onClick={() => setOpen2(true)} />
      </div>
      {/* Staff Table */}
      <DataTable
        columns={columns}
        data={data?.staff ?? []}
        isLoading={isLoading}
        onDelete={handleDeleteSelected}
        isDeleting={isPending}
      />

      <StaffSheet
        open={open}
        refresh={mutate}
        onOpenChange={setOpen}
        close={() => setOpen(false)}
        staff={selectedStaff}
        isEdit
      />
      <StaffSheet
        open={open2}
        refresh={mutate}
        onOpenChange={setOpen2}
        close={() => setOpen2(false)}
      />
    </div>
  );
}
