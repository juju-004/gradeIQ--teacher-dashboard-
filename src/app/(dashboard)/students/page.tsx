"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { getData } from "@/app/payments/page";
import { DataTable } from "@/app/payments/data-table";
import { columns, Payment } from "@/app/payments/columns";
// import { Dialog, DialogTrigger } from "@/components/ui/dialog";

export default function StudentsPage() {
  const [students, setStudents] = useState<{ name: string; sex: "M" | "F" }[]>([
    { name: "Michael Jordan", sex: "M" },
  ]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Payment[]>([]);
  useEffect(() => {
    const enju = async () => {
      const d = await getData();
      setData(d);
    };
    const loadStudents = async () => {
      try {
        const res = await axios.get("/api/students");
        setStudents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    enju();
    loadStudents();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Students</h1>

        {/* Button to open add student form */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-c1 text-white hover:bg-c1/80">
              <Plus className="w-4 h-4 mr-2" /> Add Student
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      <Separator className="mb-6" />

      {/* Loading State */}
      {loading && (
        <div className="grid gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {/* Empty State */}
      {!loading && students.length === 0 && (
        <Card className="p-6 text-center">
          <CardHeader>
            <h2 className="text-lg font-medium">No Students Found</h2>
          </CardHeader>

          <CardContent>
            <p className="text-neutral-500 mb-4">
              You haven’t added any students yet.
            </p>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-c1 text-white hover:bg-c1/80">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Student
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      )}

      {/* Students List */}
      {!loading && students.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">Student List</h2>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Sex</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {students.map((s, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="font-medium">{s.sex}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
      <DataTable columns={columns} data={data} />
    </div>
  );
}
