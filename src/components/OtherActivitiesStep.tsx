import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Bot, Send, ArrowRight, ArrowLeft, MessageCircle, Layers, CheckCheck, RotateCcw, FileText,
  Sparkles, TrendingUp, DollarSign, Box, Wallet, Users, Check, HelpCircle, SkipForward, Info,
  RefreshCw, Clock, ShieldCheck, ChevronDown, ChevronUp, LogOut, Lightbulb, Lock, ArrowUpRight,
  Circle, CheckCircle2, Loader2, Compass, Zap
} from 'lucide-react';
import { Logo } from './Logo';
import { Button } from './UIPrimitives';
import {
  A3OtherActivitiesData,
  A3InvestigationData,
  A3AcquisitionChannel,
  A3Product,
  A3SavedNodeState,
  A3HumanResource,
  deduplicateTeamMembers,
} from '../types';
import { InvestigationFormView } from './InvestigationFormView';

interface OtherActivitiesStepProps {
  remainingWeeklyHours: number;
  initialData?: A3OtherActivitiesData | null;
  products?: A3Product[];
  scheduleData?: any;
  patientWorkloadWeeklyHours?: number;
  portfolioData?: any;
  deliveryContractsData?: any;
  onSaveActivities?: (data: A3OtherActivitiesData) => void;
  onCompleteStep: () => void;
  onNavigateBack?: () => void;
  onToast?: (msg: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'gio' | 'user';
  text: string;
  timestamp: string;
}

export type StepKey =
  // EIXO 1 — Promessa
  | 'E1_PROMISE_STATEMENT'
  | 'E1_PROMISE_TYPE'
  | 'E1_DIFFERENTIATOR'
  | 'E1_DIFFERENTIATOR_SOURCE'
  | 'E1_UNIQUE_APPROACH'
  | 'E1_PROMISE_FULFILLMENT'
  // EIXO 2 — Marketing & Captação
  | 'E2_CHANNELS_SELECT'
  | 'E2_CHANNEL_DIRECTION'
  | 'E2_CHANNEL_VOL90_BIFURCATION'
  | 'E2_CHANNEL_VOL90_NUM'
  | 'E2_CHANNEL_CONTENT_ORIGIN_BIFURCATION'
  | 'E2_CHANNEL_CONTENT_ORIGIN_NUM'
  | 'E2_CHANNEL_CLOSED_BIFURCATION'
  | 'E2_CHANNEL_CLOSED_NUM'
  | 'E2_CHANNEL_AUDIENCE_BIFURCATION'
  | 'E2_CHANNEL_AUDIENCE_TEXT'
  | 'E2_MKT_TIMES_PER_WEEK'
  | 'E2_MKT_MINUTES_EACH'
  | 'E2_BRANDING_IDENTITY'
  | 'E2_BRANDING_PROFESSIONAL'
  | 'E2_BRANDING_COMMUNICATION'
  | 'E2_BRANDING_FEEDBACK'
  | 'E2_BRANDING_FEEDBACK_TEXT'
  | 'E2_SCHEDULING_TOOL'
  | 'E2_SCHEDULING_TOOL_NAME'
  // EIXO 3 — Vendas
  | 'E3_SALES_SCRIPT'
  | 'E3_CLOSING_FORMAT'
  | 'E3_SALES_EFFECTIVENESS_BIFURCATION'
  | 'E3_SALES_EFFECTIVENESS_FORMAT'
  | 'E3_ORGANIZING_SYSTEM'
  | 'E3_SYSTEM_NAME'
  | 'E3_WHO_CLOSES'
  | 'E3_WHO_CLOSES_NAME'
  | 'E3_FOLLOW_UP'
  | 'E3_FOLLOW_UP_TIME_BIFURCATION'
  | 'E3_FOLLOW_UP_TIME_NUM'
  | 'E3_FOLLOW_UP_ATTEMPTS_BIFURCATION'
  | 'E3_FOLLOW_UP_ATTEMPTS_NUM'
  | 'E3_TIME_TO_CLOSE_BIFURCATION'
  | 'E3_TIME_TO_CLOSE_TEXT'
  | 'E3_NON_CLOSING_REASONS'
  // EIXO 4 — Entrega de Valor
  | 'E4_EHR_TOOL'
  | 'E4_EHR_TOOL_CUSTOM'
  | 'E4_STANDARD_CONTRACT'
  | 'E4_WELCOME_PROCESS'
  | 'E4_OFFBOARDING_PROCESS'
  | 'E4_CONSENT_FORM'
  | 'E4_RENEWAL_90D_BIFURCATION'
  | 'E4_RENEWAL_90D_NUM'
  // EIXO 5 — Financeiro
  | 'E5_REVENUE_3M_BIFURCATION'
  | 'E5_REVENUE_M1_NUM'
  | 'E5_REVENUE_M2_NUM'
  | 'E5_REVENUE_M3_NUM'
  | 'E5_OTHER_REVENUE_CHECK'
  | 'E5_OTHER_REVENUE_NAME'
  | 'E5_OTHER_REVENUE_VAL'
  | 'E5_LEGAL_STRUCTURE'
  | 'E5_FINANCIAL_SEPARATION'
  | 'E5_PRO_LABORE_TYPE'
  | 'E5_BUDGET_PLANNING'
  | 'E5_RENT'
  | 'E5_RENT_AMOUNT'
  | 'E5_TOOLS_CHECK'
  | 'E5_TOOL_KNOWN_COST'
  | 'E5_MORE_TOOLS_CHECK'
  | 'E5_NEW_TOOL_NAME'
  | 'E5_NEW_TOOL_COST'
  | 'E5_TOOL_ITEM_NAME'
  | 'E5_TOOL_ITEM_COST'
  | 'E5_TOOL_MORE'
  | 'E5_AI_TOOLS'
  | 'E5_AI_TOOLS_COST'
  | 'E5_CRN_FEE'
  | 'E5_PAID_ADS'
  | 'E5_ACCOUNTANT'
  | 'E5_ACCOUNTANT_COST'
  | 'E5_UNANTICIPATED_COSTS_CHECK'
  | 'E5_UNANTICIPATED_COSTS_TEXT'
  | 'E5_UNANTICIPATED_COSTS_VAL'
  | 'E5_PAYMENT_DELAYS'
  | 'E5_CANCELLATION_POLICY'
  | 'E5_FINANCIAL_SOFTWARE'
  | 'E5_FINANCIAL_SOFTWARE_CHECK'
  | 'E5_FINANCIAL_SOFTWARE_NAME'
  | 'E5_FINANCIAL_SOFTWARE_COST_CHECK'
  | 'E5_FINANCIAL_SOFTWARE_COST_VAL'
  // EIXO 6 — Equipe (Fluxo Reformulado)
  | 'E6_CHECK_TEAM_DRAFT'
  | 'E6_HAS_TEAM'
  | 'E6_MEMBER_NAME'
  | 'E6_MEMBER_ROLE'
  | 'E6_MEMBER_FUNCTIONS_SELECT'
  | 'E6_MEMBER_FUNCTIONS_CONFIRM'
  | 'E6_CLINICAL_SCHEDULE_TYPE'
  | 'E6_CLINICAL_FIXED_DAYS'
  | 'E6_CLINICAL_FIXED_HOURS_PER_DAY'
  | 'E6_CLINICAL_DEMAND_HOURS'
  | 'E6_NON_CLINICAL_SCHEDULE_TYPE'
  | 'E6_NON_CLINICAL_FIXED_DAYS'
  | 'E6_NON_CLINICAL_FIXED_HOURS'
  | 'E6_NON_CLINICAL_VARIES_TIMES'
  | 'E6_NON_CLINICAL_VARIES_MINUTES'
  | 'E6_MEMBER_EXTRA_ACTIVITY_CHECK'
  | 'E6_MEMBER_EXTRA_ACTIVITY_NAME'
  | 'E6_MEMBER_COST_CHECK'
  | 'E6_MORE_MEMBERS_CHECK'
  | 'FINISHED';

const STORAGE_KEY = 'a3_investigation_saved_state';

const FUNCTION_LABEL_MAP: Record<string, string> = {
  atende_pacientes: 'Atende pacientes (Delegado clínico)',
  recepcao: 'Recepção / Agendamento',
  vendas: 'Vendas / Comercial',
  marketing: 'Marketing',
  financeiro: 'Financeiro',
  outro: 'Outro',
};

export const OtherActivitiesStep: React.FC<OtherActivitiesStepProps> = ({
  remainingWeeklyHours,
  initialData,
  products = [],
  scheduleData = null,
  onSaveActivities,
  onCompleteStep,
  onNavigateBack,
  onToast,
}) => {
  // Chat Feed State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInputText, setUserInputText] = useState<string>('');
  const [showStructuredDrawer, setShowStructuredDrawer] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // State Machine Step
  const [currentStep, setCurrentStep] = useState<StepKey>('E1_PROMISE_STATEMENT');

  // Mode & Form View State
  const [investigationMode, setInvestigationMode] = useState<'chat' | 'form'>('chat');
  const [activeFormSection, setActiveFormSection] = useState<string>('E1');

  // Tool Cost Tracking State (Eixo 5)
  const [knownToolIndex, setKnownToolIndex] = useState<number>(0);
  const [currentNewToolName, setCurrentNewToolName] = useState<string>('');

  // Channel Loop Tracking
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['Instagram', 'Indicação']);
  const [currentChannelIndex, setCurrentChannelIndex] = useState<number>(0);

  // Other Revenue Loop Tracking
  const [otherRevenues, setOtherRevenues] = useState<Array<{ name: string; monthlyCost: number }>>([]);
  const [currentOtherRevenueName, setCurrentOtherRevenueName] = useState<string>('');

  // Multi-select temporary states
  const [tempSelectedChannels, setTempSelectedChannels] = useState<string[]>(['Instagram', 'Indicação']);
  const [customChannelInput, setCustomChannelInput] = useState<string>('');
  const [tempNonClosingReasons, setTempNonClosingReasons] = useState<string[]>([]);
  const [tempTools, setTempTools] = useState<string[]>([]);
  const [customToolInput, setCustomToolInput] = useState<string>('');

  // Structured Data Accumulator
  const [valueProp, setValueProp] = useState({
    promiseStatement: '',
    promiseType: 'Resultado' as 'Resultado' | 'Experiência' | 'Um pouco dos dois',
    differentiator: '',
    differentiatorSource: '',
    uniqueApproach: '',
    promiseFulfillment: 'Sim',
  });

  const [acqChannels, setAcqChannels] = useState<A3AcquisitionChannel[]>([]);
  const [currentChannelData, setCurrentChannelData] = useState<Partial<A3AcquisitionChannel>>({});

  const [mktTime, setMktTime] = useState({
    timesPerWeek: 3,
    minutesEach: 90,
    totalWeeklyHours: 4.5,
  });

  const [branding, setBranding] = useState({
    hasVisualIdentity: 'Sim',
    feelsProfessional: 'Sim',
    communicationStyle: 'Próximo e informal',
    communicationStyleNote: '',
    markingFeedback: '',
    schedulingTool: '',
  });

  const [sales, setSales] = useState({
    usesScript: 'Sim',
    closingFormat: 'Mensagem',
    effectivenessPerception: '',
    moreEffectiveFormat: '',
    usesSystem: 'Não',
    systemName: '',
    whoCloses: 'Sim, sou eu',
    whoClosesOtherRef: '',
    followsUp: 'Sim',
    followUpDays: '2 dias',
    followUpAttempts: '3 vezes',
    timeToClose: '1 a 3 dias',
    nonClosingReasons: [] as string[],
  });

  const [delivery, setDelivery] = useState({
    electronicHealthRecord: 'Sim',
    hasStandardContract: 'Sim',
    hasWelcomeProcess: 'Mais ou menos',
    hasOffboardingProcess: 'Não',
    hasConsentForm: 'Sim',
    renovation90dConfidence: 'Não sei',
    renovation90dCount: 0,
  });

  const [financial, setFinancial] = useState({
    revenue3mConfidence: 'estimativa',
    revenueM1: 8500,
    revenueM2: 8000,
    revenueM3: 9000,
    legalStructure: 'Pessoa física',
    financesSeparation: 'Sim',
    proLaboreType: 'Valor fixo',
    budgetPlanning: 'Tenho planejamento',
    rent: 1200,
    hasRent: true,
    tools: [] as Array<{ name: string; monthlyCost: number }>,
    currentToolName: '',
    currentToolCost: 0,
    aiToolsCost: 0,
    crnFee: 100,
    paidAdsCost: 0,
    accountant: 350,
    hasAccountant: true,
    unanticipatedCostText: '',
    unanticipatedCostVal: 0,
    paymentDelayLevel: 'Raramente',
    hasCancellationPolicy: 'Não',
    hasFinancialSoftware: true,
    financialSoftware: 'Planilha',
    financialSoftwareCost: 0,
  });

  const [teamMembers, setTeamMembers] = useState<A3HumanResource[]>(() =>
    deduplicateTeamMembers(initialData?.investigation?.team?.members || [])
  );

  const [currentMemberIndex, setCurrentMemberIndex] = useState<number>(0);
  const [currentNonClinicalIndex, setCurrentNonClinicalIndex] = useState<number>(0);
  const [tempFunctionsSelected, setTempFunctionsSelected] = useState<string[]>([]);
  const [tempClinicalDays, setTempClinicalDays] = useState<number>(3);

  const [currentMember, setCurrentMember] = useState<{
    id: string;
    name: string;
    role?: string;
    functions: string[];
    isClinicalDelegate: boolean;
    clinicalSchedule?: {
      type: 'fixa' | 'demanda';
      days?: number;
      hoursGrid?: number;
      estimatedWeeklyHours?: number;
    };
    nonClinicalActivities: Array<{
      functionName: string;
      scheduleType: 'fixa' | 'demanda';
      daysPerWeek?: number;
      hoursPerDay?: number;
      timesPerWeek?: number;
      minutesEach?: number;
    }>;
    monthlyCost: number;
    sourceAxis?: 'sales' | 'team';
    weeklyClinicalHours?: number;
  }>({
    id: '',
    name: '',
    role: '',
    functions: [],
    isClinicalDelegate: false,
    clinicalSchedule: { type: 'fixa', days: 3, hoursGrid: 12, estimatedWeeklyHours: 12 },
    nonClinicalActivities: [],
    monthlyCost: 0,
  });

  // Dynamic Month Labels for last 3 months
  const monthLabels = useMemo(() => {
    const now = new Date();
    const getMonthName = (monthsAgo: number) => {
      const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
      return d.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
    };
    return [getMonthName(1), getMonthName(2), getMonthName(3)];
  }, []);

  // Calculate Context
  const calculatedMetrics = useMemo(() => {
    const daysWorked = scheduleData?.schedules ? Object.keys(scheduleData.schedules).length : 5;
    const availableNetWeeklyHours = scheduleData?.totalNetWeeklyHours || 40;
    const totalEstMonthlyRevenue = products.reduce((acc, p) => {
      const pts = p.activePatients || 0;
      const price = p.price || 0;
      const durationMonths = Math.max(1, (p.durationDays || 90) / 30);
      return acc + ((price / durationMonths) * pts);
    }, 0);

    return {
      daysWorked: Math.max(3, daysWorked),
      availableNetWeeklyHours,
      totalEstMonthlyRevenue: Math.round(totalEstMonthlyRevenue),
      remainingWeeklyHours,
    };
  }, [scheduleData, products, remainingWeeklyHours]);

  // Helper to list all known tools from previous axes
  const getKnownToolsList = () => {
    const list: Array<{ name: string; type: string }> = [];
    if (delivery.electronicHealthRecord && delivery.electronicHealthRecord !== 'Não uso, é papel ou planilha' && delivery.electronicHealthRecord !== 'Nenhum') {
      list.push({ name: delivery.electronicHealthRecord, type: 'Prontuário Eletrônico' });
    }
    if (branding.schedulingTool && branding.schedulingTool !== 'Não' && branding.schedulingTool !== 'Nenhum' && branding.schedulingTool !== 'Sim') {
      list.push({ name: branding.schedulingTool, type: 'Agendamento de Conteúdo' });
    }
    if (sales.usesSystem && sales.systemName && sales.systemName !== 'Não' && sales.systemName !== 'Nenhum') {
      list.push({ name: sales.systemName, type: 'CRM / Sistema de Vendas' });
    }
    financial.tools.forEach((t) => {
      if (t.name && !list.some((existing) => existing.name.toLowerCase() === t.name.toLowerCase())) {
        list.push({ name: t.name, type: 'Ferramenta' });
      }
    });
    return list;
  };

