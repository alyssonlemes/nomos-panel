import { sair } from "@/app/login/acoes";
import { NavegacaoPainel } from "@/app/(painel)/navegacao";
import { Marca } from "@/components/marca";
import { exigirSessao } from "@/lib/sessao";

export const dynamic = "force-dynamic";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  await exigirSessao();

  return (
    <div className="min-h-screen md:grid md:grid-cols-[272px_1fr]">
      <aside className="superficie sticky top-0 z-30 flex flex-col text-white md:h-screen md:max-h-screen md:self-start">
        <div className="flex items-center justify-between gap-3 px-4 py-4 md:px-5 md:py-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <Marca clara className="size-8" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight">Nomos</p>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">Painel interno</p>
            </div>
          </div>
          <form action={sair} className="md:hidden">
            <button type="submit" className="rounded-xl px-3 py-1.5 text-sm text-white/75 hover:bg-white/10 hover:text-white">
              Sair
            </button>
          </form>
        </div>

        <NavegacaoPainel />

        <form action={sair} className="mt-auto hidden border-t border-white/10 p-3 md:block">
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-white/70 hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
              <path d="M10 7V5a2 2 0 0 1 2-2h7v18h-7a2 2 0 0 1-2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 12H4m0 0 3-3m-3 3 3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Sair
          </button>
        </form>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 hidden h-14 items-center justify-between border-b border-line/80 bg-white/80 px-8 backdrop-blur-md md:flex">
          <p className="text-sm text-muted">Gestão interna · Nomos</p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">Equipe interna</p>
        </header>
        <div className="painel-conteudo mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-8 sm:py-8">{children}</div>
      </div>
    </div>
  );
}
