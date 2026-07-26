import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  PieChart, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Info, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  Edit3, 
  Layers, 
  Check, 
  AlertCircle,
  HelpCircle,
  RefreshCw,
  TrendingUp,
  Award
} from 'lucide-react';
import { Button } from './UIPrimitives';
import { A3Product, A3PortfolioItem, A3PortfolioData } from '../types';

interface PortfolioStepProps {
  products: A3Product[];
  initialPortfolioData?: A3PortfolioData | null;
  onSavePortfolioData: (data: A3PortfolioData) => void;
  onCompleteStep: () => void;
  onToast: (msg: string) => void;
}

const COLOR_PALETTE = [
  'bg-emerald-600 border-emerald-700 text-emerald-600',
  'bg-blue-600 border-blue-700 text-blue-600',
  'bg-purple-600 border-purple-700 text-purple-600',
  'bg-amber-600 border-amber-700 text-amber-600',
  'bg-rose-600 border-rose-700 text-rose-600',
  'bg-teal-600 border-teal-700 text-teal-600',
  'bg-indigo-600 border-indigo-700 text-indigo-600',
  'bg-orange-600 border-orange-700 text-orange-600',
];

const HEX_PALETTE = [
  '#059669', // emerald
  '#2563eb', // blue
  '#9333ea', // purple
  '#d97706', // amber
  '#e11d48', // rose
  '#0d9488', // teal
  '#4f46e5', // indigo
  '#ea580c', // orange
];

