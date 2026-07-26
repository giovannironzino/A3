import React from 'react';
import { Logo } from './Logo';
import { Tag, Button } from './UIPrimitives';
import { Printer, ArrowLeft, Download, Send } from 'lucide-react';

interface PrintReportViewProps {
  onBackToLanding: () => void;
  onToast: (msg: string) => void;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  onBackToLanding,
  onToast,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#2a2a2a] min-h-screen py-8 px-4 flex flex-col items-center">
      {/* Top Controls Bar */}
      <div className="no-print bg-[var(--preto)] text-[var(--branco)] p-4 rounded-none max-w-[800px] w-full flex items-center justify-between gap-4 mb-6 shadow-xl border border-[var(--cinza-escuro)]">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 font-subtitle text-xs uppercase font-bold text-[var(--branco)] hover:text-[var(--exodo-red)] bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao site interativo</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="font-subtitle text-xs text-[var(--cinza-claro)] hidden sm:inline">
            Formato de Impressão A4 (PDF)
          </span>
          <Button variant="primary" size="sm" onClick={handlePrint}>
            <Printer className="w-3.5 h-3.5 mr-1" />
            <span>Imprimir / Salvar PDF</span>
          </Button>
        </div>
      </div>

      {/* A4 Sheet 1 */}
      <div className="bg-[var(--branco)] text-[var(--preto)] w-full max-w-[800px] min-h-[1130px] p-8 md:p-12 shadow-2xl relative flex flex-col justify-between mb-8">
        <div>
          {/* Top Branding Header */}
          <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-4 mb-6">
            <Logo variant="color" height={24} />
            <span className="font-subtitle text-[0.65rem] tracking-[var(--tracking-wide)] uppercase text-[var(--text-tertiary)]">
              Diagnóstico Estratégico de Negócio
            </span>
          </div>

          {/* Document Header */}
          <div className="flex flex-col gap-3 mb-8">
            <div className="flex items-center gap-2">
              <span className="font-subtitle font-bold text-xs uppercase tracking-wider text-[var(--exodo-red)]">
                AE3
              </span>
              <span className="text-xs text-[var(--text-tertiary)]">•</span>
              <span className="font-subtitle font-bold text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                Acompanhamento Estratégico Trimestral
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl text-[var(--text-primary)] leading-[1.1] m-0">
              Sua clínica de nutrição cresce por decisão, ou por acaso?
            </h1>

            <p className="font-body text-sm text-[var(--text-secondary)] leading-[var(--lh-relaxed)] m-0">
              O AE3 é o programa de entrada da Êxodo: 3 encontros individuais que transformam o diagnóstico do seu negócio em um plano de ação executável nos próximos 90 dias.
            </p>
          </div>

