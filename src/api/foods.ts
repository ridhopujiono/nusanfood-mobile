import { api } from "./client";

export function buildFoodsUrl(params: { page: number; per_page: number; with_nutrition: boolean }) {
  const qs =
    `page=${encodeURIComponent(params.page)}` +
    `&per_page=${encodeURIComponent(params.per_page)}` +
    `&with_nutrition=${encodeURIComponent(String(params.with_nutrition))}`;

  return `/api/foods?${qs}`;
}
