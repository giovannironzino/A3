import React, { useState } from 'react';
import {
  Target,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Sparkles,
  Compass,
  ListOrdered,
  Check,
  ChevronRight,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Button, Tag, CornerAccent } from './UIPrimitives';
import {
  A3Expectation,
  A3ExpectationsData,
  ExpectationCategory,
  ExpectationPriority
} from '../types';

interface ExpectationsStepProps {
  initialData?: A3ExpectationsData | null;
  remainingWeeklyHours?: number; // Z hours calculated from Bloco A
  onSaveData: (data: A3ExpectationsData) => void;
  onCompleteStep: () => void;
  onToast: (msg: string) => void;
}

const CATEGORIES: { label: ExpectationCategory; description: string }[] = [
  { label: 'Rotina & Tempo', description: 'Carga horária, dias de atendimento, horários livres' },
  { label: 'Faturamento & Valor', description: 'Meta de receita, preço percebido, ticket médio' },
  { label: 'Qualidade de Vida', description: 'Nível de estresse, tempo para estudo/família, descanso' },
  { label: 'Perfil de Pacientes', description: 'Nicho ideal, engajamento, alinhamento dos clientes' },
  { label: 'Modelo de Atendimento', description: 'Formato de entrega, experiência do paciente, acompanhamento' },
  { label: 'Outros', description: 'Outros objetivos e desejos da operação' },
];

const PRIORITY_CLASS: Record<ExpectationPriority, string> = {
  Alta: 'bg-[var(--exodo-red)] text-white border border-[var(--exodo-red)]',
  Média: 'bg-[var(--accent-tint)] text-[var(--exodo-red)] border border-[var(--exodo-red)]',
  Baixa: 'bg-[var(--cinza-claro)] text-[var(--cinza-escuro)] border border-[var(--border-default)]',
};

const PROMPT_SUGGESTIONS = [
  "Atender no máximo 4 dias por semana e ter sextas-feiras livres para planejamento e estudos.",
  "Ter um faturamento previsível de R$ 25.000/mês sem precisar trabalhar à noite.",
  "Reduzir o tempo gasto com suporte de dúvidas fora das consultas.",
  "Aumentar o ticket médio focando em programas de acompanhamento contínuo.",
  "Ter apenas pacientes altamente engajados e alinhados com minha metodologia.",
  "Eliminar a necessidade de elaborar planos alimentares de madrugada.",
];

