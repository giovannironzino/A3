import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  ListOrdered, 
  Target, 
  ChevronDown, 
  ChevronUp, 
  Compass, 
  Award,
  Check,
  RotateCcw,
  FileText,
  Workflow
} from 'lucide-react';
import { Button } from './UIPrimitives';
import { 
  A3ChosenConfigurationData, 
  A3CurrentModel, 
  A3TacticalPlanData, 
  A3TacticalStage, 
  A3TacticalActivity 
} from '../types';
import { generateTacticalPlan } from '../lib/tacticalPlanEngine';

interface TacticalPlanStepProps {
  chosenChoice?: A3ChosenConfigurationData | null;
  currentModel?: A3CurrentModel | null;
  savedPlan?: A3TacticalPlanData | null;
  onSavePlan: (data: A3TacticalPlanData) => void;
  onCompleteStep: () => void;
  onToast: (msg: string) => void;
}

export const TacticalPlanStep: React.FC<TacticalPlanStepProps> = ({
  chosenChoice,
  currentModel,
  savedPlan: initialSavedPlan,
  onSavePlan,
  onCompleteStep,
  onToast,
}) => {
  // Generate or load plan
  const [plan, setPlan] = useState<A3TacticalPlanData | null>(() => {
    if (initialSavedPlan && initialSavedPlan.stages?.length > 0) {
      return initialSavedPlan;
    }
    if (chosenChoice) {
      return generateTacticalPlan(chosenChoice, currentModel);
    }
    return null;
  });

  const [activeStageTab, setActiveStageTab] = useState<number>(1);
  const [expandedActivities, setExpandedActivities] = useState<Record<string, boolean>>({});
  const [showApprovalModal, setShowApprovalModal] = useState<boolean>(false);
  const [userFeedbackText, setUserFeedbackText] = useState<string>(initialSavedPlan?.userFeedback || '');
  const [isApprovedLocked, setIsApprovedLocked] = useState<boolean>(!!initialSavedPlan?.isApproved);

  if (!chosenChoice || !chosenChoice.chosenConfig) {
    return (
      <div className="p-12 text-center bg-white border border-dashed border-neutral-300 rounded-2xl space-y-4 animate-fadeIn">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h3 className="font-title font-bold text-lg text-[var(--preto)]">
          Configuração Não Selecionada
        </h3>
        <p className="text-xs font-body text-neutral-600 max-w-md mx-auto">
          Para visualizar o Plano Tático de 90 Dias, você precisa primeiro escolher e confirmar uma Configuração na etapa anterior.
        </p>
      </div>
    );
  }

  if (!plan) {
    return null;
  }

  const toggleActivityExpand = (actId: string) => {
    setExpandedActivities(prev => ({ ...prev, [actId]: !prev[actId] }));
  };

  const currentStageObj = plan.stages.find(s => s.stageNumber === activeStageTab) || plan.stages[0];

  const handleApprovePlan = () => {
    const updatedPlan: A3TacticalPlanData = {
      ...plan,
      isApproved: true,
      approvedAt: new Date().toISOString(),
      userFeedback: userFeedbackText,
    };

    onSavePlan(updatedPlan);
    setPlan(updatedPlan);
    setIsApprovedLocked(true);
    setShowApprovalModal(false);
    onToast('Plano Tático Aprovado com Sucesso! A Jornada do Navegador foi concluída.');
    onCompleteStep();
  };

  const handleUnlockApproval = () => {
    setIsApprovedLocked(false);
    onToast('Plano Tático reaberto para revisão.');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ------------------------------------------------------------- */}
      {/* ETAPA 01: ABERTURA DA ETAPA DO PLANO TÁTICO                   */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-100/60 via-[var(--areia)]/60 to-transparent rounded-bl-full -z-0 pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[var(--preto)] text-white rounded-xl shadow-sm">
                <Workflow className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-subtitle font-bold uppercase tracking-widest text-neutral-500">
                  Módulo de Implementação • Consome a Configuração do Navegador de Promessas
                </span>
                <h2 className="text-2xl sm:text-3xl font-title font-bold text-[var(--preto)]">
                  Plano Tático da Clínica (Horizonte de 90 Dias)
                </h2>
              </div>
            </div>

            {isApprovedLocked && (
              <span className="text-xs font-subtitle font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-xl px-3.5 py-2 flex items-center gap-2 shadow-2xs">
                <Award className="w-4 h-4 text-emerald-600" />
                Plano Tático Aprovado & Oficializado
              </span>
            )}
          </div>

          {/* Opening message strictly explaining the objective */}
          <div className="bg-emerald-900 text-white rounded-xl p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 font-subtitle font-bold uppercase text-[0.7rem] tracking-wider text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              Módulo Plano Tático • Roteiro de Execução
            </div>
            <p className="text-sm sm:text-base font-title font-bold text-emerald-50 leading-relaxed">
              "O Plano Tático é um módulo separado que consome a Configuração gerada pelo Navegador de Promessas (Expectativas, Restrições, Motores e Escolha da Configuração). Ele transforma a decisão escolhida em um roteiro claro de prioridades, etapas e atividades para os próximos 90 dias."
            </p>
          </div>
        </div>
      </div>

      {/* Approved Lock Warning / Summary Banner */}
      {isApprovedLocked && (
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-700 text-white rounded-xl shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-title font-bold text-base text-emerald-950">
                  Plano Tático Aprovado com Sucesso!
                </h4>
                <p className="text-xs font-body text-emerald-800">
                  Plano Tático aprovado em {plan.approvedAt ? new Date(plan.approvedAt).toLocaleDateString('pt-BR') : 'hoje'}.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleUnlockApproval}
              className="text-xs font-subtitle font-bold text-emerald-900 hover:text-emerald-950 bg-white border border-emerald-300 rounded-lg px-4 py-2 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reabrir Plano para Revisão
            </button>
          </div>

          <div className="p-4 bg-emerald-900 text-white rounded-xl text-xs font-body leading-relaxed space-y-2">
            <strong className="font-title font-bold text-emerald-300 block">
              "Concluída a escolha no Navegador de Promessas, o Plano Tático consome esse objeto Configuração para orientar a execução prática no Acompanhamento Contínuo (Fase 2)."
            </strong>
            <p className="text-emerald-100/90 text-[0.78rem]">
              A jornada da sua clínica continua ativamente. Este Plano Tático servirá como referência oficial para:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-subtitle text-[0.72rem]">
              <div className="p-2.5 bg-emerald-950/80 border border-emerald-700/60 rounded-lg flex items-center gap-2">
                <span className="text-base">📱</span>
                <div>
                  <strong className="text-emerald-300 block">Ritual Semanal de WhatsApp</strong>
                  <span className="text-emerald-100/80 text-[0.68rem]">Check-in de execução das atividades da semana</span>
                </div>
              </div>
              <div className="p-2.5 bg-emerald-950/80 border border-emerald-700/60 rounded-lg flex items-center gap-2">
                <span className="text-base">📊</span>
                <div>
                  <strong className="text-emerald-300 block">Ritual Mensal de Gestão</strong>
                  <span className="text-emerald-100/80 text-[0.68rem]">Análise de indicadores e balanço de 30/60/90 dias</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ETAPA 02: VISÃO GERAL DA TRANSFORMAÇÃO (SITUAÇÃO ATUAL VS DESEJADA) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white border-2 border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
          <h3 className="font-title font-bold text-lg text-[var(--preto)] flex items-center gap-2">
            <Layers className="w-5 h-5 text-neutral-700" />
            Visão Geral da Transformação Proposta
          </h3>
          <span className="text-xs font-subtitle font-bold text-neutral-500 uppercase tracking-wider bg-neutral-100 px-3 py-1 rounded-md border border-neutral-200">
            {plan.allocationModeLabel}
          </span>
        </div>

        {/* Current vs Target Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neutral-50 border border-neutral-300 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-neutral-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-xs font-subtitle font-bold uppercase tracking-wider">
                Situação Atual (Modelo de Origem)
              </span>
            </div>
            <p className="text-xs font-body text-neutral-700 leading-relaxed font-medium">
              {plan.currentSituationSummary}
            </p>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-300 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-xs font-subtitle font-bold uppercase tracking-wider">
                Situação Desejada ({plan.configName})
              </span>
            </div>
            <p className="text-xs font-title font-bold text-emerald-950 leading-relaxed">
              "{plan.signaturePhrase}"
            </p>
            <p className="text-xs font-body text-emerald-850 leading-relaxed">
              {plan.targetSituationSummary}
            </p>
          </div>
        </div>

        {/* Identified Gaps / Differences List */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-subtitle font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-2">
            <Target className="w-4 h-4 text-neutral-500" />
            Lacunas Identificadas que o Plano Soluciona ({plan.gapsIdentified.length}):
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {plan.gapsIdentified.map((gap, i) => (
              <div key={i} className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-body text-neutral-700 flex items-start gap-2.5">
                <span className="text-[0.65rem] font-subtitle font-bold bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded shrink-0">
                  0{i+1}
                </span>
                <span>{gap}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ETAPA 03 & 04: LINHA DO TEMPO E DETALHAMENTO DE ATIVIDADES    */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-3">
          <div>
            <h3 className="font-title font-bold text-lg text-[var(--preto)] flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-neutral-700" />
              Linha do Tempo Tática (Etapas e Semanas de Execução)
            </h3>
            <p className="text-xs font-body text-neutral-500">
              O modo de organização do tempo foi herdado diretamente da sua escolha: <strong>{plan.allocationModeLabel}</strong>.
            </p>
          </div>

          {/* Stage Tabs (30, 60, 90 Dias) */}
          <div className="flex items-center gap-2">
            {plan.stages.map((stage) => (
              <button
                key={stage.stageNumber}
                type="button"
                onClick={() => setActiveStageTab(stage.stageNumber)}
                className={`px-4 py-2.5 rounded-xl text-xs font-subtitle font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  activeStageTab === stage.stageNumber
                    ? 'bg-[var(--preto)] text-white border-[var(--preto)] shadow-sm'
                    : 'bg-white text-neutral-600 border-neutral-300 hover:border-neutral-400'
                }`}
              >
                {stage.monthName}
              </button>
            ))}
          </div>
        </div>

        {/* Current Active Stage Container */}
        {currentStageObj && (
          <div className="bg-white border-2 border-neutral-300 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            {/* Stage Header Info */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[0.68rem] font-subtitle font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-md">
                  Grandes Etapas • {currentStageObj.monthName}
                </span>
                <span className="text-xs font-subtitle text-neutral-500">
                  {currentStageObj.activities.length} Atividades Táticas
                </span>
              </div>
              <h4 className="font-title font-bold text-xl text-[var(--preto)]">
                {currentStageObj.title}
              </h4>
              <p className="text-xs font-body text-neutral-700">
                <strong>Objetivo Principal:</strong> {currentStageObj.objective}
              </p>
              <div className="pt-2 text-xs font-subtitle text-emerald-800 font-bold flex items-center gap-1.5 border-t border-neutral-200/60 mt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Resultado Esperado desta Etapa: {currentStageObj.expectedOutcome}
              </div>
            </div>

            {/* Activities List */}
            <div className="space-y-4">
              <h5 className="text-xs font-subtitle font-bold uppercase tracking-wider text-neutral-600">
                Atividades Táticas da {currentStageObj.monthName}:
              </h5>

              <div className="space-y-4">
                {currentStageObj.activities.map((act) => {
                  const isExpanded = !!expandedActivities[act.id];

                  return (
                    <div
                      key={act.id}
                      className="border border-neutral-200 hover:border-neutral-400 rounded-xl bg-white p-5 space-y-4 transition-all shadow-2xs"
                    >
                      {/* Activity Top Bar */}
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1 max-w-xl">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wider bg-[var(--preto)] text-white px-2.5 py-0.5 rounded">
                              Semana {act.weekNumber}
                            </span>
                            <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wider bg-indigo-50 text-indigo-900 border border-indigo-200 px-2 py-0.5 rounded flex items-center gap-1">
                              <Clock className="w-3 h-3 text-indigo-700" />
                              {act.timeAllocationFormat}
                            </span>
                          </div>

                          <h6 className="font-title font-bold text-base text-[var(--preto)] pt-1">
                            {act.title}
                          </h6>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleActivityExpand(act.id)}
                          className="text-xs font-subtitle font-bold text-neutral-600 hover:text-[var(--preto)] bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {isExpanded ? 'Menos Detalhes' : 'Ver Detalhes Táticos'}
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Summary Description */}
                      <p className="text-xs font-body text-neutral-700 leading-relaxed">
                        {act.description}
                      </p>

                      {/* Expanded Activity Specs */}
                      {isExpanded && (
                        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-3 text-xs font-body animate-fadeIn pt-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <span className="text-[0.65rem] font-subtitle font-bold uppercase text-neutral-500 block">
                                Objetivo da Atividade
                              </span>
                              <p className="text-neutral-800 font-medium">{act.objective}</p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[0.65rem] font-subtitle font-bold uppercase text-emerald-800 block">
                                Resultado Esperado
                              </span>
                              <p className="text-emerald-950 font-bold">{act.expectedResult}</p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-neutral-200/80 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <span className="text-[0.65rem] font-subtitle font-bold uppercase text-neutral-500 block">
                                Dependências
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {act.dependencies.map((dep, idx) => (
                                  <span key={idx} className="text-[0.65rem] font-subtitle bg-white border border-neutral-200 px-2 py-0.5 rounded text-neutral-700">
                                    {dep}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[0.65rem] font-subtitle font-bold uppercase text-amber-800 block">
                                Origem da Ação (Rastreabilidade)
                              </span>
                              <p className="text-amber-950 italic text-[0.72rem]">{act.gapOrigin}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ETAPA 05: REVISÃO E APROVAÇÃO DO PLANO TÁTICO                 */}
      {/* ------------------------------------------------------------- */}
      {!isApprovedLocked && (
        <div className="bg-white border-2 border-[var(--preto)] rounded-2xl p-6 sm:p-8 shadow-md space-y-6 max-w-3xl mx-auto">
          <div className="space-y-3 text-center">
            <span className="text-xs font-subtitle font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200 inline-block">
              Validação Final da Jornada
            </span>
            <h3 className="text-xl sm:text-2xl font-title font-bold text-[var(--preto)] leading-snug">
              "Esse plano representa corretamente o caminho que você deseja seguir?"
            </h3>
            <p className="text-xs font-body text-neutral-600 max-w-xl mx-auto">
              Ao aprovar o Plano Tático, você encerra a etapa de decisões e oficializa a rota de transformação para os próximos 90 dias.
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <Button
              onClick={() => setShowApprovalModal(true)}
              className="bg-[var(--preto)] text-white hover:bg-neutral-800 text-sm py-4 px-8 rounded-xl flex items-center justify-center gap-2.5 shadow-md w-full sm:w-auto cursor-pointer"
            >
              Aprovar e Oficializar Plano Tático <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </Button>
          </div>
        </div>
      )}

      {/* APPROVAL CONFIRMATION MODAL */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border-2 border-[var(--preto)] rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="space-y-3">
              <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl">
                  <Award className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wider text-emerald-800">
                    Módulo de Implementação
                  </span>
                  <h3 className="text-xl font-title font-bold text-[var(--preto)]">
                    Aprovação Final do Plano Tático
                  </h3>
                </div>
              </div>

              <p className="text-xs font-body text-neutral-700 leading-relaxed">
                Ao confirmar, este Plano Tático de 90 dias (que consome a Configuração definida no Navegador de Promessas) será formalmente aprovado e gravado como o roteiro de execução da sua clínica.
              </p>

              <div className="space-y-2">
                <label className="text-xs font-subtitle font-bold text-[var(--preto)] uppercase tracking-wider block">
                  Observações ou Notas do Nutricionista (Opcional):
                </label>
                <textarea
                  rows={3}
                  value={userFeedbackText}
                  onChange={(e) => setUserFeedbackText(e.target.value)}
                  placeholder="Ex: 'Plano totalmente alinhado com meus objetivos para este trimestre. Foco total no Mês 1!'"
                  className="w-full p-3 border border-neutral-300 rounded-xl text-xs font-body outline-none focus:border-[var(--preto)]"
                />
              </div>

              <div className="p-4 bg-emerald-900 text-white rounded-xl text-xs font-body leading-relaxed space-y-1">
                <strong>Transição de Jornada:</strong> "Com a aprovação do Plano Tático, avançamos para a Fase 2 (Acompanhamento Contínuo), onde colocaremos em prática a Configuração gerada pelo Navegador de Promessas através dos rituais semanais via WhatsApp e reuniões mensais de gestão!"
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setShowApprovalModal(false)}
                className="w-full sm:w-auto px-5 py-3 text-xs font-subtitle font-bold text-neutral-600 hover:text-[var(--preto)] bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
              >
                Voltar e Revisar
              </button>

              <Button
                onClick={handleApprovePlan}
                className="w-full sm:w-auto bg-[var(--preto)] text-white hover:bg-neutral-800 text-xs py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                Confirmar Aprovação Final
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
