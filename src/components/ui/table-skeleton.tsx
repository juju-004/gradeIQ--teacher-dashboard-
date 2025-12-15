import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

type TableSkeletonProps = {
  rows?: number;
  columns: number;
  showCheckbox?: boolean;
  showActions?: boolean;
  rowHeight?: number;
};

export function TableSkeleton({
  rows = 5,
  columns,
  showCheckbox = false,
  showActions = false,
  rowHeight = 20,
}: TableSkeletonProps) {
  const totalColumns = columns + (showCheckbox ? 1 : 0) + (showActions ? 1 : 0);

  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: totalColumns }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton
                className="w-full rounded-md"
                style={{ height: rowHeight }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
