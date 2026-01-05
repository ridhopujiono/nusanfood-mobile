import { api } from "../api/client";
import { upsertFoods } from "../db/foodsRepo";
import { setMeta } from "../db/sqlite";

type ApiFood = {
  id: number;
  name: string;
  // anything else your API returns
};

type FoodsResponse = {
  data?: ApiFood[];      // common pattern
  items?: ApiFood[];     // alternate
  results?: ApiFood[];   // alternate
};

function pickArray(res: any): ApiFood[] {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.items)) return res.items;
  if (Array.isArray(res?.results)) return res.results;
  return [];
}

export async function fetchAndCacheFoodsOnce(options?: {
  maxPages?: number;
  perPage?: number;
  withNutrition?: boolean;
}) {
  const maxPages = options?.maxPages ?? 5;     // for testing
  const perPage = options?.perPage ?? 100;
  const withNutrition = options?.withNutrition ?? false;

  let totalInserted = 0;

  for (let page = 1; page <= maxPages; page++) {
    const res = await api.get<FoodsResponse | ApiFood[]>(
      `/foods?page=${page}&per_page=${perPage}&with_nutrition=${String(withNutrition)}`
    );

    const foods = pickArray(res);

    if (foods.length === 0) break;

    await upsertFoods(
        foods.map((f: any) => ({
            id: String(f.id),              // <--- IMPORTANT
            name: String(f.name ?? "").trim(),
            raw_json: JSON.stringify(f),
            updated_at: Date.now(),
        }))
    );


    totalInserted += foods.length;

    // If returned less than perPage, likely end
    if (foods.length < perPage) break;
  }

  await setMeta("foods_last_sync", String(Date.now()));
  return { totalInserted };
}
