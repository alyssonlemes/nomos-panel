import Link from "next/link";

import { ErroBanco } from "@/components/erro-banco";
import { dataCurta, documento } from "@/lib/formato";
import { listarEscritorios } from "@/lib/escritorios";
import { resumoGeral } from "@/lib/resumo";

export const metadata = { title: "Visão geral" };

function Cartao({ titulo, valor, detalhe }: { titulo: string; valor: string; detalhe: string }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-line bg-card p-5">
      <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-brand/10" />
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{titulo}</p>
      <p className="mt-3 text-[1.65rem] font-semibold tracking-tight tabular-nums">{valor}</p>
      <p className="mt-2 text-xs text-muted">{detalhe}</p>
    </article>
  );
}

export default async function VisaoGeralPage() {
  try {
    const [resumo, escritorios] = await Promise.all([resumoGeral(), listarEscritorios()]);

    return (
      <main>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Operação</p>
        <h1 className="mt-1 text-3xl font-semibold">Visão geral</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Escritórios cadastrados no Nomos, com usuários, clientes e processos. A abertura de conta continua no sistema do escritório.
        </p>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Cartao titulo="Escritórios" valor={String(resumo.escritorios)} detalhe={`${resumo.escritoriosAtivos} ativos`} />
          <Cartao titulo="Usuários" valor={String(resumo.usuarios)} detalhe={`${resumo.usuariosAtivos} ativos`} />
          <Cartao titulo="Clientes" valor={String(resumo.clientes)} detalhe="Em todos os escritórios" />
          <Cartao titulo="Processos" valor={String(resumo.processos)} detalhe={`${resumo.convitesPendentes} convites pendentes`} />
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-line bg-card">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-semibold">Escritórios</h2>
            <Link href="/escritorios" className="text-sm font-medium text-brand hover:text-brand-strong">
              Ver todos
            </Link>
          </div>
          {escritorios.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted">Nenhum escritório ainda. O primeiro aparece quando alguém cria a organização no Nomos.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-muted">
                  <tr>
                    <th className="px-5 py-3 font-medium">Escritório</th>
                    <th className="px-5 py-3 font-medium">Documento</th>
                    <th className="px-5 py-3 font-medium">Usuários</th>
                    <th className="px-5 py-3 font-medium">Clientes</th>
                    <th className="px-5 py-3 font-medium">Processos</th>
                    <th className="px-5 py-3 font-medium">Desde</th>
                  </tr>
                </thead>
                <tbody>
                  {escritorios.slice(0, 8).map((linha) => (
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
