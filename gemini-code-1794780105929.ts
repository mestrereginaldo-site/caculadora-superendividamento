"use client";

import React, { useState } from "react";

const WHATSAPP_NUMBER = "5571983008001";

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function parseCurrencyInput(raw: string): number {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return 0;
  return parseInt(digits, 10) / 100;
}

function formatInputMask(raw: string): string {
  const num = parseCurrencyInput(raw);
  if (num === 0) return "";
  return num.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function CalculadoraSuperendividamento() {
  const [perfil, setPerfil] = useState("Servidor Público");
  const [rendaStr, setRendaStr] = useState("");
  const [parcelasStr, setParcelasStr] = useState("");
  const [despesasStr, setDespesasStr] = useState("");
  const [calculado, setCalculado] = useState(false);

  const renda = parseCurrencyInput(rendaStr);
  const parcelas = parseCurrencyInput(parcelasStr);
  const despesas = parseCurrencyInput(despesasStr);

  const comprometimentoPct = renda > 0 ? (parcelas / renda) * 100 : 0;
  const saldoAtual = renda - parcelas - despesas;

  // Critério técnico Lei 14.181/2021: preserva mínimo existencial (despesas básicas)
  // e limita o plano global a no máximo 30% da renda líquida
  const teto30PorCento = renda * 0.3;
  const margemAposBasico = Math.max(0, renda - despesas);
  const parcelaSugeridaPlano = Math.min(teto30PorCento, margemAposBasico);
  const alivioMensal = Math.max(0, parcelas - parcelaSugeridaPlano);
  const alivioAnual = alivioMensal * 12;

  const enquadrado = comprometimentoPct > 30 || saldoAtual < 0;

  const handleCalcular = (e: React.FormEvent) => {
    e.preventDefault();
    if (renda <= 0 || parcelas <= 0) return;
    setCalculado(true);
  };

  const gerarLinkWhatsApp = () => {
    const mensagem = `Olá Dr. Reginaldo! Fiz a simulação na Calculadora da Lei 14.181/2021 e gostaria de uma análise do meu caso:

• *Perfil:* ${perfil}
• *Renda Líquida:* ${formatCurrency(renda)}
• *Total de Parcelas/Mês:* ${formatCurrency(parcelas)} (${comprometimentoPct.toFixed(1)}% da renda)
• *Despesas Básicas:* ${formatCurrency(despesas)}
• *Alívio Mensal Estimado:* ${formatCurrency(alivioMensal)}/mês

Como funciona o Plano Global de Pagamento para proteger meu mínimo existencial?`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Lei Federal 14.181/2021
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Simulador Oficial de Mínimo Existencial
          </span>
        </div>
      </header>

      <div className="max-w-2xl w-full mx-auto px-4 py-8 space-y-6">
        {/* Hero */}
        <section className="space-y-2 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Os bancos estão tomando mais de 30% do seu salário?
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Descubra em 15 segundos quanto da sua renda está protegida pela{" "}
            <strong className="text-slate-200">Lei do Superendividamento</strong>{" "}
            e quanto dinheiro pode voltar para o seu sustento todos os meses.
          </p>
        </section>

        {/* Formulário */}
        <form
          onSubmit={handleCalcular}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              1. Qual é a sua fonte de renda principal?
            </label>
            <select
              value={perfil}
              onChange={(e) => {
                setPerfil(e.target.value);
                setCalculado(false);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition"
            >
              <option value="Servidor Público">
                Servidor Público (Estadual / Municipal / Federal)
              </option>
              <option value="Aposentado / Pensionista INSS">
                Aposentado ou Pensionista (INSS / RPPS)
              </option>
              <option value="Trabalhador CLT">
                Trabalhador Assalariado (CLT)
              </option>
              <option value="Autônomo / Outros">
                Autônomo / Profissional Liberal
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              2. Sua Renda Líquida Mensal (antes dos empréstimos)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                R$
              </span>
              <input
                type="text"
                inputMode="numeric"
                required
                placeholder="4.500,00"
                value={rendaStr}
                onChange={(e) => {
                  setRendaStr(formatInputMask(e.target.value));
                  setCalculado(false);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white text-lg font-semibold focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              3. Soma mensal de TODAS as parcelas de dívidas
            </label>
            <p className="text-xs text-slate-500 mb-1.5">
              Inclua consignados, empréstimos pessoais, cartão consignado (RMC/RCC) e débitos em conta.
            </p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                R$
              </span>
              <input
                type="text"
                inputMode="numeric"
                required
                placeholder="2.750,00"
                value={parcelasStr}
                onChange={(e) => {
                  setParcelasStr(formatInputMask(e.target.value));
                  setCalculado(false);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white text-lg font-semibold focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              4. Despesas básicas mensais da sua família
            </label>
            <p className="text-xs text-slate-500 mb-1.5">
              Aluguel/moradia, água, luz, supermercado, remédios e transporte.
            </p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                R$
              </span>
              <input
                type="text"
                inputMode="numeric"
                required
                placeholder="2.400,00"
                value={despesasStr}
                onChange={(e) => {
                  setDespesasStr(formatInputMask(e.target.value));
                  setCalculado(false);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white text-lg font-semibold focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-base py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition cursor-pointer"
          >
            CALCULAR MEU MÍNIMO EXISTENCIAL AGORA
          </button>
        </form>

        {/* Resultado */}
        {calculado && renda > 0 && (
          <section className="bg-slate-900 border-2 border-emerald-500/60 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span
                  className={`inline-block text-xs font-bold uppercase px-2.5 py-1 rounded-md mb-2 ${
                    enquadrado
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {enquadrado
                    ? "ALERTA: COMPROMETIMENTO EXCESSIVO DETECTADO"
                    : "ANÁLISE DE CAPACIDADE DE PAGAMENTO"}
                </span>
                <h2 className="text-xl font-bold text-white">
                  {comprometimentoPct.toFixed(1)}% da sua renda está presa com bancos
                </h2>
              </div>
            </div>

            {/* Cards Comparativos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-950 border border-red-500/30 rounded-xl p-4">
                <p className="text-xs text-slate-400 uppercase font-semibold">
                  Quanto você paga hoje
                </p>
                <p className="text-2xl font-extrabold text-red-400 mt-1">
                  {formatCurrency(parcelas)}
                  <span className="text-xs font-normal text-slate-400">/mês</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Saldo atual após contas básicas:{" "}
                  <span className={saldoAtual < 0 ? "text-red-400 font-bold" : "text-slate-300"}>
                    {formatCurrency(saldoAtual)}
                  </span>
                </p>
              </div>

              <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4">
                <p className="text-xs text-slate-400 uppercase font-semibold">
                  Teto estimado (Lei 14.181)
                </p>
                <p className="text-2xl font-extrabold text-emerald-400 mt-1">
                  {formatCurrency(parcelaSugeridaPlano)}
                  <span className="text-xs font-normal text-slate-400">/mês</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Carência legal de até <strong>180 dias</strong> para 1ª parcela
                </p>
              </div>
            </div>

            {/* Destaque de Economia */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center space-y-1">
              <p className="text-xs uppercase tracking-wider font-semibold text-emerald-300">
                Alívio Financeiro Estimado no Seu Orçamento
              </p>
              <p className="text-3xl font-black text-emerald-400">
                + {formatCurrency(alivioMensal)} / mês
              </p>
              <p className="text-xs text-slate-300">
                Equivalente a <strong>{formatCurrency(alivioAnual)}</strong> preservados em 12 meses para o sustento da sua família.
              </p>
            </div>

            {/* CTA WhatsApp */}
            <div className="space-y-2 pt-1">
              <a
                href={gerarLinkWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-green-500 hover:bg-green-400 text-slate-950 font-extrabold text-base py-4 px-6 rounded-xl shadow-lg shadow-green-500/20 transition"
              >
                ENVIAR RESULTADO E ANALISAR MEU PLANO NO WHATSAPP →
              </a>
              <p className="text-[11px] text-center text-slate-400">
                Atendimento sigiloso • Análise individual baseada no Art. 104-A do Código de Defesa do Consumidor
              </p>
            </div>
          </section>
        )}
      </div>

      {/* Rodapé Ético OAB */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500 space-y-1">
        <p className="text-slate-400 font-medium">
          Dr. Reginaldo Oliveira • Advocacia Estratégica em Direito Bancário e Superendividamento (OAB/SC 57.879)
        </p>
        <p className="max-w-xl mx-auto">
          Ferramenta de caráter exclusivamente informativo e educacional, em conformidade com o Provimento 205/2021 da OAB. Os valores exibidos são estimativas matemáticas sujeitas à análise documental e homologação judicial.
        </p>
      </footer>
    </main>
  );
}