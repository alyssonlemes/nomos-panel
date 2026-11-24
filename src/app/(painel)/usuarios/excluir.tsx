"use client";

import { excluirUsuario } from "./acoes";

export function ExcluirUsuario({ id, nome }: { id: number; nome: string }) {
  return (
    <form action={excluirUsuario}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-sm font-medium text-danger"
        onClick={(event) => {
          const confirma = window.confirm(`Excluir a conta de ${nome}? Essa pessoa deixa de existir no Nomos.`);
          if (!confirma) event.preventDefault();
        }}
      >
        Excluir
      </button>
    </form>
  );
}
