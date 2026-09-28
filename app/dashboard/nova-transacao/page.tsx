import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { sair } from "@/app/actions/auth";
import { TransactionForm } from "@/app/components/transaction-form";
import { createClient } from "@/lib/supabase/server";

export default async function NovaTransacaoPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-[#12151a] text-slate-100">
      <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
        <aside className="hidden border-r border-slate-800 bg-[#171a1f] lg:flex lg:flex-col">
          <header className="border-b border-slate-800 px-7 py-6">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Image
                src="/logo_site_money.png"
                alt=""
                width={36}
                height={36}
                priority
                className="h-9 w-9 rounded-md object-cover"
              />

              <span className="font-semibold text-white">
                Carteira Financeira
              </span>
            </Link>
          </header>

          <nav className="px-4 py-6" aria-label="Navegação principal">
            <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Menu
            </p>

            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="block rounded-md border border-slate-600 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 hover:text-white"
                >
                  Visão geral
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/nova-transacao"
                  aria-current="page"
                  className="block rounded-md border border-slate-600 bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Nova transação
                </Link>
              </li>
            </ul>
          </nav>

          <div className="mt-auto border-t border-slate-800 p-5">
            <p className="truncate text-sm text-slate-400">{user.email}</p>

            <form action={sair} className="mt-4">
              <button
                type="submit"
                className="w-full rounded-md border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                Sair
              </button>
            </form>
          </div>
        </aside>

        <div className="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
          <nav className="mb-8 lg:hidden" aria-label="Ações da página">
            <ul className="flex justify-end gap-3">
              <li>
                <Link
                  href="/dashboard"
                  className="rounded-md border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200"
                >
                  Voltar
                </Link>
              </li>

              <li>
                <form action={sair}>
                  <button
                    type="submit"
                    className="rounded-md border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200"
                  >
                    Sair
                  </button>
                </form>
              </li>
            </ul>
          </nav>

          <section
            className="mx-auto w-full max-w-xl"
            aria-labelledby="titulo-nova-transacao"
          >
            <header>
              <h1
                id="titulo-nova-transacao"
                className="text-3xl font-semibold tracking-tight text-white"
              >
                Nova transação
              </h1>

              <p className="mt-3 text-slate-400">
                Registre uma receita ou despesa na sua carteira.
              </p>
            </header>

            <div className="mt-10">
              <TransactionForm />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}