import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  count?: number; // number of questions
  className?: string;
};

export function AnswerKeySkeleton({ count = 20, className }: Props) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-22 rounded-md" />
      ))}
    </div>
  );
}
