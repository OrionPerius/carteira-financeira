"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DadoGrafico = {
  mes: string;
  receitas: number;
  despesas: number;
};

type FinancialChartProps = {
  dados: DadoGrafico[];
};

const formatarMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export function FinancialChart({ dados }: FinancialChartProps) {
  return (
    <div
      className="h-72 w-full"
      role="img"
      aria-label="Gráfico de receitas e despesas dos últimos seis meses"
    >
      <p className="sr-only">
        Gráfico de colunas que compara receitas e despesas mensais.
      </p>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={dados}
          margin={{ top: 16, right: 8, left: -16, bottom: 0 }}
        >
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="mes"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickFormatter={(valor) => `R$ ${valor}`}
          />

          <Tooltip
            cursor={{ fill: "#1e293b", opacity: 0.5 }}
            contentStyle={{
              backgroundColor: "#171a1f",
              border: "1px solid #475569",
              borderRadius: "6px",
              color: "#f8fafc",
            }}
            labelStyle={{ color: "#f8fafc" }}
            formatter={(valor, nome) => [
              formatarMoeda.format(Number(valor)),
              nome === "receitas" ? "Receitas" : "Despesas",
            ]}
          />

          <Legend
            formatter={(valor) =>
              valor === "receitas" ? "Receitas" : "Despesas"
            }
            wrapperStyle={{ color: "#cbd5e1", fontSize: "14px" }}
          />

          <Bar dataKey="receitas" fill="#34d399" />
          <Bar dataKey="despesas" fill="#f87171" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}