export const ExpectationsStep: React.FC<ExpectationsStepProps> = ({
  initialData,
  remainingWeeklyHours = 0,
  onSaveData,
  onCompleteStep,
  onToast,
}) => {
  const [timeCheckAnswer, setTimeCheckAnswer] = useState<string>('Suficiente para minha rotina ideal');
  const [timePriorityAnswer, setTimePriorityAnswer] = useState<string>('Captação de Novos Pacientes');
  const [revenueGoalInput, setRevenueGoalInput] = useState<string>('');
  const [expectations, setExpectations] = useState<A3Expectation[]>(() => {
    return initialData?.expectations || [];
  });

  // Current wizard step inside Expectativas component:
  // 'input' -> adding or editing an expectation
  // 'prioritize' -> ordering expectations
  // 'review' -> final review and approval
  const [activeSubStage, setActiveSubStage] = useState<'input' | 'prioritize' | 'review'>('input');

  // Input Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [desiredResultInput, setDesiredResultInput] = useState<string>('');
  const [meaningDetailsInput, setMeaningDetailsInput] = useState<string>('');
  const [categoryInput, setCategoryInput] = useState<ExpectationCategory>('Rotina & Tempo');
  const [priorityInput, setPriorityInput] = useState<ExpectationPriority>('Alta');

  const resetForm = () => {
    setEditingId(null);
    setDesiredResultInput('');
    setMeaningDetailsInput('');
    setCategoryInput('Rotina & Tempo');
    setPriorityInput('Alta');
  };

  const handleStartEdit = (item: A3Expectation) => {
    setEditingId(item.id);
    setDesiredResultInput(item.desiredResult);
    setMeaningDetailsInput(item.meaningDetails || '');
    setCategoryInput(item.category);
    setPriorityInput(item.priority);
    setActiveSubStage('input');
  };

  const handleAddOrUpdateExpectation = (e: React.FormEvent) => {
    e.preventDefault();

    if (!desiredResultInput.trim()) {
      onToast('Por favor, descreva a mudança ou resultado desejado.');
      return;
    }

    if (editingId) {
      // Update existing
      setExpectations((prev) =>
        prev.map((exp) =>
          exp.id === editingId
            ? {
                ...exp,
                desiredResult: desiredResultInput.trim(),
                meaningDetails: meaningDetailsInput.trim(),
                category: categoryInput,
                priority: priorityInput,
              }
            : exp
        )
      );
      onToast('Expectativa atualizada com sucesso!');
    } else {
      // Add new
      const newExp: A3Expectation = {
        id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        desiredResult: desiredResultInput.trim(),
        meaningDetails: meaningDetailsInput.trim(),
        category: categoryInput,
        priority: priorityInput,
        order: expectations.length + 1,
        createdAt: new Date().toISOString(),
      };

      setExpectations((prev) => [...prev, newExp]);
      onToast('Expectativa registrada com sucesso!');
    }

    resetForm();
  };

  const handleDeleteExpectation = (id: string) => {
    setExpectations((prev) => {
      const filtered = prev.filter((exp) => exp.id !== id);
      return filtered.map((exp, idx) => ({ ...exp, order: idx + 1 }));
    });
    onToast('Expectativa removida.');
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === expectations.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newArr = [...expectations];
    const temp = newArr[index];
    newArr[index] = newArr[targetIndex];
    newArr[targetIndex] = temp;

    // Update order sequence
    const updated = newArr.map((item, idx) => ({ ...item, order: idx + 1 }));
    setExpectations(updated);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setDesiredResultInput(suggestion);
  };

  const handleSaveAndAdvance = (isCompleted: boolean = false) => {
    if (expectations.length === 0) {
      onToast('Registre pelo menos uma expectativa antes de avançar.');
      return;
    }

    const payload: A3ExpectationsData = {
      expectations,
      isCompleted,
      updatedAt: new Date().toISOString(),
    };

    onSaveData(payload);

    if (isCompleted) {
      onToast('Expectativas validadas e consolidadas com sucesso!');
      onCompleteStep();
    } else {
      onToast('Progresso das Expectativas salvo.');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[var(--branco)] border border-[var(--border-strong)] p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 pointer-events-none">
          <CornerAccent variant="arredondado" size={100} />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-default)] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[var(--preto)] text-white">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-subtitle font-bold uppercase tracking-widest text-[var(--cinza-medio)]">
                  Entrega 02 • Diagnóstico e Visão de Futuro
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-[var(--preto)]">
                  Expectativas da Clínica
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tag tone="informacao" className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                {expectations.length} {expectations.length === 1 ? 'Expectativa' : 'Expectativas'}
              </Tag>
            </div>
          </div>

          {/* Core Mindset Note */}
          <div className="bg-[var(--cinza-claro)] p-4 text-xs font-body text-[var(--cinza-escuro)] space-y-2">
            <div className="flex items-center gap-2 font-subtitle font-bold uppercase text-[0.75rem] tracking-wider text-[var(--exodo-red)]">
              <Sparkles className="w-4 h-4" />
              Ancoragem nas {remainingWeeklyHours} horas/semana do Modelo Atual
            </div>
            <p className="leading-relaxed">
              Nas etapas anteriores, calculamos que sobram <strong className="text-[var(--preto)]">{remainingWeeklyHours} horas por semana</strong> fora do atendimento dos seus pacientes atuais. As perguntas abaixo alinham suas expectativas diretamente a esse número real.
            </p>
          </div>

          {/* Anchored Questions Section */}
          <div className="bg-[var(--branco)] border-2 border-[var(--preto)] p-5 space-y-5">
            {/* Question 1: Time Availability Check */}
            <div className="space-y-2">
              <label className="font-subtitle text-xs font-bold uppercase text-[var(--preto)] block">
                1. Checagem de Tempo Livre: Com as {remainingWeeklyHours}h/semana restantes no seu modelo atual, esse tempo é:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  'Mais do que o necessário / Sobrando',
                  'Suficiente para minha rotina ideal',
                  'Menos do que preciso (quero mais tempo)'
                ].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setTimeCheckAnswer(opt)}
                    className={`p-3 text-left text-xs font-subtitle border-2 transition-colors cursor-pointer ${
                      timeCheckAnswer === opt
                        ? 'bg-[var(--preto)] text-white border-[var(--preto)] font-bold'
                        : 'bg-[var(--branco)] text-[var(--cinza-escuro)] border-[var(--border-default)] hover:border-[var(--cinza-medio)]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Single Choice Priority */}
            <div className="space-y-2 pt-3 border-t border-[var(--border-default)]">
              <label className="font-subtitle text-xs font-bold uppercase text-[var(--preto)] block">
                2. Prioridade de Uso do Tempo Livre (Escolha Única)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { label: 'Captação de Novos Pacientes', desc: 'Atrair e converter mais pacientes para aumentar faturamento.' },
                  { label: 'Qualidade de Vida & Estudo', desc: 'Aumentar tempo livre, descansar, praticar esportes e estudar.' },
                  { label: 'Programas de Acompanhamento', desc: 'Estruturar entregas de maior valor e planos recorrentes.' },
                  { label: 'Gestão & Eficiência Interna', desc: 'Organizar finanças, equipe e processos da clínica.' }
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setTimePriorityAnswer(item.label)}
                    className={`p-3 text-left border-2 transition-colors cursor-pointer ${
                      timePriorityAnswer === item.label
                        ? 'bg-[var(--preto)] text-white border-[var(--preto)] font-bold'
                        : 'bg-[var(--branco)] text-[var(--cinza-escuro)] border-[var(--border-default)] hover:border-[var(--cinza-medio)]'
                    }`}
                  >
                    <span className="font-subtitle text-xs block font-bold">{item.label}</span>
                    <span className={`text-[0.7rem] font-body block mt-0.5 ${timePriorityAnswer === item.label ? 'text-neutral-300' : 'text-[var(--cinza-medio)]'}`}>
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Question 3: Financial Expectation */}
            <div className="space-y-2 pt-3 border-t border-[var(--border-default)]">
              <label className="font-subtitle text-xs font-bold uppercase text-[var(--preto)] block">
                3. Expectativa Financeira: Meta de Faturamento Mensal Desejado
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-display font-bold text-[var(--cinza-medio)] text-sm">R$</span>
                <input
                  type="text"
                  placeholder="Ex: 25.000 / mês"
                  value={revenueGoalInput}
                  onChange={(e) => setRevenueGoalInput(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border-2 border-[var(--border-strong)] text-sm font-subtitle font-bold outline-none focus:border-[var(--exodo-red)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Internal Sub-Stage Navigation */}
      <div className="flex border border-[var(--border-default)] bg-[var(--branco)] p-1.5 max-w-2xl mx-auto">
        <button
          type="button"
          onClick={() => setActiveSubStage('input')}
          className={`flex-1 py-2 px-3 text-xs font-subtitle font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            activeSubStage === 'input'
              ? 'bg-[var(--preto)] text-white'
              : 'text-[var(--cinza-escuro)] hover:text-[var(--preto)] hover:bg-[var(--cinza-claro)]'
          }`}
        >
          <Plus className="w-3.5 h-3.5" /> 1. Cadastrar Expectativas
        </button>

        <button
          type="button"
          onClick={() => {
            if (expectations.length === 0) {
              onToast('Cadastre pelo menos uma expectativa primeiro.');
              return;
            }
            setActiveSubStage('prioritize');
          }}
          className={`flex-1 py-2 px-3 text-xs font-subtitle font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            activeSubStage === 'prioritize'
              ? 'bg-[var(--preto)] text-white'
              : 'text-[var(--cinza-escuro)] hover:text-[var(--preto)] hover:bg-[var(--cinza-claro)]'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" /> 2. Priorização ({expectations.length})
        </button>

        <button
          type="button"
          onClick={() => {
            if (expectations.length === 0) {
              onToast('Cadastre pelo menos uma expectativa primeiro.');
              return;
            }
            setActiveSubStage('review');
          }}
          className={`flex-1 py-2 px-3 text-xs font-subtitle font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            activeSubStage === 'review'
              ? 'bg-[var(--preto)] text-white'
              : 'text-[var(--cinza-escuro)] hover:text-[var(--preto)] hover:bg-[var(--cinza-claro)]'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> 3. Revisão Geral
        </button>
      </div>

      {/* SUB-STAGE 1: INPUT FORM & SUGGESTIONS */}
      {activeSubStage === 'input' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form Box (7 cols) */}
          <div className="lg:col-span-7 bg-[var(--branco)] border border-[var(--border-default)] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
              <h3 className="font-display font-bold text-lg text-[var(--preto)] flex items-center gap-2">
                <Target className="w-5 h-5 text-[var(--exodo-red)]" />
                {editingId ? 'Editar Expectativa' : 'Registrar Nova Expectativa'}
              </h3>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs font-subtitle text-[var(--cinza-medio)] hover:text-[var(--preto)] underline cursor-pointer"
                >
                  Cancelar edição
                </button>
              )}
            </div>

            <form onSubmit={handleAddOrUpdateExpectation} className="space-y-5">
              {/* Question 1: O que você gostaria que fosse diferente? */}
              <div className="space-y-2">
                <label className="block text-xs font-subtitle font-bold uppercase tracking-wider text-[var(--preto)]">
                  Pensando na sua clínica ideal, o que você gostaria que fosse diferente em relação ao que acontece hoje? *
                </label>
                <textarea
                  value={desiredResultInput}
                  onChange={(e) => setDesiredResultInput(e.target.value)}
                  placeholder="Ex: Gostaria de atender no máximo 3 dias por semana mantendo meu faturamento atual..."
                  rows={3}
                  className="w-full text-xs font-body p-3.5 border border-[var(--border-strong)] focus:outline-none focus:border-[var(--exodo-red)] transition-colors resize-none"
                />
                <p className="text-[0.7rem] font-body text-[var(--cinza-medio)] italic">
                  💡 Dica: Descreva um <strong>resultado ou estado desejado</strong>, e não uma tarefa ou solução técnica.
                </p>
              </div>

              {/* Question 2: Detalhamento do significado */}
              <div className="space-y-2">
                <label className="block text-xs font-subtitle font-bold uppercase tracking-wider text-[var(--cinza-escuro)]">
                  Vamos detalhar essa expectativa: o que exatamente ela significa para você?
                </label>
                <textarea
                  value={meaningDetailsInput}
                  onChange={(e) => setMeaningDetailsInput(e.target.value)}
                  placeholder="Ex: Significa ter tempo livre para estudos, família e não me sentir sobrecarregado ao final do dia..."
                  rows={2}
                  className="w-full text-xs font-body p-3.5 border border-[var(--border-strong)] focus:outline-none focus:border-[var(--exodo-red)] transition-colors resize-none"
                />
              </div>

              {/* Category & Priority Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-subtitle font-bold uppercase tracking-wider text-[var(--cinza-escuro)]">
                    Categoria do Objetivo
                  </label>
                  <select
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value as ExpectationCategory)}
                    className="w-full text-xs font-body p-3 border border-[var(--border-strong)] focus:outline-none focus:border-[var(--exodo-red)] bg-[var(--branco)] cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.label} value={cat.label}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Initial Priority */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-subtitle font-bold uppercase tracking-wider text-[var(--cinza-escuro)]">
                    Prioridade Inicial
                  </label>
                  <select
                    value={priorityInput}
                    onChange={(e) => setPriorityInput(e.target.value as ExpectationPriority)}
                    className="w-full text-xs font-body p-3 border border-[var(--border-strong)] focus:outline-none focus:border-[var(--exodo-red)] bg-[var(--branco)] cursor-pointer"
                  >
                    <option value="Alta">Alta - Indispensável</option>
                    <option value="Média">Média - Desejável</option>
                    <option value="Baixa">Baixa - Secundária</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <Button variant="primary" type="submit" className="flex items-center gap-2">
                  {editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {editingId ? 'Salvar Alterações' : 'Adicionar Expectativa'}
                </Button>
              </div>
            </form>

            {/* Inspiration Suggestions */}
            <div className="pt-4 border-t border-[var(--border-default)] space-y-3">
              <span className="text-[0.65rem] font-subtitle font-bold uppercase tracking-wider text-[var(--cinza-medio)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--exodo-red)]" />
                Sugestões de Inspiração (Clique para preencher)
              </span>
              <div className="flex flex-wrap gap-2">
                {PROMPT_SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(sug)}
                    className="text-[0.7rem] font-body text-[var(--cinza-escuro)] bg-[var(--cinza-claro)] hover:bg-[var(--accent-tint)] border border-[var(--border-default)] hover:border-[var(--exodo-red)] p-2 text-left transition-colors cursor-pointer"
                  >
                    "{sug}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List of Registered Expectations Side Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[var(--branco)] border border-[var(--border-default)] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
                <h4 className="font-display font-bold text-sm text-[var(--preto)] flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-[var(--exodo-red)]" />
                  Expectativas Registradas ({expectations.length})
                </h4>
                {expectations.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveSubStage('prioritize')}
                    className="text-xs font-subtitle font-bold text-[var(--exodo-red)] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Priorizar <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {expectations.length === 0 ? (
                <div className="p-8 text-center bg-[var(--cinza-claro)] border border-dashed border-[var(--border-strong)] space-y-2">
                  <Compass className="w-8 h-8 text-[var(--cinza-medio)] mx-auto" />
                  <p className="text-xs font-subtitle font-bold text-[var(--cinza-escuro)]">Nenhuma expectativa registrada ainda</p>
                  <p className="text-[0.7rem] font-body text-[var(--cinza-medio)]">
                    Preencha o formulário ao lado para adicionar a primeira mudança desejada para a sua clínica.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {expectations.map((exp, index) => (
                    <div
                      key={exp.id}
                      className="bg-[var(--cinza-claro)] p-3.5 space-y-2 relative group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[0.6rem] font-subtitle font-bold px-2 py-0.5 bg-[var(--branco)] text-[var(--cinza-escuro)] border border-[var(--border-default)]">
                          {exp.category}
                        </span>
                        <span className={`text-[0.6rem] font-subtitle font-bold px-2 py-0.5 ${PRIORITY_CLASS[exp.priority]}`}>
                          Prioridade {exp.priority}
                        </span>
                      </div>

                      <h5 className="font-display font-bold text-xs text-[var(--preto)] leading-snug">
                        #{index + 1}. {exp.desiredResult}
                      </h5>

                      {exp.meaningDetails && (
                        <p className="text-[0.7rem] font-body text-[var(--cinza-escuro)] italic line-clamp-2">
                          "{exp.meaningDetails}"
                        </p>
                      )}

                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-[var(--border-default)]">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(exp)}
                          className="p-1 text-[var(--cinza-medio)] hover:text-[var(--exodo-red)] transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExpectation(exp.id)}
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

              {expectations.length > 0 && (
                <div className="pt-2">
                  <Button variant="primary" onClick={() => setActiveSubStage('prioritize')} className="w-full justify-center">
                    Avançar para Priorização <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-STAGE 2: PRIORITIZATION */}
      {activeSubStage === 'prioritize' && (
        <div className="bg-[var(--branco)] border border-[var(--border-default)] p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
          <div className="space-y-2 border-b border-[var(--border-default)] pb-4">
            <div className="flex items-center gap-2 text-xs font-subtitle font-bold uppercase tracking-wider text-[var(--exodo-red)]">
              <ListOrdered className="w-4 h-4" />
              Etapa 04 • Definição de Relevância
            </div>
            <h3 className="text-xl font-display font-bold text-[var(--preto)]">
              Entre todas as expectativas registradas, quais são as mais importantes para você?
            </h3>
            <p className="text-xs font-body text-[var(--cinza-escuro)]">
              Reordene a lista abaixo conforme o grau de importância para o futuro da sua clínica. O objetivo é estabelecer a hierarquia dos seus desejos.
            </p>
          </div>

          <div className="space-y-3">
            {expectations.map((exp, index) => (
              <div
                key={exp.id}
                className="bg-[var(--cinza-claro)] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-8 h-8 bg-[var(--preto)] text-white flex items-center justify-center font-display font-bold text-xs shrink-0">
                    #{index + 1}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[0.65rem] font-subtitle font-bold px-2 py-0.5 bg-[var(--branco)] border border-[var(--border-default)] text-[var(--cinza-escuro)]">
                        {exp.category}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-sm text-[var(--preto)]">
                      {exp.desiredResult}
                    </h4>
                    {exp.meaningDetails && (
                      <p className="text-[0.7rem] font-body text-[var(--cinza-escuro)] italic">
                        "{exp.meaningDetails}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Priority Selector & Up/Down Actions */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[var(--border-default)]">
                  <select
                    value={exp.priority}
                    onChange={(e) => {
                      const newP = e.target.value as ExpectationPriority;
                      setExpectations((prev) =>
                        prev.map((item) => (item.id === exp.id ? { ...item, priority: newP } : item))
                      );
                    }}
                    className="text-xs font-subtitle font-bold p-2 border border-[var(--border-strong)] bg-[var(--branco)]"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Média">Média</option>
                    <option value="Baixa">Baixa</option>
                  </select>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveOrder(index, 'up')}
                      className="p-1.5 border border-[var(--border-default)] hover:bg-[var(--branco)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Mover para cima"
                    >
                      <ArrowUp className="w-4 h-4 text-[var(--cinza-escuro)]" />
                    </button>
                    <button
                      type="button"
                      disabled={index === expectations.length - 1}
                      onClick={() => handleMoveOrder(index, 'down')}
                      className="p-1.5 border border-[var(--border-default)] hover:bg-[var(--branco)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Mover para baixo"
                    >
                      <ArrowDown className="w-4 h-4 text-[var(--cinza-escuro)]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border-default)]">
            <button
              type="button"
              onClick={() => setActiveSubStage('input')}
              className="text-xs font-subtitle font-bold text-[var(--cinza-escuro)] hover:text-[var(--preto)] underline cursor-pointer"
            >
              + Adicionar mais expectativas
            </button>

            <Button variant="primary" onClick={() => setActiveSubStage('review')} className="flex items-center gap-2">
              Avançar para Revisão Final <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* SUB-STAGE 3: REVIEW & FINAL APPROVAL */}
      {activeSubStage === 'review' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="bg-[var(--branco)] border border-[var(--border-default)] p-6 sm:p-8 space-y-6">
            <div className="space-y-2 border-b border-[var(--border-default)] pb-4">
              <div className="flex items-center gap-2 text-xs font-subtitle font-bold uppercase tracking-wider text-[var(--exodo-red)]">
                <CheckCircle2 className="w-4 h-4" />
                Etapa 05 • Revisão Integrada
              </div>
              <h3 className="text-xl font-display font-bold text-[var(--preto)]">
                Essas expectativas representam corretamente o futuro que você deseja construir?
              </h3>
              <p className="text-xs font-body text-[var(--cinza-escuro)]">
                Confira a lista final priorizada. Ao aprovar, estas expectativas servirão de bússola para a construção das restrições e alternativas de configuração da sua clínica.
              </p>
            </div>

            {/* List of Final Expectations */}
            <div className="space-y-3">
              {expectations.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="bg-[var(--cinza-claro)] p-4 flex items-start gap-4"
                >
                  <div className="w-7 h-7 bg-[var(--preto)] text-white flex items-center justify-center font-display font-bold text-xs shrink-0">
                    {idx + 1}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[0.65rem] font-subtitle font-bold px-2 py-0.5 bg-[var(--branco)] border border-[var(--border-default)] text-[var(--cinza-escuro)]">
                        {exp.category}
                      </span>
                      <span className={`text-[0.65rem] font-subtitle font-bold px-2 py-0.5 ${PRIORITY_CLASS[exp.priority]}`}>
                        Prioridade {exp.priority}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-sm text-[var(--preto)]">
                      {exp.desiredResult}
                    </h4>

                    {exp.meaningDetails && (
                      <p className="text-[0.7rem] font-body text-[var(--cinza-escuro)] italic">
                        "{exp.meaningDetails}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final Action Box */}
          <div className="bg-[var(--cinza-claro)] border-2 border-[var(--preto)] p-6 sm:p-8 space-y-6">
            <div className="space-y-2 text-center max-w-xl mx-auto">
              <div className="w-12 h-12 bg-[var(--preto)] text-white flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-[var(--preto)]">
                Confirmar Expectativas da Clínica
              </h3>
              <p className="text-xs font-body text-[var(--cinza-escuro)] leading-relaxed">
                Na próxima etapa, identificaremos as <strong>Restrições Operacionais</strong> (condições inegociáveis que devem ser respeitadas durante a construção das alternativas estratégicas).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handleSaveAndAdvance(false)}
                className="w-full sm:w-auto px-5 py-3 text-xs font-subtitle font-bold text-[var(--cinza-escuro)] bg-[var(--branco)] border border-[var(--border-strong)] hover:bg-[var(--cinza-claro)] transition-colors cursor-pointer"
              >
                Salvar Rascunho
              </button>

              <Button variant="primary" size="lg" onClick={() => handleSaveAndAdvance(true)} className="w-full sm:w-auto">
                Aprovar Expectativas e Avançar <CheckCircle2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
