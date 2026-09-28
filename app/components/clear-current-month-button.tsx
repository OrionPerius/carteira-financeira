"use client";

import { useActionState } from "react";
import {
  limparTransacoesDoMesAtual,
  type LimparMesState,
} from "@/app/actions/transacoes";

type ClearCurrentMonthButtonProps = {
  quantidade: number;
  periodo: string;
};

const initialState: LimparMesState = {
  error: null,
};

export function ClearCurrentMonthButton({
  quantidade,
  periodo,
}: ClearCurrentMonthButtonProps) {
  const [state, formAction, isPending] = useActionState(
    limparTransacoesDoMesAtual,
    initialState,
  );

  function confirmarExclusao(event: React.FormEvent<HTMLFormElement>) {
    const confirmou = window.confirm(
      `Você irá excluir definitivamente ${quantidade} transação(ões) de ${periodo}. Esta ação não poderá ser desfeita. Deseja continuar?`,
    );

    if (!confirmou) {
      event.preventDefault();
    }
  }

  return (
    <form action={formAction} onSubmit={confirmarExclusao}>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md border border-red-900 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Limpando..." : "Limpar mês atual"}
      </button>

      {state.error && (
        <p
          role="alert"
          aria-live="polite"
          className="mt-3 max-w-xs text-right text-sm text-red-300"
        >
          {state.error}
        </p>
      )}
    </form>
  );
}