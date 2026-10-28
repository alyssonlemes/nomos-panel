function exigir(nome: string): string {
  const valor = process.env[nome]?.trim();
  if (!valor) throw new Error(`Defina ${nome} no .env do nomos-panel.`);
  return valor;
}

export function ambiente() {
  return {
    databaseUrl: exigir("DATABASE_URL"),
    panelEmail: exigir("PANEL_EMAIL").toLowerCase(),
    panelPassword: exigir("PANEL_PASSWORD"),
    panelSecret: exigir("PANEL_SECRET"),
    appUrl: (process.env.APP_URL?.trim() || "http://localhost:3000").replace(/\/$/, ""),
  };
}
