import React from 'react';
import { SectionTopic, Card, Callout } from './UIPrimitives';

export const Phase1DeepDive: React.FC = () => {
  return (
    <section id="fase1" className="py-10 sm:py-14 md:py-20 border-b border-[var(--border-default)]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 md:px-12">
        <SectionTopic label="Fase 01 — Diagnóstico e Plano">
          3 encontros, 3 decisões
        </SectionTopic>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8 md:mt-10">
          <Card className="relative overflow-hidden border-t-4 border-t-[var(--preto)]">
            <div className="font-display text-4xl text-[var(--cinza-medio)] opacity-50 mb-1">
              01
            </div>
            <h4 className="font-subtitle font-bold text-sm uppercase tracking-wide text-[var(--text-tertiary)] mb-1">
              Encontro 1 — Cenário Atual
            </h4>
            <p className="font-body font-bold text-base md:text-lg leading-[var(--lh-normal)] text-[var(--text-primary)] mb-3">
              Qual o cenário do seu negócio hoje?
            </p>
            <div className="pt-3 border-t border-[var(--border-default)]">
              <span className="font-subtitle font-bold text-xs uppercase text-[var(--exodo-red)] block mb-1">
                Entrega:
              </span>
              <p className="font-body text-xs md:text-sm text-[var(--text-secondary)] m-0">
                Diagnóstico completo do cenário atual da sua clínica (faturamento, margem, retenção, gargalos).
              </p>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-t-4 border-t-[var(--exodo-red)]">
            <div className="font-display text-4xl text-[var(--exodo-red)] opacity-50 mb-1">
              02
            </div>
            <h4 className="font-subtitle font-bold text-sm uppercase tracking-wide text-[var(--text-tertiary)] mb-1">
              Encontro 2 — Cenários Possíveis
            </h4>
            <p className="font-body font-bold text-base md:text-lg leading-[var(--lh-normal)] text-[var(--text-primary)] mb-3">
              Quais os 3 melhores cenários para atingir sua meta em 90 dias?
            </p>
            <div className="pt-3 border-t border-[var(--border-default)]">
              <span className="font-subtitle font-bold text-xs uppercase text-[var(--exodo-red)] block mb-1">
                Entrega:
              </span>
              <p className="font-body text-xs md:text-sm text-[var(--text-secondary)] m-0">
                3 caminhos estratégicos com probabilidade de sucesso, exigência de esforço e retorno esperado.
              </p>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-t-4 border-t-[var(--preto)]">
            <div className="font-display text-4xl text-[var(--cinza-medio)] opacity-50 mb-1">
              03
            </div>
            <h4 className="font-subtitle font-bold text-sm uppercase tracking-wide text-[var(--text-tertiary)] mb-1">
              Encontro 3 — Plano de Ação
            </h4>
            <p className="font-body font-bold text-base md:text-lg leading-[var(--lh-normal)] text-[var(--text-primary)] mb-3">
              Escolhido o cenário, quais ações táticas para os próximos 90 dias?
            </p>
            <div className="pt-3 border-t border-[var(--border-default)]">
              <span className="font-subtitle font-bold text-xs uppercase text-[var(--exodo-red)] block mb-1">
                Entrega:
              </span>
              <p className="font-body text-xs md:text-sm text-[var(--text-secondary)] m-0">
                Plano de ação trimestral pronto, detalhado semana a semana com metas, responsáveis e prioridades.
              </p>
            </div>
          </Card>
        </div>

        <Callout label="Como funciona na prática" className="mt-8 md:mt-10">
          Os 3 encontros são individuais, com o estrategista, online, com data e horário pré-agendados. Acontecem numa janela de até 10 dias corridos, 45 minutos cada. Ao final, você tem um plano de ação para o trimestre.
        </Callout>
      </div>
    </section>
  );
};
