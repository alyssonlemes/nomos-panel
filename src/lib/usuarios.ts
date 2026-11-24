import { consultar } from "@/lib/db";

export type UsuarioPainel = {
  id: number;
  full_name: string | null;
  email: string;
  role: string | null;
  is_active: boolean;
  is_superuser: boolean;
  created_at: Date;
  organization_id: number | null;
  organization_name: string | null;
  escritorio_proprio: string | null;
};

export async function listarUsuarios() {
  return consultar<UsuarioPainel>(`
    SELECT
      u.id,
      u.full_name,
      u.email,
      u.role,
      u.is_active,
      u.is_superuser,
      u.created_at,
      u.organization_id,
      o.name AS organization_name,
      (SELECT name FROM organizations WHERE owner_id = u.id ORDER BY id LIMIT 1) AS escritorio_proprio
    FROM users u
    LEFT JOIN organizations o ON o.id = u.organization_id
    ORDER BY u.created_at DESC
  `);
}

export async function buscarUsuario(id: number) {
  const [usuario] = await consultar<UsuarioPainel>(
    `
    SELECT
      u.id,
      u.full_name,
      u.email,
      u.role,
      u.is_active,
      u.is_superuser,
      u.created_at,
      u.organization_id,
      o.name AS organization_name,
      (SELECT name FROM organizations WHERE owner_id = u.id ORDER BY id LIMIT 1) AS escritorio_proprio
    FROM users u
    LEFT JOIN organizations o ON o.id = u.organization_id
    WHERE u.id = $1
    `,
    [id],
  );
  return usuario ?? null;
}
