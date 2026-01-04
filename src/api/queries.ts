import { useQuery } from "@tanstack/react-query";
import { api } from "./client";

export function useFoodsList() {
  return useQuery({
    queryKey: ["foods", 1, 100, true],
    queryFn: () =>
      api.get<any>(`/foods?page=1&per_page=100&with_nutrition=true`),
    staleTime: 5 * 60 * 1000,
  });
}
