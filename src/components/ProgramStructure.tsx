import React from 'react';
import { SectionTopic, Card, Tag } from './UIPrimitives';
import { ArrowRight } from 'lucide-react';

interface ProgramStructureProps {
  onGoToPhase1: () => void;
  onGoToPhase2: () => void;
}

export const ProgramStructure: React.FC<ProgramStructureProps> = ({
  onGoToPhase1,
  onGoToPhase2,
}) => {
  return (
    <section className="py-14 md:py-20 bg-[var(--surface-card)] border-b border-[var(--border-default)]">
      <div className="max-w-[1120px] mx-auto px-5 md:px-12">
        <SectionTopic label="Estrutura do Programa">
          Duas fases, um único objetivo: sair da intenção para o plano de ação
        </SectionTopic>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 md:mt-10">
          <div 
            onClick={onGoToPhase1}
            className="cursor-pointer group transition-all duration-200"
          >
            <Card className="h-full group-hover:border-[var(--exodo-red)] group-hover:shadow-md transition-all">
              <div className="mb-2">
                <Tag tone="diagnostico">3 encontros · 10 dias</Tag>
              </div>
              <h3 className="font-subtitle font-bold text-lg uppercase tracking-[var(--tracking-wide)] text-[var(--text-primary)] group-hover:text-[var(--exodo-red)] transition-colors flex items-center justify-between">
                <span>Fase 01 — Diagnóstico e Plano</span>
                <ArrowRight className="w-5 h-5 text-[var(--exodo-red)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="font-body text-sm md:text-base leading-[var(--lh-normal)] text-[var(--text-secondary)] m-0">
                3 encontros individuais com o estrategista, 45 minutos cada, terminam num plano de ação trimestral claro e objetivo.
              </p>
            </Card>
          </div>

          <div 
            onClick={onGoToPhase2}
            className="cursor-pointer group transition-all duration-200"
          >
            <Card className="h-full group-hover:border-[var(--exodo-red)] group-hover:shadow-md transition-all">
              <div className="mb-2">
                <Tag tone="evidencia">Ritmo semanal + ritual mensal</Tag>
              </div>
              <h3 className="font-subtitle font-bold text-lg uppercase tracking-[var(--tracking-wide)] text-[var(--text-primary)] group-hover:text-[var(--exodo-red)] transition-colors flex items-center justify-between">
                <span>Fase 02 — Execução Semanal</span>
                <ArrowRight className="w-5 h-5 text-[var(--exodo-red)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="font-body text-sm md:text-base leading-[var(--lh-normal)] text-[var(--text-secondary)] m-0">
                Cadência semanal de execução com o consultor disponível, mais um Ritual de Gestão mensal para medir avanços e ajustar o rumo.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
