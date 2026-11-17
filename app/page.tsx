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

export default function CalculadoraLei14181Page() {
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

  // Critério técnico Lei 14.181/2021 (Art. 104-A CDC):
  // Preserva o mínimo existencial (despesas básicas) e limita o plano global a 30% da renda líquida
  const teto30PorCento = renda * 0.3;
  const margemAposBasico = Math.max(0, renda - despesas);
  const parcelaSugeridaPlano = Math.min(teto30PorCento, margemAposBasico);
  const alivioMensal = Math.max(0, parcelas - parcelaSugeridaPlano);
  const alivioAnual = alivioMensal * 12;

  const enquadrado = comprometimentoPct > 30 || saldoAtual < 0;

  const handleCalcular = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (renda <= 0 || parcelas <= 0) return;
    setCalculado(true);
  };

  const scrollToCalculadora = () => {
    const el = document.getElementById("calculadora");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      {/* Barra Superior */}
      <header className="border-b border-slate-800/90 bg-slate-900/85 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Lei Federal 14.181/2021
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Defesa do Mínimo Existencial
          </span>
        </div>
      </header>

      <main className="max-w-3xl w-full mx-auto px-4 py-8 sm:py-12 space-y-14">
        {/* BLOCO 1: DOBRA PRINCIPAL */}
        <section className="space-y-4 text-center">
          <div className="inline-block bg-emerald-500/10 border border-emerald-500/30 rounded-full px-3.5 py-1">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-emerald-300">
              Lei Federal 14.181/2021 • Defesa do Mínimo Existencial
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Os empréstimos consignados, cartões e débitos em conta estão tomando mais de 30% do seu salário?
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Use a calculadora gratuita abaixo para descobrir em 15 segundos quanto da sua renda mensal está protegida pela{" "}
            <strong className="text-white">Lei do Superendividamento</strong> e qual deveria ser o limite máximo das suas parcelas para preservar o sustento da sua família.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-1 text-xs sm:text-sm text-emerald-400 font-medium">
            <span>✓ 100% Gratuito</span>
            <span>✓ Não pede CPF, e-mail nem senha</span>
            <span>✓ Cálculo imediato na tela</span>
          </div>
        </section>

        {/* BLOCO 2: A CALCULADORA INTERATIVA */}
        <section id="calculadora" className="scroll-mt-20 space-y-6">
          <form
            onSubmit={handleCalcular}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-2xl space-y-5"
          >
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Simulador Oficial de Mínimo Existencial
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Preencha os 4 campos abaixo com valores aproximados do seu mês.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                1. Qual é a sua fonte de renda principal?
              </label>
              <select
                value={perfil}
                onChange={(e) => {
                  setPerfil(e.target.value);
                  setCalculado(false);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 text-white text-sm sm:text-base focus:outline-none focus:border-emerald-500 transition"
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                2. Sua Renda Líquida Mensal (antes dos empréstimos)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
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
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3.5 text-white text-lg font-semibold focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                3. Soma mensal de TODAS as parcelas de dívidas
              </label>
              <p className="text-xs text-slate-400 mb-1.5">
                Inclua consignados em folha, empréstimos pessoais, cartão consignado (RMC/RCC) e débitos em conta.
              </p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
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
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3.5 text-white text-lg font-semibold focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                4. Despesas básicas mensais da sua família
              </label>
              <p className="text-xs text-slate-400 mb-1.5">
                Aluguel/moradia, água, luz, supermercado, remédios, educação e transporte.
              </p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
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
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3.5 text-white text-lg font-semibold focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm sm:text-base py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              CALCULAR MEU MÍNIMO EXISTENCIAL AGORA
            </button>
          </form>

          {/* CARD DE RESULTADO */}
          {calculado && renda > 0 && (
            <div className="bg-slate-900 border-2 border-emerald-500/70 rounded-2xl p-5 sm:p-8 space-y-6 shadow-2xl">
              <div className="border-b border-slate-800 pb-4">
                <span
                  className={`inline-block text-xs font-bold uppercase px-3 py-1 rounded-md mb-2 ${
                    enquadrado
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {enquadrado
                    ? "ALERTA: COMPROMETIMENTO EXCESSIVO DETECTADO"
                    : "ANÁLISE DE CAPACIDADE DE PAGAMENTO"}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  {comprometimentoPct.toFixed(1)}% da sua renda está presa com bancos
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-red-500/30 rounded-xl p-4">
                  <p className="text-xs text-slate-400 uppercase font-bold">
                    Quanto você paga hoje
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-red-400 mt-1">
                    {formatCurrency(parcelas)}
                    <span className="text-xs font-normal text-slate-400">/mês</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Saldo após contas básicas:{" "}
                    <span
                      className={
                        saldoAtual < 0
                          ? "text-red-400 font-bold"
                          : "text-slate-200 font-semibold"
                      }
                    >
                      {formatCurrency(saldoAtual)}
                    </span>
                  </p>
                </div>

                <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4">
                  <p className="text-xs text-slate-400 uppercase font-bold">
                    Teto estimado (Lei 14.181)
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
                    {formatCurrency(parcelaSugeridaPlano)}
                    <span className="text-xs font-normal text-slate-400">/mês</span>
                  </p>
                  <p className="text-xs text-slate-300 mt-1.5">
                    Carência legal de até <strong>180 dias</strong> para 1ª parcela
                  </p>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center space-y-1">
                <p className="text-xs uppercase tracking-wider font-bold text-emerald-300">
                  Alívio Financeiro Estimado no Seu Orçamento
                </p>
                <p className="text-3xl sm:text-4xl font-black text-emerald-400">
                  + {formatCurrency(alivioMensal)} / mês
                </p>
                <p className="text-xs sm:text-sm text-slate-200">
                  Equivalente a <strong>{formatCurrency(alivioAnual)}</strong> preservados em 12 meses para o sustento da sua família.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <a
                  href={gerarLinkWhatsApp()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-green-500 hover:bg-green-400 text-slate-950 font-extrabold text-sm sm:text-base py-4 px-6 rounded-xl shadow-lg shadow-green-500/20 transition"
                >
                  ENVIAR RESULTADO E ANALISAR MEU PLANO NO WHATSAPP →
                </a>
                <p className="text-[11px] text-center text-slate-400">
                  Atendimento sigiloso • Análise individual baseada no Art. 104-A do Código de Defesa do Consumidor
                </p>
              </div>
            </div>
          )}
        </section>

        {/* BLOCO 3: O QUE DIZ A LEI FEDERAL 14.181/2021 */}
        <section className="space-y-6 border-t border-slate-800/80 pt-10">
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Por que os bancos não te contam sobre o Art. 104-A do Código de Defesa do Consumidor?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Quando você contrata vários empréstimos consignados, empréstimos pessoais e cartões consignados (RMC/RCC), cada banco olha apenas para o próprio contrato — e a soma das parcelas acaba engolindo o seu salário inteiro. A{" "}
              <strong className="text-white">Lei 14.181/2021</strong> foi criada exatamente para interromper esse ciclo e impedir que o pagamento de dívidas destrua a dignidade e a subsistência do consumidor de boa-fé.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                01. Proteção Salarial
              </span>
              <h3 className="text-base font-bold text-white">
                Preservação do Mínimo Existencial
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Antes de pagar qualquer banco, a lei garante que você tenha recursos suficientes para moradia, alimentação, energia, água, saúde e transporte. Nenhum contrato bancário está acima da sua sobrevivência.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                02. Mesa Única
              </span>
              <h3 className="text-base font-bold text-white">
                Plano Global de Pagamento
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Em vez de negociar desesperado com um banco de cada vez, todos os credores são reunidos em um único plano judicial de repactuação, com prazo de pagamento de até{" "}
                <strong className="text-slate-200">5 anos (60 meses)</strong> ajustado à sua real capacidade financeira.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                03. Fôlego Imediato
              </span>
              <h3 className="text-base font-bold text-white">
                Carência Legal de até 180 Dias
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                A lei permite solicitar um prazo de carência de até{" "}
                <strong className="text-slate-200">6 meses</strong> para o início do pagamento da primeira parcela do plano, dando fôlego imediato para você reorganizar sua vida financeira.
              </p>
            </div>
          </div>
        </section>

        {/* BLOCO 4: PARA QUEM ESTA FERRAMENTA FOI CRIADA */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Quem pode se beneficiar da análise da Lei do Superendividamento?
          </h2>

          <ul className="space-y-4 text-sm sm:text-base text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold mt-0.5">✓</span>
              <div>
                <strong className="text-white">
                  Servidores Públicos (Estaduais, Municipais e Federais):
                </strong>{" "}
                Professores, profissionais da saúde, policiais e servidores administrativos que tiveram a margem comprometida por múltiplos consignados, cartões RMC/RCC e descontos em conta-corrente.
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold mt-0.5">✓</span>
              <div>
                <strong className="text-white">
                  Aposentados e Pensionistas (INSS / RPPS):
                </strong>{" "}
                Beneficiários que sofrem descontos sucessivos na folha e ficaram sem renda líquida para custear remédios e despesas básicas.
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold mt-0.5">✓</span>
              <div>
                <strong className="text-white">
                  Trabalhadores Assalariados (CLT) e Autônomos:
                </strong>{" "}
                Pessoas físicas de boa-fé que acumularam dívidas de consumo (empréstimos pessoais, CDC, cheque especial e cartões de crédito) e hoje não conseguem pagar sem comprometer o sustento da casa.
              </div>
            </li>
          </ul>

          <p className="text-xs text-slate-400 border-t border-slate-800 pt-4 leading-relaxed">
            <em>
              Nota técnica: Dívidas com garantia real (financiamento imobiliário ou de veículo com alienação fiduciária), créditos tributários e pensão alimentícia não entram no plano global, mas são consideradas no cálculo das suas despesas essenciais de subsistência.
            </em>
          </p>
        </section>

        {/* BLOCO 5: PERGUNTAS FREQUENTES */}
        <section className="space-y-5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Dúvidas Comuns Sobre o Cálculo e a Lei 14.181/2021
          </h2>

          <div className="space-y-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1.5">
              <h3 className="text-sm sm:text-base font-bold text-white">
                1. O meu contracheque já vem com desconto direto na folha. A lei funciona mesmo assim?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong>Sim.</strong> A jurisprudência atual aplica a Lei 14.181/2021 inclusive para servidores públicos e aposentados com descontos em folha e em conta-corrente, permitindo requerer judicialmente a limitação das retenções ao teto que preserva o mínimo existencial.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1.5">
              <h3 className="text-sm sm:text-base font-bold text-white">
                2. Preciso ficar inadimplente ou sujar meu nome para usar a lei?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong>Não.</strong> A Lei do Superendividamento protege tanto quem já está em atraso quanto quem ainda está pagando em dia, mas às custas de deixar faltar comida, aluguel ou luz dentro de casa (o chamado superendividamento ativo ou iminente).
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1.5">
              <h3 className="text-sm sm:text-base font-bold text-white">
                3. O cálculo da ferramenta já é uma decisão judicial?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong>Não.</strong> A calculadora realiza uma projeção matemática baseada nos parâmetros legais e jurisprudenciais. Para transformar esse cálculo em um Plano Global de Pagamento válido perante os bancos, é necessária a análise individual dos seus contratos e do seu contracheque por um advogado especialista.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1.5">
              <h3 className="text-sm sm:text-base font-bold text-white">
                4. Quais documentos preciso ter em mãos para uma análise real?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Apenas o seu <strong>último contracheque (ou extrato do INSS)</strong> e o <strong>extrato dos empréstimos ativos</strong> (que pode ser tirado gratuitamente no aplicativo do seu banco ou no sistema Registrato do Banco Central).
              </p>
            </div>
          </div>
        </section>

        {/* BLOCO 6: AUTORIDADE TÉCNICA */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Responsável Técnico pela Ferramenta
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Dr. Reginaldo Oliveira — Advogado (OAB/SC 57.879)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Atuação especializada em Direito Bancário, Defesa do Consumidor Superendividado e Estruturação de Planos Globais de Repactuação de Dívidas (Lei 14.181/2021), com atendimento digital para servidores públicos, aposentados e trabalhadores em todo o Brasil.
          </p>
        </section>

        {/* BLOCO 7: CHAMADA FINAL */}
        <section className="bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-2xl p-6 sm:p-8 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Não deixe mais um mês do seu salário desaparecer antes mesmo de cair na conta.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Faça a simulação gratuita agora mesmo e envie o resultado para receber uma avaliação técnica individual do seu caso.
          </p>
          <button
            type="button"
            onClick={scrollToCalculadora}
            className="inline-block bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm sm:text-base py-4 px-8 rounded-xl shadow-lg shadow-emerald-500/20 transition cursor-pointer"
          >
            FAZER MINHA SIMULAÇÃO GRATUITA AGORA ↑
          </button>
        </section>
      </main>

      {/* RODAPÉ ÉTICO OAB */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500 space-y-1.5">
        <p className="text-slate-300 font-semibold">
          Dr. Reginaldo Oliveira • Advocacia Estratégica em Direito Bancário e Superendividamento (OAB/SC 57.879)
        </p>
        <p className="max-w-2xl mx-auto leading-relaxed">
          Ferramenta de caráter exclusivamente informativo e educacional, em estrita conformidade com o Provimento 205/2021 da OAB. Os valores exibidos são estimativas matemáticas sujeitas à análise documental e homologação judicial.
        </p>
      </footer>
    </div>
  );
}
