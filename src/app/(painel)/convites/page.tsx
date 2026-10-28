import { ErroBanco } from "@/components/erro-banco";
import { listarConvites } from "@/lib/convites";
import { classeConvite, convite, papel, quando } from "@/lib/formato";

export const metadata = { title: "Convites" };

export default async function ConvitesPage() {
  try {
    const convites = await listarConvites();

    return (
      <main>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Sistema</p>
        <h1 className="mt-1 text-3xl font-semibold">Convites</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Convites enviados pelos escritórios para entrar na equipe. O aceite acontece no sistema do escritório.
        </p>

        <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-card">
          {convites.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted">Nenhum convite enviado.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="text-muted">
                  <tr>
                    <th className="px-5 py-3 font-medium">E-mail</th>
                    <th className="px-5 py-3 font-medium">Escritório</th>
                    <th className="px-5 py-3 font-medium">Papel</th>
                    <th className="px-5 py-3 font-medium">Situação</th>
                    <th className="px-5 py-3 font-medium">Convidado por</th>
                    <th className="px-5 py-3 font-medium">Quando</th>
                  </tr>
                </thead>
                <tbody>
                  {convites.map((item) => (
                    <tr key={item.id} className="border-t border-line">
                      <td className="px-5 py-3 font-medium">{item.email}</td>
                      <td className="px-5 py-3">{item.organization_name}</td>
                      <td className="px-5 py-3">{papel(item.role)}</td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${classeConvite(item.status)}`}>
                          {convite(item.status)}
                        </span>
                      </td>
                      <td className="px-5 py-3">{item.invited_by_email || "—"}</td>
                      <td className="px-5 py-3">{quando(item.created_at)}</td>
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
