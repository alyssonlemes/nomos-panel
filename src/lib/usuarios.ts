import { consultar } from "@/lib/db";

export type UsuarioPainel = {
  id: number;
  full_name: string | null;
  email: string;
  role: string | null;
  is_active: boolean;
  is_superuser: boolean;
  created_at: Date;
  organization_name: string | null;
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
      o.name AS organization_name
    FROM users u
    LEFT JOIN organizations o ON o.id = u.organization_id
    ORDER BY u.created_at DESC
  `);
}
