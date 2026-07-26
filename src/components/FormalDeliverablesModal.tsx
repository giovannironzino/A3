import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  Calendar,
  Award,
  Sparkles,
  FileText,
  CheckSquare,
  Square,
  TrendingUp,
  Workflow,
  MessageSquare,
  BarChart2
} from 'lucide-react';
import { Button, Tag } from './UIPrimitives';
import {
  A3CurrentModel,
  A3ChosenConfigurationData,
  A3TacticalPlanData,
  A3Product,
  A3TacticalActivity
} from '../types';

interface FormalDeliverablesModalProps {
  type: 'retrato' | 'caminho' | 'plano' | null;
  onClose: () => void;
  currentModelData?: A3CurrentModel | null;
  chosenConfigData?: A3ChosenConfigurationData | null;
  tacticalPlanData?: A3TacticalPlanData | null;
  userName?: string;
  clinicName?: string;
}

export const FormalDeliverablesModal: React.FC<FormalDeliverablesModalProps> = ({
  type,
  onClose,
  currentModelData,
  chosenConfigData,
  tacticalPlanData,
  userName = 'Nutricionista',
  clinicName = 'Consultório de Nutrição',
}) => {
  // State for checkable activities in Deliverable C
  const [checkedActivities, setCheckedActivities] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('exodo_a3_checked_activities');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('exodo_a3_checked_activities', JSON.stringify(checkedActivities));
  }, [checkedActivities]);

  if (!type) return null;

  const toggleCheckActivity = (actId: string) => {
    setCheckedActivities(prev => ({ ...prev, [actId]: !prev[actId] }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50 overflow-y-auto animate-fadeIn print:bg-white print:p-0 print:static print:inset-auto">
      <div className="bg-[var(--branco)] border-2 border-[var(--preto)] max-w-4xl w-full my-auto overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none">

        {/* MODAL HEADER (Hidden on Print) */}
        <div className="bg-[var(--preto)] text-[var(--branco)] p-4 sm:p-5 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--branco)]/10 text-[var(--exodo-red)]">
              {type === 'retrato' && <FileText className="w-5 h-5" />}
              {type === 'caminho' && <Award className="w-5 h-5" />}
              {type === 'plano' && <Calendar className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wide text-[var(--cinza-medio)]">
                Entrega Formal • {type === 'retrato' ? 'Bloco A' : type === 'caminho' ? 'Bloco B' : 'Bloco C'}
              </span>
              <h3 className="font-display font-bold text-base sm:text-lg text-[var(--branco)]">
                {type === 'retrato' && 'Retrato da Sua Clínica Hoje'}
                {type === 'caminho' && 'O Caminho que Você Escolheu'}
                {type === 'plano' && 'Seu Plano de Ação — Próximos 90 Dias'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 text-xs font-subtitle font-bold text-[var(--cinza-claro)] hover:text-[var(--branco)] bg-[var(--branco)]/10 hover:bg-[var(--branco)]/20 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Imprimir ou Salvar em PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[var(--cinza-medio)] hover:text-[var(--branco)] hover:bg-[var(--branco)]/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY CONTENT */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1 font-body text-[var(--cinza-escuro)]">

          {/* ========================================================= */}
          {/* DELIVERABLE A: RETRATO DA SUA CLÍNICA HOJE (BLOCO A)       */}
          {/* ========================================================= */}
          {type === 'retrato' && (
            <div className="space-y-8">
              {/* Infographic Header Sheet */}
              <div className="border-b-2 border-[var(--preto)] pb-6 flex flex-wrap justify-between items-end gap-4">
                <div>
                  <Tag tone="evidencia" className="mb-2">Infográfico Oficial • Diagnóstico Operacional</Tag>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--preto)]">
                    Retrato da Sua Clínica Hoje
                  </h1>
                  <p className="text-xs font-subtitle text-[var(--cinza-medio)] mt-1">
                    {clinicName} • {userName}
                  </p>
                </div>

                <div className="text-right text-xs font-subtitle text-[var(--cinza-medio)]">
                  <span>Data de Consolidação:</span>
                  <strong className="block text-[var(--preto)] font-bold">
                    {currentModelData?.approvedAt
                      ? new Date(currentModelData.approvedAt).toLocaleDateString('pt-BR')
                      : new Date().toLocaleDateString('pt-BR')}
                  </strong>
                </div>
              </div>

              {/* Summary KPIs Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-[var(--cinza-claro)] space-y-1">
                  <span className="text-[0.65rem] font-subtitle font-bold uppercase text-[var(--cinza-medio)]">
                    Portfólio Ativo
                  </span>
                  <div className="text-xl font-display font-bold text-[var(--preto)]">
                    {currentModelData?.totalProductsCount || currentModelData?.products?.length || 0} Produtos
                  </div>
                </div>

                <div className="p-4 bg-[var(--cinza-claro)] space-y-1">
                  <span className="text-[0.65rem] font-subtitle font-bold uppercase text-[var(--cinza-medio)]">
                    Carga Horária Semanal
                  </span>
                  <div className="text-xl font-display font-bold text-[var(--preto)]">
                    {Math.round(currentModelData?.totalWeeklyClinicalHours || 0)}h / sem
                  </div>
                </div>

                <div className="p-4 bg-[var(--cinza-claro)] space-y-1">
                  <span className="text-[0.65rem] font-subtitle font-bold uppercase text-[var(--cinza-medio)]">
                    Entregas Mensais
                  </span>
                  <div className="text-xl font-display font-bold text-[var(--preto)]">
                    {Math.round(currentModelData?.totalMonthlyDeliveryHours || 0)}h / mês
                  </div>
                </div>

                <div className="p-4 bg-[var(--cinza-claro)] space-y-1">
                  <span className="text-[0.65rem] font-subtitle font-bold uppercase text-[var(--cinza-medio)]">
                    Pacientes Ativos
                  </span>
                  <div className="text-xl font-display font-bold text-[var(--exodo-red)]">
                    {currentModelData?.totalActivePatients || 0} Pacientes
                  </div>
                </div>
              </div>

              {/* The 4 Synthesis Panel Blocks (Infographic Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Portfólio & Oferta */}
                <div className="border border-[var(--border-default)] p-5 space-y-3 bg-[var(--branco)]">
                  <div className="flex items-center gap-2 border-b border-[var(--border-default)] pb-2">
                    <span className="w-6 h-6 flex items-center justify-center bg-[var(--preto)] text-[var(--branco)] text-xs font-bold shrink-0">1</span>
                    <h4 className="font-display font-bold text-sm text-[var(--preto)]">
                      Portfólio & Oferta de Serviços
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {currentModelData?.products && currentModelData.products.length > 0 ? (
                      currentModelData.products.map((prod, idx) => (
                        <div key={idx} className="p-2.5 bg-[var(--cinza-claro)] text-xs space-y-1">
                          <div className="flex justify-between font-bold text-[var(--preto)]">
                            <span>{prod.name}</span>
                            <span>R$ {prod.price}</span>
                          </div>
                          <div className="text-[var(--cinza-medio)] text-[0.7rem] flex gap-3">
                            <span>Formato: {prod.format}</span>
                            <span>Duração: {prod.durationLabel || `${prod.durationDays} dias`}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[var(--cinza-medio)] italic">Nenhum produto cadastrado.</p>
                    )}
                  </div>
                </div>

                {/* 2. Agenda & Capacidade */}
                <div className="border border-[var(--border-default)] p-5 space-y-3 bg-[var(--branco)]">
                  <div className="flex items-center gap-2 border-b border-[var(--border-default)] pb-2">
                    <span className="w-6 h-6 flex items-center justify-center bg-[var(--preto)] text-[var(--branco)] text-xs font-bold shrink-0">2</span>
                    <h4 className="font-display font-bold text-sm text-[var(--preto)]">
                      Agenda & Capacidade Estrutural
                    </h4>
                  </div>
                  <div className="p-3 bg-[var(--cinza-claro)] text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[var(--cinza-escuro)]">Disponibilidade Bruta Semanal:</span>
                      <strong className="text-[var(--preto)] font-bold">{Math.round(currentModelData?.totalWeeklyClinicalHours || 0)} horas</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--cinza-escuro)]">Organização da Grade:</span>
                      <strong className="text-[var(--preto)] font-bold">Definida por Turnos e Bloqueios</strong>
                    </div>
                  </div>
                </div>

                {/* 3. Rotina & Entrega */}
                <div className="border border-[var(--border-default)] p-5 space-y-3 bg-[var(--branco)]">
                  <div className="flex items-center gap-2 border-b border-[var(--border-default)] pb-2">
                    <span className="w-6 h-6 flex items-center justify-center bg-[var(--preto)] text-[var(--branco)] text-xs font-bold shrink-0">3</span>
                    <h4 className="font-display font-bold text-sm text-[var(--preto)]">
                      Rotina & Contratos de Entrega
                    </h4>
                  </div>
                  <div className="p-3 bg-[var(--cinza-claro)] text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[var(--cinza-escuro)]">Carga Horária Mensal Exigida:</span>
                      <strong className="text-[var(--preto)] font-bold">{Math.round(currentModelData?.totalMonthlyDeliveryHours || 0)}h / mês</strong>
                    </div>
                    <p className="text-[0.72rem] text-[var(--cinza-escuro)]">
                      Horas totais dedicadas a consultas, retornos, elaboração de planos alimentares e suporte contínuo aos pacientes ativos.
                    </p>
                  </div>
                </div>

                {/* 4. Demanda & Carteira */}
                <div className="border border-[var(--border-default)] p-5 space-y-3 bg-[var(--branco)]">
                  <div className="flex items-center gap-2 border-b border-[var(--border-default)] pb-2">
                    <span className="w-6 h-6 flex items-center justify-center bg-[var(--preto)] text-[var(--branco)] text-xs font-bold shrink-0">4</span>
                    <h4 className="font-display font-bold text-sm text-[var(--preto)]">
                      Demanda & Carteira Ativa
                    </h4>
                  </div>
                  <div className="p-3 bg-[var(--cinza-claro)] text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[var(--cinza-escuro)]">Total de Pacientes Ativos em Acompanhamento:</span>
                      <strong className="text-[var(--exodo-red)] font-bold">{currentModelData?.totalActivePatients || 0} pacientes</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--cinza-escuro)]">Blocos de Validação Concluídos:</span>
                      <strong className="text-[var(--preto)] font-bold">{currentModelData?.validatedBlocksCount || 4} de 4</strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* Infographic Footer Stamp */}
              <div className="p-4 bg-[var(--preto)] text-[var(--branco)] text-center text-xs space-y-1">
                <strong className="font-display font-bold text-[var(--exodo-red)] block">
                  A3 Sistema • Bloco A "Enxergando sua clínica" Finalizado
                </strong>
                <p className="text-[var(--cinza-claro)] text-[0.72rem]">
                  Este documento consolida a fotografia exata do Modelo Atual de operação, servindo de base para o Navegador de Promessas.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* DELIVERABLE B: O CAMINHO QUE VOCÊ ESCOLHEU (BLOCO B)       */}
          {/* ========================================================= */}
          {type === 'caminho' && (
            <div className="space-y-8">
              {/* Decision Card Header */}
              <div className="border-b-2 border-[var(--preto)] pb-6 flex flex-wrap justify-between items-end gap-4">
                <div>
                  <Tag tone="evidencia" className="mb-2">Cartão de Decisão One-Pager • Navegador de Promessas</Tag>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--preto)]">
                    O Caminho que Você Escolheu
                  </h1>
                  <p className="text-xs font-subtitle text-[var(--cinza-medio)] mt-1">
                    {clinicName} • {userName}
                  </p>
                </div>

                <div className="text-right text-xs font-subtitle text-[var(--cinza-medio)]">
                  <span>Data da Confirmação:</span>
                  <strong className="block text-[var(--preto)] font-bold">
                    {chosenConfigData?.confirmedAt
                      ? new Date(chosenConfigData.confirmedAt).toLocaleDateString('pt-BR')
                      : new Date().toLocaleDateString('pt-BR')}
                  </strong>
                </div>
              </div>

              {/* Signature Phrase Featured Box */}
              <div className="bg-[var(--branco)] border-2 border-[var(--exodo-red)] p-6 space-y-3">
                <div className="flex items-center gap-2 text-[var(--exodo-red)] font-subtitle font-bold uppercase text-[0.7rem] tracking-wide">
                  <Award className="w-4 h-4" />
                  Configuração Estratégica Selecionada
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-[var(--preto)] leading-snug">
                  "{chosenConfigData?.chosenConfig?.name || 'Configuração Escolhida'}"
                </h3>
                <p className="text-sm font-display text-[var(--preto)] border-l-4 border-[var(--exodo-red)] pl-4 py-1">
                  "{chosenConfigData?.reading?.signaturePhrase || 'Sua nova diretriz de trabalho para os próximos 90 dias.'}"
                </p>
              </div>

              {/* Before vs After Contrast Table */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-base text-[var(--preto)] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[var(--exodo-red)]" />
                  Contraste Visual: O Que Muda na Sua Rotina
                </h4>

                <div className="border border-[var(--border-strong)] overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[var(--preto)] text-[var(--branco)] font-subtitle uppercase tracking-wide text-[0.65rem]">
                      <tr>
                        <th className="p-3.5">Dimensão Operacional</th>
                        <th className="p-3.5 bg-[var(--cinza-escuro)]">Retrato Atual (Bloco A)</th>
                        <th className="p-3.5 bg-[var(--exodo-red)]">Caminho Escolhido (Bloco B)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-default)] font-body">
                      <tr>
                        <td className="p-3.5 font-bold text-[var(--preto)]">Dias de Atendimento / Sem</td>
                        <td className="p-3.5 text-[var(--cinza-escuro)]">Dispersos (5-6 dias)</td>
                        <td className="p-3.5 font-bold text-[var(--preto)] bg-[var(--accent-tint)]">
                          {chosenConfigData?.chosenConfig?.workDaysCount} dias fixos/semana
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold text-[var(--preto)]">Carga Horária Clínica / Sem</td>
                        <td className="p-3.5 text-[var(--cinza-escuro)]">~{Math.round(currentModelData?.totalWeeklyClinicalHours || 30)}h sem proteção</td>
                        <td className="p-3.5 font-bold text-[var(--preto)] bg-[var(--accent-tint)]">
                          {chosenConfigData?.reading?.weeklyClinicalHours || chosenConfigData?.chosenConfig?.weeklyClinicalHours}h protegidas
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold text-[var(--preto)]">Tempo Reservado p/ Captação</td>
                        <td className="p-3.5 text-[var(--cinza-escuro)]">Sem horário fixo reservado</td>
                        <td className="p-3.5 font-bold text-[var(--preto)] bg-[var(--accent-tint)]">
                          {chosenConfigData?.reading?.weeklyAcquisitionHours || chosenConfigData?.chosenConfig?.weeklyAcquisitionHours}h exclusivas/semana
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold text-[var(--preto)]">Teto de Pacientes Ativos</td>
                        <td className="p-3.5 text-[var(--cinza-escuro)]">{currentModelData?.totalActivePatients || 0} pacientes atuais</td>
                        <td className="p-3.5 font-bold text-[var(--preto)] bg-[var(--accent-tint)]">
                          Até {chosenConfigData?.reading?.maxActivePatientCapacity || chosenConfigData?.chosenConfig?.maxActivePatientCapacity} pacientes ativos
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold text-[var(--preto)]">Modo de Alocação de Tempo</td>
                        <td className="p-3.5 text-[var(--cinza-escuro)]">Mistura de clínica e gestão</td>
                        <td className="p-3.5 font-bold text-[var(--preto)] bg-[var(--accent-tint)]">
                          {chosenConfigData?.reading?.allocationModeText || chosenConfigData?.chosenConfig?.allocationMode}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Decision Stamp Footer */}
              <div className="p-4 bg-[var(--preto)] text-[var(--branco)] text-center text-xs space-y-1">
                <strong className="font-display font-bold text-[var(--exodo-red)] block">
                  A3 Navegador de Promessas • Decisão Estratégica Validada
                </strong>
                <p className="text-[var(--cinza-claro)] text-[0.72rem]">
                  Este cartão oficializa a escolha realizada no Navegador. A partir deste ponto, o Plano Tático transforma esta escolha em ação.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* DELIVERABLE C: SEU PLANO DE AÇÃO 90 DIAS (BLOCO C)         */}
          {/* ========================================================= */}
          {type === 'plano' && (
            <div className="space-y-8">
              {/* Deliverable Header */}
              <div className="border-b-2 border-[var(--preto)] pb-6 flex flex-wrap justify-between items-end gap-4">
                <div>
                  <Tag tone="evidencia" className="mb-2">Checklist & Calendário Operacional • Próximos 90 Dias</Tag>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--preto)]">
                    Seu Plano de Ação — Próximos 90 Dias
                  </h1>
                  <p className="text-xs font-subtitle text-[var(--cinza-medio)] mt-1">
                    {clinicName} • {userName}
                  </p>
                </div>

                <div className="text-right text-xs font-subtitle text-[var(--cinza-medio)]">
                  <span>Data de Aprovação:</span>
                  <strong className="block text-[var(--preto)] font-bold">
                    {tacticalPlanData?.approvedAt
                      ? new Date(tacticalPlanData.approvedAt).toLocaleDateString('pt-BR')
                      : new Date().toLocaleDateString('pt-BR')}
                  </strong>
                </div>
              </div>

              {/* TOP FEATURED BANNER: First Action of Week 1 */}
              <div className="bg-[var(--preto)] text-[var(--branco)] p-6 space-y-3">
                <div className="flex items-center gap-2 font-subtitle font-bold uppercase text-[0.7rem] tracking-wide text-[var(--exodo-red)]">
                  <Sparkles className="w-4 h-4" />
                  Destaque Especial • Primeira Ação do Seu Plano (Semana 1)
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-[var(--branco)]">
                  1. Reestruturação da Grade Horária & Bloqueio na Agenda
                </h3>
                <p className="text-xs sm:text-sm font-body text-[var(--cinza-claro)] leading-relaxed">
                  Ajustar sua agenda oficial imediatamente para proteger as horas de atendimento e bloquear os horários de captação/gestão conforme a Configuração Escolhida.
                </p>
              </div>

              {/* Interactive Weekly Activities Checklist */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-base text-[var(--preto)] flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-[var(--exodo-red)]" />
                    Cronograma de Execução Semanal (Marque o que for concluindo):
                  </h4>

                  <span className="text-xs font-subtitle text-[var(--cinza-medio)] font-bold bg-[var(--cinza-claro)] px-3 py-1">
                    {Object.values(checkedActivities).filter(Boolean).length} de 12 Atividades Concluídas
                  </span>
                </div>

                {tacticalPlanData?.stages ? (
                  tacticalPlanData.stages.map((stage) => (
                    <div key={stage.stageNumber} className="border border-[var(--border-default)] p-5 space-y-4 bg-[var(--branco)]">
                      <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-2">
                        <span className="text-xs font-subtitle font-bold uppercase tracking-wide text-[var(--exodo-red)] bg-[var(--accent-tint)] px-2.5 py-1">
                          {stage.monthName}
                        </span>
                        <h5 className="font-display font-bold text-sm text-[var(--preto)]">
                          {stage.title}
                        </h5>
                      </div>

                      <div className="space-y-3">
                        {stage.activities.map((act) => {
                          const isDone = !!checkedActivities[act.id];

                          return (
                            <div
                              key={act.id}
                              onClick={() => toggleCheckActivity(act.id)}
                              className={`p-4 border transition-colors cursor-pointer flex items-start gap-3 ${
                                isDone
                                  ? 'bg-[var(--accent-tint)] border-[var(--exodo-red)] text-[var(--preto)]'
                                  : 'bg-[var(--branco)] border-[var(--border-default)] hover:border-[var(--cinza-medio)] text-[var(--preto)]'
                              }`}
                            >
                              <div className="pt-0.5 shrink-0">
                                {isDone ? (
                                  <CheckSquare className="w-5 h-5 text-[var(--exodo-red)]" />
                                ) : (
                                  <Square className="w-5 h-5 text-[var(--cinza-medio)]" />
                                )}
                              </div>

                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`text-[0.65rem] font-subtitle font-bold uppercase px-2 py-0.5 ${
                                    isDone ? 'bg-[var(--exodo-red)] text-[var(--branco)]' : 'bg-[var(--cinza-claro)] text-[var(--cinza-escuro)]'
                                  }`}>
                                    Semana {act.weekNumber}
                                  </span>
                                  <span className="text-[0.65rem] font-subtitle text-[var(--cinza-medio)]">
                                    {act.timeAllocationFormat}
                                  </span>
                                </div>

                                <h6 className={`font-display font-bold text-sm ${isDone ? 'line-through text-[var(--cinza-escuro)]' : 'text-[var(--preto)]'}`}>
                                  {act.title}
                                </h6>

                                <p className="text-xs font-body leading-relaxed text-[var(--cinza-escuro)]">
                                  {act.description}
                                </p>

                                <div className="text-[0.72rem] font-subtitle text-[var(--preto)] font-bold pt-1">
                                  Resultado Esperado: {act.expectedResult}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[var(--cinza-medio)] italic">Carregando cronograma...</p>
                )}
              </div>

              {/* PHASE 2 TRANSITION OBLIGATORY NOTICE */}
              <div className="bg-[var(--preto)] text-[var(--branco)] p-6 space-y-4 border-2 border-[var(--exodo-red)]">
                <div className="flex items-center gap-2 text-[var(--exodo-red)] font-subtitle font-bold uppercase text-[0.75rem] tracking-wide">
                  <Workflow className="w-5 h-5" />
                  Transição Obrigatória de Jornada • Próximos Passos
                </div>

                <div className="space-y-2 text-xs font-body leading-relaxed">
                  <h4 className="font-display font-bold text-base text-[var(--branco)]">
                    A jornada da sua clínica não termina no Plano Tático!
                  </h4>
                  <p className="text-[var(--cinza-claro)]">
                    Com a conclusão da Fase 1 (Diagnóstico, Navegador de Promessas e Plano Tático), você inicia a <strong>Fase 2 (Acompanhamento Contínuo)</strong>. O sistema acompanhará a execução deste plano semanal e mensalmente:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-subtitle">
                  <div className="p-3.5 bg-[var(--branco)]/5 border border-[var(--cinza-escuro)] space-y-1">
                    <div className="flex items-center gap-2 text-[var(--exodo-red)] font-bold">
                      <MessageSquare className="w-4 h-4" />
                      1. Ritual Semanal de WhatsApp
                    </div>
                    <p className="text-[0.72rem] text-[var(--cinza-medio)] font-normal leading-normal">
                      Check-in semanal automatizado para prestar contas da execução da semana e destravar eventuais gargalos.
                    </p>
                  </div>

                  <div className="p-3.5 bg-[var(--branco)]/5 border border-[var(--cinza-escuro)] space-y-1">
                    <div className="flex items-center gap-2 text-[var(--exodo-red)] font-bold">
                      <BarChart2 className="w-4 h-4" />
                      2. Ritual Mensal de Gestão
                    </div>
                    <p className="text-[0.72rem] text-[var(--cinza-medio)] font-normal leading-normal">
                      Encontro de balanço mensal de indicadores, acompanhamento da meta de pacientes e revisão do ciclo de 30/60/90 dias.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="bg-[var(--cinza-claro)] p-4 border-t border-[var(--border-default)] flex items-center justify-between shrink-0 print:hidden">
          <span className="text-xs font-subtitle text-[var(--cinza-medio)]">
            Éxodo A3 • Sistema de Gestão para Nutricionistas
          </span>

          <Button variant="primary" size="md" onClick={onClose}>
            Fechar Visualização
          </Button>
        </div>

      </div>
    </div>
  );
};
