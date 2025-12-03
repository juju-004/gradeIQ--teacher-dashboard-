"use client";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";

export function useDashboardData() {
  const { data, error, isLoading } = useSWR("/api/admin/dashboard", fetcher, {
    refreshInterval: 30000, // auto refresh every 30s (optional)
  });

  return {
    data,
    error,
    isLoading,
  };
}
