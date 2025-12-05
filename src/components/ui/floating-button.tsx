"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FAB({
  onClick,
  className,
  text = "Add New",
}: {
  onClick?: () => void;
  className?: string;
  text?: string;
}) {
  const [expanded, setExpanded] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      // Scroll Down → contract
      if (currentY > lastScrollY && currentY > 20) {
        setExpanded(false);
      }
      // Scroll Up → expand
      else {
        setExpanded(true);
      }

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* MOBILE FAB */}
      <Button
        onClick={onClick}
        className={`
          fixed bottom-5 right-5 z-50 shadow-lg 
          transition-all duration-300
          md:hidden  
          ${expanded ? "px-4 w-auto" : "px-0 w-12"}
          ${expanded ? "rounded-full" : "rounded-full"}
          h-12 flex items-center gap-2
        `}
      >
        <Plus className="h-5 w-5" />

        {/* Label fades out when contracted */}
        <span
          className={`overflow-hidden pr-3 transition-all duration-200 ${
            expanded ? "opacity-100 w-auto" : "opacity-0 w-0"
          }`}
        >
          {text}
        </span>
      </Button>

      {/* DESKTOP NORMAL BUTTON */}
      <Button
        onClick={onClick}
        className={`hidden md:flex pr-3 items-center gap-2 ${className}`}
      >
        <Plus className="h-5 w-5" />
        {text}
      </Button>
    </>
  );
}
