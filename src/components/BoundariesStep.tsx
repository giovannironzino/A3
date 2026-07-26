import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Sliders, 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  ArrowRight, 
  Check, 
  Info, 
  HelpCircle, 
  Sparkles, 
  AlertCircle, 
  ChevronRight,
  Shield,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { Button } from './UIPrimitives';
import { A3BoundaryItem, A3BoundariesData, BoundaryType } from '../types';

interface BoundariesStepProps {
  initialData?: A3BoundariesData | null;
  onSaveData: (data: A3BoundariesData) => void;
  onCompleteStep: () => void;
  onToast: (msg: string) => void;
}

const FIXED_SUGGESTIONS = [
  "Contrato de aluguel do consultório assinado com vigência de 2 anos.",
  "Atendimento em hospital parceiro nas terças-feiras de manhã.",
  "Compromisso familiar fixo nas quintas-feiras a partir das 17h.",
  "Aconselhamento ou preceptoria de residência já agendada.",
];

const DESIRED_SUGGESTIONS = [
  "Gostaria de manter o atendimento presencial para a primeira consulta.",
  "Prefiro manter o intervalo de 15 minutos entre as consultas.",
  "Gostaria de manter a secretária para agendamentos presenciais.",
  "Prefiro não atender aos sábados, mas toparia se necessário para transição.",
];

