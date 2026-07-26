import React from 'react';
import { SectionTopic, Tag, Callout } from './UIPrimitives';

export const Phase2DeepDive: React.FC = () => {
  return (
    <section id="fase2" className="py-10 sm:py-14 md:py-20 bg-[var(--surface-card)] border-b border-[var(--border-default)]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 md:px-12">
        <SectionTopic label="Fase 02 — Execução Semanal">
          O ritmo que sustenta o plano
        </SectionTopic>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5 mt-6 sm:mt-8 md:mt-10">
          <div className="bg-[var(--branco)] p-5 md:p-6 border border-[var(--border-default)] flex flex-col justify-between h-full">
            <div>
              <Tag tone="processo">Segunda</Tag>
              <h4 className="font-subtitle font-bold text-sm uppercase text-[var(--text-primary)] mt-3 mb-2">
                Envio das Ações
              </h4>
              <p className="font-body text-xs md:text-sm text-[var(--text-secondary)] m-0 leading-[var(--lh-normal)]">
                Recebe as ações prioritárias da semana e inicia a execução na clínica com a equipe.
              </p>
            </div>
          </div>

          <div className="bg-[var(--branco)] p-5 md:p-6 border border-[var(--border-default)] flex flex-col justify-between h-full">
            <div>
              <Tag tone="processo">Terça</Tag>
              <h4 className="font-subtitle font-bold text-sm uppercase text-[var(--text-primary)] mt-3 mb-2">
                Alinhamento Tático
              </h4>
              <p className="font-body text-xs md:text-sm text-[var(--text-secondary)] m-0 leading-[var(--lh-normal)]">
                Consultor disponível para alinhamento tático, ajustes de rota e esclarecimento de dúvidas.
              </p>
            </div>
          </div>

          <div className="bg-[var(--branco)] p-5 md:p-6 border border-[var(--border-default)] flex flex-col justify-between h-full">
            <div>
              <Tag tone="processo">Sexta</Tag>
              <h4 className="font-subtitle font-bold text-sm uppercase text-[var(--text-primary)] mt-3 mb-2">
                Prestação de Contas
              </h4>
              <p className="font-body text-xs md:text-sm text-[var(--text-secondary)] m-0 leading-[var(--lh-normal)]">
                Reporta o que foi e o que não foi realizado na semana, atualizando métricas e indicadores.
              </p>
            </div>
          </div>

          <div className="bg-[var(--branco)] p-5 md:p-6 border border-[var(--border-default)] flex flex-col justify-between h-full">
            <div>
              <Tag tone="processo">Domingo</Tag>
              <h4 className="font-subtitle font-bold text-sm uppercase text-[var(--text-primary)] mt-3 mb-2">
                Análise & Consolidação
              </h4>
              <p className="font-body text-xs md:text-sm text-[var(--text-secondary)] m-0 leading-[var(--lh-normal)]">
                Consultor analisa os relatórios de sexta-feira e consolida o panorama tático da clínica.
              </p>
            </div>
          </div>

          <div className="bg-[var(--branco)] p-5 md:p-6 border border-[var(--border-default)] flex flex-col justify-between h-full">
            <div>
              <Tag tone="processo">Segunda (Próx.)</Tag>
              <h4 className="font-subtitle font-bold text-sm uppercase text-[var(--text-primary)] mt-3 mb-2">
                Novo Ciclo
              </h4>
              <p className="font-body text-xs md:text-sm text-[var(--text-secondary)] m-0 leading-[var(--lh-normal)]">
                Lançamento do novo lote de prioridades com correções de rota aplicadas do ciclo anterior.
              </p>
            </div>
          </div>
        </div>

        <Callout label="Ritual de Gestão · mensal" tone="accent" className="mt-6 md:mt-8">
          Uma vez por mês, entre a última semana do mês e a primeira semana seguinte, 45 minutos com o consultor: panorama geral do mês, medição de progresso do plano de ação, ajustes de metas e análise de indicadores medidos de forma objetiva.
        </Callout>
      </div>
    </section>
  );
};
