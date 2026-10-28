import Link from "next/link";

import { ErroBanco } from "@/components/erro-banco";
import { dataCurta, documento } from "@/lib/formato";
import { listarEscritorios } from "@/lib/escritorios";

export const metadata = { title: "Escritórios" };

export default async function EscritoriosPage() {
  try {
    const escritorios = await listarEscritorios();

    return (
      <main>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Operação</p>
        <h1 className="mt-1 text-3xl font-semibold">Escritórios</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Organizações criadas no Nomos. Cada uma isola clientes, processos e equipe.
        </p>

        <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-card">
          {escritorios.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted">Nenhum escritório cadastrado.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="text-muted">
                  <tr>
                    <th className="px-5 py-3 font-medium">Escritório</th>
                    <th className="px-5 py-3 font-medium">Documento</th>
                    <th className="px-5 py-3 font-medium">Responsável</th>
                    <th className="px-5 py-3 font-medium">Usuários</th>
                    <th className="px-5 py-3 font-medium">Clientes</th>
                    <th className="px-5 py-3 font-medium">Processos</th>
                    <th className="px-5 py-3 font-medium">Desde</th>
                  </tr>
                </thead>
                <tbody>
                  {escritorios.map((linha) => (
                    <tr key={linha.id} className="border-t border-line">
                      <td className="px-5 py-3">
                        <Link href={`/escritorios/${linha.id}`} className="font-medium hover:text-brand">
                          {linha.name}
                        </Link>
                        <span className={`mt-1 flex w-fit rounded-full px-2 py-0.5 text-xs font-medium ${linha.is_active ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-danger"}`}>
                          {linha.is_active ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-5 py-3">{documento(linha.document)}</td>
                      <td className="px-5 py-3">
                        <span className="block">{linha.owner_name || "—"}</span>
                        <span className="text-xs text-muted">{linha.owner_email}</span>
                      </td>
                      <td className="px-5 py-3 tabular-nums">{linha.usuarios}</td>
                      <td className="px-5 py-3 tabular-nums">{linha.clientes}</td>
                      <td className="px-5 py-3 tabular-nums">{linha.processos}</td>
                      <td className="px-5 py-3">{dataCurta(linha.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    );
  } catch {
    return <ErroBanco />;
  }
}
