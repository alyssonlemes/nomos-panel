import { consultar } from "@/lib/db";

export type Resumo = {
  escritorios: number;
  escritoriosAtivos: number;
  usuarios: number;
  usuariosAtivos: number;
  clientes: number;
  processos: number;
  convitesPendentes: number;
};

type Linha = {
  escritorios: number;
  escritorios_ativos: number;
  usuarios: number;
  usuarios_ativos: number;
  clientes: number;
  processos: number;
  convites_pendentes: number;
};

export async function resumoGeral(): Promise<Resumo> {
  const [linha] = await consultar<Linha>(`
    SELECT
      (SELECT COUNT(*)::int FROM organizations) AS escritorios,
      (SELECT COUNT(*)::int FROM organizations WHERE is_active) AS escritorios_ativos,
      (SELECT COUNT(*)::int FROM users) AS usuarios,
      (SELECT COUNT(*)::int FROM users WHERE is_active) AS usuarios_ativos,
      (SELECT COUNT(*)::int FROM clients) AS clientes,
      (SELECT COUNT(*)::int FROM legal_actions) AS processos,
      (SELECT COUNT(*)::int FROM invitations WHERE lower(status::text) = 'pending') AS convites_pendentes
  `);

  return {
    escritorios: linha?.escritorios ?? 0,
    escritoriosAtivos: linha?.escritorios_ativos ?? 0,
    usuarios: linha?.usuarios ?? 0,
    usuariosAtivos: linha?.usuarios_ativos ?? 0,
    clientes: linha?.clientes ?? 0,
    processos: linha?.processos ?? 0,
    convitesPendentes: linha?.convites_pendentes ?? 0,
  };
}
