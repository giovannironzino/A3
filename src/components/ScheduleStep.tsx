import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  HelpCircle, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  Info, 
  AlertTriangle, 
  Sparkles, 
  Lock, 
  Edit3, 
  Sun, 
  Sunset, 
  Moon, 
  Coffee, 
  BookOpen, 
  Users, 
  Briefcase,
  Eye,
  Compass,
  Zap,
  FileText,
  Award,
  Copy,
  CheckSquare,
  RefreshCw,
  Package,
  Target
} from 'lucide-react';
import { Button } from './UIPrimitives';
import { A3DaySchedule, A3ScheduleData, A3ShiftConfig, A3RecurringBlock, A3ShiftName } from '../types';
import { StageName } from './JourneyTrail';

interface ScheduleStepProps {
  initialSchedule?: A3ScheduleData | null;
  patientWorkloadWeeklyHours?: number; // X hours calculated from active patients and deliverables
  onSaveSchedule: (schedule: A3ScheduleData) => void;
  onCompleteStep: () => void;
  onToast: (msg: string) => void;
  activeStage?: StageName;
  onNavigateToStage?: (stage: StageName) => void;
  onOpenDeliverable?: (type: 'retrato' | 'caminho' | 'plano') => void;
}

const DAYS_OF_WEEK: Array<{ day: A3DaySchedule['day']; dayShort: A3DaySchedule['dayShort'] }> = [
  { day: 'Segunda-feira', dayShort: 'Seg' },
  { day: 'Terça-feira', dayShort: 'Ter' },
  { day: 'Quarta-feira', dayShort: 'Qua' },
  { day: 'Quinta-feira', dayShort: 'Qui' },
  { day: 'Sexta-feira', dayShort: 'Sex' },
  { day: 'Sábado', dayShort: 'Sáb' },
  { day: 'Domingo', dayShort: 'Dom' },
];

const DEFAULT_SHIFTS: Record<A3ShiftName, { startTime: string; endTime: string; label: string; icon: any; colorClass: string; bgClass: string; borderClass: string }> = {
  'Manhã': { startTime: '07:00', endTime: '12:00', label: 'Manhã (07h - 12h)', icon: Sun, colorClass: 'text-amber-700', bgClass: 'bg-amber-100/90', borderClass: 'border-amber-400' },
  'Tarde': { startTime: '12:00', endTime: '18:00', label: 'Tarde (12h - 18h)', icon: Sunset, colorClass: 'text-orange-700', bgClass: 'bg-orange-100/90', borderClass: 'border-orange-400' },
  'Noite': { startTime: '18:00', endTime: '22:00', label: 'Noite (18h - 22h)', icon: Moon, colorClass: 'text-indigo-700', bgClass: 'bg-indigo-100/90', borderClass: 'border-indigo-400' },
};

const BLOCK_PRESETS = [
  { title: 'Almoço', defaultStart: '12:00', defaultEnd: '13:00', icon: Coffee },
  { title: 'Administrativo', defaultStart: '17:00', defaultEnd: '17:30', icon: Briefcase },
  { title: 'Estudo / Cursos', defaultStart: '20:30', defaultEnd: '21:00', icon: BookOpen },
  { title: 'Reuniões de Equipe', defaultStart: '12:30', defaultEnd: '13:30', icon: Users },
];

// Time calculation helpers
const timeToMinutes = (timeStr: string): number => {
  if (!timeStr || !timeStr.includes(':')) return 0;
  const [h, m] = timeStr.split(':').map((n) => parseInt(n, 10) || 0);
  return h * 60 + m;
};

