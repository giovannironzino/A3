import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Layers,
  ListOrdered,
  Target,
  ChevronDown,
  ChevronUp,
  Award,
  Check,
  RotateCcw
} from 'lucide-react';
import { Button, Tag, Callout, SectionTopic } from './UIPrimitives';
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
      <div className="p-12 text-center bg-[var(--branco)] border border-dashed border-[var(--border-strong)] space-y-4 animate-fadeIn">
        <AlertTriangle className="w-12 h-12 text-[var(--exodo-red)] mx-auto" />
        <h3 className="font-display font-bold text-lg text-[var(--preto)]">
          Configuração Não Selecionada
        </h3>
        <p className="text-xs font-body text-[var(--cinza-escuro)] max-w-md mx-auto">
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
      <div className="bg-[var(--branco)] border border-[var(--border-strong)] p-6 sm:p-8 relative overflow-hidden">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-default)] pb-4">
            <SectionTopic label="Módulo de Implementação • Consome a Configuração do Navegador de Promessas">
              Plano Tático da Clínica (Horizonte de 90 Dias)
            </SectionTopic>

            {isApprovedLocked && (
              <Tag tone="diagnostico" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Plano Tático Aprovado & Oficializado
              </Tag>
            )}
          </div>

          {/* Opening message strictly explaining the objective */}
          <Callout label="Módulo Plano Tático • Roteiro de Execução" tone="accent">
            "O Plano Tático é um módulo separado que consome a Configuração gerada pelo Navegador de Promessas (Expectativas, Restrições, Motores e Escolha da Configuração). Ele transforma a decisão escolhida em um roteiro claro de prioridades, etapas e atividades para os próximos 90 dias."
          </Callout>
        </div>
      </div>

      {/* Approved Lock Warning / Summary Banner */}
      {isApprovedLocked && (
        <div className="bg-[var(--branco)] border-2 border-[var(--preto)] p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[var(--preto)] text-[var(--branco)]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[var(--preto)]">
                  Plano Tático Aprovado com Sucesso!
                </h4>
                <p className="text-xs font-body text-[var(--cinza-escuro)]">
                  Plano Tático aprovado em {plan.approvedAt ? new Date(plan.approvedAt).toLocaleDateString('pt-BR') : 'hoje'}.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleUnlockApproval}
              className="text-xs font-subtitle font-bold text-[var(--preto)] hover:text-[var(--exodo-red)] bg-[var(--branco)] border border-[var(--border-strong)] px-4 py-2 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reabrir Plano para Revisão
            </button>
          </div>

          <div className="p-4 bg-[var(--preto)] text-[var(--branco)] text-xs font-body leading-relaxed space-y-2">
            <strong className="font-display font-bold text-[var(--exodo-red)] block">
              "Concluída a escolha no Navegador de Promessas, o Plano Tático consome esse objeto Configuração para orientar a execução prática no Acompanhamento Contínuo (Fase 2)."
            </strong>
            <p className="text-[var(--cinza-claro)] text-[0.78rem]">
              A jornada da sua clínica continua ativamente. Este Plano Tático servirá como referência oficial para:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-subtitle text-[0.72rem]">
              <div className="p-2.5 bg-[var(--cinza-escuro)]/40 border border-[var(--cinza-medio)]/60 flex items-center gap-2">
                <span className="text-base">📱</span>
                <div>
                  <strong className="text-[var(--exodo-red)] block">Ritual Semanal de WhatsApp</strong>
                  <span className="text-[var(--cinza-claro)] text-[0.68rem]">Check-in de execução das atividades da semana</span>
                </div>
              </div>
              <div className="p-2.5 bg-[var(--cinza-escuro)]/40 border border-[var(--cinza-medio)]/60 flex items-center gap-2">
                <span className="text-base">📊</span>
                <div>
                  <strong className="text-[var(--exodo-red)] block">Ritual Mensal de Gestão</strong>
                  <span className="text-[var(--cinza-claro)] text-[0.68rem]">Análise de indicadores e balanço de 30/60/90 dias</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ETAPA 02: VISÃO GERAL DA TRANSFORMAÇÃO (SITUAÇÃO ATUAL VS DESEJADA) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[var(--branco)] border-2 border-[var(--border-default)] p-6 sm:p-8 space-y-6">
        <div className="border-b border-[var(--border-default)] pb-3 flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-[var(--preto)] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[var(--exodo-red)]" />
            Visão Geral da Transformação Proposta
          </h3>
          <span className="text-xs font-subtitle font-bold text-[var(--cinza-medio)] uppercase tracking-wide border border-[var(--border-default)] px-3 py-1">
            {plan.allocationModeLabel}
          </span>
        </div>

        {/* Current vs Target Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--cinza-claro)] p-5 space-y-3">
            <div className="flex items-center gap-2 text-[var(--cinza-escuro)]">
              <span className="w-2.5 h-2.5 bg-[var(--cinza-medio)]" />
              <span className="text-xs font-subtitle font-bold uppercase tracking-wide">
                Situação Atual (Modelo de Origem)
              </span>
            </div>
            <p className="text-xs font-body text-[var(--cinza-escuro)] leading-relaxed font-medium">
              {plan.currentSituationSummary}
            </p>
          </div>

          <div className="bg-[var(--accent-tint)] border border-[var(--exodo-red)] p-5 space-y-3">
            <div className="flex items-center gap-2 text-[var(--preto)]">
              <span className="w-2.5 h-2.5 bg-[var(--exodo-red)] animate-pulse" />
              <span className="text-xs font-subtitle font-bold uppercase tracking-wide">
                Situação Desejada ({plan.configName})
              </span>
            </div>
            <p className="text-xs font-display text-[var(--preto)] leading-relaxed">
              "{plan.signaturePhrase}"
            </p>
            <p className="text-xs font-body text-[var(--cinza-escuro)] leading-relaxed">
              {plan.targetSituationSummary}
            </p>
          </div>
        </div>

        {/* Identified Gaps / Differences List */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-subtitle font-bold uppercase tracking-wide text-[var(--cinza-escuro)] flex items-center gap-2">
            <Target className="w-4 h-4 text-[var(--exodo-red)]" />
            Lacunas Identificadas que o Plano Soluciona ({plan.gapsIdentified.length}):
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {plan.gapsIdentified.map((gap, i) => (
              <div key={i} className="p-3 bg-[var(--cinza-claro)] text-xs font-body text-[var(--cinza-escuro)] flex items-start gap-2.5">
                <span className="text-[0.65rem] font-subtitle font-bold bg-[var(--preto)] text-[var(--branco)] px-1.5 py-0.5 shrink-0">
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
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-default)] pb-3">
          <div>
            <h3 className="font-display font-bold text-lg text-[var(--preto)] flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-[var(--exodo-red)]" />
              Linha do Tempo Tática (Etapas e Semanas de Execução)
            </h3>
            <p className="text-xs font-body text-[var(--cinza-medio)]">
              O modo de organização do tempo foi herdado diretamente da sua escolha: <strong className="text-[var(--preto)]">{plan.allocationModeLabel}</strong>.
            </p>
          </div>

          {/* Stage Tabs (30, 60, 90 Dias) */}
          <div className="flex items-center gap-2">
            {plan.stages.map((stage) => (
              <button
                key={stage.stageNumber}
                type="button"
                onClick={() => setActiveStageTab(stage.stageNumber)}
                className={`px-4 py-2.5 text-xs font-subtitle font-bold uppercase tracking-wide transition-colors cursor-pointer border ${
                  activeStageTab === stage.stageNumber
                    ? 'bg-[var(--preto)] text-[var(--branco)] border-[var(--preto)]'
                    : 'bg-[var(--branco)] text-[var(--cinza-escuro)] border-[var(--border-default)] hover:border-[var(--exodo-red)]'
                }`}
              >
                {stage.monthName}
              </button>
            ))}
          </div>
        </div>

        {/* Current Active Stage Container */}
        {currentStageObj && (
          <div className="bg-[var(--branco)] border-2 border-[var(--border-strong)] p-6 sm:p-8 space-y-6">
            {/* Stage Header Info */}
            <div className="bg-[var(--cinza-claro)] p-5 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wide text-[var(--exodo-red)]">
                  Grandes Etapas • {currentStageObj.monthName}
                </span>
                <span className="text-xs font-subtitle text-[var(--cinza-medio)]">
                  {currentStageObj.activities.length} Atividades Táticas
                </span>
              </div>
              <h4 className="font-display font-bold text-xl text-[var(--preto)]">
                {currentStageObj.title}
              </h4>
              <p className="text-xs font-body text-[var(--cinza-escuro)]">
                <strong>Objetivo Principal:</strong> {currentStageObj.objective}
              </p>
              <div className="pt-2 text-xs font-subtitle text-[var(--preto)] font-bold flex items-center gap-1.5 border-t border-[var(--border-default)] mt-2">
                <ShieldCheck className="w-4 h-4 text-[var(--exodo-red)]" />
                Resultado Esperado desta Etapa: {currentStageObj.expectedOutcome}
              </div>
            </div>

            {/* Activities List */}
            <div className="space-y-4">
              <h5 className="text-xs font-subtitle font-bold uppercase tracking-wide text-[var(--cinza-escuro)]">
                Atividades Táticas da {currentStageObj.monthName}:
              </h5>

              <div className="space-y-4">
                {currentStageObj.activities.map((act) => {
                  const isExpanded = !!expandedActivities[act.id];

                  return (
                    <div
                      key={act.id}
                      className="border border-[var(--border-default)] hover:border-[var(--cinza-medio)] bg-[var(--branco)] p-5 space-y-4 transition-colors"
                    >
                      {/* Activity Top Bar */}
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1 max-w-xl">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wide bg-[var(--preto)] text-[var(--branco)] px-2.5 py-0.5">
                              Semana {act.weekNumber}
                            </span>
                            <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wide border border-[var(--border-default)] text-[var(--cinza-escuro)] px-2 py-0.5 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {act.timeAllocationFormat}
                            </span>
                          </div>

                          <h6 className="font-display font-bold text-base text-[var(--preto)] pt-1">
                            {act.title}
                          </h6>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleActivityExpand(act.id)}
                          className="text-xs font-subtitle font-bold text-[var(--cinza-escuro)] hover:text-[var(--preto)] bg-[var(--cinza-claro)] hover:bg-[var(--border-default)] px-3 py-1.5 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {isExpanded ? 'Menos Detalhes' : 'Ver Detalhes Táticos'}
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Summary Description */}
                      <p className="text-xs font-body text-[var(--cinza-escuro)] leading-relaxed">
                        {act.description}
                      </p>

                      {/* Expanded Activity Specs */}
                      {isExpanded && (
                        <div className="bg-[var(--cinza-claro)] p-4 space-y-3 text-xs font-body animate-fadeIn pt-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <span className="text-[0.65rem] font-subtitle font-bold uppercase text-[var(--cinza-medio)] block">
                                Objetivo da Atividade
                              </span>
                              <p className="text-[var(--cinza-escuro)] font-medium">{act.objective}</p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[0.65rem] font-subtitle font-bold uppercase text-[var(--exodo-red)] block">
                                Resultado Esperado
                              </span>
                              <p className="text-[var(--preto)] font-bold">{act.expectedResult}</p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-[var(--border-default)] grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <span className="text-[0.65rem] font-subtitle font-bold uppercase text-[var(--cinza-medio)] block">
                                Dependências
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {act.dependencies.map((dep, idx) => (
                                  <span key={idx} className="text-[0.65rem] font-subtitle bg-[var(--branco)] border border-[var(--border-default)] px-2 py-0.5 text-[var(--cinza-escuro)]">
                                    {dep}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[0.65rem] font-subtitle font-bold uppercase text-[var(--exodo-red)] block">
                                Origem da Ação (Rastreabilidade)
                              </span>
                              <p className="text-[var(--preto)] italic text-[0.72rem]">{act.gapOrigin}</p>
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
        <div className="bg-[var(--branco)] border-2 border-[var(--preto)] p-6 sm:p-8 space-y-6 max-w-3xl mx-auto text-center">
          <div className="space-y-3">
            <Tag tone="evidencia">Validação Final da Jornada</Tag>
            <h3 className="text-xl sm:text-2xl font-display text-[var(--preto)] leading-snug">
              "Esse plano representa corretamente o caminho que você deseja seguir?"
            </h3>
            <p className="text-xs font-body text-[var(--cinza-escuro)] max-w-xl mx-auto">
              Ao aprovar o Plano Tático, você encerra a etapa de decisões e oficializa a rota de transformação para os próximos 90 dias.
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <Button variant="primary" size="lg" onClick={() => setShowApprovalModal(true)} className="w-full sm:w-auto">
              Aprovar e Oficializar Plano Tático <CheckCircle2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* APPROVAL CONFIRMATION MODAL */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[var(--branco)] border-2 border-[var(--preto)] max-w-xl w-full p-6 sm:p-8 space-y-6 relative">
            <div className="space-y-3">
              <div className="flex items-center gap-3 border-b border-[var(--border-default)] pb-3">
                <div className="p-3 bg-[var(--preto)] text-[var(--branco)]">
                  <Award className="w-6 h-6 text-[var(--exodo-red)]" />
                </div>
                <div>
                  <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wide text-[var(--exodo-red)]">
                    Módulo de Implementação
                  </span>
                  <h3 className="text-xl font-display text-[var(--preto)]">
                    Aprovação Final do Plano Tático
                  </h3>
                </div>
              </div>

              <p className="text-xs font-body text-[var(--cinza-escuro)] leading-relaxed">
                Ao confirmar, este Plano Tático de 90 dias (que consome a Configuração definida no Navegador de Promessas) será formalmente aprovado e gravado como o roteiro de execução da sua clínica.
              </p>

              <div className="space-y-2">
                <label className="text-xs font-subtitle font-bold text-[var(--preto)] uppercase tracking-wide block">
                  Observações ou Notas do Nutricionista (Opcional):
                </label>
                <textarea
                  rows={3}
                  value={userFeedbackText}
                  onChange={(e) => setUserFeedbackText(e.target.value)}
                  placeholder="Ex: 'Plano totalmente alinhado com meus objetivos para este trimestre. Foco total no Mês 1!'"
                  className="w-full p-3 border border-[var(--border-strong)] text-xs font-body outline-none focus:border-[var(--exodo-red)]"
                />
              </div>

              <div className="p-4 bg-[var(--preto)] text-[var(--branco)] text-xs font-body leading-relaxed space-y-1">
                <strong>Transição de Jornada:</strong> "Com a aprovação do Plano Tático, avançamos para a Fase 2 (Acompanhamento Contínuo), onde colocaremos em prática a Configuração gerada pelo Navegador de Promessas através dos rituais semanais via WhatsApp e reuniões mensais de gestão!"
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[var(--border-default)]">
              <button
                type="button"
                onClick={() => setShowApprovalModal(false)}
                className="w-full sm:w-auto px-5 py-3 text-xs font-subtitle font-bold text-[var(--cinza-escuro)] hover:text-[var(--preto)] bg-[var(--cinza-claro)] hover:bg-[var(--border-default)] transition-colors cursor-pointer"
              >
                Voltar e Revisar
              </button>

              <Button variant="primary" size="md" onClick={handleApprovePlan} className="w-full sm:w-auto">
                <Check className="w-4 h-4" />
                Confirmar Aprovação Final
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
