import Link from "next/link";

import { ErroBanco } from "@/components/erro-banco";
import { Cabecalho, SeloAtivo, Tabela } from "@/components/listagem";
import { dataCurta, documento } from "@/lib/formato";
import { listarEscritorios } from "@/lib/escritorios";
import { planoPorCodigo } from "@/lib/planos";

export const metadata = { title: "Escritórios" };

export default async function EscritoriosPage() {
  try {
    const escritorios = await listarEscritorios();

    return (
      <main>
        <Cabecalho
          grupo="Operação"
          titulo="Escritórios"
          texto="Organizações criadas no Nomos. Cada uma isola clientes, processos e equipe."
        />
        <Tabela
          colunas={["Escritório", "Documento", "Responsável", "Plano", "Usuários", "Clientes", "Processos", "Desde"]}
          vazio="Nenhum escritório cadastrado."
          temLinhas={escritorios.length > 0}
        >
          {escritorios.map((linha) => (
            <tr key={linha.id} className="border-t border-line">
              <td className="px-5 py-3">
                <Link href={`/escritorios/${linha.id}`} className="font-medium hover:text-brand">
                  {linha.name}
                </Link>
                <SeloAtivo ativo={linha.is_active} empilhado />
              </td>
              <td className="px-5 py-3">{documento(linha.document)}</td>
              <td className="px-5 py-3">
                <span className="block">{linha.owner_name || "—"}</span>
                <span className="text-xs text-muted">{linha.owner_email}</span>
              </td>
              <td className="px-5 py-3">{planoPorCodigo(linha.plano).nome}</td>
              <td className="px-5 py-3 tabular-nums">{linha.usuarios}</td>
              <td className="px-5 py-3 tabular-nums">{linha.clientes}</td>
              <td className="px-5 py-3 tabular-nums">{linha.processos}</td>
              <td className="px-5 py-3">{dataCurta(linha.created_at)}</td>
            </tr>
          ))}
        </Tabela>
      </main>
    );
  } catch {
    return <ErroBanco />;
  }
}
