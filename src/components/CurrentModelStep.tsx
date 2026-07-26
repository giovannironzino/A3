import React, { useState, useMemo } from 'react';
import {
  Building2,
  Package,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Edit3,
  Check,
  ShieldCheck,
  Layers,
  FileText,
  FileCheck2
} from 'lucide-react';
import { Button, Tag, Callout } from './UIPrimitives';
import {
  A3Product,
  A3ScheduleData,
  A3TimeLibraryData,
  A3DeliveryContractsData,
  A3PortfolioData,
  A3CurrentModel
} from '../types';

interface CurrentModelStepProps {
  products: A3Product[];
  scheduleData: A3ScheduleData | null;
  timeLibraryData: A3TimeLibraryData | null;
  deliveryContractsData: A3DeliveryContractsData | null;
  portfolioData: A3PortfolioData | null;
  initialModelData?: A3CurrentModel | null;
  onSaveModel: (model: A3CurrentModel) => void;
  onNavigateToStage: (stage: 'products' | 'schedule' | 'time-library' | 'delivery-contracts' | 'portfolio') => void;
  onCompleteStep: () => void;
  onToast: (msg: string) => void;
}

export const CurrentModelStep: React.FC<CurrentModelStepProps> = ({
  products,
  scheduleData,
  timeLibraryData,
  deliveryContractsData,
  portfolioData,
  initialModelData,
  onSaveModel,
  onNavigateToStage,
  onCompleteStep,
  onToast,
}) => {
  // Track block validations
  const [validatedBlocks, setValidatedBlocks] = useState<{ [key: string]: boolean }>(() => {
    return {
      block1_products: true,
      block2_schedule: !!scheduleData?.isCompleted,
      block3_activities: !!timeLibraryData?.isCompleted || !!deliveryContractsData?.isCompleted,
      block4_portfolio: !!portfolioData?.isCompleted,
    };
  });

  const [isApproved, setIsApproved] = useState<boolean>(initialModelData?.isApproved || false);

  // Consolidated Math
  const totalProductsCount = products.length;

  const totalWeeklyClinicalHours = useMemo(() => {
    if (!scheduleData || !scheduleData.occupancy) return 0;
    return scheduleData.occupancy.reduce((acc, item) => acc + (item.totalHoursPerWeek || 0), 0);
  }, [scheduleData]);

  const totalMonthlyDeliveryHours = useMemo(() => {
    return deliveryContractsData?.totalClinicMonthlyDeliveryHours || 0;
  }, [deliveryContractsData]);

  const totalActivePatients = useMemo(() => {
    if (portfolioData && portfolioData.totalActivePatients !== undefined) {
      return portfolioData.totalActivePatients;
    }
    return products.reduce((acc, p) => acc + (p.activePatients || 0), 0);
  }, [portfolioData, products]);

  const portfolioItems = useMemo(() => {
    if (portfolioData && portfolioData.items && portfolioData.items.length > 0) {
      return portfolioData.items;
    }
    return products.map((p) => ({
      productId: p.id,
      productName: p.name,
      activePatients: p.activePatients || 0,
      format: p.format,
      price: p.price,
    }));
  }, [portfolioData, products]);

  const toggleBlockValidation = (blockKey: string) => {
    setValidatedBlocks((prev) => {
      const next = { ...prev, [blockKey]: !prev[blockKey] };
      onToast(next[blockKey] ? 'Bloco marcado como conferido!' : 'Bloco desmarcado para revisão.');
      return next;
    });
  };

  const handleApproveAndSave = (approve: boolean = true) => {
    const consolidatedModel: A3CurrentModel = {
      products,
      schedule: scheduleData,
      timeLibrary: timeLibraryData,
      deliveryContracts: deliveryContractsData,
      portfolio: portfolioData,
      totalProductsCount,
      totalWeeklyClinicalHours,
      totalMonthlyDeliveryHours,
      totalActivePatients,
      validatedBlocksCount: Object.values(validatedBlocks).filter(Boolean).length,
      isApproved: approve,
      approvedAt: approve ? new Date().toISOString() : undefined,
    };

    onSaveModel(consolidatedModel);
    setIsApproved(approve);

    if (approve) {
      onToast('Modelo Atual aprovado e confirmado como fonte de verdade da clínica!');
      onCompleteStep();
    } else {
      onToast('Rascunho do Modelo Atual salvo.');
    }
  };

  const blockNumberBadge = (n: string) => (
    <div className="w-10 h-10 bg-[var(--preto)] text-white border border-[var(--preto)] flex items-center justify-center font-bold shrink-0">
      {n}
    </div>
  );

  const confirmButtonClass = (validated: boolean) =>
    `text-xs font-subtitle font-bold px-3 py-1.5 border flex items-center gap-1.5 cursor-pointer transition-colors ${
      validated
        ? 'bg-[var(--accent-tint)] text-[var(--exodo-red)] border-[var(--exodo-red)]'
        : 'bg-[var(--cinza-claro)] text-[var(--cinza-medio)] border-[var(--border-default)]'
    }`;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[var(--branco)] border border-[var(--border-strong)] p-6 sm:p-8 relative overflow-hidden">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-default)] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[var(--preto)] text-white">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-subtitle font-bold uppercase tracking-widest text-[var(--cinza-medio)]">
                  Consolidação Final • Anamnese Operacional
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-[var(--preto)]">
                  Modelo Atual da Clínica
                </h2>
              </div>
            </div>

            {/* Approved status pill */}
            <div className="flex items-center gap-2">
              {isApproved ? (
                <Tag tone="diagnostico" className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Modelo Atual Aprovado
                </Tag>
              ) : (
                <Tag tone="informacao" className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4" />
                  Aguardando Validação
                </Tag>
              )}
            </div>
          </div>

          {/* Introductory Explanation */}
          <Callout label="Retrato Integrado da Operação">
            Reunimos automaticamente todas as informações das etapas anteriores (Produtos, Agenda, Biblioteca de Tempos, Contratos de Entrega e Carteira de Pacientes) em um <strong>retrato único e fiel da sua clínica hoje</strong>. Confira se as informações correspondem à sua rotina atual.
          </Callout>
        </div>
      </div>

      {/* Operational Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[var(--branco)] border border-[var(--border-default)] p-5 space-y-1">
          <div className="flex items-center justify-between text-[var(--cinza-medio)]">
            <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wider">Portfólio Ativo</span>
            <Package className="w-4 h-4 text-[var(--exodo-red)]" />
          </div>
          <div className="text-2xl font-display font-bold text-[var(--preto)]">
            {totalProductsCount} {totalProductsCount === 1 ? 'produto' : 'produtos'}
          </div>
          <p className="text-[0.7rem] font-body text-[var(--cinza-medio)]">Cadastrados no sistema</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-[var(--branco)] border border-[var(--border-default)] p-5 space-y-1">
          <div className="flex items-center justify-between text-[var(--cinza-medio)]">
            <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wider">Agenda Semanal</span>
            <Calendar className="w-4 h-4 text-[var(--exodo-red)]" />
          </div>
          <div className="text-2xl font-display font-bold text-[var(--preto)]">
            {totalWeeklyClinicalHours}h <span className="text-xs font-normal text-[var(--cinza-medio)]">/semana</span>
          </div>
          <p className="text-[0.7rem] font-body text-[var(--cinza-medio)]">Disponibilidade clínica total</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-[var(--branco)] border border-[var(--border-default)] p-5 space-y-1">
          <div className="flex items-center justify-between text-[var(--cinza-medio)]">
            <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wider">Carga de Entrega</span>
            <Clock className="w-4 h-4 text-[var(--exodo-red)]" />
          </div>
          <div className="text-2xl font-display font-bold text-[var(--preto)]">
            {totalMonthlyDeliveryHours}h <span className="text-xs font-normal text-[var(--cinza-medio)]">/mês</span>
          </div>
          <p className="text-[0.7rem] font-body text-[var(--cinza-medio)]">Dedicadas à carteira de pacientes</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-[var(--branco)] border border-[var(--border-default)] p-5 space-y-1">
          <div className="flex items-center justify-between text-[var(--cinza-medio)]">
            <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wider">Carteira de Pacientes</span>
            <Users className="w-4 h-4 text-[var(--exodo-red)]" />
          </div>
          <div className="text-2xl font-display font-bold text-[var(--preto)]">
            {totalActivePatients} <span className="text-xs font-normal text-[var(--cinza-medio)]">ativos</span>
          </div>
          <p className="text-[0.7rem] font-body text-[var(--cinza-medio)]">Distribuição total da clínica</p>
        </div>
      </div>

      {/* 4 LARGE OPERATIONAL SYNTHESIS BLOCKS */}
      <div className="space-y-6">
        <h3 className="text-lg font-display font-bold text-[var(--preto)] flex items-center gap-2">
          <Layers className="w-5 h-5 text-[var(--exodo-red)]" />
          Revisão por Blocos da Operação
        </h3>

        {/* BLOCO 1: PORTFÓLIO E OFERTA */}
        <div className={`bg-[var(--branco)] border-2 p-6 transition-colors space-y-5 ${
          validatedBlocks.block1_products ? 'border-[var(--border-default)]' : 'border-[var(--exodo-red)]'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-default)] pb-4">
            <div className="flex items-center gap-3">
              {blockNumberBadge('01')}
              <div>
                <h4 className="text-base font-display font-bold text-[var(--preto)] flex items-center gap-2">
                  Portfólio de Produtos & Serviços
                </h4>
                <p className="text-xs font-body text-[var(--cinza-medio)]">
                  {products.length} {products.length === 1 ? 'produto cadastrado' : 'produtos cadastrados'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => onNavigateToStage('products')}
                className="text-xs font-subtitle font-bold text-[var(--cinza-escuro)] hover:text-[var(--preto)] border border-[var(--border-default)] px-3 py-1.5 hover:bg-[var(--cinza-claro)] flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Editar no Passo 01
              </button>

              <button
                type="button"
                onClick={() => toggleBlockValidation('block1_products')}
                className={confirmButtonClass(validatedBlocks.block1_products)}
              >
                <Check className="w-3.5 h-3.5" />
                {validatedBlocks.block1_products ? 'Conferido' : 'Marcar Conferido'}
              </button>
            </div>
          </div>

          {/* Block Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="bg-[var(--cinza-claro)] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[0.65rem] font-subtitle uppercase tracking-wider px-2 py-0.5 bg-[var(--branco)] border border-[var(--border-default)] font-bold text-[var(--cinza-escuro)]">
                    {p.format || 'Serviço'}
                  </span>
                  <span className="text-xs font-display font-bold text-[var(--preto)]">
                    R$ {p.price?.toLocaleString('pt-BR')}
                  </span>
                </div>
                <h5 className="font-display font-bold text-sm text-[var(--preto)]">{p.name}</h5>
                {p.durationLabel && (
                  <p className="text-[0.7rem] font-body text-[var(--cinza-medio)]">Duração: {p.durationLabel}</p>
                )}
                {p.targetAudience && (
                  <p className="text-[0.7rem] font-body text-[var(--cinza-escuro)] italic line-clamp-2">
                    "{p.targetAudience}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* BLOCO 2: AGENDA E DISPONIBILIDADE */}
        <div className={`bg-[var(--branco)] border-2 p-6 transition-colors space-y-5 ${
          validatedBlocks.block2_schedule ? 'border-[var(--border-default)]' : 'border-[var(--exodo-red)]'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-default)] pb-4">
            <div className="flex items-center gap-3">
              {blockNumberBadge('02')}
              <div>
                <h4 className="text-base font-display font-bold text-[var(--preto)] flex items-center gap-2">
                  Agenda Atual & Disponibilidade Semanal
                </h4>
                <p className="text-xs font-body text-[var(--cinza-medio)]">
                  {totalWeeklyClinicalHours} horas clínicas semanais estruturadas
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => onNavigateToStage('schedule')}
                className="text-xs font-subtitle font-bold text-[var(--cinza-escuro)] hover:text-[var(--preto)] border border-[var(--border-default)] px-3 py-1.5 hover:bg-[var(--cinza-claro)] flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Editar no Passo 02
              </button>

              <button
                type="button"
                onClick={() => toggleBlockValidation('block2_schedule')}
                className={confirmButtonClass(validatedBlocks.block2_schedule)}
              >
                <Check className="w-3.5 h-3.5" />
                {validatedBlocks.block2_schedule ? 'Conferido' : 'Marcar Conferido'}
              </button>
            </div>
          </div>

          {/* Schedule Breakdown */}
          {scheduleData && scheduleData.occupancy && scheduleData.occupancy.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scheduleData.occupancy.map((occ) => (
                <div key={occ.dayOfWeek} className="bg-[var(--cinza-claro)] p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-2">
                    <span className="font-display font-bold text-sm text-[var(--preto)]">
                      {occ.dayLabel}
                    </span>
                    <span className="text-xs font-subtitle font-bold text-[var(--exodo-red)] bg-[var(--branco)] px-2 py-0.5 border border-[var(--exodo-red)]">
                      {occ.totalHoursPerWeek}h no dia
                    </span>
                  </div>
                  <div className="text-xs font-body text-[var(--cinza-escuro)] space-y-1">
                    <div className="flex justify-between">
                      <span>Períodos de Atendimento:</span>
                      <span className="font-bold text-[var(--preto)]">{occ.shifts?.join(', ') || 'Não informado'}</span>
                    </div>
                    {occ.dailyNotes && (
                      <p className="text-[0.7rem] text-[var(--cinza-medio)] italic">
                        Nota: {occ.dailyNotes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[var(--cinza-claro)] p-4 text-xs font-body text-[var(--cinza-escuro)]">
              Agenda ainda não preenchida completamente. Clique em "Editar no Passo 02" para configurar seus horários de atendimento.
            </div>
          )}
        </div>

        {/* BLOCO 3: ROTINA OPERACIONAL, TEMPOS E CONTRATOS */}
        <div className={`bg-[var(--branco)] border-2 p-6 transition-colors space-y-5 ${
          validatedBlocks.block3_activities ? 'border-[var(--border-default)]' : 'border-[var(--exodo-red)]'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-default)] pb-4">
            <div className="flex items-center gap-3">
              {blockNumberBadge('03')}
              <div>
                <h4 className="text-base font-display font-bold text-[var(--preto)] flex items-center gap-2">
                  Biblioteca de Tempos & Contratos de Entrega
                </h4>
                <p className="text-xs font-body text-[var(--cinza-medio)]">
                  {totalMonthlyDeliveryHours}h mensais estimadas de entrega clínica direta
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => onNavigateToStage('time-library')}
                className="text-xs font-subtitle font-bold text-[var(--cinza-escuro)] hover:text-[var(--preto)] border border-[var(--border-default)] px-3 py-1.5 hover:bg-[var(--cinza-claro)] flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Editar Tempos (Passo 03)
              </button>
              <button
                type="button"
                onClick={() => onNavigateToStage('delivery-contracts')}
                className="text-xs font-subtitle font-bold text-[var(--cinza-escuro)] hover:text-[var(--preto)] border border-[var(--border-default)] px-3 py-1.5 hover:bg-[var(--cinza-claro)] flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Editar Contratos (Passo 04)
              </button>

              <button
                type="button"
                onClick={() => toggleBlockValidation('block3_activities')}
                className={confirmButtonClass(validatedBlocks.block3_activities)}
              >
                <Check className="w-3.5 h-3.5" />
                {validatedBlocks.block3_activities ? 'Conferido' : 'Marcar Conferido'}
              </button>
            </div>
          </div>

          {/* Activities and Standard Times summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Standard Times Box */}
            <div className="bg-[var(--cinza-claro)] p-4 space-y-3">
              <h5 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--cinza-escuro)] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--exodo-red)]" />
                Tempos Padrão de Atendimento
              </h5>
              <div className="space-y-1.5 text-xs font-body text-[var(--cinza-escuro)]">
                <div className="flex justify-between border-b border-[var(--border-default)] pb-1">
                  <span>Primeira Consulta / Anamnese:</span>
                  <span className="font-bold text-[var(--preto)]">
                    {timeLibraryData?.standardInitialConsultationMinutes || 60} min
                  </span>
                </div>
                <div className="flex justify-between border-b border-[var(--border-default)] pb-1">
                  <span>Consulta de Retorno / Acompanhamento:</span>
                  <span className="font-bold text-[var(--preto)]">
                    {timeLibraryData?.standardFollowupConsultationMinutes || 40} min
                  </span>
                </div>
                <div className="flex justify-between border-b border-[var(--border-default)] pb-1">
                  <span>Elaboração de Plano / Bastidores:</span>
                  <span className="font-bold text-[var(--preto)]">
                    {timeLibraryData?.standardPlanDraftingMinutes || 30} min
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Suporte entre Consultas (por paciente):</span>
                  <span className="font-bold text-[var(--preto)]">
                    {timeLibraryData?.standardSupportMinutesPerMonth || 20} min/mês
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Contracts Box */}
            <div className="bg-[var(--cinza-claro)] p-4 space-y-3">
              <h5 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--cinza-escuro)] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[var(--exodo-red)]" />
                Entrega Prevista em Contrato
              </h5>
              {deliveryContractsData?.contracts && deliveryContractsData.contracts.length > 0 ? (
                <div className="space-y-1.5 text-xs font-body text-[var(--cinza-escuro)]">
                  {deliveryContractsData.contracts.slice(0, 3).map((c) => (
                    <div key={c.productId} className="flex justify-between border-b border-[var(--border-default)] pb-1">
                      <span className="truncate max-w-[180px] font-bold">{c.productName}:</span>
                      <span>
                        {c.initialConsultationsCount} initial / {c.followupConsultationsCount} retornos ({c.totalHoursPerPatientInCycle}h/paciente)
                      </span>
                    </div>
                  ))}
                  {deliveryContractsData.contracts.length > 3 && (
                    <p className="text-[0.7rem] text-[var(--cinza-medio)] font-subtitle">
                      + {deliveryContractsData.contracts.length - 3} outros contratos cadastrados
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-[var(--cinza-medio)] italic">
                  Contratos de entrega definidos com base na biblioteca de tempos padrão.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* BLOCO 4: DEMANDA E CARTEIRA DE PACIENTES */}
        <div className={`bg-[var(--branco)] border-2 p-6 transition-colors space-y-5 ${
          validatedBlocks.block4_portfolio ? 'border-[var(--border-default)]' : 'border-[var(--exodo-red)]'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-default)] pb-4">
            <div className="flex items-center gap-3">
              {blockNumberBadge('04')}
              <div>
                <h4 className="text-base font-display font-bold text-[var(--preto)] flex items-center gap-2">
                  Demanda & Carteira de Pacientes
                </h4>
                <p className="text-xs font-body text-[var(--cinza-medio)]">
                  {totalActivePatients} pacientes ativos atualmente na clínica
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => onNavigateToStage('portfolio')}
                className="text-xs font-subtitle font-bold text-[var(--cinza-escuro)] hover:text-[var(--preto)] border border-[var(--border-default)] px-3 py-1.5 hover:bg-[var(--cinza-claro)] flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Editar no Passo 05
              </button>

              <button
                type="button"
                onClick={() => toggleBlockValidation('block4_portfolio')}
                className={confirmButtonClass(validatedBlocks.block4_portfolio)}
              >
                <Check className="w-3.5 h-3.5" />
                {validatedBlocks.block4_portfolio ? 'Conferido' : 'Marcar Conferido'}
              </button>
            </div>
          </div>

          {/* Portfolio breakdown table */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {portfolioItems.map((item) => {
                const pct = totalActivePatients > 0 ? Math.round((item.activePatients / totalActivePatients) * 100) : 0;
                return (
                  <div key={item.productId} className="bg-[var(--cinza-claro)] p-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-xs text-[var(--preto)] truncate max-w-[160px]">
                        {item.productName}
                      </span>
                      <span className="text-[0.65rem] font-subtitle font-bold px-2 py-0.5 bg-[var(--accent-tint)] text-[var(--exodo-red)]">
                        {pct}%
                      </span>
                    </div>
                    <div className="text-xl font-display font-bold text-[var(--preto)]">
                      {item.activePatients} <span className="text-xs font-normal text-[var(--cinza-medio)]">pacientes</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* FINAL CONFIRMATION & APPROVAL BOX */}
      <div className="bg-[var(--cinza-claro)] border-2 border-[var(--preto)] p-6 sm:p-8 space-y-6">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <div className="w-12 h-12 bg-[var(--preto)] text-white flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-[var(--preto)]">
            Esse retrato representa corretamente como sua clínica funciona hoje?
          </h3>
          <p className="text-xs sm:text-sm font-body text-[var(--cinza-escuro)] leading-relaxed">
            Ao aprovar o Modelo Atual, você confirma que a síntese acima é fiel à sua rotina presente. A partir deste ponto, utilizaremos essa estrutura como ponto de partida oficial para definir suas Expectativas e planejar a evolução da sua operação.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => handleApproveAndSave(false)}
            className="w-full sm:w-auto px-5 py-3 text-xs font-subtitle font-bold text-[var(--cinza-escuro)] bg-[var(--branco)] border border-[var(--border-strong)] hover:bg-[var(--cinza-claro)] transition-colors cursor-pointer"
          >
            Salvar Rascunho sem Aprovação
          </button>

          <Button variant="primary" size="lg" onClick={() => handleApproveAndSave(true)} className="w-full sm:w-auto">
            Aprovar e Confirmar Retrato da Clínica <CheckCircle2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
