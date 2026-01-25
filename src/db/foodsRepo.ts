import { getDb } from "./sqlite";

export type FoodRow = {
  id: string;
  name: string;
  name_id?: string | null;
  raw_json?: string | null;
  updated_at?: number | null;
};

export async function upsertFoods(rows: FoodRow[]) {
  if (rows.length === 0) return;

  const db = await getDb();

  // IMPORTANT: do NOT use async function inside transaction with this library
  await db.transaction((tx) => {
    for (const r of rows) {
      tx.executeSql(
        `INSERT OR REPLACE INTO foods (id, name, name_id, raw_json, updated_at)
         VALUES (?, ?, ?, ?, ?);`,
        [r.id, r.name, r?.name_id ?? null, r.raw_json ?? null, r.updated_at ?? null]
      );
    }
  });
}

export async function countFoods(): Promise<number> {
  const db = await getDb();
  const [res] = await db.executeSql(`SELECT COUNT(*) as c FROM foods;`);
  return res.rows.item(0).c as number;
}

export async function searchFoodsByPrefix(query: string, limit = 20) {
  const db = await getDb();
  const q = query.trim().toLowerCase();
  if (q.length === 0) return [];

  const [res] = await db.executeSql(
    `SELECT id, name, name_id, raw_json, updated_at
     FROM foods
     WHERE LOWER(name_id) LIKE ?
     ORDER BY name ASC
     LIMIT ?;`,
    [`${q}%`, limit]
  );

  const out: any[] = [];
  for (let i = 0; i < res.rows.length; i++) out.push(res.rows.item(i));
  return out;
}
