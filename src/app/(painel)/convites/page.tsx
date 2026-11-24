import { ErroBanco } from "@/components/erro-banco";
import { Cabecalho, Tabela } from "@/components/listagem";
import { listarConvites } from "@/lib/convites";
import { classeConvite, convite, papel, quando } from "@/lib/formato";

export const metadata = { title: "Convites" };

export default async function ConvitesPage() {
  try {
    const convites = await listarConvites();

    return (
      <main>
        <Cabecalho
          grupo="Sistema"
          titulo="Convites"
          texto="Convites enviados pelos escritórios para entrar na equipe. O aceite acontece no sistema do escritório."
        />
        <Tabela
          colunas={["E-mail", "Escritório", "Papel", "Situação", "Convidado por", "Quando"]}
          vazio="Nenhum convite enviado."
          temLinhas={convites.length > 0}
          minWidth="min-w-[820px]"
        >
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
        </Tabela>
      </main>
    );
  } catch {
    return <ErroBanco />;
  }
}
