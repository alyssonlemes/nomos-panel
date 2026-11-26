/** Espelha nomos-api/app/domain/planos.py. A landing não usa esta lista. */
export const PLANOS = [
  { codigo: "essencial", nome: "Essencial", usuarios: 3, processos: 50, precoCentavos: 30000 },
  { codigo: "profissional", nome: "Profissional", usuarios: 10, processos: 200, precoCentavos: 60000 },
  { codigo: "escritorio", nome: "Escritório", usuarios: 30, processos: 500, precoCentavos: 150000 },
] as const;

export type CodigoPlano = (typeof PLANOS)[number]["codigo"];

export function planoPorCodigo(codigo: string | null | undefined) {
  return PLANOS.find((item) => item.codigo === codigo) ?? PLANOS[0];
}
