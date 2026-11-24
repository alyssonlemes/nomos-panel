"use server";

import { redirect } from "next/navigation";

import { consultar } from "@/lib/db";
import { exigirSessao } from "@/lib/sessao";

function idDoFormulario(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

export async function salvarUsuario(formData: FormData) {
  await exigirSessao();
  const id = idDoFormulario(formData);
  if (!id) redirect("/usuarios");

  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const ativo = String(formData.get("ativo") ?? "") === "1";
  if (!nome || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect(`/usuarios/${id}?erro=invalido`);
  }

  const [outro] = await consultar<{ id: number }>(
    `SELECT id FROM users WHERE lower(email) = $1 AND id <> $2`,
    [email, id],
  );
  if (outro) redirect(`/usuarios/${id}?erro=email`);

  await consultar(`UPDATE users SET full_name = $1, email = $2, is_active = $3 WHERE id = $4`, [nome, email, ativo, id]);
  redirect(`/usuarios/${id}?ok=1`);
}

export async function excluirUsuario(formData: FormData) {
  await exigirSessao();
  const id = idDoFormulario(formData);
  if (!id) redirect("/usuarios");

  const [dono] = await consultar<{ name: string }>(`SELECT name FROM organizations WHERE owner_id = $1`, [id]);
  if (dono) redirect(`/usuarios/${id}?erro=dono`);

  try {
    await consultar(`DELETE FROM users WHERE id = $1`, [id]);
  } catch {
    redirect(`/usuarios/${id}?erro=vinculo`);
  }
  redirect("/usuarios");
}
