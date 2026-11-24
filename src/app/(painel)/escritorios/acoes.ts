"use server";

import { redirect } from "next/navigation";

import { consultar } from "@/lib/db";
import { PLANOS, type CodigoPlano } from "@/lib/planos";
import { exigirSessao } from "@/lib/sessao";

const CODIGOS = new Set<string>(PLANOS.map((item) => item.codigo));

export async function definirPlano(formData: FormData) {
  await exigirSessao();
  const id = Number(formData.get("id"));
  const plano = String(formData.get("plano") ?? "");
  if (!Number.isInteger(id) || id <= 0 || !CODIGOS.has(plano)) {
    redirect("/escritorios");
  }

  await consultar(
    `UPDATE organizations SET plano = $1, updated_at = NOW() WHERE id = $2`,
    [plano as CodigoPlano, id],
  );
  redirect(`/escritorios/${id}`);
}
