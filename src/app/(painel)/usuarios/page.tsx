import { ErroBanco } from "@/components/erro-banco";
import { Cabecalho, SeloAtivo, Tabela } from "@/components/listagem";
import { dataCurta, papel } from "@/lib/formato";
import { listarUsuarios } from "@/lib/usuarios";

export const metadata = { title: "Usuários" };

export default async function UsuariosPage() {
  try {
    const usuarios = await listarUsuarios();

    return (
      <main>
        <Cabecalho
          grupo="Operação"
          titulo="Usuários"
          texto="Contas do Nomos, com ou sem escritório. Quem ainda não criou organização aparece sem vínculo."
        />
        <Tabela
          colunas={["Nome", "E-mail", "Escritório", "Papel", "Situação", "Desde"]}
          vazio="Nenhum usuário cadastrado."
          temLinhas={usuarios.length > 0}
        >
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
                <SeloAtivo ativo={usuario.is_active} />
              </td>
              <td className="px-5 py-3">{dataCurta(usuario.created_at)}</td>
            </tr>
          ))}
        </Tabela>
      </main>
    );
  } catch {
    return <ErroBanco />;
  }
}