export const PortfolioStep: React.FC<PortfolioStepProps> = ({
  products,
  initialPortfolioData,
  onSavePortfolioData,
  onCompleteStep,
  onToast,
}) => {
  // View mode: consolidated summary view
  const [viewMode] = useState<'summary'>('summary');

  // Map products to portfolio items
  const [portfolioItems, setPortfolioItems] = useState<A3PortfolioItem[]>(() => {
    if (initialPortfolioData && initialPortfolioData.items && initialPortfolioData.items.length > 0) {
      // Merge initial data with existing products list to handle newly added or deleted products
      return products.map((prod) => {
        const found = initialPortfolioData.items.find((item) => item.productId === prod.id);
        if (found) {
          return {
            ...found,
            productName: prod.name,
            format: prod.format,
            price: prod.price,
            durationLabel: prod.durationLabel,
          };
        }
        return {
          productId: prod.id,
          productName: prod.name,
          format: prod.format,
          price: prod.price,
          durationLabel: prod.durationLabel,
          activePatients: prod.activePatients || 0,
          isEstimate: prod.isActivePatientsEstimated || false,
          isConfirmed: false,
        };
      });
    }

    // Default: initialize from products prop
    return products.map((prod) => ({
      productId: prod.id,
      productName: prod.name,
      format: prod.format,
      price: prod.price,
      durationLabel: prod.durationLabel,
      activePatients: prod.activePatients || 0,
      isEstimate: prod.isActivePatientsEstimated || false,
      isConfirmed: false,
    }));
  });

  // Re-sync if products prop changes length or items
  useEffect(() => {
    setPortfolioItems((prevItems) => {
      return products.map((prod) => {
        const existing = prevItems.find((item) => item.productId === prod.id);
        if (existing) {
          return {
            ...existing,
            productName: prod.name,
            format: prod.format,
            price: prod.price,
            durationLabel: prod.durationLabel,
            activePatients: existing.isConfirmed ? existing.activePatients : (prod.activePatients || 0),
            isEstimate: prod.isActivePatientsEstimated || false,
          };
        }
        return {
          productId: prod.id,
          productName: prod.name,
          format: prod.format,
          price: prod.price,
          durationLabel: prod.durationLabel,
          activePatients: prod.activePatients || 0,
          isEstimate: prod.isActivePatientsEstimated || false,
          isConfirmed: true,
        };
      });
    });
  }, [products]);

  // Calculations
  const totalActivePatients = useMemo(() => {
    return portfolioItems.reduce((acc, item) => acc + (Number(item.activePatients) || 0), 0);
  }, [portfolioItems]);

  const confirmedCount = useMemo(() => {
    return portfolioItems.filter((i) => i.isConfirmed).length;
  }, [portfolioItems]);

  const progressPercentage = useMemo(() => {
    if (portfolioItems.length === 0) return 0;
    return Math.round((confirmedCount / portfolioItems.length) * 100);
  }, [confirmedCount, portfolioItems.length]);

  // Handlers for active patient quantity updates
  const handleUpdatePatients = (index: number, count: number, isEstimate?: boolean) => {
    const validCount = Math.max(0, Math.floor(count));
    setPortfolioItems((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = {
          ...next[index],
          activePatients: validCount,
          isEstimate: isEstimate !== undefined ? isEstimate : next[index].isEstimate,
          isConfirmed: true,
        };
      }
      return next;
    });
  };

  const handleToggleEstimate = (index: number) => {
    setPortfolioItems((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = {
          ...next[index],
          isEstimate: !next[index].isEstimate,
        };
      }
      return next;
    });
  };

  const handleSaveData = (markCompleted: boolean = false) => {
    const dataToSave: A3PortfolioData = {
      items: portfolioItems,
      totalActivePatients,
      isCompleted: markCompleted || (progressPercentage === 100 && portfolioItems.length > 0),
      updatedAt: new Date().toISOString(),
    };

    onSavePortfolioData(dataToSave);

    if (markCompleted) {
      onToast('Etapa "Carteira Atual" concluída e validada com sucesso!');
      onCompleteStep();
    } else {
      onToast('Dados da Carteira Atual salvos com sucesso!');
    }
  };

  // If no products registered yet
  if (products.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-[var(--areia)]/40 border border-amber-300/80 rounded-2xl p-6 sm:p-8 text-center max-w-2xl mx-auto shadow-sm">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-700">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-title font-bold text-[var(--preto)] mb-2">
            Nenhum Produto Cadastrado Anteriormente
          </h3>
          <p className="text-sm font-body text-neutral-600 mb-6 leading-relaxed">
            A etapa <strong>Carteira Atual</strong> requer que você tenha produtos e serviços cadastrados no Passo 01. Por favor, retorne à etapa de Produtos & Serviços para cadastrar sua oferta comercial antes de mapear sua carteira de pacientes.
          </p>
          <Button
            onClick={() => onToast('Por favor, selecione a aba "01. Produtos & Serviços" no topo para cadastrar seus produtos.')}
            className="bg-[var(--preto)] text-white hover:bg-neutral-800"
          >
            Ir para Produtos & Serviços
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner & Context Section */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--areia)]/50 to-transparent rounded-bl-full -z-0 pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[var(--preto)] text-white rounded-xl shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-subtitle font-bold uppercase tracking-widest text-neutral-500">
                  Etapa 05 • Anamnese Comercial & Operacional
                </span>
                <h2 className="text-2xl sm:text-3xl font-title font-bold text-[var(--preto)]">
                  Carteira Atual de Pacientes
                </h2>
              </div>
            </div>

            {/* Quick Stat pill */}
            <div className="bg-[var(--areia)]/60 border border-neutral-300/70 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--preto)] text-white flex items-center justify-center font-bold text-sm">
                {totalActivePatients}
              </div>
              <div>
                <div className="text-[0.65rem] font-subtitle uppercase tracking-wider text-neutral-500 font-bold">
                  Total de Pacientes Ativos
                </div>
                <div className="text-xs font-title font-bold text-[var(--preto)]">
                  em {portfolioItems.length} produto{portfolioItems.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Context & Privacy Messages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="md:col-span-2 bg-neutral-50/80 border border-neutral-200/80 rounded-xl p-4 text-xs text-neutral-700 space-y-1.5">
              <div className="flex items-center gap-2 font-subtitle font-bold text-[var(--preto)] uppercase text-[0.7rem] tracking-wider">
                <Info className="w-4 h-4 text-blue-600" />
                Consolidação da Carteira
              </div>
              <p className="leading-relaxed font-body">
                Esta etapa consolida automaticamente os pacientes ativos informados na etapa de Produtos e Serviços. Se necessário, você pode realizar ajustes rápidos diretamente na tabela abaixo.
              </p>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 text-xs text-emerald-900 space-y-1.5">
              <div className="flex items-center gap-2 font-subtitle font-bold text-emerald-800 uppercase text-[0.7rem] tracking-wider">
                <Lock className="w-4 h-4 text-emerald-600" />
                Garantia de Privacidade
              </div>
              <p className="leading-relaxed font-body text-emerald-800/90">
                Nunca solicitamos nomes de pacientes, prontuários ou dados clínicos individuais. Trabalhamos exclusivamente com quantitativos de pacientes ativos por produto.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONSOLIDATED SUMMARY VIEW */}
      <div className="space-y-8 animate-fadeIn">
          {/* Summary Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Total Patients Card */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="p-3.5 bg-[var(--preto)] text-white rounded-2xl">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wider text-neutral-500 block">
                  Total de Pacientes Ativos
                </span>
                <div className="text-3xl font-title font-bold text-[var(--preto)]">
                  {totalActivePatients}{' '}
                  <span className="text-xs font-body font-normal text-neutral-500">pacientes</span>
                </div>
                <p className="text-[0.7rem] font-body text-neutral-500 mt-0.5">
                  Carteira atual mapeada na clínica
                </p>
              </div>
            </div>

            {/* Product Mix Card */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="p-3.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-2xl">
                <Layers className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wider text-neutral-500 block">
                  Diversificação de Produtos
                </span>
                <div className="text-2xl font-title font-bold text-[var(--preto)]">
                  {portfolioItems.filter((i) => i.activePatients > 0).length} de {portfolioItems.length}
                </div>
                <p className="text-[0.7rem] font-body text-neutral-500 mt-0.5">
                  produtos possuem pacientes ativos hoje
                </p>
              </div>
            </div>

            {/* Top Product Card */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="p-3.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wider text-neutral-500 block">
                  Maior Ocupação
                </span>
                {(() => {
                  const sorted = [...portfolioItems].sort((a, b) => b.activePatients - a.activePatients);
                  const top = sorted[0];
                  if (!top || top.activePatients === 0) {
                    return (
                      <div className="text-sm font-title font-bold text-neutral-400">
                        Nenhum paciente registrado
                      </div>
                    );
                  }
                  const pct = totalActivePatients > 0 ? Math.round((top.activePatients / totalActivePatients) * 100) : 0;
                  return (
                    <div>
                      <div className="text-base font-title font-bold text-[var(--preto)] truncate max-w-[180px]">
                        {top.productName}
                      </div>
                      <p className="text-[0.7rem] font-body text-emerald-700 font-bold">
                        {top.activePatients} pacientes ({pct}% da carteira)
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Visual Distribution Stack Bar */}
          {totalActivePatients > 0 && (
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-subtitle font-bold text-[var(--preto)] uppercase tracking-wider flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-neutral-700" />
                  Distribuição Percentual da Carteira Atual
                </h3>
                <span className="text-xs font-body text-neutral-500">
                  Total acumulado: {totalActivePatients} pacientes
                </span>
              </div>

              {/* Stack Bar */}
              <div className="w-full h-6 bg-neutral-100 rounded-xl overflow-hidden flex border border-neutral-200">
                {portfolioItems.map((item, idx) => {
                  if (item.activePatients <= 0) return null;
                  const pct = (item.activePatients / totalActivePatients) * 100;
                  const hex = HEX_PALETTE[idx % HEX_PALETTE.length];
                  return (
                    <div
                      key={item.productId}
                      className="h-full transition-all duration-300 relative group cursor-pointer"
                      style={{ width: `${pct}%`, backgroundColor: hex }}
                      title={`${item.productName}: ${item.activePatients} pacientes (${Math.round(pct)}%)`}
                    />
                  );
                })}
              </div>

              {/* Color legend */}
              <div className="flex flex-wrap gap-4 pt-1">
                {portfolioItems.map((item, idx) => {
                  const pct = totalActivePatients > 0 ? Math.round((item.activePatients / totalActivePatients) * 100) : 0;
                  const hex = HEX_PALETTE[idx % HEX_PALETTE.length];
                  return (
                    <div key={item.productId} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: hex }} />
                      <span className="font-subtitle font-bold text-neutral-800">{item.productName}:</span>
                      <span className="font-body text-neutral-600">
                        {item.activePatients} ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Products Portfolio Table / List */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h3 className="text-lg font-title font-bold text-[var(--preto)]">
                Detalhamento e Ajustes da Carteira por Produto
              </h3>
              <p className="text-xs font-body text-neutral-500">
                Você pode ajustar rapidamente a quantidade de pacientes ativos de qualquer produto diretamente nesta tabela.
              </p>
            </div>

            <div className="space-y-4">
              {portfolioItems.map((item, idx) => {
                const pct = totalActivePatients > 0 ? Math.round((item.activePatients / totalActivePatients) * 100) : 0;
                const colorClass = COLOR_PALETTE[idx % COLOR_PALETTE.length].split(' ')[0];

                return (
                  <div
                    key={item.productId}
                    className="bg-neutral-50/70 border border-neutral-200 rounded-xl p-4 sm:p-5 hover:border-neutral-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-3.5 h-12 rounded-lg ${colorClass} shrink-0 mt-0.5`} />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-title font-bold text-[var(--preto)]">
                            {item.productName}
                          </h4>
                          {item.format && (
                            <span className="text-[0.65rem] font-subtitle uppercase tracking-wider px-2 py-0.5 rounded bg-white text-neutral-600 border border-neutral-200">
                              {item.format}
                            </span>
                          )}
                          {item.isEstimate && (
                            <span className="text-[0.65rem] font-subtitle uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                              Estimado
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-body text-neutral-500">
                          {item.durationLabel && <span>Duração: {item.durationLabel}</span>}
                          {item.price !== undefined && (
                            <span>Valor: R$ {item.price.toLocaleString('pt-BR')}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls & Percentage Badge */}
                    <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-200">
                      {/* Share Badge */}
                      <div className="text-right">
                        <span className="text-[0.65rem] font-subtitle uppercase tracking-wider text-neutral-400 block font-bold">
                          Participação
                        </span>
                        <span className="text-sm font-title font-bold text-[var(--preto)]">
                          {pct}%
                        </span>
                      </div>

                      {/* Numeric +/- Controller */}
                      <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-neutral-300">
                        <button
                          type="button"
                          onClick={() => handleUpdatePatients(idx, item.activePatients - 1)}
                          className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <input
                          type="number"
                          min="0"
                          value={item.activePatients}
                          onChange={(e) => handleUpdatePatients(idx, parseInt(e.target.value) || 0)}
                          className="w-14 text-center font-title font-bold text-base text-[var(--preto)] border-0 focus:ring-0 p-0"
                        />

                        <button
                          type="button"
                          onClick={() => handleUpdatePatients(idx, item.activePatients + 1)}
                          className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Bar & Step Completion */}
          <div className="bg-[var(--areia)]/50 border border-neutral-300 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-sm font-subtitle font-bold text-[var(--preto)] uppercase tracking-wider flex items-center justify-center sm:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Carteira Consolidada da Operação
              </h4>
              <p className="text-xs font-body text-neutral-600 max-w-xl">
                Essas informações serão integradas ao <strong>Modelo Atual</strong> para calcular a ocupação total da clínica e gerar o diagnóstico da operação.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleSaveData(false)}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-subtitle font-bold text-neutral-700 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Salvar Rascunho
              </button>

              <Button
                onClick={() => handleSaveData(true)}
                className="w-full sm:w-auto bg-[var(--preto)] text-white hover:bg-neutral-800 flex items-center justify-center gap-2 py-3 px-6 shadow-md"
              >
                Concluir & Validar Carteira Atual <CheckCircle2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
    </div>
  );
};
