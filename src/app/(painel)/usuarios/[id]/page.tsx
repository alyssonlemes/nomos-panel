import Link from "next/link";
import { notFound } from "next/navigation";

import { salvarUsuario } from "@/app/(painel)/usuarios/acoes";
import { ExcluirUsuario } from "@/app/(painel)/usuarios/excluir";
import { SeloAtivo } from "@/components/listagem";
import { papel, quando } from "@/lib/formato";
import { buscarUsuario } from "@/lib/usuarios";

export const metadata = { title: "Usuário" };

const ERROS: Record<string, string> = {
  invalido: "Informe o nome e um e-mail válido.",
  email: "Esse e-mail já está em outra conta.",
  dono: "Esta conta é dona de um escritório. Passe a propriedade antes de excluir.",
  vinculo: "Não foi possível excluir esta conta porque ela ainda está ligada a outros registros.",
};

export default async function UsuarioPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string; ok?: string }>;
}) {
  const { id } = await params;
  const { erro, ok } = await searchParams;
  const numero = Number(id);
  if (!Number.isInteger(numero) || numero <= 0) notFound();

  const usuario = await buscarUsuario(numero);
  if (!usuario) notFound();

  const aviso = erro ? ERROS[erro] : null;

  return (
    <main>
      <Link href="/usuarios" className="link-voltar">
        Usuários
      </Link>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-brand">Usuário</p>
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold">{usuario.full_name || "Sem nome"}</h1>
        <SeloAtivo ativo={usuario.is_active} junto />
      </div>
      <p className="mt-2 text-sm text-muted">Conta aberta em {quando(usuario.created_at)}.</p>

      {ok && (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">
          Conta atualizada.
        </p>
      )}
      {aviso && (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-danger">{aviso}</p>
      )}

      <section className="mt-6 rounded-2xl border border-line bg-card p-5">
        <h2 className="font-semibold">Dados da conta</h2>
        <p className="mt-1 text-sm text-muted">
          Escritório: {usuario.organization_name || "Sem escritório"}
          {usuario.escritorio_proprio ? ` · Dono de ${usuario.escritorio_proprio}` : ""}
          {usuario.role ? ` · ${papel(usuario.role)}` : ""}
        </p>
        <form action={salvarUsuario} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="id" value={usuario.id} />
          <label className="block text-sm">
            <span className="text-xs uppercase tracking-[0.12em] text-muted">Nome</span>
            <input
              name="nome"
              required
              defaultValue={usuario.full_name ?? ""}
              className="mt-1 block w-full rounded-xl border border-line bg-white px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="text-xs uppercase tracking-[0.12em] text-muted">E-mail</span>
            <input
              name="email"
              type="email"
              required
              defaultValue={usuario.email}
              className="mt-1 block w-full rounded-xl border border-line bg-white px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="text-xs uppercase tracking-[0.12em] text-muted">Situação</span>
            <select
              name="ativo"
              defaultValue={usuario.is_active ? "1" : "0"}
              className="mt-1 block w-full rounded-xl border border-line bg-white px-3 py-2"
            >
              <option value="1">Ativo</option>
              <option value="0">Inativo</option>
            </select>
          </label>
          <div className="flex items-end">
            <button type="submit" className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white">
              Salvar
            </button>
          </div>
        </form>
      </section>

      <section className="mt-6 rounded-2xl border border-line bg-card p-5">
        <h2 className="font-semibold">Excluir conta</h2>
        <p className="mt-1 max-w-xl text-sm text-muted">
          A conta sai do Nomos. Isso é diferente de desvincular alguém de um escritório.
        </p>
        <div className="mt-4">
          <ExcluirUsuario id={usuario.id} nome={usuario.full_name || usuario.email} />
        </div>
      </section>
    </main>
  );
}
