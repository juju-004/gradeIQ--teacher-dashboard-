import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shuffle } from "lucide-react";

function getInitials(schoolName: string) {
  if (!schoolName) return "";
  return schoolName
    .split(" ")
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function generatePassword(schoolName: string) {
  const initials = getInitials(schoolName);
  const digits = Math.floor(100000 + Math.random() * 9000000); // returns 6 or 7 digits
  return `${initials}-${digits}`;
}

export function PasswordGeneratorField({ schoolName }: { schoolName: string }) {
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (schoolName) {
      setPassword(generatePassword(schoolName));
    }
  }, [schoolName]);

  const shufflePassword = () => {
    setPassword(generatePassword(schoolName));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Password</label>

      <div className="flex items-center gap-2 mt-1">
        <Input
          value={password}
          name="password"
          readOnly
          className="font-mono"
        />

        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={shufflePassword}
        >
          <Shuffle className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Auto-generated from school initials + 6–7 unique digits
      </p>
    </div>
  );
}
