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
import { Tag } from './UIPrimitives';
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

  // Shared sub-step pill style
  const subStepPillClass = (active: boolean) =>
    `px-2.5 py-1 text-[0.62rem] font-subtitle font-bold uppercase tracking-wide cursor-pointer transition-colors ${
      active
        ? 'bg-[var(--preto)] text-[var(--branco)]'
        : 'bg-[var(--branco)] border border-[var(--border-default)] text-[var(--cinza-escuro)] hover:border-[var(--exodo-red)]'
    }`;

  // Shared block card border/bg style
  const blockCardClass = (locked: boolean, active: boolean, completed: boolean) => {
    if (locked) return 'bg-[var(--cinza-claro)]/40 border-[var(--border-default)] text-[var(--cinza-medio)]';
    if (active) return 'bg-[var(--accent-tint)] border-[var(--exodo-red)]';
    if (completed) return 'bg-[var(--branco)] border-[var(--preto)]';
    return 'bg-[var(--branco)] border-[var(--border-default)]';
  };

  return (
    <div className="bg-[var(--branco)] border-2 border-[var(--preto)] p-4 sm:p-5 space-y-4 mb-8">
      {/* MACRO HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-default)] pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-[var(--preto)] text-[var(--branco)]">
            <Compass className="w-4 h-4 text-[var(--exodo-red)]" />
          </span>
          <div>
            <h2 className="font-display font-bold text-sm sm:text-base text-[var(--preto)] tracking-tight">
              Trilha da Jornada • Fase 1 (Navegador Estratégico & Plano Tático)
            </h2>
            <p className="text-[0.7rem] font-body text-[var(--cinza-medio)]">
              Progresso estruturado em 3 blocos contínuos de clareza, escolha e ação.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[0.65rem] font-subtitle font-bold uppercase tracking-wide text-[var(--cinza-medio)]">
          <span className={`px-2 py-0.5 ${isBlockACompleted ? 'bg-[var(--preto)] text-[var(--branco)]' : 'bg-[var(--cinza-claro)]'}`}>
            A: Clareza
          </span>
          <span>→</span>
          <span className={`px-2 py-0.5 ${isBlockBCompleted ? 'bg-[var(--preto)] text-[var(--branco)]' : 'bg-[var(--cinza-claro)]'}`}>
            B: Escolha
          </span>
          <span>→</span>
          <span className={`px-2 py-0.5 ${isBlockCCompleted ? 'bg-[var(--preto)] text-[var(--branco)]' : 'bg-[var(--cinza-claro)]'}`}>
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
          className={`p-4 transition-all border-2 flex flex-col justify-between ${blockCardClass(false, isBlockAActive, isBlockACompleted)}`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wide text-[var(--exodo-red)] flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                Bloco A • Call 01
              </span>

              {isBlockACompleted ? (
                <Tag tone="diagnostico" className="text-[0.62rem] px-2 py-0.5">
                  <CheckCircle2 className="w-3 h-3 inline mr-1" />
                  Concluído
                </Tag>
              ) : isBlockAActive ? (
                <Tag tone="evidencia" className="text-[0.62rem] px-2 py-0.5">Em Andamento</Tag>
              ) : (
                <span className="text-[0.65rem] font-subtitle text-[var(--cinza-medio)]">
                  Pendente
                </span>
              )}
            </div>

            <div>
              <h3 className="font-display font-bold text-sm sm:text-base text-[var(--preto)]">
                Enxergando sua clínica
              </h3>
              <p className="text-[0.72rem] font-body text-[var(--cinza-escuro)] leading-snug">
                Diagnóstico e consolidação da oferta, agenda e rotina real do Modelo Atual.
              </p>
            </div>

            {/* NESTED MICRO PROGRESS INDICATOR */}
            {isBlockAActive && (
              <div className="p-2 bg-[var(--branco)] border border-[var(--exodo-red)] text-[0.7rem] font-subtitle font-bold text-[var(--preto)] flex items-center justify-between">
                <span>{getBlockAMicroLabel()}</span>
                <Sparkles className="w-3.5 h-3.5 text-[var(--exodo-red)] animate-pulse" />
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
                  className={subStepPillClass(activeStage === s.id)}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* DELIVERABLE SHORTCUT FOR BLOCO A */}
          {isBlockACompleted && (
            <div className="mt-3 pt-3 border-t border-[var(--border-default)]">
              <button
                type="button"
                onClick={() => onOpenDeliverable('retrato')}
                className="w-full py-2 px-3 bg-[var(--preto)] hover:bg-[var(--exodo-red)] text-[var(--branco)] text-[0.7rem] font-subtitle font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
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
          className={`p-4 transition-all border-2 flex flex-col justify-between ${blockCardClass(isBlockBLocked, isBlockBActive, isBlockBCompleted)}`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-[0.65rem] font-subtitle font-bold uppercase tracking-wide flex items-center gap-1 ${
                isBlockBLocked ? 'text-[var(--cinza-medio)]' : 'text-[var(--exodo-red)]'
              }`}>
                <Compass className="w-3.5 h-3.5" />
                Bloco B • Call 02
              </span>

              {isBlockBLocked ? (
                <span className="flex items-center gap-1 text-[0.65rem] font-subtitle font-bold uppercase text-[var(--cinza-medio)] bg-[var(--cinza-claro)] px-2 py-0.5">
                  <Lock className="w-3 h-3" />
                  Bloqueado
                </span>
              ) : isBlockBCompleted ? (
                <Tag tone="diagnostico" className="text-[0.62rem] px-2 py-0.5">
                  <CheckCircle2 className="w-3 h-3 inline mr-1" />
                  Concluído
                </Tag>
              ) : isBlockBActive ? (
                <Tag tone="evidencia" className="text-[0.62rem] px-2 py-0.5">Em Andamento</Tag>
              ) : (
                <span className="text-[0.65rem] font-subtitle text-[var(--cinza-medio)]">
                  Liberado
                </span>
              )}
            </div>

            <div>
              <h3 className={`font-display font-bold text-sm sm:text-base ${isBlockBLocked ? 'text-[var(--cinza-medio)]' : 'text-[var(--preto)]'}`}>
                Escolhendo seu caminho
              </h3>

              {isBlockBLocked ? (
                <p className="text-[0.72rem] font-body text-[var(--cinza-medio)] italic leading-snug pt-1">
                  "Aqui você vai escolher entre caminhos diferentes para sua clínica."
                </p>
              ) : (
                <p className="text-[0.72rem] font-body text-[var(--cinza-escuro)] leading-snug">
                  Navegador de Promessas: Expectativas, Restrições e Escolha da Configuração.
                </p>
              )}
            </div>

            {/* NESTED MICRO PROGRESS INDICATOR */}
            {isBlockBActive && (
              <div className="p-2 bg-[var(--branco)] border border-[var(--exodo-red)] text-[0.7rem] font-subtitle font-bold text-[var(--preto)] flex items-center justify-between">
                <span>{getBlockBMicroLabel()}</span>
                <Sparkles className="w-3.5 h-3.5 text-[var(--exodo-red)] animate-pulse" />
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
                    className={subStepPillClass(activeStage === s.id)}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DELIVERABLE SHORTCUT FOR BLOCO B */}
          {isBlockBCompleted && (
            <div className="mt-3 pt-3 border-t border-[var(--border-default)]">
              <button
                type="button"
                onClick={() => onOpenDeliverable('caminho')}
                className="w-full py-2 px-3 bg-[var(--preto)] hover:bg-[var(--exodo-red)] text-[var(--branco)] text-[0.7rem] font-subtitle font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Award className="w-3.5 h-3.5" />
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
          className={`p-4 transition-all border-2 flex flex-col justify-between ${blockCardClass(isBlockCLocked, isBlockCActive, isBlockCCompleted)}`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-[0.65rem] font-subtitle font-bold uppercase tracking-wide flex items-center gap-1 ${
                isBlockCLocked ? 'text-[var(--cinza-medio)]' : 'text-[var(--exodo-red)]'
              }`}>
                <Zap className="w-3.5 h-3.5" />
                Bloco C • Call 03
              </span>

              {isBlockCLocked ? (
                <span className="flex items-center gap-1 text-[0.65rem] font-subtitle font-bold uppercase text-[var(--cinza-medio)] bg-[var(--cinza-claro)] px-2 py-0.5">
                  <Lock className="w-3 h-3" />
                  Bloqueado
                </span>
              ) : isBlockCCompleted ? (
                <Tag tone="diagnostico" className="text-[0.62rem] px-2 py-0.5">
                  <CheckCircle2 className="w-3 h-3 inline mr-1" />
                  Concluído
                </Tag>
              ) : isBlockCActive ? (
                <Tag tone="evidencia" className="text-[0.62rem] px-2 py-0.5">Em Andamento</Tag>
              ) : (
                <span className="text-[0.65rem] font-subtitle text-[var(--cinza-medio)]">
                  Liberado
                </span>
              )}
            </div>

            <div>
              <h3 className={`font-display font-bold text-sm sm:text-base ${isBlockCLocked ? 'text-[var(--cinza-medio)]' : 'text-[var(--preto)]'}`}>
                Colocando em prática
              </h3>

              {isBlockCLocked ? (
                <p className="text-[0.72rem] font-body text-[var(--cinza-medio)] italic leading-snug pt-1">
                  "Aqui você vai transformar a escolha em um plano de ação de 90 dias."
                </p>
              ) : (
                <p className="text-[0.72rem] font-body text-[var(--cinza-escuro)] leading-snug">
                  Módulo Plano Tático: Roteiro operacional de 30/60/90 dias e checklist semanal.
                </p>
              )}
            </div>

            {/* NESTED MICRO PROGRESS INDICATOR */}
            {isBlockCActive && (
              <div className="p-2 bg-[var(--branco)] border border-[var(--exodo-red)] text-[0.7rem] font-subtitle font-bold text-[var(--preto)] flex items-center justify-between">
                <span>Passo 1/1: Módulo Plano Tático</span>
                <Sparkles className="w-3.5 h-3.5 text-[var(--exodo-red)] animate-pulse" />
              </div>
            )}

            {/* SUB-STEP PILL (BLOCO C) */}
            {!isBlockCLocked && (
              <div className="flex flex-wrap gap-1 pt-1">
                <button
                  type="button"
                  onClick={() => onSelectStage('tactical-plan')}
                  className={subStepPillClass(activeStage === 'tactical-plan')}
                >
                  10. Plano Tático 90 Dias
                </button>
              </div>
            )}
          </div>

          {/* DELIVERABLE SHORTCUT FOR BLOCO C */}
          {isBlockCCompleted && (
            <div className="mt-3 pt-3 border-t border-[var(--border-default)]">
              <button
                type="button"
                onClick={() => onOpenDeliverable('plano')}
                className="w-full py-2 px-3 bg-[var(--preto)] hover:bg-[var(--exodo-red)] text-[var(--branco)] text-[0.7rem] font-subtitle font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Ver Seu Plano de Ação (90 Dias)</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
