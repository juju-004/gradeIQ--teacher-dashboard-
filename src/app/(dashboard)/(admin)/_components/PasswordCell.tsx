// components/PasswordCell.tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy } from "lucide-react";
import { toast } from "sonner"; // optional: for feedback

interface PasswordCellProps {
  value: string;
}

export function PasswordCell({ value }: PasswordCellProps) {
  const [show, setShow] = useState(false);

  const masked =
    value.length > 3
      ? value.slice(0, 3) + "*".repeat(value.length - 3)
      : "*".repeat(value.length);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Password copied"); // optional feedback
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm">{show ? value : masked}</span>

      {/* Toggle visibility */}
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        onBlur={() => setShow(false)}
        className="text-gray-500 hover:text-gray-700"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>

      {/* Copy button */}
      <button
        type="button"
        onClick={copyToClipboard}
        className="text-gray-500 hover:text-gray-700"
      >
        <Copy size={16} />
      </button>
    </div>
  );
}
