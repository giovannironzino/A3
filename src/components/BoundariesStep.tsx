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
  Sparkles,
  ChevronRight,
  Shield,
  HeartHandshake
} from 'lucide-react';
import { Button, Tag, Callout, CornerAccent } from './UIPrimitives';
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
      <div className="bg-[var(--branco)] border border-[var(--border-strong)] p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 pointer-events-none">
          <CornerAccent variant="arredondado" size={100} />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-default)] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[var(--preto)] text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-subtitle font-bold uppercase tracking-widest text-[var(--cinza-medio)]">
                  Entrega 02 • Diagnóstico e Limites Operacionais
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-[var(--preto)]">
                  Condições e Compromissos da Clínica
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tag tone="informacao" className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                {items.length} {items.length === 1 ? 'Condição' : 'Condições'} Registradas
              </Tag>
            </div>
          </div>

          {/* Initial Warm Message without using the word "restrição" */}
          <Callout label="Delimitando o Espaço de Soluções">
            Agora vamos falar sobre o que <strong>não pode mudar</strong>, e o que você <strong>prefere manter</strong>, mas toparia ajustar se fizer sentido. O sistema utilizará esses limites para construir apenas alternativas viáveis e respeitosas com a sua realidade.
          </Callout>
        </div>
      </div>

      {/* Sub-Stage Navigation Bar */}
      <div className="flex border border-[var(--border-default)] bg-[var(--branco)] p-1.5 max-w-3xl mx-auto">
        <button
          type="button"
          onClick={() => setActiveSubStage('fixed')}
          className={`flex-1 py-2.5 px-3 text-xs font-subtitle font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            activeSubStage === 'fixed'
              ? 'bg-[var(--preto)] text-white'
              : 'text-[var(--cinza-escuro)] hover:text-[var(--preto)] hover:bg-[var(--cinza-claro)]'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          1. Compromissos Assumidos ({fixedItems.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubStage('desired')}
          className={`flex-1 py-2.5 px-3 text-xs font-subtitle font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            activeSubStage === 'desired'
              ? 'bg-[var(--preto)] text-white'
              : 'text-[var(--cinza-escuro)] hover:text-[var(--preto)] hover:bg-[var(--cinza-claro)]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
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
          className={`flex-1 py-2.5 px-3 text-xs font-subtitle font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            activeSubStage === 'review'
              ? 'bg-[var(--preto)] text-white'
              : 'text-[var(--cinza-escuro)] hover:text-[var(--preto)] hover:bg-[var(--cinza-claro)]'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          3. Revisão Integrada
        </button>
      </div>

      {/* SUB-STAGE 1: COMPROMISSOS INEGOCIÁVEIS (FIXAS) */}
      {activeSubStage === 'fixed' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (7 cols) */}
          <div className="lg:col-span-7 bg-[var(--branco)] border border-[var(--border-default)] p-6 space-y-6">
            <div className="space-y-1 border-b border-[var(--border-default)] pb-3">
              <Tag tone="evidencia">Condições Inegociáveis</Tag>
              <h3 className="font-display font-bold text-lg text-[var(--preto)] flex items-center gap-2 pt-1">
                <Lock className="w-5 h-5 text-[var(--exodo-red)]" />
                Existe alguma condição que você já prometeu e não pode deixar de cumprir, seja qual for o caminho escolhido?
              </h3>
              <p className="text-xs font-body text-[var(--cinza-escuro)]">
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
                  className="w-full text-xs font-body p-3.5 border border-[var(--border-strong)] focus:outline-none focus:border-[var(--exodo-red)] transition-colors resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-subtitle font-bold uppercase tracking-wider text-[var(--cinza-escuro)]">
                  Observações ou contexto adicional (opcional)
                </label>
                <input
                  type="text"
                  value={detailsInput}
                  onChange={(e) => setDetailsInput(e.target.value)}
                  placeholder="Ex: Multa rescisória de 50% em caso de saída antecipada..."
                  className="w-full text-xs font-body p-3 border border-[var(--border-strong)] focus:outline-none focus:border-[var(--exodo-red)]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs font-subtitle text-[var(--cinza-medio)] hover:text-[var(--preto)] underline cursor-pointer"
                  >
                    Cancelar edição
                  </button>
                )}
                <Button variant="primary" type="button" onClick={() => handleAddItem('Fixa')} className="ml-auto flex items-center gap-2">
                  {editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {editingId ? 'Atualizar Compromisso' : 'Adicionar como Compromisso Inegociável'}
                </Button>
              </div>
            </div>

            {/* Suggestions Box */}
            <div className="pt-4 border-t border-[var(--border-default)] space-y-3">
              <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wider text-[var(--cinza-medio)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--exodo-red)]" />
                Exemplos de Compromissos Inegociáveis
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FIXED_SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDescriptionInput(sug)}
                    className="text-[0.7rem] font-body text-[var(--cinza-escuro)] bg-[var(--cinza-claro)] hover:bg-[var(--accent-tint)] border border-[var(--border-default)] hover:border-[var(--exodo-red)] p-2.5 text-left transition-colors cursor-pointer"
                  >
                    "{sug}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List Box Side Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[var(--branco)] border border-[var(--border-default)] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
                <h4 className="font-display font-bold text-sm text-[var(--preto)] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[var(--exodo-red)]" />
                  Compromissos Cadastrados ({fixedItems.length})
                </h4>
              </div>

              {fixedItems.length === 0 ? (
                <div className="p-8 text-center bg-[var(--cinza-claro)] border border-dashed border-[var(--border-strong)] space-y-2">
                  <Shield className="w-8 h-8 text-[var(--cinza-medio)] mx-auto" />
                  <p className="text-xs font-subtitle font-bold text-[var(--cinza-escuro)]">
                    Nenhum compromisso inegociável adicionado
                  </p>
                  <p className="text-[0.7rem] font-body text-[var(--cinza-medio)]">
                    Se você possui condições obrigatórias que não podem mudar, registre-as ao lado.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {fixedItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-[var(--accent-tint)] border border-[var(--exodo-red)] p-3.5 space-y-2 relative group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[0.6rem] font-subtitle font-bold px-2 py-0.5 bg-[var(--exodo-red)] text-white">
                          Compromisso Assumido (Inegociável)
                        </span>
                      </div>

                      <h5 className="font-display font-bold text-xs text-[var(--preto)] leading-snug">
                        #{index + 1}. {item.description}
                      </h5>

                      {item.details && (
                        <p className="text-[0.7rem] font-body text-[var(--cinza-escuro)] italic">
                          Nota: {item.details}
                        </p>
                      )}

                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-[var(--exodo-red)]/30">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="p-1 text-[var(--cinza-medio)] hover:text-[var(--preto)] transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1 text-[var(--cinza-medio)] hover:text-[var(--exodo-red)] transition-colors cursor-pointer"
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
                  variant="primary"
                  onClick={() => {
                    resetForm();
                    setActiveSubStage('desired');
                  }}
                  className="w-full justify-center"
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
          <div className="lg:col-span-7 bg-[var(--branco)] border border-[var(--border-default)] p-6 space-y-6">
            <div className="space-y-1 border-b border-[var(--border-default)] pb-3">
              <Tag tone="processo">Preferências Ajustáveis</Tag>
              <h3 className="font-display font-bold text-lg text-[var(--preto)] flex items-center gap-2 pt-1">
                <Sliders className="w-5 h-5 text-[var(--exodo-red)]" />
                Existe algo que você gostaria de manter, mas que toparia ajustar se precisasse?
              </h3>
              <p className="text-xs font-body text-[var(--cinza-escuro)]">
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
                  className="w-full text-xs font-body p-3.5 border border-[var(--border-strong)] focus:outline-none focus:border-[var(--exodo-red)] transition-colors resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-subtitle font-bold uppercase tracking-wider text-[var(--cinza-escuro)]">
                  Condição para flexibilizar (opcional)
                </label>
                <input
                  type="text"
                  value={detailsInput}
                  onChange={(e) => setDetailsInput(e.target.value)}
                  placeholder="Ex: Desde que o faturamento da clínica não diminua..."
                  className="w-full text-xs font-body p-3 border border-[var(--border-strong)] focus:outline-none focus:border-[var(--exodo-red)]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs font-subtitle text-[var(--cinza-medio)] hover:text-[var(--preto)] underline cursor-pointer"
                  >
                    Cancelar edição
                  </button>
                )}
                <Button variant="primary" type="button" onClick={() => handleAddItem('Desejada')} className="ml-auto flex items-center gap-2">
                  {editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {editingId ? 'Atualizar Preferência' : 'Adicionar como Preferência Ajustável'}
                </Button>
              </div>
            </div>

            {/* Suggestions Box */}
            <div className="pt-4 border-t border-[var(--border-default)] space-y-3">
              <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wider text-[var(--cinza-medio)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--exodo-red)]" />
                Exemplos de Preferências Ajustáveis
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DESIRED_SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDescriptionInput(sug)}
                    className="text-[0.7rem] font-body text-[var(--cinza-escuro)] bg-[var(--cinza-claro)] hover:bg-[var(--accent-tint)] border border-[var(--border-default)] hover:border-[var(--exodo-red)] p-2.5 text-left transition-colors cursor-pointer"
                  >
                    "{sug}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List Box Side Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[var(--branco)] border border-[var(--border-default)] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
                <h4 className="font-display font-bold text-sm text-[var(--preto)] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[var(--exodo-red)]" />
                  Preferências Cadastradas ({desiredItems.length})
                </h4>
              </div>

              {desiredItems.length === 0 ? (
                <div className="p-8 text-center bg-[var(--cinza-claro)] border border-dashed border-[var(--border-strong)] space-y-2">
                  <Sliders className="w-8 h-8 text-[var(--cinza-medio)] mx-auto" />
                  <p className="text-xs font-subtitle font-bold text-[var(--cinza-escuro)]">
                    Nenhuma preferência ajustável adicionada
                  </p>
                  <p className="text-[0.7rem] font-body text-[var(--cinza-medio)]">
                    Se existem aspectos que você gostaria de manter, mas aceita adaptar se necessário, adicione-os ao lado.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {desiredItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-[var(--cinza-claro)] border border-[var(--border-default)] p-3.5 space-y-2 relative group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[0.6rem] font-subtitle font-bold px-2 py-0.5 bg-[var(--preto)] text-white">
                          Preferência Ajustável (Flexível)
                        </span>
                      </div>

                      <h5 className="font-display font-bold text-xs text-[var(--preto)] leading-snug">
                        #{index + 1}. {item.description}
                      </h5>

                      {item.details && (
                        <p className="text-[0.7rem] font-body text-[var(--cinza-escuro)] italic">
                          Condição: {item.details}
                        </p>
                      )}

                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-[var(--border-default)]">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="p-1 text-[var(--cinza-medio)] hover:text-[var(--preto)] transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1 text-[var(--cinza-medio)] hover:text-[var(--exodo-red)] transition-colors cursor-pointer"
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
                  variant="primary"
                  onClick={() => {
                    if (items.length === 0) {
                      onToast('Registre pelo menos uma condição antes de avançar.');
                      return;
                    }
                    setActiveSubStage('review');
                  }}
                  className="w-full justify-center"
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
          <div className="bg-[var(--branco)] border-2 border-[var(--border-strong)] p-6 sm:p-8 space-y-6">
            <div className="space-y-2 border-b border-[var(--border-default)] pb-4">
              <div className="flex items-center gap-2 text-xs font-subtitle font-bold uppercase tracking-wider text-[var(--exodo-red)]">
                <HeartHandshake className="w-4 h-4" />
                Revisão da Classificação
              </div>
              <h3 className="text-xl font-display font-bold text-[var(--preto)]">
                "Aqui está o que você me disse: isto aqui já é um compromisso assumido, e isto aqui é algo que você gostaria, mas pode abrir mão se precisar. Confere?"
              </h3>
              <p className="text-xs font-body text-[var(--cinza-escuro)]">
                Confira a divisão das suas condições operacionais abaixo. Se quiser alternar o papel de algum item entre "Compromisso Assumido" e "Preferência Ajustável", clique no botão de alternar.
              </p>
            </div>

            {/* Split View of Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1: Compromissos Assumidos */}
              <div className="bg-[var(--accent-tint)] border border-[var(--exodo-red)] p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--exodo-red)]/30 pb-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[var(--exodo-red)]" />
                    <h4 className="font-display font-bold text-sm text-[var(--preto)]">
                      Compromissos Assumidos ({fixedItems.length})
                    </h4>
                  </div>
                  <span className="text-[0.65rem] font-subtitle font-bold bg-[var(--exodo-red)] text-white px-2 py-0.5">
                    Obrigatório
                  </span>
                </div>

                {fixedItems.length === 0 ? (
                  <p className="text-xs font-body text-[var(--cinza-medio)] italic py-2">
                    Nenhum compromisso inegociável registrado.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {fixedItems.map((item, idx) => (
                      <div key={item.id} className="bg-[var(--branco)] border border-[var(--exodo-red)]/40 p-3 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-display font-bold text-xs text-[var(--preto)]">
                            #{idx + 1}. {item.description}
                          </span>
                        </div>
                        {item.details && (
                          <p className="text-[0.7rem] font-body text-[var(--cinza-escuro)] italic">
                            {item.details}
                          </p>
                        )}
                        <div className="pt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleToggleType(item.id)}
                            className="text-[0.65rem] font-subtitle font-bold text-[var(--cinza-medio)] hover:text-[var(--preto)] underline cursor-pointer"
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
              <div className="bg-[var(--cinza-claro)] border border-[var(--border-default)] p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-2">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[var(--preto)]" />
                    <h4 className="font-display font-bold text-sm text-[var(--preto)]">
                      Preferências Ajustáveis ({desiredItems.length})
                    </h4>
                  </div>
                  <span className="text-[0.65rem] font-subtitle font-bold bg-[var(--preto)] text-white px-2 py-0.5">
                    Flexível
                  </span>
                </div>

                {desiredItems.length === 0 ? (
                  <p className="text-xs font-body text-[var(--cinza-medio)] italic py-2">
                    Nenhuma preferência ajustável registrada.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {desiredItems.map((item, idx) => (
                      <div key={item.id} className="bg-[var(--branco)] border border-[var(--border-default)] p-3 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-display font-bold text-xs text-[var(--preto)]">
                            #{idx + 1}. {item.description}
                          </span>
                        </div>
                        {item.details && (
                          <p className="text-[0.7rem] font-body text-[var(--cinza-escuro)] italic">
                            {item.details}
                          </p>
                        )}
                        <div className="pt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleToggleType(item.id)}
                            className="text-[0.65rem] font-subtitle font-bold text-[var(--cinza-medio)] hover:text-[var(--exodo-red)] underline cursor-pointer"
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
          <div className="bg-[var(--cinza-claro)] border-2 border-[var(--preto)] p-6 sm:p-8 space-y-6">
            <div className="space-y-2 text-center max-w-xl mx-auto">
              <div className="w-12 h-12 bg-[var(--preto)] text-white flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-[var(--preto)]">
                Aprovar Limites e Condições Operacionais
              </h3>
              <p className="text-xs font-body text-[var(--cinza-escuro)] leading-relaxed">
                Ao confirmar, o sistema utilizará estas regras para delimitar e construir diferentes alternativas viáveis de organização estratégica para a sua clínica.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handleSaveAndComplete(false)}
                className="w-full sm:w-auto px-5 py-3 text-xs font-subtitle font-bold text-[var(--cinza-escuro)] bg-[var(--branco)] border border-[var(--border-strong)] hover:bg-[var(--cinza-claro)] transition-colors cursor-pointer"
              >
                Salvar Rascunho
              </button>

              <Button variant="primary" size="lg" onClick={() => handleSaveAndComplete(true)} className="w-full sm:w-auto">
                Aprovar Condições e Concluir <CheckCircle2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
