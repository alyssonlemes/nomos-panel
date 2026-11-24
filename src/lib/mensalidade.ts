export type SituacaoMensalidade = "sem_valor" | "paga" | "aberta" | "atrasada";

export type CompetenciaAtual = {
  iso: string;
  dia: number;
};

export function competenciaAtual(agora = new Date()): CompetenciaAtual {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(agora);
  const ano = partes.find((parte) => parte.type === "year")?.value ?? "1970";
  const mes = partes.find((parte) => parte.type === "month")?.value ?? "01";
  const dia = Number(partes.find((parte) => parte.type === "day")?.value ?? "1");
  return { iso: `${ano}-${mes}-01`, dia };
}

export function situacaoMensalidade(
  centavos: number | null | undefined,
  vencimento: number | null | undefined,
  pagoEm: Date | string | null | undefined,
  hoje = competenciaAtual().dia,
): SituacaoMensalidade {
  if (!centavos || centavos <= 0 || !vencimento) return "sem_valor";
  if (pagoEm) return "paga";
  if (hoje > vencimento) return "atrasada";
  return "aberta";
}

export function textoSituacao(situacao: SituacaoMensalidade) {
  if (situacao === "paga") return "Paga";
  if (situacao === "atrasada") return "Atrasada";
  if (situacao === "aberta") return "Em aberto";
  return "Sem valor";
}

export function classeSituacao(situacao: SituacaoMensalidade) {
  if (situacao === "paga") return "bg-emerald-50 text-emerald-800";
  if (situacao === "atrasada") return "bg-rose-50 text-danger";
  if (situacao === "aberta") return "bg-amber-50 text-amber-800";
  return "bg-paper text-muted";
}

export function reais(centavos: number | null | undefined) {
  if (centavos == null) return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(centavos / 100);
}

export function centavosParaCampo(centavos: number | null | undefined) {
  if (centavos == null) return "";
  return (centavos / 100).toFixed(2).replace(".", ",");
}

/** Vazio limpa a cobrança. Texto inválido devolve null. */
export function centavosDe(texto: string): number | null {
  const limpo = texto.trim().replace(/\s/g, "").replace(/^R\$/i, "");
  if (!limpo) return 0;
  const normalizado = limpo.includes(",") ? limpo.replace(/\./g, "").replace(",", ".") : limpo;
  if (!/^\d+(\.\d{1,2})?$/.test(normalizado)) return null;
  const valor = Number(normalizado);
  if (!Number.isFinite(valor) || valor > 1_000_000) return null;
  return Math.round(valor * 100);
}

export function mesPorExtenso(iso: string) {
  const [ano, mes] = iso.split("-").map(Number);
  if (!ano || !mes) return iso;
  const texto = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(ano, mes - 1, 1)),
  );
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
