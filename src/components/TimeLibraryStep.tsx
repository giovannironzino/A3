import React, { useState } from 'react';
import { 
  Clock, 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  HelpCircle, 
  Sparkles, 
  Info, 
  Layers, 
  Check, 
  Copy, 
  MessageCircle, 
  FileText, 
  UserCheck, 
  Stethoscope, 
  Activity,
  ChevronRight
} from 'lucide-react';
import { Button } from './UIPrimitives';
import { A3Activity, A3ActivityCategory, A3TimeLibraryData } from '../types';

interface TimeLibraryStepProps {
  initialLibrary?: A3TimeLibraryData | null;
  onSaveLibrary: (library: A3TimeLibraryData) => void;
  onCompleteStep: () => void;
  onToast: (msg: string) => void;
}

const CATEGORIES: A3ActivityCategory[] = [
  'Atendimento Clínico',
  'Elaboração & Planejamento',
  'Suporte & Comunicação',
  'Análise & Diagnóstico',
  'Gestão & Administração',
  'Outros',
];

const SUGGESTED_ACTIVITIES: Array<{
  name: string;
  category: A3ActivityCategory;
  defaultMinutes: number;
  description: string;
  icon: any;
}> = [
  {
    name: 'Consulta Inicial (Anamnese & Avaliação)',
    category: 'Atendimento Clínico',
    defaultMinutes: 60,
    description: 'Consulta presencial ou online para coleta de histórico, objetivos e bioimpedância.',
    icon: Stethoscope,
  },
  {
    name: 'Atendimento via WhatsApp / Resposta de Dúvidas',
    category: 'Suporte & Comunicação',
    defaultMinutes: 15,
    description: 'Suporte pontual e esclarecimento de dúvidas entre as consultas.',
    icon: MessageCircle,
  },
  {
    name: 'Elaboração de Plano Alimentar / Cardápio',
    category: 'Elaboração & Planejamento',
    defaultMinutes: 45,
    description: 'Cálculo de necessidades calóricas, prescrição e estruturação das refeições.',
    icon: FileText,
  },
  {
    name: 'Análise de Exames Laboratoriais',
    category: 'Análise & Diagnóstico',
    defaultMinutes: 20,
    description: 'Interpretação de hemograma, perfil lipídico e marcadores bioquímicos.',
    icon: Activity,
  },
  {
    name: 'Acompanhamento / Check-in Semanal',
    category: 'Suporte & Comunicação',
    defaultMinutes: 15,
    description: 'Avaliação de adesão, diário alimentar e ajustes de meio de ciclo.',
    icon: UserCheck,
  },
  {
    name: 'Prescrição de Suplementação & Manipulados',
    category: 'Elaboração & Planejamento',
    defaultMinutes: 15,
    description: 'Definição de fitoterápicos, vitaminas e manipulação individualizada.',
    icon: Layers,
  },
];

const DEFAULT_INITIAL_ACTIVITIES: A3Activity[] = [
  {
    id: 'act_1',
    name: 'Consulta Inicial (Anamnese & Avaliação)',
    category: 'Atendimento Clínico',
    defaultMinutes: 60,
    description: 'Consulta presencial ou online para coleta de histórico e avaliação.',
    isApproximateTime: true,
    isReusable: true,
  },
  {
    id: 'act_2',
    name: 'Atendimento via WhatsApp / Dúvidas',
    category: 'Suporte & Comunicação',
    defaultMinutes: 15,
    description: 'Suporte rápido e esclarecimentos durante a semana.',
    isApproximateTime: true,
    isReusable: true,
  },
  {
    id: 'act_3',
    name: 'Elaboração de Plano Alimentar',
    category: 'Elaboração & Planejamento',
    defaultMinutes: 45,
    description: 'Montagem e cálculo do cardápio individualizado.',
    isApproximateTime: true,
    isReusable: true,
  },
];

