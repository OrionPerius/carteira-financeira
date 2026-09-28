import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { sair } from "@/app/actions/auth";
import { ClearCurrentMonthButton } from "@/app/components/clear-current-month-button";
import { FinancialChart } from "@/app/components/financial-chart";
import { createClient } from "@/lib/supabase/server";

const ITENS_POR_PAGINA = 5;

const formatarMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const formatarData = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const formatarMes = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
});

type DashboardPageProps = {
  searchParams: Promise<{
    pagina?: string;
  }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const parametros = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: transacoes, error } = await supabase
    .from("transacoes")
    .select("*")
    .order("criado_em", { ascending: false });

  if (error) {
    console.error(error);
  }

  const listaTransacoes = transacoes ?? [];

  const totalReceitas = listaTransacoes
    .filter((transacao) => transacao.tipo === "receita")
    .reduce((total, transacao) => total + Number(transacao.valor), 0);

  const totalDespesas = listaTransacoes
    .filter((transacao) => transacao.tipo === "despesa")
    .reduce((total, transacao) => total + Number(transacao.valor), 0);

  const saldoAtual = totalReceitas - totalDespesas;

  const totalPaginas = Math.max(
    1,
    Math.ceil(listaTransacoes.length / ITENS_POR_PAGINA),
  );

  const paginaSolicitada = Number(parametros.pagina ?? "1");

  const paginaAtual =
    Number.isInteger(paginaSolicitada) &&
    paginaSolicitada >= 1 &&
    paginaSolicitada <= totalPaginas
      ? paginaSolicitada
      : 1;

  const inicioDaPagina = (paginaAtual - 1) * ITENS_POR_PAGINA;

  const transacoesDaPagina = listaTransacoes.slice(
    inicioDaPagina,
    inicioDaPagina + ITENS_POR_PAGINA,
  );

  const hoje = new Date();

  const dadosGrafico = Array.from({ length: 6 }, (_, indice) => {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - indice, 1);

    const mes = formatarMes
      .format(data)
      .replace(".", "")
      .replace(/^./, (letra) => letra.toUpperCase());

    return {
      chave: `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(
        2,
        "0",
      )}`,
      mes,
      receitas: 0,
      despesas: 0,
    };
  }).reverse();

  const dadosPorMes = new Map(
    dadosGrafico.map((dado) => [dado.chave, dado]),
  );

  listaTransacoes.forEach((transacao) => {
    const data = new Date(transacao.criado_em);

    const chave = `${data.getFullYear()}-${String(
      data.getMonth() + 1,
    ).padStart(2, "0")}`;

    const dadoDoMes = dadosPorMes.get(chave);

    if (!dadoDoMes) {
      return;
    }

    if (transacao.tipo === "receita") {
      dadoDoMes.receitas += Number(transacao.valor);
    } else {
      dadoDoMes.despesas += Number(transacao.valor);
    }
  });

  const dadosParaGrafico = dadosGrafico.map(
    ({ chave: _chave, ...dado }) => dado,
  );

  const transacoesDoMesAtual = listaTransacoes.filter((transacao) => {
    const data = new Date(transacao.criado_em);

    return (
      data.getMonth() === hoje.getMonth() &&
      data.getFullYear() === hoje.getFullYear()
    );
  });

  const nomeDoMesAtual = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(hoje);

  return (
    <main className="min-h-screen bg-[#12151a] text-slate-100">
      <div className="min-h-screen lg:pl-[250px]">
        <aside className="fixed inset-y-0 left-0 z-20 hidden w-[250px] flex-col border-r border-slate-800 bg-[#171a1f] lg:flex">
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
                  aria-current="page"
                  className="block rounded-md border border-slate-600 bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Visão geral
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/nova-transacao"
                  className="block rounded-md border border-slate-600 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 hover:text-white"
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
                  href="/dashboard/nova-transacao"
                  className="rounded-md border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200"
                >
                  Nova transação
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

          <section aria-labelledby="titulo-resumo">
            <header className="border-b border-slate-800 pb-6">
              <h1
                id="titulo-resumo"
                className="text-2xl font-semibold tracking-tight text-white"
              >
                Resumo financeiro
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Acompanhe sua posição financeira atual.
              </p>
            </header>

            <dl className="grid border-b border-slate-800 md:grid-cols-3">
              <div className="border-b border-slate-800 py-6 md:border-r md:border-b-0 md:pr-6">
                <dt className="text-sm text-slate-400">Saldo atual</dt>
                <dd className="mt-3 text-3xl font-semibold tracking-tight text-white">
                  {formatarMoeda.format(saldoAtual)}
                </dd>
              </div>

              <div className="border-b border-slate-800 py-6 md:border-r md:border-b-0 md:px-6">
                <dt className="text-sm text-slate-400">Receitas</dt>
                <dd className="mt-3 text-3xl font-semibold tracking-tight text-emerald-400">
                  {formatarMoeda.format(totalReceitas)}
                </dd>
              </div>

              <div className="py-6 md:pl-6">
                <dt className="text-sm text-slate-400">Despesas</dt>
                <dd className="mt-3 text-3xl font-semibold tracking-tight text-red-400">
                  {formatarMoeda.format(totalDespesas)}
                </dd>
              </div>
            </dl>
          </section>

          <section className="mt-12" aria-labelledby="titulo-grafico">
            <header className="flex flex-col gap-2 border-b border-slate-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  id="titulo-grafico"
                  className="text-xl font-semibold text-white"
                >
                  Fluxo mensal
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Comparação entre receitas e despesas dos últimos seis meses.
                </p>
              </div>

              <p className="text-sm text-slate-400">Últimos 6 meses</p>
            </header>

            <div className="pt-6">
              <FinancialChart dados={dadosParaGrafico} />
            </div>
          </section>

          <section className="mt-12" aria-labelledby="titulo-transacoes">
            <header className="flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  id="titulo-transacoes"
                  className="text-xl font-semibold text-white"
                >
                  Transações recentes
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Histórico das movimentações registradas.
                </p>
              </div>

              <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center">
                <p className="text-sm text-slate-400">
                  {listaTransacoes.length}{" "}
                  {listaTransacoes.length === 1
                    ? "registrada"
                    : "registradas"}
                </p>

                {transacoesDoMesAtual.length > 0 && (
                  <ClearCurrentMonthButton
                    quantidade={transacoesDoMesAtual.length}
                    periodo={nomeDoMesAtual}
                  />
                )}
              </div>
            </header>

            {listaTransacoes.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left">
                    <caption className="sr-only">
                      Histórico das transações financeiras registradas.
                    </caption>

                    <thead className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th scope="col" className="py-4 pr-6 font-medium">
                          Data
                        </th>
                        <th scope="col" className="py-4 pr-6 font-medium">
                          Descrição
                        </th>
                        <th scope="col" className="py-4 pr-6 font-medium">
                          Tipo
                        </th>
                        <th
                          scope="col"
                          className="py-4 text-right font-medium"
                        >
                          Valor
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {transacoesDaPagina.map((transacao) => {
                        const eReceita = transacao.tipo === "receita";

                        return (
                          <tr
                            key={transacao.id}
                            className="border-b border-slate-800"
                          >
                            <td className="py-4 pr-6 text-sm text-slate-300">
                              <time dateTime={transacao.criado_em}>
                                {formatarData.format(
                                  new Date(transacao.criado_em),
                                )}
                              </time>
                            </td>

                            <td className="py-4 pr-6 font-medium text-white">
                              {transacao.descricao}
                            </td>

                            <td className="py-4 pr-6">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold ${
                                  eReceita
                                    ? "bg-emerald-950/50 text-emerald-400"
                                    : "bg-red-950/50 text-red-400"
                                }`}
                              >
                                {eReceita ? "Receita" : "Despesa"}
                              </span>
                            </td>

                            <td
                              className={`py-4 text-right font-semibold ${
                                eReceita
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              }`}
                            >
                              {eReceita ? "+" : "-"}
                              {formatarMoeda.format(Number(transacao.valor))}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {totalPaginas > 1 && (
                  <nav
                    className="flex flex-col gap-4 border-b border-slate-800 py-5 sm:flex-row sm:items-center sm:justify-between"
                    aria-label="Paginação das transações"
                  >
                    <p className="text-sm text-slate-400">
                      Página {paginaAtual} de {totalPaginas}
                    </p>

                    <div className="flex gap-3">
                      {paginaAtual > 1 && (
                        <Link
                          href={`/dashboard?pagina=${paginaAtual - 1}`}
                          scroll={false}
                          className="rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                        >
                          Anterior
                        </Link>
                      )}

                      {paginaAtual < totalPaginas && (
                        <Link
                          href={`/dashboard?pagina=${paginaAtual + 1}`}
                          scroll={false}
                          className="rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                        >
                          Próxima
                        </Link>
                      )}
                    </div>
                  </nav>
                )}
              </>
            ) : (
              <div className="py-12 text-center">
                <p className="text-slate-300">
                  Você ainda não registrou nenhuma transação.
                </p>

                <Link
                  href="/dashboard/nova-transacao"
                  className="mt-4 inline-block text-sm font-semibold text-slate-100 underline decoration-slate-500 underline-offset-4 transition hover:text-white"
                >
                  Registrar a primeira transação
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}