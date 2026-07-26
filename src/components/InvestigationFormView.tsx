import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  MessageCircle,
  FileText,
  Plus,
  Trash2,
  Check,
  Calculator,
  Building2,
  Users,
  Target,
  Megaphone,
  ShoppingBag,
  HeartPulse,
  DollarSign,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { A3AcquisitionChannel, A3HumanResource, deduplicateTeamMembers } from '../types';

interface InvestigationFormViewProps {
  valueProp: {
    promiseStatement: string;
    promiseType: 'Resultado' | 'Experiência' | 'Um pouco dos dois';
    differentiator: string;
    differentiatorSource: string;
    uniqueApproach: string;
    promiseFulfillment: string;
  };
  setValueProp: React.Dispatch<React.SetStateAction<{
    promiseStatement: string;
    promiseType: 'Resultado' | 'Experiência' | 'Um pouco dos dois';
    differentiator: string;
    differentiatorSource: string;
    uniqueApproach: string;
    promiseFulfillment: string;
  }>>;

  selectedChannels: string[];
  setSelectedChannels: React.Dispatch<React.SetStateAction<string[]>>;
  acqChannels: A3AcquisitionChannel[];
  setAcqChannels: React.Dispatch<React.SetStateAction<A3AcquisitionChannel[]>>;
  mktTime: { timesPerWeek: number; minutesEach: number; totalWeeklyHours: number };
  setMktTime: React.Dispatch<React.SetStateAction<{ timesPerWeek: number; minutesEach: number; totalWeeklyHours: number }>>;
  branding: {
    hasVisualIdentity: string;
    feelsProfessional: string;
    communicationStyle: string;
    communicationStyleNote: string;
    markingFeedback: string;
    schedulingTool: string;
  };
  setBranding: React.Dispatch<React.SetStateAction<{
    hasVisualIdentity: string;
    feelsProfessional: string;
    communicationStyle: string;
    communicationStyleNote: string;
    markingFeedback: string;
    schedulingTool: string;
  }>>;

  sales: {
    usesScript: string;
    closingFormat: string;
    effectivenessPerception: string;
    moreEffectiveFormat: string;
    usesSystem: string;
    systemName: string;
    whoCloses: string;
    whoClosesOtherRef: string;
    followsUp: string;
    followUpDays: string | number;
    followUpAttempts: string | number;
    timeToClose: string;
    nonClosingReasons: string[];
  };
  setSales: React.Dispatch<React.SetStateAction<{
    usesScript: string;
    closingFormat: string;
    effectivenessPerception: string;
    moreEffectiveFormat: string;
    usesSystem: string;
    systemName: string;
    whoCloses: string;
    whoClosesOtherRef: string;
    followsUp: string;
    followUpDays: string | number;
    followUpAttempts: string | number;
    timeToClose: string;
    nonClosingReasons: string[];
  }>>;

  delivery: {
    electronicHealthRecord: string;
    hasStandardContract: string;
    hasWelcomeProcess: string;
    hasOffboardingProcess: string;
    hasConsentForm: string;
    renovation90dConfidence: string;
    renovation90dCount: number;
  };
  setDelivery: React.Dispatch<React.SetStateAction<{
    electronicHealthRecord: string;
    hasStandardContract: string;
    hasWelcomeProcess: string;
    hasOffboardingProcess: string;
    hasConsentForm: string;
    renovation90dConfidence: string;
    renovation90dCount: number;
  }>>;

  financial: {
    revenue3mConfidence: string;
    revenueM1: number;
    revenueM2: number;
    revenueM3: number;
    legalStructure: string;
    financesSeparation: string;
    proLaboreType: string;
    budgetPlanning: string;
    rent: number;
    hasRent: boolean;
    tools: Array<{ name: string; monthlyCost: number }>;
    currentToolName: string;
    currentToolCost: number;
    aiToolsCost: number;
    crnFee: number;
    paidAdsCost: number;
    accountant: number;
    hasAccountant: boolean;
    unanticipatedCostText: string;
    unanticipatedCostVal: number;
    paymentDelayLevel: string;
    hasCancellationPolicy: string;
    hasFinancialSoftware: boolean;
    financialSoftware: string;
    financialSoftwareCost: number;
  };
  setFinancial: React.Dispatch<React.SetStateAction<any>>;

  otherRevenues: Array<{ name: string; monthlyCost: number }>;
  setOtherRevenues: React.Dispatch<React.SetStateAction<Array<{ name: string; monthlyCost: number }>>>;

  teamMembers: A3HumanResource[];
  setTeamMembers: React.Dispatch<React.SetStateAction<A3HumanResource[]>>;

  monthLabels: string[];
  activeSection: string;
  setActiveSection: (section: string) => void;
  onSwitchToChat: () => void;
  onFinish: () => void;
}

