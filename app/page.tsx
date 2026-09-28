import Image from "next/image";
import { LoginForm } from "./components/login-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#12151a] text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[1fr_560px]">
        <section className="flex flex-col border-b border-slate-800 bg-[#171a1f] px-6 py-8 sm:px-10 lg:border-r lg:border-b-0 lg:px-16 lg:py-12">
          <header className="flex items-center gap-3">
            <Image
              src="/logo_site_money.png"
              alt="Logo da Carteira Financeira"
              width={48}
              height={48}
              priority
              className="h-12 w-12 rounded-md object-cover"
            />

            <span className="font-semibold text-white">
              Carteira Financeira
            </span>
          </header>

          <section
            className="my-auto max-w-xl py-16 lg:py-0"
            aria-labelledby="titulo-apresentacao"
          >
            <h1
              id="titulo-apresentacao"
              className="text-4xl font-semibold tracking-tight text-white sm:text-5xl"
            >
              Organize seu dinheiro com clareza.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-400">
              Registre receitas e despesas, acompanhe seu saldo e visualize
              todas as movimentações em um único lugar.
            </p>
          </section>
        </section>

        <section className="flex items-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-sm">
            <header>
              <h2 className="text-3xl font-semibold tracking-tight text-white">
                Entre na sua conta
              </h2>
            </header>

            <div className="mt-8">
              <LoginForm />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}