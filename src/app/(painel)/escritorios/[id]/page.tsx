import Link from "next/link";
import { notFound } from "next/navigation";

import { ErroBanco } from "@/components/erro-banco";
import { buscarEscritorio, membrosDoEscritorio, processosRecentes } from "@/lib/escritorios";
import { dataCurta, documento, papel, quando } from "@/lib/formato";

export const metadata = { title: "Escritório" };

export default async function EscritorioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numero = Number(id);
  if (!Number.isInteger(numero) || numero <= 0) notFound();

  try {
    const escritorio = await buscarEscritorio(numero);
    if (!escritorio) notFound();
    const [membros, processos] = await Promise.all([membrosDoEscritorio(numero), processosRecentes(numero)]);

    return (
      <main>
        <Link href="/escritorios" className="link-voltar">
          Escritórios
        </Link>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-brand">Escritório</p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold">{escritorio.name}</h1>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${escritorio.is_active ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-danger"}`}>
            {escritorio.is_active ? "Ativo" : "Inativo"}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted">Aberto em {quando(escritorio.created_at)}.</p>

        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          <article className="rounded-2xl border border-line bg-card p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Usuários</p>
            <p className="mt-3 text-2xl font-semibold tabular-nums">{escritorio.usuarios}</p>
          </article>
          <article className="rounded-2xl border border-line bg-card p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Clientes</p>
            <p className="mt-3 text-2xl font-semibold tabular-nums">{escritorio.clientes}</p>
          </article>
          <article className="rounded-2xl border border-line bg-card p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Processos</p>
            <p className="mt-3 text-2xl font-semibold tabular-nums">{escritorio.processos}</p>
          </article>
        </section>

        <section className="mt-6 grid gap-3 lg:grid-cols-2">
          <article className="rounded-2xl border border-line bg-card p-5">
            <h2 className="font-semibold">Cadastro</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-[0.12em] text-muted">Documento</dt>
                <dd className="mt-1">{documento(escritorio.document)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.12em] text-muted">Responsável legal</dt>
                <dd className="mt-1">{escritorio.legal_representative_name || "—"}</dd>
                <dd className="text-xs text-muted">{documento(escritorio.legal_representative_document)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.12em] text-muted">Proprietário da conta</dt>
                <dd className="mt-1">{escritorio.owner_name || "—"}</dd>
                <dd className="text-xs text-muted">{escritorio.owner_email}</dd>
              </div>
            </dl>
          </article>

          <article className="rounded-2xl border border-line bg-card p-5">
            <h2 className="font-semibold">Processos recentes</h2>
            {processos.length === 0 ? (
              <p className="mt-4 text-sm text-muted">Nenhum processo neste escritório.</p>
            ) : (
              <ul className="mt-4 divide-y divide-line text-sm">
                {processos.map((processo) => (
                  <li key={processo.id} className="py-3">
                    <p className="font-medium">{processo.title}</p>
                    <p className="text-xs text-muted">
                      {processo.number} · {dataCurta(processo.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-card">
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-semibold">Equipe</h2>
          </div>
          {membros.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted">Nenhum usuário vinculado.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="text-muted">
                  <tr>
                    <th className="px-5 py-3 font-medium">Nome</th>
                    <th className="px-5 py-3 font-medium">E-mail</th>
                    <th className="px-5 py-3 font-medium">Papel</th>
                    <th className="px-5 py-3 font-medium">Situação</th>
                    <th className="px-5 py-3 font-medium">Desde</th>
                  </tr>
                </thead>
                <tbody>
                  {membros.map((membro) => (
                    <tr key={membro.id} className="border-t border-line">
                      <td className="px-5 py-3 font-medium">{membro.full_name || "—"}</td>
                      <td className="px-5 py-3">{membro.email}</td>
                      <td className="px-5 py-3">{papel(membro.role)}</td>
                      <td className="px-5 py-3">{membro.is_active ? "Ativo" : "Inativo"}</td>
                      <td className="px-5 py-3">{dataCurta(membro.created_at)}</td>
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