export const TimeLibraryStep: React.FC<TimeLibraryStepProps> = ({
  initialLibrary,
  onSaveLibrary,
  onCompleteStep,
  onToast,
}) => {
  // Wizard steps: 1: Abertura, 2: Identificação, 3: Classificação, 4: Tempo Padrão, 5: Reutilização, 6: Revisão da Atividade, 7: Próxima Atividade?, 8: Summary Final
  const [wizardStep, setWizardStep] = useState<number>(
    initialLibrary && initialLibrary.isCompleted ? 8 : 1
  );

  const [activities, setActivities] = useState<A3Activity[]>(() => {
    if (initialLibrary && initialLibrary.activities && initialLibrary.activities.length > 0) {
      return initialLibrary.activities;
    }
    return DEFAULT_INITIAL_ACTIVITIES;
  });

  // Current editing / constructing activity state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState<string>('');
  const [formCategory, setFormCategory] = useState<A3ActivityCategory>('Atendimento Clínico');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formMinutes, setFormMinutes] = useState<number>(30);
  const [formIsApproximate, setFormIsApproximate] = useState<boolean>(true);
  const [formIsReusable, setFormIsReusable] = useState<boolean>(true);

  // Helper to start creating a new activity
  const handleStartNewActivity = (preset?: typeof SUGGESTED_ACTIVITIES[0]) => {
    setEditingId(null);
    if (preset) {
      setFormName(preset.name);
      setFormCategory(preset.category);
      setFormDescription(preset.description);
      setFormMinutes(preset.defaultMinutes);
    } else {
      setFormName('');
      setFormCategory('Atendimento Clínico');
      setFormDescription('');
      setFormMinutes(30);
    }
    setFormIsApproximate(true);
    setFormIsReusable(true);
    setWizardStep(2); // Jump to identification
  };

  // Helper to start editing an existing activity
  const handleEditActivity = (act: A3Activity) => {
    setEditingId(act.id);
    setFormName(act.name);
    setFormCategory(act.category);
    setFormDescription(act.description);
    setFormMinutes(act.defaultMinutes);
    setFormIsApproximate(act.isApproximateTime);
    setFormIsReusable(act.isReusable);
    setWizardStep(3); // Jump to classification / details
  };

  // Save current activity into list
  const handleSaveCurrentActivity = () => {
    if (!formName.trim()) {
      onToast('Informe o nome da atividade.');
      return;
    }
    if (formMinutes <= 0) {
      onToast('O tempo padrão deve ser maior que zero minutos.');
      return;
    }

    // Check for duplicate name
    const existingIndex = activities.findIndex(
      (a) => a.name.toLowerCase() === formName.trim().toLowerCase() && a.id !== editingId
    );
    if (existingIndex >= 0) {
      onToast('Já existe uma atividade cadastrada com este nome na biblioteca.');
      return;
    }

    let updatedList: A3Activity[];

    if (editingId) {
      updatedList = activities.map((a) => {
        if (a.id === editingId) {
          return {
            ...a,
            name: formName.trim(),
            category: formCategory,
            description: formDescription.trim(),
            defaultMinutes: Number(formMinutes),
            isApproximateTime: formIsApproximate,
            isReusable: formIsReusable,
          };
        }
        return a;
      });
      onToast(`Atividade "${formName}" atualizada na biblioteca!`);
    } else {
      const newAct: A3Activity = {
        id: `act_${Date.now()}`,
        name: formName.trim(),
        category: formCategory,
        description: formDescription.trim(),
        defaultMinutes: Number(formMinutes),
        isApproximateTime: formIsApproximate,
        isReusable: formIsReusable,
        createdAt: new Date().toISOString(),
      };
      updatedList = [...activities, newAct];
      onToast(`Atividade "${formName}" adicionada com sucesso à Biblioteca de Tempos!`);
    }

    setActivities(updatedList);
    setWizardStep(7); // Go to "Próxima Atividade?" question
  };

  // Delete activity from library
  const handleDeleteActivity = (id: string) => {
    if (activities.length <= 1) {
      onToast('A biblioteca deve conter pelo menos 1 atividade cadastrada.');
      return;
    }
    const updated = activities.filter((a) => a.id !== id);
    setActivities(updated);
    onToast('Atividade removida da biblioteca.');
  };

  // Finalize library
  const handleFinalizeLibrary = () => {
    if (activities.length === 0) {
      onToast('Cadastre ao menos uma atividade antes de finalizar a Biblioteca de Tempos.');
      return;
    }

    const libraryResult: A3TimeLibraryData = {
      activities,
      totalActivitiesCount: activities.length,
      isCompleted: true,
    };

    onSaveLibrary(libraryResult);
    onToast('Biblioteca de Tempos consolidada e publicada com sucesso!');
    setWizardStep(8); // Final summary
  };

  const formatMinutesLabel = (mins: number) => {
    if (mins < 60) return `${mins} minutos`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  return (
    <div className="space-y-6">
      {/* ========================================================= */}
      {/* ETAPA 01: ABERTURA DA ETAPA                               */}
      {/* ========================================================= */}
      {wizardStep === 1 && (
        <div className="bg-white border-2 border-[var(--preto)] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6 animate-fadeIn">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
            <span className="bg-purple-100 text-purple-900 border border-purple-300 text-[0.65rem] font-subtitle font-bold px-2.5 py-0.5 uppercase tracking-wider inline-flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-purple-700" />
              Etapa 03 — Biblioteca de Tempos
            </span>
          </div>

          <div className="space-y-4">
            <h2 className="font-title text-2xl text-[var(--preto)] leading-snug">
              Cadastre suas atividades uma única vez e reutilize em todos os seus produtos
            </h2>

            <p className="font-body text-sm text-neutral-700 leading-relaxed">
              Em vez de pedir que você informe a duração de cada tarefa repetidamente, vamos criar uma <strong>Biblioteca de Tempos Padronizados</strong>. Cada atividade (ex: consulta, resposta de WhatsApp, elaboração de cardápio) terá seu tempo médio de referência guardado para ser reutilizado pelo sistema.
            </p>

            <div className="p-4 bg-amber-50 border-l-4 border-amber-500 space-y-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                <strong className="font-subtitle text-xs uppercase font-bold text-amber-950">
                  Como funciona a Biblioteca de Tempos?
                </strong>
              </div>
              <ul className="text-xs font-body text-amber-900 space-y-1.5 pl-6 list-disc">
                <li><strong>Cadastre 1 vez só:</strong> Cadastrou a "Consulta de 60 min"? Ela estará disponível para qualquer produto sem você precisar digitar de novo.</li>
                <li><strong>Estimativas aproximadas:</strong> Não exigimos medições cirúrgicas ou cronometradas. Apenas o tempo médio da sua rotina típica.</li>
                <li><strong>Zero cobrança de produtividade:</strong> O objetivo é compreender o esforço operacional da clínica, não julgar seu desempenho.</li>
              </ul>
            </div>

            {/* Current default items preview */}
            <div className="p-4 bg-[var(--branco-off)] border-2 border-neutral-300 space-y-3">
              <span className="text-xs font-subtitle font-bold uppercase tracking-wider text-[var(--preto)] block">
                Atividades sugeridas inicialmente ({activities.length}):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {activities.map((a) => (
                  <div key={a.id} className="bg-white p-2.5 border border-neutral-300 text-xs">
                    <strong className="font-subtitle font-bold text-[var(--preto)] block truncate">
                      {a.name}
                    </strong>
                    <div className="flex items-center justify-between mt-1 text-[0.65rem] text-neutral-500">
                      <span>{a.category}</span>
                      <span className="font-bold text-emerald-700">{formatMinutesLabel(a.defaultMinutes)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 flex justify-end">
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleStartNewActivity()}
              className="py-3.5 px-6 text-xs uppercase font-bold tracking-wider flex items-center gap-2"
            >
              <span>Iniciar Construção da Biblioteca</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* WIZARD PROGRESS BAR FOR STEPS 2 TO 7                      */}
      {/* ========================================================= */}
      {wizardStep >= 2 && wizardStep <= 7 && (
        <div className="bg-white border-2 border-[var(--preto)] p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <div className="flex items-center justify-between text-xs font-subtitle font-bold">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-[var(--preto)] text-white text-xs flex items-center justify-center font-title">
                {editingId ? 'EDIT' : wizardStep - 1}
              </span>
              <span className="uppercase text-[var(--preto)]">
                {wizardStep === 2 && '1. Identificação da Atividade'}
                {wizardStep === 3 && '2. Classificação & Categoria'}
                {wizardStep === 4 && '3. Definição do Tempo Padrão'}
                {wizardStep === 5 && '4. Regra de Reutilização'}
                {wizardStep === 6 && '5. Revisão da Atividade'}
                {wizardStep === 7 && '6. Conclusão da Atividade'}
              </span>
            </div>

            <span className="text-neutral-500 text-[0.7rem] uppercase">
              Biblioteca com {activities.length} atividade(s)
            </span>
          </div>

          <div className="grid grid-cols-6 gap-1">
            {[2, 3, 4, 5, 6, 7].map((sNum) => (
              <div
                key={sNum}
                className={`h-2 transition-all ${
                  sNum === wizardStep
                    ? 'bg-[var(--exodo-red)]'
                    : sNum < wizardStep
                    ? 'bg-emerald-500'
                    : 'bg-neutral-200'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ETAPA 02: IDENTIFICAÇÃO DAS ATIVIDADES                    */}
      {/* ========================================================= */}
      {wizardStep === 2 && (
        <div className="bg-white border-2 border-[var(--preto)] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6 animate-fadeIn">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-subtitle text-xs font-bold uppercase text-amber-950 block">
                  Quais atividades você realiza com frequência durante o acompanhamento dos seus pacientes?
                </strong>
                <p className="font-body text-xs text-amber-900 mt-0.5 leading-relaxed">
                  Você pode escolher uma das sugestões abaixo preparadas para a rotina de clínica de nutrição ou digitar o nome da sua própria atividade.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Presets Grid */}
          <div className="space-y-3">
            <h4 className="font-subtitle text-xs font-bold uppercase tracking-wider text-[var(--preto)] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Sugestões Prontas para Nutricionistas (Clique para usar):</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SUGGESTED_ACTIVITIES.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleStartNewActivity(s)}
                  className="p-3 bg-white border-2 border-neutral-300 hover:border-[var(--preto)] text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 hover:shadow-sm"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <s.icon className="w-4 h-4 text-purple-700 shrink-0" />
                      <span className="font-subtitle text-xs font-bold text-[var(--preto)] line-clamp-1">
                        {s.name}
                      </span>
                    </div>
                    <p className="text-[0.7rem] font-body text-neutral-600 line-clamp-2">
                      {s.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[0.65rem] font-subtitle">
                    <span className="text-neutral-500">{s.category}</span>
                    <span className="font-bold text-emerald-800">{s.defaultMinutes} min</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Name Input */}
          <div className="p-4 bg-neutral-50 border-2 border-neutral-300 space-y-3">
            <label className="block font-subtitle text-xs font-bold uppercase text-[var(--preto)]">
              Ou crie uma atividade personalizada:
            </label>
            <input
              type="text"
              placeholder="Ex: Consulta Nutricional Pediátrica, Bioimpedância Avulsa..."
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full p-3 border-2 border-[var(--preto)] text-sm font-subtitle outline-none bg-white"
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
            <button
              onClick={() => setWizardStep(1)}
              className="text-xs font-subtitle font-bold text-neutral-600 hover:text-[var(--preto)] cursor-pointer border-none bg-transparent flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar
            </button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                if (!formName.trim()) {
                  onToast('Escolha uma sugestão ou informe o nome da atividade.');
                  return;
                }
                setWizardStep(3);
              }}
              className="py-3 px-6 text-xs uppercase font-bold tracking-wider"
            >
              Próxima: Classificar Atividade <ArrowRight className="w-4 h-4 ml-1 inline" />
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ETAPA 03: CLASSIFICAÇÃO & CATEGORIA                       */}
      {/* ========================================================= */}
      {wizardStep === 3 && (
        <div className="bg-white border-2 border-[var(--preto)] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6 animate-fadeIn">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-subtitle text-xs font-bold uppercase text-amber-950 block">
                  Como você descreveria essa atividade e em qual categoria ela se encaixa?
                </strong>
                <p className="font-body text-xs text-amber-900 mt-0.5 leading-relaxed">
                  A categoria ajuda o sistema a organizar o tipo de esforço consumido na sua clínica.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-subtitle font-bold uppercase text-neutral-700 mb-1">
                Nome da Atividade
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full p-3 border-2 border-[var(--preto)] text-sm font-subtitle outline-none bg-white font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-subtitle font-bold uppercase text-neutral-700 mb-2">
                Categoria da Atividade
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormCategory(cat)}
                    className={`p-3 text-left border-2 transition-all cursor-pointer font-subtitle text-xs ${
                      formCategory === cat
                        ? 'bg-[var(--preto)] text-white border-[var(--preto)] font-bold'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-subtitle font-bold uppercase text-neutral-700 mb-1">
                Descrição Curta (Opcional)
              </label>
              <textarea
                rows={2}
                placeholder="Explique resumidamente o que é feito nesta atividade..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full p-3 border border-neutral-300 text-xs font-subtitle outline-none bg-white"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
            <button
              onClick={() => setWizardStep(2)}
              className="text-xs font-subtitle font-bold text-neutral-600 hover:text-[var(--preto)] cursor-pointer border-none bg-transparent flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao nome
            </button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                if (!formName.trim()) {
                  onToast('Informe o nome da atividade.');
                  return;
                }
                setWizardStep(4);
              }}
              className="py-3 px-6 text-xs uppercase font-bold tracking-wider"
            >
              Próxima: Definir Tempo Padrão <ArrowRight className="w-4 h-4 ml-1 inline" />
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ETAPA 04: DEFINIÇÃO DO TEMPO PADRÃO                       */}
      {/* ========================================================= */}
      {wizardStep === 4 && (
        <div className="bg-white border-2 border-[var(--preto)] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6 animate-fadeIn">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-subtitle text-xs font-bold uppercase text-amber-950 block">
                  Em média, quanto tempo você leva para realizar essa atividade em condições normais?
                </strong>
                <p className="font-body text-xs text-amber-900 mt-0.5 leading-relaxed">
                  Considere o tempo gasto em uma execução típica para um único paciente ou atendimento.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {/* Quick time preset buttons */}
            <div className="space-y-2">
              <span className="text-xs font-subtitle font-bold uppercase text-neutral-700 block">
                Atalhos Rápidos de Duração:
              </span>
              <div className="flex flex-wrap gap-2">
                {[15, 20, 30, 45, 60, 90, 120].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setFormMinutes(mins)}
                    className={`py-2 px-3.5 text-xs font-subtitle font-bold border-2 transition-all cursor-pointer ${
                      formMinutes === mins
                        ? 'bg-[var(--preto)] text-white border-[var(--preto)]'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-500'
                    }`}
                  >
                    {formatMinutesLabel(mins)}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Minutes Input */}
            <div className="p-4 bg-neutral-50 border-2 border-neutral-300 space-y-3">
              <label className="block text-xs font-subtitle font-bold uppercase text-[var(--preto)]">
                Duração exata em minutos:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={480}
                  value={formMinutes}
                  onChange={(e) => setFormMinutes(Math.max(1, parseInt(e.target.value, 10) || 0))}
                  className="w-32 p-3 border-2 border-[var(--preto)] text-lg font-subtitle font-bold text-center outline-none bg-white"
                />
                <span className="font-subtitle text-sm text-neutral-700">
                  minutos ({formatMinutesLabel(formMinutes)})
                </span>
              </div>
            </div>

            {/* Approximate checkbox */}
            <label className="flex items-center gap-2 cursor-pointer p-3 bg-amber-50 border border-amber-200">
              <input
                type="checkbox"
                checked={formIsApproximate}
                onChange={(e) => setFormIsApproximate(e.target.checked)}
                className="w-4 h-4 text-[var(--preto)] accent-[var(--preto)]"
              />
              <span className="text-xs font-subtitle text-amber-950 font-bold">
                Considerar este tempo como uma resposta estimada / aproximada da rotina
              </span>
            </label>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
            <button
              onClick={() => setWizardStep(3)}
              className="text-xs font-subtitle font-bold text-neutral-600 hover:text-[var(--preto)] cursor-pointer border-none bg-transparent flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar à categoria
            </button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                if (formMinutes <= 0) {
                  onToast('Informe um tempo maior que zero.');
                  return;
                }
                setWizardStep(5);
              }}
              className="py-3 px-6 text-xs uppercase font-bold tracking-wider"
            >
              Próxima: Reutilização <ArrowRight className="w-4 h-4 ml-1 inline" />
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ETAPA 05: REUTILIZAÇÃO                                    */}
      {/* ========================================================= */}
      {wizardStep === 5 && (
        <div className="bg-white border-2 border-[var(--preto)] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6 animate-fadeIn">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-subtitle text-xs font-bold uppercase text-amber-950 block">
                  Essa atividade poderá ser utilizada em outros produtos ou serviços?
                </strong>
                <p className="font-body text-xs text-amber-900 mt-0.5 leading-relaxed">
                  Ao marcar como reutilizável, esta atividade estará disponível na biblioteca global para associar a qualquer plano ou programa da clínica.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormIsReusable(true)}
              className={`p-5 text-left border-2 transition-all cursor-pointer space-y-2 ${
                formIsReusable
                  ? 'bg-[var(--preto)] text-white border-[var(--preto)] font-bold'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Copy className="w-5 h-5 text-emerald-400" />
                <span className="font-subtitle text-sm">Sim, é Reutilizável</span>
              </div>
              <p className="text-xs font-body text-neutral-300 leading-relaxed">
                Poderá ser associada a múltiplos produtos, programas de acompanhamento ou consultas avulsas.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setFormIsReusable(false)}
              className={`p-5 text-left border-2 transition-all cursor-pointer space-y-2 ${
                !formIsReusable
                  ? 'bg-[var(--preto)] text-white border-[var(--preto)] font-bold'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <span className="font-subtitle text-sm">Não, é Exclusiva</span>
              </div>
              <p className="text-xs font-body text-neutral-300 leading-relaxed">
                Atividade específica destinada apenas a um serviço pontual.
              </p>
            </button>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
            <button
              onClick={() => setWizardStep(4)}
              className="text-xs font-subtitle font-bold text-neutral-600 hover:text-[var(--preto)] cursor-pointer border-none bg-transparent flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao tempo
            </button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setWizardStep(6)}
              className="py-3 px-6 text-xs uppercase font-bold tracking-wider"
            >
              Próxima: Revisar Atividade <ArrowRight className="w-4 h-4 ml-1 inline" />
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ETAPA 06: REVISÃO DA ATIVIDADE                            */}
      {/* ========================================================= */}
      {wizardStep === 6 && (
        <div className="bg-white border-2 border-[var(--preto)] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <div>
              <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[0.65rem] font-subtitle font-bold px-2.5 py-0.5 uppercase tracking-wider inline-flex items-center gap-1 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                Confirmação
              </span>
              <h2 className="font-title text-2xl text-[var(--preto)]">
                Essas informações representam corretamente essa atividade?
              </h2>
            </div>
          </div>

          <div className="p-5 bg-[var(--branco-off)] border-2 border-[var(--preto)] space-y-4">
            <div className="flex items-start justify-between border-b border-neutral-300 pb-3">
              <div>
                <span className="text-[0.65rem] font-subtitle font-bold text-purple-700 uppercase tracking-wider block">
                  {formCategory}
                </span>
                <h3 className="font-title text-xl text-[var(--preto)] font-bold mt-0.5">
                  {formName}
                </h3>
              </div>
              <span className="bg-emerald-100 text-emerald-950 font-subtitle font-bold text-sm px-3 py-1 border border-emerald-400">
                {formatMinutesLabel(formMinutes)}
              </span>
            </div>

            {formDescription && (
              <p className="text-xs font-body text-neutral-700 leading-relaxed">
                {formDescription}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs font-subtitle pt-2">
              <div className="bg-white p-2.5 border border-neutral-300">
                <span className="text-neutral-500 text-[0.65rem] uppercase block">Precisão do Tempo</span>
                <strong className="text-[var(--preto)]">{formIsApproximate ? 'Resposta Aproximada' : 'Tempo Exato'}</strong>
              </div>
              <div className="bg-white p-2.5 border border-neutral-300">
                <span className="text-neutral-500 text-[0.65rem] uppercase block">Reutilização em Produtos</span>
                <strong className="text-[var(--preto)]">{formIsReusable ? 'Sim, Reutilizável' : 'Uso Exclusivo'}</strong>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
            <button
              onClick={() => setWizardStep(3)}
              className="text-xs font-subtitle font-bold text-neutral-600 hover:text-[var(--preto)] cursor-pointer border-none bg-transparent flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" /> Editar dados desta atividade
            </button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSaveCurrentActivity}
              className="py-3.5 px-6 text-xs uppercase font-bold tracking-wider flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Confirmar e Salvar na Biblioteca</span>
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ETAPA 07: PRÓXIMA ATIVIDADE?                              */}
      {/* ========================================================= */}
      {wizardStep === 7 && (
        <div className="bg-white border-2 border-[var(--preto)] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6 animate-fadeIn">
          <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <strong className="font-subtitle text-sm uppercase font-bold text-emerald-950">
                Atividade Registrada na Biblioteca de Tempos!
              </strong>
            </div>
          </div>

          <div className="space-y-4 text-center py-4">
            <h3 className="font-title text-2xl text-[var(--preto)]">
              Existe outra atividade recorrente que ainda não foi cadastrada?
            </h3>
            <p className="font-body text-xs text-neutral-600 max-w-md mx-auto">
              Você atualmente tem <strong>{activities.length} atividades</strong> na sua biblioteca. Você pode adicionar quantas precisar para cobrir sua rotina.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => handleStartNewActivity()}
                className="w-full sm:w-auto py-3.5 px-6 bg-[var(--preto)] hover:bg-neutral-800 text-white font-subtitle text-xs font-bold uppercase tracking-wider cursor-pointer border-none transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Sim, Cadastrar Outra Atividade</span>
              </button>

              <button
                type="button"
                onClick={handleFinalizeLibrary}
                className="w-full sm:w-auto py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-subtitle text-xs font-bold uppercase tracking-wider cursor-pointer border-none transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Não, Concluir Biblioteca de Tempos</span>
              </button>
            </div>
          </div>

          {/* Current list preview */}
          <div className="space-y-2 pt-4 border-t border-neutral-200">
            <h4 className="font-subtitle text-xs font-bold uppercase tracking-wider text-neutral-500">
              Atividades Cadastradas Até Agora ({activities.length}):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {activities.map((a) => (
                <div key={a.id} className="p-3 bg-[var(--branco-off)] border border-neutral-300 flex items-center justify-between text-xs">
                  <div>
                    <strong className="font-subtitle font-bold text-[var(--preto)] block truncate max-w-[180px]">
                      {a.name}
                    </strong>
                    <span className="text-[0.65rem] text-neutral-500">{a.category}</span>
                  </div>
                  <span className="font-subtitle font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-300 text-[0.7rem]">
                    {formatMinutesLabel(a.defaultMinutes)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ETAPA FINAL: ENCERRAMENTO E RESUMO DA BIBLIOTECA          */}
      {/* ========================================================= */}
      {wizardStep === 8 && (
        <div className="bg-white border-2 border-[var(--preto)] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6 animate-fadeIn">
          <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <strong className="font-subtitle text-sm uppercase font-bold text-emerald-950">
                Biblioteca de Tempos Publicada e Consolidada!
              </strong>
            </div>
            <p className="font-body text-xs text-emerald-900 leading-relaxed">
              Sua biblioteca única de atividades e tempos padrão foi concluída com sucesso. Agora estas atividades poderão ser reutilizadas em qualquer produto ou serviço da sua clínica sem a necessidade de re-digitação.
            </p>
          </div>

          {/* Activity Cards List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-title text-xl text-[var(--preto)]">
                Atividades da Biblioteca ({activities.length})
              </h3>

              <button
                type="button"
                onClick={() => handleStartNewActivity()}
                className="py-1.5 px-3 bg-[var(--preto)] text-white text-xs font-subtitle font-bold border-none cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" /> Nova Atividade
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {activities.map((a) => (
                <div key={a.id} className="p-4 bg-[var(--branco-off)] border-2 border-neutral-300 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[0.65rem] font-subtitle font-bold text-purple-800 bg-purple-50 px-2 py-0.5 border border-purple-200 uppercase">
                        {a.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditActivity(a)}
                          className="p-1 text-neutral-600 hover:text-[var(--preto)] cursor-pointer border-none bg-transparent"
                          title="Editar atividade"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteActivity(a.id)}
                          className="p-1 text-neutral-400 hover:text-red-700 cursor-pointer border-none bg-transparent"
                          title="Excluir atividade"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-title text-base text-[var(--preto)] font-bold mt-2">
                      {a.name}
                    </h4>

                    {a.description && (
                      <p className="text-[0.7rem] font-body text-neutral-600 mt-1 line-clamp-2">
                        {a.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-200 text-xs font-subtitle">
                    <span className="text-neutral-500 text-[0.65rem]">
                      {a.isReusable ? '✓ Reutilizável' : 'Exclusivo'}
                    </span>
                    <strong className="text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-300">
                      {formatMinutesLabel(a.defaultMinutes)}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
            <button
              onClick={() => setWizardStep(1)}
              className="text-xs font-subtitle font-bold text-neutral-600 hover:text-[var(--preto)] cursor-pointer border-none bg-transparent flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Rever Introdução
            </button>
            <Button
              variant="primary"
              size="lg"
              onClick={onCompleteStep}
              className="py-3.5 px-6 text-xs uppercase font-bold tracking-wider flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Concluir e Ir para Próxima Etapa</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
