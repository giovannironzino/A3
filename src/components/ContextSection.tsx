import React from 'react';
import { SectionTopic, Card } from './UIPrimitives';
import { AlertCircle, LineChart, Sparkles } from 'lucide-react';

export const ContextSection: React.FC = () => {
  return (
    <section id="contexto" className="py-10 sm:py-14 md:py-20 border-b border-[var(--border-default)]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
        <div className="lg:col-span-5">
          <SectionTopic label="Contexto">
            Gestão informal tem um limite
          </SectionTopic>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-6">
          <p className="font-body text-sm sm:text-base md:text-lg leading-[var(--lh-relaxed)] text-[var(--text-secondary)] m-0">
            A maioria das nutricionistas administra a clínica no improviso: decisões tomadas por urgência, indicadores que não existem em nenhum lugar, e uma meta de faturamento que nunca virou plano.
          </p>
          <p className="font-body text-sm sm:text-base md:text-lg leading-[var(--lh-relaxed)] text-[var(--text-secondary)] m-0">
            O AE3 não vende cursos nem fórmulas prontas. É um processo estruturado, individual, para transformar o cenário atual do seu negócio em decisões e ações concretas para os próximos 90 dias.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <Card
              icon={<AlertCircle className="w-5 h-5 text-[var(--exodo-red)]" />}
              title="Sem Teoria Vazia"
            >
              Foco no seu cenário real, nos números da sua clínica e na sua rotina atual.
            </Card>
            <Card
              icon={<LineChart className="w-5 h-5 text-[var(--exodo-red)]" />}
              title="Ações Mapeadas"
            >
              Metas transformadas em entregáveis semanais claros para a equipe e gestão.
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
