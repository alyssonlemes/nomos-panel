export function dataCurta(valor: Date | string | null | undefined) {
  if (!valor) return "—";
  const data = valor instanceof Date ? valor : new Date(valor);
  if (Number.isNaN(data.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(data);
}

export function quando(valor: Date | string | null | undefined) {
  if (!valor) return "—";
  const data = valor instanceof Date ? valor : new Date(valor);
  if (Number.isNaN(data.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(data);
}

export function documento(valor: string | null | undefined) {
  if (!valor) return "—";
  const digitos = valor.replace(/\D/g, "");
  if (digitos.length === 14) {
    return digitos.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  }
  if (digitos.length === 11) {
    return digitos.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  }
  return valor;
}

const PAPEIS: Record<string, string> = {
  admin: "Administrador",
  owner: "Proprietário",
  gestor: "Gestor",
  member: "Membro",
  viewer: "Visualizador",
  assistant: "Assistente",
};

export function papel(valor: string | null | undefined) {
  if (!valor) return "—";
  return PAPEIS[valor.toLowerCase()] ?? valor;
}

const CONVITES: Record<string, string> = {
  pending: "Pendente",
  accepted: "Aceito",
  rejected: "Recusado",
};

export function convite(valor: string | null | undefined) {
  if (!valor) return "—";
  return CONVITES[valor.toLowerCase()] ?? valor;
}

export function classeConvite(valor: string | null | undefined) {
  const chave = valor?.toLowerCase();
  if (chave === "accepted") return "bg-emerald-50 text-emerald-800";
  if (chave === "rejected") return "bg-rose-50 text-danger";
  return "bg-amber-50 text-amber-800";
}
