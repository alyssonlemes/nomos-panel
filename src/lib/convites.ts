import { consultar } from "@/lib/db";

export type ConvitePainel = {
  id: number;
  email: string;
  status: string;
  role: string | null;
  created_at: Date;
  organization_name: string;
  invited_by_email: string | null;
};

export async function listarConvites() {
  return consultar<ConvitePainel>(`
    SELECT
      i.id,
      i.email,
      i.status::text AS status,
      i.role,
      i.created_at,
      o.name AS organization_name,
      autor.email AS invited_by_email
    FROM invitations i
    JOIN organizations o ON o.id = i.organization_id
    LEFT JOIN users autor ON autor.id = i.invited_by_id
    ORDER BY i.created_at DESC
  `);
}
