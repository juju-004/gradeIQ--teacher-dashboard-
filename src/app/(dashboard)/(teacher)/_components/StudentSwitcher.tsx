"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type Student = {
  id: string;
  name: string;
};

type Props = {
  students: Student[] | null;
  activeStudentId: string | null;
  onChange: (id: string) => void;
};

export function StudentSwitcher({
  students,
  activeStudentId,
  onChange,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const scroll = (direction: "left" | "right") => {
    const el = containerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth / 2;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1; // scroll-fast factor
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  if (!students) {
    return (
      <div className="flex space-x-2 py-2 max-w-xl mx-auto relative">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-24 rounded-md bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Left scroll button */}
      {/* {canScrollLeft && ( */}
      <Button
        size="sm"
        variant="secondary"
        className="absolute hover:text-c1 opacity-65 hover:opacity-100 left-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full fx z-10"
        onClick={() => scroll("left")}
      >
        <ChevronLeft />
      </Button>
      {/* )} */}

      {/* Scrollable container */}
      <div className="w-[90%] mx-auto relative">
        <div
          ref={containerRef}
          className={clsx(
            "flex gap-2 overflow-x-auto py-2 px-6 hide-scrollbar cursor-grab select-none",
            isDragging && "cursor-grabbing"
          )}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onTouchStart={(e) => onMouseDown(e as any)}
          onTouchMove={(e) => onMouseMove(e as any)}
          onTouchEnd={stopDrag}
        >
          {students.map((student) => {
            const isActive = student.id === activeStudentId;
            return (
              <Button
                key={student.id}
                role="tab"
                aria-selected={isActive}
                variant={isActive ? "secondary" : "outline"}
                onClick={() => onChange(student.id)}
                className={clsx(
                  "px-4 whitespace-nowrap",
                  isActive && "bg-c1 scale-105 hover:bg-c1/90 text-white"
                )}
              >
                {student.name}
              </Button>
            );
          })}
        </div>
        {/* Right fade */}
        <div className="absolute right-0 top-0 h-full w-12 pointer-events-none bg-gradient-to-l from-background to-transparent" />
        {/* Left fade */}
        <div className="absolute left-0 top-0 h-full w-12 pointer-events-none bg-gradient-to-r from-background to-transparent" />
      </div>

      {/* Right scroll button */}
      <Button
        size="sm"
        variant="secondary"
        className="absolute hover:text-c1 opacity-65 hover:opacity-100 right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full fx z-10"
        onClick={() => scroll("right")}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
