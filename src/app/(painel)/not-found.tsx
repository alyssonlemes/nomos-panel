import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <main>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Painel</p>
      <h1 className="mt-1 text-3xl font-semibold">Página não encontrada</h1>
      <Link href="/" className="link-voltar mt-6">
        Voltar à visão geral
      </Link>
    </main>
  );
}