const minutesToFormattedHours = (minutes: number): string => {
  if (minutes <= 0) return '0h';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

// Initial default week state generator
const createInitialWeekDays = (): A3DaySchedule[] => {
  return DAYS_OF_WEEK.map(({ day, dayShort }) => {
    const isStandardWorkDay = day !== 'Sábado' && day !== 'Domingo';
    return {
      day,
      dayShort,
      isWorkDay: isStandardWorkDay,
      shifts: [
        { shift: 'Manhã', enabled: isStandardWorkDay, startTime: '08:00', endTime: '12:00' },
        { shift: 'Tarde', enabled: isStandardWorkDay, startTime: '13:00', endTime: '18:00' },
        { shift: 'Noite', enabled: false, startTime: '18:30', endTime: '21:30' },
      ],
      blocks: isStandardWorkDay
        ? [
            {
              id: `block_lunch_${dayShort}`,
              day,
              title: 'Almoço',
              startTime: '12:00',
              endTime: '13:00',
            },
          ]
        : [],
      totalGrossMinutes: isStandardWorkDay ? 540 : 0, // 4h + 5h = 9h
      totalNetMinutes: isStandardWorkDay ? 480 : 0,   // 8h
    };
  });
};

export const ScheduleStep: React.FC<ScheduleStepProps> = ({
  initialSchedule,
  patientWorkloadWeeklyHours = 83.1,
  onSaveSchedule,
  onCompleteStep,
  onToast,
  activeStage = 'schedule',
  onNavigateToStage,
  onOpenDeliverable,
}) => {
  // Wizard steps:
  // 1: Dias de Trabalho
  // 2: Turnos de Funcionamento
  // 3: Horários Reais
  // 4: Bloqueios Operacionais
  // 5: Validação da Agenda
  // 6: Revelação Operacional
  const [wizardStep, setWizardStep] = useState<number>(1);

  // Active days schedule state
  const [days, setDays] = useState<A3DaySchedule[]>(() => {
    if (initialSchedule && initialSchedule.days && initialSchedule.days.length > 0) {
      return initialSchedule.days;
    }
    return createInitialWeekDays();
  });

  // Selected day index for detailed editing in steps 2, 3, 4
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // New block form state for step 4
  const [newBlockDay, setNewBlockDay] = useState<string>('Segunda-feira');
  const [newBlockTitle, setNewBlockTitle] = useState<string>('Almoço');
  const [newBlockStart, setNewBlockStart] = useState<string>('12:00');
  const [newBlockEnd, setNewBlockEnd] = useState<string>('13:00');

  // Recalculate gross and net minutes for all days whenever shifts or blocks change
  const calculateDayMinutes = (daySchedule: A3DaySchedule): { grossMin: number; netMin: number } => {
    if (!daySchedule.isWorkDay) return { grossMin: 0, netMin: 0 };

    let grossMin = 0;
    daySchedule.shifts.forEach((s) => {
      if (s.enabled) {
        const start = timeToMinutes(s.startTime);
        const end = timeToMinutes(s.endTime);
        if (end > start) {
          grossMin += end - start;
        }
      }
    });

    let blocksMin = 0;
    daySchedule.blocks.forEach((b) => {
      const bStart = timeToMinutes(b.startTime);
      const bEnd = timeToMinutes(b.endTime);
      if (bEnd > bStart) {
        blocksMin += bEnd - bStart;
      }
    });

    const netMin = Math.max(0, grossMin - blocksMin);
    return { grossMin, netMin };
  };

  const updateDaysWithCalculations = (currentDays: A3DaySchedule[]): A3DaySchedule[] => {
    return currentDays.map((d) => {
      const { grossMin, netMin } = calculateDayMinutes(d);
      return {
        ...d,
        totalGrossMinutes: grossMin,
        totalNetMinutes: netMin,
      };
    });
  };

  // Toggle work day status
  const toggleWorkDay = (dayName: string) => {
    const updated = days.map((d) => {
      if (d.day === dayName) {
        const newIsWorkDay = !d.isWorkDay;
        const newShifts = d.shifts.map((s) => {
          if (newIsWorkDay) {
            return s.shift === 'Manhã' || s.shift === 'Tarde' ? { ...s, enabled: true } : s;
          }
          return { ...s, enabled: false };
        });
        return {
          ...d,
          isWorkDay: newIsWorkDay,
          shifts: newShifts,
        };
      }
      return d;
    });

    setDays(updateDaysWithCalculations(updated));
  };

  // Toggle shift within a day
  const toggleShift = (dayName: string, shiftName: A3ShiftName) => {
    const updated = days.map((d) => {
      if (d.day === dayName) {
        const newShifts = d.shifts.map((s) => {
          if (s.shift === shiftName) {
            return { ...s, enabled: !s.enabled };
          }
          return s;
        });

        const hasActiveShift = newShifts.some((s) => s.enabled);
        return {
          ...d,
          isWorkDay: hasActiveShift,
          shifts: newShifts,
        };
      }
      return d;
    });

    setDays(updateDaysWithCalculations(updated));
  };

  // Apply shift pattern of current day to all active days
  const handleApplyPatternToAllDays = () => {
    const currentDayObj = days[selectedDayIndex];
    if (!currentDayObj) return;

    const currentShifts = currentDayObj.shifts;
    const updated = days.map((d) => {
      if (d.isWorkDay) {
        return {
          ...d,
          shifts: d.shifts.map((s) => {
            const match = currentShifts.find((cs) => cs.shift === s.shift);
            return match ? { ...s, enabled: match.enabled } : s;
          }),
        };
      }
      return d;
    });

    setDays(updateDaysWithCalculations(updated));
    onToast(`Padrão de turnos de ${currentDayObj.dayShort} aplicado aos demais dias ativos!`);
  };

  // Update shift start/end times
  const updateShiftTime = (dayName: string, shiftName: A3ShiftName, field: 'startTime' | 'endTime', val: string) => {
    const updated = days.map((d) => {
      if (d.day === dayName) {
        const newShifts = d.shifts.map((s) => {
          if (s.shift === shiftName) {
            return { ...s, [field]: val };
          }
          return s;
        });
        return { ...d, shifts: newShifts };
      }
      return d;
    });

    setDays(updateDaysWithCalculations(updated));
  };

  // Copy times of selected day to all active days
  const handleCopyTimesToAllDays = () => {
    const currentDayObj = days[selectedDayIndex];
    if (!currentDayObj) return;

    const currentShifts = currentDayObj.shifts;
    const updated = days.map((d) => {
      if (d.isWorkDay) {
        return {
          ...d,
          shifts: d.shifts.map((s) => {
            const match = currentShifts.find((cs) => cs.shift === s.shift);
            return match
              ? { ...s, startTime: match.startTime, endTime: match.endTime, enabled: match.enabled }
              : s;
          }),
        };
      }
      return d;
    });

    setDays(updateDaysWithCalculations(updated));
    onToast(`Horários de ${currentDayObj.dayShort} copiados para todos os dias ativos!`);
  };

  // Add block
  const handleAddBlock = () => {
    if (!newBlockTitle.trim()) {
      onToast('Informe o nome do bloqueio.');
      return;
    }

    const startMin = timeToMinutes(newBlockStart);
    const endMin = timeToMinutes(newBlockEnd);

    if (endMin <= startMin) {
      onToast('O horário de término deve ser posterior ao de início.');
      return;
    }

    const newBlock: A3RecurringBlock = {
      id: `block_${Date.now()}`,
      day: newBlockDay,
      title: newBlockTitle.trim(),
      startTime: newBlockStart,
      endTime: newBlockEnd,
    };

    const updated = days.map((d) => {
      if (d.day === newBlockDay) {
        return {
          ...d,
          blocks: [...d.blocks, newBlock],
        };
      }
      return d;
    });

    setDays(updateDaysWithCalculations(updated));
    onToast(`Bloqueio "${newBlockTitle}" adicionado para ${newBlockDay}.`);
    setNewBlockTitle('Almoço');
  };

  // Delete block
  const handleDeleteBlock = (dayName: string, blockId: string) => {
    const updated = days.map((d) => {
      if (d.day === dayName) {
        return {
          ...d,
          blocks: d.blocks.filter((b) => b.id !== blockId),
        };
      }
      return d;
    });

    setDays(updateDaysWithCalculations(updated));
    onToast('Bloqueio removido.');
  };

  // Quick preset block addition
  const handleAddPresetBlock = (preset: typeof BLOCK_PRESETS[0]) => {
    const targetDay = days[selectedDayIndex]?.day || 'Segunda-feira';
    const newBlock: A3RecurringBlock = {
      id: `block_preset_${Date.now()}`,
      day: targetDay,
      title: preset.title,
      startTime: preset.defaultStart,
      endTime: preset.defaultEnd,
    };

    const updated = days.map((d) => {
      if (d.day === targetDay) {
        return {
          ...d,
          blocks: [...d.blocks.filter(b => b.title !== preset.title), newBlock],
        };
      }
      return d;
    });

    setDays(updateDaysWithCalculations(updated));
    onToast(`Bloqueio "${preset.title}" adicionado para ${days[selectedDayIndex]?.dayShort}.`);
  };

  // Calculate overall totals
  const totalGrossWeeklyMinutes = days.reduce((sum, d) => sum + d.totalGrossMinutes, 0);
  const totalNetWeeklyMinutes = days.reduce((sum, d) => sum + d.totalNetMinutes, 0);
  const totalGrossWeeklyHours = Math.round((totalGrossWeeklyMinutes / 60) * 10) / 10;
  const totalNetWeeklyHours = Math.round((totalNetWeeklyMinutes / 60) * 10) / 10;
  const totalBlockMinutes = totalGrossWeeklyMinutes - totalNetWeeklyMinutes;
  const totalBlockWeeklyHours = Math.round((totalBlockMinutes / 60) * 10) / 10;
  const workingDaysCount = days.filter((d) => d.isWorkDay).length;

  // Comparison logic for Module 06
  const currentPatientWorkload = patientWorkloadWeeklyHours || 83.1;
  const workloadDiffHours = Math.round((totalNetWeeklyHours - currentPatientWorkload) * 10) / 10;

  // Finish and save schedule data
  const handleConfirmSchedule = () => {
    const calculatedDays = updateDaysWithCalculations(days);
    const scheduleResult: A3ScheduleData = {
      days: calculatedDays,
      totalGrossWeeklyHours,
      totalNetWeeklyHours,
      isCompleted: true,
    };

    onSaveSchedule(scheduleResult);
    onToast('Agenda Semanal Reconstruída e Validada com sucesso!');
    setWizardStep(6); // Module 06: Revelação Operacional
  };

  // Get current step progress metadata
  const getStepProgressMeta = () => {
    switch (wizardStep) {
      case 1:
        return { pct: 20, time: '~4 min restantes', label: '1. Dias de Trabalho' };
      case 2:
        return { pct: 40, time: '~3 min restantes', label: '2. Turnos' };
      case 3:
        return { pct: 60, time: '~3 min restantes', label: '3. Horários' };
      case 4:
        return { pct: 80, time: '~2 min restantes', label: '4. Bloqueios' };
      case 5:
        return { pct: 95, time: '~1 min restante', label: '5. Validação' };
      case 6:
        return { pct: 100, time: 'Concluído', label: '6. Revelação Operacional' };
      default:
        return { pct: 20, time: '~4 min restantes', label: '1. Dias de Trabalho' };
    }
  };

  const progressMeta = getStepProgressMeta();

  // Active day object for detail controls
  const selectedDayObj = days[selectedDayIndex] || days[0];

  return (
    <div className="w-full text-[var(--preto)] font-body">
      {/* MAIN THREE-COLUMN GRID CONTAINER */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 border border-neutral-200 bg-white shadow-xs rounded-xl overflow-hidden">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: TRILHA DA JORNADA & AGENDA STEPS             */}
        {/* ========================================================= */}
        <aside className="lg:col-span-3 xl:col-span-3 bg-white border-r border-b lg:border-b-0 border-neutral-200 p-4 shrink-0 space-y-5">
          {/* HEADER TRILHA */}
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
            <div className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[var(--exodo-red)]" />
              <span className="text-[0.7rem] font-title font-bold text-[var(--preto)] uppercase tracking-wider">
                TRILHA DA JORNADA
              </span>
            </div>
            <span className="text-[0.6rem] font-subtitle font-bold bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded">
              3 BLOCOS
            </span>
          </div>

          {/* JORNADA DA RECONSTRUÇÃO DA AGENDA (MINI NAVIGATION) */}
          <div className="p-3 bg-neutral-50 border border-neutral-300 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[0.65rem] font-title font-bold uppercase tracking-wider text-[var(--preto)] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[var(--exodo-red)]" />
                RECONSTRUINDO SUA AGENDA
              </span>
              <span className="text-[0.6rem] font-mono text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                {progressMeta.pct}%
              </span>
            </div>

            {/* Circular / Line gauge progress */}
            <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden border border-neutral-300">
              <div
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{ width: `${progressMeta.pct}%` }}
              />
            </div>

            <nav className="space-y-1">
              {[
                { stepNum: 1, label: 'Dias de Trabalho' },
                { stepNum: 2, label: 'Turnos' },
                { stepNum: 3, label: 'Horários' },
                { stepNum: 4, label: 'Bloqueios' },
                { stepNum: 5, label: 'Validação' },
                { stepNum: 6, label: 'Revelação Operacional' },
              ].map((item) => {
                const isCurrent = wizardStep === item.stepNum;
                const isPassed = wizardStep > item.stepNum;
                return (
                  <button
                    key={item.stepNum}
                    onClick={() => setWizardStep(item.stepNum)}
                    className={`w-full text-left px-2 py-1 text-[0.68rem] font-subtitle font-bold transition-all flex items-center gap-2 rounded cursor-pointer ${
                      isCurrent
                        ? 'bg-[var(--preto)] text-white'
                        : isPassed
                        ? 'text-emerald-900 bg-emerald-50 hover:bg-emerald-100'
                        : 'text-neutral-500 hover:bg-neutral-100'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[0.6rem] font-mono border shrink-0">
                      {isPassed ? '✓' : item.stepNum}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <span className="text-[0.6rem] text-neutral-500 font-subtitle block text-center">
              {progressMeta.time}
            </span>
          </div>

          {/* BLOCO A: CLAREZA (DIAGNÓSTICO) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[0.63rem] font-subtitle font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <Eye className="w-3 h-3 text-emerald-600" />
                BLOCO A • CLAREZA
              </span>
              <span className="text-[0.6rem] text-emerald-700 font-subtitle font-bold bg-emerald-50 px-1 rounded">
                Diagnóstico
              </span>
            </div>
            <nav className="space-y-0.5">
              {[
                { id: 'products', label: '01. Catálogo de Produtos', icon: Package },
                { id: 'patient-workload', label: '02. Carga de Pacientes', icon: Users },
                { id: 'schedule', label: '03. Agenda Disponível', icon: Calendar, active: true },
                { id: 'other-activities', label: '04. Outras Atividades', icon: Clock },
                { id: 'current-model', label: '05. Modelo Atual', icon: ShieldCheck },
              ].map((item) => {
                const IconComp = item.icon;
                const isActive = item.active || activeStage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (onNavigateToStage) {
                        onNavigateToStage(item.id as StageName);
                      }
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-[0.72rem] font-subtitle font-bold uppercase transition-all flex items-center justify-between cursor-pointer border-l-3 ${
                      isActive
                        ? 'border-[var(--exodo-red)] bg-red-50/80 text-[var(--preto)] shadow-2xs'
                        : 'border-transparent text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <IconComp className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[var(--exodo-red)]' : 'text-neutral-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* BLOCO B: ESCOLHA (NAVEGADOR) */}
          <div className="space-y-1.5 pt-2 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <span className="text-[0.63rem] font-subtitle font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                <Compass className="w-3 h-3 text-amber-600" />
                BLOCO B • ESCOLHA
              </span>
              <span className="text-[0.6rem] text-amber-700 font-subtitle font-bold bg-amber-50 px-1 rounded">
                Navegador
              </span>
            </div>
            <nav className="space-y-0.5">
              {[
                { id: 'expectations', label: '06. Expectativas', icon: Target },
                { id: 'boundaries', label: '07. Condições & Limites', icon: Lock },
                { id: 'configuration-choice', label: '08. Escolha da Config.', icon: Award },
              ].map((item) => {
                const IconComp = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (onNavigateToStage) {
                        onNavigateToStage(item.id as StageName);
                      }
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[0.72rem] font-subtitle font-bold uppercase transition-all flex items-center justify-between cursor-pointer border-l-3 border-transparent text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <IconComp className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
                      <span className="truncate">{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* BLOCO C: AÇÃO (PLANO TÁTICO) */}
          <div className="space-y-1.5 pt-2 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <span className="text-[0.63rem] font-subtitle font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 text-indigo-600" />
                BLOCO C • AÇÃO
              </span>
              <span className="text-[0.6rem] text-indigo-700 font-subtitle font-bold bg-indigo-50 px-1 rounded">
                Execução
              </span>
            </div>
            <nav className="space-y-0.5">
              <button
                onClick={() => onNavigateToStage && onNavigateToStage('tactical-plan')}
                className="w-full text-left px-2.5 py-1.5 text-[0.72rem] font-subtitle font-bold uppercase transition-all flex items-center justify-between cursor-pointer border-l-3 border-transparent text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Calendar className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
                  <span className="truncate">09. Plano Tático 90 Dias</span>
                </div>
              </button>
            </nav>
          </div>

          {/* ENTREGAS FORMAIS SHORTCUTS */}
          <div className="pt-3 border-t border-neutral-200 space-y-1.5">
            <span className="text-[0.6rem] font-subtitle font-bold text-neutral-400 uppercase tracking-wider block">
              ENTREGAS FORMAIS
            </span>
            <button
              onClick={() => onOpenDeliverable ? onOpenDeliverable('retrato') : onToast('Acessando Retrato da Clínica')}
              className="w-full text-left px-2 py-1 text-[0.68rem] font-subtitle font-medium text-neutral-700 hover:text-emerald-900 hover:bg-emerald-50 rounded flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Retrato da Clínica</span>
            </button>
            <button
              onClick={() => onOpenDeliverable ? onOpenDeliverable('caminho') : onToast('Acessando O Caminho Escolhido')}
              className="w-full text-left px-2 py-1 text-[0.68rem] font-subtitle font-medium text-neutral-700 hover:text-amber-900 hover:bg-amber-50 rounded flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">O Caminho Escolhido</span>
            </button>
            <button
              onClick={() => onOpenDeliverable ? onOpenDeliverable('plano') : onToast('Acessando Plano Tático')}
              className="w-full text-left px-2 py-1 text-[0.68rem] font-subtitle font-medium text-neutral-700 hover:text-indigo-900 hover:bg-indigo-50 rounded flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">Plano Tático 90 Dias</span>
            </button>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* CENTER COLUMN: INTERACTIVE CONTROLS + AGENDA VIVA         */}
        {/* ========================================================= */}
        <main className="lg:col-span-6 xl:col-span-6 p-4 sm:p-6 space-y-6 min-w-0 bg-[var(--branco-off)]">
          
          {/* MÓDULO 01: ESTRUTURA DA SEMANA (DIAS DE TRABALHO) */}
          {wizardStep === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1 border-b pb-3 border-neutral-200">
                <span className="text-[0.65rem] font-title font-bold text-[var(--exodo-red)] uppercase tracking-wider block">
                  1 MÓDULO 01 — ESTRUTURA DA SEMANA
                </span>
                <h2 className="text-xl font-title font-bold text-[var(--preto)] leading-snug">
                  Em quais dias da semana você normalmente trabalha?
                </h2>
                <p className="text-xs font-body text-neutral-600">
                  Selecione os dias em que você realiza atendimentos ou atividades da clínica.
                </p>
              </div>

              {/* Day Selection Chip Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {DAYS_OF_WEEK.map(({ day, dayShort }) => {
                  const dayObj = days.find((d) => d.day === day);
                  const isWork = dayObj?.isWorkDay ?? false;
                  return (
                    <button
                      key={day}
                      onClick={() => toggleWorkDay(day)}
                      className={`px-3.5 py-2.5 font-title font-bold text-xs uppercase tracking-wider border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                        isWork
                          ? 'bg-[var(--preto)] text-white border-[var(--preto)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                          : 'bg-white text-neutral-500 border-neutral-300 hover:border-neutral-500'
                      }`}
                    >
                      <span>{dayShort}</span>
                      {isWork && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>

              <div className="p-3 bg-neutral-100 border-l-4 border-[var(--preto)] text-xs text-neutral-700 flex items-center justify-between">
                <div>
                  <strong className="font-bold">{workingDaysCount} dias selecionados</strong>. 
                  {days.find(d => !d.isWorkDay) ? ` ${days.filter(d => !d.isWorkDay).map(d => d.dayShort).join(', ')} será(ão) considerado(s) folga.` : ' Todos os dias ativos.'}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="primary"
                  onClick={() => setWizardStep(2)}
                  className="py-2.5 px-5 text-xs font-title uppercase font-bold tracking-wider flex items-center gap-2"
                >
                  <span>CONTINUAR</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* MÓDULO 02: TURNOS DE FUNCIONAMENTO */}
          {wizardStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1 border-b pb-3 border-neutral-200">
                <span className="text-[0.65rem] font-title font-bold text-[var(--exodo-red)] uppercase tracking-wider block">
                  2 MÓDULO 02 — TURNOS DE FUNCIONAMENTO
                </span>
                <h2 className="text-xl font-title font-bold text-[var(--preto)] leading-snug">
                  Quais turnos você costuma trabalhar em cada dia?
                </h2>
                <p className="text-xs font-body text-neutral-600">
                  Ative os turnos que você normalmente utiliza em cada dia da semana.
                </p>
              </div>

              {/* Active Day Selector Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {days.filter(d => d.isWorkDay).map((d) => {
                  const isSelected = days[selectedDayIndex]?.day === d.day;
                  return (
                    <button
                      key={d.day}
                      onClick={() => setSelectedDayIndex(days.findIndex(dayObj => dayObj.day === d.day))}
                      className={`px-3 py-1.5 text-xs font-title font-bold uppercase border-2 cursor-pointer transition-all shrink-0 ${
                        isSelected
                          ? 'bg-[var(--preto)] text-white border-[var(--preto)]'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-500'
                      }`}
                    >
                      {d.dayShort}
                    </button>
                  );
                })}
              </div>

              {/* Turno Cards for Selected Day */}
              <div className="p-4 bg-white border-2 border-[var(--preto)] space-y-3">
                <div className="text-xs font-title font-bold uppercase text-neutral-500 border-b pb-2">
                  CONFIGURANDO: <span className="text-[var(--preto)]">{selectedDayObj?.day}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(['Manhã', 'Tarde', 'Noite'] as A3ShiftName[]).map((sName) => {
                    const shiftConfig = DEFAULT_SHIFTS[sName];
                    const activeShift = selectedDayObj?.shifts.find((s) => s.shift === sName);
                    const isEnabled = activeShift?.enabled ?? false;
                    const Icon = shiftConfig.icon;

                    return (
                      <button
                        key={sName}
                        onClick={() => toggleShift(selectedDayObj.day, sName)}
                        className={`p-3 text-left border-2 rounded-lg transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                          isEnabled
                            ? `${shiftConfig.bgClass} ${shiftConfig.borderClass} shadow-2xs`
                            : 'bg-neutral-50 border-neutral-200 text-neutral-400 hover:border-neutral-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Icon className={`w-4 h-4 ${isEnabled ? shiftConfig.colorClass : 'text-neutral-400'}`} />
                            <span className="font-title font-bold text-xs">{sName}</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={isEnabled}
                            onChange={() => {}}
                            className="w-4 h-4 accent-[var(--preto)] pointer-events-none"
                          />
                        </div>
                        <span className="text-[0.65rem] font-mono text-neutral-600 block">
                          {shiftConfig.startTime}h - {shiftConfig.endTime}h
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleApplyPatternToAllDays}
                    className="py-1.5 px-3 bg-neutral-100 hover:bg-neutral-200 text-[var(--preto)] border border-neutral-300 text-xs font-title font-bold uppercase rounded flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-neutral-600" />
                    <span>APLICAR PADRÃO A OUTROS DIAS</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  onClick={() => setWizardStep(1)}
                  className="py-2.5 px-4 text-xs font-title uppercase font-bold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>VOLTAR</span>
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setWizardStep(3)}
                  className="py-2.5 px-5 text-xs font-title uppercase font-bold tracking-wider flex items-center gap-2"
                >
                  <span>CONTINUAR</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* MÓDULO 03: HORÁRIOS REAIS */}
          {wizardStep === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1 border-b pb-3 border-neutral-200">
                <span className="text-[0.65rem] font-title font-bold text-[var(--exodo-red)] uppercase tracking-wider block">
                  3 MÓDULO 03 — HORÁRIOS REAIS
                </span>
                <h2 className="text-xl font-title font-bold text-[var(--preto)] leading-snug">
                  Defina os horários de início e término de cada turno.
                </h2>
                <p className="text-xs font-body text-neutral-600">
                  Ajuste os horários reais clicando ou selecionando a faixa de funcionamento.
                </p>
              </div>

              {/* Day selector tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {days.filter(d => d.isWorkDay).map((d) => {
                  const isSelected = days[selectedDayIndex]?.day === d.day;
                  return (
                    <button
                      key={d.day}
                      onClick={() => setSelectedDayIndex(days.findIndex(dayObj => dayObj.day === d.day))}
                      className={`px-3 py-1.5 text-xs font-title font-bold uppercase border-2 cursor-pointer transition-all shrink-0 ${
                        isSelected
                          ? 'bg-[var(--preto)] text-white border-[var(--preto)]'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-500'
                      }`}
                    >
                      {d.dayShort}
                    </button>
                  );
                })}
              </div>

              {/* Time Sliders / Inputs for Selected Day */}
              <div className="p-4 bg-white border-2 border-[var(--preto)] space-y-4">
                <div className="text-xs font-title font-bold uppercase text-neutral-500 border-b pb-2">
                  HORÁRIOS DE: <span className="text-[var(--preto)]">{selectedDayObj?.day}</span>
                </div>

                <div className="space-y-3">
                  {selectedDayObj?.shifts.filter(s => s.enabled).map((shift) => {
                    const shiftConfig = DEFAULT_SHIFTS[shift.shift];
                    const Icon = shiftConfig.icon;

                    return (
                      <div key={shift.shift} className="p-3 bg-neutral-50 border border-neutral-300 rounded space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Icon className={`w-4 h-4 ${shiftConfig.colorClass}`} />
                            <span className="font-title font-bold text-xs text-[var(--preto)]">{shift.shift}</span>
                          </div>
                          <span className="text-[0.65rem] font-mono text-neutral-500">
                            Expediente: {shift.startTime} às {shift.endTime}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 items-center pt-1">
                          <div>
                            <label className="text-[0.6rem] font-title font-bold text-neutral-500 uppercase block mb-1">Início</label>
                            <input
                              type="time"
                              value={shift.startTime}
                              onChange={(e) => updateShiftTime(selectedDayObj.day, shift.shift, 'startTime', e.target.value)}
                              className="w-full px-2 py-1 bg-white border border-neutral-300 text-xs font-mono font-bold rounded focus:outline-none focus:border-[var(--preto)]"
                            />
                          </div>
                          <div>
                            <label className="text-[0.6rem] font-title font-bold text-neutral-500 uppercase block mb-1">Término</label>
                            <input
                              type="time"
                              value={shift.endTime}
                              onChange={(e) => updateShiftTime(selectedDayObj.day, shift.shift, 'endTime', e.target.value)}
                              className="w-full px-2 py-1 bg-white border border-neutral-300 text-xs font-mono font-bold rounded focus:outline-none focus:border-[var(--preto)]"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleCopyTimesToAllDays}
                    className="py-1.5 px-3 bg-neutral-100 hover:bg-neutral-200 text-[var(--preto)] border border-neutral-300 text-xs font-title font-bold uppercase rounded flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-neutral-600" />
                    <span>COPIAR PARA OUTROS DIAS</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  onClick={() => setWizardStep(2)}
                  className="py-2.5 px-4 text-xs font-title uppercase font-bold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>VOLTAR</span>
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setWizardStep(4)}
                  className="py-2.5 px-5 text-xs font-title uppercase font-bold tracking-wider flex items-center gap-2"
                >
                  <span>CONTINUAR</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* MÓDULO 04: BLOQUEIOS OPERACIONAIS */}
          {wizardStep === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1 border-b pb-3 border-neutral-200">
                <span className="text-[0.65rem] font-title font-bold text-[var(--exodo-red)] uppercase tracking-wider block">
                  4 MÓDULO 04 — BLOQUEIOS OPERACIONAIS
                </span>
                <h2 className="text-xl font-title font-bold text-[var(--preto)] leading-snug">
                  Registre os períodos em que você não está disponível.
                </h2>
                <p className="text-xs font-body text-neutral-600">
                  Adicione horários fixos de almoço, administração, estudos ou reuniões.
                </p>
              </div>

              {/* Presets Bar */}
              <div className="space-y-1.5">
                <span className="text-[0.63rem] font-title font-bold uppercase text-neutral-500">
                  BLOQUEIOS RÁPIDOS (CLIQUE PARA ADICIONAR):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {BLOCK_PRESETS.map((preset) => {
                    const Icon = preset.icon;
                    return (
                      <button
                        key={preset.title}
                        onClick={() => handleAddPresetBlock(preset)}
                        className="py-1 px-2.5 bg-white border border-neutral-300 hover:border-neutral-600 text-neutral-800 text-[0.68rem] font-title font-bold rounded flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Icon className="w-3 h-3 text-neutral-600" />
                        <span>+ {preset.title} ({preset.defaultStart}-{preset.defaultEnd})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Day Selector & Custom Block Form */}
              <div className="p-4 bg-white border-2 border-[var(--preto)] space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xs font-title font-bold uppercase text-[var(--preto)]">
                    GERENCIAR BLOQUEIOS POR DIA
                  </span>
                  <select
                    value={newBlockDay}
                    onChange={(e) => setNewBlockDay(e.target.value)}
                    className="px-2 py-1 bg-neutral-100 border border-neutral-300 text-xs font-title font-bold rounded focus:outline-none"
                  >
                    {days.filter(d => d.isWorkDay).map(d => (
                      <option key={d.day} value={d.day}>{d.day}</option>
                    ))}
                  </select>
                </div>

                {/* List of active blocks for chosen day */}
                <div className="space-y-1.5">
                  {days.find(d => d.day === newBlockDay)?.blocks.map((block) => (
                    <div key={block.id} className="p-2 bg-neutral-100 border border-neutral-300 rounded flex items-center justify-between text-xs font-body">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold bg-neutral-200 px-1.5 py-0.5 rounded text-[0.68rem]">
                          {block.startTime} - {block.endTime}
                        </span>
                        <span className="font-bold text-[var(--preto)]">{block.title}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteBlock(newBlockDay, block.id)}
                        className="p-1 hover:bg-neutral-200 text-neutral-500 hover:text-red-600 rounded cursor-pointer"
                        title="Remover bloqueio"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {(!days.find(d => d.day === newBlockDay)?.blocks.length) && (
                    <span className="text-xs text-neutral-400 italic block py-1">
                      Nenhum bloqueio cadastrado para este dia.
                    </span>
                  )}
                </div>

                {/* Custom Block Form */}
                <div className="pt-2 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                  <div className="sm:col-span-5">
                    <label className="text-[0.6rem] font-title font-bold uppercase text-neutral-500 block mb-1">Motivo do Bloqueio</label>
                    <input
                      type="text"
                      value={newBlockTitle}
                      onChange={(e) => setNewBlockTitle(e.target.value)}
                      placeholder="Ex: Almoço / Mentoria"
                      className="w-full px-2 py-1 bg-white border border-neutral-300 text-xs font-body rounded focus:outline-none focus:border-[var(--preto)]"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-[0.6rem] font-title font-bold uppercase text-neutral-500 block mb-1">Início</label>
                    <input
                      type="time"
                      value={newBlockStart}
                      onChange={(e) => setNewBlockStart(e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-neutral-300 text-xs font-mono font-bold rounded"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-[0.6rem] font-title font-bold uppercase text-neutral-500 block mb-1">Término</label>
                    <input
                      type="time"
                      value={newBlockEnd}
                      onChange={(e) => setNewBlockEnd(e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-neutral-300 text-xs font-mono font-bold rounded"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <button
                      onClick={handleAddBlock}
                      className="w-full py-1.5 bg-[var(--preto)] text-white hover:bg-neutral-800 text-xs font-bold rounded flex items-center justify-center cursor-pointer"
                      title="Adicionar"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  onClick={() => setWizardStep(3)}
                  className="py-2.5 px-4 text-xs font-title uppercase font-bold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>VOLTAR</span>
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setWizardStep(5)}
                  className="py-2.5 px-5 text-xs font-title uppercase font-bold tracking-wider flex items-center gap-2"
                >
                  <span>CONTINUAR</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* MÓDULO 05: VALIDAÇÃO DA AGENDA */}
          {wizardStep === 5 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1 border-b pb-3 border-neutral-200">
                <span className="text-[0.65rem] font-title font-bold text-[var(--exodo-red)] uppercase tracking-wider block">
                  5 MÓDULO 05 — VALIDAÇÃO DA AGENDA
                </span>
                <h2 className="text-xl font-title font-bold text-[var(--preto)] leading-snug">
                  Revise sua agenda semanal antes de confirmar.
                </h2>
                <p className="text-xs font-body text-neutral-600">
                  Confira se os horários, turnos e bloqueios representam fielmente sua rotina atual.
                </p>
              </div>

              <div className="p-4 bg-emerald-50 border-2 border-emerald-600 space-y-3">
                <div className="flex items-center gap-2 text-emerald-950 font-title font-bold text-xs uppercase">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>RESUMO DE REGISTRO CONCLUÍDO</span>
                </div>

                <div className="space-y-2 text-xs font-body text-emerald-900">
                  <div className="flex items-center justify-between p-2 bg-white/80 rounded border border-emerald-200">
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 font-bold" />
                      <strong>Dias de trabalho definidos:</strong>
                    </span>
                    <span className="font-mono font-bold">{workingDaysCount} dias na semana</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white/80 rounded border border-emerald-200">
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 font-bold" />
                      <strong>Turnos e horários registrados:</strong>
                    </span>
                    <span className="font-mono font-bold">{totalGrossWeeklyHours}h brutas/semana</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white/80 rounded border border-emerald-200">
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 font-bold" />
                      <strong>Bloqueios cadastrados:</strong>
                    </span>
                    <span className="font-mono font-bold">{totalBlockWeeklyHours}h em intervalos</span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <button
                    onClick={() => setWizardStep(1)}
                    className="text-xs font-title font-bold uppercase text-neutral-700 hover:text-[var(--preto)] underline cursor-pointer"
                  >
                    EDITAR AGENDA →
                  </button>
                  <Button
                    variant="primary"
                    onClick={handleConfirmSchedule}
                    className="py-3 px-6 text-xs font-title font-bold uppercase tracking-wider bg-emerald-700 hover:bg-emerald-800 border-none text-white shadow-md flex items-center gap-2"
                  >
                    <span>CONFIRMAR AGENDA →</span>
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-start pt-1">
                <Button
                  variant="outline"
                  onClick={() => setWizardStep(4)}
                  className="py-2.5 px-4 text-xs font-title uppercase font-bold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>VOLTAR</span>
                </Button>
              </div>
            </div>
          )}

          {/* MÓDULO 06: REVELAÇÃO OPERACIONAL */}
          {wizardStep === 6 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1 border-b pb-3 border-neutral-200">
                <span className="text-[0.65rem] font-title font-bold text-[var(--exodo-red)] uppercase tracking-wider block">
                  6 REVELAÇÃO OPERACIONAL
                </span>
                <h2 className="text-xl font-title font-bold text-[var(--preto)] leading-snug">
                  Sua agenda foi reconstruída com sucesso!
                </h2>
                <p className="text-xs font-body text-neutral-600">
                  Agora vamos comparar sua disponibilidade com a carga operacional atual da clínica.
                </p>
              </div>

              {/* Side-by-side comparison cards */}
              <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
                {/* Card 1: Sua Disponibilidade */}
                <div className="sm:col-span-5 p-4 bg-emerald-50 border-2 border-emerald-600 rounded-xl space-y-1.5 text-center">
                  <span className="text-[0.63rem] font-title font-bold text-emerald-800 uppercase tracking-wider block">
                    SUA DISPONIBILIDADE
                  </span>
                  <div className="text-2xl font-title font-black text-emerald-900 font-mono">
                    {totalNetWeeklyHours}h <span className="text-xs font-normal">/ semana</span>
                  </div>
                  <span className="text-[0.65rem] text-emerald-700 block">
                    Tempo realmente disponível após bloqueios
                  </span>
                </div>

                {/* VS Badge */}
                <div className="sm:col-span-1 flex items-center justify-center py-1 sm:py-0">
                  <span className="w-8 h-8 rounded-full bg-[var(--preto)] text-white text-xs font-title font-black flex items-center justify-center shadow-sm">
                    VS
                  </span>
                </div>

                {/* Card 2: Carga Atual dos Pacientes */}
                <div className="sm:col-span-5 p-4 bg-red-50 border-2 border-red-500 rounded-xl space-y-1.5 text-center">
                  <span className="text-[0.63rem] font-title font-bold text-red-800 uppercase tracking-wider block">
                    CARGA ATUAL DOS PACIENTES
                  </span>
                  <div className="text-2xl font-title font-black text-red-950 font-mono">
                    {currentPatientWorkload}h <span className="text-xs font-normal">/ semana</span>
                  </div>
                  <span className="text-[0.65rem] text-red-700 block">
                    Tempo necessário para atender sua carteira atual
                  </span>
                </div>
              </div>

              {/* Difference Banner */}
              <div className="p-5 bg-[var(--preto)] text-white border-2 border-[var(--preto)] shadow-[5px_5px_0px_0px_rgba(227,27,35,1)] space-y-2">
                <div className="flex items-center gap-2 text-red-400">
                  <Zap className="w-4 h-4 text-red-500 animate-pulse" />
                  <span className="text-xs font-title font-bold uppercase tracking-wider">
                    DIFERENÇA IDENTIFICADA
                  </span>
                </div>

                <div className="text-2xl font-title font-black text-white font-mono">
                  {workloadDiffHours > 0 ? `+${workloadDiffHours}` : workloadDiffHours} horas / semana
                </div>

                <p className="text-xs text-neutral-300 font-body">
                  {workloadDiffHours < 0
                    ? 'Sua operação atual exige mais tempo do que a agenda líquida comporta.'
                    : 'Sua disponibilidade líquida comporta a carga atual de atendimento.'}
                </p>
              </div>

              {/* Action Navigation */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setWizardStep(5)}
                  className="w-full sm:w-auto py-2.5 px-4 text-xs font-title uppercase font-bold flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar ao resumo</span>
                </Button>

                <Button
                  variant="primary"
                  onClick={onCompleteStep}
                  className="w-full sm:w-auto py-3 px-6 text-xs font-title uppercase font-bold tracking-wider bg-[var(--exodo-red)] hover:bg-red-700 text-white border-none flex items-center justify-center gap-2"
                >
                  <span>ENTENDER ONDE ESTÁ A SOBRECARGA</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* AGENDA VIVA (VISUAL WEEKLY GRID CANVAS)                  */}
          {/* ========================================================= */}
          <div className="pt-4 border-t-2 border-[var(--preto)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[0.68rem] font-title font-bold uppercase tracking-wider text-[var(--preto)] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[var(--exodo-red)]" />
                AGENDA EM CONSTRUÇÃO
              </span>
              <span className="text-[0.6rem] font-mono font-bold bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded">
                GRADE SEMANAL
              </span>
            </div>

            {/* Weekly Schedule Visual Canvas Grid */}
            <div className="bg-white border-2 border-[var(--preto)] rounded-lg p-3 shadow-inner overflow-x-auto">
              <div className="min-w-[480px] grid grid-cols-7 gap-1.5 text-center">
                {DAYS_OF_WEEK.map(({ day, dayShort }) => {
                  const dayObj = days.find((d) => d.day === day);
                  const isWork = dayObj?.isWorkDay ?? false;
                  const isSelectedDay = dayObj?.day === days[selectedDayIndex]?.day;

                  return (
                    <div
                      key={day}
                      className={`p-2 rounded border-2 transition-all flex flex-col justify-between min-h-[140px] ${
                        isSelectedDay
                          ? 'border-[var(--preto)] bg-neutral-50 shadow-2xs'
                          : isWork
                          ? 'border-neutral-300 bg-emerald-50/40'
                          : 'border-dashed border-neutral-200 bg-neutral-50/50 opacity-60'
                      }`}
                    >
                      {/* Day Header */}
                      <div className="border-b pb-1 border-neutral-200 flex items-center justify-between">
                        <span className="font-title font-bold text-xs uppercase text-[var(--preto)]">
                          {dayShort}
                        </span>
                        {isWork ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <span className="text-[0.55rem] text-neutral-400 uppercase font-mono">Folga</span>
                        )}
                      </div>

                      {/* Day Content according to wizard step */}
                      <div className="py-1 flex-1 flex flex-col gap-1 justify-center">
                        {isWork ? (
                          <>
                            {/* Shifts */}
                            {dayObj?.shifts.filter(s => s.enabled).map((shift) => {
                              const cfg = DEFAULT_SHIFTS[shift.shift];
                              return (
                                <div
                                  key={shift.shift}
                                  className={`px-1 py-0.5 text-[0.58rem] font-title font-bold rounded ${cfg.bgClass} ${cfg.colorClass} border border-neutral-200 truncate`}
                                  title={`${shift.shift}: ${shift.startTime} - ${shift.endTime}`}
                                >
                                  {shift.shift}: {shift.startTime}-{shift.endTime}
                                </div>
                              );
                            })}

                            {/* Blocks (Steps 4, 5, 6) */}
                            {wizardStep >= 4 && dayObj?.blocks.map((b) => (
                              <div
                                key={b.id}
                                className="px-1 py-0.5 text-[0.55rem] font-title font-bold rounded bg-neutral-200 text-neutral-800 border border-neutral-400 truncate flex items-center justify-between"
                                title={`Bloqueio: ${b.title} (${b.startTime}-${b.endTime})`}
                              >
                                <span className="truncate">{b.title}</span>
                                <span className="font-mono text-[0.5rem] shrink-0">{b.startTime}</span>
                              </div>
                            ))}
                          </>
                        ) : (
                          <span className="text-[0.6rem] text-neutral-400 italic">Sem atendimento</span>
                        )}
                      </div>

                      {/* Day Footer Hours */}
                      {isWork && (
                        <div className="pt-1 border-t border-neutral-200 text-[0.6rem] font-mono text-neutral-600 font-bold">
                          {minutesToFormattedHours(dayObj?.totalNetMinutes || 0)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: LEITURA VIVA / INDICADORES EM TEMPO REAL     */}
        {/* ========================================================= */}
        <aside className="lg:col-span-3 xl:col-span-3 bg-white border-l border-t lg:border-t-0 border-neutral-200 p-4 shrink-0 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
            <span className="text-[0.7rem] font-title font-bold uppercase tracking-wider text-[var(--preto)] flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[var(--exodo-red)]" />
              LEITURA VIVA
            </span>
            <span className="text-[0.6rem] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
              TEMPO REAL
            </span>
          </div>

          {/* Indicator Cards Grid */}
          <div className="space-y-2">
            <div className="p-2.5 bg-neutral-50 border border-neutral-300 rounded flex items-center justify-between">
              <span className="text-[0.65rem] font-title font-bold uppercase text-neutral-500">Dias ativos</span>
              <span className="text-sm font-mono font-bold text-[var(--preto)]">{workingDaysCount} dias</span>
            </div>

            <div className="p-2.5 bg-neutral-50 border border-neutral-300 rounded flex items-center justify-between">
              <span className="text-[0.65rem] font-title font-bold uppercase text-neutral-500">Carga bruta</span>
              <span className="text-sm font-mono font-bold text-[var(--preto)]">{totalGrossWeeklyHours}h</span>
            </div>

            <div className="p-2.5 bg-neutral-50 border border-neutral-300 rounded flex items-center justify-between">
              <span className="text-[0.65rem] font-title font-bold uppercase text-neutral-500">Bloqueios</span>
              <span className="text-sm font-mono font-bold text-amber-700">{totalBlockWeeklyHours}h</span>
            </div>

            <div className="p-3 bg-emerald-50 border-2 border-emerald-600 rounded flex items-center justify-between shadow-2xs">
              <span className="text-[0.68rem] font-title font-bold uppercase text-emerald-900">Disponibilidade</span>
              <span className="text-base font-mono font-black text-emerald-900">{totalNetWeeklyHours}h</span>
            </div>
          </div>

          {/* Live System Commentary */}
          <div className="p-3 bg-amber-50/80 border border-amber-300 rounded space-y-1.5 text-xs font-body text-amber-950">
            <div className="flex items-center gap-1.5 font-title font-bold text-[0.65rem] text-amber-900 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>LEITURA DA AGENDA</span>
            </div>
            <p className="text-[0.7rem] leading-relaxed">
              {wizardStep === 1 && `Você indicou ${workingDaysCount} dias ativos na semana. O tempo de atendimento está pronto para ser estruturado em turnos.`}
              {wizardStep === 2 && `Turnos ativados. Sua carga de atendimento bruta estimada é de ${totalGrossWeeklyHours}h semanais.`}
              {wizardStep === 3 && `Horários de início e término ajustados. A estrutura semanal reflete seu expediente real.`}
              {wizardStep === 4 && `Foram registrados ${totalBlockWeeklyHours}h de bloqueios (almoço/gestão/estudos). Sua disponibilidade líquida passou para ${totalNetWeeklyHours}h/semana.`}
              {wizardStep === 5 && `Sua agenda operacional foi reconstruída. A disponibilidade líquida confirmada é de ${totalNetWeeklyHours}h/semana.`}
              {wizardStep === 6 && `Comparação concluída: Disponibilidade líquida (${totalNetWeeklyHours}h) vs Carga dos pacientes (${currentPatientWorkload}h).`}
            </p>
          </div>

          {/* Module 06 Next Step Card */}
          {wizardStep === 6 && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded space-y-2 text-xs font-body text-indigo-950">
              <span className="font-title font-bold text-[0.65rem] uppercase text-indigo-900 block">
                PRÓXIMA ETAPA
              </span>
              <p className="text-[0.68rem] text-indigo-900 leading-normal">
                Na próxima fase, o Navegador Estratégico irá explorar configurações possíveis para reconciliar sua carga atual com sua disponibilidade real.
              </p>
              <ul className="text-[0.65rem] space-y-1 text-indigo-800 list-disc pl-4 font-subtitle font-bold">
                <li>Expectativas</li>
                <li>Restrições</li>
                <li>Escolha da configuração</li>
                <li>Plano de ação de 90 dias</li>
              </ul>
            </div>
          )}

          <div className="pt-2 border-t border-neutral-200">
            <button
              onClick={() => onToast('Guia de apoio da Agenda Operacional')}
              className="text-[0.65rem] font-subtitle text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>Dúvidas sobre a reconstrução da agenda</span>
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
};
