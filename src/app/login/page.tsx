import { Marca } from "@/components/marca";

import { destinoSeLogado, entrar } from "./acoes";

export const metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  await destinoSeLogado();
  const { erro } = await searchParams;

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <section className="superficie relative hidden overflow-hidden text-white lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div className="pointer-events-none absolute -left-24 -top-28 size-80 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-36 -right-16 size-[28rem] rounded-full bg-black/10" />
        <div className="relative flex items-center gap-3">
          <Marca clara className="size-12" />
          <div>
            <p className="text-sm font-semibold tracking-tight">Nomos</p>
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/55">Gestão jurídica</p>
          </div>
        </div>
        <div className="relative max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Painel interno</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight">A operação dos escritórios, num só lugar.</h1>
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            Escritórios, usuários, processos e convites do Nomos, sem entrar na conta de um cliente.
          </p>
        </div>
        <p className="relative text-xs font-medium tracking-wide text-white/50">Equipe interna</p>
      </section>

      <section className="flex items-center justify-center px-4 py-12">
        <form action={entrar} className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <Marca className="size-14" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand">Painel interno</p>
          </div>

          <div className="rounded-3xl border border-line bg-card p-8 shadow-[0_20px_50px_-28px_rgb(26_23_20/0.55)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Equipe interna</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Entrar</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">Acesso da operação. Não é o login de um escritório.</p>

            {erro && (
              <p className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-danger">
                E-mail ou senha incorretos.
              </p>
            )}

            <label className="mt-6 block text-sm font-medium" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none"
            />

            <label className="mt-4 block text-sm font-medium" htmlFor="senha">
              Senha
            </label>
            <input
              id="senha"
              name="senha"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 outline-none"
            />

            <button type="submit" className="mt-6 w-full bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-strong">
              Entrar
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