export const BoundariesStep: React.FC<BoundariesStepProps> = ({
  initialData,
  onSaveData,
  onCompleteStep,
  onToast,
}) => {
  const [items, setItems] = useState<A3BoundaryItem[]>(() => {
    return initialData?.items || [];
  });

  // Current sub-stage:
  // 'fixed' -> Question 1: Compromissos Assumidos (Fixas)
  // 'desired' -> Question 2: Preferências Ajustáveis (Desejadas)
  // 'review' -> Etapa 04/05: Revisão integrada ("Aqui está o que você me disse... Confere?")
  const [activeSubStage, setActiveSubStage] = useState<'fixed' | 'desired' | 'review'>('fixed');

  // Input states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [descriptionInput, setDescriptionInput] = useState('');
  const [detailsInput, setDetailsInput] = useState('');

  const fixedItems = items.filter((i) => i.type === 'Fixa');
  const desiredItems = items.filter((i) => i.type === 'Desejada');

  const resetForm = () => {
    setEditingId(null);
    setDescriptionInput('');
    setDetailsInput('');
  };

  const handleStartEdit = (item: A3BoundaryItem) => {
    setEditingId(item.id);
    setDescriptionInput(item.description);
    setDetailsInput(item.details || '');
    if (item.type === 'Fixa') {
      setActiveSubStage('fixed');
    } else {
      setActiveSubStage('desired');
    }
  };

  const handleAddItem = (targetType: BoundaryType) => {
    if (!descriptionInput.trim()) {
      onToast('Por favor, descreva a condição antes de adicionar.');
      return;
    }

    if (editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                description: descriptionInput.trim(),
                details: detailsInput.trim(),
                type: targetType,
              }
            : item
        )
      );
      onToast('Condição atualizada com sucesso!');
    } else {
      const newItem: A3BoundaryItem = {
        id: `bound_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        description: descriptionInput.trim(),
        details: detailsInput.trim(),
        type: targetType,
        createdAt: new Date().toISOString(),
      };
      setItems((prev) => [...prev, newItem]);
      onToast(
        targetType === 'Fixa'
          ? 'Compromisso inegociável registrado!'
          : 'Preferência ajustável registrada!'
      );
    }

    resetForm();
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    onToast('Item removido.');
  };

  const handleToggleType = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextType: BoundaryType = item.type === 'Fixa' ? 'Desejada' : 'Fixa';
          onToast(
            nextType === 'Fixa'
              ? 'Reclassificado para Compromisso Assumido.'
              : 'Reclassificado para Preferência Ajustável.'
          );
          return { ...item, type: nextType };
        }
        return item;
      })
    );
  };

  const handleSaveAndComplete = (isCompleted: boolean = false) => {
    if (items.length === 0) {
      onToast('Registre pelo menos um compromisso ou preferência antes de avançar.');
      return;
    }

    const payload: A3BoundariesData = {
      items,
      isCompleted,
      updatedAt: new Date().toISOString(),
    };

    onSaveData(payload);

    if (isCompleted) {
      onToast('Condições operacionais validadas com sucesso!');
      onCompleteStep();
    } else {
      onToast('Progresso salvo.');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner Header */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-100/40 via-[var(--areia)]/50 to-transparent rounded-bl-full -z-0 pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[var(--preto)] text-white rounded-xl shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-subtitle font-bold uppercase tracking-widest text-neutral-500">
                  Entrega 02 • Diagnóstico e Limites Operacionais
                </span>
                <h2 className="text-2xl sm:text-3xl font-title font-bold text-[var(--preto)]">
                  Condições e Compromissos da Clínica
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-subtitle font-bold text-neutral-600 bg-neutral-100 border border-neutral-200 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                {items.length} {items.length === 1 ? 'Condição' : 'Condições'} Registradas
              </span>
            </div>
          </div>

          {/* Initial Warm Message without using the word "restrição" */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs font-body text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-subtitle font-bold uppercase text-[0.75rem] tracking-wider text-amber-900">
              <Info className="w-4 h-4 text-amber-700" />
              Delimitando o Espaço de Soluções
            </div>
            <p className="leading-relaxed">
              Agora vamos falar sobre o que <strong>não pode mudar</strong>, e o que você <strong>prefere manter</strong>, mas toparia ajustar se fizer sentido. O sistema utilizará esses limites para construir apenas alternativas viáveis e respeitosas com a sua realidade.
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Stage Navigation Bar */}
      <div className="flex border-b border-neutral-200 bg-white rounded-xl p-1.5 border shadow-sm max-w-3xl mx-auto">
        <button
          type="button"
          onClick={() => setActiveSubStage('fixed')}
          className={`flex-1 py-2.5 px-3 text-xs font-subtitle font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubStage === 'fixed'
              ? 'bg-[var(--preto)] text-white shadow-sm'
              : 'text-neutral-600 hover:text-[var(--preto)] hover:bg-neutral-50'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          1. Compromissos Assumidos ({fixedItems.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubStage('desired')}
          className={`flex-1 py-2.5 px-3 text-xs font-subtitle font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubStage === 'desired'
              ? 'bg-[var(--preto)] text-white shadow-sm'
              : 'text-neutral-600 hover:text-[var(--preto)] hover:bg-neutral-50'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-blue-400" />
          2. Preferências Ajustáveis ({desiredItems.length})
        </button>

        <button
          type="button"
          onClick={() => {
            if (items.length === 0) {
              onToast('Registre pelo menos uma condição antes de revisar.');
              return;
            }
            setActiveSubStage('review');
          }}
          className={`flex-1 py-2.5 px-3 text-xs font-subtitle font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubStage === 'review'
              ? 'bg-[var(--preto)] text-white shadow-sm'
              : 'text-neutral-600 hover:text-[var(--preto)] hover:bg-neutral-50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          3. Revisão Integrada
        </button>
      </div>

      {/* SUB-STAGE 1: COMPROMISSOS INEGOCIÁVEIS (FIXAS) */}
      {activeSubStage === 'fixed' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="space-y-1 border-b border-neutral-100 pb-3">
              <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Condições Inegociáveis
              </span>
              <h3 className="font-title font-bold text-lg text-[var(--preto)] flex items-center gap-2 pt-1">
                <Lock className="w-5 h-5 text-amber-600" />
                Existe alguma condição que você já prometeu e não pode deixar de cumprir, seja qual for o caminho escolhido?
              </h3>
              <p className="text-xs font-body text-neutral-600">
                Coisas que são obrigatórias, como contratos vigentes, compromissos fixos assumidos ou horários intocáveis.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-subtitle font-bold uppercase tracking-wider text-[var(--preto)]">
                  Descreva este compromisso ou condição inegociável *
                </label>
                <textarea
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  placeholder="Ex: Contrato de locação do consultório ativo até dezembro de 2026..."
                  rows={3}
                  className="w-full text-xs font-body p-3.5 border border-neutral-300 rounded-xl focus:outline-none focus:border-[var(--preto)] transition-colors resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-subtitle font-bold uppercase tracking-wider text-neutral-700">
                  Observações ou contexto adicional (opcional)
                </label>
                <input
                  type="text"
                  value={detailsInput}
                  onChange={(e) => setDetailsInput(e.target.value)}
                  placeholder="Ex: Multa rescisória de 50% em caso de saída antecipada..."
                  className="w-full text-xs font-body p-3 border border-neutral-300 rounded-xl focus:outline-none focus:border-[var(--preto)]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs font-subtitle text-neutral-500 hover:text-[var(--preto)] underline cursor-pointer"
                  >
                    Cancelar edição
                  </button>
                )}
                <Button
                  type="button"
                  onClick={() => handleAddItem('Fixa')}
                  className="bg-[var(--preto)] text-white hover:bg-neutral-800 text-xs py-3 px-6 rounded-xl flex items-center gap-2 shadow-sm ml-auto"
                >
                  {editingId ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
                  {editingId ? 'Atualizar Compromisso' : 'Adicionar como Compromisso Inegociável'}
                </Button>
              </div>
            </div>

            {/* Suggestions Box */}
            <div className="pt-4 border-t border-neutral-100 space-y-3">
              <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Exemplos de Compromissos Inegociáveis
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FIXED_SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDescriptionInput(sug)}
                    className="text-[0.7rem] font-body text-neutral-700 bg-neutral-50 hover:bg-amber-50 border border-neutral-200 hover:border-amber-300 rounded-lg p-2.5 text-left transition-colors cursor-pointer"
                  >
                    "{sug}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List Box Side Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h4 className="font-title font-bold text-sm text-[var(--preto)] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  Compromissos Cadastrados ({fixedItems.length})
                </h4>
              </div>

              {fixedItems.length === 0 ? (
                <div className="p-8 text-center bg-neutral-50 border border-dashed border-neutral-200 rounded-xl space-y-2">
                  <Shield className="w-8 h-8 text-neutral-400 mx-auto" />
                  <p className="text-xs font-subtitle font-bold text-neutral-600">
                    Nenhum compromisso inegociável adicionado
                  </p>
                  <p className="text-[0.7rem] font-body text-neutral-500">
                    Se você possui condições obrigatórias que não podem mudar, registre-as ao lado.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {fixedItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 space-y-2 relative group hover:border-amber-300 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[0.6rem] font-subtitle font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                          Compromisso Assumido (Inegociável)
                        </span>
                      </div>

                      <h5 className="font-title font-bold text-xs text-[var(--preto)] leading-snug">
                        #{index + 1}. {item.description}
                      </h5>

                      {item.details && (
                        <p className="text-[0.7rem] font-body text-neutral-600 italic">
                          Nota: {item.details}
                        </p>
                      )}

                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-amber-200/60">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="p-1 text-neutral-500 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1 text-neutral-500 hover:text-red-600 transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2">
                <Button
                  onClick={() => {
                    resetForm();
                    setActiveSubStage('desired');
                  }}
                  className="w-full bg-[var(--preto)] text-white hover:bg-neutral-800 text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm"
                >
                  Ir para Preferências Ajustáveis <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-STAGE 2: PREFERÊNCIAS AJUSTÁVEIS (DESEJADAS) */}
      {activeSubStage === 'desired' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="space-y-1 border-b border-neutral-100 pb-3">
              <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Preferências Ajustáveis
              </span>
              <h3 className="font-title font-bold text-lg text-[var(--preto)] flex items-center gap-2 pt-1">
                <Sliders className="w-5 h-5 text-blue-600" />
                Existe algo que você gostaria de manter, mas que toparia ajustar se precisasse?
              </h3>
              <p className="text-xs font-body text-neutral-600">
                Coisas que representam preferências da sua rotina atual, mas que você tem disposição para flexibilizar em troca de melhores resultados.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-subtitle font-bold uppercase tracking-wider text-[var(--preto)]">
                  Descreva esta preferência ajustável *
                </label>
                <textarea
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  placeholder="Ex: Gostaria de manter atendimentos presenciais, mas toparia ir para o online se isso liberar tempo..."
                  rows={3}
                  className="w-full text-xs font-body p-3.5 border border-neutral-300 rounded-xl focus:outline-none focus:border-[var(--preto)] transition-colors resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-subtitle font-bold uppercase tracking-wider text-neutral-700">
                  Condição para flexibilizar (opcional)
                </label>
                <input
                  type="text"
                  value={detailsInput}
                  onChange={(e) => setDetailsInput(e.target.value)}
                  placeholder="Ex: Desde que o faturamento da clínica não diminua..."
                  className="w-full text-xs font-body p-3 border border-neutral-300 rounded-xl focus:outline-none focus:border-[var(--preto)]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs font-subtitle text-neutral-500 hover:text-[var(--preto)] underline cursor-pointer"
                  >
                    Cancelar edição
                  </button>
                )}
                <Button
                  type="button"
                  onClick={() => handleAddItem('Desejada')}
                  className="bg-[var(--preto)] text-white hover:bg-neutral-800 text-xs py-3 px-6 rounded-xl flex items-center gap-2 shadow-sm ml-auto"
                >
                  {editingId ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
                  {editingId ? 'Atualizar Preferência' : 'Adicionar como Preferência Ajustável'}
                </Button>
              </div>
            </div>

            {/* Suggestions Box */}
            <div className="pt-4 border-t border-neutral-100 space-y-3">
              <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                Exemplos de Preferências Ajustáveis
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DESIRED_SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDescriptionInput(sug)}
                    className="text-[0.7rem] font-body text-neutral-700 bg-neutral-50 hover:bg-blue-50 border border-neutral-200 hover:border-blue-300 rounded-lg p-2.5 text-left transition-colors cursor-pointer"
                  >
                    "{sug}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List Box Side Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h4 className="font-title font-bold text-sm text-[var(--preto)] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  Preferências Cadastradas ({desiredItems.length})
                </h4>
              </div>

              {desiredItems.length === 0 ? (
                <div className="p-8 text-center bg-neutral-50 border border-dashed border-neutral-200 rounded-xl space-y-2">
                  <Sliders className="w-8 h-8 text-neutral-400 mx-auto" />
                  <p className="text-xs font-subtitle font-bold text-neutral-600">
                    Nenhuma preferência ajustável adicionada
                  </p>
                  <p className="text-[0.7rem] font-body text-neutral-500">
                    Se existem aspectos que você gostaria de manter, mas aceita adaptar se necessário, adicione-os ao lado.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {desiredItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-blue-50/60 border border-blue-200 rounded-xl p-3.5 space-y-2 relative group hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[0.6rem] font-subtitle font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
                          Preferência Ajustável (Flexível)
                        </span>
                      </div>

                      <h5 className="font-title font-bold text-xs text-[var(--preto)] leading-snug">
                        #{index + 1}. {item.description}
                      </h5>

                      {item.details && (
                        <p className="text-[0.7rem] font-body text-neutral-600 italic">
                          Condição: {item.details}
                        </p>
                      )}

                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-blue-200/60">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="p-1 text-neutral-500 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1 text-neutral-500 hover:text-red-600 transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2">
                <Button
                  onClick={() => {
                    if (items.length === 0) {
                      onToast('Registre pelo menos uma condição antes de avançar.');
                      return;
                    }
                    setActiveSubStage('review');
                  }}
                  className="w-full bg-[var(--preto)] text-white hover:bg-neutral-800 text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm"
                >
                  Avançar para Revisão <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-STAGE 3: REVISÃO INTEGRADA (ETAPA 04 / 05) */}
      {activeSubStage === 'review' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Prompt Dialogue Card (Etapa 04) */}
          <div className="bg-white border-2 border-neutral-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-2 border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2 text-xs font-subtitle font-bold uppercase tracking-wider text-purple-700">
                <HeartHandshake className="w-4 h-4" />
                Revisão da Classificação
              </div>
              <h3 className="text-xl font-title font-bold text-[var(--preto)]">
                "Aqui está o que você me disse: isto aqui já é um compromisso assumido, e isto aqui é algo que você gostaria, mas pode abrir mão se precisar. Confere?"
              </h3>
              <p className="text-xs font-body text-neutral-600">
                Confira a divisão das suas condições operacionais abaixo. Se quiser alternar o papel de algum item entre "Compromisso Assumido" e "Preferência Ajustável", clique no botão de alternar.
              </p>
            </div>

            {/* Split View of Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1: Compromissos Assumidos */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-700" />
                    <h4 className="font-title font-bold text-sm text-amber-950">
                      Compromissos Assumidos ({fixedItems.length})
                    </h4>
                  </div>
                  <span className="text-[0.65rem] font-subtitle font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                    Obrigatório
                  </span>
                </div>

                {fixedItems.length === 0 ? (
                  <p className="text-xs font-body text-neutral-500 italic py-2">
                    Nenhum compromisso inegociável registrado.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {fixedItems.map((item, idx) => (
                      <div key={item.id} className="bg-white border border-amber-200 rounded-lg p-3 space-y-1.5 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-title font-bold text-xs text-[var(--preto)]">
                            #{idx + 1}. {item.description}
                          </span>
                        </div>
                        {item.details && (
                          <p className="text-[0.7rem] font-body text-neutral-600 italic">
                            {item.details}
                          </p>
                        )}
                        <div className="pt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleToggleType(item.id)}
                            className="text-[0.65rem] font-subtitle font-bold text-neutral-600 hover:text-blue-700 underline cursor-pointer"
                          >
                            Mudar para Preferência Ajustável →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Box 2: Preferências Ajustáveis */}
              <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-blue-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-blue-700" />
                    <h4 className="font-title font-bold text-sm text-blue-950">
                      Preferências Ajustáveis ({desiredItems.length})
                    </h4>
                  </div>
                  <span className="text-[0.65rem] font-subtitle font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded border border-blue-300">
                    Flexível
                  </span>
                </div>

                {desiredItems.length === 0 ? (
                  <p className="text-xs font-body text-neutral-500 italic py-2">
                    Nenhuma preferência ajustável registrada.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {desiredItems.map((item, idx) => (
                      <div key={item.id} className="bg-white border border-blue-200 rounded-lg p-3 space-y-1.5 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-title font-bold text-xs text-[var(--preto)]">
                            #{idx + 1}. {item.description}
                          </span>
                        </div>
                        {item.details && (
                          <p className="text-[0.7rem] font-body text-neutral-600 italic">
                            {item.details}
                          </p>
                        )}
                        <div className="pt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleToggleType(item.id)}
                            className="text-[0.65rem] font-subtitle font-bold text-neutral-600 hover:text-amber-800 underline cursor-pointer"
                          >
                            ← Mudar para Compromisso Assumido
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Final Approval Box */}
          <div className="bg-[var(--areia)]/60 border-2 border-[var(--preto)] rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
            <div className="space-y-2 text-center max-w-xl mx-auto">
              <div className="w-12 h-12 bg-[var(--preto)] text-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-title font-bold text-[var(--preto)]">
                Aprovar Limites e Condições Operacionais
              </h3>
              <p className="text-xs font-body text-neutral-700 leading-relaxed">
                Ao confirmar, o sistema utilizará estas regras para delimitar e construir diferentes alternativas viáveis de organização estratégica para a sua clínica.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handleSaveAndComplete(false)}
                className="w-full sm:w-auto px-5 py-3 text-xs font-subtitle font-bold text-neutral-700 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Salvar Rascunho
              </button>

              <Button
                onClick={() => handleSaveAndComplete(true)}
                className="w-full sm:w-auto bg-[var(--preto)] text-white hover:bg-neutral-800 flex items-center justify-center gap-2.5 py-3.5 px-8 text-sm shadow-md"
              >
                Aprovar Condições e Concluir <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
