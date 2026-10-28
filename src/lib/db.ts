import { Pool, type QueryResultRow } from "pg";

import { ambiente } from "@/lib/ambiente";

const globalPool = globalThis as unknown as { nomosPanelPool?: Pool };

function pool() {
  if (!globalPool.nomosPanelPool) {
    const bruto = ambiente().databaseUrl;
    const url = new URL(bruto);
    const sslmode = url.searchParams.get("sslmode");
    url.searchParams.delete("sslmode");
    const precisaSsl =
      sslmode === "require" ||
      sslmode === "verify-full" ||
      sslmode === "verify-ca" ||
      bruto.includes("neon.tech");

    globalPool.nomosPanelPool = new Pool({
      connectionString: url.toString(),
      ssl: precisaSsl ? { rejectUnauthorized: false } : false,
      max: 5,
    });
  }
  return globalPool.nomosPanelPool;
}

export async function consultar<T extends QueryResultRow>(texto: string, valores: unknown[] = []) {
  const resultado = await pool().query<T>(texto, valores);
  return resultado.rows;
}