export const InvestigationFormView: React.FC<InvestigationFormViewProps> = ({
  valueProp,
  setValueProp,
  selectedChannels = [],
  setSelectedChannels,
  acqChannels = [],
  setAcqChannels,
  mktTime,
  setMktTime,
  branding,
  setBranding,
  sales,
  setSales,
  delivery = {
    electronicHealthRecord: 'Sim',
    hasStandardContract: 'Sim',
    hasWelcomeProcess: 'Mais ou menos',
    hasOffboardingProcess: 'Não',
    hasConsentForm: 'Sim',
    renovation90dConfidence: 'Não sei',
    renovation90dCount: 0,
  },
  setDelivery,
  financial,
  setFinancial,
  otherRevenues = [],
  setOtherRevenues,
  teamMembers = [],
  setTeamMembers,
  monthLabels = [],
  activeSection,
  setActiveSection,
  onSwitchToChat,
  onFinish,
}) => {
  // Local state for adding custom items in form
  const [newRevenueName, setNewRevenueName] = useState('');
  const [newRevenueVal, setNewRevenueVal] = useState<number | ''>('');

  const [newToolName, setNewToolName] = useState('');
  const [newToolCost, setNewToolCost] = useState<number | ''>('');

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberCost, setNewMemberCost] = useState<number | ''>('');

  const cleanMembers = React.useMemo(() => deduplicateTeamMembers(teamMembers), [teamMembers]);

  const toggleSection = (sectionKey: string) => {
    setActiveSection(activeSection === sectionKey ? '' : sectionKey);
  };

  // Channel helper
  const handleToggleChannel = (channel: string) => {
    let updatedChannels: string[];
    if (selectedChannels.includes(channel)) {
      updatedChannels = selectedChannels.filter((c) => c !== channel);
      setAcqChannels((prev) => prev.filter((c) => c.name !== channel));
    } else {
      updatedChannels = [...selectedChannels, channel];
      setAcqChannels((prev) => [
        ...prev,
        {
          name: channel,
          contactDirection: 'O paciente vem até mim',
          volume90d: 10,
          volumeConfidence: 'estimativa',
          closedCount: 3,
          closedConfidence: 'estimativa',
          audienceDescription: 'Pacientes em busca de resultado',
        },
      ]);
    }
    setSelectedChannels(updatedChannels);
  };

  const updateChannelDetail = (channelName: string, field: keyof A3AcquisitionChannel, value: any) => {
    setAcqChannels((prev) => {
      const exists = prev.find((c) => c.name === channelName);
      if (!exists) {
        return [
          ...prev,
          {
            name: channelName,
            contactDirection: 'O paciente vem até mim',
            volume90d: 10,
            volumeConfidence: 'estimativa',
            closedCount: 3,
            closedConfidence: 'estimativa',
            [field]: value,
          },
        ];
      }
      return prev.map((c) => (c.name === channelName ? { ...c, [field]: value } : c));
    });
  };

  // Add revenue line
  const handleAddRevenue = () => {
    if (!newRevenueName.trim()) return;
    setOtherRevenues((prev) => [...prev, { name: newRevenueName.trim(), monthlyCost: Number(newRevenueVal) || 0 }]);
    setNewRevenueName('');
    setNewRevenueVal('');
  };

  const handleRemoveRevenue = (idx: number) => {
    setOtherRevenues((prev) => prev.filter((_, i) => i !== idx));
  };

  // Add tool item
  const handleAddTool = () => {
    if (!newToolName.trim()) return;
    setFinancial((prev: any) => ({
      ...prev,
      tools: [...prev.tools, { name: newToolName.trim(), monthlyCost: Number(newToolCost) || 0 }],
    }));
    setNewToolName('');
    setNewToolCost('');
  };

  const handleRemoveTool = (toolName: string) => {
    setFinancial((prev: any) => ({
      ...prev,
      tools: prev.tools.filter((t: any) => t.name !== toolName),
    }));
  };

  const updateToolCost = (toolName: string, cost: number) => {
    setFinancial((prev: any) => {
      const exists = prev.tools.some((t: any) => t.name.toLowerCase() === toolName.toLowerCase());
      if (exists) {
        return {
          ...prev,
          tools: prev.tools.map((t: any) => (t.name.toLowerCase() === toolName.toLowerCase() ? { ...t, monthlyCost: cost } : t)),
        };
      } else {
        return {
          ...prev,
          tools: [...prev.tools, { name: toolName, monthlyCost: cost }],
        };
      }
    });
  };

  // Add Team Member
  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    const member: A3HumanResource = {
      id: `m_${Date.now()}`,
      name: newMemberName.trim(),
      role: newMemberRole.trim() || 'Auxiliar',
      functions: ['recepcao'],
      isClinicalDelegate: false,
      monthlyCost: Number(newMemberCost) || 0,
      daysPerWeek: 5,
    };
    setTeamMembers((prev) => deduplicateTeamMembers([...prev, member]));
    setNewMemberName('');
    setNewMemberRole('');
    setNewMemberCost('');
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Known tools automatically gathered from E2, E3, E4
  const knownToolsList = React.useMemo(() => {
    const list: Array<{ name: string; source: string }> = [];
    if (
      delivery.electronicHealthRecord &&
      delivery.electronicHealthRecord !== 'Não uso, é papel ou planilha' &&
      !delivery.electronicHealthRecord.startsWith('Não uso')
    ) {
      list.push({ name: delivery.electronicHealthRecord, source: 'Prontuário Eletrônico' });
    }
    if (
      branding.schedulingTool &&
      branding.schedulingTool !== 'Não' &&
      branding.schedulingTool !== 'Não uso'
    ) {
      list.push({ name: branding.schedulingTool, source: 'Agendamento de Posts' });
    }
    if (sales.usesSystem === 'Sim' && sales.systemName) {
      list.push({ name: sales.systemName, source: 'CRM / Sistema de Vendas' });
    }
    // Any extra tools from financial.tools
    financial.tools.forEach((t) => {
      if (!list.some((l) => l.name.toLowerCase() === t.name.toLowerCase())) {
        list.push({ name: t.name, source: 'Ferramenta Adicional' });
      }
    });
    return list;
  }, [delivery.electronicHealthRecord, branding.schedulingTool, sales.usesSystem, sales.systemName, financial.tools]);

  // Break-even Live Calculation
  const toolsTotal = financial.tools.reduce((acc: number, t: any) => acc + (t.monthlyCost || 0), 0);
  const teamTotal = teamMembers.reduce((acc, m) => acc + (m.monthlyCost || 0), 0);
  const rentCost = financial.hasRent ? Number(financial.rent) || 0 : 0;
  const accountantCost = financial.hasAccountant ? Number(financial.accountant) || 0 : 0;
  const totalCosts =
    rentCost +
    toolsTotal +
    accountantCost +
    teamTotal +
    (Number(financial.aiToolsCost) || 0) +
    (Number(financial.crnFee) || 0) +
    (Number(financial.paidAdsCost) || 0) +
    (Number(financial.unanticipatedCostVal) || 0) +
    (financial.hasFinancialSoftware ? Number(financial.financialSoftwareCost) || 0 : 0);

  const avgRev =
    Math.round(
      ((Number(financial.revenueM1) || 0) +
        (Number(financial.revenueM2) || 0) +
        (Number(financial.revenueM3) || 0)) /
        3
    ) || 0;
  const breakEvenDiff = avgRev - totalCosts;
  const isAboveBreakEven = breakEvenDiff >= 0;

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* HEADER BAR FOR FORM VIEW */}
      <div className="bg-emerald-900 text-white p-4 sm:p-5 border-2 border-[var(--preto)] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 text-[0.65rem] font-bold px-2 py-0.5 uppercase tracking-wider rounded">
              Formulário Contínuo
            </span>
            <h3 className="font-subtitle text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-300" />
              Mapeamento Completo da Clínica (6 Eixos)
            </h3>
          </div>
          <p className="text-xs text-emerald-200 font-body mt-1">
            Preencha no seu próprio ritmo. Todos os dados são sincronizados em tempo real com o assistente Gio.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={onSwitchToChat}
            className="bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-400 px-3 py-2 rounded-lg text-xs font-subtitle font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
          >
            <MessageCircle className="w-4 h-4 text-emerald-200" />
            <span>Voltar ao Gio Conversacional</span>
          </button>

          <button
            type="button"
            onClick={onFinish}
            className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-subtitle font-extrabold px-4 py-2 rounded-lg text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Concluir</span>
          </button>
        </div>
      </div>

      {/* LIVE BREAK-EVEN BAR */}
      <div className="bg-neutral-900 text-white p-4 border-2 border-[var(--preto)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
        <div>
          <span className="text-[0.68rem] font-bold uppercase tracking-wider text-neutral-400 block">
            Faturamento Médio Mensal (3M)
          </span>
          <span className="text-base font-subtitle font-extrabold text-emerald-400">
            R$ {avgRev.toLocaleString('pt-BR')}
          </span>
        </div>
        <div>
          <span className="text-[0.68rem] font-bold uppercase tracking-wider text-neutral-400 block">
            Custo Fixo & Operacional Total
          </span>
          <span className="text-base font-subtitle font-extrabold text-amber-400">
            R$ {totalCosts.toLocaleString('pt-BR')}
          </span>
        </div>
        <div>
          <span className="text-[0.68rem] font-bold uppercase tracking-wider text-neutral-400 block">
            Ponto de Equilíbrio
          </span>
          <span
            className={`text-base font-subtitle font-extrabold ${
              isAboveBreakEven ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            R$ {Math.abs(breakEvenDiff).toLocaleString('pt-BR')}{' '}
            <span className="text-xs font-normal">
              {isAboveBreakEven ? '(Acima / Lucro)' : '(Abaixo / Déficit)'}
            </span>
          </span>
        </div>
      </div>

      {/* ACCORDION SECTIONS FOR 6 AXES */}
      <div className="space-y-4">
        {/* EIXO 1 — PROMESSA */}
        <div className="bg-white border-2 border-[var(--preto)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('E1')}
            className="w-full bg-emerald-50 hover:bg-emerald-100 p-4 flex items-center justify-between cursor-pointer transition-colors border-b border-neutral-200"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-mono text-xs font-bold flex items-center justify-center">
                E1
              </span>
              <div className="text-left">
                <h4 className="font-subtitle text-sm font-bold text-neutral-900">Eixo 1 — Promessa & Valor</h4>
                <p className="text-[0.7rem] text-neutral-600">Proposta de valor, diferenciais e entrega de resultado</p>
              </div>
            </div>
            {activeSection === 'E1' ? <ChevronUp className="w-5 h-5 text-neutral-700" /> : <ChevronDown className="w-5 h-5 text-neutral-700" />}
          </button>

          {activeSection === 'E1' && (
            <div className="p-4 sm:p-6 space-y-5 bg-white">
              <div>
                <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-1">
                  Promessa ao Paciente (em uma frase)
                </label>
                <input
                  type="text"
                  value={valueProp.promiseStatement}
                  onChange={(e) => setValueProp((prev) => ({ ...prev, promiseStatement: e.target.value }))}
                  placeholder="Ex: Promovo emagrecimento definitivo sem dietas restritivas..."
                  className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-1">
                    Foco Principal da Entrega
                  </label>
                  <select
                    value={valueProp.promiseType}
                    onChange={(e) => setValueProp((prev) => ({ ...prev, promiseType: e.target.value as any }))}
                    className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Resultado">Foco em Resultado Mensurável</option>
                    <option value="Experiência">Foco em Experiência / Acompanhamento Próximo</option>
                    <option value="Um pouco dos dois">Equilíbrio (Resultado + Experiência)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-1">
                    Origem do Diferencial
                  </label>
                  <select
                    value={valueProp.differentiatorSource}
                    onChange={(e) => setValueProp((prev) => ({ ...prev, differentiatorSource: e.target.value }))}
                    className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Feedback espontâneo de pacientes">Feedback espontâneo dos pacientes</option>
                    <option value="Percepção própria do nutricionista">Percepção própria</option>
                    <option value="Pesquisa estruturada de satisfação">Pesquisa estruturada de satisfação</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-1">
                  Qual seu principal diferencial em relação aos concorrentes?
                </label>
                <input
                  type="text"
                  value={valueProp.differentiator}
                  onChange={(e) => setValueProp((prev) => ({ ...prev, differentiator: e.target.value }))}
                  placeholder="Ex: Suporte diário por WhatsApp e plano 100% flexível..."
                  className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-1">
                  Abordagem única no atendimento
                </label>
                <input
                  type="text"
                  value={valueProp.uniqueApproach}
                  onChange={(e) => setValueProp((prev) => ({ ...prev, uniqueApproach: e.target.value }))}
                  placeholder="Ex: Avaliação de bioimpedância + análise comportamental profunda..."
                  className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-1">
                  Cumprimento da promessa com a maioria dos pacientes hoje
                </label>
                <select
                  value={valueProp.promiseFulfillment}
                  onChange={(e) => setValueProp((prev) => ({ ...prev, promiseFulfillment: e.target.value }))}
                  className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-emerald-600"
                >
                  <option value="Sim">Sim, cumpro com a grande maioria</option>
                  <option value="Mais ou menos">Mais ou menos, depende do engajamento do paciente</option>
                  <option value="Não">Não tanto quanto gostaria</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* EIXO 2 — MARKETING & CAPTAÇÃO */}
        <div className="bg-white border-2 border-[var(--preto)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('E2')}
            className="w-full bg-emerald-50 hover:bg-emerald-100 p-4 flex items-center justify-between cursor-pointer transition-colors border-b border-neutral-200"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-mono text-xs font-bold flex items-center justify-center">
                E2
              </span>
              <div className="text-left">
                <h4 className="font-subtitle text-sm font-bold text-neutral-900">Eixo 2 — Marketing & Captação</h4>
                <p className="text-[0.7rem] text-neutral-600">Canais de atração, frequência de produção e posicionamento</p>
              </div>
            </div>
            {activeSection === 'E2' ? <ChevronUp className="w-5 h-5 text-neutral-700" /> : <ChevronDown className="w-5 h-5 text-neutral-700" />}
          </button>

          {activeSection === 'E2' && (
            <div className="p-4 sm:p-6 space-y-6 bg-white">
              <div>
                <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-2">
                  Canais de Captação Ativos (Selecione todos que usa)
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Instagram', 'Indicação', 'Google (SEO/Ads)', 'Parcerias com Médicos/Academias', 'TikTok', 'YouTube', 'Eventos/Palestras'].map((ch) => {
                    const isSelected = selectedChannels.includes(ch);
                    return (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => handleToggleChannel(ch)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-700 text-white border-emerald-800 shadow-2xs'
                            : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                        }`}
                      >
                        {isSelected ? `✓ ${ch}` : `+ ${ch}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DETAILS PER CHANNEL */}
              {selectedChannels.length > 0 && (
                <div className="space-y-4 pt-2 border-t border-neutral-200">
                  <h5 className="text-xs font-subtitle font-bold text-neutral-800 uppercase tracking-wider">
                    Detalhamento dos Canais Selecionados
                  </h5>
                  {selectedChannels.map((chName) => {
                    const detail = acqChannels.find((c) => c.name === chName) || {
                      name: chName,
                      contactDirection: 'O paciente vem até mim',
                      volume90d: 10,
                      closedCount: 3,
                      audienceDescription: '',
                    };

                    return (
                      <div key={chName} className="p-3.5 bg-neutral-50 border border-neutral-300 rounded-xl space-y-3">
                        <span className="text-xs font-bold text-emerald-800 uppercase block font-subtitle">
                          Canal: {chName}
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Direção do Contato</label>
                            <select
                              value={detail.contactDirection}
                              onChange={(e) => updateChannelDetail(chName, 'contactDirection', e.target.value)}
                              className="w-full bg-white border border-neutral-300 rounded p-1.5 text-xs"
                            >
                              <option value="O paciente vem até mim">O paciente me procura</option>
                              <option value="Eu vou até o paciente">Eu busco o paciente</option>
                              <option value="Ambos">Ambos</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Contatos nos últimos 90d</label>
                            <input
                              type="number"
                              value={detail.volume90d || 0}
                              onChange={(e) => updateChannelDetail(chName, 'volume90d', Number(e.target.value) || 0)}
                              className="w-full bg-white border border-neutral-300 rounded p-1.5 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-neutral-700 mb-1">Pacientes Fechados (90d)</label>
                            <input
                              type="number"
                              value={detail.closedCount || 0}
                              onChange={(e) => updateChannelDetail(chName, 'closedCount', Number(e.target.value) || 0)}
                              className="w-full bg-white border border-neutral-300 rounded p-1.5 text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-neutral-700 mb-1 text-xs">Público que chega por aqui</label>
                          <input
                            type="text"
                            value={detail.audienceDescription || ''}
                            onChange={(e) => updateChannelDetail(chName, 'audienceDescription', e.target.value)}
                            placeholder="Ex: Mulheres de 30-45 anos interessadas em emagrecimento..."
                            className="w-full bg-white border border-neutral-300 rounded p-1.5 text-xs"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* MARKETING ROUTINE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-200">
                <div>
                  <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-1">
                    Quantas vezes por semana dedica a marketing/conteúdo?
                  </label>
                  <input
                    type="number"
                    value={mktTime.timesPerWeek}
                    onChange={(e) => {
                      const tpw = Number(e.target.value) || 0;
                      const hrs = (tpw * mktTime.minutesEach) / 60;
                      setMktTime((prev) => ({ ...prev, timesPerWeek: tpw, totalWeeklyHours: Math.round(hrs * 10) / 10 }));
                    }}
                    className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-1">
                    Duração de cada sessão (em minutos)
                  </label>
                  <input
                    type="number"
                    value={mktTime.minutesEach}
                    onChange={(e) => {
                      const mins = Number(e.target.value) || 0;
                      const hrs = (mktTime.timesPerWeek * mins) / 60;
                      setMktTime((prev) => ({ ...prev, minutesEach: mins, totalWeeklyHours: Math.round(hrs * 10) / 10 }));
                    }}
                    className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              {/* ITEM 2: FERRAMENTA DE AGENDAMENTO COM BIFURCAÇÃO */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3">
                <label className="block text-xs font-subtitle font-bold text-emerald-950">
                  Você utiliza alguma ferramenta pra organizar ou agendar suas postagens de conteúdo?
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="hasSchedulingTool"
                      checked={branding.schedulingTool !== 'Não' && branding.schedulingTool !== 'Não uso' && branding.schedulingTool !== ''}
                      onChange={() => setBranding((prev) => ({ ...prev, schedulingTool: 'mLabs' }))}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    Sim
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="hasSchedulingTool"
                      checked={branding.schedulingTool === 'Não' || branding.schedulingTool === 'Não uso' || branding.schedulingTool === ''}
                      onChange={() => setBranding((prev) => ({ ...prev, schedulingTool: 'Não uso' }))}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    Não
                  </label>
                </div>

                {branding.schedulingTool !== 'Não' && branding.schedulingTool !== 'Não uso' && (
                  <div>
                    <label className="block text-[0.7rem] font-bold text-neutral-700 mb-1">
                      Qual ferramenta você usa?
                    </label>
                    <input
                      type="text"
                      value={branding.schedulingTool === 'mLabs' ? '' : branding.schedulingTool}
                      onChange={(e) => setBranding((prev) => ({ ...prev, schedulingTool: e.target.value }))}
                      placeholder="Ex: mLabs, Canva Pro, Meta Business Suite..."
                      className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* EIXO 3 — VENDAS */}
        <div className="bg-white border-2 border-[var(--preto)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('E3')}
            className="w-full bg-emerald-50 hover:bg-emerald-100 p-4 flex items-center justify-between cursor-pointer transition-colors border-b border-neutral-200"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-mono text-xs font-bold flex items-center justify-center">
                E3
              </span>
              <div className="text-left">
                <h4 className="font-subtitle text-sm font-bold text-neutral-900">Eixo 3 — Vendas & Comercial</h4>
                <p className="text-[0.7rem] text-neutral-600">Scripts, CRM, responsáveis e follow-up</p>
              </div>
            </div>
            {activeSection === 'E3' ? <ChevronUp className="w-5 h-5 text-neutral-700" /> : <ChevronDown className="w-5 h-5 text-neutral-700" />}
          </button>

          {activeSection === 'E3' && (
            <div className="p-4 sm:p-6 space-y-5 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-1">
                    Usa roteiro ou script de vendas?
                  </label>
                  <select
                    value={sales.usesScript}
                    onChange={(e) => setSales((prev) => ({ ...prev, usesScript: e.target.value }))}
                    className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs"
                  >
                    <option value="Sim">Sim, tenho roteiro estruturado</option>
                    <option value="Mais ou menos">Tenho uma ideia, mas vario muito</option>
                    <option value="Não">Não uso roteiro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-1">
                    Formato do contato de fechamento
                  </label>
                  <select
                    value={sales.closingFormat}
                    onChange={(e) => setSales((prev) => ({ ...prev, closingFormat: e.target.value }))}
                    className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs"
                  >
                    <option value="Mensagem">Mais por Mensagem (WhatsApp / Direct)</option>
                    <option value="Chamada">Mais por Chamada (Ligação / Reunião)</option>
                    <option value="Ambos">Ambos em proporção parecida</option>
                  </select>
                </div>
              </div>

              {/* CRM SYSTEM */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-1">
                    Utiliza sistema ou CRM para organizar vendas?
                  </label>
                  <select
                    value={sales.usesSystem}
                    onChange={(e) => setSales((prev) => ({ ...prev, usesSystem: e.target.value }))}
                    className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs"
                  >
                    <option value="Sim">Sim, uso CRM / Sistema</option>
                    <option value="Não">Não uso (uso planilha, bloco de notas ou nada)</option>
                  </select>
                </div>

                {sales.usesSystem === 'Sim' && (
                  <div>
                    <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-1">
                      Nome do Sistema / CRM
                    </label>
                    <input
                      type="text"
                      value={sales.systemName}
                      onChange={(e) => {
                        const name = e.target.value;
                        setSales((prev) => ({ ...prev, systemName: name }));
                      }}
                      placeholder="Ex: Kommo, RD Station, Trello, Notion..."
                      className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs"
                    />
                  </div>
                )}
              </div>

              {/* WHO CLOSES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-1">
                    Quem responde e fecha com os pacientes?
                  </label>
                  <select
                    value={sales.whoCloses}
                    onChange={(e) => setSales((prev) => ({ ...prev, whoCloses: e.target.value }))}
                    className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs"
                  >
                    <option value="Sim, sou eu">Eu mesma(o)</option>
                    <option value="Não">Outra pessoa da equipe</option>
                  </select>
                </div>

                {sales.whoCloses === 'Não' && (
                  <div>
                    <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-1">
                      Nome da pessoa responsável por vendas
                    </label>
                    <input
                      type="text"
                      value={sales.whoClosesOtherRef}
                      onChange={(e) => {
                        const refName = e.target.value;
                        setSales((prev) => ({ ...prev, whoClosesOtherRef: refName }));
                      }}
                      onBlur={(e) => {
                        const refName = e.target.value.trim();
                        if (!refName) return;
                        setTeamMembers((prev) => {
                          const existingSales = prev.find((m) => m.sourceAxis === 'sales');
                          if (existingSales) {
                            return deduplicateTeamMembers(
                              prev.map((m) => (m.id === existingSales.id ? { ...m, name: refName, role: 'Vendas', functions: ['vendas'] } : m))
                            );
                          }
                          const existsByName = prev.find((m) => m.name.toLowerCase() === refName.toLowerCase());
                          if (existsByName) {
                            return deduplicateTeamMembers(
                              prev.map((m) =>
                                m.name.toLowerCase() === refName.toLowerCase()
                                  ? { ...m, functions: Array.from(new Set([...(m.functions || []), 'vendas'])) }
                                  : m
                              )
                            );
                          }
                          return deduplicateTeamMembers([
                            ...prev,
                            {
                              id: `m_sales_${Date.now()}`,
                              name: refName,
                              role: 'Vendas',
                              functions: ['vendas'],
                              isClinicalDelegate: false,
                              monthlyCost: 0,
                              sourceAxis: 'sales',
                            },
                          ]);
                        });
                      }}
                      placeholder="Ex: Mariana"
                      className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs"
                    />
                  </div>
                )}
              </div>

              {/* FOLLOW UP */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-1">
                    Faz follow-up se o paciente não fechar na hora?
                  </label>
                  <select
                    value={sales.followsUp}
                    onChange={(e) => setSales((prev) => ({ ...prev, followsUp: e.target.value }))}
                    className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs"
                  >
                    <option value="Sim">Sim, faço acompanhamento</option>
                    <option value="Não">Não costumo retornar</option>
                  </select>
                </div>

                {sales.followsUp === 'Sim' && (
                  <>
                    <div>
                      <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-1">
                        Prazo do retorno (dias)
                      </label>
                      <input
                        type="text"
                        value={sales.followUpDays}
                        onChange={(e) => setSales((prev) => ({ ...prev, followUpDays: e.target.value }))}
                        placeholder="Ex: 2 dias"
                        className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-1">
                        Número de tentativas
                      </label>
                      <input
                        type="text"
                        value={sales.followUpAttempts}
                        onChange={(e) => setSales((prev) => ({ ...prev, followUpAttempts: e.target.value }))}
                        placeholder="Ex: 3 vezes"
                        className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* EIXO 4 — ENTREGA DE VALOR */}
        <div className="bg-white border-2 border-[var(--preto)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('E4')}
            className="w-full bg-emerald-50 hover:bg-emerald-100 p-4 flex items-center justify-between cursor-pointer transition-colors border-b border-neutral-200"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-mono text-xs font-bold flex items-center justify-center">
                E4
              </span>
              <div className="text-left">
                <h4 className="font-subtitle text-sm font-bold text-neutral-900">Eixo 4 — Entrega de Valor</h4>
                <p className="text-[0.7rem] text-neutral-600">Prontuário eletrônico, contratos e processos de acolhimento</p>
              </div>
            </div>
            {activeSection === 'E4' ? <ChevronUp className="w-5 h-5 text-neutral-700" /> : <ChevronDown className="w-5 h-5 text-neutral-700" />}
          </button>

          {activeSection === 'E4' && (
            <div className="p-4 sm:p-6 space-y-5 bg-white">
              {/* ITEM 3: PRONTUÁRIO COM ESCOLHA FECHADA */}
              <div>
                <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-2">
                  Software de Prontuário Eletrônico Utilizado (Item 3)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Dietbox', 'WebDiet', 'Nutrium', 'Amplimed', 'Avanutri', 'Não uso, é papel ou planilha', '+ Outro'].map((opt) => {
                    const isSelected =
                      opt === '+ Outro'
                        ? !['Dietbox', 'WebDiet', 'Nutrium', 'Amplimed', 'Avanutri', 'Não uso, é papel ou planilha'].includes(delivery.electronicHealthRecord) && delivery.electronicHealthRecord !== ''
                        : delivery.electronicHealthRecord === opt;

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          if (opt === '+ Outro') {
                            setDelivery((prev) => ({ ...prev, electronicHealthRecord: 'Outro Prontuário' }));
                          } else {
                            setDelivery((prev) => ({ ...prev, electronicHealthRecord: opt }));
                            // Auto sync with financial tools cost list
                            if (opt !== 'Não uso, é papel ou planilha') {
                              updateToolCost(opt, 0);
                            }
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-subtitle font-bold cursor-pointer transition-all text-center ${
                          isSelected
                            ? 'bg-emerald-700 text-white border-emerald-800 shadow-2xs'
                            : 'bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-100'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {!['Dietbox', 'WebDiet', 'Nutrium', 'Amplimed', 'Avanutri', 'Não uso, é papel ou planilha'].includes(delivery.electronicHealthRecord) && (
                  <div className="mt-3">
                    <label className="block text-[0.7rem] font-bold text-neutral-700 mb-1">
                      Qual o nome do software de prontuário?
                    </label>
                    <input
                      type="text"
                      value={delivery.electronicHealthRecord}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDelivery((prev) => ({ ...prev, electronicHealthRecord: val }));
                        if (val) updateToolCost(val, 0);
                      }}
                      placeholder="Digite o nome do software..."
                      className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-neutral-200">
                <div>
                  <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-1">
                    Contrato Padrão
                  </label>
                  <select
                    value={delivery.hasStandardContract}
                    onChange={(e) => setDelivery((prev) => ({ ...prev, hasStandardContract: e.target.value }))}
                    className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs"
                  >
                    <option value="Sim">Sim, tenho contrato assinado</option>
                    <option value="Não">Não utilizo contrato formal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-1">
                    Processo de Boas-Vindas (Onboarding)
                  </label>
                  <select
                    value={delivery.hasWelcomeProcess}
                    onChange={(e) => setDelivery((prev) => ({ ...prev, hasWelcomeProcess: e.target.value }))}
                    className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs"
                  >
                    <option value="Sim">Sim, processo estruturado</option>
                    <option value="Mais ou menos">Mais ou menos, envio mensagem</option>
                    <option value="Não">Não tenho processo formal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-1">
                    Termo de Consentimento
                  </label>
                  <select
                    value={delivery.hasConsentForm}
                    onChange={(e) => setDelivery((prev) => ({ ...prev, hasConsentForm: e.target.value }))}
                    className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs"
                  >
                    <option value="Sim">Sim, termo assinado</option>
                    <option value="Não">Não utilizo termo</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* EIXO 5 — FINANCEIRO */}
        <div className="bg-white border-2 border-[var(--preto)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('E5')}
            className="w-full bg-emerald-50 hover:bg-emerald-100 p-4 flex items-center justify-between cursor-pointer transition-colors border-b border-neutral-200"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-mono text-xs font-bold flex items-center justify-center">
                E5
              </span>
              <div className="text-left">
                <h4 className="font-subtitle text-sm font-bold text-neutral-900">Eixo 5 — Financeiro & Custos</h4>
                <p className="text-[0.7rem] text-neutral-600">Faturamento, separação de inventário de custos e despesas fixas</p>
              </div>
            </div>
            {activeSection === 'E5' ? <ChevronUp className="w-5 h-5 text-neutral-700" /> : <ChevronDown className="w-5 h-5 text-neutral-700" />}
          </button>

          {activeSection === 'E5' && (
            <div className="p-4 sm:p-6 space-y-6 bg-white">
              {/* REVENUE 3 MONTHS */}
              <div>
                <h5 className="text-xs font-subtitle font-bold text-neutral-800 uppercase tracking-wider mb-2">
                  Faturamento dos Últimos 3 Meses (R$)
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[0.7rem] font-bold text-neutral-700 mb-1">{monthLabels[0]}</label>
                    <input
                      type="number"
                      value={financial.revenueM1 || 0}
                      onChange={(e) => setFinancial((prev: any) => ({ ...prev, revenueM1: Number(e.target.value) || 0 }))}
                      className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.7rem] font-bold text-neutral-700 mb-1">{monthLabels[1]}</label>
                    <input
                      type="number"
                      value={financial.revenueM2 || 0}
                      onChange={(e) => setFinancial((prev: any) => ({ ...prev, revenueM2: Number(e.target.value) || 0 }))}
                      className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.7rem] font-bold text-neutral-700 mb-1">{monthLabels[2]}</label>
                    <input
                      type="number"
                      value={financial.revenueM3 || 0}
                      onChange={(e) => setFinancial((prev: any) => ({ ...prev, revenueM3: Number(e.target.value) || 0 }))}
                      className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* ITEM 4: SEPARAÇÃO ENTRE INVENTÁRIO E CUSTO DE FERRAMENTAS */}
              <div className="p-4 bg-amber-50/70 border-2 border-amber-300 rounded-xl space-y-4">
                <div>
                  <h5 className="text-xs font-subtitle font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-amber-800" />
                    Custos Individuais por Ferramenta Conhecida (Item 4)
                  </h5>
                  <p className="text-[0.72rem] text-amber-900 mt-0.5">
                    Para cada ferramenta identificada nos eixos anteriores, informe o valor mensal pago:
                  </p>
                </div>

                {knownToolsList.length > 0 ? (
                  <div className="space-y-3">
                    {knownToolsList.map((tool) => {
                      const currentCostObj = financial.tools.find((t: any) => t.name.toLowerCase() === tool.name.toLowerCase());
                      const currentVal = currentCostObj ? currentCostObj.monthlyCost : 0;

                      return (
                        <div key={tool.name} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-white border border-amber-200 rounded-lg shadow-2xs">
                          <div>
                            <span className="text-xs font-subtitle font-bold text-neutral-900 block">{tool.name}</span>
                            <span className="text-[0.65rem] text-neutral-500 uppercase font-mono">{tool.source}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-neutral-600">R$</span>
                            <input
                              type="number"
                              value={currentVal}
                              onChange={(e) => updateToolCost(tool.name, Number(e.target.value) || 0)}
                              placeholder="0"
                              className="w-28 bg-neutral-50 border border-neutral-300 rounded p-1.5 text-xs font-bold text-right"
                            />
                            <span className="text-xs text-neutral-500 font-mono">/mês</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-amber-800 font-body italic">
                    Nenhuma ferramenta de software foi mapeada anteriormente. Você pode adicionar abaixo.
                  </p>
                )}

                {/* ADD EXTRA TOOL OR WEBSITE */}
                <div className="pt-3 border-t border-amber-200/80 space-y-2">
                  <span className="text-xs font-subtitle font-bold text-amber-950 block">
                    Fora essas, paga por mais alguma ferramenta ou pelo seu site?
                  </span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={newToolName}
                      onChange={(e) => setNewToolName(e.target.value)}
                      placeholder="Nome da ferramenta / site (ex: Hospedagem Site, Canva)"
                      className="flex-1 bg-white border border-neutral-300 rounded p-2 text-xs"
                    />
                    <input
                      type="number"
                      value={newToolCost}
                      onChange={(e) => setNewToolCost(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="R$ / mês"
                      className="w-28 bg-white border border-neutral-300 rounded p-2 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddTool}
                      className="bg-amber-800 hover:bg-amber-900 text-white font-subtitle font-bold text-xs px-3 py-2 rounded flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>

              {/* OTHER OPERATIONAL COSTS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-1">
                    Aluguel do Espaço (R$/mês)
                  </label>
                  <input
                    type="number"
                    value={financial.rent}
                    onChange={(e) => setFinancial((prev: any) => ({ ...prev, rent: Number(e.target.value) || 0, hasRent: Number(e.target.value) > 0 }))}
                    className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-1">
                    Honorários da Contabilidade (R$/mês)
                  </label>
                  <input
                    type="number"
                    value={financial.accountant}
                    onChange={(e) => setFinancial((prev: any) => ({ ...prev, accountant: Number(e.target.value) || 0, hasAccountant: Number(e.target.value) > 0 }))}
                    className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-1">
                    Anuidade CRN / Conselho (R$/mês equivalente)
                  </label>
                  <input
                    type="number"
                    value={financial.crnFee}
                    onChange={(e) => setFinancial((prev: any) => ({ ...prev, crnFee: Number(e.target.value) || 0 }))}
                    className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-subtitle font-bold text-neutral-800 mb-1">
                    Anúncios Pagos / Tráfego (R$/mês)
                  </label>
                  <input
                    type="number"
                    value={financial.paidAdsCost}
                    onChange={(e) => setFinancial((prev: any) => ({ ...prev, paidAdsCost: Number(e.target.value) || 0 }))}
                    className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* EIXO 6 — EQUIPE */}
        <div className="bg-white border-2 border-[var(--preto)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('E6')}
            className="w-full bg-emerald-50 hover:bg-emerald-100 p-4 flex items-center justify-between cursor-pointer transition-colors border-b border-neutral-200"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-mono text-xs font-bold flex items-center justify-center">
                E6
              </span>
              <div className="text-left">
                <h4 className="font-subtitle text-sm font-bold text-neutral-900">Eixo 6 — Equipe & Pessoas</h4>
                <p className="text-[0.7rem] text-neutral-600">Membros da equipe, funções delegadas e folha de custo</p>
              </div>
            </div>
            {activeSection === 'E6' ? <ChevronUp className="w-5 h-5 text-neutral-700" /> : <ChevronDown className="w-5 h-5 text-neutral-700" />}
          </button>

          {activeSection === 'E6' && (
            <div className="p-4 sm:p-6 space-y-5 bg-white">
              {cleanMembers.length > 0 ? (
                <div className="space-y-3">
                  <h5 className="text-xs font-subtitle font-bold text-neutral-800 uppercase tracking-wider">
                    Membros Mapeados na Equipe ({cleanMembers.length})
                  </h5>
                  {cleanMembers.map((m) => (
                    <div key={m.id} className="p-3.5 bg-neutral-50 border border-neutral-300 rounded-xl flex items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-subtitle font-bold text-neutral-900 block">{m.name}</span>
                        <span className="text-[0.68rem] text-neutral-600 font-body">Cargo / Função: {m.role || 'Auxiliar'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-emerald-800">
                          R$ {(m.monthlyCost || 0).toLocaleString('pt-BR')}/mês
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(m.id)}
                          className="text-rose-600 hover:text-rose-800 cursor-pointer p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-600 italic">Nenhum membro de equipe cadastrado além de você.</p>
              )}

              {/* ADD NEW TEAM MEMBER */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3">
                <span className="text-xs font-subtitle font-bold text-emerald-950 block">
                  Adicionar Novo Membro na Equipe
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="Nome da pessoa"
                    className="bg-white border border-neutral-300 rounded p-2 text-xs"
                  />
                  <input
                    type="text"
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    placeholder="Cargo / Função (ex: Recepção)"
                    className="bg-white border border-neutral-300 rounded p-2 text-xs"
                  />
                  <input
                    type="number"
                    value={newMemberCost}
                    onChange={(e) => setNewMemberCost(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Custo mensal R$"
                    className="bg-white border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-subtitle font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Cadastrar Membro na Equipe
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
