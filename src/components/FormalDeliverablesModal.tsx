import React, { useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Layers, 
  Users, 
  Award, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  CheckSquare, 
  Square, 
  ShieldCheck, 
  TrendingUp, 
  Building2,
  Workflow,
  MessageSquare,
  BarChart2
} from 'lucide-react';
import { Button } from './UIPrimitives';
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
      <div className="bg-white border-2 border-[var(--preto)] rounded-2xl max-w-4xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* MODAL HEADER (Hidden on Print) */}
        <div className="bg-[var(--preto)] text-white p-4 sm:p-5 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
              {type === 'retrato' && <FileText className="w-5 h-5" />}
              {type === 'caminho' && <Award className="w-5 h-5 text-amber-400" />}
              {type === 'plano' && <Calendar className="w-5 h-5 text-indigo-400" />}
            </div>
            <div>
              <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-widest text-neutral-400">
                Entrega Formal • {type === 'retrato' ? 'Bloco A' : type === 'caminho' ? 'Bloco B' : 'Bloco C'}
              </span>
              <h3 className="font-title font-bold text-base sm:text-lg text-white">
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
              className="p-2 text-xs font-subtitle font-bold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Imprimir ou Salvar em PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY CONTENT */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1 font-body text-neutral-800">

          {/* ========================================================= */}
          {/* DELIVERABLE A: RETRATO DA SUA CLÍNICA HOJE (BLOCO A)       */}
          {/* ========================================================= */}
          {type === 'retrato' && (
            <div className="space-y-8">
              {/* Infographic Header Sheet */}
              <div className="border-b-2 border-neutral-900 pb-6 flex flex-wrap justify-between items-end gap-4">
                <div>
                  <div className="text-[0.65rem] font-subtitle font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block mb-2">
                    Infográfico Oficial • Diagnóstico Operacional
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-title font-bold text-[var(--preto)]">
                    Retrato da Sua Clínica Hoje
                  </h1>
                  <p className="text-xs font-subtitle text-neutral-600 mt-1">
                    {clinicName} • {userName}
                  </p>
                </div>

                <div className="text-right text-xs font-subtitle text-neutral-500">
                  <span>Data de Consolidação:</span>
                  <strong className="block text-neutral-900 font-bold">
                    {currentModelData?.approvedAt 
                      ? new Date(currentModelData.approvedAt).toLocaleDateString('pt-BR') 
                      : new Date().toLocaleDateString('pt-BR')}
                  </strong>
                </div>
              </div>

              {/* Summary KPIs Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
                  <span className="text-[0.65rem] font-subtitle font-bold uppercase text-neutral-500">
                    Portfólio Ativo
                  </span>
                  <div className="text-xl font-title font-bold text-[var(--preto)]">
                    {currentModelData?.totalProductsCount || currentModelData?.products?.length || 0} Produtos
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
                  <span className="text-[0.65rem] font-subtitle font-bold uppercase text-neutral-500">
                    Carga Horária Semanal
                  </span>
                  <div className="text-xl font-title font-bold text-[var(--preto)]">
                    {Math.round(currentModelData?.totalWeeklyClinicalHours || 0)}h / sem
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
                  <span className="text-[0.65rem] font-subtitle font-bold uppercase text-neutral-500">
                    Entregas Mensais
                  </span>
                  <div className="text-xl font-title font-bold text-[var(--preto)]">
                    {Math.round(currentModelData?.totalMonthlyDeliveryHours || 0)}h / mês
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
                  <span className="text-[0.65rem] font-subtitle font-bold uppercase text-neutral-500">
                    Pacientes Ativos
                  </span>
                  <div className="text-xl font-title font-bold text-emerald-800">
                    {currentModelData?.totalActivePatients || 0} Pacientes
                  </div>
                </div>
              </div>

              {/* The 4 Synthesis Panel Blocks (Infographic Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Portfólio & Oferta */}
                <div className="border border-neutral-300 rounded-2xl p-5 space-y-3 bg-white shadow-2xs">
                  <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <span className="p-1.5 bg-neutral-900 text-white rounded-md text-xs font-bold">1</span>
                    <h4 className="font-title font-bold text-sm text-[var(--preto)]">
                      Portfólio & Oferta de Serviços
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {currentModelData?.products && currentModelData.products.length > 0 ? (
                      currentModelData.products.map((prod, idx) => (
                        <div key={idx} className="p-2.5 bg-neutral-50 rounded-lg text-xs space-y-1">
                          <div className="flex justify-between font-bold text-neutral-900">
                            <span>{prod.name}</span>
                            <span>R$ {prod.price}</span>
                          </div>
                          <div className="text-neutral-500 text-[0.7rem] flex gap-3">
                            <span>Formato: {prod.format}</span>
                            <span>Duração: {prod.durationLabel || `${prod.durationDays} dias`}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-neutral-500 italic">Nenhum produto cadastrado.</p>
                    )}
                  </div>
                </div>

                {/* 2. Agenda & Capacidade */}
                <div className="border border-neutral-300 rounded-2xl p-5 space-y-3 bg-white shadow-2xs">
                  <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <span className="p-1.5 bg-neutral-900 text-white rounded-md text-xs font-bold">2</span>
                    <h4 className="font-title font-bold text-sm text-[var(--preto)]">
                      Agenda & Capacidade Estrutural
                    </h4>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-lg text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Disponibilidade Bruta Semanal:</span>
                      <strong className="text-neutral-900 font-bold">{Math.round(currentModelData?.totalWeeklyClinicalHours || 0)} horas</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Organização da Grade:</span>
                      <strong className="text-neutral-900 font-bold">Definida por Turnos e Bloqueios</strong>
                    </div>
                  </div>
                </div>

                {/* 3. Rotina & Entrega */}
                <div className="border border-neutral-300 rounded-2xl p-5 space-y-3 bg-white shadow-2xs">
                  <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <span className="p-1.5 bg-neutral-900 text-white rounded-md text-xs font-bold">3</span>
                    <h4 className="font-title font-bold text-sm text-[var(--preto)]">
                      Rotina & Contratos de Entrega
                    </h4>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-lg text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Carga Horária Mensal Exigida:</span>
                      <strong className="text-neutral-900 font-bold">{Math.round(currentModelData?.totalMonthlyDeliveryHours || 0)}h / mês</strong>
                    </div>
                    <p className="text-[0.72rem] text-neutral-600">
                      Horas totais dedicadas a consultas, retornos, elaboração de planos alimentares e suporte contínuo aos pacientes ativos.
                    </p>
                  </div>
                </div>

                {/* 4. Demanda & Carteira */}
                <div className="border border-neutral-300 rounded-2xl p-5 space-y-3 bg-white shadow-2xs">
                  <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                    <span className="p-1.5 bg-neutral-900 text-white rounded-md text-xs font-bold">4</span>
                    <h4 className="font-title font-bold text-sm text-[var(--preto)]">
                      Demanda & Carteira Ativa
                    </h4>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-lg text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Total de Pacientes Ativos em Acompanhamento:</span>
                      <strong className="text-emerald-800 font-bold">{currentModelData?.totalActivePatients || 0} pacientes</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Blocos de Validação Concluídos:</span>
                      <strong className="text-neutral-900 font-bold">{currentModelData?.validatedBlocksCount || 4} de 4</strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* Infographic Footer Stamp */}
              <div className="p-4 bg-neutral-900 text-white rounded-xl text-center text-xs space-y-1">
                <strong className="font-title font-bold text-emerald-400 block">
                  A3 Sistema • Bloco A "Enxergando sua clínica" Finalizado
                </strong>
                <p className="text-neutral-300 text-[0.72rem]">
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
              <div className="border-b-2 border-neutral-900 pb-6 flex flex-wrap justify-between items-end gap-4">
                <div>
                  <div className="text-[0.65rem] font-subtitle font-bold uppercase tracking-widest text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block mb-2">
                    Cartão de Decisão One-Pager • Navegador de Promessas
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-title font-bold text-[var(--preto)]">
                    O Caminho que Você Escolheu
                  </h1>
                  <p className="text-xs font-subtitle text-neutral-600 mt-1">
                    {clinicName} • {userName}
                  </p>
                </div>

                <div className="text-right text-xs font-subtitle text-neutral-500">
                  <span>Data da Confirmação:</span>
                  <strong className="block text-neutral-900 font-bold">
                    {chosenConfigData?.confirmedAt 
                      ? new Date(chosenConfigData.confirmedAt).toLocaleDateString('pt-BR') 
                      : new Date().toLocaleDateString('pt-BR')}
                  </strong>
                </div>
              </div>

              {/* Signature Phrase Featured Box */}
              <div className="bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 border-2 border-amber-300 rounded-2xl p-6 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-subtitle font-bold uppercase text-[0.7rem] tracking-wider">
                  <Award className="w-4 h-4 text-amber-700" />
                  Configuração Estratégica Selecionada
                </div>
                <h3 className="font-title font-bold text-xl sm:text-2xl text-[var(--preto)] leading-snug">
                  "{chosenConfigData?.chosenConfig?.name || 'Configuração Escolhida'}"
                </h3>
                <p className="text-sm font-title font-bold text-amber-950 italic border-l-4 border-amber-500 pl-4 py-1">
                  "{chosenConfigData?.reading?.signaturePhrase || 'Sua nova diretriz de trabalho para os próximos 90 dias.'}"
                </p>
              </div>

              {/* Before vs After Contrast Table */}
              <div className="space-y-4">
                <h4 className="font-title font-bold text-base text-[var(--preto)] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-neutral-700" />
                  Contraste Visual: O Que Muda na Sua Rotina
                </h4>

                <div className="border border-neutral-300 rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-900 text-white font-subtitle uppercase tracking-wider text-[0.65rem]">
                      <tr>
                        <th className="p-3.5">Dimensão Operacional</th>
                        <th className="p-3.5 bg-neutral-800">Retrato Atual (Bloco A)</th>
                        <th className="p-3.5 bg-emerald-900 text-emerald-300">Caminho Escolhido (Bloco B)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 font-body">
                      <tr>
                        <td className="p-3.5 font-bold text-neutral-900">Dias de Atendimento / Sem</td>
                        <td className="p-3.5 text-neutral-600">Dispersos (5-6 dias)</td>
                        <td className="p-3.5 font-bold text-emerald-900 bg-emerald-50/50">
                          {chosenConfigData?.chosenConfig?.workDaysCount} dias fixos/semana
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold text-neutral-900">Carga Horária Clínica / Sem</td>
                        <td className="p-3.5 text-neutral-600">~{Math.round(currentModelData?.totalWeeklyClinicalHours || 30)}h sem proteção</td>
                        <td className="p-3.5 font-bold text-emerald-900 bg-emerald-50/50">
                          {chosenConfigData?.reading?.weeklyClinicalHours || chosenConfigData?.chosenConfig?.weeklyClinicalHours}h protegidas
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold text-neutral-900">Tempo Reservado p/ Captação</td>
                        <td className="p-3.5 text-neutral-600">Sem horário fixo reservado</td>
                        <td className="p-3.5 font-bold text-emerald-900 bg-emerald-50/50">
                          {chosenConfigData?.reading?.weeklyAcquisitionHours || chosenConfigData?.chosenConfig?.weeklyAcquisitionHours}h exclusivas/semana
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold text-neutral-900">Teto de Pacientes Ativos</td>
                        <td className="p-3.5 text-neutral-600">{currentModelData?.totalActivePatients || 0} pacientes atuais</td>
                        <td className="p-3.5 font-bold text-emerald-900 bg-emerald-50/50">
                          Até {chosenConfigData?.reading?.maxActivePatientCapacity || chosenConfigData?.chosenConfig?.maxActivePatientCapacity} pacientes ativos
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold text-neutral-900">Modo de Alocação de Tempo</td>
                        <td className="p-3.5 text-neutral-600">Mistura de clínica e gestão</td>
                        <td className="p-3.5 font-bold text-emerald-900 bg-emerald-50/50">
                          {chosenConfigData?.reading?.allocationModeText || chosenConfigData?.chosenConfig?.allocationMode}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Decision Stamp Footer */}
              <div className="p-4 bg-neutral-900 text-white rounded-xl text-center text-xs space-y-1">
                <strong className="font-title font-bold text-amber-400 block">
                  A3 Navegador de Promessas • Decisão Estratégica Validada
                </strong>
                <p className="text-neutral-300 text-[0.72rem]">
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
              <div className="border-b-2 border-neutral-900 pb-6 flex flex-wrap justify-between items-end gap-4">
                <div>
                  <div className="text-[0.65rem] font-subtitle font-bold uppercase tracking-widest text-indigo-800 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full inline-block mb-2">
                    Checklist & Calendário Operacional • Próximos 90 Dias
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-title font-bold text-[var(--preto)]">
                    Seu Plano de Ação — Próximos 90 Dias
                  </h1>
                  <p className="text-xs font-subtitle text-neutral-600 mt-1">
                    {clinicName} • {userName}
                  </p>
                </div>

                <div className="text-right text-xs font-subtitle text-neutral-500">
                  <span>Data de Aprovação:</span>
                  <strong className="block text-neutral-900 font-bold">
                    {tacticalPlanData?.approvedAt 
                      ? new Date(tacticalPlanData.approvedAt).toLocaleDateString('pt-BR') 
                      : new Date().toLocaleDateString('pt-BR')}
                  </strong>
                </div>
              </div>

              {/* TOP FEATURED BANNER: First Action of Week 1 */}
              <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white rounded-2xl p-6 shadow-md space-y-3">
                <div className="flex items-center gap-2 font-subtitle font-bold uppercase text-[0.7rem] tracking-wider text-emerald-300">
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  Destaque Especial • Primeira Ação do Seu Plano (Semana 1)
                </div>
                <h3 className="font-title font-bold text-xl sm:text-2xl text-white">
                  1. Reestruturação da Grade Horária & Bloqueio na Agenda
                </h3>
                <p className="text-xs sm:text-sm font-body text-emerald-100 leading-relaxed">
                  Ajustar sua agenda oficial imediatamente para proteger as horas de atendimento e bloquear os horários de captação/gestão conforme a Configuração Escolhida.
                </p>
              </div>

              {/* Interactive Weekly Activities Checklist */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-title font-bold text-base text-[var(--preto)] flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-neutral-700" />
                    Cronograma de Execução Semanal (Marque o que for concluindo):
                  </h4>

                  <span className="text-xs font-subtitle text-neutral-500 font-bold bg-neutral-100 px-3 py-1 rounded-md">
                    {Object.values(checkedActivities).filter(Boolean).length} de 12 Atividades Concluídas
                  </span>
                </div>

                {tacticalPlanData?.stages ? (
                  tacticalPlanData.stages.map((stage) => (
                    <div key={stage.stageNumber} className="border border-neutral-300 rounded-2xl p-5 space-y-4 bg-neutral-50/50">
                      <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                        <span className="text-xs font-subtitle font-bold uppercase tracking-wider text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
                          {stage.monthName}
                        </span>
                        <h5 className="font-title font-bold text-sm text-[var(--preto)]">
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
                              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                                isDone 
                                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' 
                                  : 'bg-white border-neutral-200 hover:border-neutral-400 text-neutral-900'
                              }`}
                            >
                              <div className="pt-0.5 shrink-0">
                                {isDone ? (
                                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                                ) : (
                                  <Square className="w-5 h-5 text-neutral-400" />
                                )}
                              </div>

                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`text-[0.65rem] font-subtitle font-bold uppercase px-2 py-0.5 rounded ${
                                    isDone ? 'bg-emerald-200 text-emerald-900' : 'bg-neutral-200 text-neutral-800'
                                  }`}>
                                    Semana {act.weekNumber}
                                  </span>
                                  <span className="text-[0.65rem] font-subtitle text-neutral-500">
                                    {act.timeAllocationFormat}
                                  </span>
                                </div>

                                <h6 className={`font-title font-bold text-sm ${isDone ? 'line-through text-emerald-800' : 'text-neutral-900'}`}>
                                  {act.title}
                                </h6>

                                <p className="text-xs font-body leading-relaxed text-neutral-600">
                                  {act.description}
                                </p>

                                <div className="text-[0.72rem] font-subtitle text-emerald-800 font-bold pt-1">
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
                  <p className="text-xs text-neutral-500 italic">Carregando cronograma...</p>
                )}
              </div>

              {/* PHASE 2 TRANSITION OBLIGATORY NOTICE */}
              <div className="bg-neutral-900 text-white rounded-2xl p-6 space-y-4 shadow-lg border-2 border-emerald-400">
                <div className="flex items-center gap-2 text-emerald-400 font-subtitle font-bold uppercase text-[0.75rem] tracking-wider">
                  <Workflow className="w-5 h-5 text-emerald-400" />
                  Transição Obrigatória de Jornada • Próximos Passos
                </div>

                <div className="space-y-2 text-xs font-body leading-relaxed">
                  <h4 className="font-title font-bold text-base text-white">
                    A jornada da sua clínica não termina no Plano Tático!
                  </h4>
                  <p className="text-neutral-300">
                    Com a conclusão da Fase 1 (Diagnóstico, Navegador de Promessas e Plano Tático), você inicia a <strong>Fase 2 (Acompanhamento Contínuo)</strong>. O sistema acompanhará a execução deste plano semanal e mensalmente:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-subtitle">
                  <div className="p-3.5 bg-neutral-800 border border-neutral-700 rounded-xl space-y-1">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold">
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      1. Ritual Semanal de WhatsApp
                    </div>
                    <p className="text-[0.72rem] text-neutral-400 font-normal leading-normal">
                      Check-in semanal automatizado para prestar contas da execução da semana e destravar eventuais gargalos.
                    </p>
                  </div>

                  <div className="p-3.5 bg-neutral-800 border border-neutral-700 rounded-xl space-y-1">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold">
                      <BarChart2 className="w-4 h-4 text-emerald-400" />
                      2. Ritual Mensal de Gestão
                    </div>
                    <p className="text-[0.72rem] text-neutral-400 font-normal leading-normal">
                      Encontro de balanço mensal de indicadores, acompanhamento da meta de pacientes e revisão do ciclo de 30/60/90 dias.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="bg-neutral-50 p-4 border-t border-neutral-200 flex items-center justify-between shrink-0 print:hidden">
          <span className="text-xs font-subtitle text-neutral-500">
            Éxodo A3 • Sistema de Gestão para Nutricionistas
          </span>

          <Button
            onClick={onClose}
            className="bg-[var(--preto)] text-white hover:bg-neutral-800 text-xs py-2.5 px-5 rounded-xl cursor-pointer"
          >
            Fechar Visualização
          </Button>
        </div>

      </div>
    </div>
  );
};
