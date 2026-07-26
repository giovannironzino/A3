import React from 'react';
import { Logo } from './Logo';
import { Button, CornerAccent } from './UIPrimitives';
import { Calendar, FileText } from 'lucide-react';
import { ViewMode } from '../types';

interface FooterProps {
  onOpenBooking: () => void;
  onToggleViewMode: (mode: ViewMode) => void;
  viewMode: ViewMode;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onToggleViewMode,
  viewMode,
}) => {
  return (
    <footer>
      {/* Pre-footer Call To Action */}
      <section className="py-10 sm:py-16 md:py-24 relative overflow-hidden bg-[var(--branco)] border-b border-[var(--border-default)]">
        <CornerAccent
          variant="diagonal"
          size={120}
          className="absolute bottom-0 left-0 pointer-events-none opacity-60 sm:opacity-80"
        />

        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 md:px-12 text-center flex flex-col items-center gap-4 sm:gap-6 relative z-10">
          <h2 className="font-display text-[var(--text-display)] text-[var(--text-primary)] max-w-[680px] leading-[var(--lh-tight)] m-0">
            Comece o trimestre com um plano, não com intenções.
          </h2>

          <p className="font-body text-sm sm:text-base text-[var(--text-secondary)] max-w-[520px] m-0">
            Três encontros para redefinir o ritmo da sua clínica de nutrição.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-center mt-2 w-full sm:w-auto">
            <Button variant="primary" size="lg" onClick={onOpenBooking} className="w-full sm:w-auto">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Agendar diagnóstico</span>
            </Button>

            <button
              onClick={() => onToggleViewMode(viewMode === 'landing' ? 'print-report' : 'landing')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-subtitle font-bold uppercase tracking-[var(--tracking-wide)] text-[var(--text-secondary)] bg-[var(--cinza-claro)] hover:bg-[var(--preto)] hover:text-[var(--branco)] transition-colors border-none cursor-pointer min-h-[48px] w-full sm:w-auto"
            >
              <FileText className="w-4 h-4" />
              <span>Visualizar Relatório Executivo A4</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <div className="bg-[var(--branco)] py-6 sm:py-8 border-t border-[var(--border-default)]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo variant="mono" height={22} />

          <span className="font-subtitle text-xs text-[var(--text-tertiary)] text-center sm:text-right">
            Êxodo — Diagnóstico Estratégico de Negócio © {new Date().getFullYear()}. Todos os direitos reservados.
          </span>
        </div>
      </div>
    </footer>
  );
};
