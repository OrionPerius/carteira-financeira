"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type TransacaoState = {
  error: string | null;
};

export type LimparMesState = {
  error: string | null;
};

export async function criarTransacao(
  _previousState: TransacaoState,
  formData: FormData,
): Promise<TransacaoState> {
  const descricao = String(formData.get("descricao") ?? "").trim();
  const valorTexto = String(formData.get("valor") ?? "").replace(",", ".");
  const valor = Number(valorTexto);
  const tipo = String(formData.get("tipo") ?? "");

  if (descricao.length < 1 || descricao.length > 120) {
    return { error: "A descrição deve ter entre 1 e 120 caracteres." };
  }

  if (!Number.isFinite(valor) || valor <= 0) {
    return { error: "Informe um valor maior que zero." };
  }

  if (tipo !== "receita" && tipo !== "despesa") {
    return { error: "Selecione Receita ou Despesa." };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { error } = await supabase.from("transacoes").insert({
    user_id: user.id,
    descricao,
    valor,
    tipo,
  });

  if (error) {
    console.error(error);
    return { error: "Não foi possível salvar a transação. Tente novamente." };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function limparTransacoesDoMesAtual(
  _previousState: LimparMesState,
): Promise<LimparMesState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const agora = new Date();
  const inicioDoMes = new Date(
    agora.getFullYear(),
    agora.getMonth(),
    1,
  ).toISOString();

  const inicioDoProximoMes = new Date(
    agora.getFullYear(),
    agora.getMonth() + 1,
    1,
  ).toISOString();

  const { error } = await supabase
    .from("transacoes")
    .delete()
    .eq("user_id", user.id)
    .gte("criado_em", inicioDoMes)
    .lt("criado_em", inicioDoProximoMes);

  if (error) {
    console.error(error);
    return {
      error: "Não foi possível limpar as transações deste mês. Tente novamente.",
    };
  }

  revalidatePath("/dashboard");

  return { error: null };
}