          {/* Context Block */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-0.5 bg-[var(--exodo-red)]" />
              <span className="font-subtitle font-bold text-[0.65rem] uppercase tracking-wider text-[var(--text-secondary)]">
                Contexto
              </span>
            </div>
            <h3 className="font-display text-xl text-[var(--text-primary)] mb-2">
              Gestão informal tem um limite
            </h3>
            <p className="font-body text-xs leading-[var(--lh-relaxed)] text-[var(--text-secondary)] m-0 mb-2">
              A maioria das nutricionistas administra a clínica no improviso: decisões tomadas por urgência, indicadores que não existem em nenhum lugar, e uma meta de faturamento que nunca virou plano.
            </p>
            <p className="font-body text-xs leading-[var(--lh-relaxed)] text-[var(--text-secondary)] m-0">
              O AE3 não vende cursos nem fórmulas prontas. É um processo estruturado, individual, para transformar o cenário atual do seu negócio em decisões e ações concretas para os próximos 90 dias.
            </p>
          </div>

          {/* Phase 1 Overview */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-0.5 bg-[var(--exodo-red)]" />
              <span className="font-subtitle font-bold text-[0.65rem] uppercase tracking-wider text-[var(--text-secondary)]">
                Fase 01 — Diagnóstico e Plano
              </span>
            </div>
            <h3 className="font-display text-xl text-[var(--text-primary)] mb-3">
              3 encontros, 3 decisões
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div className="border border-[var(--border-default)] p-3 bg-[var(--surface-card)]">
                <span className="font-display text-lg text-[var(--cinza-medio)] block">01</span>
                <span className="font-subtitle font-bold text-xs block text-[var(--text-primary)] mb-1">Cenário Atual</span>
                <p className="font-body text-[0.7rem] text-[var(--text-secondary)] m-0">Diagnóstico completo do cenário atual.</p>
              </div>
              <div className="border border-[var(--exodo-red)] p-3 bg-[var(--branco)]">
                <span className="font-display text-lg text-[var(--exodo-red)] block">02</span>
                <span className="font-subtitle font-bold text-xs block text-[var(--text-primary)] mb-1">Cenários Possíveis</span>
                <p className="font-body text-[0.7rem] text-[var(--text-secondary)] m-0">3 caminhos estratégicos de meta.</p>
              </div>
              <div className="border border-[var(--border-default)] p-3 bg-[var(--surface-card)]">
                <span className="font-display text-lg text-[var(--cinza-medio)] block">03</span>
                <span className="font-subtitle font-bold text-xs block text-[var(--text-primary)] mb-1">Plano de Ação</span>
                <p className="font-body text-[0.7rem] text-[var(--text-secondary)] m-0">Ações táticas para os 90 dias.</p>
              </div>
            </div>
          </div>

          {/* Phase 2 Overview */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-0.5 bg-[var(--exodo-red)]" />
              <span className="font-subtitle font-bold text-[0.65rem] uppercase tracking-wider text-[var(--text-secondary)]">
                Fase 02 — Execução Semanal
              </span>
            </div>
            <h3 className="font-display text-xl text-[var(--text-primary)] mb-3">
              O ritmo que sustenta o plano
            </h3>

            <div className="grid grid-cols-4 gap-2">
              <div className="bg-[var(--surface-card)] p-3">
                <Tag tone="processo" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>Segunda</Tag>
                <p className="font-body text-[0.7rem] text-[var(--text-secondary)] mt-2 m-0">Envio das ações da semana.</p>
              </div>
              <div className="bg-[var(--surface-card)] p-3">
                <Tag tone="processo" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>Terça</Tag>
                <p className="font-body text-[0.7rem] text-[var(--text-secondary)] mt-2 m-0">Alinhamento com consultor.</p>
              </div>
              <div className="bg-[var(--surface-card)] p-3">
                <Tag tone="processo" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>Sexta</Tag>
                <p className="font-body text-[0.7rem] text-[var(--text-secondary)] mt-2 m-0">Prestação de contas.</p>
              </div>
              <div className="bg-[var(--surface-card)] p-3">
                <Tag tone="processo" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>Dom/Seg</Tag>
                <p className="font-body text-[0.7rem] text-[var(--text-secondary)] mt-2 m-0">Retorno ao fluxo.</p>
              </div>
            </div>
          </div>

          {/* Dark About Box */}
          <div className="bg-[var(--preto)] text-[var(--branco)] p-5">
            <span className="font-subtitle font-bold text-[0.65rem] uppercase tracking-wider text-[var(--exodo-red)] block mb-1">
              Sobre a Êxodo
            </span>
            <p className="font-body text-xs text-[var(--text-on-inverse)] leading-relaxed m-0">
              A Êxodo aplica um método de diagnóstico e gestão estratégica a clínicas de nutrição, com estrategistas dedicados ao acompanhamento individual de cada negócio. O AE3 é o ponto de entrada: um trimestre para sair do improviso e instalar um ritmo de gestão profissional na clínica.
            </p>
          </div>
        </div>

        {/* Page 1 Footer */}
        <div className="border-t border-[var(--border-default)] pt-3 flex items-center justify-between text-[0.65rem] text-[var(--text-tertiary)] font-subtitle">
          <span>Êxodo — Diagnóstico Estratégico de Negócio</span>
          <span>Página 01 / 02</span>
        </div>
      </div>

      {/* A4 Sheet 2 */}
      <div className="bg-[var(--branco)] text-[var(--preto)] w-full max-w-[800px] min-h-[1130px] p-8 md:p-12 shadow-2xl relative flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-4 mb-6">
            <Logo variant="mono" height={20} />
            <span className="font-subtitle text-[0.65rem] tracking-[var(--tracking-wide)] uppercase text-[var(--text-tertiary)]">
              Investimento & Acompanhamento
            </span>
          </div>

          {/* Pricing Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-0.5 bg-[var(--exodo-red)]" />
              <span className="font-subtitle font-bold text-[0.65rem] uppercase tracking-wider text-[var(--text-secondary)]">
                Investimento
              </span>
            </div>
            <h3 className="font-display text-2xl text-[var(--text-primary)] m-0 mb-3">
              O que custa começar
            </h3>

            <div className="border border-[var(--border-strong)] p-5 bg-[var(--branco)]">
              <span className="font-subtitle font-bold text-xs uppercase tracking-wide text-[var(--text-tertiary)] block mb-1">
                AE3 — Acompanhamento Estratégico Trimestral
              </span>
              <span className="font-display text-3xl text-[var(--text-primary)] block">
                R$ 1.799,00
              </span>
              <span className="font-subtitle text-xs text-[var(--text-secondary)] block mb-3">
                à vista, ou em até 3x no cartão
              </span>
              <ul className="m-0 p-0 list-none font-body text-xs text-[var(--text-secondary)] flex flex-col gap-1.5 border-t border-[var(--border-default)] pt-3">
                <li>• 3 encontros individuais de 45 minutos com estrategista</li>
                <li>• Diagnóstico, cenários e plano de ação trimestral completo</li>
                <li>• Execução semanal acompanhada + Ritual de Gestão mensal</li>
              </ul>
            </div>
          </div>

          {/* Continuity Subscription Table */}
          <div className="bg-[var(--surface-card)] p-5 mb-6">
            <span className="font-subtitle font-bold text-xs uppercase tracking-wide text-[var(--text-tertiary)] block mb-2">
              Depois do AE3 — Exemplo de Assinatura (90 Dias)
            </span>
            <table className="w-full border-collapse font-subtitle text-xs bg-[var(--branco)] border border-[var(--border-default)] mb-3">
              <thead>
                <tr className="bg-[var(--cinza-claro)] text-left">
                  <th className="p-2 uppercase text-[0.6rem] text-[var(--text-secondary)] font-bold">Prazo</th>
                  <th className="p-2 uppercase text-[0.6rem] text-[var(--text-secondary)] font-bold">Rituais de Gestão</th>
                  <th className="p-2 uppercase text-[0.6rem] text-[var(--text-secondary)] font-bold">Suporte WhatsApp</th>
                  <th className="p-2 uppercase text-[0.6rem] text-[var(--text-secondary)] font-bold text-right">Seguro SOS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2">90 dias</td>
                  <td className="p-2">1 / mês (3 total)</td>
                  <td className="p-2">1x / semana (12 total)</td>
                  <td className="p-2 text-right">Nenhum</td>
                </tr>
              </tbody>
            </table>
            <p className="font-body text-xs text-[var(--text-secondary)] m-0">
              Total para 90 dias: <strong>R$ 1.975,89</strong> — equivalente a R$ 658,63/mês (com 3% de desconto). Inclui diagnóstico revisado a cada 3 meses.
            </p>
          </div>

          {/* FAQ Overview */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-0.5 bg-[var(--exodo-red)]" />
              <span className="font-subtitle font-bold text-[0.65rem] uppercase tracking-wider text-[var(--text-secondary)]">
                Dúvidas Frequentes
              </span>
            </div>
            <div className="flex flex-col gap-2 font-body text-xs">
              <div className="border-b border-[var(--border-default)] pb-2">
                <strong className="font-subtitle text-[0.75rem] block text-[var(--text-primary)]">Para quem é o AE3?</strong>
                <span className="text-[var(--text-secondary)]">Para nutricionistas com clínica em funcionamento que buscam plano claro para 90 dias.</span>
              </div>
              <div className="border-b border-[var(--border-default)] pb-2">
                <strong className="font-subtitle text-[0.75rem] block text-[var(--text-primary)]">Os encontros são individuais?</strong>
                <span className="text-[var(--text-secondary)]">Sim, 100% individuais e online com seu estrategista dedicado.</span>
              </div>
              <div className="pb-1">
                <strong className="font-subtitle text-[0.75rem] block text-[var(--text-primary)]">O que acontece ao final do trimestre?</strong>
                <span className="text-[var(--text-secondary)]">Você decide se encerra ou segue com assinatura recorrente personalizada.</span>
              </div>
            </div>
          </div>

          {/* Final Callout */}
          <div className="text-center py-4 border-t border-[var(--border-default)]">
            <span className="font-display text-2xl text-[var(--text-primary)] block">
              Comece o trimestre com um plano, não com intenções.
            </span>
          </div>
        </div>

        {/* Page 2 Footer */}
        <div className="border-t border-[var(--border-default)] pt-3 flex items-center justify-between text-[0.65rem] text-[var(--text-tertiary)] font-subtitle">
          <span>Êxodo — Diagnóstico Estratégico de Negócio</span>
          <span>Página 02 / 02</span>
        </div>
      </div>
    </div>
  );
};
