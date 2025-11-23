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
import { DataTable } from "@/app/payments/data-table";
import { columns, Payment } from "@/app/payments/columns";

export const getData = async (): Promise<Payment[]> => {
  return [
    {
      id: "728ed521",
      amount: 134,
      status: "pending",
      fullName: "John Doe",
      userId: "44",
      email: "johndoe@gmail.com",
    },
    {
      id: "728ed522",
      amount: 124,
      status: "success",
      fullName: "Jane Doe",
      userId: "35",
      email: "janedoe@gmail.com",
    },
    {
      id: "728ed523",
      amount: 167,
      status: "success",
      fullName: "Mike Galloway",
      userId: "11",
      email: "mikegalloway@gmail.com",
    },
    {
      id: "728ed524",
      amount: 156,
      status: "failed",
      fullName: "Minerva Robinson",
      userId: "20",
      email: "minerbarobinson@gmail.com",
    },
    {
      id: "728ed525",
      amount: 145,
      status: "success",
      fullName: "Mable Clayton",
      userId: "21",
      email: "mableclayton@gmail.com",
    },
    {
      id: "728ed526",
      amount: 189,
      status: "pending",
      fullName: "Nathan McDaniel",
      userId: "64",
      email: "nathanmcdaniel@gmail.com",
    },
    {
      id: "728ed527",
      amount: 178,
      status: "success",
      fullName: "Myrtie Lamb",
      userId: "18",
      email: "myrtielamb@gmail.com",
    },
    {
      id: "728ed528",
      amount: 190,
      status: "success",
      fullName: "Leona Bryant",
      userId: "59",
      email: "leonabryant@gmail.com",
    },
    {
      id: "728ed529",
      amount: 134,
      status: "failed",
      fullName: "Aaron Willis",
      userId: "69",
      email: "aaronwillis@gmail.com",
    },
    {
      id: "728ed52a",
      amount: 543,
      status: "success",
      fullName: "Joel Keller",
      userId: "18",
      email: "joelkeller@gmail.com",
    },
    {
      id: "728ed52b",
      amount: 234,
      status: "pending",
      fullName: "Daniel Ellis",
      userId: "88",
      email: "danielellis@gmail.com",
    },
    {
      id: "728ed52c",
      amount: 345,
      status: "success",
      fullName: "Gordon Kennedy",
      userId: "80",
      email: "gordonkennedy@gmail.com",
    },
    {
      id: "728ed52d",
      amount: 335,
      status: "failed",
      fullName: "Emily Hoffman",
      userId: "24",
      email: "emilyhoffman@gmail.com",
    },
    {
      id: "728ed52e",
      amount: 664,
      status: "pending",
      fullName: "Jeffery Garrett",
      userId: "38",
      email: "jefferygarrett@gmail.com",
    },
    {
      id: "728ed52f",
      amount: 332,
      status: "success",
      fullName: "Ralph Baker",
      userId: "82",
      email: "ralphbaker@gmail.com",
    },
    {
      id: "728ed52g",
      amount: 413,
      status: "failed",
      fullName: "Seth Fields",
      userId: "54",
      email: "sethfields@gmail.com",
    },
    {
      id: "728ed52h",
      amount: 345,
      status: "pending",
      fullName: "Julia Webb",
      userId: "24",
      email: "juliawebb@gmail.com",
    },
    {
      id: "728ed52i",
      amount: 754,
      status: "success",
      fullName: "Gary Banks",
      userId: "41",
      email: "garybanks@gmail.com",
    },
    {
      id: "728ed52j",
      amount: 643,
      status: "failed",
      fullName: "Flora Chambers",
      userId: "68",
      email: "florachambers@gmail.com",
    },
    {
      id: "728ed52k",
      amount: 543,
      status: "pending",
      fullName: "Steve Hanson",
      userId: "33",
      email: "stevehanson@gmail.com",
    },
    {
      id: "728ed52l",
      amount: 324,
      status: "success",
      fullName: "Lola Robinson",
      userId: "18",
      email: "lolarobinson@gmail.com",
    },
    {
      id: "728ed52m",
      amount: 123,
      status: "pending",
      fullName: "Ethel Waters",
      userId: "34",
      email: "ethelwaters@gmail.com",
    },
    {
      id: "728ed52n",
      amount: 422,
      status: "failed",
      fullName: "Grace Edwards",
      userId: "67",
      email: "graceedwards@gmail.com",
    },
    {
      id: "728ed52o",
      amount: 712,
      status: "success",
      fullName: "Sallie Wong",
      userId: "79",
      email: "salliewong@gmail.com",
    },
    {
      id: "728ed52p",
      amount: 360,
      status: "success",
      fullName: "Bryan Gutierrez",
      userId: "59",
      email: "bryangutierrez@gmail.com",
    },
    {
      id: "728ed52q",
      amount: 454,
      status: "pending",
      fullName: "Erik Rice",
      userId: "17",
      email: "erikrice@gmail.com",
    },
    {
      id: "728ed52r",
      amount: 382,
      status: "success",
      fullName: "Jordan Atkins",
      userId: "74",
      email: "jordanatkins@gmail.com",
    },
    {
      id: "728ed52s",
      amount: 328,
      status: "failed",
      fullName: "Bill Brewer",
      userId: "98",
      email: "billbrewer@gmail.com",
    },
    {
      id: "728ed52t",
      amount: 250,
      status: "success",
      fullName: "Edwin Morris",
      userId: "87",
      email: "edwinmorris@gmail.com",
    },
    {
      id: "728ed52u",
      amount: 658,
      status: "success",
      fullName: "Harold Becker",
      userId: "61",
      email: "haroldbecker@gmail.com",
    },
    {
      id: "728ed52v",
      amount: 691,
      status: "success",
      fullName: "Hannah Rodriguez",
      userId: "77",
      email: "hannahrodriguez@gmail.com",
    },
    {
      id: "728ed52w",
      amount: 969,
      status: "success",
      fullName: "Zachary Beck",
      userId: "83",
      email: "zacharybeck@gmail.com",
    },
    {
      id: "728ed52x",
      amount: 617,
      status: "failed",
      fullName: "Frances Potter",
      userId: "68",
      email: "francespotter@gmail.com",
    },
    {
      id: "728ed52y",
      amount: 173,
      status: "success",
      fullName: "Raymond Murray",
      userId: "55",
      email: "raymondmurray@gmail.com",
    },
    {
      id: "728ed52z",
      amount: 843,
      status: "success",
      fullName: "Adam Sherman",
      userId: "32",
      email: "adamsherman@gmail.com",
    },
    {
      id: "728ed521f",
      amount: 914,
      status: "pending",
      fullName: "Anne Cruz",
      userId: "19",
      email: "annecruz@gmail.com",
    },
  ];
};

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
