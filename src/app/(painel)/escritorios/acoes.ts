"use server";

import { redirect } from "next/navigation";

import { consultar } from "@/lib/db";
import { centavosDe, competenciaAtual } from "@/lib/mensalidade";
import { PLANOS } from "@/lib/planos";
import { exigirSessao } from "@/lib/sessao";

export async function definirPlano(formData: FormData) {
  await exigirSessao();
  const id = Number(formData.get("id"));
  const codigo = String(formData.get("plano") ?? "");
  const plano = PLANOS.find((item) => item.codigo === codigo);
  if (!Number.isInteger(id) || id <= 0 || !plano) {
    redirect("/escritorios");
  }

  await consultar(
    `UPDATE organizations
     SET plano = $1,
         mensalidade_centavos = $2,
         mensalidade_dia = COALESCE(mensalidade_dia, 10),
         updated_at = NOW()
     WHERE id = $3`,
    [plano.codigo, plano.precoCentavos, id],
  );
  redirect(`/escritorios/${id}`);
}

function idDoFormulario(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

export async function definirMensalidade(formData: FormData) {
  await exigirSessao();
  const id = idDoFormulario(formData);
  if (!id) redirect("/escritorios");

  const centavos = centavosDe(String(formData.get("valor") ?? ""));
  const dia = Number(formData.get("dia"));
  if (centavos == null) redirect(`/escritorios/${id}?mensalidade=invalida`);

  if (centavos === 0) {
    await consultar(
      `UPDATE organizations SET mensalidade_centavos = NULL, mensalidade_dia = NULL, updated_at = NOW() WHERE id = $1`,
      [id],
    );
  } else if (!Number.isInteger(dia) || dia < 1 || dia > 28) {
    redirect(`/escritorios/${id}?mensalidade=invalida`);
  } else {
    await consultar(
      `UPDATE organizations SET mensalidade_centavos = $1, mensalidade_dia = $2, updated_at = NOW() WHERE id = $3`,
      [centavos, dia, id],
    );
  }
  redirect(`/escritorios/${id}`);
}

export async function registrarPagamento(formData: FormData) {
  await exigirSessao();
  const id = idDoFormulario(formData);
  if (!id) redirect("/escritorios");

  const [escritorio] = await consultar<{ mensalidade_centavos: number | null }>(
    `SELECT mensalidade_centavos FROM organizations WHERE id = $1`,
    [id],
  );
  const centavos = escritorio?.mensalidade_centavos ?? 0;
  if (!centavos) redirect(`/escritorios/${id}`);

  await consultar(
    `
    INSERT INTO mensalidades (organization_id, competencia, valor_centavos, pago_em)
    VALUES ($1, $2::date, $3, NOW())
    ON CONFLICT (organization_id, competencia)
    DO UPDATE SET valor_centavos = EXCLUDED.valor_centavos, pago_em = NOW()
    `,
    [id, competenciaAtual().iso, centavos],
  );
  redirect(`/escritorios/${id}`);
}

export async function desfazerPagamento(formData: FormData) {
  await exigirSessao();
  const id = idDoFormulario(formData);
  if (!id) redirect("/escritorios");

  await consultar(
    `UPDATE mensalidades SET pago_em = NULL WHERE organization_id = $1 AND competencia = $2::date`,
    [id, competenciaAtual().iso],
  );
  redirect(`/escritorios/${id}`);
}
