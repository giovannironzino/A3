import React from 'react';
import { Button, CornerAccent } from './UIPrimitives';
import { Calendar, ArrowDown, Clock, Target, CheckCircle2, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onScrollToContent: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onScrollToContent }) => {
  return (
    <section id="hero" className="relative pt-10 sm:pt-14 md:pt-20 pb-12 sm:pb-16 md:pb-24 border-b border-[var(--border-default)] overflow-hidden">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 md:px-12 relative">
        {/* Corner Accent Graphic */}
        <CornerAccent
          variant="arredondado"
          size={100}
          className="absolute -top-8 right-4 sm:right-6 md:right-12 pointer-events-none opacity-60 sm:opacity-80 md:opacity-100"
        />

        <div className="max-w-[820px] relative z-10 flex flex-col gap-4 sm:gap-6">
          {/* Index Header */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="font-subtitle font-bold text-xs md:text-sm uppercase tracking-[var(--tracking-wider)] text-[var(--exodo-red)]">
              AE3
            </span>
            <div className="w-5 sm:w-6 h-[1px] bg-[var(--border-strong)]" />
            <span className="font-subtitle font-bold text-[0.7rem] sm:text-xs md:text-sm uppercase tracking-[var(--tracking-wider)] text-[var(--text-secondary)]">
              Acompanhamento Estratégico Trimestral
            </span>
          </div>

          {/* Main Question */}
          <h1 className="font-display font-extrabold text-[var(--text-question)] leading-[1.08] tracking-[var(--tracking-tight)] text-[var(--text-primary)] m-0">
            Sua clínica de nutrição cresce por decisão, ou por acaso?
          </h1>

          {/* Intro Text */}
          <p className="font-body text-sm sm:text-base md:text-xl leading-[var(--lh-relaxed)] text-[var(--text-secondary)] m-0 max-w-[680px]">
            O AE3 é o programa de entrada da Êxodo: 3 encontros individuais que transformam o diagnóstico do seu negócio em um plano de ação executável nos próximos 90 dias.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-2 sm:mt-4 w-full sm:w-auto">
            <Button variant="primary" size="lg" onClick={onOpenBooking} className="w-full sm:w-auto">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Agendar diagnóstico</span>
            </Button>
            <Button variant="tertiary" size="lg" onClick={onScrollToContent} className="w-full sm:w-auto">
              <span>Ver como funciona</span>
              <ArrowDown className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Quick Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[var(--border-default)]">
            <div className="flex items-start gap-3 bg-[var(--surface-card)] sm:bg-transparent p-3 sm:p-0">
              <CheckCircle2 className="w-5 h-5 text-[var(--exodo-red)] shrink-0 mt-0.5" />
              <div>
                <span className="font-subtitle font-bold text-xs uppercase tracking-wide block text-[var(--text-primary)]">
                  3 Encontros
                </span>
                <span className="text-xs text-[var(--text-tertiary)]">100% Individuais</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[var(--surface-card)] sm:bg-transparent p-3 sm:p-0">
              <Clock className="w-5 h-5 text-[var(--exodo-red)] shrink-0 mt-0.5" />
              <div>
                <span className="font-subtitle font-bold text-xs uppercase tracking-wide block text-[var(--text-primary)]">
                  Até 10 Dias
                </span>
                <span className="text-xs text-[var(--text-tertiary)]">Fase de Diagnóstico</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[var(--surface-card)] sm:bg-transparent p-3 sm:p-0">
              <Target className="w-5 h-5 text-[var(--exodo-red)] shrink-0 mt-0.5" />
              <div>
                <span className="font-subtitle font-bold text-xs uppercase tracking-wide block text-[var(--text-primary)]">
                  Plano Trimestral
                </span>
                <span className="text-xs text-[var(--text-tertiary)]">90 Dias de Foco</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[var(--surface-card)] sm:bg-transparent p-3 sm:p-0">
              <ShieldCheck className="w-5 h-5 text-[var(--exodo-red)] shrink-0 mt-0.5" />
              <div>
                <span className="font-subtitle font-bold text-xs uppercase tracking-wide block text-[var(--text-primary)]">
                  Acompanhado
                </span>
                <span className="text-xs text-[var(--text-tertiary)]">Estrategista Dedicado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
