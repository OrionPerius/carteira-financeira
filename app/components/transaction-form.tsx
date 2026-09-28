"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  criarTransacao,
  type TransacaoState,
} from "@/app/actions/transacoes";

const initialState: TransacaoState = {
  error: null,
};

export function TransactionForm() {
  const [state, formAction, isPending] = useActionState(
    criarTransacao,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6 border-t border-slate-800 pt-8">
      <div>
        <label
          htmlFor="descricao"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Descrição
        </label>

        <input
          id="descricao"
          name="descricao"
          type="text"
          maxLength={120}
          placeholder="Ex.: Salário, mercado ou aluguel"
          required
          className="w-full rounded-md border border-slate-700 bg-transparent px-4 py-3 text-slate-100 outline-none placeholder:text-slate-600 transition focus:border-slate-400"
        />
      </div>

      <div>
        <label
          htmlFor="valor"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Valor
        </label>

        <input
          id="valor"
          name="valor"
          type="number"
          min="0.01"
          step="0.01"
          inputMode="decimal"
          placeholder="0,00"
          required
          className="w-full rounded-md border border-slate-700 bg-transparent px-4 py-3 text-slate-100 outline-none placeholder:text-slate-600 transition focus:border-slate-400"
        />
      </div>

      <div>
        <label
          htmlFor="tipo"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Classificação
        </label>

        <select
          id="tipo"
          name="tipo"
          defaultValue="receita"
          className="w-full rounded-md border border-slate-700 bg-[#171a1f] px-4 py-3 text-slate-100 outline-none transition focus:border-slate-400"
        >
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>
      </div>

      {state.error && (
        <p
          role="alert"
          aria-live="polite"
          className="border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-300"
        >
          {state.error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:justify-end">
        <Link
          href="/dashboard"
          className="rounded-md border border-slate-700 px-4 py-3 text-center font-semibold text-slate-200 transition hover:bg-slate-800"
        >
          Cancelar
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-500"
        >
          {isPending ? "Salvando..." : "Salvar transação"}
        </button>
      </div>
    </form>
  );
}