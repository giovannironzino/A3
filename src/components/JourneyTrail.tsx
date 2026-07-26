import React from 'react';
import { 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  FileText, 
  Award, 
  Calendar, 
  ArrowRight,
  Eye,
  Compass,
  Zap,
  ChevronRight
} from 'lucide-react';
import { 
  A3CurrentModel, 
  A3ChosenConfigurationData, 
  A3TacticalPlanData 
} from '../types';

export type StageName = 
  | 'products' 
  | 'patient-workload'
  | 'schedule' 
  | 'other-activities'
  | 'current-model' 
  | 'expectations' 
  | 'boundaries' 
  | 'configuration-choice' 
  | 'tactical-plan';

interface JourneyTrailProps {
  activeStage: StageName;
  onSelectStage: (stage: StageName) => void;
  savedCurrentModelData: A3CurrentModel | null;
  savedChosenConfigData: A3ChosenConfigurationData | null;
  savedTacticalPlanData: A3TacticalPlanData | null;
  onOpenDeliverable: (type: 'retrato' | 'caminho' | 'plano') => void;
  onToast: (msg: string) => void;
}

export const JourneyTrail: React.FC<JourneyTrailProps> = ({
  activeStage,
  onSelectStage,
  savedCurrentModelData,
  savedChosenConfigData,
  savedTacticalPlanData,
  onOpenDeliverable,
  onToast,
}) => {
  // Completion statuses
  const isBlockACompleted = !!savedCurrentModelData?.isApproved;
  const isBlockBCompleted = !!savedChosenConfigData?.isConfirmed;
  const isBlockCCompleted = !!savedTacticalPlanData?.isApproved;

  // Active Block determination
  const isBlockAActive = [
    'products', 'patient-workload', 'schedule', 'other-activities', 'current-model'
  ].includes(activeStage);

  const isBlockBActive = [
    'expectations', 'boundaries', 'configuration-choice'
  ].includes(activeStage);

  const isBlockCActive = activeStage === 'tactical-plan';

  // Lock status
  const isBlockBLocked = !isBlockACompleted;
  const isBlockCLocked = !isBlockBCompleted;

  // Sub-step helper for Bloco A
  const getBlockAMicroLabel = () => {
    switch (activeStage) {
      case 'products': return 'Passo 1/5: Serviços & Detalhamento';
      case 'patient-workload': return 'Passo 2/5: Carga Pacientes Atuais';
      case 'schedule': return 'Passo 3/5: Agenda Disponível';
      case 'other-activities': return 'Passo 4/5: Outras Atividades';
      case 'current-model': return 'Passo 5/5: Consolidação Modelo Atual';
      default: return 'Etapa Ativa em Diagnóstico';
    }
  };

  // Sub-step helper for Bloco B
  const getBlockBMicroLabel = () => {
    switch (activeStage) {
      case 'expectations': return 'Passo 1/3: Expectativas do Nutricionista';
      case 'boundaries': return 'Passo 2/3: Condições & Limites';
      case 'configuration-choice': return 'Passo 3/3: Escolha da Configuração';
      default: return 'Etapa Ativa no Navegador';
    }
  };

  const handleBlockBClick = () => {
    if (isBlockBLocked) {
      onToast('Conclua a aprovação do Bloco A "Enxergando sua clínica" para desbloquear o Bloco B.');
      return;
    }
    if (activeStage !== 'expectations' && activeStage !== 'boundaries' && activeStage !== 'configuration-choice') {
      onSelectStage('expectations');
    }
  };

  const handleBlockCClick = () => {
    if (isBlockCLocked) {
      onToast('Confirme a escolha no Bloco B "Escolhendo seu caminho" para desbloquear o Bloco C.');
      return;
    }
    if (activeStage !== 'tactical-plan') {
      onSelectStage('tactical-plan');
    }
  };

  return (
    <div className="bg-white border-2 border-[var(--preto)] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 mb-8">
      {/* MACRO HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-[var(--preto)] text-white rounded-lg">
            <Compass className="w-4 h-4 text-emerald-400" />
          </span>
          <div>
            <h2 className="font-title font-bold text-sm sm:text-base text-[var(--preto)] tracking-tight">
              Trilha da Jornada • Fase 1 (Navegador Estratégico & Plano Tático)
            </h2>
            <p className="text-[0.7rem] font-body text-neutral-500">
              Progresso estruturado em 3 blocos contínuos de clareza, escolha e ação.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[0.65rem] font-subtitle font-bold uppercase tracking-wider text-neutral-500">
          <span className={`px-2 py-0.5 rounded ${isBlockACompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100'}`}>
            A: Clareza
          </span>
          <span>→</span>
          <span className={`px-2 py-0.5 rounded ${isBlockBCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100'}`}>
            B: Escolha
          </span>
          <span>→</span>
          <span className={`px-2 py-0.5 rounded ${isBlockCCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100'}`}>
            C: Ação
          </span>
        </div>
      </div>

      {/* 3 BLOCKS CONTAINER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">

        {/* ========================================================= */}
        {/* BLOCO A: ENXERGANDO SUA CLÍNICA                             */}
        {/* ========================================================= */}
        <div 
          className={`rounded-xl p-4 transition-all border-2 flex flex-col justify-between ${
            isBlockAActive 
              ? 'bg-emerald-50/60 border-emerald-600 shadow-xs' 
              : isBlockACompleted 
              ? 'bg-neutral-50/80 border-emerald-500/80' 
              : 'bg-white border-neutral-200'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                Bloco A • Call 01
              </span>

              {isBlockACompleted ? (
                <span className="flex items-center gap-1 text-[0.65rem] font-subtitle font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Concluído
                </span>
              ) : isBlockAActive ? (
                <span className="text-[0.65rem] font-subtitle font-bold uppercase text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded-full">
                  Em Andamento
                </span>
              ) : (
                <span className="text-[0.65rem] font-subtitle text-neutral-400">
                  Pendente
                </span>
              )}
            </div>

            <div>
              <h3 className="font-title font-bold text-sm sm:text-base text-[var(--preto)]">
                Enxergando sua clínica
              </h3>
              <p className="text-[0.72rem] font-body text-neutral-600 leading-snug">
                Diagnóstico e consolidação da oferta, agenda e rotina real do Modelo Atual.
              </p>
            </div>

            {/* NESTED MICRO PROGRESS INDICATOR */}
            {isBlockAActive && (
              <div className="p-2 bg-emerald-100/70 border border-emerald-300 rounded-lg text-[0.7rem] font-subtitle font-bold text-emerald-950 flex items-center justify-between">
                <span>{getBlockAMicroLabel()}</span>
                <Sparkles className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
              </div>
            )}

            {/* SUB-STEP PILLS (BLOCO A) */}
            <div className="flex flex-wrap gap-1 pt-1">
              {[
                { id: 'products', name: '01. Serviços' },
                { id: 'patient-workload', name: '02. Carga Pacientes' },
                { id: 'schedule', name: '03. Agenda Disponível' },
                { id: 'other-activities', name: '04. Outras Atividades' },
                { id: 'current-model', name: '05. Modelo Atual' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelectStage(s.id as StageName)}
                  className={`px-2 py-1 text-[0.62rem] font-subtitle font-bold rounded cursor-pointer transition-all ${
                    activeStage === s.id
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:border-emerald-500'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* DELIVERABLE SHORTCUT FOR BLOCO A */}
          {isBlockACompleted && (
            <div className="mt-3 pt-3 border-t border-emerald-200">
              <button
                type="button"
                onClick={() => onOpenDeliverable('retrato')}
                className="w-full py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white text-[0.7rem] font-subtitle font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-300" />
                <span>Ver Retrato da Sua Clínica Hoje</span>
              </button>
            </div>
          )}
        </div>


        {/* ========================================================= */}
        {/* BLOCO B: ESCOLHENDO SEU CAMINHO                             */}
        {/* ========================================================= */}
        <div 
          onClick={isBlockBLocked ? handleBlockBClick : undefined}
          className={`rounded-xl p-4 transition-all border-2 flex flex-col justify-between ${
            isBlockBLocked
              ? 'bg-neutral-50/80 border-neutral-200 text-neutral-400 opacity-90'
              : isBlockBActive
              ? 'bg-amber-50/60 border-amber-600 shadow-xs'
              : isBlockBCompleted
              ? 'bg-neutral-50/80 border-amber-500/80'
              : 'bg-white border-neutral-200'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-[0.65rem] font-subtitle font-bold uppercase tracking-wider flex items-center gap-1 ${
                isBlockBLocked ? 'text-neutral-400' : 'text-amber-800'
              }`}>
                <Compass className="w-3.5 h-3.5" />
                Bloco B • Call 02
              </span>

              {isBlockBLocked ? (
                <span className="flex items-center gap-1 text-[0.65rem] font-subtitle text-neutral-500 bg-neutral-200/80 px-2 py-0.5 rounded-full">
                  <Lock className="w-3 h-3 text-neutral-500" />
                  Bloqueado
                </span>
              ) : isBlockBCompleted ? (
                <span className="flex items-center gap-1 text-[0.65rem] font-subtitle font-bold uppercase text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                  <CheckCircle2 className="w-3 h-3 text-amber-700" />
                  Concluído
                </span>
              ) : isBlockBActive ? (
                <span className="text-[0.65rem] font-subtitle font-bold uppercase text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded-full">
                  Em Andamento
                </span>
              ) : (
                <span className="text-[0.65rem] font-subtitle text-neutral-400">
                  Liberado
                </span>
              )}
            </div>

            <div>
              <h3 className={`font-title font-bold text-sm sm:text-base ${isBlockBLocked ? 'text-neutral-500' : 'text-[var(--preto)]'}`}>
                Escolhendo seu caminho
              </h3>
              
              {isBlockBLocked ? (
                <p className="text-[0.72rem] font-body text-neutral-500 italic leading-snug pt-1">
                  "Aqui você vai escolher entre caminhos diferentes para sua clínica."
                </p>
              ) : (
                <p className="text-[0.72rem] font-body text-neutral-600 leading-snug">
                  Navegador de Promessas: Expectativas, Restrições e Escolha da Configuração.
                </p>
              )}
            </div>

            {/* NESTED MICRO PROGRESS INDICATOR */}
            {isBlockBActive && (
              <div className="p-2 bg-amber-100/70 border border-amber-300 rounded-lg text-[0.7rem] font-subtitle font-bold text-amber-950 flex items-center justify-between">
                <span>{getBlockBMicroLabel()}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
              </div>
            )}

            {/* SUB-STEP PILLS (BLOCO B) */}
            {!isBlockBLocked && (
              <div className="flex flex-wrap gap-1 pt-1">
                {[
                  { id: 'expectations', name: '07. Expectativas' },
                  { id: 'boundaries', name: '08. Limites' },
                  { id: 'configuration-choice', name: '09. Escolha Configuração' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onSelectStage(s.id as StageName)}
                    className={`px-2 py-1 text-[0.62rem] font-subtitle font-bold rounded cursor-pointer transition-all ${
                      activeStage === s.id
                        ? 'bg-amber-800 text-white shadow-2xs'
                        : 'bg-white border border-neutral-200 text-neutral-700 hover:border-amber-500'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DELIVERABLE SHORTCUT FOR BLOCO B */}
          {isBlockBCompleted && (
            <div className="mt-3 pt-3 border-t border-amber-200">
              <button
                type="button"
                onClick={() => onOpenDeliverable('caminho')}
                className="w-full py-2 px-3 bg-amber-800 hover:bg-amber-900 text-white text-[0.7rem] font-subtitle font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>Ver O Caminho que Você Escolheu</span>
              </button>
            </div>
          )}
        </div>


        {/* ========================================================= */}
        {/* BLOCO C: COLOCANDO EM PRÁTICA                               */}
        {/* ========================================================= */}
        <div 
          onClick={isBlockCLocked ? handleBlockCClick : undefined}
          className={`rounded-xl p-4 transition-all border-2 flex flex-col justify-between ${
            isBlockCLocked
              ? 'bg-neutral-50/80 border-neutral-200 text-neutral-400 opacity-90'
              : isBlockCActive
              ? 'bg-indigo-50/60 border-indigo-600 shadow-xs'
              : isBlockCCompleted
              ? 'bg-neutral-50/80 border-indigo-500/80'
              : 'bg-white border-neutral-200'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-[0.65rem] font-subtitle font-bold uppercase tracking-wider flex items-center gap-1 ${
                isBlockCLocked ? 'text-neutral-400' : 'text-indigo-800'
              }`}>
                <Zap className="w-3.5 h-3.5" />
                Bloco C • Call 03
              </span>

              {isBlockCLocked ? (
                <span className="flex items-center gap-1 text-[0.65rem] font-subtitle text-neutral-500 bg-neutral-200/80 px-2 py-0.5 rounded-full">
                  <Lock className="w-3 h-3 text-neutral-500" />
                  Bloqueado
                </span>
              ) : isBlockCCompleted ? (
                <span className="flex items-center gap-1 text-[0.65rem] font-subtitle font-bold uppercase text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-300">
                  <CheckCircle2 className="w-3 h-3 text-indigo-700" />
                  Concluído
                </span>
              ) : isBlockCActive ? (
                <span className="text-[0.65rem] font-subtitle font-bold uppercase text-indigo-950 bg-indigo-200/80 px-2 py-0.5 rounded-full">
                  Em Andamento
                </span>
              ) : (
                <span className="text-[0.65rem] font-subtitle text-neutral-400">
                  Liberado
                </span>
              )}
            </div>

            <div>
              <h3 className={`font-title font-bold text-sm sm:text-base ${isBlockCLocked ? 'text-neutral-500' : 'text-[var(--preto)]'}`}>
                Colocando em prática
              </h3>

              {isBlockCLocked ? (
                <p className="text-[0.72rem] font-body text-neutral-500 italic leading-snug pt-1">
                  "Aqui você vai transformar a escolha em um plano de ação de 90 dias."
                </p>
              ) : (
                <p className="text-[0.72rem] font-body text-neutral-600 leading-snug">
                  Módulo Plano Tático: Roteiro operacional de 30/60/90 dias e checklist semanal.
                </p>
              )}
            </div>

            {/* NESTED MICRO PROGRESS INDICATOR */}
            {isBlockCActive && (
              <div className="p-2 bg-indigo-100/70 border border-indigo-300 rounded-lg text-[0.7rem] font-subtitle font-bold text-indigo-950 flex items-center justify-between">
                <span>Passo 1/1: Módulo Plano Tático</span>
                <Sparkles className="w-3.5 h-3.5 text-indigo-700 animate-pulse" />
              </div>
            )}

            {/* SUB-STEP PILL (BLOCO C) */}
            {!isBlockCLocked && (
              <div className="flex flex-wrap gap-1 pt-1">
                <button
                  type="button"
                  onClick={() => onSelectStage('tactical-plan')}
                  className={`px-2.5 py-1 text-[0.62rem] font-subtitle font-bold rounded cursor-pointer transition-all ${
                    activeStage === 'tactical-plan'
                      ? 'bg-indigo-800 text-white shadow-2xs'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:border-indigo-500'
                  }`}
                >
                  10. Plano Tático 90 Dias
                </button>
              </div>
            )}
          </div>

          {/* DELIVERABLE SHORTCUT FOR BLOCO C */}
          {isBlockCCompleted && (
            <div className="mt-3 pt-3 border-t border-indigo-200">
              <button
                type="button"
                onClick={() => onOpenDeliverable('plano')}
                className="w-full py-2 px-3 bg-indigo-800 hover:bg-indigo-900 text-white text-[0.7rem] font-subtitle font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-300" />
                <span>Ver Seu Plano de Ação (90 Dias)</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
