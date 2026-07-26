import React, { useState, useEffect } from 'react';
import {
  Compass,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Lock,
  Calendar,
  Users,
  Target,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Check,
  RotateCcw
} from 'lucide-react';
import { Button, Tag, Callout, SectionTopic } from './UIPrimitives';
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
      <div className="bg-[var(--branco)] border border-[var(--border-strong)] p-6 sm:p-8 relative overflow-hidden">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-default)] pb-4">
            <SectionTopic label="Navegador de Promessas • Escolha da Configuração Estratégica">
              Escolha da Configuração (Próximos 90 Dias)
            </SectionTopic>

            {isLockedConfirmed && (
              <Tag tone="diagnostico" className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Configuração Escolhida e Definida
              </Tag>
            )}
          </div>

          {/* Opening message strictly as defined */}
          <Callout label="Navegador de Promessas • Escolha Final" tone="accent">
            "Encontramos formas diferentes de organizar sua clínica pelos próximos 90 dias. Nenhuma delas é a certa ou a errada — são só caminhos diferentes. Você escolhe qual se parece mais com o que você quer para sua rotina."
          </Callout>
        </div>
      </div>

      {/* Confirmed Lock View Warning Banner */}
      {isLockedConfirmed && (
        <div className="bg-[var(--branco)] border-2 border-[var(--preto)] p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[var(--preto)] text-[var(--branco)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-[var(--preto)]">
                Configuração Ativa: {selectedConfig?.name}
              </h4>
              <p className="text-xs font-body text-[var(--cinza-escuro)]">
                "{selectedReading?.signaturePhrase}"
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleUnlockChoice}
            className="text-xs font-subtitle font-bold text-[var(--preto)] hover:text-[var(--exodo-red)] bg-[var(--branco)] border border-[var(--border-strong)] px-4 py-2 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Desbloquear para Escolher Outra
          </button>
        </div>
      )}

      {/* Main Configurations Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
          <h3 className="font-display font-bold text-lg text-[var(--preto)] flex items-center gap-2">
            <Compass className="w-5 h-5 text-[var(--exodo-red)]" />
            Caminhos Estruturais Encontrados ({representatives.length})
          </h3>
          <span className="text-xs font-body text-[var(--cinza-medio)]">
            Clique em um cartão para selecionar a sua opção preferida.
          </span>
        </div>

        {representatives.length === 0 ? (
          <div className="p-12 text-center bg-[var(--branco)] border border-dashed border-[var(--border-strong)] space-y-3">
            <AlertTriangle className="w-10 h-10 text-[var(--exodo-red)] mx-auto" />
            <h4 className="font-display font-bold text-base text-[var(--preto)]">
              Nenhuma configuração disponível
            </h4>
            <p className="text-xs font-body text-[var(--cinza-escuro)] max-w-md mx-auto">
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
                  className={`bg-[var(--branco)] border-2 p-6 transition-all duration-200 flex flex-col justify-between relative group ${
                    isSelected
                      ? 'border-[var(--preto)] bg-[var(--cinza-claro)]'
                      : 'border-[var(--border-default)] hover:border-[var(--cinza-medio)] cursor-pointer'
                  } ${isLockedConfirmed && !isSelected ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  {/* Top Badge & Numbering */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 border-b border-[var(--border-default)] pb-3">
                      <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wide text-[var(--cinza-medio)] border border-[var(--border-default)] px-2.5 py-1">
                        Caminho 0{index + 1} • {config.workDaysCount} Dias Úteis
                      </span>

                      {isSelected && (
                        <Tag tone="diagnostico" className="flex items-center gap-1 text-[0.65rem]">
                          <Check className="w-3.5 h-3.5" /> Selecionado
                        </Tag>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="font-subtitle font-bold text-base text-[var(--preto)] leading-snug">
                      {config.name}
                    </h4>

                    {/* FRASE-ASSINATURA EM DESTAQUE PRINCIPAL */}
                    <div className="bg-[var(--branco)] border-l-4 border-[var(--exodo-red)] pl-4 py-1 space-y-1">
                      <span className="text-[0.6rem] font-subtitle font-bold uppercase tracking-wide text-[var(--cinza-medio)] block">
                        Assinatura Estrutural
                      </span>
                      <p className="text-xs sm:text-sm font-display text-[var(--preto)] leading-relaxed">
                        "{reading?.signaturePhrase || config.description}"
                      </p>
                    </div>

                    {/* Operational Overview sentence */}
                    <p className="text-xs font-body text-[var(--cinza-escuro)] leading-relaxed">
                      {reading?.operationalImpactText}
                    </p>
                  </div>

                  {/* SECONDARY DETAILS (NUMBERS / METRICS - EXPANDABLE) */}
                  <div className="mt-6 pt-4 border-t border-[var(--border-default)] space-y-3">
                    <button
                      type="button"
                      onClick={(e) => toggleExpand(config.id, e)}
                      className="w-full text-[0.7rem] font-subtitle font-bold uppercase tracking-wide text-[var(--cinza-escuro)] hover:text-[var(--exodo-red)] flex items-center justify-between py-1 px-2 hover:bg-[var(--cinza-claro)] transition-colors cursor-pointer"
                    >
                      <span>
                        {isExpanded ? 'Ocultar Números de Apoio' : 'Ver Números de Apoio e Detalhes'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {isExpanded && reading && (
                      <div className="bg-[var(--cinza-claro)] p-3.5 space-y-2.5 text-xs font-body animate-fadeIn">
                        <div className="flex items-center justify-between text-[var(--cinza-escuro)] pb-1.5 border-b border-[var(--border-default)]">
                          <span className="flex items-center gap-1.5 text-[0.7rem] font-subtitle font-bold">
                            <Calendar className="w-3.5 h-3.5" /> Ocupação da Agenda:
                          </span>
                          <span className="font-bold text-[var(--preto)]">
                            {reading.scheduleOccupancyPercentage}%
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[var(--cinza-escuro)] pb-1.5 border-b border-[var(--border-default)]">
                          <span className="flex items-center gap-1.5 text-[0.7rem] font-subtitle font-bold">
                            <Users className="w-3.5 h-3.5" /> Capacidade Total:
                          </span>
                          <span className="font-bold text-[var(--preto)]">
                            até {reading.maxActivePatientCapacity} pacientes
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[var(--cinza-escuro)] pb-1.5 border-b border-[var(--border-default)]">
                          <span className="flex items-center gap-1.5 text-[0.7rem] font-subtitle font-bold">
                            <Target className="w-3.5 h-3.5 text-[var(--exodo-red)]" /> Tempo para Captação:
                          </span>
                          <span className="font-bold text-[var(--exodo-red)]">
                            {reading.weeklyAcquisitionHours}h / semana
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[var(--cinza-escuro)] pb-1.5 border-b border-[var(--border-default)]">
                          <span className="flex items-center gap-1.5 text-[0.7rem] font-subtitle font-bold">
                            <Clock className="w-3.5 h-3.5" /> Atendimento Clínico:
                          </span>
                          <span className="font-bold text-[var(--preto)]">
                            {reading.weeklyClinicalHours}h / semana
                          </span>
                        </div>

                        <div className="pt-1 text-[0.65rem] text-[var(--preto)] font-subtitle font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-[var(--exodo-red)]" />
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
        <div className="bg-[var(--branco)] border-2 border-[var(--preto)] p-6 sm:p-8 space-y-6 max-w-3xl mx-auto text-center">
          <div className="space-y-2">
            <Tag tone="evidencia">Pergunta Final de Decisão</Tag>
            <h3 className="text-xl sm:text-2xl font-display text-[var(--preto)] leading-snug">
              "Qual desses jeitos de organizar a clínica mais parece com o que você imagina pro seu dia a dia?"
            </h3>
            {selectedConfig && (
              <p className="text-xs font-body text-[var(--cinza-escuro)]">
                Você atualmente selecionou a <strong className="text-[var(--preto)]">{selectedConfig.name}</strong>.
              </p>
            )}
          </div>

          <div className="pt-2 flex justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleOpenConfirmModal}
              disabled={!selectedConfig}
              className="w-full sm:w-auto"
            >
              Confirmar Escolha da Configuração <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* EXPLICIT CONFIRMATION MODAL */}
      {showConfirmModal && selectedConfig && selectedReading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[var(--branco)] border-2 border-[var(--preto)] max-w-xl w-full p-6 sm:p-8 space-y-6 relative">
            <div className="space-y-3">
              <div className="flex items-center gap-3 border-b border-[var(--border-default)] pb-3">
                <div className="p-3 bg-[var(--preto)] text-[var(--branco)]">
                  <AlertTriangle className="w-6 h-6 text-[var(--exodo-red)]" />
                </div>
                <div>
                  <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wide text-[var(--exodo-red)]">
                    Confirmação de Decisão Estratégica
                  </span>
                  <h3 className="text-xl font-display text-[var(--preto)]">
                    Travar e Definir Configuração
                  </h3>
                </div>
              </div>

              <p className="text-xs font-body text-[var(--cinza-escuro)] leading-relaxed">
                Você está prestes a definir a <strong className="text-[var(--preto)]">{selectedConfig.name}</strong> como o modelo oficial para a operação da sua clínica nos próximos 90 dias.
              </p>

              <div className="bg-[var(--cinza-claro)] p-4 space-y-1">
                <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wide text-[var(--cinza-medio)] block">
                  Visão da Rotina Escolhida:
                </span>
                <p className="text-xs font-display text-[var(--preto)]">
                  "{selectedReading.signaturePhrase}"
                </p>
              </div>

              <p className="text-xs font-body text-[var(--cinza-medio)] italic">
                Esta escolha servirá como a única referência para a construção do seu Plano Tático de Ação na sequência.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[var(--border-default)]">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-full sm:w-auto px-5 py-3 text-xs font-subtitle font-bold text-[var(--cinza-escuro)] hover:text-[var(--preto)] bg-[var(--cinza-claro)] hover:bg-[var(--border-default)] transition-colors cursor-pointer"
              >
                Revisar Outras Opções
              </button>

              <Button variant="primary" size="md" onClick={handleConfirmLockChoice} className="w-full sm:w-auto">
                <CheckCircle2 className="w-4 h-4" />
                Confirmar e Travar Escolha
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
