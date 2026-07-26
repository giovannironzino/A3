import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Lock, 
  Calendar, 
  Users, 
  Target, 
  Clock, 
  HelpCircle, 
  Info, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  Check,
  RotateCcw
} from 'lucide-react';
import { Button } from './UIPrimitives';
import { 
  A3ExplorationResult, 
  A3Configuration, 
  A3ConfigurationReading, 
  A3ChosenConfigurationData,
  A3CurrentModel,
  A3ExpectationsData,
  A3BoundariesData
} from '../types';
import { runNavigatorEngine } from '../lib/navigatorEngine';

interface ConfigurationChoiceStepProps {
  explorationResult?: A3ExplorationResult | null;
  savedChoice?: A3ChosenConfigurationData | null;
  currentModel?: A3CurrentModel | null;
  expectationsData?: A3ExpectationsData | null;
  boundariesData?: A3BoundariesData | null;
  onSaveChoice: (data: A3ChosenConfigurationData) => void;
  onCompleteStep: () => void;
  onToast: (msg: string) => void;
}

export const ConfigurationChoiceStep: React.FC<ConfigurationChoiceStepProps> = ({
  explorationResult: initialExplorationResult,
  savedChoice,
  currentModel,
  expectationsData,
  boundariesData,
  onSaveChoice,
  onCompleteStep,
  onToast,
}) => {
  // Ensure we have an exploration result
  const [explorationResult, setExplorationResult] = useState<A3ExplorationResult | null>(() => {
    if (initialExplorationResult && initialExplorationResult.representativeConfigurations?.length > 0) {
      return initialExplorationResult;
    }
    // Generate dynamically if needed
    return runNavigatorEngine(currentModel || null, expectationsData || null, boundariesData || null);
  });

  const representatives = explorationResult?.representativeConfigurations || [];
  const readings = explorationResult?.readings || [];

  // Currently selected config ID
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(() => {
    return savedChoice?.chosenConfig?.id || (representatives.length > 0 ? representatives[0].id : null);
  });

  // Expanded details state for each config card (numbers are secondary and collapsed by default)
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  // Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLockedConfirmed, setIsLockedConfirmed] = useState(!!savedChoice?.isConfirmed);

  const toggleExpand = (configId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedDetails(prev => ({ ...prev, [configId]: !prev[configId] }));
  };

  const selectedConfig = representatives.find(r => r.id === selectedConfigId) || representatives[0];
  const selectedReading = readings.find(r => r.configId === selectedConfig?.id) || readings[0];

  const handleOpenConfirmModal = () => {
    if (!selectedConfig || !selectedReading) {
      onToast('Selecione uma configuração antes de prosseguir.');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmLockChoice = () => {
    if (!selectedConfig || !selectedReading) return;

    const payload: A3ChosenConfigurationData = {
      chosenConfig: selectedConfig,
      reading: selectedReading,
      confirmedAt: new Date().toISOString(),
      isConfirmed: true,
    };

    onSaveChoice(payload);
    setIsLockedConfirmed(true);
    setShowConfirmModal(false);
    onToast(`Configuração "${selectedConfig.name}" travada e confirmada com sucesso!`);
    onCompleteStep();
  };

  const handleUnlockChoice = () => {
    setIsLockedConfirmed(false);
    onToast('Escolha desbloqueada para revisão.');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner Header */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-100/50 via-[var(--areia)]/60 to-transparent rounded-bl-full -z-0 pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[var(--preto)] text-white rounded-xl shadow-sm">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-subtitle font-bold uppercase tracking-widest text-neutral-500">
                  Navegador de Promessas • Escolha da Configuração Estratégica
                </span>
                <h2 className="text-2xl sm:text-3xl font-title font-bold text-[var(--preto)]">
                  Escolha da Configuração (Próximos 90 Dias)
                </h2>
              </div>
            </div>

            {isLockedConfirmed && (
              <span className="text-xs font-subtitle font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-xl px-3 py-1.5 flex items-center gap-1.5 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Configuração Escolhida e Definida
              </span>
            )}
          </div>

          {/* Opening message strictly as defined */}
          <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-5 text-xs font-body text-indigo-950 space-y-2">
            <div className="flex items-center gap-2 font-subtitle font-bold uppercase text-[0.75rem] tracking-wider text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-700" />
              Navegador de Promessas • Escolha Final
            </div>
            <p className="text-sm sm:text-base font-title font-bold text-indigo-950 leading-relaxed">
              "Encontramos formas diferentes de organizar sua clínica pelos próximos 90 dias. Nenhuma delas é a certa ou a errada — são só caminhos diferentes. Você escolhe qual se parece mais com o que você quer para sua rotina."
            </p>
          </div>
        </div>
      </div>

      {/* Confirmed Lock View Warning Banner */}
      {isLockedConfirmed && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-title font-bold text-sm text-emerald-950">
                Configuração Ativa: {selectedConfig?.name}
              </h4>
              <p className="text-xs font-body text-emerald-800">
                "{selectedReading?.signaturePhrase}"
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleUnlockChoice}
            className="text-xs font-subtitle font-bold text-emerald-900 hover:text-emerald-950 bg-white border border-emerald-300 rounded-lg px-4 py-2 flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Desbloquear para Escolher Outra
          </button>
        </div>
      )}

      {/* Main Configurations Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <h3 className="font-title font-bold text-lg text-[var(--preto)] flex items-center gap-2">
            <Compass className="w-5 h-5 text-neutral-700" />
            Caminhos Estruturais Encontrados ({representatives.length})
          </h3>
          <span className="text-xs font-body text-neutral-500">
            Clique em um cartão para selecionar a sua opção preferida.
          </span>
        </div>

        {representatives.length === 0 ? (
          <div className="p-12 text-center bg-white border border-dashed border-neutral-300 rounded-2xl space-y-3">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
            <h4 className="font-title font-bold text-base text-[var(--preto)]">
              Nenhuma configuração disponível
            </h4>
            <p className="text-xs font-body text-neutral-600 max-w-md mx-auto">
              Certifique-se de que a etapa de Diagnóstico, Modelo Atual e Condições foram preenchidas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {representatives.map((config, index) => {
              const reading = readings.find(r => r.configId === config.id);
              const isSelected = config.id === selectedConfigId;
              const isExpanded = !!expandedDetails[config.id];

              return (
                <div
                  key={config.id}
                  onClick={() => !isLockedConfirmed && setSelectedConfigId(config.id)}
                  className={`bg-white border-2 rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between relative group shadow-sm ${
                    isSelected
                      ? 'border-[var(--preto)] ring-2 ring-[var(--preto)]/10 shadow-md bg-neutral-50/40'
                      : 'border-neutral-200 hover:border-neutral-400 hover:shadow-md cursor-pointer'
                  } ${isLockedConfirmed && !isSelected ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  {/* Top Badge & Numbering */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                      <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200">
                        Caminho 0{index + 1} • {config.workDaysCount} Dias Úteis
                      </span>

                      {isSelected && (
                        <span className="text-xs font-subtitle font-bold text-white bg-[var(--preto)] px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Selecionado
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="font-title font-bold text-base text-[var(--preto)] leading-snug">
                      {config.name}
                    </h4>

                    {/* FRASE-ASSINATURA EM DESTAQUE PRINCIPAL */}
                    <div className="bg-[var(--areia)]/80 border-l-4 border-[var(--preto)] p-4 rounded-r-xl shadow-2xs space-y-1">
                      <span className="text-[0.6rem] font-subtitle font-bold uppercase tracking-wider text-neutral-600 block">
                        Assinatura Estrutural
                      </span>
                      <p className="text-xs sm:text-sm font-title font-bold text-[var(--preto)] leading-relaxed italic">
                        "{reading?.signaturePhrase || config.description}"
                      </p>
                    </div>

                    {/* Operational Overview sentence */}
                    <p className="text-xs font-body text-neutral-600 leading-relaxed">
                      {reading?.operationalImpactText}
                    </p>
                  </div>

                  {/* SECONDARY DETAILS (NUMBERS / METRICS - EXPANDABLE) */}
                  <div className="mt-6 pt-4 border-t border-neutral-200/80 space-y-3">
                    <button
                      type="button"
                      onClick={(e) => toggleExpand(config.id, e)}
                      className="w-full text-[0.7rem] font-subtitle font-bold uppercase tracking-wider text-neutral-600 hover:text-[var(--preto)] flex items-center justify-between py-1 px-2 rounded hover:bg-neutral-100/60 transition-colors cursor-pointer"
                    >
                      <span>
                        {isExpanded ? 'Ocultar Números de Apoio' : 'Ver Números de Apoio e Detalhes'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-neutral-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-neutral-500" />
                      )}
                    </button>

                    {isExpanded && reading && (
                      <div className="bg-neutral-100/70 border border-neutral-200 rounded-xl p-3.5 space-y-2.5 text-xs font-body animate-fadeIn">
                        <div className="flex items-center justify-between text-neutral-700 pb-1.5 border-b border-neutral-200/60">
                          <span className="flex items-center gap-1.5 text-[0.7rem] font-subtitle font-bold">
                            <Calendar className="w-3.5 h-3.5 text-neutral-500" /> Ocupação da Agenda:
                          </span>
                          <span className="font-bold text-[var(--preto)]">
                            {reading.scheduleOccupancyPercentage}%
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-neutral-700 pb-1.5 border-b border-neutral-200/60">
                          <span className="flex items-center gap-1.5 text-[0.7rem] font-subtitle font-bold">
                            <Users className="w-3.5 h-3.5 text-neutral-500" /> Capacidade Total:
                          </span>
                          <span className="font-bold text-[var(--preto)]">
                            até {reading.maxActivePatientCapacity} pacientes
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-neutral-700 pb-1.5 border-b border-neutral-200/60">
                          <span className="flex items-center gap-1.5 text-[0.7rem] font-subtitle font-bold">
                            <Target className="w-3.5 h-3.5 text-emerald-600" /> Tempo para Captação:
                          </span>
                          <span className="font-bold text-emerald-700">
                            {reading.weeklyAcquisitionHours}h / semana
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-neutral-700 pb-1.5 border-b border-neutral-200/60">
                          <span className="flex items-center gap-1.5 text-[0.7rem] font-subtitle font-bold">
                            <Clock className="w-3.5 h-3.5 text-neutral-500" /> Atendimento Clínico:
                          </span>
                          <span className="font-bold text-[var(--preto)]">
                            {reading.weeklyClinicalHours}h / semana
                          </span>
                        </div>

                        <div className="pt-1 text-[0.65rem] text-emerald-800 font-subtitle font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          {reading.patientContractStatusText}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FINAL QUESTION & CONFIRMATION ACTION BOX */}
      {!isLockedConfirmed && (
        <div className="bg-white border-2 border-[var(--preto)] rounded-2xl p-6 sm:p-8 shadow-md space-y-6 max-w-3xl mx-auto">
          <div className="space-y-2 text-center">
            <span className="text-xs font-subtitle font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 inline-block">
              Pergunta Final de Decisão
            </span>
            <h3 className="text-xl sm:text-2xl font-title font-bold text-[var(--preto)] leading-snug">
              "Qual desses jeitos de organizar a clínica mais parece com o que você imagina pro seu dia a dia?"
            </h3>
            {selectedConfig && (
              <p className="text-xs font-body text-neutral-600">
                Você atualmente selecionou a <strong>{selectedConfig.name}</strong>.
              </p>
            )}
          </div>

          <div className="pt-2 flex justify-center">
            <Button
              onClick={handleOpenConfirmModal}
              disabled={!selectedConfig}
              className="bg-[var(--preto)] text-white hover:bg-neutral-800 text-sm py-4 px-8 rounded-xl flex items-center justify-center gap-2.5 shadow-md w-full sm:w-auto cursor-pointer"
            >
              Confirmar Escolha da Configuração <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* EXPLICIT CONFIRMATION MODAL */}
      {showConfirmModal && selectedConfig && selectedReading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border-2 border-[var(--preto)] rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="space-y-3">
              <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                <div className="p-3 bg-amber-100 text-amber-900 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wider text-amber-800">
                    Confirmação de Decisão Estratégica
                  </span>
                  <h3 className="text-xl font-title font-bold text-[var(--preto)]">
                    Travar e Definir Configuração
                  </h3>
                </div>
              </div>

              <p className="text-xs font-body text-neutral-700 leading-relaxed">
                Você está prestes a definir a <strong>{selectedConfig.name}</strong> como o modelo oficial para a operação da sua clínica nos próximos 90 dias.
              </p>

              <div className="bg-[var(--areia)] p-4 rounded-xl border border-neutral-300 space-y-1">
                <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wider text-neutral-600 block">
                  Visão da Rotina Escolhida:
                </span>
                <p className="text-xs font-title font-bold text-[var(--preto)] italic">
                  "{selectedReading.signaturePhrase}"
                </p>
              </div>

              <p className="text-xs font-body text-neutral-600 italic">
                Esta escolha servirá como a única referência para a construção do seu Plano Tático de Ação na sequência.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-full sm:w-auto px-5 py-3 text-xs font-subtitle font-bold text-neutral-600 hover:text-[var(--preto)] bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
              >
                Revisar Outras Opções
              </button>

              <Button
                onClick={handleConfirmLockChoice}
                className="w-full sm:w-auto bg-[var(--preto)] text-white hover:bg-neutral-800 text-xs py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Confirmar e Travar Escolha
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
