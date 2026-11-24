import type { ReactNode } from "react";

export function Cabecalho({ grupo, titulo, texto }: { grupo: string; titulo: string; texto: string }) {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">{grupo}</p>
      <h1 className="mt-1 text-3xl font-semibold">{titulo}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">{texto}</p>
    </>
  );
}

export function SeloAtivo({ ativo, empilhado = false, junto = false }: { ativo: boolean; empilhado?: boolean; junto?: boolean }) {
  const caixa = junto ? "px-2.5 py-1" : empilhado ? "mt-1 flex w-fit px-2 py-0.5" : "px-2 py-0.5";
  return (
    <span className={`rounded-full text-xs font-medium ${caixa} ${ativo ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-danger"}`}>
      {ativo ? "Ativo" : "Inativo"}
    </span>
  );
}

export function Tabela({
  colunas,
  vazio,
  temLinhas,
  minWidth = "min-w-[860px]",
  children,
}: {
  colunas: string[];
  vazio: string;
  temLinhas: boolean;
  minWidth?: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-card">
      {temLinhas ? (
        <div className="overflow-x-auto">
          <table className={`w-full ${minWidth} text-left text-sm`}>
            <thead className="text-muted">
              <tr>
                {colunas.map((coluna) => (
                  <th key={coluna} className="px-5 py-3 font-medium">
                    {coluna}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{children}</tbody>
          </table>
        </div>
      ) : (
        <p className="px-5 py-8 text-sm text-muted">{vazio}</p>
      )}
    </section>
  );
}
