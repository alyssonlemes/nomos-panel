import { ErroBanco } from "@/components/erro-banco";
import { dataCurta, papel } from "@/lib/formato";
import { listarUsuarios } from "@/lib/usuarios";

export const metadata = { title: "Usuários" };

export default async function UsuariosPage() {
  try {
    const usuarios = await listarUsuarios();

    return (
      <main>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Operação</p>
        <h1 className="mt-1 text-3xl font-semibold">Usuários</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Contas do Nomos, com ou sem escritório. Quem ainda não criou organização aparece sem vínculo.
        </p>

        <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-card">
          {usuarios.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted">Nenhum usuário cadastrado.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="text-muted">
                  <tr>
                    <th className="px-5 py-3 font-medium">Nome</th>
                    <th className="px-5 py-3 font-medium">E-mail</th>
                    <th className="px-5 py-3 font-medium">Escritório</th>
                    <th className="px-5 py-3 font-medium">Papel</th>
                    <th className="px-5 py-3 font-medium">Situação</th>
                    <th className="px-5 py-3 font-medium">Desde</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id} className="border-t border-line">
                      <td className="px-5 py-3 font-medium">
                        {usuario.full_name || "—"}
                        {usuario.is_superuser && (
                          <span className="ml-2 rounded-full bg-paper px-2 py-0.5 text-xs font-medium text-muted">Super</span>
                        )}
                      </td>
                      <td className="px-5 py-3">{usuario.email}</td>
                      <td className="px-5 py-3">{usuario.organization_name || "Sem escritório"}</td>
                      <td className="px-5 py-3">{papel(usuario.role)}</td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${usuario.is_active ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-danger"}`}>
                          {usuario.is_active ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-5 py-3">{dataCurta(usuario.created_at)}</td>
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
