"use client";

import {
  ShieldAlert,
  User as UserIcon,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useAuth } from "@/context/Auth";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }
  const isTeacher = user.roles.includes("teacher");
  const isFormTeacher = user.roles.includes("form teacher");
  const isAdmin = user.roles.includes("admin");

  return (
    <div className="space-y-8 pb-6 max-w-4xl">
      {/* Profile */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <UserIcon className="h-5 w-5 text-c1" />
          <div>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Basic account information</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={user.name} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue={user.email} disabled />
          </div>

          {user.school && (
            <div className="grid gap-2">
              <Label>School</Label>
              <Input value={user.school} disabled />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Teacher – Grading Preferences */}
      {isTeacher && (
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <SlidersHorizontal className="h-5 w-5 text-c1" />
            <div>
              <CardTitle>Grading Preferences</CardTitle>
              <CardDescription>
                These settings apply to your assessments only
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label>Grading Format</Label>
              <Select defaultValue="percentage">
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="letter">Letter Grade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Pass Mark (%)</Label>
              <Input type="number" defaultValue={50} />
            </div>

            <div className="grid gap-2">
              <Label>Decimal Precision</Label>
              <Select defaultValue="1">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Teacher – Class Preferences */}
      {isFormTeacher && (
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <SlidersHorizontal className="h-5 w-5 text-c1" />
            <div>
              <CardTitle>Class Preferences</CardTitle>
              <CardDescription>
                Controls how class data is displayed
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label>Show Class Ranking</Label>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <Label>Auto-calculate Class Average</Label>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin – System Defaults */}
      {isAdmin && (
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-c1" />
            <div>
              <CardTitle>System Defaults</CardTitle>
              <CardDescription>
                Applies across the entire platform
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label>Default Pass Mark (%)</Label>
              <Input type="number" defaultValue={50} />
            </div>

            <div className="flex items-center justify-between">
              <Label>Allow Result Editing After Publish</Label>
              <Switch />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader className="flex flex-row items-center gap-3">
          <Trash2 className="h-5 w-5 text-destructive" />
          <div>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions. Proceed with caution.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="destructive" className="w-full">
            Reset Preferences
          </Button>
          <Button variant="destructive" className="w-full">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
