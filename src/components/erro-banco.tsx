export function ErroBanco() {
  return (
    <main>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Banco</p>
      <h1 className="mt-1 text-3xl font-semibold">Não foi possível ler os dados</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        Confira o <span className="font-medium text-ink">DATABASE_URL</span> no <span className="font-medium text-ink">.env</span> do
        painel. Ele precisa ser a mesma connection string da API, com permissão de leitura nas tabelas de escritórios,
        usuários, clientes, processos e convites.
      </p>
    </main>
  );
}
