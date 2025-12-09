import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      richColors
      toastOptions={{
        classNames: {
          success: "text-green-600",
          error: "text-red-600",
          warning: "text-yellow-500 ",
          info: "text-blue-600",
          toast: "bg-background text-foreground border border-border shadow-lg",
          description: "text-muted-foreground",
        },
      }}
    />
  );
}