  // Add Gio Message Helper
  const addGioMessage = (text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      { id: `gio_${Date.now()}_${Math.random()}`, sender: 'gio', text, timestamp: time },
    ]);
  };

  // Add User Message Helper
  const addUserMessage = (text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      { id: `user_${Date.now()}_${Math.random()}`, sender: 'user', text, timestamp: time },
    ]);
  };

  // PERSIST NODE STATE SAVER
  const saveNodeState = (lastNode: StepKey, nextNode: StepKey, extra?: Partial<A3SavedNodeState>) => {
    const stateObj: A3SavedNodeState = {
      lastNodeId: lastNode,
      nextNodeId: nextNode,
      currentChannelIndex,
      currentTeamMemberIndex: currentMemberIndex,
      investigationMode,
      activeFormSection,
      timestamp: new Date().toISOString(),
      ...extra,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateObj));
    } catch (e) {
      console.warn('Failed to save node state:', e);
    }
  };

  const getResumptionTopic = (node: StepKey, chName: string, mName: string): string => {
    if (node.startsWith('E1_')) return 'a sua Promessa de valor ao paciente e diferenciais';
    if (node.startsWith('E2_CHANNEL_')) return `como os pacientes chegam até você pelo ${chName}`;
    if (node.startsWith('E2_SCHEDULING_TOOL')) return 'sua ferramenta de agendamento e automação de conteúdo';
    if (node.startsWith('E2_')) return 'sua rotina de marketing, captação e posicionamento';
    if (node.startsWith('E3_ORGANIZING_SYSTEM') || node.startsWith('E3_SYSTEM_NAME')) return 'o sistema ou CRM de vendas que você utiliza';
    if (node.startsWith('E3_WHO_CLOSES')) return 'quem responde e fecha as vendas com os pacientes';
    if (node.startsWith('E3_')) return 'seu processo e roteiro de vendas';
    if (node === 'E4_EHR_TOOL' || node === 'E4_EHR_TOOL_CUSTOM') return 'o seu software de prontuário eletrônico';
    if (node.startsWith('E4_')) return 'a entrega de valor e processos da clínica';
    if (node === 'E5_TOOL_KNOWN_COST' || node === 'E5_MORE_TOOLS_CHECK' || node.startsWith('E5_NEW_TOOL_')) return 'os custos operacionais com softwares e ferramentas';
    if (node.startsWith('E5_REVENUE_')) return 'o faturamento dos últimos 3 meses da clínica';
    if (node.startsWith('E5_')) return 'o planejamento financeiro e custos fixos';
    if (node.startsWith('E6_CLINICAL_') || node.startsWith('E6_NON_CLINICAL_') || node.startsWith('E6_MEMBER_')) return `a rotina e os custos de ${mName || 'um membro da equipe'}`;
    if (node.startsWith('E6_')) return 'a estrutura da sua equipe e colaboradores';
    return 'o mapeamento da sua clínica';
  };

  // LOAD & RESUME EXACT NODE POSITION ON MOUNT
  useEffect(() => {
    let saved: A3SavedNodeState | null = null;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to parse saved state:', e);
    }

    if (!saved && initialData?.investigation?.savedNodeState) {
      saved = initialData.investigation.savedNodeState;
    }

    if (saved && saved.nextNodeId && saved.nextNodeId !== 'FINISHED') {
      const resumeNode = saved.nextNodeId as StepKey;
      const channelIdx = typeof saved.currentChannelIndex === 'number' ? saved.currentChannelIndex : 0;
      const teamIdx = typeof saved.currentTeamMemberIndex === 'number' ? saved.currentTeamMemberIndex : 0;
      if (typeof saved.currentChannelIndex === 'number') setCurrentChannelIndex(saved.currentChannelIndex);
      if (typeof saved.currentTeamMemberIndex === 'number') setCurrentMemberIndex(saved.currentTeamMemberIndex);
      if (saved.investigationMode) setInvestigationMode(saved.investigationMode);
      if (saved.activeFormSection) setActiveFormSection(saved.activeFormSection);

      const channelName = selectedChannels[channelIdx] || 'Instagram';
      const memberName = teamMembers[teamIdx]?.name || currentMember.name || '';
      const topicDesc = getResumptionTopic(resumeNode, channelName, memberName);

      setCurrentStep(resumeNode);
      addGioMessage(`Voltando: estávamos falando sobre ${topicDesc}.`);
      triggerNodeQuestion(resumeNode);
    } else {
      const opening = `Vi que você atende ${calculatedMetrics.daysWorked} dias por semana, com ${calculatedMetrics.remainingWeeklyHours} horas livres fora do atendimento direto. Quero entender melhor o que acontece nesse tempo e no resto do seu negócio. Vai ser rápido, uma coisa por vez.\n\nNuma frase, o que você promete a um paciente que começa com você?`;
      addGioMessage(opening);
    }
  }, []);

  // TRIGGER NODE QUESTION WHEN RESUMING OR REPEATING
  const triggerNodeQuestion = (node: StepKey) => {
    const channelName = selectedChannels[currentChannelIndex] || 'Canal';
    switch (node) {
      // EIXO 1 — Promessa
      case 'E1_PROMISE_STATEMENT':
        addGioMessage('Numa frase, o que você promete a um paciente que começa com você?');
        break;
      case 'E1_PROMISE_TYPE':
        addGioMessage('O que você entrega é mais sobre um resultado ou sobre uma experiência?');
        break;
      case 'E1_DIFFERENTIATOR':
        addGioMessage('Por que um paciente escolheria você e não outro nutricionista?');
        break;
      case 'E1_DIFFERENTIATOR_SOURCE':
        addGioMessage('Isso é algo que você já ouviu de algum paciente, ou é sua percepção?');
        break;
      case 'E1_UNIQUE_APPROACH':
        addGioMessage('Tem algo que você faz no atendimento que a maioria dos nutricionistas não costuma fazer?');
        break;
      case 'E1_PROMISE_FULFILLMENT':
        addGioMessage('Você sente que consegue cumprir essa promessa com a maioria dos seus pacientes hoje?');
        break;

      // EIXO 2 — Marketing & Captação
      case 'E2_CHANNELS_SELECT':
        addGioMessage('Por onde os pacientes chegam até você hoje? Pode marcar quantos quiser.');
        break;
      case 'E2_CHANNEL_DIRECTION':
        addGioMessage(`${channelName}: quando alguém chega até você por aí, geralmente é a pessoa que te procura, ou é você que costuma buscar?`);
        break;
      case 'E2_CHANNEL_VOL90_BIFURCATION':
        addGioMessage(`Nos últimos 90 dias, quantas pessoas chegaram até você pelo ${channelName}?`);
        break;
      case 'E2_CHANNEL_VOL90_NUM':
        addGioMessage('Digite a quantidade de pessoas aproximada nos últimos 90 dias:');
        break;
      case 'E2_CHANNEL_CONTENT_ORIGIN_BIFURCATION':
        addGioMessage('Dessas, você sabe quantas vieram porque viram algum conteúdo seu por conta própria, sem te conhecer antes?');
        break;
      case 'E2_CHANNEL_CONTENT_ORIGIN_NUM':
        addGioMessage('Digite a quantidade aproximada que veio por conteúdo próprio:');
        break;
      case 'E2_CHANNEL_CLOSED_BIFURCATION':
        addGioMessage('Dessas, quantas fecharam com você?');
        break;
      case 'E2_CHANNEL_CLOSED_NUM':
        addGioMessage('Digite quantas fecharam consultas/acompanhamento com você:');
        break;
      case 'E2_CHANNEL_AUDIENCE_BIFURCATION':
        addGioMessage('Você sabe descrever quem costuma chegar até você por esse canal?');
        break;
      case 'E2_CHANNEL_AUDIENCE_TEXT':
        addGioMessage('Descreva brevemente esse público:');
        break;
      case 'E2_MKT_TIMES_PER_WEEK':
        addGioMessage('Quantas vezes por semana você dedica tempo a produzir conteúdo ou fazer marketing?');
        break;
      case 'E2_MKT_MINUTES_EACH':
        addGioMessage('E quanto tempo dura cada vez, mais ou menos? (em minutos)');
        break;
      case 'E2_BRANDING_IDENTITY':
        addGioMessage('Você tem uma identidade visual definida (logotipo, cores, fontes)?');
        break;
      case 'E2_BRANDING_PROFESSIONAL':
        addGioMessage('Você sente que seu posicionamento atual passa uma imagem profissional?');
        break;
      case 'E2_BRANDING_COMMUNICATION':
        addGioMessage('Como você descreve seu tom de voz na comunicação? Escolha a opção mais próxima ou descreva com suas palavras:');
        break;
      case 'E2_BRANDING_FEEDBACK':
        addGioMessage('Já recebeu feedback espontâneo de pacientes sobre seu conteúdo, marca ou forma de falar?');
        break;
      case 'E2_BRANDING_FEEDBACK_TEXT':
        addGioMessage('O que costumam dizer?');
        break;
      case 'E2_SCHEDULING_TOOL':
        addGioMessage('Você usa alguma ferramenta pra organizar ou agendar suas postagens de conteúdo?');
        break;
      case 'E2_SCHEDULING_TOOL_NAME':
        addGioMessage('Qual?');
        break;

      // EIXO 3 — Vendas
      case 'E3_SALES_SCRIPT':
        addGioMessage('Você tem um roteiro ou padrão de respostas para quando um paciente em potencial chama?');
        break;
      case 'E3_CLOSING_FORMAT':
        addGioMessage('Esse primeiro contato de fechamento acontece mais por mensagem ou por chamada?');
        break;
      case 'E3_SALES_EFFECTIVENESS_BIFURCATION':
        addGioMessage('Você sabe dizer qual das duas formas (chamada ou mensagem) costuma fechar mais pacientes, ou é sua impressão?');
        break;
      case 'E3_SALES_EFFECTIVENESS_FORMAT':
        addGioMessage('Qual das duas costuma fechar mais?');
        break;
      case 'E3_ORGANIZING_SYSTEM':
        addGioMessage('Você usa algum sistema ou CRM para organizar seus contatos de vendas?');
        break;
      case 'E3_SYSTEM_NAME':
        addGioMessage('Qual o nome desse sistema?');
        break;
      case 'E3_WHO_CLOSES':
        addGioMessage('É você mesma(o) quem responde e fecha com os pacientes?');
        break;
      case 'E3_WHO_CLOSES_NAME':
        addGioMessage('Quem é a pessoa responsável pelas vendas e atendimento? (Digite apenas o nome, ex: Mariana):');
        break;
      case 'E3_FOLLOW_UP':
        addGioMessage('Quando alguém não fecha na hora, você costuma tentar de novo depois?');
        break;
      case 'E3_FOLLOW_UP_TIME_BIFURCATION':
        addGioMessage('Depois de quanto tempo, mais ou menos?');
        break;
      case 'E3_FOLLOW_UP_TIME_NUM':
        addGioMessage('Digite em quantos dias você faz o retorno (ex: 2 dias):');
        break;
      case 'E3_FOLLOW_UP_ATTEMPTS_BIFURCATION':
        addGioMessage('E quantas vezes você tenta, antes de desistir?');
        break;
      case 'E3_FOLLOW_UP_ATTEMPTS_NUM':
        addGioMessage('Digite a quantidade de tentativas (ex: 3 vezes):');
        break;
      case 'E3_TIME_TO_CLOSE_BIFURCATION':
        addGioMessage('Você sabe, mais ou menos, quanto tempo leva do primeiro contato até a pessoa fechar com você?');
        break;
      case 'E3_TIME_TO_CLOSE_TEXT':
        addGioMessage('Digite o tempo estimado (ex: 3 a 5 dias):');
        break;
      case 'E3_NON_CLOSING_REASONS':
        addGioMessage('Quando alguém não fecha, você costuma saber por quê? Selecione uma ou mais opções.');
        break;

      // EIXO 4 — Entrega de Valor
      case 'E4_EHR_TOOL':
        addGioMessage('Qual software de prontuário eletrônico você utiliza para atender seus pacientes?');
        break;
      case 'E4_EHR_TOOL_CUSTOM':
        addGioMessage('Qual o nome do software de prontuário que você usa?');
        break;
      case 'E4_STANDARD_CONTRACT':
        addGioMessage('Você tem um contrato padrão que usa com todos os seus pacientes?');
        break;
      case 'E4_WELCOME_PROCESS':
        addGioMessage('Existe um processo definido de boas-vindas (onboarding) para quem acabou de fechar?');
        break;
      case 'E4_OFFBOARDING_PROCESS':
        addGioMessage('Existe um processo definido para quando um paciente encerra o ciclo ou decide não renovar (offboarding)?');
        break;
      case 'E4_CONSENT_FORM':
        addGioMessage('Você utiliza termo de consentimento livre e esclarecido assinado pelos pacientes?');
        break;
      case 'E4_RENEWAL_90D_BIFURCATION':
        addGioMessage('Dos pacientes que terminaram o acompanhamento nos últimos 90 dias, quantos renovaram com você?');
        break;
      case 'E4_RENEWAL_90D_NUM':
        addGioMessage('Digite a quantidade de pacientes que renovaram nos últimos 90 dias:');
        break;

      // EIXO 5 — Financeiro
      case 'E5_REVENUE_3M_BIFURCATION':
        addGioMessage(`Falando do seu faturamento nos últimos 3 meses (${monthLabels.join(', ')}): você sabe os valores com precisão, tem uma ideia aproximada, ou não sabe?`);
        break;
      case 'E5_REVENUE_M1_NUM':
        addGioMessage(`Digite o faturamento aproximado no mês passado (${monthLabels[0]}) em R$:`);
        break;
      case 'E5_REVENUE_M2_NUM':
        addGioMessage(`E o faturamento há 2 meses (${monthLabels[1]}) em R$:`);
        break;
      case 'E5_REVENUE_M3_NUM':
        addGioMessage(`E o faturamento há 3 meses (${monthLabels[2]}) em R$:`);
        break;
      case 'E5_OTHER_REVENUE_CHECK':
        addGioMessage('Além dos atendimentos diretos, você tem alguma outra fonte de receita na clínica (ex: venda de e-books, cursos)?');
        break;
      case 'E5_OTHER_REVENUE_NAME':
        addGioMessage('Qual o nome dessa outra fonte de receita?');
        break;
      case 'E5_OTHER_REVENUE_VAL':
        addGioMessage('Quanto essa fonte gera por mês em média? (R$)');
        break;
      case 'E5_LEGAL_STRUCTURE':
        addGioMessage('Qual é o formato jurídico da sua clínica hoje?');
        break;
      case 'E5_FINANCIAL_SEPARATION':
        addGioMessage('Suas contas do consultório são 100% separadas das suas contas pessoais?');
        break;
      case 'E5_PRO_LABORE_TYPE':
        addGioMessage('Como você define o seu pró-labore ou retirada mensal?');
        break;
      case 'E5_BUDGET_PLANNING':
        addGioMessage('Como funciona seu planejamento orçamentário hoje?');
        break;
      case 'E5_RENT':
        addGioMessage('Você paga aluguel do espaço onde atende?');
        break;
      case 'E5_RENT_AMOUNT':
        addGioMessage('Quanto você paga de aluguel por mês? (R$)');
        break;
      case 'E5_TOOL_KNOWN_COST': {
        const known = getKnownToolsList();
        if (known[knownToolIndex]) {
          const t = known[knownToolIndex];
          const msg = knownToolIndex === 0
            ? `Vamos falar de custos. Você me disse que usa o ${t.name} — quanto você paga por ele, mais ou menos? (R$/mês)`
            : `E o ${t.name} — quanto custa, mais ou menos? (R$/mês)`;
          addGioMessage(msg);
        } else {
          addGioMessage('Fora essas que já conversamos, você paga por mais alguma ferramenta ou pelo seu site?');
          setCurrentStep('E5_MORE_TOOLS_CHECK');
        }
        break;
      }
      case 'E5_MORE_TOOLS_CHECK':
        addGioMessage('Fora essas que já conversamos, você paga por mais alguma ferramenta ou pelo seu site?');
        break;
      case 'E5_NEW_TOOL_NAME':
        addGioMessage('Qual?');
        break;
      case 'E5_NEW_TOOL_COST':
        addGioMessage('Quanto custa, mais ou menos? (R$)');
        break;
      case 'E5_TOOLS_CHECK':
        addGioMessage('Você paga por alguma ferramenta ou software (prontuário, CRM, site)?');
        break;
      case 'E5_TOOL_ITEM_NAME':
        addGioMessage('Qual o nome da ferramenta?');
        break;
      case 'E5_TOOL_ITEM_COST':
        addGioMessage('Quanto custa essa ferramenta por mês? (R$)');
        break;
      case 'E5_TOOL_MORE':
        addGioMessage('Tem mais alguma ferramenta ou software pago?');
        break;
      case 'E5_AI_TOOLS':
        addGioMessage('Você paga mensalidade de alguma ferramenta de Inteligência Artificial (ChatGPT, Claude, Canva Pro)?');
        break;
      case 'E5_AI_TOOLS_COST':
        addGioMessage('Quanto custa por mês, mais ou menos, com ferramentas de IA? (R$)');
        break;
      case 'E5_CRN_FEE':
        addGioMessage('Quanto você paga de anuidade do conselho profissional (CRN/CRM) por mês? (R$)');
        break;
      case 'E5_PAID_ADS':
        addGioMessage('Quanto investe por mês em anúncios pagos (Tráfego Pago / Instagram / Google)? (R$)');
        break;
      case 'E5_ACCOUNTANT':
        addGioMessage('Você tem serviço de contador terceirizado?');
        break;
      case 'E5_ACCOUNTANT_COST':
        addGioMessage('Quanto custa o contador por mês? (R$)');
        break;
      case 'E5_UNANTICIPATED_COSTS_CHECK':
        addGioMessage('Você costuma ter custos imprevistos ou não antecipados durante o mês?');
        break;
      case 'E5_UNANTICIPATED_COSTS_TEXT':
        addGioMessage('Qual costuma ser esse custo imprevisto?');
        break;
      case 'E5_UNANTICIPATED_COSTS_VAL':
        addGioMessage('Quanto isso custa por mês em média? (R$)');
        break;
      case 'E5_PAYMENT_DELAYS':
        addGioMessage('Seus pagamentos de pacientes costumam atrasar ou falhar?');
        break;
      case 'E5_CANCELLATION_POLICY':
        addGioMessage('Você tem uma política de cancelamento ou reembolso formalizada para os pacientes?');
        break;
      case 'E5_FINANCIAL_SOFTWARE':
      case 'E5_FINANCIAL_SOFTWARE_CHECK':
        addGioMessage('Você usa alguma ferramenta ou software para gerenciar as finanças (planilha, sistema, caderno)?');
        break;
      case 'E5_FINANCIAL_SOFTWARE_NAME':
        addGioMessage('Qual o nome dessa ferramenta?');
        break;
      case 'E5_FINANCIAL_SOFTWARE_COST_CHECK':
        addGioMessage('Essa ferramenta tem algum custo mensal?');
        break;
      case 'E5_FINANCIAL_SOFTWARE_COST_VAL':
        addGioMessage('Quanto custa essa ferramenta de finanças por mês? (R$)');
        break;

      // EIXO 6 — Equipe (Reformulado)
      case 'E6_CHECK_TEAM_DRAFT':
      case 'E6_HAS_TEAM':
        addGioMessage('Quem trabalha com você na clínica?');
        break;
      case 'E6_MEMBER_NAME':
        addGioMessage('Qual o nome da pessoa que trabalha com você?');
        break;
      case 'E6_MEMBER_ROLE':
        addGioMessage(`Que função essa pessoa exerce?`);
        break;
      case 'E6_MEMBER_FUNCTIONS_SELECT':
        addGioMessage(`O que a/o ${currentMember.name || 'essa pessoa'} faz? Marque todas as funções que se aplicam:`);
        break;
      case 'E6_MEMBER_FUNCTIONS_CONFIRM':
        addGioMessage(`Confere a lista de funções de ${currentMember.name || 'essa pessoa'}?`);
        break;
      case 'E6_CLINICAL_SCHEDULE_TYPE':
        addGioMessage(`Na parte clínica (atendimento a pacientes), a rotina de ${currentMember.name || 'essa pessoa'} é fixa (dias e horas) ou por demanda?`);
        break;
      case 'E6_CLINICAL_FIXED_DAYS':
        addGioMessage(`Quantos dias por semana ${currentMember.name || 'essa pessoa'} atende pacientes?`);
        break;
      case 'E6_CLINICAL_FIXED_HOURS_PER_DAY':
        addGioMessage(`E quantas horas por dia, mais ou menos, ela(e) atende?`);
        break;
      case 'E6_CLINICAL_DEMAND_HOURS':
        addGioMessage(`Quantas horas por semana ela(e) dedica aos atendimentos, em média?`);
        break;
      case 'E6_NON_CLINICAL_SCHEDULE_TYPE':
        addGioMessage(`Para essa função, a rotina é fixa ou varia?`);
        break;
      case 'E6_NON_CLINICAL_FIXED_DAYS':
        addGioMessage(`Quantos dias por semana ela(e) dedica a essa função?`);
        break;
      case 'E6_NON_CLINICAL_FIXED_HOURS':
        addGioMessage(`E quantas horas por dia?`);
        break;
      case 'E6_NON_CLINICAL_VARIES_TIMES':
        addGioMessage(`Quantas vezes por semana ela(e) faz essa tarefa?`);
        break;
      case 'E6_NON_CLINICAL_VARIES_MINUTES':
        addGioMessage(`E quanto tempo dura cada vez? (em minutos)`);
        break;
      case 'E6_MEMBER_EXTRA_ACTIVITY_CHECK':
        addGioMessage(`Tem mais alguma atividade que ${currentMember.name || 'essa pessoa'} faz que não mencionamos?`);
        break;
      case 'E6_MEMBER_EXTRA_ACTIVITY_NAME':
        addGioMessage(`Qual é essa outra atividade?`);
        break;
      case 'E6_MEMBER_COST_CHECK':
        addGioMessage(`Quanto custa essa pessoa por mês? (R$)`);
        break;
      case 'E6_MORE_MEMBERS_CHECK':
        addGioMessage(`Tem mais alguém na sua equipe?`);
        break;
      case 'FINISHED':
        addGioMessage('Mapeamento concluído com sucesso!');
        break;
      default:
        addGioMessage('Por favor, digite sua resposta para continuar:');
        break;
    }
  };

  // Helper to complete E5 (Break Even calculation) and transition to E6
  const finishE5AndGoToE6 = (extraSoftwareCost = 0) => {
    const toolsTotal = financial.tools.reduce((acc, t) => acc + t.monthlyCost, 0) + extraSoftwareCost;
    const teamTotal = teamMembers.reduce((acc, m) => acc + m.monthlyCost, 0);
    const rentCost = financial.hasRent ? financial.rent : 0;
    const accountantCost = financial.hasAccountant ? financial.accountant : 0;
    const totalCosts = rentCost + toolsTotal + accountantCost + teamTotal + financial.aiToolsCost + financial.crnFee + financial.paidAdsCost + financial.unanticipatedCostVal;

    const avgRev = Math.round((financial.revenueM1 + financial.revenueM2 + financial.revenueM3) / 3) || calculatedMetrics.totalEstMonthlyRevenue;
    const diff = avgRev - totalCosts;
    const isAbove = diff >= 0;

    addGioMessage(`Você precisa de aproximadamente R$ ${totalCosts.toLocaleString('pt-BR')} por mês só para cobrir os seus custos fixos e operacionais. Com base no seu faturamento médio mensal de R$ ${avgRev.toLocaleString('pt-BR')}, hoje você está R$ ${Math.abs(diff).toLocaleString('pt-BR')} ${isAbove ? 'acima' : 'abaixo'} do seu Ponto de Equilíbrio.`);

    if (teamMembers.length > 0) {
      const firstMember = teamMembers[0];
      addGioMessage(`Você mencionou ${firstMember.name} antes no pilar de Vendas. Vamos completar as informações dela(e).`);
      setCurrentMemberIndex(0);
      const preFunctions = firstMember.functions && firstMember.functions.length > 0 ? firstMember.functions : (firstMember.sourceAxis === 'sales' ? ['vendas'] : []);
      setCurrentMember({
        id: firstMember.id,
        name: firstMember.name,
        role: firstMember.role || 'Vendas',
        functions: preFunctions,
        isClinicalDelegate: preFunctions.includes('atende_pacientes'),
        clinicalSchedule: { type: 'fixa', days: 3, hoursGrid: 12, estimatedWeeklyHours: 12 },
        nonClinicalActivities: [],
        monthlyCost: firstMember.monthlyCost || 0,
        sourceAxis: firstMember.sourceAxis || 'sales',
      });
      setTempFunctionsSelected(preFunctions);
      addGioMessage(`O que a/o ${firstMember.name} faz?`);
      transitionToStep('E6_MEMBER_FUNCTIONS_SELECT');
    } else {
      addGioMessage('Quem trabalha com você na clínica?');
      transitionToStep('E6_HAS_TEAM');
    }
  };

  // Scroll Chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentStep]);

  // Advance Handler
  const transitionToStep = (nextStep: StepKey, extraSaved?: Partial<A3SavedNodeState>) => {
    saveNodeState(currentStep, nextStep, extraSaved);
    setCurrentStep(nextStep);
  };

  // Helper for Current Channel
  const currentChannelName = selectedChannels[currentChannelIndex] || 'Canal';
  const isCurrentChannelContent = ['Instagram', 'TikTok', 'YouTube', 'blog'].includes(currentChannelName);

  // Send Answer Action
  const handleUserAnswer = (text: string, valueToSave?: any) => {
    addUserMessage(text);
    setUserInputText('');

    setTimeout(() => {
      processStepTransition(currentStep, text, valueToSave);
    }, 300);
  };

  // STATE MACHINE TRANSITION ENGINE
  const processStepTransition = (step: StepKey, answerText: string, extraValue?: any) => {
    switch (step) {
      // EIXO 1 — Promessa
      case 'E1_PROMISE_STATEMENT': {
        if (answerText === 'Nunca pensei numa frase assim') {
          addGioMessage('Sem problema. O que você entrega é mais sobre um resultado, como emagrecer ou controlar um exame, ou mais sobre uma experiência, como acompanhamento próximo?');
          transitionToStep('E1_PROMISE_TYPE');
        } else {
          setValueProp((prev) => ({ ...prev, promiseStatement: answerText }));
          addGioMessage('Por que um paciente escolheria você e não outro nutricionista?');
          transitionToStep('E1_DIFFERENTIATOR');
        }
        break;
      }

      case 'E1_PROMISE_TYPE': {
        setValueProp((prev) => ({
          ...prev,
          promiseType: answerText as any,
          promiseStatement: `Foco em ${answerText.toLowerCase()}`,
        }));
        addGioMessage('Por que um paciente escolheria você e não outro nutricionista?');
        transitionToStep('E1_DIFFERENTIATOR');
        break;
      }

      case 'E1_DIFFERENTIATOR': {
        setValueProp((prev) => ({ ...prev, differentiator: answerText }));
        addGioMessage('Isso é algo que você já ouviu de algum paciente, ou é sua percepção?');
        transitionToStep('E1_DIFFERENTIATOR_SOURCE');
        break;
      }

      case 'E1_DIFFERENTIATOR_SOURCE': {
        setValueProp((prev) => ({ ...prev, differentiatorSource: answerText }));
        addGioMessage('Tem algo que você faz no atendimento que a maioria dos nutricionistas que você conhece não costuma fazer?');
        transitionToStep('E1_UNIQUE_APPROACH');
        break;
      }

      case 'E1_UNIQUE_APPROACH': {
        setValueProp((prev) => ({ ...prev, uniqueApproach: answerText }));
        addGioMessage('Você sente que consegue cumprir essa promessa com a maioria dos seus pacientes hoje?');
        transitionToStep('E1_PROMISE_FULFILLMENT');
        break;
      }

      case 'E1_PROMISE_FULFILLMENT': {
        setValueProp((prev) => ({ ...prev, promiseFulfillment: answerText }));
        addGioMessage('Por onde os pacientes chegam até você hoje? Pode marcar quantos quiser.');
        transitionToStep('E2_CHANNELS_SELECT');
        break;
      }

      // EIXO 2 — Marketing & Captação
      case 'E2_CHANNELS_SELECT': {
        addGioMessage('Vamos um por vez, com calma.');
        setCurrentChannelIndex(0);
        const chName = selectedChannels[0] || 'Instagram';
        setCurrentChannelData({ name: chName, isContentChannel: ['Instagram', 'TikTok', 'YouTube', 'blog'].includes(chName) });
        addGioMessage(`${chName}: quando alguém chega até você por aí, geralmente é a pessoa que te procura, ou é você que costuma buscar?`);
        transitionToStep('E2_CHANNEL_DIRECTION', { currentChannelIndex: 0 });
        break;
      }

      case 'E2_CHANNEL_DIRECTION': {
        setCurrentChannelData((prev) => ({ ...prev, contactDirection: answerText }));
        addGioMessage(`Nos últimos 90 dias, quantas pessoas chegaram até você pelo ${currentChannelName}?`);
        transitionToStep('E2_CHANNEL_VOL90_BIFURCATION');
        break;
      }

      case 'E2_CHANNEL_VOL90_BIFURCATION': {
        setCurrentChannelData((prev) => ({ ...prev, volumeConfidence: answerText }));
        if (answerText === 'Não sei') {
          addGioMessage('Sem problema, isso também me ajuda.');
          setCurrentChannelData((prev) => ({ ...prev, volume90d: 0 }));
          if (isCurrentChannelContent) {
            addGioMessage('Dessas, você sabe quantas vieram porque viram algum conteúdo seu por conta própria, sem te conhecer antes?');
            transitionToStep('E2_CHANNEL_CONTENT_ORIGIN_BIFURCATION');
          } else {
            addGioMessage('Dessas, quantas fecharam com você?');
            transitionToStep('E2_CHANNEL_CLOSED_BIFURCATION');
          }
        } else {
          addGioMessage('Digite a quantidade de pessoas aproximada nos últimos 90 dias:');
          transitionToStep('E2_CHANNEL_VOL90_NUM');
        }
        break;
      }

      case 'E2_CHANNEL_VOL90_NUM': {
        const num = parseInt(answerText) || 0;
        setCurrentChannelData((prev) => ({ ...prev, volume90d: num }));
        if (isCurrentChannelContent) {
          addGioMessage('Dessas, você sabe quantas vieram porque viram algum conteúdo seu por conta própria, sem te conhecer antes?');
          transitionToStep('E2_CHANNEL_CONTENT_ORIGIN_BIFURCATION');
        } else {
          addGioMessage('Dessas, quantas fecharam com você?');
          transitionToStep('E2_CHANNEL_CLOSED_BIFURCATION');
        }
        break;
      }

      case 'E2_CHANNEL_CONTENT_ORIGIN_BIFURCATION': {
        if (answerText === 'Não sei') {
          setCurrentChannelData((prev) => ({ ...prev, contentOriginCount: 0 }));
          addGioMessage('Dessas, quantas fecharam com você?');
          transitionToStep('E2_CHANNEL_CLOSED_BIFURCATION');
        } else {
          addGioMessage('Digite a quantidade aproximada que veio por conteúdo próprio:');
          transitionToStep('E2_CHANNEL_CONTENT_ORIGIN_NUM');
        }
        break;
      }

      case 'E2_CHANNEL_CONTENT_ORIGIN_NUM': {
        const num = parseInt(answerText) || 0;
        setCurrentChannelData((prev) => ({ ...prev, contentOriginCount: num }));
        addGioMessage('Dessas, quantas fecharam com você?');
        transitionToStep('E2_CHANNEL_CLOSED_BIFURCATION');
        break;
      }

      case 'E2_CHANNEL_CLOSED_BIFURCATION': {
        setCurrentChannelData((prev) => ({ ...prev, closedConfidence: answerText }));
        if (answerText === 'Não sei') {
          setCurrentChannelData((prev) => ({ ...prev, closedCount: 0 }));
          addGioMessage('Você sabe descrever quem costuma chegar até você por esse canal?');
          transitionToStep('E2_CHANNEL_AUDIENCE_BIFURCATION');
        } else {
          addGioMessage('Digite quantas fecharam consultas/acompanhamento com você:');
          transitionToStep('E2_CHANNEL_CLOSED_NUM');
        }
        break;
      }

      case 'E2_CHANNEL_CLOSED_NUM': {
        const num = parseInt(answerText) || 0;
        setCurrentChannelData((prev) => ({ ...prev, closedCount: num }));
        addGioMessage('Você sabe descrever quem costuma chegar até você por esse canal?');
        transitionToStep('E2_CHANNEL_AUDIENCE_BIFURCATION');
        break;
      }

      case 'E2_CHANNEL_AUDIENCE_BIFURCATION': {
        if (answerText === 'Não sei ao certo') {
          setCurrentChannelData((prev) => ({ ...prev, audienceConfidence: 'nao-sei', audienceDescription: '' }));
          const completedChannel: A3AcquisitionChannel = {
            id: `ch_${Date.now()}`,
            name: currentChannelName,
            contactDirection: (currentChannelData.contactDirection as any) || 'Ela me procura',
            volumeConfidence: (currentChannelData.volumeConfidence as any) || 'estimativa',
            volume90d: currentChannelData.volume90d || 0,
            contentOriginCount: currentChannelData.contentOriginCount || 0,
            closedConfidence: (currentChannelData.closedConfidence as any) || 'estimativa',
            closedCount: currentChannelData.closedCount || 0,
            audienceConfidence: 'nao-sei',
            audienceDescription: '',
          };
          setAcqChannels((prev) => [...prev, completedChannel]);
          advanceToNextChannelOrMkt(currentChannelIndex + 1);
        } else {
          addGioMessage('Descreva brevemente esse público:');
          transitionToStep('E2_CHANNEL_AUDIENCE_TEXT');
        }
        break;
      }

      case 'E2_CHANNEL_AUDIENCE_TEXT': {
        const completedChannel: A3AcquisitionChannel = {
          id: `ch_${Date.now()}`,
          name: currentChannelName,
          contactDirection: (currentChannelData.contactDirection as any) || 'Ela me procura',
          volumeConfidence: (currentChannelData.volumeConfidence as any) || 'estimativa',
          volume90d: currentChannelData.volume90d || 0,
          contentOriginCount: currentChannelData.contentOriginCount || 0,
          closedConfidence: (currentChannelData.closedConfidence as any) || 'estimativa',
          closedCount: currentChannelData.closedCount || 0,
          audienceConfidence: 'sei-descrever',
          audienceDescription: answerText,
        };
        setAcqChannels((prev) => [...prev, completedChannel]);
        advanceToNextChannelOrMkt(currentChannelIndex + 1);
        break;
      }

      case 'E2_MKT_TIMES_PER_WEEK': {
        const times = parseInt(answerText) || 3;
        setMktTime((prev) => ({ ...prev, timesPerWeek: times }));
        addGioMessage('E quanto tempo dura cada vez, mais ou menos? (em minutos)');
        transitionToStep('E2_MKT_MINUTES_EACH');
        break;
      }

      case 'E2_MKT_MINUTES_EACH': {
        const mins = parseInt(answerText) || 60;
        const totalHrs = Math.round(((mktTime.timesPerWeek * mins) / 60) * 10) / 10;
        setMktTime((prev) => ({ ...prev, minutesEach: mins, totalWeeklyHours: totalHrs }));

        addGioMessage('Você tem uma identidade visual definida (logotipo, cores, fontes)?');
        transitionToStep('E2_BRANDING_IDENTITY');
        break;
      }

      case 'E2_BRANDING_IDENTITY': {
        setBranding((prev) => ({ ...prev, hasVisualIdentity: answerText }));
        addGioMessage('Você sente que seu posicionamento atual passa uma imagem profissional?');
        transitionToStep('E2_BRANDING_PROFESSIONAL');
        break;
      }

      case 'E2_BRANDING_PROFESSIONAL': {
        setBranding((prev) => ({ ...prev, feelsProfessional: answerText }));
        addGioMessage('Como você descreve seu tom de voz na comunicação? Escolha a opção mais próxima ou descreva com suas palavras:');
        transitionToStep('E2_BRANDING_COMMUNICATION');
        break;
      }

      case 'E2_BRANDING_COMMUNICATION': {
        setBranding((prev) => ({ ...prev, communicationStyle: answerText }));
        addGioMessage('Já recebeu feedback espontâneo de pacientes sobre seu conteúdo, marca ou forma de falar?');
        transitionToStep('E2_BRANDING_FEEDBACK');
        break;
      }

      case 'E2_BRANDING_FEEDBACK': {
        if (answerText === 'Sim') {
          addGioMessage('O que costumam dizer?');
          transitionToStep('E2_BRANDING_FEEDBACK_TEXT');
        } else {
          addGioMessage('Você utiliza alguma ferramenta de agendamento de posts ou automação de marketing?');
          transitionToStep('E2_SCHEDULING_TOOL');
        }
        break;
      }

      case 'E2_BRANDING_FEEDBACK_TEXT': {
        setBranding((prev) => ({ ...prev, markingFeedback: answerText }));
        addGioMessage('Você utiliza alguma ferramenta de agendamento de posts ou automação de marketing?');
        transitionToStep('E2_SCHEDULING_TOOL');
        break;
      }

      case 'E2_SCHEDULING_TOOL': {
        if (answerText === 'Sim') {
          addGioMessage('Qual?');
          transitionToStep('E2_SCHEDULING_TOOL_NAME');
        } else {
          setBranding((prev) => ({ ...prev, schedulingTool: 'Não' }));
          addGioMessage('Perfeito! Falando agora de Vendas: você tem um script ou roteiro de atendimento para quando um paciente entra em contato?');
          transitionToStep('E3_SALES_SCRIPT');
        }
        break;
      }

      case 'E2_SCHEDULING_TOOL_NAME': {
        setBranding((prev) => ({ ...prev, schedulingTool: answerText }));
        if (answerText && !financial.tools.some((t) => t.name.toLowerCase() === answerText.toLowerCase())) {
          setFinancial((prev) => ({ ...prev, tools: [...prev.tools, { name: answerText, monthlyCost: 0 }] }));
        }
        addGioMessage('Perfeito! Falando agora de Vendas: você tem um script ou roteiro de atendimento para quando um paciente entra em contato?');
        transitionToStep('E3_SALES_SCRIPT');
        break;
      }

      // EIXO 3 — Vendas
      case 'E3_SALES_SCRIPT': {
        setSales((prev) => ({ ...prev, usesScript: answerText }));
        addGioMessage('Esse primeiro contato de fechamento acontece mais por mensagem ou por chamada?');
        transitionToStep('E3_CLOSING_FORMAT');
        break;
      }

      case 'E3_CLOSING_FORMAT': {
        setSales((prev) => ({ ...prev, closingFormat: answerText }));
        addGioMessage('Você sabe dizer qual das duas formas (chamada ou mensagem) costuma fechar mais pacientes, ou é sua impressão?');
        transitionToStep('E3_SALES_EFFECTIVENESS_BIFURCATION');
        break;
      }

      case 'E3_SALES_EFFECTIVENESS_BIFURCATION': {
        setSales((prev) => ({ ...prev, effectivenessPerception: answerText }));
        if (answerText === 'Não sei') {
          addGioMessage('Entendido. Você usa algum sistema ou CRM para organizar seus contatos de vendas?');
          transitionToStep('E3_ORGANIZING_SYSTEM');
        } else {
          addGioMessage('Qual das duas costuma fechar mais?');
          transitionToStep('E3_SALES_EFFECTIVENESS_FORMAT');
        }
        break;
      }

      case 'E3_SALES_EFFECTIVENESS_FORMAT': {
        setSales((prev) => ({ ...prev, moreEffectiveFormat: answerText }));
        addGioMessage('Você usa algum sistema ou CRM para organizar seus contatos de vendas?');
        transitionToStep('E3_ORGANIZING_SYSTEM');
        break;
      }

      case 'E3_ORGANIZING_SYSTEM': {
        if (answerText === 'Sim') {
          setSales((prev) => ({ ...prev, usesSystem: 'Sim' }));
          addGioMessage('Qual o nome desse sistema?');
          transitionToStep('E3_SYSTEM_NAME');
        } else {
          setSales((prev) => ({ ...prev, usesSystem: 'Não' }));
          addGioMessage('É você mesma(o) quem responde e fecha com os pacientes?');
          transitionToStep('E3_WHO_CLOSES');
        }
        break;
      }

      case 'E3_SYSTEM_NAME': {
        setSales((prev) => ({ ...prev, systemName: answerText }));
        // REAPROVEITAMENTO CRUZADO: Adicionar ferramenta
        if (answerText && !financial.tools.some((t) => t.name.toLowerCase() === answerText.toLowerCase())) {
          setFinancial((prev) => ({
            ...prev,
            tools: [...prev.tools, { name: answerText, monthlyCost: 0 }],
          }));
        }
        addGioMessage('É você mesma(o) quem responde e fecha com os pacientes?');
        transitionToStep('E3_WHO_CLOSES');
        break;
      }

      case 'E3_WHO_CLOSES': {
        setSales((prev) => ({ ...prev, whoCloses: answerText }));
        if (answerText === 'Não') {
          addGioMessage('Quem é a pessoa responsável pelas vendas e atendimento? (Digite apenas o nome, ex: Mariana):');
          transitionToStep('E3_WHO_CLOSES_NAME');
        } else {
          addGioMessage('Quando alguém não fecha na hora, você costuma tentar de novo depois?');
          transitionToStep('E3_FOLLOW_UP');
        }
        break;
      }

      case 'E3_WHO_CLOSES_NAME': {
        const cleanName = answerText.trim();
        setSales((prev) => ({ ...prev, whoClosesOtherRef: cleanName }));

        if (cleanName) {
          setTeamMembers((prev) => {
            const existingSales = prev.find((m) => m.sourceAxis === 'sales');
            if (existingSales) {
              return deduplicateTeamMembers(
                prev.map((m) => (m.id === existingSales.id ? { ...m, name: cleanName, role: 'Vendas', functions: ['vendas'] } : m))
              );
            }
            const existsByName = prev.find((m) => m.name.toLowerCase() === cleanName.toLowerCase());
            if (existsByName) {
              return deduplicateTeamMembers(
                prev.map((m) =>
                  m.name.toLowerCase() === cleanName.toLowerCase()
                    ? { ...m, functions: Array.from(new Set([...(m.functions || []), 'vendas'])) }
                    : m
                )
              );
            }
            const draftMember: A3HumanResource = {
              id: `m_sales_${Date.now()}`,
              name: cleanName,
              role: 'Vendas',
              functions: ['vendas'],
              isClinicalDelegate: false,
              monthlyCost: 0,
              sourceAxis: 'sales',
            };
            return deduplicateTeamMembers([...prev, draftMember]);
          });
        }

        addGioMessage('Quando alguém não fecha na hora, você costuma tentar de novo depois?');
        transitionToStep('E3_FOLLOW_UP');
        break;
      }

      case 'E3_FOLLOW_UP': {
        setSales((prev) => ({ ...prev, followsUp: answerText }));
        if (answerText === 'Sim') {
          addGioMessage('Depois de quanto tempo, mais ou menos?');
          transitionToStep('E3_FOLLOW_UP_TIME_BIFURCATION');
        } else {
          addGioMessage('Você sabe, mais ou menos, quanto tempo leva do primeiro contato até a pessoa fechar com você?');
          transitionToStep('E3_TIME_TO_CLOSE_BIFURCATION');
        }
        break;
      }

      case 'E3_FOLLOW_UP_TIME_BIFURCATION': {
        if (answerText === 'Não sei') {
          setSales((prev) => ({ ...prev, followUpDays: 'Não mensurado' }));
          addGioMessage('E quantas vezes você tenta, antes de desistir?');
          transitionToStep('E3_FOLLOW_UP_ATTEMPTS_BIFURCATION');
        } else {
          addGioMessage('Digite em quantos dias você faz o retorno (ex: 2 dias):');
          transitionToStep('E3_FOLLOW_UP_TIME_NUM');
        }
        break;
      }

      case 'E3_FOLLOW_UP_TIME_NUM': {
        setSales((prev) => ({ ...prev, followUpDays: answerText }));
        addGioMessage('E quantas vezes você tenta, antes de desistir?');
        transitionToStep('E3_FOLLOW_UP_ATTEMPTS_BIFURCATION');
        break;
      }

      case 'E3_FOLLOW_UP_ATTEMPTS_BIFURCATION': {
        if (answerText === 'Não sei') {
          setSales((prev) => ({ ...prev, followUpAttempts: 'Não mensurado' }));
          addGioMessage('Você sabe, mais ou menos, quanto tempo leva do primeiro contato até a pessoa fechar com você?');
          transitionToStep('E3_TIME_TO_CLOSE_BIFURCATION');
        } else {
          addGioMessage('Digite a quantidade de tentativas (ex: 3 vezes):');
          transitionToStep('E3_FOLLOW_UP_ATTEMPTS_NUM');
        }
        break;
      }

      case 'E3_FOLLOW_UP_ATTEMPTS_NUM': {
        setSales((prev) => ({ ...prev, followUpAttempts: answerText }));
        addGioMessage('Você sabe, mais ou menos, quanto tempo leva do primeiro contato até a pessoa fechar com você?');
        transitionToStep('E3_TIME_TO_CLOSE_BIFURCATION');
        break;
      }

      case 'E3_TIME_TO_CLOSE_BIFURCATION': {
        if (answerText === 'Não sei') {
          setSales((prev) => ({ ...prev, timeToClose: 'Não mensurado' }));
          addGioMessage('Quando alguém não fecha, você costuma saber por quê? Selecione uma ou mais opções.');
          transitionToStep('E3_NON_CLOSING_REASONS');
        } else {
          addGioMessage('Digite o tempo estimado (ex: 3 a 5 dias):');
          transitionToStep('E3_TIME_TO_CLOSE_TEXT');
        }
        break;
      }

      case 'E3_TIME_TO_CLOSE_TEXT': {
        setSales((prev) => ({ ...prev, timeToClose: answerText }));
        addGioMessage('Quando alguém não fecha, você costuma saber por quê? Selecione uma ou mais opções.');
        transitionToStep('E3_NON_CLOSING_REASONS');
        break;
      }

      case 'E3_NON_CLOSING_REASONS': {
        addGioMessage('Ótimo! Entendemos a captação e conversão. Vamos falar agora da Entrega de Valor:\n\nQual software de prontuário eletrônico você utiliza para atender seus pacientes?');
        transitionToStep('E4_EHR_TOOL');
        break;
      }

      // EIXO 4 — Entrega de Valor (incorporando Processos, Ferramentas & Consentimento)
      case 'E4_EHR_TOOL': {
        if (answerText === '+ Outro' || answerText === 'Outro') {
          addGioMessage('Qual o nome do software de prontuário que você usa?');
          transitionToStep('E4_EHR_TOOL_CUSTOM');
        } else {
          setDelivery((prev) => ({ ...prev, electronicHealthRecord: answerText }));
          if (answerText && answerText !== 'Não uso, é papel ou planilha' && !financial.tools.some((t) => t.name.toLowerCase() === answerText.toLowerCase())) {
            setFinancial((prev) => ({ ...prev, tools: [...prev.tools, { name: answerText, monthlyCost: 0 }] }));
          }
          addGioMessage('Você tem um contrato padrão que usa com todos os seus pacientes?');
          transitionToStep('E4_STANDARD_CONTRACT');
        }
        break;
      }

      case 'E4_EHR_TOOL_CUSTOM': {
        setDelivery((prev) => ({ ...prev, electronicHealthRecord: answerText }));
        if (answerText && !financial.tools.some((t) => t.name.toLowerCase() === answerText.toLowerCase())) {
          setFinancial((prev) => ({ ...prev, tools: [...prev.tools, { name: answerText, monthlyCost: 0 }] }));
        }
        addGioMessage('Você tem um contrato padrão que usa com todos os seus pacientes?');
        transitionToStep('E4_STANDARD_CONTRACT');
        break;
      }

      case 'E4_STANDARD_CONTRACT': {
        setDelivery((prev) => ({ ...prev, hasStandardContract: answerText }));
        addGioMessage('Existe um processo definido de boas-vindas (onboarding) para quem acabou de fechar?');
        transitionToStep('E4_WELCOME_PROCESS');
        break;
      }

      case 'E4_WELCOME_PROCESS': {
        setDelivery((prev) => ({ ...prev, hasWelcomeProcess: answerText }));
        addGioMessage('Existe um processo definido para quando um paciente encerra o ciclo ou decide não renovar (offboarding)?');
        transitionToStep('E4_OFFBOARDING_PROCESS');
        break;
      }

      case 'E4_OFFBOARDING_PROCESS': {
        setDelivery((prev) => ({ ...prev, hasOffboardingProcess: answerText }));
        addGioMessage('Você utiliza termo de consentimento livre e esclarecido assinado pelos pacientes?');
        transitionToStep('E4_CONSENT_FORM');
        break;
      }

      case 'E4_CONSENT_FORM': {
        setDelivery((prev) => ({ ...prev, hasConsentForm: answerText }));
        addGioMessage('Dos pacientes que terminaram o acompanhamento nos últimos 90 dias, quantos renovaram com você?');
        transitionToStep('E4_RENEWAL_90D_BIFURCATION');
        break;
      }

      case 'E4_RENEWAL_90D_BIFURCATION': {
        setDelivery((prev) => ({ ...prev, renovation90dConfidence: answerText }));
        if (answerText === 'Não sei') {
          addGioMessage('Entendido! Vamos falar agora do aspecto Financeiro do seu negócio.\n\nFalando do seu faturamento mensal nos últimos 3 meses: você sabe os valores com precisão, tem uma ideia aproximada, ou não sabe?');
          transitionToStep('E5_REVENUE_3M_BIFURCATION');
        } else {
          addGioMessage(`Digite a quantidade de pacientes que renovaram nos últimos 90 dias:`);
          transitionToStep('E4_RENEWAL_90D_NUM');
        }
        break;
      }

      case 'E4_RENEWAL_90D_NUM': {
        const count = parseInt(answerText) || 0;
        setDelivery((prev) => ({ ...prev, renovation90dCount: count }));
        addGioMessage('Perfeito! Vamos falar agora da estrutura Financeira da clínica.\n\nFalando do seu faturamento mensal nos últimos 3 meses: você sabe os valores com precisão, tem uma ideia aproximada, ou não sabe?');
        transitionToStep('E5_REVENUE_3M_BIFURCATION');
        break;
      }

      // EIXO 5 — Financeiro (Reestruturado)
      case 'E5_REVENUE_3M_BIFURCATION': {
        setFinancial((prev) => ({ ...prev, revenue3mConfidence: answerText }));
        if (answerText === 'Não sei') {
          addGioMessage(`Sem problema! Usaremos a estimativa calculada das suas consultas (R$ ${calculatedMetrics.totalEstMonthlyRevenue}/mês).`);
          addGioMessage('Além dos atendimentos diretos, você tem alguma outra fonte de receita na clínica (ex: venda de e-books, cursos, laudos)?');
          transitionToStep('E5_OTHER_REVENUE_CHECK');
        } else {
          addGioMessage(`Digite o faturamento aproximado no mês passado (${monthLabels[0]}) em R$:`);
          transitionToStep('E5_REVENUE_M1_NUM');
        }
        break;
      }

      case 'E5_REVENUE_M1_NUM': {
        const val = parseInt(answerText.replace(/\D/g, '')) || calculatedMetrics.totalEstMonthlyRevenue;
        setFinancial((prev) => ({ ...prev, revenueM1: val }));
        addGioMessage(`E o faturamento há 2 meses (${monthLabels[1]}) em R$:`);
        transitionToStep('E5_REVENUE_M2_NUM');
        break;
      }

      case 'E5_REVENUE_M2_NUM': {
        const val = parseInt(answerText.replace(/\D/g, '')) || financial.revenueM1;
        setFinancial((prev) => ({ ...prev, revenueM2: val }));
        addGioMessage(`E o faturamento há 3 meses (${monthLabels[3] || monthLabels[2]}) em R$:`);
        transitionToStep('E5_REVENUE_M3_NUM');
        break;
      }

      case 'E5_REVENUE_M3_NUM': {
        const val = parseInt(answerText.replace(/\D/g, '')) || financial.revenueM2;
        setFinancial((prev) => ({ ...prev, revenueM3: val }));
        addGioMessage('Além dos atendimentos diretos, você tem alguma outra fonte de receita na clínica (ex: venda de e-books, cursos)?');
        transitionToStep('E5_OTHER_REVENUE_CHECK');
        break;
      }

      case 'E5_OTHER_REVENUE_CHECK': {
        if (answerText === 'Sim') {
          addGioMessage('Qual o nome dessa outra fonte de receita?');
          transitionToStep('E5_OTHER_REVENUE_NAME');
        } else {
          addGioMessage('Qual é o formato jurídico da sua clínica hoje?');
          transitionToStep('E5_LEGAL_STRUCTURE');
        }
        break;
      }

      case 'E5_OTHER_REVENUE_NAME': {
        setCurrentOtherRevenueName(answerText);
        addGioMessage(`Quanto essa fonte ("${answerText}") gera por mês em média? (R$)`);
        transitionToStep('E5_OTHER_REVENUE_VAL');
        break;
      }

      case 'E5_OTHER_REVENUE_VAL': {
        const val = parseInt(answerText.replace(/\D/g, '')) || 0;
        setOtherRevenues((prev) => [...prev, { name: currentOtherRevenueName, monthlyCost: val }]);
        setCurrentOtherRevenueName('');

        addGioMessage('Tem mais alguma outra fonte de receita?');
        transitionToStep('E5_OTHER_REVENUE_CHECK');
        break;
      }

      case 'E5_LEGAL_STRUCTURE': {
        setFinancial((prev) => ({ ...prev, legalStructure: answerText }));
        addGioMessage('Suas contas do consultório são 100% separadas das suas contas pessoais?');
        transitionToStep('E5_FINANCIAL_SEPARATION');
        break;
      }

      case 'E5_FINANCIAL_SEPARATION': {
        setFinancial((prev) => ({ ...prev, financesSeparation: answerText }));
        addGioMessage('Como você define o seu pró-labore ou retirada mensal?');
        transitionToStep('E5_PRO_LABORE_TYPE');
        break;
      }

      case 'E5_PRO_LABORE_TYPE': {
        setFinancial((prev) => ({ ...prev, proLaboreType: answerText }));
        addGioMessage('Como funciona seu planejamento orçamentário hoje?');
        transitionToStep('E5_BUDGET_PLANNING');
        break;
      }

      case 'E5_BUDGET_PLANNING': {
        setFinancial((prev) => ({ ...prev, budgetPlanning: answerText }));
        addGioMessage('Vamos detalhar os seus Custos. Você paga aluguel do espaço onde atende?');
        transitionToStep('E5_RENT');
        break;
      }

      case 'E5_RENT': {
        if (answerText === 'Sim') {
          setFinancial((prev) => ({ ...prev, hasRent: true }));
          addGioMessage('Quanto você paga de aluguel por mês? (R$)');
          transitionToStep('E5_RENT_AMOUNT');
        } else {
          setFinancial((prev) => ({ ...prev, hasRent: false, rent: 0 }));
          setKnownToolIndex(0);
          const known = getKnownToolsList();
          if (known.length > 0) {
            addGioMessage(`Vamos falar de custos. Você me disse que usa o ${known[0].name} — quanto você paga por ele, mais ou menos? (R$/mês)`);
            transitionToStep('E5_TOOL_KNOWN_COST');
          } else {
            addGioMessage('Fora essas que já conversamos, você paga por mais alguma ferramenta ou pelo seu site?');
            transitionToStep('E5_MORE_TOOLS_CHECK');
          }
        }
        break;
      }

      case 'E5_RENT_AMOUNT': {
        const amt = parseInt(answerText.replace(/\D/g, '')) || 0;
        setFinancial((prev) => ({ ...prev, rent: amt }));
        setKnownToolIndex(0);
        const known = getKnownToolsList();
        if (known.length > 0) {
          addGioMessage(`Vamos falar de custos. Você me disse que usa o ${known[0].name} — quanto você paga por ele, mais ou menos? (R$/mês)`);
          transitionToStep('E5_TOOL_KNOWN_COST');
        } else {
          addGioMessage('Fora essas que já conversamos, você paga por mais alguma ferramenta ou pelo seu site?');
          transitionToStep('E5_MORE_TOOLS_CHECK');
        }
        break;
      }

      case 'E5_TOOL_KNOWN_COST': {
        const cost = parseInt(answerText.replace(/\D/g, '')) || 0;
        const known = getKnownToolsList();
        const currentTool = known[knownToolIndex];

        if (currentTool) {
          setFinancial((prev) => {
            const existingIdx = prev.tools.findIndex((t) => t.name.toLowerCase() === currentTool.name.toLowerCase());
            if (existingIdx >= 0) {
              const updated = [...prev.tools];
              updated[existingIdx] = { ...updated[existingIdx], monthlyCost: cost };
              return { ...prev, tools: updated };
            }
            return { ...prev, tools: [...prev.tools, { name: currentTool.name, monthlyCost: cost }] };
          });
        }

        const nextIdx = knownToolIndex + 1;
        if (nextIdx < known.length) {
          setKnownToolIndex(nextIdx);
          const nextTool = known[nextIdx];
          addGioMessage(`E o ${nextTool.name} — quanto custa, mais ou menos? (R$/mês)`);
          transitionToStep('E5_TOOL_KNOWN_COST');
        } else {
          addGioMessage('Fora essas que já conversamos, você paga por mais alguma ferramenta ou pelo seu site?');
          transitionToStep('E5_MORE_TOOLS_CHECK');
        }
        break;
      }

      case 'E5_MORE_TOOLS_CHECK': {
        if (answerText === 'Sim') {
          addGioMessage('Qual?');
          transitionToStep('E5_NEW_TOOL_NAME');
        } else {
          addGioMessage('Você paga mensalidade de alguma ferramenta de Inteligência Artificial (ChatGPT, Claude, Canva Pro)?');
          transitionToStep('E5_AI_TOOLS');
        }
        break;
      }

      case 'E5_NEW_TOOL_NAME': {
        setCurrentNewToolName(answerText);
        addGioMessage(`Quanto custa a ferramenta "${answerText}", mais ou menos? (R$)`);
        transitionToStep('E5_NEW_TOOL_COST');
        break;
      }

      case 'E5_NEW_TOOL_COST': {
        const cost = parseInt(answerText.replace(/\D/g, '')) || 0;
        if (currentNewToolName) {
          setFinancial((prev) => ({
            ...prev,
            tools: [...prev.tools, { name: currentNewToolName, monthlyCost: cost }],
          }));
          setCurrentNewToolName('');
        }
        addGioMessage('Fora essa, você paga por mais alguma ferramenta ou pelo seu site?');
        transitionToStep('E5_MORE_TOOLS_CHECK');
        break;
      }

      case 'E5_TOOLS_CHECK': {
        if (answerText === 'Sim') {
          addGioMessage('Qual o nome da ferramenta?');
          transitionToStep('E5_TOOL_ITEM_NAME');
        } else {
          addGioMessage('Você paga mensalidade de alguma ferramenta de Inteligência Artificial (ChatGPT, Claude, Canva Pro)?');
          transitionToStep('E5_AI_TOOLS');
        }
        break;
      }

      case 'E5_TOOL_ITEM_NAME': {
        setFinancial((prev) => ({ ...prev, currentToolName: answerText }));
        addGioMessage(`Quanto custa a ferramenta "${answerText}" por mês? (R$)`);
        transitionToStep('E5_TOOL_ITEM_COST');
        break;
      }

      case 'E5_TOOL_ITEM_COST': {
        const cost = parseInt(answerText.replace(/\D/g, '')) || 0;
        setFinancial((prev) => ({
          ...prev,
          tools: [...prev.tools, { name: prev.currentToolName, monthlyCost: cost }],
          currentToolName: '',
          currentToolCost: 0,
        }));
        addGioMessage('Tem mais alguma ferramenta ou software pago?');
        transitionToStep('E5_TOOL_MORE');
        break;
      }

      case 'E5_TOOL_MORE': {
        if (answerText === 'Sim') {
          addGioMessage('Qual o nome da próxima ferramenta?');
          transitionToStep('E5_TOOL_ITEM_NAME');
        } else {
          addGioMessage('Você paga mensalidade de alguma ferramenta de Inteligência Artificial (ChatGPT, Claude, Canva Pro)?');
          transitionToStep('E5_AI_TOOLS');
        }
        break;
      }

      case 'E5_AI_TOOLS': {
        if (answerText === 'Sim') {
          addGioMessage('Quanto custa por mês, mais ou menos, com ferramentas de IA? (R$)');
          transitionToStep('E5_AI_TOOLS_COST');
        } else {
          setFinancial((prev) => ({ ...prev, aiToolsCost: 0 }));
          addGioMessage('Quanto você paga de anuidade/mensalidade do conselho profissional (CRN/CRM) por mês? (R$)');
          transitionToStep('E5_CRN_FEE');
        }
        break;
      }

      case 'E5_AI_TOOLS_COST': {
        const cost = parseInt(answerText.replace(/\D/g, '')) || 0;
        setFinancial((prev) => ({ ...prev, aiToolsCost: cost }));
        addGioMessage('Quanto você paga de anuidade do conselho profissional (CRN/CRM) por mês? (R$)');
        transitionToStep('E5_CRN_FEE');
        break;
      }

      case 'E5_CRN_FEE': {
        const fee = parseInt(answerText.replace(/\D/g, '')) || 100;
        setFinancial((prev) => ({ ...prev, crnFee: fee }));
        addGioMessage('Quanto investe por mês em anúncios pagos (Tráfego Pago / Instagram / Google)? (R$)');
        transitionToStep('E5_PAID_ADS');
        break;
      }

      case 'E5_PAID_ADS': {
        const ads = parseInt(answerText.replace(/\D/g, '')) || 0;
        setFinancial((prev) => ({ ...prev, paidAdsCost: ads }));
        addGioMessage('Você tem serviço de contador terceirizado?');
        transitionToStep('E5_ACCOUNTANT');
        break;
      }

      case 'E5_ACCOUNTANT': {
        if (answerText === 'Sim') {
          setFinancial((prev) => ({ ...prev, hasAccountant: true }));
          addGioMessage('Quanto custa o contador por mês? (R$)');
          transitionToStep('E5_ACCOUNTANT_COST');
        } else {
          setFinancial((prev) => ({ ...prev, hasAccountant: false, accountant: 0 }));
          addGioMessage('Você costuma ter custos imprevistos ou não antecipados durante o mês?');
          transitionToStep('E5_UNANTICIPATED_COSTS_CHECK');
        }
        break;
      }

      case 'E5_ACCOUNTANT_COST': {
        const amt = parseInt(answerText.replace(/\D/g, '')) || 0;
        setFinancial((prev) => ({ ...prev, accountant: amt }));
        addGioMessage('Você costuma ter custos imprevistos ou não antecipados durante o mês?');
        transitionToStep('E5_UNANTICIPATED_COSTS_CHECK');
        break;
      }

      case 'E5_UNANTICIPATED_COSTS_CHECK': {
        if (answerText === 'Sim') {
          addGioMessage('Qual costuma ser esse custo imprevisto?');
          transitionToStep('E5_UNANTICIPATED_COSTS_TEXT');
        } else {
          setFinancial((prev) => ({ ...prev, unanticipatedCostText: '', unanticipatedCostVal: 0 }));
          addGioMessage('Seus pagamentos costumam atrasar ou falhar?');
          transitionToStep('E5_PAYMENT_DELAYS');
        }
        break;
      }

      case 'E5_UNANTICIPATED_COSTS_TEXT': {
        setFinancial((prev) => ({ ...prev, unanticipatedCostText: answerText }));
        addGioMessage(`Quanto isso custa por mês em média? (R$)`);
        transitionToStep('E5_UNANTICIPATED_COSTS_VAL');
        break;
      }

      case 'E5_UNANTICIPATED_COSTS_VAL': {
        const val = parseInt(answerText.replace(/\D/g, '')) || 0;
        setFinancial((prev) => ({ ...prev, unanticipatedCostVal: val }));
        addGioMessage('Seus pagamentos de pacientes costumam atrasar ou falhar?');
        transitionToStep('E5_PAYMENT_DELAYS');
        break;
      }

      case 'E5_PAYMENT_DELAYS': {
        setFinancial((prev) => ({ ...prev, paymentDelayLevel: answerText }));
        addGioMessage('Você tem uma política de cancelamento ou reembolso formalizada para os pacientes?');
        transitionToStep('E5_CANCELLATION_POLICY');
        break;
      }

      case 'E5_CANCELLATION_POLICY': {
        setFinancial((prev) => ({ ...prev, hasCancellationPolicy: answerText }));
        addGioMessage('Você usa alguma ferramenta ou software para gerenciar as finanças (planilha, sistema, caderno)?');
        transitionToStep('E5_FINANCIAL_SOFTWARE_CHECK');
        break;
      }

      case 'E5_FINANCIAL_SOFTWARE_CHECK': {
        if (answerText === 'Sim') {
          setFinancial((prev) => ({ ...prev, hasFinancialSoftware: true }));
          addGioMessage('Qual o nome dessa ferramenta ou sistema?');
          transitionToStep('E5_FINANCIAL_SOFTWARE_NAME');
        } else {
          setFinancial((prev) => ({ ...prev, hasFinancialSoftware: false, financialSoftware: 'Nenhuma', financialSoftwareCost: 0 }));
          finishE5AndGoToE6(0);
        }
        break;
      }

      case 'E5_FINANCIAL_SOFTWARE_NAME': {
        setFinancial((prev) => ({ ...prev, financialSoftware: answerText }));
        addGioMessage('Essa ferramenta tem algum custo mensal?');
        transitionToStep('E5_FINANCIAL_SOFTWARE_COST_CHECK');
        break;
      }

      case 'E5_FINANCIAL_SOFTWARE_COST_CHECK': {
        if (answerText === 'Sim') {
          addGioMessage(`Quanto custa essa ferramenta de finanças por mês? (R$)`);
          transitionToStep('E5_FINANCIAL_SOFTWARE_COST_VAL');
        } else {
          setFinancial((prev) => ({ ...prev, financialSoftwareCost: 0 }));
          finishE5AndGoToE6(0);
        }
        break;
      }

      case 'E5_FINANCIAL_SOFTWARE_COST_VAL': {
        const cost = parseInt(answerText.replace(/\D/g, '')) || 0;
        setFinancial((prev) => ({
          ...prev,
          financialSoftwareCost: cost,
          tools: prev.financialSoftware ? [...prev.tools.filter((t) => t.name !== prev.financialSoftware), { name: prev.financialSoftware, monthlyCost: cost }] : prev.tools,
        }));
        finishE5AndGoToE6(cost);
        break;
      }

      case 'E5_FINANCIAL_SOFTWARE': {
        finishE5AndGoToE6(0);
        break;
      }

      // EIXO 6 — EQUIPE (FLUXO REFORMULADO)
      case 'E6_CHECK_TEAM_DRAFT': {
        if (answerText === 'Trabalho sozinho' || answerText === 'Sozinho' || answerText === 'Ninguém' || answerText === 'Não') {
          addGioMessage('Mapeamento concluído com sucesso!');
          transitionToStep('FINISHED');
        } else {
          const newMemberId = `m_${Date.now()}`;
          setCurrentMember({
            id: newMemberId,
            name: answerText,
            functions: [],
            isClinicalDelegate: false,
            clinicalSchedule: { type: 'fixa', days: 3, hoursGrid: 12, estimatedWeeklyHours: 12 },
            nonClinicalActivities: [],
            monthlyCost: 0,
            sourceAxis: 'team',
          });
          setTempFunctionsSelected([]);
          addGioMessage(`O que a/o ${answerText} faz?`);
          transitionToStep('E6_MEMBER_FUNCTIONS_SELECT');
        }
        break;
      }

      case 'E6_HAS_TEAM': {
        if (answerText === 'Trabalho sozinho' || answerText === 'Sozinho' || answerText === 'Não') {
          addGioMessage('Mapeamento concluído com sucesso!');
          transitionToStep('FINISHED');
        } else {
          addGioMessage('Quem trabalha com você na clínica?');
          transitionToStep('E6_MEMBER_NAME');
        }
        break;
      }

      case 'E6_MEMBER_NAME': {
        const name = answerText;
        const exists = teamMembers.find((m) => m.name.toLowerCase() === name.toLowerCase());
        const preFunctions = exists?.functions && exists.functions.length > 0 ? exists.functions : (exists?.sourceAxis === 'sales' ? ['vendas'] : []);

        setCurrentMember({
          id: exists?.id || `m_${Date.now()}`,
          name: name,
          functions: preFunctions,
          isClinicalDelegate: preFunctions.includes('atende_pacientes'),
          clinicalSchedule: { type: 'fixa', days: 3, hoursGrid: 12, estimatedWeeklyHours: 12 },
          nonClinicalActivities: [],
          monthlyCost: exists?.monthlyCost || 0,
          sourceAxis: exists?.sourceAxis || 'team',
        });
        setTempFunctionsSelected(preFunctions);
        addGioMessage(`O que a/o ${name} faz?`);
        transitionToStep('E6_MEMBER_FUNCTIONS_SELECT');
        break;
      }

      case 'E6_MEMBER_FUNCTIONS_SELECT': {
        const funcs = tempFunctionsSelected.length > 0 ? tempFunctionsSelected : (answerText ? [answerText] : ['recepcao']);
        setCurrentMember((prev) => ({
          ...prev,
          functions: funcs,
          isClinicalDelegate: funcs.includes('atende_pacientes'),
        }));
        const summary = funcs.map((f) => FUNCTION_LABEL_MAP[f] || f).join(', ');
        addGioMessage(`Entendi — então ${currentMember.name || 'essa pessoa'} faz: ${summary}. Confere?`);
        transitionToStep('E6_MEMBER_FUNCTIONS_CONFIRM');
        break;
      }

      case 'E6_MEMBER_FUNCTIONS_CONFIRM': {
        if (answerText === 'Quero ajustar' || answerText === 'Não') {
          addGioMessage(`Ajustando as funções de ${currentMember.name}. O que essa pessoa faz?`);
          transitionToStep('E6_MEMBER_FUNCTIONS_SELECT');
        } else {
          if (currentMember.functions.includes('atende_pacientes')) {
            addGioMessage(`Na parte clínica (atendimento a pacientes), a rotina de ${currentMember.name} é fixa (dias e horas) ou por demanda?`);
            transitionToStep('E6_CLINICAL_SCHEDULE_TYPE');
          } else {
            const nonClin = currentMember.functions.filter((f) => f !== 'atende_pacientes');
            if (nonClin.length > 0) {
              setCurrentNonClinicalIndex(0);
              const firstFn = nonClin[0];
              const firstLabel = FUNCTION_LABEL_MAP[firstFn] || firstFn;
              addGioMessage(`Sobre ${firstLabel}: ela(e) tem uma rotina fixa de dias e horários, ou isso varia?`);
              transitionToStep('E6_NON_CLINICAL_SCHEDULE_TYPE');
            } else {
              addGioMessage(`Tem mais alguma atividade que a/o ${currentMember.name} faz, que eu não perguntei?`);
              transitionToStep('E6_MEMBER_EXTRA_ACTIVITY_CHECK');
            }
          }
        }
        break;
      }

      case 'E6_CLINICAL_SCHEDULE_TYPE': {
        if (answerText === 'Rotina fixa' || answerText === 'Fixa') {
          addGioMessage(`Quantos dias por semana a/o ${currentMember.name} atende pacientes?`);
          transitionToStep('E6_CLINICAL_FIXED_DAYS');
        } else {
          addGioMessage(`Mais ou menos quantas horas por semana ela(e) dedica ao atendimento clínico?`);
          transitionToStep('E6_CLINICAL_DEMAND_HOURS');
        }
        break;
      }

      case 'E6_CLINICAL_FIXED_DAYS': {
        const days = parseInt(answerText) || 3;
        setTempClinicalDays(days);
        addGioMessage(`Quantas horas por dia ela(e) atende nesses ${days} dias, mais ou menos?`);
        transitionToStep('E6_CLINICAL_FIXED_HOURS_PER_DAY');
        break;
      }

      case 'E6_CLINICAL_FIXED_HOURS_PER_DAY': {
        const hrsPerDay = parseInt(answerText) || 4;
        const totalHrs = tempClinicalDays * hrsPerDay;
        setCurrentMember((prev) => ({
          ...prev,
          weeklyClinicalHours: totalHrs,
          clinicalSchedule: { type: 'fixa', days: tempClinicalDays, hoursGrid: totalHrs, estimatedWeeklyHours: totalHrs },
        }));

        const nonClin = currentMember.functions.filter((f) => f !== 'atende_pacientes');
        if (nonClin.length > 0) {
          setCurrentNonClinicalIndex(0);
          const firstFn = nonClin[0];
          const firstLabel = FUNCTION_LABEL_MAP[firstFn] || firstFn;
          addGioMessage(`Sobre ${firstLabel}: ela(e) tem uma rotina fixa de dias e horários, ou isso varia?`);
          transitionToStep('E6_NON_CLINICAL_SCHEDULE_TYPE');
        } else {
          addGioMessage(`Tem mais alguma atividade que a/o ${currentMember.name} faz, que eu não perguntei?`);
          transitionToStep('E6_MEMBER_EXTRA_ACTIVITY_CHECK');
        }
        break;
      }

      case 'E6_CLINICAL_DEMAND_HOURS': {
        const estHrs = parseInt(answerText) || 10;
        setCurrentMember((prev) => ({
          ...prev,
          weeklyClinicalHours: estHrs,
          clinicalSchedule: { type: 'demanda', estimatedWeeklyHours: estHrs },
        }));

        const nonClin = currentMember.functions.filter((f) => f !== 'atende_pacientes');
        if (nonClin.length > 0) {
          setCurrentNonClinicalIndex(0);
          const firstFn = nonClin[0];
          const firstLabel = FUNCTION_LABEL_MAP[firstFn] || firstFn;
          addGioMessage(`Sobre ${firstLabel}: ela(e) tem uma rotina fixa de dias e horários, ou isso varia?`);
          transitionToStep('E6_NON_CLINICAL_SCHEDULE_TYPE');
        } else {
          addGioMessage(`Tem mais alguma atividade que a/o ${currentMember.name} faz, que eu não perguntei?`);
          transitionToStep('E6_MEMBER_EXTRA_ACTIVITY_CHECK');
        }
        break;
      }

      case 'E6_NON_CLINICAL_SCHEDULE_TYPE': {
        const nonClin = currentMember.functions.filter((f) => f !== 'atende_pacientes');
        const currFn = nonClin[currentNonClinicalIndex] || 'outro';
        const currLabel = FUNCTION_LABEL_MAP[currFn] || currFn;

        if (answerText === 'Rotina fixa' || answerText === 'Fixa') {
          addGioMessage(`Sobre ${currLabel}: quantos dias por semana ela(e) se dedica a isso?`);
          transitionToStep('E6_NON_CLINICAL_FIXED_DAYS');
        } else {
          addGioMessage(`Sobre ${currLabel}: quantas vezes por semana, mais ou menos?`);
          transitionToStep('E6_NON_CLINICAL_VARIES_TIMES');
        }
        break;
      }

      case 'E6_NON_CLINICAL_FIXED_DAYS': {
        const days = parseInt(answerText) || 5;
        setTempClinicalDays(days);
        const nonClin = currentMember.functions.filter((f) => f !== 'atende_pacientes');
        const currFn = nonClin[currentNonClinicalIndex] || 'outro';
        const currLabel = FUNCTION_LABEL_MAP[currFn] || currFn;

        addGioMessage(`E quanto tempo por dia, mais ou menos, ela(e) dedica a ${currLabel}? (em horas)`);
        transitionToStep('E6_NON_CLINICAL_FIXED_HOURS');
        break;
      }

      case 'E6_NON_CLINICAL_FIXED_HOURS': {
        const hrs = parseInt(answerText) || 2;
        const nonClin = currentMember.functions.filter((f) => f !== 'atende_pacientes');
        const currFn = nonClin[currentNonClinicalIndex] || 'outro';
        const currLabel = FUNCTION_LABEL_MAP[currFn] || currFn;

        const newAct = {
          functionName: currLabel,
          scheduleType: 'fixa' as const,
          daysPerWeek: tempClinicalDays,
          hoursPerDay: hrs,
        };

        setCurrentMember((prev) => ({
          ...prev,
          nonClinicalActivities: [...prev.nonClinicalActivities.filter((a) => a.functionName !== currLabel), newAct],
        }));

        const nextIdx = currentNonClinicalIndex + 1;
        if (nextIdx < nonClin.length) {
          setCurrentNonClinicalIndex(nextIdx);
          const nextFn = nonClin[nextIdx];
          const nextLabel = FUNCTION_LABEL_MAP[nextFn] || nextFn;
          addGioMessage(`Sobre ${nextLabel}: ela(e) tem uma rotina fixa de dias e horários, ou isso varia?`);
          transitionToStep('E6_NON_CLINICAL_SCHEDULE_TYPE');
        } else {
          addGioMessage(`Tem mais alguma atividade que a/o ${currentMember.name} faz, que eu não perguntei?`);
          transitionToStep('E6_MEMBER_EXTRA_ACTIVITY_CHECK');
        }
        break;
      }

      case 'E6_NON_CLINICAL_VARIES_TIMES': {
        const times = parseInt(answerText) || 3;
        setTempClinicalDays(times);
        const nonClin = currentMember.functions.filter((f) => f !== 'atende_pacientes');
        const currFn = nonClin[currentNonClinicalIndex] || 'outro';
        const currLabel = FUNCTION_LABEL_MAP[currFn] || currFn;

        addGioMessage(`Quanto tempo cada vez que ela(e) faz ${currLabel}? (em minutos)`);
        transitionToStep('E6_NON_CLINICAL_VARIES_MINUTES');
        break;
      }

      case 'E6_NON_CLINICAL_VARIES_MINUTES': {
        const mins = parseInt(answerText) || 45;
        const nonClin = currentMember.functions.filter((f) => f !== 'atende_pacientes');
        const currFn = nonClin[currentNonClinicalIndex] || 'outro';
        const currLabel = FUNCTION_LABEL_MAP[currFn] || currFn;

        const newAct = {
          functionName: currLabel,
          scheduleType: 'demanda' as const,
          timesPerWeek: tempClinicalDays,
          minutesEach: mins,
        };

        setCurrentMember((prev) => ({
          ...prev,
          nonClinicalActivities: [...prev.nonClinicalActivities.filter((a) => a.functionName !== currLabel), newAct],
        }));

        const nextIdx = currentNonClinicalIndex + 1;
        if (nextIdx < nonClin.length) {
          setCurrentNonClinicalIndex(nextIdx);
          const nextFn = nonClin[nextIdx];
          const nextLabel = FUNCTION_LABEL_MAP[nextFn] || nextFn;
          addGioMessage(`Sobre ${nextLabel}: ela(e) tem uma rotina fixa de dias e horários, ou isso varia?`);
          transitionToStep('E6_NON_CLINICAL_SCHEDULE_TYPE');
        } else {
          addGioMessage(`Tem mais alguma atividade que a/o ${currentMember.name} faz, que eu não perguntei?`);
          transitionToStep('E6_MEMBER_EXTRA_ACTIVITY_CHECK');
        }
        break;
      }

      case 'E6_MEMBER_EXTRA_ACTIVITY_CHECK': {
        if (answerText === 'Sim') {
          addGioMessage(`Qual o nome dessa outra atividade exercida por ${currentMember.name}?`);
          transitionToStep('E6_MEMBER_EXTRA_ACTIVITY_NAME');
        } else {
          addGioMessage(`E quanto você paga pra/pro ${currentMember.name}, mais ou menos, por mês? (R$)`);
          transitionToStep('E6_MEMBER_COST_CHECK');
        }
        break;
      }

      case 'E6_MEMBER_EXTRA_ACTIVITY_NAME': {
        const actName = answerText;
        setCurrentMember((prev) => ({
          ...prev,
          functions: [...prev.functions, actName],
        }));
        addGioMessage(`Sobre ${actName}: ela(e) tem uma rotina fixa de dias e horários, ou isso varia?`);
        const nonClin = [...currentMember.functions.filter((f) => f !== 'atende_pacientes'), actName];
        setCurrentNonClinicalIndex(nonClin.length - 1);
        transitionToStep('E6_NON_CLINICAL_SCHEDULE_TYPE');
        break;
      }

      case 'E6_MEMBER_COST_CHECK': {
        const cost = parseInt(answerText.replace(/\D/g, '')) || 0;
        const roleSummary = currentMember.functions.map((f) => FUNCTION_LABEL_MAP[f] || f).join(', ') || currentMember.role || 'Membro de Equipe';

        const updatedMember: A3HumanResource = {
          id: currentMember.id || `m_${Date.now()}`,
          name: currentMember.name,
          role: roleSummary,
          functions: currentMember.functions as any,
          isClinicalDelegate: currentMember.functions.includes('atende_pacientes'),
          clinicalSchedule: currentMember.clinicalSchedule,
          nonClinicalActivities: currentMember.nonClinicalActivities,
          monthlyCost: cost,
          sourceAxis: currentMember.sourceAxis || 'team',
          weeklyClinicalHours: currentMember.weeklyClinicalHours || currentMember.clinicalSchedule?.estimatedWeeklyHours || currentMember.clinicalSchedule?.hoursGrid || 0,
        };

        setTeamMembers((prev) => {
          const idx = prev.findIndex((m) => m.id === updatedMember.id || m.name.toLowerCase() === updatedMember.name.toLowerCase());
          if (idx >= 0) {
            const arr = [...prev];
            arr[idx] = updatedMember;
            return arr;
          }
          return [...prev, updatedMember];
        });

        addGioMessage('Tem mais alguém trabalhando com você?');
        transitionToStep('E6_MORE_MEMBERS_CHECK');
        break;
      }

      case 'E6_MORE_MEMBERS_CHECK': {
        if (answerText === 'Sim') {
          setCurrentMember({
            id: `m_${Date.now()}`,
            name: '',
            role: '',
            functions: [],
            isClinicalDelegate: false,
            clinicalSchedule: { type: 'fixa', days: 3, hoursGrid: 12, estimatedWeeklyHours: 12 },
            nonClinicalActivities: [],
            monthlyCost: 0,
            sourceAxis: 'team',
          });
          setTempFunctionsSelected([]);
          addGioMessage('Quem é a outra pessoa que trabalha com você? Digite o nome:');
          transitionToStep('E6_MEMBER_NAME');
        } else {
          addGioMessage('Mapeamento concluído com sucesso!');
          transitionToStep('FINISHED');
        }
        break;
      }

      default:
        break;
    }
  };

  // Helper to Advance Channel Loop
  const advanceToNextChannelOrMkt = (nextIdx: number) => {
    if (nextIdx < selectedChannels.length) {
      setCurrentChannelIndex(nextIdx);
      const nextChan = selectedChannels[nextIdx];
      setCurrentChannelData({ name: nextChan, isContentChannel: ['Instagram', 'TikTok', 'YouTube', 'blog'].includes(nextChan) });
      addGioMessage(`Perfeito. Vamos para o próximo canal.\n\n${nextChan}: quando alguém chega até você por aí, geralmente é a pessoa que te procura, ou é você que costuma buscar?`);
      transitionToStep('E2_CHANNEL_DIRECTION', { currentChannelIndex: nextIdx });
    } else {
      addGioMessage('Terminamos os canais de aquisição.\n\nQuantas vezes por semana, mais ou menos, você dedica tempo a produzir conteúdo ou fazer marketing?');
      transitionToStep('E2_MKT_TIMES_PER_WEEK');
    }
  };

  // BUILD COMPLETE A3 INVESTIGATION DATA OBJECT (NAMESPACED & CONSOLIDATED INTO 6 AXES)
  const buildFinalInvestigationData = (): A3InvestigationData => {
    const cleanTeamMembers = deduplicateTeamMembers(teamMembers);
    const toolsCostTotal = financial.tools.reduce((acc, t) => acc + t.monthlyCost, 0);
    const teamCostTotal = cleanTeamMembers.reduce((acc, m) => acc + m.monthlyCost, 0);
    const rentCost = financial.hasRent ? financial.rent : 0;
    const accountantCost = financial.hasAccountant ? financial.accountant : 0;
    const otherRevTotal = otherRevenues.reduce((acc, r) => acc + r.monthlyCost, 0);

    const totalCosts = rentCost + toolsCostTotal + accountantCost + teamCostTotal + financial.aiToolsCost + financial.crnFee + financial.paidAdsCost + financial.unanticipatedCostVal;

    const avgRev = Math.round((financial.revenueM1 + financial.revenueM2 + financial.revenueM3) / 3) + otherRevTotal || calculatedMetrics.totalEstMonthlyRevenue;
    const breakEvenDiff = avgRev - totalCosts;

    const delegatedClinicalWeeklyHours = cleanTeamMembers
      .filter((m) => m.isClinicalDelegate)
      .reduce((acc, m) => acc + (m.weeklyClinicalHours || 0), 0);

    const savedState: A3SavedNodeState = {
      lastNodeId: currentStep,
      nextNodeId: currentStep,
      currentChannelIndex,
      currentTeamMemberIndex: currentMemberIndex,
      timestamp: new Date().toISOString(),
    };

    return {
      // 1. Promessa
      valueProposition: valueProp,
      // 2. Marketing & Captação
      acquisition: {
        channels: acqChannels,
        marketingTime: mktTime,
        branding,
      },
      // 3. Vendas
      sales,
      // 4. Entrega de Valor
      delivery,
      // 5. Financeiro
      financial: {
        monthlyRevenue: avgRev,
        revenue3mConfidence: financial.revenue3mConfidence,
        revenueM1: financial.revenueM1,
        revenueM2: financial.revenueM2,
        revenueM3: financial.revenueM3,
        otherRevenues,
        legalStructure: financial.legalStructure,
        financesSeparation: financial.financesSeparation,
        proLaboreType: financial.proLaboreType,
        budgetPlanning: financial.budgetPlanning,
        paymentDelayLevel: financial.paymentDelayLevel,
        breakEvenCalculated: {
          totalMonthlyCosts: totalCosts,
          difference: breakEvenDiff,
          isAboveBreakEven: breakEvenDiff >= 0,
        },
        reportedGrossMonthlyRevenue: avgRev,
        costs: [
          { id: 'c_rent', name: 'Aluguel', hasCost: rentCost > 0, monthlyAmount: rentCost },
          { id: 'c_tools', name: 'Ferramentas e Softwares', hasCost: toolsCostTotal > 0, monthlyAmount: toolsCostTotal },
          { id: 'c_ai', name: 'Ferramentas de IA', hasCost: financial.aiToolsCost > 0, monthlyAmount: financial.aiToolsCost },
          { id: 'c_crn', name: 'Anuidade Conselho', hasCost: financial.crnFee > 0, monthlyAmount: financial.crnFee },
          { id: 'c_ads', name: 'Anúncios / Tráfego', hasCost: financial.paidAdsCost > 0, monthlyAmount: financial.paidAdsCost },
          { id: 'c_accountant', name: 'Contador', hasCost: accountantCost > 0, monthlyAmount: accountantCost },
          { id: 'c_team', name: 'Equipe', hasCost: teamCostTotal > 0, monthlyAmount: teamCostTotal },
        ],
        totalMonthlyCosts: totalCosts,
        breakEvenDifference: breakEvenDiff,
        isAboveBreakEven: breakEvenDiff >= 0,
      },
      // 6. Equipe
      team: {
        hasTeam: cleanTeamMembers.length > 0,
        members: cleanTeamMembers.map((m) => ({
          ...m,
          role: m.role || (m.functions ? m.functions.map((f) => FUNCTION_LABEL_MAP[f] || f).join(', ') : 'Membro'),
          monthlySalaryOrCost: m.monthlyCost,
        })),
        totalDelegatedClinicalWeeklyHours: delegatedClinicalWeeklyHours,
        totalTeamMonthlyCost: teamCostTotal,
      },
      // Consolidação de Processos, Ferramentas & Jurídico
      processes: {
        hasSalesScript: sales.usesScript,
        hasStandardContract: delivery.hasStandardContract,
        hasWelcomeProcess: delivery.hasWelcomeProcess,
        hasOffboardingProcess: delivery.hasOffboardingProcess,
      },
      tools: {
        selected: [delivery.electronicHealthRecord, sales.systemName, ...financial.tools.map((t) => t.name)].filter(Boolean),
        other: branding.schedulingTool,
      },
      compliance: {
        hasConsentForm: delivery.hasConsentForm,
        hasCancellationPolicy: financial.hasCancellationPolicy,
      },
      savedNodeState: savedState,
      isCompleted: true,
      updatedAt: new Date().toISOString(),
    };
  };

  // Complete Step & Proceed
  const handleFinishAndProceed = () => {
    const finalInvData = buildFinalInvestigationData();

    const finalOtherActivitiesData: A3OtherActivitiesData = {
      allocations: [
        {
          id: 'act_mkt',
          category: 'Marketing & Captação',
          allocatedWeeklyHours: mktTime.totalWeeklyHours,
          timesPerWeek: mktTime.timesPerWeek,
          minutesPerTime: mktTime.minutesEach,
        },
      ],
      totalAllocatedWeeklyHours: mktTime.totalWeeklyHours,
      remainingWeeklyHours,
      investigation: finalInvData,
      isCompleted: true,
      updatedAt: new Date().toISOString(),
    };

    onSaveActivities?.(finalOtherActivitiesData);
    onToast?.('Investigação do negócio concluída! Avançando para a Consolidação...');
    onCompleteStep();
  };

  const getStepAxisLabel = (step: StepKey): string => {
    if (step.startsWith('E1_')) return 'Eixo 1 — Promessa';
    if (step.startsWith('E2_')) return 'Eixo 2 — Marketing';
    if (step.startsWith('E3_')) return 'Eixo 3 — Vendas';
    if (step.startsWith('E4_')) return 'Eixo 4 — Entrega de Valor';
    if (step.startsWith('E5_')) return 'Eixo 5 — Financeiro';
    if (step.startsWith('E6_')) return 'Eixo 6 — Equipe';
    if (step === 'FINISHED') return 'Concluído';
    return 'Geral';
  };

  const customStepsList: StepKey[] = [
    // EIXO 1
    'E1_PROMISE_STATEMENT', 'E1_PROMISE_TYPE', 'E1_DIFFERENTIATOR', 'E1_DIFFERENTIATOR_SOURCE', 'E1_UNIQUE_APPROACH', 'E1_PROMISE_FULFILLMENT',
    // EIXO 2
    'E2_CHANNELS_SELECT', 'E2_CHANNEL_DIRECTION', 'E2_CHANNEL_VOL90_BIFURCATION', 'E2_CHANNEL_VOL90_NUM', 'E2_CHANNEL_CONTENT_ORIGIN_BIFURCATION', 'E2_CHANNEL_CONTENT_ORIGIN_NUM', 'E2_CHANNEL_CLOSED_BIFURCATION', 'E2_CHANNEL_CLOSED_NUM', 'E2_CHANNEL_AUDIENCE_BIFURCATION', 'E2_CHANNEL_AUDIENCE_TEXT', 'E2_MKT_TIMES_PER_WEEK', 'E2_MKT_MINUTES_EACH', 'E2_BRANDING_IDENTITY', 'E2_BRANDING_PROFESSIONAL', 'E2_BRANDING_COMMUNICATION', 'E2_BRANDING_FEEDBACK', 'E2_BRANDING_FEEDBACK_TEXT', 'E2_SCHEDULING_TOOL', 'E2_SCHEDULING_TOOL_NAME',
    // EIXO 3
    'E3_SALES_SCRIPT', 'E3_CLOSING_FORMAT', 'E3_SALES_EFFECTIVENESS_BIFURCATION', 'E3_SALES_EFFECTIVENESS_FORMAT', 'E3_ORGANIZING_SYSTEM', 'E3_SYSTEM_NAME', 'E3_WHO_CLOSES', 'E3_WHO_CLOSES_NAME', 'E3_FOLLOW_UP', 'E3_FOLLOW_UP_TIME_BIFURCATION', 'E3_FOLLOW_UP_TIME_NUM', 'E3_FOLLOW_UP_ATTEMPTS_BIFURCATION', 'E3_FOLLOW_UP_ATTEMPTS_NUM', 'E3_TIME_TO_CLOSE_BIFURCATION', 'E3_TIME_TO_CLOSE_TEXT', 'E3_NON_CLOSING_REASONS',
    // EIXO 4
    'E4_EHR_TOOL', 'E4_EHR_TOOL_CUSTOM', 'E4_STANDARD_CONTRACT', 'E4_WELCOME_PROCESS', 'E4_OFFBOARDING_PROCESS', 'E4_CONSENT_FORM', 'E4_RENEWAL_90D_BIFURCATION', 'E4_RENEWAL_90D_NUM',
    // EIXO 5
    'E5_REVENUE_3M_BIFURCATION', 'E5_REVENUE_M1_NUM', 'E5_REVENUE_M2_NUM', 'E5_REVENUE_M3_NUM', 'E5_OTHER_REVENUE_CHECK', 'E5_OTHER_REVENUE_NAME', 'E5_OTHER_REVENUE_VAL', 'E5_LEGAL_STRUCTURE', 'E5_FINANCIAL_SEPARATION', 'E5_PRO_LABORE_TYPE', 'E5_BUDGET_PLANNING', 'E5_RENT', 'E5_RENT_AMOUNT', 'E5_TOOL_KNOWN_COST', 'E5_MORE_TOOLS_CHECK', 'E5_NEW_TOOL_NAME', 'E5_NEW_TOOL_COST', 'E5_TOOLS_CHECK', 'E5_TOOL_ITEM_NAME', 'E5_TOOL_ITEM_COST', 'E5_TOOL_MORE', 'E5_AI_TOOLS', 'E5_AI_TOOLS_COST', 'E5_CRN_FEE', 'E5_PAID_ADS', 'E5_ACCOUNTANT', 'E5_ACCOUNTANT_COST', 'E5_UNANTICIPATED_COSTS_CHECK', 'E5_UNANTICIPATED_COSTS_TEXT', 'E5_UNANTICIPATED_COSTS_VAL', 'E5_PAYMENT_DELAYS', 'E5_CANCELLATION_POLICY', 'E5_FINANCIAL_SOFTWARE', 'E5_FINANCIAL_SOFTWARE_CHECK', 'E5_FINANCIAL_SOFTWARE_NAME', 'E5_FINANCIAL_SOFTWARE_COST_CHECK', 'E5_FINANCIAL_SOFTWARE_COST_VAL',
    // EIXO 6
    'E6_CHECK_TEAM_DRAFT', 'E6_HAS_TEAM', 'E6_MEMBER_NAME', 'E6_MEMBER_ROLE', 'E6_MEMBER_FUNCTIONS_SELECT', 'E6_MEMBER_FUNCTIONS_CONFIRM', 'E6_CLINICAL_SCHEDULE_TYPE', 'E6_CLINICAL_FIXED_DAYS', 'E6_CLINICAL_FIXED_HOURS_PER_DAY', 'E6_CLINICAL_DEMAND_HOURS', 'E6_NON_CLINICAL_SCHEDULE_TYPE', 'E6_NON_CLINICAL_FIXED_DAYS', 'E6_NON_CLINICAL_FIXED_HOURS', 'E6_NON_CLINICAL_VARIES_TIMES', 'E6_NON_CLINICAL_VARIES_MINUTES', 'E6_MEMBER_EXTRA_ACTIVITY_CHECK', 'E6_MEMBER_EXTRA_ACTIVITY_NAME', 'E6_MEMBER_COST_CHECK', 'E6_MORE_MEMBERS_CHECK'
  ];
  const isCustomStep = customStepsList.includes(currentStep);

  // Step metadata helper
  const meta = useMemo(() => {
    const step = currentStep;
    if (step.startsWith('E1_')) {
      return {
        axisNum: 1,
        axisTag: 'EIXO 01 — PROMESSA & VALOR',
        axisTitle: 'Proposta de Valor e Diferenciais',
        axisSubtitle: 'Clareza sobre o posicionamento e diferenciação do consultório',
        context: 'A promessa de valor é o pilar que sustenta o desejo do paciente de contratar seu acompanhamento em vez de procurar a concorrência.',
        helperNote: 'Defina a mensagem central utilizada para atrair e converter pacientes.',
        remaining: 5,
        prevAxisLabel: 'Passo 03: Agenda',
      };
    }
    if (step.startsWith('E2_')) {
      return {
        axisNum: 2,
        axisTag: 'EIXO 02 — MARKETING & CAPTAÇÃO',
        axisTitle: 'Canais de Captação & Conteúdo',
        axisSubtitle: 'Como os pacientes descobrem sua clínica e sua rotina de marketing',
        context: 'Mapear de onde vêm os pacientes e o tempo investido em produção nos permite calcular a taxa de conversão e custo de oportunidade do marketing.',
        helperNote: 'Identifique a origem do fluxo de pacientes e sua frequência de comunicação.',
        remaining: 7,
        prevAxisLabel: 'Promessa (Eixo 01)',
      };
    }
    if (step.startsWith('E3_')) {
      return {
        axisNum: 3,
        axisTag: 'EIXO 03 — VENDAS & COMERCIAL',
        axisTitle: 'Estrutura Comercial & Fechamento',
        axisSubtitle: 'Roteiros, tempo de resposta, follow-up e taxa de fechamento',
        context: 'Mapear a jornada comercial desde o primeiro contato até o fechamento nos ajuda a localizar gargalos de receita e oportunidades de otimização.',
        helperNote: 'Mapeie o fluxo operacional de atendimento a potenciais pacientes.',
        remaining: 8,
        prevAxisLabel: 'Marketing (Eixo 02)',
      };
    }
    if (step.startsWith('E4_')) {
      return {
        axisNum: 4,
        axisTag: 'EIXO 04 — ENTREGA DE VALOR',
        axisTitle: 'Processos Clínicos & Fidelização',
        axisSubtitle: 'Prontuário, termos, onboarding, retenção e renovações',
        context: 'A experiência de entrega e o pós-atendimento garantem o LTV e sustentabilidade da clínica via renovações e indicações.',
        helperNote: 'Avalie as ferramentas e processos de suporte ao atendimento prestado.',
        remaining: 6,
        prevAxisLabel: 'Comercial (Eixo 03)',
      };
    }
    if (step.startsWith('E5_')) {
      return {
        axisNum: 5,
        axisTag: 'EIXO 05 — FINANCEIRO & CUSTOS',
        axisTitle: 'Análise Financeira',
        axisSubtitle: 'Faturamento, separação de custos e despesas fixas',
        context: 'Para entender a estrutura financeira da sua clínica, preciso mapear todos os custos fixos e ferramentas utilizadas. Isso nos permitirá calcular sua margem real e sustentabilidade.',
        helperNote: 'Estou buscando o valor médio mensal para incluir no cálculo dos custos fixos.',
        remaining: 9,
        prevAxisLabel: 'Entrega (Eixo 04)',
      };
    }
    return {
      axisNum: 6,
      axisTag: 'EIXO 06 — EQUIPE & PESSOAS',
      axisTitle: 'Estrutura de Equipe e Colaboradores',
      axisSubtitle: 'Membros, funções, delegação e custos de pessoal',
      context: 'Mapear a equipe e as funções delegadas nos mostra quem operacionaliza a clínica e onde estão localizados os custos com pessoas.',
      helperNote: 'Identifique colaboradores, terceirizados e secretárias que atuam no negócio.',
      remaining: 4,
      prevAxisLabel: 'Financeiro (Eixo 05)',
    };
  }, [currentStep]);

  if (investigationMode === 'form') {
    return (
      <InvestigationFormView
        valueProp={valueProp}
        setValueProp={setValueProp}
        selectedChannels={selectedChannels}
        setSelectedChannels={setSelectedChannels}
        acqChannels={acqChannels}
        setAcqChannels={setAcqChannels}
        mktTime={mktTime}
        setMktTime={setMktTime}
        branding={branding}
        setBranding={setBranding}
        sales={sales}
        setSales={setSales}
        delivery={delivery}
        setDelivery={setDelivery}
        financial={financial}
        setFinancial={setFinancial}
        otherRevenues={otherRevenues}
        setOtherRevenues={setOtherRevenues}
        teamMembers={teamMembers}
        setTeamMembers={setTeamMembers}
        monthLabels={monthLabels}
        activeSection={activeFormSection}
        setActiveSection={(sec) => {
          setActiveFormSection(sec);
          saveNodeState(currentStep, currentStep, { activeFormSection: sec });
        }}
        onSwitchToChat={() => {
          setInvestigationMode('chat');
          saveNodeState(currentStep, currentStep, { investigationMode: 'chat' });
        }}
        onFinish={handleFinishAndProceed}
      />
    );
  }

  const progressPercent = Math.min(100, Math.round(((meta.axisNum - 1) * 16.6) + 12));

  const handleQuickAction = (action: 'dont_know' | 'skip' | 'explain' | 'rephrase') => {
    if (action === 'dont_know') {
      handleUserAnswer('Não sei o valor exato / Estimativa');
    } else if (action === 'skip') {
      addGioMessage('Entendido, vamos avançar para o próximo ponto.');
      handleUserAnswer('Prefiro pular');
    } else if (action === 'explain') {
      addGioMessage(`💡 Explicação estratégica do Gio:\n${meta.context}`);
    } else if (action === 'rephrase') {
      addGioMessage(`↻ Reformulando: De forma bem prática, ${meta.helperNote.toLowerCase()}`);
    }
  };

  const handleNavigatePrevious = () => {
    if (meta.axisNum === 2) setCurrentStep('E1_PROMISE_STATEMENT');
    else if (meta.axisNum === 3) setCurrentStep('E2_CHANNELS_SELECT');
    else if (meta.axisNum === 4) setCurrentStep('E3_SALES_SCRIPT');
    else if (meta.axisNum === 5) setCurrentStep('E4_EHR_TOOL');
    else if (meta.axisNum === 6) setCurrentStep('E5_REVENUE_M1_NUM');
    else onNavigateBack?.();
  };

  return (
    <div className="bg-neutral-50 min-h-screen text-neutral-900 font-body -m-4 sm:-m-6 pb-12 animate-fadeIn">
      {/* 1. TOP HEADER BRANDING & AXIS STEPPER */}
      <header className="bg-white border-b border-neutral-200 px-4 sm:px-6 py-3 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* ÊXODO LOGO + GIO BADGE */}
          <div className="flex items-center gap-3">
            <Logo variant="color" height={22} />
            <div className="h-6 w-px bg-neutral-200 hidden sm:block" />
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-emerald-900 border border-emerald-300 flex items-center justify-center text-emerald-200 shadow-2xs">
                  <Bot className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-title font-bold text-neutral-900">Gio • Consultor Estratégico</span>
                  <span className="bg-[#b91c1c] text-white text-[0.55rem] font-bold px-1.5 py-0.2 rounded uppercase">A3</span>
                </div>
                <span className="text-[0.62rem] text-neutral-500 block">Investigação do Modelo Atual da Clínica</span>
              </div>
            </div>
          </div>

          {/* 6 EIXOS STEPPER */}
          <div className="hidden lg:flex items-center gap-2 text-[0.62rem] font-subtitle font-bold uppercase tracking-wider">
            {[
              { num: 1, label: '01 PROMESSA & VALOR' },
              { num: 2, label: '02 MARKETING' },
              { num: 3, label: '03 COMERCIAL' },
              { num: 4, label: '04 ENTREGA' },
              { num: 5, label: '05 FINANCEIRO' },
              { num: 6, label: '06 EQUIPE' },
            ].map((axis) => {
              const isDone = meta.axisNum > axis.num;
              const isCurrent = meta.axisNum === axis.num;
              return (
                <div
                  key={axis.num}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full border transition-all ${
                    isDone
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : isCurrent
                      ? 'bg-emerald-700 border-emerald-800 text-white shadow-2xs'
                      : 'bg-neutral-100 border-neutral-200 text-neutral-400'
                  }`}
                >
                  {isDone ? (
                    <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-neutral-300" />
                  )}
                  <span>{axis.label}</span>
                </div>
              );
            })}
          </div>

          {/* RIGHT ACTIONS & PROGRESS */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setInvestigationMode('form');
                saveNodeState(currentStep, currentStep, { investigationMode: 'form' });
              }}
              className="hidden sm:flex items-center gap-1 text-[0.68rem] font-bold text-neutral-700 hover:text-neutral-900 border border-neutral-300 hover:bg-neutral-100 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-neutral-500" />
              <span>Ver Formulário</span>
            </button>

            <div className="bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-lg text-right">
              <div className="text-[0.58rem] uppercase text-neutral-400 font-bold">Investigação</div>
              <div className="text-xs font-bold text-neutral-900">{progressPercent}% concluída</div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateBack?.()}
              className="px-2.5 py-1.5 text-xs font-bold text-neutral-700 hover:text-neutral-900 border border-neutral-300 rounded-lg hover:bg-neutral-100 cursor-pointer flex items-center gap-1 transition-all"
            >
              <span className="hidden sm:inline">Sair</span>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>
      {/* 2. MAIN 3-COLUMN INVESTIGATION LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ========================================== */}
        {/* ÁREA 01: LINHA DE RACIOCÍNIO DO GIO (25% / 3 cols) */}
        {/* ========================================== */}
        <section className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-neutral-200">
            <h3 className="text-xs font-title font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
              <span>🧠</span>
              <span>Linha de Raciocínio do Gio</span>
            </h3>
            <span className="text-[0.62rem] font-mono font-bold text-neutral-400 bg-neutral-200/60 px-1.5 py-0.5 rounded">
              {messages.length} msgs
            </span>
          </div>

          <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-neutral-200">
            {/* PAST MILESTONE 1 */}
            <div className="relative pl-7 group">
              <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[0.55rem] font-bold shadow-2xs">
                ✓
              </div>
              <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-2xs space-y-1 hover:border-neutral-300 transition-all">
                <div className="flex items-center justify-between text-[0.65rem]">
                  <span className="font-bold text-neutral-900">Gio • Consultor</span>
                  <span className="text-neutral-400 font-mono">09:12</span>
                </div>
                <p className="text-[0.7rem] text-neutral-600 line-clamp-2 leading-snug">
                  "Para começarmos, qual é a promessa central que você faz aos seus pacientes?"
                </p>
                <div className="pt-1 flex items-center gap-1 text-[0.62rem] text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Promessa registrada</span>
                </div>
              </div>
            </div>

            {/* PAST MILESTONE 2 */}
            <div className="relative pl-7 group">
              <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[0.55rem] font-bold shadow-2xs">
                ✓
              </div>
              <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-2xs space-y-1 hover:border-neutral-300 transition-all">
                <div className="flex items-center justify-between text-[0.65rem]">
                  <span className="font-bold text-neutral-900">Gio • Consultor</span>
                  <span className="text-neutral-400 font-mono">09:18</span>
                </div>
                <p className="text-[0.7rem] text-neutral-600 line-clamp-2 leading-snug">
                  "Quais canais e processos comerciais você utiliza para atrair e converter?"
                </p>
                <div className="pt-1 flex items-center gap-1 text-[0.62rem] text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Canais & Comercial OK</span>
                </div>
              </div>
            </div>

            {/* CURRENT ACTIVE STEP MILESTONE */}
            <div className="relative pl-7">
              <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-[#b91c1c] border-2 border-white flex items-center justify-center text-white text-[0.55rem] font-bold shadow-2xs animate-pulse">
                ●
              </div>
              <div className="bg-red-50/50 border border-red-200 rounded-xl p-3 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between text-[0.65rem]">
                  <span className="font-bold text-[#b91c1c] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#b91c1c] animate-ping" />
                    Gio está investigando
                  </span>
                  <span className="text-[#b91c1c] font-mono font-bold">Agora</span>
                </div>
                <p className="text-[0.72rem] font-subtitle font-bold text-neutral-900 leading-snug">
                  "{meta.context}"
                </p>
                <div className="pt-0.5 flex items-center gap-1 text-[0.62rem] text-[#b91c1c] font-bold bg-white/80 border border-red-200 px-2 py-0.5 rounded-md">
                  <span>Pergunta atual • {meta.axisTag.split('—')[1]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CONVERSATION HISTORY ACCORDION BUTTON */}
          <button
            type="button"
            onClick={() => setShowStructuredDrawer(!showStructuredDrawer)}
            className="w-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 text-[0.68rem] font-subtitle font-bold py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-neutral-500" />
              <span>Ver histórico completo da conversa</span>
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>
        </section>
        {/* ========================================== */}
        {/* ÁREA 02: PERGUNTA ATUAL & RESPOSTA (50% / 6 cols) */}
        {/* ========================================== */}
        <section className="lg:col-span-6 space-y-5">
          {/* TOP TAGS & COUNTER */}
          <div className="flex items-center justify-between gap-2">
            <span className="bg-emerald-50 text-emerald-900 border border-emerald-300 text-[0.65rem] font-subtitle font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              {meta.axisTag}
            </span>
            <span className="text-[0.65rem] font-mono font-bold text-neutral-500 bg-neutral-200/70 border border-neutral-300/80 px-2.5 py-0.5 rounded-full">
              {meta.remaining} perguntas restantes
            </span>
          </div>

          {/* MAIN SECTION TITLE */}
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-title font-bold text-neutral-900 tracking-tight">
              {meta.axisTitle}
            </h2>
            <p className="text-xs text-neutral-500 font-subtitle">
              {meta.axisSubtitle}
            </p>
          </div>

          {/* CONTEXTO DA INVESTIGAÇÃO BOX */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 space-y-2 relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-title font-bold text-emerald-900 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-emerald-700 fill-emerald-200" />
              <span>Contexto da investigação</span>
            </div>
            <p className="text-xs text-emerald-950 font-body leading-relaxed">
              {meta.context}
            </p>
          </div>

          {/* PERGUNTA ATUAL SEPARATOR & HEADING */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-[0.65rem] font-subtitle font-bold text-[#b91c1c] uppercase tracking-widest">
                PERGUNTA ATUAL
              </span>
              <div className="h-px bg-red-200 flex-1" />
            </div>

            {/* BIG EDITORIAL QUESTION TEXT */}
            <h3 className="text-base sm:text-lg font-subtitle font-bold text-neutral-900 leading-snug">
              {messages.length > 0 ? messages[messages.length - 1].text : 'Qual é a informação desta etapa?'}
            </h3>

            {/* HELPER NOTE */}
            <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-2.5 flex items-start gap-2 text-[0.7rem] text-neutral-600">
              <Info className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
              <span>{meta.helperNote}</span>
            </div>
          </div>

          {/* SUA RESPOSTA CARD */}
          <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <span className="text-[0.68rem] font-title font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#b91c1c]" />
                SUA RESPOSTA
              </span>
              <span className="text-[0.62rem] text-neutral-400 italic">
                Responda com o dado mais próximo da realidade
              </span>
            </div>

            {/* DYNAMIC INPUT CONTROLS */}
            <div className="pt-1">
              {/* FREE TEXT OR NUMERIC INPUT STEP */}
              {['E1_PROMISE_STATEMENT', 'E1_DIFFERENTIATOR', 'E1_UNIQUE_APPROACH', 'E2_CHANNEL_VOL90_NUM', 'E2_CHANNEL_CONTENT_ORIGIN_NUM', 'E2_CHANNEL_CLOSED_NUM', 'E2_MKT_TIMES_PER_WEEK', 'E2_MKT_MINUTES_EACH', 'E2_CHANNEL_AUDIENCE_TEXT', 'E2_BRANDING_FEEDBACK_TEXT', 'E2_SCHEDULING_TOOL_NAME', 'E3_SYSTEM_NAME', 'E3_WHO_CLOSES_NAME', 'E3_FOLLOW_UP_TIME_NUM', 'E3_FOLLOW_UP_ATTEMPTS_NUM', 'E3_TIME_TO_CLOSE_TEXT', 'E4_EHR_TOOL_CUSTOM', 'E4_RENEWAL_90D_NUM', 'E5_REVENUE_M1_NUM', 'E5_REVENUE_M2_NUM', 'E5_REVENUE_M3_NUM', 'E5_OTHER_REVENUE_NAME', 'E5_OTHER_REVENUE_VAL', 'E5_RENT_AMOUNT', 'E5_TOOL_KNOWN_COST', 'E5_NEW_TOOL_COST', 'E5_TOOL_ITEM_NAME', 'E5_TOOL_ITEM_COST', 'E5_AI_TOOLS_COST', 'E5_CRN_FEE', 'E5_PAID_ADS', 'E5_ACCOUNTANT_COST', 'E5_UNANTICIPATED_COSTS_VAL', 'E5_FINANCIAL_SOFTWARE_COST_VAL', 'E6_MEMBER_NAME', 'E6_MEMBER_COST', 'E6_CLINICAL_FIXED_DAYS', 'E6_CLINICAL_FIXED_HOURS_PER_DAY', 'E6_NON_CLINICAL_FIXED_DAYS'].includes(currentStep) && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      {currentStep.includes('COST') || currentStep.includes('VAL') || currentStep.includes('REVENUE') || currentStep.includes('RENT') || currentStep.includes('FEE') || currentStep.includes('ADS') ? (
                        <span className="absolute left-3.5 top-2.5 text-xs font-bold text-neutral-400">R$</span>
                      ) : null}
                      <input
                        type="text"
                        value={userInputText}
                        onChange={(e) => setUserInputText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && userInputText.trim()) {
                            e.preventDefault();
                            handleUserAnswer(userInputText);
                          }
                        }}
                        placeholder="Digite sua resposta aqui..."
                        className={`w-full bg-neutral-50 border border-neutral-300 rounded-xl py-2.5 text-xs font-body focus:outline-none focus:border-emerald-600 focus:bg-white transition-all ${
                          currentStep.includes('COST') || currentStep.includes('VAL') || currentStep.includes('REVENUE') || currentStep.includes('RENT') || currentStep.includes('FEE') || currentStep.includes('ADS') ? 'pl-9 pr-3' : 'px-4'
                        }`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => userInputText.trim() && handleUserAnswer(userInputText)}
                      disabled={!userInputText.trim()}
                      className="bg-[#b91c1c] hover:bg-red-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      <span>Enviar</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* SELECTION BUTTONS STEP */}
              {['E1_PROMISE_TYPE', 'E1_DIFFERENTIATOR_SOURCE', 'E1_PROMISE_FULFILLMENT', 'E2_CHANNEL_DIRECTION', 'E2_CHANNEL_AUDIENCE_BIFURCATION', 'E2_CHANNEL_VOL90_BIFURCATION', 'E2_CHANNEL_CONTENT_ORIGIN_BIFURCATION', 'E2_CHANNEL_CLOSED_BIFURCATION', 'E3_FOLLOW_UP_TIME_BIFURCATION', 'E3_FOLLOW_UP_ATTEMPTS_BIFURCATION', 'E3_TIME_TO_CLOSE_BIFURCATION', 'E4_RENEWAL_90D_BIFURCATION', 'E5_REVENUE_3M_BIFURCATION'].includes(currentStep) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {['Sim / Sei descrever', 'Tenho ideia aproximada', 'Não sei ao certo'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleUserAnswer(opt)}
                      className="w-full bg-neutral-50 hover:bg-emerald-50 hover:border-emerald-300 text-neutral-800 border border-neutral-200 text-xs font-subtitle font-bold p-3 rounded-xl cursor-pointer transition-all text-left flex items-center justify-between group"
                    >
                      <span>{opt}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-700" />
                    </button>
                  ))}
                </div>
              )}

              {/* CHANNELS SELECTION STEP */}
              {currentStep === 'E2_CHANNELS_SELECT' && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {['Instagram', 'Indicação', 'Google', 'Parcerias', 'Tráfego pago', 'Presencial'].map((chan) => {
                      const isSel = tempSelectedChannels.includes(chan);
                      return (
                        <button
                          key={chan}
                          type="button"
                          onClick={() => {
                            if (isSel) {
                              setTempSelectedChannels(tempSelectedChannels.filter((c) => c !== chan));
                            } else {
                              setTempSelectedChannels([...tempSelectedChannels, chan]);
                            }
                          }}
                          className={`text-xs font-subtitle font-bold px-3 py-2 rounded-xl cursor-pointer transition-all border ${
                            isSel
                              ? 'bg-emerald-700 text-white border-emerald-800 shadow-2xs'
                              : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:bg-neutral-100'
                          }`}
                        >
                          {isSel ? '✓ ' : '+ '}{chan}
                        </button>
                      );
                    })}
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      if (tempSelectedChannels.length === 0) return;
                      setSelectedChannels(tempSelectedChannels);
                      handleUserAnswer(`Canais selecionados: ${tempSelectedChannels.join(', ')}`);
                    }}
                    className="w-full py-2.5 uppercase font-bold text-xs bg-[#b91c1c] hover:bg-red-800 text-white rounded-xl border-none"
                  >
                    Confirmar Canais ({tempSelectedChannels.length})
                  </Button>
                </div>
              )}

              {/* DEFAULT FALLBACK INPUT */}
              {!['E1_PROMISE_STATEMENT', 'E1_DIFFERENTIATOR', 'E1_UNIQUE_APPROACH', 'E2_CHANNEL_VOL90_NUM', 'E2_CHANNEL_CONTENT_ORIGIN_NUM', 'E2_CHANNEL_CLOSED_NUM', 'E2_MKT_TIMES_PER_WEEK', 'E2_MKT_MINUTES_EACH', 'E2_CHANNEL_AUDIENCE_TEXT', 'E2_BRANDING_FEEDBACK_TEXT', 'E2_SCHEDULING_TOOL_NAME', 'E3_SYSTEM_NAME', 'E3_WHO_CLOSES_NAME', 'E3_FOLLOW_UP_TIME_NUM', 'E3_FOLLOW_UP_ATTEMPTS_NUM', 'E3_TIME_TO_CLOSE_TEXT', 'E4_EHR_TOOL_CUSTOM', 'E4_RENEWAL_90D_NUM', 'E5_REVENUE_M1_NUM', 'E5_REVENUE_M2_NUM', 'E5_REVENUE_M3_NUM', 'E5_OTHER_REVENUE_NAME', 'E5_OTHER_REVENUE_VAL', 'E5_RENT_AMOUNT', 'E5_TOOL_KNOWN_COST', 'E5_NEW_TOOL_COST', 'E5_TOOL_ITEM_NAME', 'E5_TOOL_ITEM_COST', 'E5_AI_TOOLS_COST', 'E5_CRN_FEE', 'E5_PAID_ADS', 'E5_ACCOUNTANT_COST', 'E5_UNANTICIPATED_COSTS_VAL', 'E5_FINANCIAL_SOFTWARE_COST_VAL', 'E6_MEMBER_NAME', 'E6_MEMBER_COST', 'E6_CLINICAL_FIXED_DAYS', 'E6_CLINICAL_FIXED_HOURS_PER_DAY', 'E6_NON_CLINICAL_FIXED_DAYS', 'E1_PROMISE_TYPE', 'E1_DIFFERENTIATOR_SOURCE', 'E1_PROMISE_FULFILLMENT', 'E2_CHANNEL_DIRECTION', 'E2_CHANNEL_AUDIENCE_BIFURCATION', 'E2_CHANNEL_VOL90_BIFURCATION', 'E2_CHANNEL_CONTENT_ORIGIN_BIFURCATION', 'E2_CHANNEL_CLOSED_BIFURCATION', 'E3_FOLLOW_UP_TIME_BIFURCATION', 'E3_FOLLOW_UP_ATTEMPTS_BIFURCATION', 'E3_TIME_TO_CLOSE_BIFURCATION', 'E4_RENEWAL_90D_BIFURCATION', 'E5_REVENUE_3M_BIFURCATION', 'E2_CHANNELS_SELECT'].includes(currentStep) && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userInputText}
                    onChange={(e) => setUserInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && userInputText.trim()) {
                        e.preventDefault();
                        handleUserAnswer(userInputText);
                      }
                    }}
                    placeholder="Digite sua resposta..."
                    className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-xs font-body focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => userInputText.trim() && handleUserAnswer(userInputText)}
                    disabled={!userInputText.trim()}
                    className="bg-[#b91c1c] hover:bg-red-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <span>Confirmar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* AÇÕES RÁPIDAS (QUICK HELPER BUTTONS) */}
            <div className="pt-2 border-t border-neutral-100">
              <span className="text-[0.62rem] font-bold text-neutral-400 uppercase block mb-2">
                Ações Rápida
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickAction('dont_know')}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[0.65rem] font-subtitle font-bold py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center truncate"
                >
                  ? Não sei o valor exato
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAction('skip')}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[0.65rem] font-subtitle font-bold py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center truncate"
                >
                  ⤲ Pular esta pergunta
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAction('explain')}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[0.65rem] font-subtitle font-bold py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center truncate"
                >
                  ⓘ Explicar melhor
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAction('rephrase')}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[0.65rem] font-subtitle font-bold py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center truncate"
                >
                  ↻ Reformular pergunta
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM STEP NAVIGATION */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleNavigatePrevious}
              className="text-xs font-bold text-neutral-600 hover:text-neutral-900 cursor-pointer flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-neutral-200/50 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para {meta.prevAxisLabel}</span>
            </button>

            <button
              type="button"
              onClick={handleFinishAndProceed}
              className="bg-[#b91c1c] hover:bg-red-800 text-white text-xs font-subtitle font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs flex items-center gap-2 uppercase tracking-wider"
            >
              <span>Salvar resposta e continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* ========================================== */}
        {/* ÁREA 03: DADOS EXTRAÍDOS EM TEMPO REAL (25% / 3 cols) */}
        {/* ========================================== */}
        <section className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-neutral-200">
            <h3 className="text-xs font-title font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
              <span>📊</span>
              <span>Dados Extraídos</span>
            </h3>
            <span className="text-[0.62rem] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
              6 Eixos
            </span>
          </div>

          <div className="space-y-3 font-subtitle text-xs">
            {/* EIXO 1 */}
            <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-2xs space-y-1 hover:border-neutral-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[0.65rem] font-bold uppercase text-emerald-700">1. Promessa</span>
                <span className="text-[0.6rem] font-mono text-neutral-400">Eixo 1</span>
              </div>
              <p className="text-neutral-700 text-[0.72rem] line-clamp-2">
                <strong>Frase:</strong> {valueProp.promiseStatement || 'Em preenchimento...'}
              </p>
              <p className="text-neutral-500 text-[0.68rem] truncate">
                <strong>Diferencial:</strong> {valueProp.differentiator || 'Não informado'}
              </p>
            </div>

            {/* EIXO 2 */}
            <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-2xs space-y-1 hover:border-neutral-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[0.65rem] font-bold uppercase text-emerald-700">2. Marketing & Captação</span>
                <span className="text-[0.6rem] font-mono text-neutral-400">Eixo 2</span>
              </div>
              <p className="text-neutral-700 text-[0.72rem] truncate">
                <strong>Canais:</strong> {selectedChannels.join(', ') || 'Nenhum selecionado'}
              </p>
              <p className="text-neutral-500 text-[0.68rem]">
                <strong>Horas Mkt:</strong> {mktTime.totalWeeklyHours || 0}h/semana
              </p>
            </div>

            {/* EIXO 3 */}
            <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-2xs space-y-1 hover:border-neutral-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[0.65rem] font-bold uppercase text-emerald-700">3. Vendas</span>
                <span className="text-[0.6rem] font-mono text-neutral-400">Eixo 3</span>
              </div>
              <p className="text-neutral-700 text-[0.72rem] truncate">
                <strong>CRM:</strong> {sales.usesSystem === 'Sim' ? sales.systemName : 'Sem CRM'}
              </p>
              <p className="text-neutral-500 text-[0.68rem] truncate">
                <strong>Quem fecha:</strong> {sales.whoCloses || 'Não informado'}
              </p>
            </div>

            {/* EIXO 4 */}
            <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-2xs space-y-1 hover:border-neutral-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[0.65rem] font-bold uppercase text-emerald-700">4. Entrega de Valor</span>
                <span className="text-[0.6rem] font-mono text-neutral-400">Eixo 4</span>
              </div>
              <p className="text-neutral-700 text-[0.72rem] truncate">
                <strong>Prontuário:</strong> {delivery.electronicHealthRecord || 'Prontuário'}
              </p>
              <p className="text-neutral-500 text-[0.68rem]">
                <strong>Renovações (90d):</strong> {delivery.renovation90dCount || 0}
              </p>
            </div>

            {/* EIXO 5 */}
            <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-2xs space-y-1 hover:border-neutral-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[0.65rem] font-bold uppercase text-emerald-700">5. Financeiro</span>
                <span className="text-[0.6rem] font-mono text-neutral-400">Eixo 5</span>
              </div>
              <p className="text-neutral-700 text-[0.72rem] truncate">
                <strong>Média 3M:</strong> R$ {Math.round(((financial.revenueM1 || 0) + (financial.revenueM2 || 0) + (financial.revenueM3 || 0)) / 3)}/mês
              </p>
              <p className="text-neutral-500 text-[0.68rem] truncate">
                <strong>Estrutura:</strong> {financial.legalStructure || 'Não informada'}
              </p>
            </div>

            {/* EIXO 6 */}
            <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-2xs space-y-1 hover:border-neutral-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[0.65rem] font-bold uppercase text-emerald-700">6. Equipe</span>
                <span className="text-[0.6rem] font-mono text-neutral-400">Eixo 6</span>
              </div>
              <p className="text-neutral-700 text-[0.72rem] truncate">
                <strong>Membros:</strong> {teamMembers.length} integrante(s)
              </p>
              <p className="text-neutral-500 text-[0.68rem] truncate">
                <strong>Delegados:</strong> {teamMembers.filter((m) => m.isClinicalDelegate).length}
              </p>
            </div>
          </div>
        </section>
      </main>



      {/* REAL-TIME STRUCTURED DATA DRAWER — slide-out overlay, matching the Gio mockup pattern */}
      {showStructuredDrawer && (
        <div
          onClick={() => setShowStructuredDrawer(false)}
          className="fixed inset-0 bg-black/50 z-[60]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-0 right-0 h-full w-full sm:w-[380px] bg-[var(--branco)] border-l-2 border-[var(--preto)] p-8 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6 border-b border-[var(--border-default)] pb-4">
              <span className="font-subtitle font-bold text-xs uppercase tracking-wider text-[var(--preto)]">
                Resumo Estruturado
              </span>
              <button
                type="button"
                onClick={() => setShowStructuredDrawer(false)}
                className="text-[var(--cinza-medio)] hover:text-[var(--preto)] cursor-pointer bg-transparent border-none text-lg"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <div className="divide-y divide-[var(--border-default)]">
              <div className="py-3">
                <span className="block text-[0.65rem] font-subtitle font-bold uppercase tracking-wider text-[var(--cinza-medio)] mb-1">Eixo 1 · Promessa</span>
                <p className="text-sm text-[var(--preto)]">{valueProp.promiseStatement || 'Em definição'}</p>
                {valueProp.differentiator && <p className="text-xs text-[var(--cinza-escuro)] mt-1">Diferencial: {valueProp.differentiator}</p>}
              </div>

              <div className="py-3">
                <span className="block text-[0.65rem] font-subtitle font-bold uppercase tracking-wider text-[var(--cinza-medio)] mb-1">Eixo 2 · Marketing & Captação</span>
                <p className="text-sm text-[var(--preto)]">{acqChannels.length > 0 ? acqChannels.map((c) => c.name).join(', ') : (selectedChannels.join(', ') || 'Nenhum canal registrado')}</p>
                <p className="text-xs text-[var(--cinza-escuro)] mt-1">{mktTime.totalWeeklyHours}h/semana dedicadas</p>
              </div>

              <div className="py-3">
                <span className="block text-[0.65rem] font-subtitle font-bold uppercase tracking-wider text-[var(--cinza-medio)] mb-1">Eixo 3 · Vendas</span>
                <p className="text-sm text-[var(--preto)]">{sales.usesSystem === 'Sim' ? sales.systemName : 'Sem CRM'} · {sales.closingFormat}</p>
                <p className="text-xs text-[var(--cinza-escuro)] mt-1">Quem fecha: {sales.whoCloses}</p>
              </div>

              <div className="py-3">
                <span className="block text-[0.65rem] font-subtitle font-bold uppercase tracking-wider text-[var(--cinza-medio)] mb-1">Eixo 4 · Entrega de Valor</span>
                <p className="text-sm text-[var(--preto)]">{delivery.electronicHealthRecord || 'Prontuário não informado'}</p>
                <p className="text-xs text-[var(--cinza-escuro)] mt-1">Renovações (90d): {delivery.renovation90dCount || 0}</p>
              </div>

              <div className="py-3">
                <span className="block text-[0.65rem] font-subtitle font-bold uppercase tracking-wider text-[var(--cinza-medio)] mb-1">Eixo 5 · Financeiro</span>
                <p className="text-sm text-[var(--preto)]">R$ {Math.round(((financial.revenueM1 || 0) + (financial.revenueM2 || 0) + (financial.revenueM3 || 0)) / 3)}/mês (média 3M)</p>
                <p className="text-xs text-[var(--cinza-escuro)] mt-1">{financial.legalStructure || 'Estrutura não informada'}</p>
              </div>

              <div className="py-3">
                <span className="block text-[0.65rem] font-subtitle font-bold uppercase tracking-wider text-[var(--cinza-medio)] mb-1">Eixo 6 · Equipe</span>
                <p className="text-sm text-[var(--preto)]">{teamMembers.length} integrante(s), {teamMembers.filter((m) => m.isClinicalDelegate).length} delegado(s) clínico(s)</p>
                {teamMembers.length > 0 && <p className="text-xs text-[var(--cinza-escuro)] mt-1">{teamMembers.map((m) => m.name).join(', ')}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER ACTIONS */}
      <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={() => onNavigateBack?.()}
          className="text-xs font-subtitle font-bold text-neutral-600 hover:text-[var(--preto)] cursor-pointer border-none bg-transparent flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar para Agenda
        </button>

        <Button
          variant="primary"
          size="lg"
          onClick={handleFinishAndProceed}
          className="py-3.5 px-6 text-xs uppercase font-bold tracking-wider flex items-center gap-2"
        >
          <span>Concluir Investigação e Avançar</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
