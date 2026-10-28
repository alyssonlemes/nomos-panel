import { consultar } from "@/lib/db";

export type EscritorioResumo = {
  id: number;
  name: string;
  document: string | null;
  is_active: boolean;
  created_at: Date;
  owner_name: string | null;
  owner_email: string;
  usuarios: number;
  clientes: number;
  processos: number;
};

export async function listarEscritorios() {
  return consultar<EscritorioResumo>(`
    SELECT
      o.id,
      o.name,
      o.document,
      o.is_active,
      o.created_at,
      owner.full_name AS owner_name,
      owner.email AS owner_email,
      (SELECT COUNT(*)::int FROM users u WHERE u.organization_id = o.id) AS usuarios,
      (SELECT COUNT(*)::int FROM clients c WHERE c.organization_id = o.id) AS clientes,
      (SELECT COUNT(*)::int FROM legal_actions la WHERE la.organization_id = o.id) AS processos
    FROM organizations o
    JOIN users owner ON owner.id = o.owner_id
    ORDER BY o.created_at DESC
  `);
}

export type EscritorioDetalhe = {
  id: number;
  name: string;
  document: string | null;
  legal_representative_name: string | null;
  legal_representative_document: string | null;
  is_active: boolean;
  created_at: Date;
  owner_name: string | null;
  owner_email: string;
  usuarios: number;
  clientes: number;
  processos: number;
};

export async function buscarEscritorio(id: number) {
  const [escritorio] = await consultar<EscritorioDetalhe>(
    `
    SELECT
      o.id,
      o.name,
      o.document,
      o.legal_representative_name,
      o.legal_representative_document,
      o.is_active,
      o.created_at,
      owner.full_name AS owner_name,
      owner.email AS owner_email,
      (SELECT COUNT(*)::int FROM users u WHERE u.organization_id = o.id) AS usuarios,
      (SELECT COUNT(*)::int FROM clients c WHERE c.organization_id = o.id) AS clientes,
      (SELECT COUNT(*)::int FROM legal_actions la WHERE la.organization_id = o.id) AS processos
    FROM organizations o
    JOIN users owner ON owner.id = o.owner_id
    WHERE o.id = $1
    `,
    [id],
  );
  return escritorio ?? null;
}

export type Membro = {
  id: number;
  full_name: string | null;
  email: string;
  role: string | null;
  is_active: boolean;
  created_at: Date;
};

export async function membrosDoEscritorio(id: number) {
  return consultar<Membro>(
    `
    SELECT id, full_name, email, role, is_active, created_at
    FROM users
    WHERE organization_id = $1
    ORDER BY created_at ASC
    `,
    [id],
  );
}

export type ProcessoRecente = {
  id: number;
  number: string;
  title: string;
  created_at: Date;
};

export async function processosRecentes(id: number) {
  return consultar<ProcessoRecente>(
    `
    SELECT id, number, title, created_at
    FROM legal_actions
    WHERE organization_id = $1
    ORDER BY created_at DESC
    LIMIT 8
    `,
    [id],
  );
}
