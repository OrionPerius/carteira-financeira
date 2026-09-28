"use client";

import { useActionState } from "react";
import { entrar, type LoginState } from "@/app/actions/auth";

const initialState: LoginState = {
  error: null,
};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(entrar, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          E-mail
        </label>

        <input
          id="email"
          name="email"
          type="email"
          placeholder="seuemail@exemplo.com"
          required
          className="w-full rounded-md border border-slate-700 bg-transparent px-4 py-3 text-slate-100 outline-none placeholder:text-slate-600 transition focus:border-slate-400"
        />
      </div>

      <div>
        <label
          htmlFor="senha"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Senha
        </label>

        <input
          id="senha"
          name="senha"
          type="password"
          placeholder="Digite sua senha"
          required
          className="w-full rounded-md border border-slate-700 bg-transparent px-4 py-3 text-slate-100 outline-none placeholder:text-slate-600 transition focus:border-slate-400"
        />
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

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-white px-4 py-3 font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-500"
      >
        {isPending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}