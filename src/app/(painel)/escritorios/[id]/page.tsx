import Link from "next/link";
import { notFound } from "next/navigation";

import { definirMensalidade, definirPlano, desfazerPagamento, registrarPagamento } from "@/app/(painel)/escritorios/acoes";
import { ErroBanco } from "@/components/erro-banco";
import { SeloAtivo, SeloMensalidade } from "@/components/listagem";
import { ambiente } from "@/lib/ambiente";
import { buscarEscritorio, membrosDoEscritorio, pagamentosDoEscritorio, processosRecentes } from "@/lib/escritorios";
import { dataCurta, documento, papel, quando } from "@/lib/formato";
import { centavosParaCampo, mesPorExtenso, reais, situacaoMensalidade } from "@/lib/mensalidade";
import { PLANOS, planoPorCodigo } from "@/lib/planos";

export const metadata = { title: "Escritório" };

export default async function EscritorioPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mensalidade?: string }>;
}) {
  const { id } = await params;
  const { mensalidade } = await searchParams;
  const numero = Number(id);
  if (!Number.isInteger(numero) || numero <= 0) notFound();

  try {
    const escritorio = await buscarEscritorio(numero);
    if (!escritorio) notFound();
    const [membros, processos, pagamentos] = await Promise.all([
      membrosDoEscritorio(numero),
      processosRecentes(numero),
      pagamentosDoEscritorio(numero),
    ]);
    const situacao = situacaoMensalidade(escritorio.mensalidade_centavos, escritorio.mensalidade_dia, escritorio.pago_em);

    return (
      <main>
        <Link href="/escritorios" className="link-voltar">
          Escritórios
        </Link>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-brand">Escritório</p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold">{escritorio.name}</h1>
          <SeloAtivo ativo={escritorio.is_active} junto />
        </div>
        <p className="mt-2 text-sm text-muted">Aberto em {quando(escritorio.created_at)}.</p>
        <a href={ambiente().appUrl} className="mt-4 inline-flex text-sm font-medium text-brand hover:text-brand-strong">
          Abrir o sistema do escritório
        </a>

        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          <article className="rounded-2xl border border-line bg-card p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Usuários</p>
            <p className="mt-3 text-2xl font-semibold tabular-nums">
              {escritorio.usuarios}
              <span className="text-base font-medium text-muted"> / {planoPorCodigo(escritorio.plano).usuarios}</span>
            </p>
          </article>
          <article className="rounded-2xl border border-line bg-card p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Clientes</p>
            <p className="mt-3 text-2xl font-semibold tabular-nums">{escritorio.clientes}</p>
          </article>
          <article className="rounded-2xl border border-line bg-card p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Processos</p>
            <p className="mt-3 text-2xl font-semibold tabular-nums">
              {escritorio.processos}
              <span className="text-base font-medium text-muted"> / {planoPorCodigo(escritorio.plano).processos}</span>
            </p>
          </article>
        </section>

        <section className="mt-6 rounded-2xl border border-line bg-card p-5">
          <h2 className="font-semibold">Plano do escritório</h2>
          <p className="mt-1 text-sm text-muted">
            Aplicar grava o plano e a mensalidade deste valor. O dia de vencimento que já existe permanece. O cliente não vê o preço no sistema.
          </p>
          <form action={definirPlano} className="mt-4 flex flex-wrap items-end gap-3">
            <input type="hidden" name="id" value={escritorio.id} />
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-[0.12em] text-muted">Plano</span>
              <select
                name="plano"
                defaultValue={planoPorCodigo(escritorio.plano).codigo}
                className="mt-1 block rounded-xl border border-line bg-background px-3 py-2"
              >
                {PLANOS.map((plano) => (
                  <option key={plano.codigo} value={plano.codigo}>
                    {plano.nome} — {reais(plano.precoCentavos)} — {plano.usuarios} usuários, {plano.processos} processos
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white">
              Aplicar
            </button>
          </form>
        </section>

        <section className="mt-6 rounded-2xl border border-line bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold">Mensalidade</h2>
              <p className="mt-1 max-w-xl text-sm text-muted">
                Cobrança deste escritório. O cliente não vê este valor no sistema.
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold tabular-nums">{reais(escritorio.mensalidade_centavos)}</p>
              <div className="mt-1 flex justify-end">
                <SeloMensalidade situacao={situacao} />
              </div>
            </div>
          </div>

          {mensalidade === "invalida" && (
            <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-danger">
              Informe um valor em reais e um vencimento entre 1 e 28. Deixe o valor vazio para tirar a cobrança.
            </p>
          )}

          <form action={definirMensalidade} className="mt-4 flex flex-wrap items-end gap-3">
            <input type="hidden" name="id" value={escritorio.id} />
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-[0.12em] text-muted">Valor mensal</span>
              <input
                name="valor"
                inputMode="decimal"
                defaultValue={centavosParaCampo(escritorio.mensalidade_centavos)}
                placeholder="0,00"
                className="mt-1 block w-36 rounded-xl border border-line bg-white px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-[0.12em] text-muted">Vence no dia</span>
              <input
                name="dia"
                type="number"
                min={1}
                max={28}
                defaultValue={escritorio.mensalidade_dia ?? 10}
                className="mt-1 block w-24 rounded-xl border border-line bg-white px-3 py-2"
              />
            </label>
            <button type="submit" className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white">
              Salvar
            </button>
          </form>

          {situacao !== "sem_valor" && (
            <form action={situacao === "paga" ? desfazerPagamento : registrarPagamento} className="mt-4">
              <input type="hidden" name="id" value={escritorio.id} />
              <button type="submit" className="rounded-xl border border-line px-4 py-2 text-sm font-medium hover:border-brand">
                {situacao === "paga" ? "Desfazer pagamento deste mês" : "Registrar pagamento deste mês"}
              </button>
            </form>
          )}

          <div className="mt-5 border-t border-line pt-4">
            <h3 className="text-sm font-semibold">Pagamentos</h3>
            {pagamentos.length === 0 ? (
              <p className="mt-3 text-sm text-muted">Nenhum pagamento registrado.</p>
            ) : (
              <ul className="mt-3 divide-y divide-line text-sm">
                {pagamentos.map((pagamento) => (
                  <li key={pagamento.competencia} className="flex items-center justify-between gap-3 py-2.5">
                    <span>{mesPorExtenso(pagamento.competencia)}</span>
                    <span className="tabular-nums">{reais(pagamento.valor_centavos)}</span>
                    <span className="text-muted">{pagamento.pago_em ? `Pago em ${dataCurta(pagamento.pago_em)}` : "Em aberto"}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
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
