// components/PasswordCell.tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordCellProps {
  value: string;
}

export function PasswordCell({ value }: PasswordCellProps) {
  const [show, setShow] = useState(false);

  const masked =
    value.length > 3
      ? value.slice(0, 3) + "*".repeat(value.length - 3)
      : "*".repeat(value.length);

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm">{show ? value : masked}</span>

      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        className="text-gray-500 hover:text-gray-700"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
