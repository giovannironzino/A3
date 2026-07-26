import React from 'react';
import { Logo } from './Logo';
import { Button } from './UIPrimitives';
import { Calendar, FileText, Menu, X, Compass } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  onOpenBooking: () => void;
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBooking,
  viewMode,
  onToggleViewMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (viewMode !== 'landing') {
      onToggleViewMode('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-[var(--branco)] border-b border-[var(--border-default)] shadow-xs transition-all">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between h-[68px] sm:h-[76px] gap-2 sm:gap-4">
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}
          className="flex items-center gap-2 sm:gap-3 no-underline focus:outline-none shrink-0"
        >
          <Logo variant="color" height={24} className="sm:hidden" />
          <Logo variant="color" height={28} className="hidden sm:block" />
        </a>

        {/* Desktop / Tablet Nav Links */}
        <div className="hidden md:flex items-center gap-5 lg:gap-7">
          <button
            onClick={() => scrollTo('fase1')}
            className="font-subtitle text-[0.75rem] lg:text-[0.8rem] font-semibold tracking-[var(--tracking-wide)] text-[var(--text-primary)] hover:text-[var(--exodo-red)] cursor-pointer bg-transparent border-none uppercase transition-colors py-2"
          >
            Fase 01
          </button>
          <button
            onClick={() => scrollTo('fase2')}
            className="font-subtitle text-[0.75rem] lg:text-[0.8rem] font-semibold tracking-[var(--tracking-wide)] text-[var(--text-primary)] hover:text-[var(--exodo-red)] cursor-pointer bg-transparent border-none uppercase transition-colors py-2"
          >
            Fase 02
          </button>
          <button
            onClick={() => scrollTo('preco')}
            className="font-subtitle text-[0.75rem] lg:text-[0.8rem] font-semibold tracking-[var(--tracking-wide)] text-[var(--text-primary)] hover:text-[var(--exodo-red)] cursor-pointer bg-transparent border-none uppercase transition-colors py-2"
          >
            Investimento
          </button>
          <button
            onClick={() => scrollTo('simulador')}
            className="font-subtitle text-[0.75rem] lg:text-[0.8rem] font-semibold tracking-[var(--tracking-wide)] text-[var(--text-primary)] hover:text-[var(--exodo-red)] cursor-pointer bg-transparent border-none uppercase transition-colors py-2"
          >
            Simulador
          </button>
          <button
            onClick={() => scrollTo('faq')}
            className="font-subtitle text-[0.75rem] lg:text-[0.8rem] font-semibold tracking-[var(--tracking-wide)] text-[var(--text-primary)] hover:text-[var(--exodo-red)] cursor-pointer bg-transparent border-none uppercase transition-colors py-2"
          >
            Dúvidas
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => onToggleViewMode(viewMode === 'a3-app' ? 'landing' : 'a3-app')}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-[0.68rem] sm:text-[0.7rem] font-subtitle font-bold uppercase tracking-[var(--tracking-wide)] transition-colors border cursor-pointer min-h-[40px] ${
              viewMode === 'a3-app'
                ? 'bg-[var(--exodo-red)] text-white border-[var(--exodo-red)]'
                : 'bg-neutral-900 text-white border-neutral-900 hover:bg-[var(--exodo-red)] hover:border-[var(--exodo-red)]'
            }`}
            title="Acessar Área do Cliente / Sistema A3"
          >
            <Compass className="w-3.5 h-3.5 text-[var(--exodo-red)]" />
            <span>{viewMode === 'a3-app' ? 'Ver Site' : 'Sistema A3'}</span>
          </button>

          <button
            onClick={() => onToggleViewMode(viewMode === 'landing' ? 'print-report' : 'landing')}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-[0.7rem] font-subtitle font-bold uppercase tracking-[var(--tracking-wide)] text-[var(--text-secondary)] bg-[var(--cinza-claro)] hover:bg-[var(--preto)] hover:text-[var(--branco)] transition-colors border-none cursor-pointer min-h-[40px]"
            title="Alternar para visualização de relatório executivo de impressão A4"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{viewMode === 'landing' ? 'PDF/A4' : 'Interativo'}</span>
          </button>

          <Button variant="primary" size="sm" onClick={onOpenBooking} className="no-print text-[0.68rem] sm:text-[0.7rem] px-3 sm:px-4">
            <Calendar className="w-3.5 h-3.5 mr-1 inline-block" />
            <span className="hidden xs:inline">Agendar diagnóstico</span>
            <span className="xs:hidden">Agendar</span>
          </Button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[var(--text-primary)] hover:text-[var(--exodo-red)] bg-transparent border-none cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--branco)] border-b-2 border-[var(--preto)] px-5 py-6 flex flex-col gap-2 shadow-2xl animate-fadeIn">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onToggleViewMode('a3-app');
            }}
            className="flex items-center gap-2 bg-neutral-900 text-white font-subtitle font-bold text-xs uppercase px-4 py-3.5 border-none cursor-pointer min-h-[44px] mb-2"
          >
            <Compass className="w-4 h-4 text-[var(--exodo-red)]" />
            <span>Acessar Sistema A3 (Área do Cliente)</span>
          </button>
          <button
            onClick={() => scrollTo('fase1')}
            className="font-subtitle text-left text-sm font-bold uppercase text-[var(--text-primary)] hover:text-[var(--exodo-red)] bg-transparent border-none py-3 px-2 border-b border-neutral-100 min-h-[44px] flex items-center"
          >
            Fase 01 — Diagnóstico e Plano
          </button>
          <button
            onClick={() => scrollTo('fase2')}
            className="font-subtitle text-left text-sm font-bold uppercase text-[var(--text-primary)] hover:text-[var(--exodo-red)] bg-transparent border-none py-3 px-2 border-b border-neutral-100 min-h-[44px] flex items-center"
          >
            Fase 02 — Execução Semanal
          </button>
          <button
            onClick={() => scrollTo('preco')}
            className="font-subtitle text-left text-sm font-bold uppercase text-[var(--text-primary)] hover:text-[var(--exodo-red)] bg-transparent border-none py-3 px-2 border-b border-neutral-100 min-h-[44px] flex items-center"
          >
            Investimento
          </button>
          <button
            onClick={() => scrollTo('simulador')}
            className="font-subtitle text-left text-sm font-bold uppercase text-[var(--text-primary)] hover:text-[var(--exodo-red)] bg-transparent border-none py-3 px-2 border-b border-neutral-100 min-h-[44px] flex items-center"
          >
            Simulador de Assinatura
          </button>
          <button
            onClick={() => scrollTo('faq')}
            className="font-subtitle text-left text-sm font-bold uppercase text-[var(--text-primary)] hover:text-[var(--exodo-red)] bg-transparent border-none py-3 px-2 min-h-[44px] flex items-center"
          >
            Dúvidas Frequentes
          </button>
          <div className="pt-3 border-t border-[var(--border-default)] flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onToggleViewMode(viewMode === 'landing' ? 'print-report' : 'landing');
              }}
              className="flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-subtitle font-bold uppercase text-[var(--text-secondary)] bg-[var(--cinza-claro)] border-none cursor-pointer min-h-[44px]"
            >
              <FileText className="w-4 h-4" />
              <span>{viewMode === 'landing' ? 'Ver Relatório PDF/A4' : 'Voltar para Landing Page'}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

