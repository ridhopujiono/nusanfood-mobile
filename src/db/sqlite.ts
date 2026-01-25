import SQLite, { SQLiteDatabase } from "react-native-sqlite-storage";

SQLite.DEBUG(false);
SQLite.enablePromise(true);

let db: SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabase({
    name: "app.db",
    location: "default",
  });

  // Use TEXT id because sometimes APIs return string IDs
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS foods (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      name_id TEXT,
      raw_json TEXT,
      updated_at INTEGER
    );
  `);

  await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_foods_name ON foods(name);`);
  await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_foods_name_id ON foods(name_id);`);

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT
    );
  `);

  return db;
}

export async function setMeta(key: string, value: string) {
  const db = await getDb();
  // Most compatible way
  await db.executeSql(`REPLACE INTO meta(key, value) VALUES(?, ?);`, [key, value]);
}

export async function getMeta(key: string): Promise<string | null> {
  const db = await getDb();
  const [res] = await db.executeSql(`SELECT value FROM meta WHERE key=? LIMIT 1`, [key]);
  if (res.rows.length === 0) return null;
  return res.rows.item(0).value as string;
}
