import React, { useState } from 'react';
import { SectionTopic, Button } from './UIPrimitives';
import { SimulationState } from '../types';
import {
  Calendar,
  Check,
  Sparkles,
  Send,
  Copy,
  Users,
  Lock,
  Unlock,
  CheckCircle2,
  Gift,
  Clock,
  MessageSquare,
  ArrowRight,
  ShoppingBag,
  Zap,
  TrendingUp,
  Layers,
  Award,
  ShieldCheck,
  BadgePercent,
  X,
  Maximize2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

interface PricingSectionProps {
  onOpenBooking: () => void;
  onToast: (msg: string) => void;
}

const A3_STAGES = [
  {
    stageNumber: '01',
    title: 'MÊS 1 — DIAGNÓSTICO PROFUNDO & PLANO MESTRE',
    period: 'Semanas 1 a 4',
    badge: 'Fase de Ativação',
    badgeBg: 'bg-[var(--accent-tint)] text-[var(--exodo-red)] border-[var(--exodo-red)]',
    microProducts: [
      {
        id: 'mp-1',
        number: '#01',
        title: 'Mapeamento Diagnóstico 360° em 23 Indicadores',
        tag: 'Diagnóstico Comercial & Operacional',
        desc: 'Mapeamento completo dos gargalos financeiros, precificação, taxa de conversão e rotinas da recepção da sua clínica.',
        valueAnchor: 'R$ 750,00',
        icon: TrendingUp,
      },
      {
        id: 'mp-2',
        number: '#02',
        title: 'Ritual Individual #01 — Alinhamento Estratégico',
        tag: 'Encontro Ao Vivo 45 min',
        desc: 'Reunião individual com o estrategista Êxodo para definição do Alvo Financeiro Trimestral e prioridades absolutas.',
        valueAnchor: 'R$ 600,00',
        icon: Calendar,
      },
      {
        id: 'mp-3',
        number: '#03',
        title: 'Plano Mestre de Ação Trimestral Customizado',
        tag: 'Direcionamento Tático',
        desc: 'Documento executivo com o mapa de execução semana a semana das ações que gerarão caixa imediato.',
        valueAnchor: 'R$ 800,00',
        icon: Layers,
      }
    ]
  },
  {
    stageNumber: '02',
    title: 'MÊS 2 — ACELERAÇÃO DE VENDAS & RITUAIS DE GESTÃO',
    period: 'Semanas 5 a 8',
    badge: 'Fase de Execução',
    badgeBg: 'bg-[var(--cinza-claro)] text-[var(--preto)] border-[var(--border-default)]',
    microProducts: [
      {
        id: 'mp-4',
        number: '#04',
        title: 'Ritual Individual #02 — Reavaliação de Funil & Vendas',
        tag: 'Encontro Ao Vivo 45 min',
        desc: 'Encontro individual para ajustar a captação de pacientes, scripts da recepção e contorno de objeções de preço.',
        valueAnchor: 'R$ 600,00',
        icon: Zap,
      },
      {
        id: 'mp-5',
        number: '#05',
        title: 'Ritual Mensal de Gestão de Resultados',
        tag: 'Governança & DRE',
        desc: 'Análise detalhada do fechamento do Mês 1, margem de lucro por consulta e metas de remarcação.',
        valueAnchor: 'R$ 450,00',
        icon: Award,
      },
      {
        id: 'mp-6',
        number: '#06',
        title: '12 Semanas de Acompanhamento WhatsApp Ativo',
        tag: 'Acompanhamento Contínuo',
        desc: 'Canal direto via WhatsApp com o consultor para validação de decisões, revisão de copys e suporte diário.',
        valueAnchor: 'R$ 900,00',
        icon: MessageSquare,
      }
    ]
  },
  {
    stageNumber: '03',
    title: 'MÊS 3 — CONSOLIDAÇÃO, AUTONOMIA & PREPARAÇÃO PÓS-A3',
    period: 'Semanas 9 a 12',
    badge: 'Fase de Consolidação',
    badgeBg: 'bg-[var(--cinza-claro)] text-[var(--preto)] border-[var(--border-default)]',
    microProducts: [
      {
        id: 'mp-7',
        number: '#07',
        title: 'Ritual Individual #03 — Encerramento de Ciclo & Balanço',
        tag: 'Encontro Ao Vivo 45 min',
        desc: 'Reunião individual para auditoria dos resultados do trimestre, validação do crescimento e projeções futuras.',
        valueAnchor: 'R$ 600,00',
        icon: Calendar,
      },
      {
        id: 'mp-8',
        number: '#08',
        title: 'Relatório Executivo de Desempenho Trimestral',
        tag: 'Certificação de Métricas',
        desc: 'Dossiê consolidado com todos os avanços financeiros, operacionais e de equipe alcançados nos 90 dias.',
        valueAnchor: 'R$ 400,00',
        icon: CheckCircle2,
      },
      {
        id: 'mp-9',
        number: '#09',
        title: 'Acesso ao Simulador Personalizado de Continuidade',
        tag: 'Autonomia Decisória',
        desc: 'Ferramenta interativa para dimensionar a manutenção dos rituais ou transição para a Comunidade pós-A3.',
        valueAnchor: 'R$ 300,00',
        icon: Sparkles,
      },
      {
        id: 'mp-10',
        number: '#10',
        title: 'Licença de Uso do ÊXODO Intelligence (I.A. Nutri)',
        tag: 'Tecnologia Proprietária',
        desc: 'Acesso completo ao copiloto de I.A. treinado para criar protocolos, analisar exames e acelerar a rotina clínica.',
        valueAnchor: 'R$ 300,00',
        icon: Zap,
      },
      {
        id: 'mp-11',
        number: '#11',
        title: 'Biblioteca de SOPs, Scripts de Recepção & Frameworks',
        tag: 'Ferramental de Pronta Entrega',
        desc: 'Acesso a scripts testados de vendas, modelos de contrato, planilhas de DRE e protocolos operacionais.',
        valueAnchor: 'R$ 400,00',
        icon: Layers,
      },
      {
        id: 'mp-12',
        number: '#12',
        title: 'Comunidade VIP Êxodo & Rede de Gestores de Elite',
        tag: 'Networking de Alto Nível',
        desc: 'Acesso ao grupo exclusivo de nutricionistas e gestores para troca de experiências, benchmark e parcerias.',
        valueAnchor: 'R$ 380,00',
        icon: Users,
      }
    ]
  }
];

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenBooking, onToast }) => {
  const [isUnboxingOpen, setIsUnboxingOpen] = useState(false);
  const [isJornadaOpen, setIsJornadaOpen] = useState(false);

  const [simState, setSimState] = useState<SimulationState>({
    duration: 180, // Default to 180 days (Recomendado)
    rituals: 1,
    teamRituals: 0,
    supportFrequency: 2,
    teamSupportFrequency: 0,
    sosCount: 1,
  });

  // Tabela de Preços e Valores Internos do Simulador (Recalibrados)
  const BASE_FEE = 240; // R$ 240,00 / mês
  const RITUAL_PRICE = 379; // R$ 379,00 / ritual Nutri
  const TEAM_RITUAL_PRICE = 189.50; // R$ 189,50 / ritual Equipe
  const SUPPORT_PRICE = 94.75; // R$ 94,75 / frequência Nutri no mês (1x = 94,75, 2x = 189,50, 3x = 284,25)
  const TEAM_SUPPORT_PRICE = 94.75; // R$ 94,75 / frequência Equipe no mês
  const SOS_PRICE = 189.50; // R$ 189,50 / acionamento SOS no mês

  const DURATION_DISCOUNTS: Record<number, number> = {
    60: 0,
    90: 0.03,
    180: 0.08,
    360: 0.15,
    720: 0.25,
  };

  // Auto-scroll helper
  const scrollToStep = (stepId: string) => {
    setTimeout(() => {
      const el = document.getElementById(stepId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  // Calculations
  const months = simState.duration / 30; // 2, 3, 6, 12, or 24
  const weeks = Math.round(simState.duration / 7);

  // Bonus Quarter Diagnostics count (1 per 90 days)
  const bonusDiagnosticos = Math.floor(simState.duration / 90);

  // Effective Team Rituals and Team Support (Gated at duration >= 180)
  const isTeamUnlocked = simState.duration >= 180;
  const activeTeamRituals = isTeamUnlocked ? simState.teamRituals : 0;
  const activeTeamSupport = isTeamUnlocked ? simState.teamSupportFrequency : 0;

  // 360 and 720 Days Special Plan Bonuses
  const is360Plan = simState.duration === 360;
  const is720Plan = simState.duration === 720;

  // Nutri Support Bonus (720d gives 2x/week Nutri WhatsApp free)
  const bonusNutriSupportFreq = is720Plan ? 2 : 0;
  const effectiveNutriSupportFreq = Math.max(bonusNutriSupportFreq, simState.supportFrequency);
  const chargedNutriSupportFreq = Math.max(0, effectiveNutriSupportFreq - bonusNutriSupportFreq);

  // Team Support Bonus (720d gives 2x/week Team WhatsApp free; 180d+ with 1+ team rituals gives 1x/week free)
  const hasTeamRitualBonus = isTeamUnlocked && activeTeamRituals >= 1;
  const bonusTeamSupportFreq = is720Plan ? 2 : (hasTeamRitualBonus ? 1 : 0);
  const effectiveTeamSupportFreq = isTeamUnlocked ? Math.max(bonusTeamSupportFreq, activeTeamSupport) : 0;
  const chargedTeamSupportFreq = isTeamUnlocked ? Math.max(0, effectiveTeamSupportFreq - bonusTeamSupportFreq) : 0;

  // SOS Bonus (360d gives 4 calls free; 720d gives 6 calls free)
  const bonusSosCalls = is720Plan ? 6 : (is360Plan ? 4 : 0);
  const maxSosAllowed = simState.duration <= 90 ? 3 : (is720Plan ? 6 : 4);
  const effectiveSosCount = Math.max(bonusSosCalls, Math.min(simState.sosCount, maxSosAllowed));
  const chargedSosCount = Math.max(0, effectiveSosCount - bonusSosCalls);

  // Component breakdown per month
  const monthlyBaseCost = BASE_FEE;
  const monthlyNutriRitualsCost = simState.rituals * RITUAL_PRICE;
  const monthlyTeamRitualsCost = activeTeamRituals * TEAM_RITUAL_PRICE;
  const monthlyNutriSupportCost = chargedNutriSupportFreq * SUPPORT_PRICE;
  const monthlyTeamSupportCost = chargedTeamSupportFreq * TEAM_SUPPORT_PRICE;
  const monthlySosCost = chargedSosCount * SOS_PRICE;

  // Monthly raw subtotal
  const monthlyRawSubtotal =
    monthlyBaseCost +
    monthlyNutriRitualsCost +
    monthlyTeamRitualsCost +
    monthlyNutriSupportCost +
    monthlyTeamSupportCost +
    monthlySosCost;

  const totalRaw = monthlyRawSubtotal * months;
  const discountRate = DURATION_DISCOUNTS[simState.duration] || 0;
  const totalPrice = totalRaw * (1 - discountRate);
  const monthlyEquivalent = totalPrice / months;

  const totalNutriRituals = Math.round(simState.rituals * months);
  const totalTeamRituals = Math.round(activeTeamRituals * months);
  const totalNutriSupport = effectiveNutriSupportFreq * weeks;
  const totalTeamSupport = effectiveTeamSupportFreq * weeks;
  const totalSos = Math.round(effectiveSosCount * months);

  const formatCurrency = (val: number) =>
    `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const buildWhatsappMessage = () => {
    const lines = [
      'Olá! Montei meu plano de consultoria customizado no simulador Êxodo:',
      `• Prazo de Consultoria: ${simState.duration} dias (${months} meses)`,
      `• Rituais do Nutri/Gestor: ${totalNutriRituals} encontros de 45 min (${simState.rituals}/mês)`,
      isTeamUnlocked && activeTeamRituals > 0
        ? `• Rituais Táticos com Equipe: ${totalTeamRituals} encontros (${activeTeamRituals}/mês)`
        : '',
      `• Suporte WhatsApp Nutri: ${totalNutriSupport} contatos (${effectiveNutriSupportFreq}x/semana)${is720Plan ? ' [2x/sem Bônus 720d]' : ''}`,
      isTeamUnlocked && effectiveTeamSupportFreq > 0
        ? `• Rotina Tática WhatsApp Equipe: ${totalTeamSupport} contatos (${effectiveTeamSupportFreq}x/semana)${is720Plan ? ' [2x/sem Bônus 720d]' : hasTeamRitualBonus ? ' [1ª Freq. Grátis Bônus Equipe]' : ''}`
        : '',
      `• Seguro SOS Emergencial: ${totalSos} chamadas de 20 min (${effectiveSosCount}/mês)${is720Plan ? ' [6 Chamadas/mês Bônus]' : is360Plan ? ' [4 Chamadas/mês Bônus]' : ''}`,
      bonusDiagnosticos > 0
        ? `• 🎁 Bônus: ${bonusDiagnosticos} Diagnóstico(s) Trimestral(is) Extra(s) incluso(s)`
        : '',
      '• Benefícios Inclusos: Comunidade Êxodo + Área de Membros + ÊXODO Intelligence',
      `• Valor Total do Ciclo: ${formatCurrency(totalPrice)} (equiv. a ${formatCurrency(monthlyEquivalent)}/mês com ${Math.round(discountRate * 100)}% OFF)`,
      '',
      'Gostaria de agendar o Diagnóstico para apresentar meu plano e iniciar!'
    ].filter(Boolean);
    return encodeURIComponent(lines.join('\n'));
  };

  const handleSendWhatsapp = () => {
    const text = buildWhatsappMessage();
    const url = `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
    onToast('Simulação aberta no WhatsApp!');
  };

  const handleComunidadeWhatsapp = () => {
    const msg = encodeURIComponent('Olá! Concluí minha temporada do A3 e gostaria de me manter como participante da Comunidade Êxodo (R$ 349,00/mês) para ter acesso aos itens básicos e à rede.');
    window.open(`https://wa.me/?text=${msg}`, '_blank');
    onToast('Inscrição na Comunidade aberta no WhatsApp!');
  };

  const handleCopyBudget = () => {
    const text = decodeURIComponent(buildWhatsappMessage());
    navigator.clipboard.writeText(text);
    onToast('Orçamento copiado para a área de transferência!');
  };

  return (
    <section id="preco" className="py-10 sm:py-16 md:py-24 border-b border-[var(--border-default)] bg-[var(--branco)]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 md:px-12">
        <SectionTopic label="Investimento & Esteira">
          Jornada de Transformação & Esteira Êxodo
        </SectionTopic>

        {/* ========================================================= */}
        {/* SHOPPING CART / UNBOXING EXPERIENCE BANNER FOR A3 */}
        {/* ========================================================= */}
        <div className="mt-8 md:mt-10 mb-14 flex flex-col gap-8">
          
          {/* Main Unboxing Hero Card */}
          <div className="bg-[var(--preto)] text-white p-6 sm:p-8 md:p-10 border-2 border-[var(--exodo-red)] relative overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[var(--exodo-red)] opacity-10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Top Bar: Shopping Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-5 mb-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-[var(--exodo-red)] text-white font-subtitle font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Porta de Entrada Obrigatória</span>
                </span>
                <span className="px-2.5 py-1 bg-transparent text-white border border-white/40 font-subtitle font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                  <BadgePercent className="w-3.5 h-3.5" />
                  <span>Pacote Completo 67% OFF</span>
                </span>
              </div>
              
              <button
                onClick={() => setIsUnboxingOpen(true)}
                className="flex items-center gap-2 text-xs font-subtitle text-[var(--exodo-red)] hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 px-3 py-1.5 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[var(--exodo-red)] shrink-0" />
                <span><strong>12 Entregas Inclusas</strong> — Abrir Unboxing completo</span>
                <Maximize2 className="w-3.5 h-3.5 text-neutral-400 ml-1" />
              </button>
            </div>

            {/* Title & Price Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
              <div className="lg:col-span-7 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-subtitle text-[var(--exodo-red)] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>A3 — Acompanhamento Estratégico Trimestral (90 Dias)</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-white m-0 leading-tight">
                  Tudo que você precisa para profissionalizar a gestão da sua clínica
                </h3>
                <p className="font-body text-xs sm:text-sm text-neutral-300 m-0 mt-1 leading-relaxed">
                  Todo nutricionista começa obrigatoriamente por esta temporada inicial. Um ecossistema completo de <strong>12 entregas táticas</strong> projetadas para gerar caixa, alinhar sua equipe e estruturar seus processos.
                </p>
              </div>

              {/* Price Tag Box */}
              <div className="lg:col-span-5 bg-neutral-900/90 border border-neutral-700 p-6 flex flex-col justify-center items-center text-center relative shadow-inner">
                <div className="absolute -top-3 bg-[var(--exodo-red)] text-white font-subtitle text-[0.65rem] uppercase font-bold tracking-wider px-3 py-0.5">
                  💡 Apenas ~R$ 19,90/dia!
                </div>

                <span className="font-subtitle text-xs text-neutral-400 uppercase tracking-wider block mb-1">
                  Investimento no A3 (90 Dias)
                </span>

                <div className="flex items-baseline justify-center gap-1.5 my-1">
                  <span className="font-subtitle text-lg text-[var(--exodo-red)] font-bold">3x de</span>
                  <span className="font-display text-4xl sm:text-5xl text-white font-bold tracking-tight">
                    R$ 599,66
                  </span>
                  <span className="font-subtitle text-xs text-neutral-400">/mês</span>
                </div>

                <div className="flex flex-col items-center gap-1 mt-2">
                  <span className="font-subtitle text-xs text-neutral-300 font-medium">
                    ou <strong>R$ 1.799,00 à vista no PIX</strong> (sem juros no cartão)
                  </span>
                  <div className="mt-2 pt-2 border-t border-neutral-800 w-full flex items-center justify-between text-[0.7rem] text-neutral-400">
                    <span className="line-through text-neutral-500">Valor avulso: R$ 5.480,00</span>
                    <span className="text-[var(--exodo-red)] font-bold bg-[var(--preto)] px-2 py-0.5 border border-[var(--cinza-escuro)]">
                      Economia de R$ 3.681,00
                    </span>
                  </div>
                </div>

                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={onOpenBooking} 
                  className="w-full mt-5 justify-center py-3.5 bg-[var(--exodo-red)] hover:bg-[var(--preto)] text-white font-bold"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Agendar Diagnóstico & Garantir o A3</span>
                </Button>
              </div>
            </div>

            {/* Micro-Product Counters Grid - CLICKABLE UNBOXING BUTTON */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-neutral-800 text-center">
              <button
                onClick={() => setIsUnboxingOpen(true)}
                className="bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 hover:border-[var(--exodo-red)] p-3.5 transition-all cursor-pointer group text-left flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl text-white">12 Entregas</span>
                  <Maximize2 className="w-4 h-4 text-[var(--exodo-red)] group-hover:scale-110 transition-transform" />
                </div>
                <span className="font-subtitle text-[0.65rem] text-[var(--exodo-red)] font-bold uppercase tracking-wider block mt-1">
                  Clique p/ ver o Unboxing
                </span>
              </button>

              <div className="bg-neutral-900/50 p-3.5 border border-neutral-800 text-left flex flex-col justify-between">
                <span className="font-display text-xl text-white block">3 Encontros</span>
                <span className="font-subtitle text-[0.65rem] text-neutral-400 uppercase tracking-wider block mt-1">Ao Vivo (45 min cada)</span>
              </div>

              <div className="bg-neutral-900/50 p-3.5 border border-neutral-800 text-left flex flex-col justify-between">
                <span className="font-display text-xl text-white block">12 Semanas</span>
                <span className="font-subtitle text-[0.65rem] text-neutral-400 uppercase tracking-wider block mt-1">Acompanhamento WhatsApp</span>
              </div>

              <div className="bg-neutral-900/50 p-3.5 border border-neutral-800 text-left flex flex-col justify-between">
                <span className="font-display text-xl text-[var(--exodo-red)] block">IA + SOPs</span>
                <span className="font-subtitle text-[0.65rem] text-neutral-400 uppercase tracking-wider block mt-1">Acesso Imediato Bônus</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* VISUAL TIMELINE / UNBOXING JOURNEY OF 12 ENTREGAS */}
          {/* ========================================================= */}
          <div className="bg-[var(--surface-card)] border border-[var(--border-default)] p-5 sm:p-7 md:p-8 relative">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-[var(--border-default)]">
              <div>
                <span className="font-subtitle font-bold text-xs text-[var(--exodo-red)] uppercase tracking-wider block mb-1">
                  JORNADA DE ENTREGAS CONTINUADAS
                </span>
                <h4 className="font-display text-xl sm:text-2xl md:text-3xl text-[var(--text-primary)] m-0">
                  Unboxing do A3: Conheça as 12 Entregas Inclusas
                </h4>
                <p className="font-body text-xs sm:text-sm text-[var(--text-secondary)] mt-1 m-0">
                  {isJornadaOpen
                    ? 'Navegue pela linha do tempo dos seus 90 dias e veja tudo o que você recebe ao garantir o seu A3:'
                    : 'Confira as 12 entregas estratégicas projetadas para os primeiros 90 dias do seu negócio.'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap w-full sm:w-auto">
                <button
                  onClick={() => setIsJornadaOpen(!isJornadaOpen)}
                  className="bg-[var(--exodo-red)] hover:bg-[var(--preto)] text-white font-subtitle font-bold text-xs uppercase tracking-wide px-4 py-3 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs w-full sm:w-auto"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span>{isJornadaOpen ? 'Ocultar Jornada' : 'Ver Jornada de Entregas (12/12)'}</span>
                  {isJornadaOpen ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                </button>

                <button
                  onClick={() => setIsUnboxingOpen(true)}
                  className="bg-[var(--branco)] hover:bg-neutral-100 text-[var(--text-primary)] border border-[var(--border-strong)] font-subtitle font-bold text-xs uppercase tracking-wide px-3.5 py-3 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  title="Abrir em modal pop-up"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[var(--exodo-red)] shrink-0" />
                  <span className="hidden sm:inline">Modal</span>
                </button>
              </div>
            </div>

            {/* Minimized Teaser Card when Closed */}
            {!isJornadaOpen ? (
              <div 
                onClick={() => setIsJornadaOpen(true)}
                className="mt-4 bg-[var(--branco)] border border-dashed border-[var(--border-strong)] hover:border-[var(--exodo-red)] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer transition-all group shadow-2xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-3 bg-red-50 text-[var(--exodo-red)] group-hover:bg-[var(--exodo-red)] group-hover:text-white transition-colors border border-red-100 shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-subtitle font-bold text-xs text-[var(--exodo-red)] uppercase tracking-wider block">
                        Jornada Minimizada (12 Entregas)
                      </span>
                      <span className="px-2 py-0.5 bg-[var(--accent-tint)] text-[var(--exodo-red)] font-subtitle font-bold text-[0.65rem] uppercase tracking-wider border border-[var(--exodo-red)]">
                        100% Inclusas no A3
                      </span>
                    </div>
                    <p className="font-body text-xs text-[var(--text-secondary)] m-0 mt-1">
                      Clique para expandir a visualização detalhada do cronograma das 12 entregas contínuas nos 90 dias.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[var(--exodo-red)] font-subtitle font-bold text-xs uppercase tracking-wider group-hover:underline shrink-0">
                  <span>Expandir Entregáveis</span>
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </div>
              </div>
            ) : (
              /* Full Expanded Stepper Journey List */
              <div className="mt-8 animate-fadeIn">
                <div className="flex flex-col gap-10 relative">
                  {A3_STAGES.map((stage) => (
                    <div key={stage.stageNumber} className="relative pl-0 md:pl-6 border-l-0 md:border-l-2 md:border-[var(--border-strong)] flex flex-col gap-5">
                      
                      {/* Stage Header Indicator */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="flex items-center justify-center w-8 h-8 bg-[var(--preto)] text-white font-subtitle font-bold text-xs shrink-0">
                          {stage.stageNumber}
                        </span>
                        <h5 className="font-subtitle font-bold text-base md:text-lg text-[var(--text-primary)] m-0">
                          {stage.title}
                        </h5>
                        <span className="font-subtitle text-xs text-[var(--text-tertiary)] font-medium">
                          ({stage.period})
                        </span>
                        <span className={`font-subtitle text-[0.65rem] font-bold uppercase tracking-wider px-2.5 py-0.5 border ${stage.badgeBg}`}>
                          {stage.badge}
                        </span>
                      </div>

                      {/* Micro-Products Grid for this Stage */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {stage.microProducts.map((mp) => {
                          const IconComp = mp.icon;
                          return (
                            <div 
                              key={mp.id} 
                              className="bg-[var(--branco)] border border-[var(--border-default)] hover:border-[var(--exodo-red)] p-5 flex flex-col justify-between transition-all duration-200 shadow-xs group"
                            >
                              <div>
                                {/* Card Top Meta */}
                                <div className="flex items-center justify-between gap-2 mb-3">
                                  <span className="font-subtitle font-extrabold text-[0.65rem] tracking-wider text-[var(--exodo-red)] bg-red-50 px-2 py-0.5 border border-red-100">
                                    ENTREGA {mp.number}
                                  </span>
                                  <span className="font-body text-[0.65rem] text-neutral-400 line-through">
                                    Val. {mp.valueAnchor}
                                  </span>
                                </div>

                                {/* Icon & Title */}
                                <div className="flex items-start gap-3 mb-2">
                                  <div className="p-2 bg-[var(--surface-card)] text-[var(--exodo-red)] group-hover:bg-[var(--exodo-red)] group-hover:text-white transition-colors duration-200 shrink-0 border border-[var(--border-default)]">
                                    <IconComp className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <h6 className="font-subtitle font-bold text-sm text-[var(--text-primary)] leading-snug m-0">
                                      {mp.title}
                                    </h6>
                                    <span className="font-subtitle text-[0.65rem] text-[var(--text-tertiary)] uppercase block mt-0.5">
                                      {mp.tag}
                                    </span>
                                  </div>
                                </div>

                                {/* Description */}
                                <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mt-2 m-0">
                                  {mp.desc}
                                </p>
                              </div>

                              {/* Card Bottom Included Tag */}
                              <div className="mt-4 pt-3 border-t border-[var(--border-default)] flex items-center justify-between text-xs">
                                <span className="font-subtitle font-bold text-[0.7rem] text-[var(--exodo-red)] flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--exodo-red)] shrink-0" />
                                  <span>INCLUSO NO PACOTE A3</span>
                                </span>
                                <span className="font-subtitle font-bold text-[0.65rem] text-[var(--exodo-red)] bg-[var(--accent-tint)] px-1.5 py-0.5 border border-[var(--exodo-red)]">
                                  R$ 0,00 (100% OFF)
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Unboxing Footer Summary Bar */}
                <div className="mt-10 bg-[var(--branco)] border-2 border-[var(--exodo-red)] p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[var(--accent-tint)] text-[var(--exodo-red)] shrink-0">
                      <Gift className="w-6 h-6 text-[var(--exodo-red)]" />
                    </div>
                    <div>
                      <strong className="font-subtitle text-sm text-[var(--preto)] block">
                        🎉 Resumo da Oferta: 12 Entregas pelo preço de um único diagnóstico!
                      </strong>
                      <span className="font-body text-xs text-[var(--exodo-red)] block mt-0.5">
                        Valor total acumulado dos entregáveis: R$ 5.480,00 → Você investe apenas 3x de R$ 599,66 (R$ 1.799,00 à vista).
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button 
                      variant="tertiary" 
                      size="md" 
                      onClick={() => setIsUnboxingOpen(true)} 
                      className="shrink-0 text-xs font-bold border-[var(--exodo-red)] text-[var(--preto)] hover:bg-[var(--accent-tint)]"
                    >
                      <Maximize2 className="w-3.5 h-3.5 mr-1" />
                      <span>Ver Modal Unboxing</span>
                    </Button>
                    <Button 
                      variant="primary" 
                      size="lg" 
                      onClick={onOpenBooking} 
                      className="shrink-0 w-full md:w-auto bg-[var(--exodo-red)] hover:bg-[var(--preto)] text-white font-bold"
                    >
                      <Calendar className="w-4 h-4 mr-1.5" />
                      <span>Garantir Minhas 12 Entregas</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* DECISION POINT: PREPARING FOR POST-A3 CONTINUITY */}
          {/* ========================================================= */}
          <div className="bg-[var(--branco)] border border-[var(--border-strong)] p-6 md:p-8">
            <div className="flex flex-col gap-2 mb-6">
              <span className="font-subtitle font-bold text-xs text-[var(--exodo-red)] uppercase tracking-wider">
                Caminhos Após Concluir a Temporada do A3
              </span>
              <h4 className="font-display text-xl md:text-2xl text-[var(--text-primary)] m-0">
                O que acontece no 91º dia, após concluir o A3?
              </h4>
              <p className="font-body text-xs sm:text-sm text-[var(--text-secondary)] m-0">
                Após viver a experiência completa do A3, sua clínica terá processos e metas consolidados. Você escolhe livremente como deseja prosseguir:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option A: Custom Consultoria Continuada */}
              <div className="bg-[var(--surface-card)] border border-[var(--border-default)] p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-subtitle font-bold text-[0.65rem] uppercase tracking-wider px-2 py-0.5 bg-[var(--accent-tint)] text-[var(--exodo-red)] border border-[var(--border-strong)]">
                      CAMINHO A — CONSULTORIA CONTINUADA
                    </span>
                    <span className="font-subtitle text-xs text-[var(--exodo-red)] font-bold bg-[var(--accent-tint)] px-2 py-0.5 border border-[var(--exodo-red)]">
                      Rituais + Acompanhamento
                    </span>
                  </div>

                  <h5 className="font-subtitle font-bold text-base text-[var(--text-primary)] m-0 mb-1">
                    Simulador de Consultoria sob Medida
                  </h5>
                  <p className="font-body text-xs text-[var(--text-secondary)] m-0 mb-4 leading-relaxed">
                    Personalize o próximo ciclo de acompanhamento escolhendo a frequência exata de encontros individuais e pontos de contato de WhatsApp com você e sua equipe.
                  </p>

                  <ul className="flex flex-col gap-2 text-xs text-[var(--text-primary)] mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[var(--exodo-red)] shrink-0" />
                      <span>Rituais táticos individuais (1x/mês, 2x/mês ou 4x/mês)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[var(--exodo-red)] shrink-0" />
                      <span>Rotina de WhatsApp com equipe e recepcionistas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[var(--exodo-red)] shrink-0" />
                      <span>Seguro SOS emergencial e bônus de re-diagnósticos</span>
                    </li>
                  </ul>
                </div>

                <a 
                  href="#simulador" 
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToStep('simulador');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--preto)] text-white font-subtitle font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[var(--exodo-red)]" />
                  <span>Usar Simulador Pós-A3</span>
                </a>
              </div>

              {/* Option B: Comunidade Êxodo (Acessos Básicos) */}
              <div className="bg-[var(--surface-card)] border border-[var(--border-default)] p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-subtitle font-bold text-[0.65rem] uppercase tracking-wider px-2 py-0.5 bg-neutral-200 text-neutral-800 border border-neutral-300">
                      CAMINHO B — APENAS COMUNIDADE
                    </span>
                    <span className="font-subtitle text-xs text-neutral-700 font-bold bg-neutral-100 px-2 py-0.5 border border-neutral-300">
                      R$ 349,00 /mês
                    </span>
                  </div>

                  <h5 className="font-subtitle font-bold text-base text-[var(--text-primary)] m-0 mb-1">
                    Comunidade Êxodo (Acessos Básicos)
                  </h5>
                  <p className="font-body text-xs text-[var(--text-secondary)] m-0 mb-4 leading-relaxed">
                    Ideal para quem deseja se manter conectado com a rede e utilizar as ferramentas da plataforma sem acompanhamento consultivo individual.
                  </p>

                  <ul className="flex flex-col gap-2 text-xs text-[var(--text-primary)] mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[var(--exodo-red)] shrink-0" />
                      <span>Acesso à Área de Membros, Gravações e SOPs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[var(--exodo-red)] shrink-0" />
                      <span>Rede de Nutricionistas & Comunidade no WhatsApp</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[var(--exodo-red)] shrink-0" />
                      <span>Uso contínuo do ÊXODO Intelligence (I.A. Nutri)</span>
                    </li>
                  </ul>
                </div>

                <Button variant="secondary" size="lg" onClick={handleComunidadeWhatsapp} className="w-full justify-center">
                  <Users className="w-4 h-4 mr-1.5" />
                  <span>Quero Apenas a Comunidade</span>
                </Button>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* RECALIBRATED SIMULATOR WITH EXPLICIT TABLE COST BREAKDOWN */}
        {/* ========================================================= */}
        <div id="simulador" className="bg-[var(--surface-card)] p-6 sm:p-8 md:p-12 mt-12 border border-[var(--border-default)] shadow-xs">
          <div className="max-w-[760px] mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent-tint)] border border-[var(--border-strong)] text-[var(--exodo-red)] text-xs font-subtitle font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulador de Continuidade Consultiva Pós-A3</span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl text-[var(--text-primary)] m-0 mb-3">
              Desenhe o seu próximo ciclo de consultoria customizado
            </h3>
            <p className="font-body text-xs sm:text-sm text-[var(--text-secondary)] m-0 leading-relaxed">
              Após concluir a temporada inicial do A3, utilize este simulador recalibrado com base na tabela oficial para ajustar o horizonte de prazo, rituais e frequências de suporte.
            </p>
          </div>

          <div className="flex flex-col gap-10">
            {/* ========================================================= */}
            {/* PASSO 01: Horizon & Duration */}
            {/* ========================================================= */}
            <div id="step-1" className="bg-[var(--branco)] border border-[var(--border-default)] p-6 md:p-8 flex flex-col gap-5 relative overflow-hidden scroll-mt-24">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-7 h-7 bg-[var(--preto)] text-[var(--branco)] font-subtitle font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <span className="font-subtitle font-bold text-[0.7rem] uppercase tracking-wider text-[var(--exodo-red)] block mb-1">
                    Passo 01 — Horizonte de Resultados & Previsibilidade (Prazo)
                  </span>
                  <h4 className="font-subtitle font-bold text-base md:text-lg text-[var(--text-primary)] m-0">
                    Qual o período ideal para consolidar a gestão e a cultura da sua clínica?
                  </h4>
                </div>
              </div>

              {/* Option Rows */}
              <div className="flex flex-col gap-3 mt-1">
                {[
                  {
                    d: 60,
                    title: '60 dias — Arrancada Rápida (2 Meses)',
                    badge: 'Sem Desconto (Preço Cheio)',
                    badgeColor: 'bg-neutral-100 text-neutral-600 border-neutral-300',
                    desc: 'Ajustes emergenciais de processos e caixa rápido. Ideal para quem precisa de validação imediata.',
                    benefits: [
                      '2 meses de consultoria ativa',
                      'Foco total em caixa rápido e emergência',
                      '🔒 WhatsApp exclusivo p/ Nutri (Sem suporte equipe)',
                      '🔒 Máximo de até 03 chamadas SOS'
                    ]
                  },
                  {
                    d: 90,
                    title: '90 dias — Ciclo Trimestral Clássico (3 Meses)',
                    badge: '3% de Desconto Progressivo',
                    badgeColor: 'bg-[var(--cinza-claro)] text-[var(--cinza-escuro)] border-[var(--border-default)]',
                    desc: 'O tempo perfeito para implementar uma nova rotina tática e medir a evolução do faturamento.',
                    benefits: [
                      '3 meses de gestão acompanhada',
                      '🎁 Bônus: 1 Diagnóstico Trimestral Grátis',
                      '🔒 WhatsApp exclusivo p/ Nutri (Sem suporte equipe)',
                      '🔒 Máximo de até 03 chamadas SOS'
                    ]
                  },
                  {
                    d: 180,
                    title: '180 dias — Consolidação & Escala (6 Meses — Recomendado)',
                    badge: '8% OFF + Bônus Equipe Liberado',
                    badgeColor: 'bg-[var(--accent-tint)] text-[var(--exodo-red)] border-[var(--exodo-red)] font-bold',
                    desc: 'Tempo suficiente para que sua equipe trabalhe de forma autônoma sem depender de você para tudo.',
                    benefits: [
                      '6 meses de previsibilidade e acompanhamento',
                      '🎁 Bônus: 2 Diagnósticos Trimestrais Grátis (Inclusos sem custo)',
                      '🔓 Desbloqueia Rituais e Suporte WhatsApp com a Equipe',
                      '🔓 Até 4 chamadas SOS/mês'
                    ]
                  },
                  {
                    d: 360,
                    title: '360 dias — Gestão Anual de Elite (12 Meses)',
                    badge: '15% OFF + Bônus 4 SOS',
                    badgeColor: 'bg-[var(--cinza-claro)] text-[var(--preto)] border-[var(--border-strong)] font-bold',
                    desc: 'Transformação cultural profunda na clínica, com planejamento de expansão e governança plena.',
                    benefits: [
                      '12 meses de blindagem de gestão',
                      '🎁 Bônus: 4 Diagnósticos Trimestrais Grátis (Inclusos sem custo)',
                      '🎁 Bônus: 04 Chamadas do Seguro SOS Emergencial (Inclusas R$ 0)',
                      '🔓 Desbloqueia Rituais e Suporte WhatsApp com Equipe'
                    ]
                  },
                  {
                    d: 720,
                    title: '720 dias — Parceria de Longo Prazo (24 Meses)',
                    badge: '25% OFF + Combo Bônus Completo',
                    badgeColor: 'bg-[var(--cinza-claro)] text-[var(--preto)] border-[var(--border-strong)] font-bold',
                    desc: 'Parceria continuada para clínicas consolidadas que buscam liderança de mercado regional.',
                    benefits: [
                      '24 meses de consultoria contínua',
                      '🎁 Bônus: 8 Diagnósticos Trimestrais Grátis (Inclusos sem custo)',
                      '🎁 Bônus: 06 Chamadas de Seguro SOS Emergencial (Inclusas R$ 0)',
                      '🎁 Bônus: Suporte WhatsApp Nutri 2x/semana Incluso (R$ 0)',
                      '🎁 Bônus: Acompanhamento WhatsApp Equipe 2x/semana Incluso (R$ 0)',
                      '🔓 Desbloqueia Rituais com Equipe + 25% OFF Maior Desconto'
                    ]
                  }
                ].map((opt) => {
                  const active = simState.duration === opt.d;
                  return (
                    <button
                      key={opt.d}
                      onClick={() => {
                        setSimState((prev) => ({
                          ...prev,
                          duration: opt.d,
                          // Reset team rituals and team support if duration < 180
                          teamRituals: opt.d < 180 ? 0 : prev.teamRituals,
                          teamSupportFrequency: opt.d < 180 ? 0 : (opt.d === 720 ? Math.max(2, prev.teamSupportFrequency) : prev.teamSupportFrequency),
                          supportFrequency: opt.d === 720 ? Math.max(2, prev.supportFrequency) : prev.supportFrequency,
                          // SOS count auto adjustments
                          sosCount: opt.d <= 90 ? Math.min(prev.sosCount, 3) : (opt.d === 360 ? Math.max(4, prev.sosCount) : (opt.d === 720 ? 6 : prev.sosCount)),
                        }));
                        scrollToStep('step-2');
                      }}
                      className={`text-left p-4 sm:p-5 border transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer ${
                        active
                          ? 'border-2 border-[var(--exodo-red)] bg-red-50/20 shadow-xs'
                          : 'border-[var(--border-default)] hover:border-[var(--border-strong)] bg-[var(--branco)]'
                      }`}
                    >
                      <div className="flex flex-col gap-1.5 max-w-[620px]">
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="font-subtitle text-base text-[var(--text-primary)]">
                            {opt.title}
                          </strong>
                          <span className={`text-[0.65rem] font-subtitle uppercase tracking-wider px-2 py-0.5 border ${opt.badgeColor}`}>
                            {opt.badge}
                          </span>
                        </div>
                        <p className="font-body text-xs text-[var(--text-secondary)] m-0 leading-relaxed">
                          {opt.desc}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[0.7rem] font-subtitle text-[var(--text-tertiary)]">
                          {opt.benefits.map((b, i) => (
                            <span key={i} className="flex items-center gap-1 text-[var(--exodo-red)] font-medium">
                              <Check className="w-3 h-3 text-[var(--exodo-red)] shrink-0" />
                              <span>{b}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-3 self-end md:self-center">
                        <span className={`text-xs font-subtitle font-bold px-3 py-1.5 ${
                          active
                            ? 'bg-[var(--exodo-red)] text-white'
                            : 'bg-[var(--surface-card)] text-[var(--text-secondary)] border border-[var(--border-default)]'
                        }`}>
                          {active ? '✓ Selecionado' : 'Selecionar'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ========================================================= */}
            {/* PASSO 02: Nutri Individual Rituals */}
            {/* ========================================================= */}
            <div id="step-2" className="bg-[var(--branco)] border border-[var(--border-default)] p-6 md:p-8 flex flex-col gap-5 relative overflow-hidden scroll-mt-24">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-7 h-7 bg-[var(--preto)] text-[var(--branco)] font-subtitle font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-subtitle font-bold text-[0.7rem] uppercase tracking-wider text-[var(--exodo-red)] block">
                      Passo 02 — Rituais Estratégicos com Nutri / Gestor
                    </span>
                    <span className="text-[0.65rem] font-subtitle text-[var(--text-tertiary)] bg-neutral-100 px-2 py-0.5 border border-neutral-200 font-bold">
                      Valor Unitário: R$ 379,00 / ritual
                    </span>
                  </div>
                  <h4 className="font-subtitle font-bold text-base md:text-lg text-[var(--text-primary)] m-0">
                    Com qual frequência você quer se reunir individualmente (45 min ao vivo) para alinhar metas e estratégias?
                  </h4>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-1">
                {[
                  { r: 1, title: '1 Encontro / mês', badge: 'Essencial', cost: 'R$ 379,00/mês', desc: '1 reunião de 45 min por mês para checagem e alinhamento do plano.' },
                  { r: 2, title: '2 Encontros / mês', badge: 'Recomendado', cost: 'R$ 758,00/mês', desc: '1 reunião a cada 15 dias. Ritmo acelerado de tomadas de decisão.' },
                  { r: 3, title: '3 Encontros / mês', badge: 'Intensivo', cost: 'R$ 1.137,00/mês', desc: '1 reunião a cada 10 dias. Alta frequência de ajustes e cobrança.' },
                  { r: 4, title: '4 Encontros / mês', badge: 'Semanal Direto', cost: 'R$ 1.516,00/mês', desc: '1 encontro individual por semana. Acompanhamento tático em tempo real.' }
                ].map((opt) => {
                  const active = simState.rituals === opt.r;
                  const totalR = opt.r * months;
                  return (
                    <button
                      key={opt.r}
                      onClick={() => {
                        setSimState((prev) => ({ ...prev, rituals: opt.r }));
                        scrollToStep('step-3');
                      }}
                      className={`text-left p-4 border transition-all duration-200 flex flex-col justify-between gap-3 cursor-pointer ${
                        active
                          ? 'border-2 border-[var(--exodo-red)] bg-red-50/20 shadow-xs'
                          : 'border-[var(--border-default)] hover:border-[var(--border-strong)] bg-[var(--branco)]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <strong className="font-subtitle text-sm text-[var(--text-primary)]">
                            {opt.title}
                          </strong>
                          <span className="text-[0.6rem] font-subtitle uppercase tracking-wider px-1.5 py-0.5 bg-neutral-100 text-neutral-700 border border-neutral-300 font-bold">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="font-body text-xs text-[var(--text-secondary)] m-0 leading-snug">
                          {opt.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[var(--border-default)] flex items-center justify-between text-xs font-subtitle">
                        <div className="flex flex-col">
                          <span className="text-[var(--text-tertiary)] text-[0.65rem]">
                            Total: <strong>{totalR} reuniões</strong>
                          </span>
                          <span className="text-[0.65rem] text-[var(--exodo-red)] font-bold">
                            {opt.cost}
                          </span>
                        </div>
                        <span className={`font-bold text-[0.7rem] ${active ? 'text-[var(--exodo-red)]' : 'text-neutral-500'}`}>
                          {active ? '✓ Ativo' : 'Escolher'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ========================================================= */}
            {/* PASSO 03: Team Individual Rituals (Gated) */}
            {/* ========================================================= */}
            <div id="step-3" className="bg-[var(--branco)] border border-[var(--border-default)] p-6 md:p-8 flex flex-col gap-5 relative overflow-hidden scroll-mt-24">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-7 h-7 bg-[var(--preto)] text-[var(--branco)] font-subtitle font-bold text-xs shrink-0 mt-0.5">
                  3
                </span>
                <div className="w-full">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-subtitle font-bold text-[0.7rem] uppercase tracking-wider text-[var(--exodo-red)] block">
                        Passo 03 — Rituais Individualizados com a Equipe (Opcional)
                      </span>
                      <span className="text-[0.65rem] font-subtitle text-[var(--text-tertiary)] bg-neutral-100 px-2 py-0.5 border border-neutral-200 font-bold">
                        Valor Unitário: R$ 189,50 / ritual equipe
                      </span>
                    </div>
                    {!isTeamUnlocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[var(--cinza-claro)] text-[var(--cinza-escuro)] border border-[var(--border-default)] font-subtitle font-bold text-[0.65rem] uppercase tracking-wider">
                        <Lock className="w-3 h-3 text-[var(--cinza-medio)]" />
                        <span>Desbloqueado para Planos de 180+ dias</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[var(--accent-tint)] text-[var(--preto)] border border-[var(--exodo-red)] font-subtitle font-bold text-[0.65rem] uppercase tracking-wider">
                        <Unlock className="w-3 h-3 text-[var(--exodo-red)]" />
                        <span>Recurso Desbloqueado!</span>
                      </span>
                    )}
                  </div>
                  <h4 className="font-subtitle font-bold text-base md:text-lg text-[var(--text-primary)] m-0">
                    Quer reuniões do consultor diretamente com recepcionistas/secretárias para alinhar metas e comercial?
                  </h4>
                </div>
              </div>

              {!isTeamUnlocked ? (
                <div className="bg-[var(--cinza-claro)] border border-[var(--border-default)] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  <div className="flex items-start gap-2.5 text-[var(--preto)]">
                    <Lock className="w-4 h-4 text-[var(--cinza-medio)] shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-subtitle block text-[var(--preto)]">
                        🔒 Rituais de Equipe requerem maturidade de plano (180 dias ou mais).
                      </strong>
                      <span className="text-[var(--cinza-escuro)] text-[0.75rem] block mt-0.5">
                        Para alinhar secretárias e equipe comercial, selecione a opção de 180, 360 ou 720 dias no Passo 01.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSimState((prev) => ({ ...prev, duration: 180 }));
                      scrollToStep('step-3');
                    }}
                    className="shrink-0 px-3 py-2 bg-[var(--preto)] hover:bg-[var(--exodo-red)] text-white font-subtitle font-bold text-[0.7rem] uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Ativar 180 dias (Desbloquear)
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-1">
                  {[
                    { tr: 0, title: 'Nenhum Encontro Equipe', badge: 'Sem Equipe', cost: 'R$ 0,00/mês', desc: 'Somente você (nutri/gestor) participa das reuniões estratégicas.' },
                    { tr: 1, title: '1 Encontro / mês Equipe', badge: 'Alinhamento Mensal', cost: 'R$ 189,50/mês', desc: '1 reunião mensal do consultor diretamente com sua recepcionista.' },
                    { tr: 2, title: '2 Encontros / mês Equipe', badge: 'Quinzenal Equipe', cost: 'R$ 379,00/mês', desc: '1 reunião a cada 15 dias para alinhar scripts de vendas e metas.' },
                    { tr: 4, title: '4 Encontros / mês Equipe', badge: 'Semanal Equipe', cost: 'R$ 758,00/mês', desc: '1 reunião semanal com a equipe para cobrança rigorosa de conversão.' }
                  ].map((opt) => {
                    const active = simState.teamRituals === opt.tr;
                    const totalTR = opt.tr * months;
                    return (
                      <button
                        key={opt.tr}
                        onClick={() => {
                          setSimState((prev) => ({ ...prev, teamRituals: opt.tr }));
                          scrollToStep('step-4');
                        }}
                        className={`text-left p-4 border transition-all duration-200 flex flex-col justify-between gap-3 cursor-pointer ${
                          active
                            ? 'border-2 border-[var(--exodo-red)] bg-red-50/20 shadow-xs'
                            : 'border-[var(--border-default)] hover:border-[var(--border-strong)] bg-[var(--branco)]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <strong className="font-subtitle text-sm text-[var(--text-primary)]">
                              {opt.title}
                            </strong>
                            <span className="text-[0.6rem] font-subtitle uppercase tracking-wider px-1.5 py-0.5 bg-neutral-100 text-neutral-700 border border-neutral-300 font-bold">
                              {opt.badge}
                            </span>
                          </div>
                          <p className="font-body text-xs text-[var(--text-secondary)] m-0 leading-snug">
                            {opt.desc}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[var(--border-default)] flex items-center justify-between text-xs font-subtitle">
                          <div className="flex flex-col">
                            <span className="text-[var(--text-tertiary)] text-[0.65rem]">
                              Total: <strong>{totalTR} reuniões equipe</strong>
                            </span>
                            <span className="text-[0.65rem] text-[var(--exodo-red)] font-bold">
                              {opt.cost}
                            </span>
                          </div>
                          <span className={`font-bold text-[0.7rem] ${active ? 'text-[var(--exodo-red)]' : 'text-neutral-500'}`}>
                            {active ? '✓ Ativo' : 'Escolher'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ========================================================= */}
            {/* PASSO 04: Nutri WhatsApp Support Frequency */}
            {/* ========================================================= */}
            <div id="step-4" className="bg-[var(--branco)] border border-[var(--border-default)] p-6 md:p-8 flex flex-col gap-5 relative overflow-hidden scroll-mt-24">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-7 h-7 bg-[var(--preto)] text-[var(--branco)] font-subtitle font-bold text-xs shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-subtitle font-bold text-[0.7rem] uppercase tracking-wider text-[var(--exodo-red)] block">
                      Passo 04 — Suporte WhatsApp Nutri
                    </span>
                    <span className="text-[0.65rem] font-subtitle text-[var(--text-tertiary)] bg-neutral-100 px-2 py-0.5 border border-neutral-200 font-bold">
                      Valor Unitário: R$ 94,75 / frequência/mês
                    </span>
                  </div>
                  <h4 className="font-subtitle font-bold text-base md:text-lg text-[var(--text-primary)] m-0">
                    Com qual frequência você quer o consultor no WhatsApp para cobrar suas metas e tirar dúvidas?
                  </h4>
                </div>
              </div>

              {is720Plan && (
                <div className="bg-[var(--accent-tint)] border border-[var(--exodo-red)] p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-start gap-2 text-[var(--preto)]">
                    <Gift className="w-4 h-4 text-[var(--exodo-red)] shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-subtitle text-[var(--preto)] block">
                        🎁 REGRA DO BÔNUS 720 DIAS: Suporte WhatsApp Nutri 2x/semana é 100% Grátis!
                      </strong>
                      <span className="text-[var(--cinza-escuro)] text-[0.7rem] block mt-0.5">
                        O plano de 24 meses já inclui 2 disparos semanais de acompanhamento direto no seu WhatsApp sem nenhum custo adicional.
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 bg-[var(--exodo-red)] text-white font-subtitle font-bold text-[0.65rem] uppercase px-2 py-1">
                    Bônus 720d Ativo (R$ 0)
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                {[
                  {
                    s: 1,
                    title: '1x por semana',
                    badge: is720Plan ? 'Incluso Bônus' : 'Segunda de Metas',
                    cost: is720Plan ? 'R$ 0,00 (Bônus 720d)' : 'R$ 94,75/mês',
                    desc: 'Disparo toda segunda-feira com o plano de ação e prioridades da semana.'
                  },
                  {
                    s: 2,
                    title: '2x por semana',
                    badge: is720Plan ? 'Incluso Bônus 720d' : 'Segunda + Sexta',
                    cost: is720Plan ? 'R$ 0,00 (Bônus 720d)' : 'R$ 189,50/mês',
                    desc: 'Envio na segunda das prioridades + cobrança e prestação de contas na sexta.'
                  },
                  {
                    s: 3,
                    title: '3x por semana',
                    badge: 'Seg / Qua / Sex',
                    cost: is720Plan ? 'R$ 94,75/mês (+1 extra)' : 'R$ 284,25/mês',
                    desc: 'Presença constante durante a semana para acompanhamento próximo de métricas.'
                  }
                ].map((opt) => {
                  const active = effectiveNutriSupportFreq === opt.s;
                  const totalS = opt.s * weeks;
                  return (
                    <button
                      key={opt.s}
                      onClick={() => {
                        setSimState((prev) => ({ ...prev, supportFrequency: opt.s }));
                        scrollToStep('step-5');
                      }}
                      className={`text-left p-4 border transition-all duration-200 flex flex-col justify-between gap-3 cursor-pointer ${
                        active
                          ? 'border-2 border-[var(--exodo-red)] bg-red-50/20 shadow-xs'
                          : 'border-[var(--border-default)] hover:border-[var(--border-strong)] bg-[var(--branco)]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <strong className="font-subtitle text-sm text-[var(--text-primary)]">
                            {opt.title}
                          </strong>
                          <span className="text-[0.6rem] font-subtitle uppercase tracking-wider px-1.5 py-0.5 bg-neutral-100 text-neutral-700 border border-neutral-300 font-bold">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="font-body text-xs text-[var(--text-secondary)] m-0 leading-snug">
                          {opt.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[var(--border-default)] flex items-center justify-between text-xs font-subtitle">
                        <div className="flex flex-col">
                          <span className="text-[var(--text-tertiary)] text-[0.65rem]">
                            Total: <strong>{totalS} disparos</strong>
                          </span>
                          <span className="text-[0.65rem] text-[var(--exodo-red)] font-bold">
                            {opt.cost}
                          </span>
                        </div>
                        <span className={`font-bold text-[0.7rem] ${active ? 'text-[var(--exodo-red)]' : 'text-neutral-500'}`}>
                          {active ? '✓ Ativo' : 'Escolher'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ========================================================= */}
            {/* PASSO 05: Team WhatsApp Support Frequency */}
            {/* ========================================================= */}
            <div id="step-5" className="bg-[var(--branco)] border border-[var(--border-default)] p-6 md:p-8 flex flex-col gap-5 relative overflow-hidden scroll-mt-24">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-7 h-7 bg-[var(--preto)] text-[var(--branco)] font-subtitle font-bold text-xs shrink-0 mt-0.5">
                  5
                </span>
                <div className="w-full">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-subtitle font-bold text-[0.7rem] uppercase tracking-wider text-[var(--exodo-red)] block">
                        Passo 05 — Acompanhamento WhatsApp Equipe (Opcional)
                      </span>
                      <span className="text-[0.65rem] font-subtitle text-[var(--text-tertiary)] bg-neutral-100 px-2 py-0.5 border border-neutral-200 font-bold">
                        Valor Unitário: R$ 94,75 / freq extra/mês
                      </span>
                    </div>
                    {!isTeamUnlocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[var(--cinza-claro)] text-[var(--cinza-escuro)] border border-[var(--border-default)] font-subtitle font-bold text-[0.65rem] uppercase tracking-wider">
                        <Lock className="w-3 h-3 text-[var(--cinza-medio)]" />
                        <span>Indisponível para 60/90 Dias</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[var(--accent-tint)] text-[var(--preto)] border border-[var(--exodo-red)] font-subtitle font-bold text-[0.65rem] uppercase tracking-wider">
                        <Unlock className="w-3 h-3 text-[var(--exodo-red)]" />
                        <span>Recurso Desbloqueado!</span>
                      </span>
                    )}
                  </div>
                  <h4 className="font-subtitle font-bold text-base md:text-lg text-[var(--text-primary)] m-0">
                    Com qual frequência o consultor deve mandar mensagens e cobrar a sua recepcionista/secretária?
                  </h4>
                </div>
              </div>

              {!isTeamUnlocked ? (
                <div className="bg-[var(--cinza-claro)] border border-[var(--border-default)] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  <div className="flex items-start gap-2.5 text-[var(--preto)]">
                    <Lock className="w-4 h-4 text-[var(--cinza-medio)] shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-subtitle block text-[var(--preto)]">
                        🔒 Acompanhamento WhatsApp Equipe não está disponível nos planos de 60 e 90 dias.
                      </strong>
                      <span className="text-[var(--cinza-escuro)] text-[0.75rem] block mt-0.5">
                        Nos ciclos de 60 dias (Arrancada Rápida) e 90 dias (Ciclo Trimestral), o suporte via WhatsApp é exclusivo para você (Nutri/Gestor). Para incluir o acompanhamento tático de recepcionistas/secretárias, selecione um plano de 180 dias ou mais no Passo 01.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSimState((prev) => ({ ...prev, duration: 180 }));
                      scrollToStep('step-5');
                    }}
                    className="shrink-0 px-3 py-2 bg-[var(--preto)] hover:bg-[var(--exodo-red)] text-white font-subtitle font-bold text-[0.7rem] uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Ativar 180 dias (Desbloquear)
                  </button>
                </div>
              ) : (
                <>
                  {is720Plan ? (
                    <div className="flex flex-col gap-2">
                      <div className="bg-[var(--accent-tint)] border border-[var(--exodo-red)] p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-start gap-2 text-[var(--preto)]">
                          <Gift className="w-4 h-4 text-[var(--exodo-red)] shrink-0 mt-0.5" />
                          <div>
                            <strong className="font-subtitle text-[var(--preto)] block">
                              🎁 REGRA DO BÔNUS 720 DIAS: Acompanhamento WhatsApp Equipe 2x/semana é 100% Grátis!
                            </strong>
                            <span className="text-[var(--cinza-escuro)] text-[0.7rem] block mt-0.5">
                              O plano de 24 meses inclui 2 contatos semanais de acompanhamento e cobrança tática da sua recepcionista sem nenhum custo adicional.
                            </span>
                          </div>
                        </div>
                        <span className="shrink-0 bg-[var(--exodo-red)] text-white font-subtitle font-bold text-[0.65rem] uppercase px-2 py-1">
                          Bônus 720d Ativo (R$ 0)
                        </span>
                      </div>
                    </div>
                  ) : hasTeamRitualBonus ? (
                    <div className="flex flex-col gap-2">
                      <div className="bg-[var(--accent-tint)] border border-[var(--exodo-red)] p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-start gap-2 text-[var(--preto)]">
                          <Gift className="w-4 h-4 text-[var(--exodo-red)] shrink-0 mt-0.5" />
                          <div>
                            <strong className="font-subtitle text-[var(--preto)] block">
                              🎁 REGRA DO BÔNUS ATIVADA: 1ª Frequência do WhatsApp para sua Equipe é 100% Grátis!
                            </strong>
                            <span className="text-[var(--cinza-escuro)] text-[0.7rem] block mt-0.5">
                              Como você contratou 1+ Rituais com Equipe, o 1º disparo semanal no WhatsApp da recepcionista é Bônus sem nenhum custo. Frequências adicionais somam R$ 94,75/mês cada.
                            </span>
                          </div>
                        </div>
                        <span className="shrink-0 bg-[var(--exodo-red)] text-white font-subtitle font-bold text-[0.65rem] uppercase px-2 py-1">
                          Bônus Ativo (R$ 0)
                        </span>
                      </div>
                    </div>
                  ) : null}

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      {
                        ts: 0,
                        title: is720Plan ? 'Incluso 2x/sem (Bônus)' : (hasTeamRitualBonus ? 'Incluso 1x/sem (Bônus)' : 'Nenhum'),
                        badge: (is720Plan || hasTeamRitualBonus) ? 'Bônus Grátis' : 'Sem Equipe',
                        cost: 'R$ 0,00/mês',
                        desc: is720Plan
                          ? '2 disparos semanais inclusos como Bônus do Plano de 720 Dias.'
                          : hasTeamRitualBonus
                          ? '1 disparo semanal de prioridades incluso como Bônus pelos Rituais de Equipe.'
                          : 'Sem pontos de contato de WhatsApp com recepcionistas/secretárias.'
                      },
                      {
                        ts: 1,
                        title: '1x / semana Equipe',
                        badge: (is720Plan || hasTeamRitualBonus) ? 'Bônus (R$ 0)' : 'Disparo Prioridades',
                        cost: (is720Plan || hasTeamRitualBonus) ? 'R$ 0,00 (Bônus)' : 'R$ 94,75/mês',
                        desc: 'Envio semanal de metas táticas e prioridades para a equipe da clínica.'
                      },
                      {
                        ts: 2,
                        title: '2x / semana Equipe',
                        badge: is720Plan ? 'Bônus (R$ 0)' : 'Recomendado',
                        cost: is720Plan ? 'R$ 0,00 (Bônus 720d)' : (hasTeamRitualBonus ? 'R$ 94,75/mês (+1 freq)' : 'R$ 189,50/mês'),
                        desc: 'Envio na segunda + cobrança e report de prestação de contas na sexta. Mantém a tração em alta!'
                      },
                      {
                        ts: 3,
                        title: '3x / semana Equipe',
                        badge: 'Tração Total',
                        cost: is720Plan ? 'R$ 94,75/mês (+1 freq)' : (hasTeamRitualBonus ? 'R$ 189,50/mês (+2 freq)' : 'R$ 284,25/mês'),
                        desc: 'Monitoramento no WhatsApp 3x na semana (Seg, Qua, Sex) com feedback do consultor.'
                      }
                    ].map((opt) => {
                      const active = effectiveTeamSupportFreq === opt.ts;
                      const totalTS = opt.ts * weeks;
                      return (
                        <button
                          key={opt.ts}
                          onClick={() => {
                            setSimState((prev) => ({ ...prev, teamSupportFrequency: opt.ts }));
                            scrollToStep('step-6');
                          }}
                          className={`text-left p-4 border transition-all duration-200 flex flex-col justify-between gap-3 cursor-pointer ${
                            active
                              ? 'border-2 border-[var(--exodo-red)] bg-red-50/20 shadow-xs'
                              : 'border-[var(--border-default)] hover:border-[var(--border-strong)] bg-[var(--branco)]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <strong className="font-subtitle text-sm text-[var(--text-primary)]">
                                {opt.title}
                              </strong>
                              <span className="text-[0.6rem] font-subtitle uppercase tracking-wider px-1.5 py-0.5 bg-neutral-100 text-neutral-700 border border-neutral-300 font-bold">
                                {opt.badge}
                              </span>
                            </div>
                            <p className="font-body text-xs text-[var(--text-secondary)] m-0 leading-snug">
                              {opt.desc}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-[var(--border-default)] flex items-center justify-between text-xs font-subtitle">
                            <div className="flex flex-col">
                              <span className="text-[var(--text-tertiary)] text-[0.65rem]">
                                Total: <strong>{totalTS} contatos equipe</strong>
                              </span>
                              <span className="text-[0.65rem] text-[var(--exodo-red)] font-bold">
                                {opt.cost}
                              </span>
                            </div>
                            <span className={`font-bold text-[0.7rem] ${active ? 'text-[var(--exodo-red)]' : 'text-neutral-500'}`}>
                              {active ? '✓ Ativo' : 'Escolher'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* ========================================================= */}
            {/* PASSO 06: SOS Emergency Protection */}
            {/* ========================================================= */}
            <div id="step-6" className="bg-[var(--branco)] border border-[var(--border-default)] p-6 md:p-8 flex flex-col gap-5 relative overflow-hidden scroll-mt-24">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-7 h-7 bg-[var(--preto)] text-[var(--branco)] font-subtitle font-bold text-xs shrink-0 mt-0.5">
                  6
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-subtitle font-bold text-[0.7rem] uppercase tracking-wider text-[var(--exodo-red)] block">
                      Passo 06 — Seguro SOS Emergencial
                    </span>
                    <span className="text-[0.65rem] font-subtitle text-[var(--text-tertiary)] bg-neutral-100 px-2 py-0.5 border border-neutral-200 font-bold">
                      Valor Unitário: R$ 189,50 / acionamento
                    </span>
                  </div>
                  <h4 className="font-subtitle font-bold text-base md:text-lg text-[var(--text-primary)] m-0">
                    Deseja chamadas de emergência (20 min, resgate em até 24h) garantidas no plano caso ocorra uma crise na clínica?
                  </h4>
                </div>
              </div>

              {simState.duration <= 90 && (
                <div className="bg-[var(--cinza-claro)] border border-[var(--border-default)] p-3.5 flex items-center gap-2.5 text-xs text-[var(--preto)]">
                  <Info className="w-4 h-4 text-[var(--cinza-medio)] shrink-0" />
                  <span>
                    Para ciclos de <strong>60 e 90 dias</strong>, o limite máximo do Seguro SOS é de <strong>até 03 chamadas por mês</strong>.
                  </span>
                </div>
              )}

              {is720Plan ? (
                <div className="bg-[var(--accent-tint)] border border-[var(--exodo-red)] p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-start gap-2 text-[var(--preto)]">
                    <Gift className="w-4 h-4 text-[var(--exodo-red)] shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-subtitle text-[var(--preto)] block">
                        🎁 REGRA DO BÔNUS 720 DIAS: 06 Chamadas do Seguro SOS Emergencial são 100% Grátis!
                      </strong>
                      <span className="text-[var(--cinza-escuro)] text-[0.7rem] block mt-0.5">
                        O plano de 24 meses inclui 06 chamadas emergenciais de resgate (20 min em até 24h) por mês sem nenhum custo adicional.
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 bg-[var(--exodo-red)] text-white font-subtitle font-bold text-[0.65rem] uppercase px-2 py-1">
                    Bônus 720d Ativo (R$ 0)
                  </span>
                </div>
              ) : is360Plan ? (
                <div className="bg-[var(--accent-tint)] border border-[var(--exodo-red)] p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-start gap-2 text-[var(--preto)]">
                    <Gift className="w-4 h-4 text-[var(--exodo-red)] shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-subtitle text-[var(--preto)] block">
                        🎁 REGRA DO BÔNUS 360 DIAS: 04 Chamadas do Seguro SOS Emergencial são 100% Grátis!
                      </strong>
                      <span className="text-[var(--cinza-escuro)] text-[0.7rem] block mt-0.5">
                        O plano de 12 meses inclui 04 chamadas emergenciais de resgate (20 min em até 24h) por mês sem nenhum custo adicional.
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 bg-[var(--exodo-red)] text-white font-subtitle font-bold text-[0.65rem] uppercase px-2 py-1">
                    Bônus 360d Ativo (R$ 0)
                  </span>
                </div>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-1">
                {[
                  { sos: 0, title: 'Sem Seguro SOS', badge: 'Padrão', cost: 'R$ 0,00/mês', desc: 'Atendimento exclusivo nos horários agendados dos Rituais.' },
                  { sos: 1, title: '1 Chamada /mês', badge: (is360Plan || is720Plan) ? 'Incluso Bônus' : 'Recomendado', cost: (is360Plan || is720Plan) ? 'R$ 0,00 (Bônus)' : 'R$ 189,50/mês', desc: '1 ligação de emergência garantida por mês (resgate até 24h).' },
                  { sos: 2, title: '2 Chamadas /mês', badge: (is360Plan || is720Plan) ? 'Incluso Bônus' : 'Proteção Total', cost: (is360Plan || is720Plan) ? 'R$ 0,00 (Bônus)' : 'R$ 379,00/mês', desc: '2 ligações de emergência no mês sob demanda.' },
                  { sos: 3, title: '3 Chamadas /mês', badge: simState.duration <= 90 ? 'Máx. P/ 60-90d' : ((is360Plan || is720Plan) ? 'Incluso Bônus' : 'Ampliado'), cost: (is360Plan || is720Plan) ? 'R$ 0,00 (Bônus)' : 'R$ 568,50/mês', desc: '3 acionamentos emergenciais no mês com prioridade.' },
                  { sos: 4, title: '4 Chamadas /mês', badge: simState.duration <= 90 ? 'Indisponível' : (is360Plan ? 'Bônus 360d (R$ 0)' : (is720Plan ? 'Incluso Bônus' : 'Máxima Guarda')), cost: simState.duration <= 90 ? 'Indisponível' : ((is360Plan || is720Plan) ? 'R$ 0,00 (Bônus)' : 'R$ 758,00/mês'), desc: simState.duration <= 90 ? 'Indisponível para 60 e 90 dias.' : 'Até 4 chamadas emergenciais sob demanda por mês.' },
                  { sos: 6, title: '6 Chamadas /mês', badge: is720Plan ? 'Bônus 720d (R$ 0)' : 'Exclusivo 720d', cost: is720Plan ? 'R$ 0,00 (Bônus 720d)' : 'Indisponível', desc: is720Plan ? '06 chamadas de emergência totalmente inclusas como Bônus de 720 Dias.' : 'Disponível como bônus exclusivo no plano de 720 dias.' }
                ].map((opt) => {
                  const isDisabled = (simState.duration <= 90 && opt.sos > 3) || (simState.duration < 720 && opt.sos > 4);
                  const active = effectiveSosCount === opt.sos;
                  const totalSOS = Math.round(opt.sos * months);
                  return (
                    <button
                      key={opt.sos}
                      disabled={isDisabled}
                      onClick={() => {
                        if (!isDisabled) {
                          setSimState((prev) => ({ ...prev, sosCount: opt.sos }));
                          scrollToStep('summary-box');
                        }
                      }}
                      className={`text-left p-4 border transition-all duration-200 flex flex-col justify-between gap-3 ${
                        isDisabled
                          ? 'opacity-40 cursor-not-allowed bg-neutral-100 border-neutral-200'
                          : active
                          ? 'border-2 border-[var(--exodo-red)] bg-red-50/20 shadow-xs cursor-pointer'
                          : 'border-[var(--border-default)] hover:border-[var(--border-strong)] bg-[var(--branco)] cursor-pointer'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <strong className="font-subtitle text-sm text-[var(--text-primary)]">
                            {opt.title}
                          </strong>
                          <span className={`text-[0.6rem] font-subtitle uppercase tracking-wider px-1.5 py-0.5 border font-bold ${
                            isDisabled ? 'bg-neutral-200 text-neutral-500 border-neutral-300' : 'bg-neutral-100 text-neutral-700 border-neutral-300'
                          }`}>
                            {opt.badge}
                          </span>
                        </div>
                        <p className="font-body text-xs text-[var(--text-secondary)] m-0 leading-snug">
                          {opt.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[var(--border-default)] flex items-center justify-between text-xs font-subtitle">
                        <div className="flex flex-col">
                          <span className="text-[var(--text-tertiary)] text-[0.65rem]">
                            Total: <strong>{isDisabled ? '-' : `${totalSOS} chamadas`}</strong>
                          </span>
                          <span className="text-[0.65rem] text-[var(--exodo-red)] font-bold">
                            {isDisabled ? 'Indisponível' : opt.cost}
                          </span>
                        </div>
                        <span className={`font-bold text-[0.7rem] ${isDisabled ? 'text-neutral-400' : active ? 'text-[var(--exodo-red)]' : 'text-neutral-500'}`}>
                          {isDisabled ? '🔒' : active ? '✓ Ativo' : 'Escolher'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* FINAL SUMMARY / DYNAMIC BUDGET RESULT BOX */}
          {/* ========================================================= */}
          <div id="summary-box" className="mt-12 bg-[var(--preto)] text-white p-6 sm:p-8 md:p-10 border-2 border-[var(--exodo-red)] relative scroll-mt-24">
            
            {/* Header Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[var(--exodo-red)] text-white font-subtitle font-bold text-[0.65rem] uppercase tracking-wider">
                  Resumo do seu Plano Customizado
                </span>
                <span className="font-subtitle text-xs text-neutral-400">
                  Prazo: <strong>{simState.duration} dias ({months} meses)</strong>
                </span>
              </div>

              {discountRate > 0 && (
                <span className="px-2.5 py-0.5 bg-[var(--preto)] text-[var(--exodo-red)] border border-[var(--exodo-red)] font-subtitle font-bold text-xs uppercase tracking-wider">
                  🔥 Desconto de {Math.round(discountRate * 100)}% Aplicado no Total do Plano
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Deliverable Metrics Column */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <span className="font-subtitle text-xs text-neutral-400 uppercase tracking-wider block">
                  Volume Total de Entregas Contratadas:
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-neutral-900 border border-neutral-800 p-3">
                    <span className="font-subtitle text-[0.65rem] text-neutral-400 uppercase block">
                      Encontros Nutri
                    </span>
                    <span className="font-subtitle text-sm font-bold text-white block mt-1">
                      {totalNutriRituals} Reuniões (45 min)
                    </span>
                    <span className="font-body text-[0.7rem] text-neutral-400 block mt-0.5">
                      {simState.rituals}x ao mês ({formatCurrency(monthlyNutriRitualsCost)}/mês)
                    </span>
                  </div>

                  {isTeamUnlocked && activeTeamRituals > 0 && (
                    <div className="bg-neutral-900 border border-neutral-800 p-3">
                      <span className="font-subtitle text-[0.65rem] text-neutral-400 uppercase block">
                        Encontros Equipe
                      </span>
                      <span className="font-subtitle text-sm font-bold text-white block mt-1">
                        {totalTeamRituals} Reuniões Equipe
                      </span>
                      <span className="font-body text-[0.7rem] text-neutral-400 block mt-0.5">
                        {activeTeamRituals}x ao mês ({formatCurrency(monthlyTeamRitualsCost)}/mês)
                      </span>
                    </div>
                  )}

                  <div className="bg-neutral-900 border border-neutral-800 p-3">
                    <span className="font-subtitle text-[0.65rem] text-neutral-400 uppercase block">
                      WhatsApp Nutri
                    </span>
                    <span className="font-subtitle text-sm font-bold text-white block mt-1">
                      {totalNutriSupport} Disparos Nutri
                    </span>
                    <span className="font-body text-[0.7rem] text-neutral-400 block mt-0.5">
                      {effectiveNutriSupportFreq}x/sem ({formatCurrency(monthlyNutriSupportCost)}/mês){is720Plan ? ' [2x/sem Bônus R$ 0]' : ''}
                    </span>
                  </div>

                  <div className="bg-neutral-900 border border-neutral-800 p-3">
                    <span className="font-subtitle text-[0.65rem] text-neutral-400 uppercase block">
                      WhatsApp Equipe
                    </span>
                    <span className="font-subtitle text-sm font-bold text-white block mt-1">
                      {isTeamUnlocked ? `${totalTeamSupport} Contatos Equipe` : 'Indisponível'}
                    </span>
                    <span className="font-body text-[0.7rem] text-neutral-400 block mt-0.5">
                      {isTeamUnlocked 
                        ? `${effectiveTeamSupportFreq}x/sem (${formatCurrency(monthlyTeamSupportCost)}/mês)${is720Plan ? ' [2x Bônus R$ 0]' : (hasTeamRitualBonus ? ' [1x Bônus R$ 0]' : '')}`
                        : 'Apenas para 180+ dias'
                      }
                    </span>
                  </div>

                  <div className="bg-neutral-900 border border-neutral-800 p-3">
                    <span className="font-subtitle text-[0.65rem] text-neutral-400 uppercase block">
                      Seguro SOS Crises
                    </span>
                    <span className="font-subtitle text-sm font-bold text-white block mt-1">
                      {totalSos} Chamadas SOS
                    </span>
                    <span className="font-body text-[0.7rem] text-neutral-400 block mt-0.5">
                      {effectiveSosCount} por mês ({formatCurrency(monthlySosCost)}/mês){is720Plan ? ' [6 Bônus R$ 0]' : (is360Plan ? ' [4 Bônus R$ 0]' : '')}
                    </span>
                  </div>

                  <div className="bg-neutral-900 border border-neutral-800 p-3">
                    <span className="font-subtitle text-[0.65rem] text-neutral-400 uppercase block">
                      Taxa Base Fixo Mensal
                    </span>
                    <span className="font-subtitle text-sm font-bold text-white block mt-1">
                      Governança & Maint.
                    </span>
                    <span className="font-body text-[0.7rem] text-neutral-400 block mt-0.5">
                      R$ 240,00 / mês
                    </span>
                  </div>

                  {bonusDiagnosticos > 0 && (
                    <div className="bg-[var(--preto)] border border-[var(--exodo-red)] p-3 col-span-2 sm:col-span-3">
                      <span className="font-subtitle text-[0.65rem] text-[var(--exodo-red)] font-bold uppercase block flex items-center gap-1">
                        <Gift className="w-3 h-3 text-[var(--exodo-red)]" />
                        <span>Bônus Especial de Fidelidade</span>
                      </span>
                      <span className="font-subtitle text-xs font-bold text-white block mt-1">
                        🎁 {bonusDiagnosticos} Diagnóstico(s) Trimestral(is) Extra(s) Grátis!
                      </span>
                      <span className="font-body text-[0.7rem] text-[var(--cinza-claro)] block mt-0.5">
                        Incluso no plano sem custo adicional.
                      </span>
                    </div>
                  )}
                </div>

                {/* Calculation math line */}
                <div className="bg-neutral-950 p-3 border border-neutral-800 text-[0.7rem] font-subtitle text-neutral-300 flex flex-col gap-1">
                  <div className="flex justify-between items-center text-neutral-400">
                    <span>Subtotal mensal bruto das componentes:</span>
                    <strong className="text-white">{formatCurrency(monthlyRawSubtotal)}/mês</strong>
                  </div>
                  <div className="flex justify-between items-center text-[var(--exodo-red)] font-bold">
                    <span>Desconto de Prazo ({simState.duration} dias):</span>
                    <span>-{Math.round(discountRate * 100)}%</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-neutral-800 text-xs font-bold text-white">
                    <span>Valor final líquido do ciclo ({months} meses):</span>
                    <span className="text-[var(--exodo-red)] text-sm">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-300 mt-1">
                  <Check className="w-4 h-4 text-[var(--exodo-red)] shrink-0" />
                  <span>Inclui Comunidade Êxodo + Área de Membros + ÊXODO Intelligence (I.A. Nutri)</span>
                </div>
              </div>

              {/* Investment Total & Call to Action Column */}
              <div className="lg:col-span-5 bg-neutral-900/90 border border-neutral-800 p-6 flex flex-col justify-center items-center text-center">
                <span className="font-subtitle text-xs text-neutral-400 uppercase tracking-wider block mb-1">
                  Investimento Equivalente Mensal:
                </span>

                <span className="font-display text-4xl sm:text-5xl text-white font-bold my-1">
                  {formatCurrency(monthlyEquivalent)}
                  <span className="font-subtitle text-xs text-neutral-400 font-normal">/mês</span>
                </span>

                <span className="font-subtitle text-xs text-[var(--exodo-red)] font-bold block mt-1">
                  Valor Total do Ciclo ({months} meses): {formatCurrency(totalPrice)}
                </span>

                <div className="flex flex-col gap-2 w-full mt-5">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSendWhatsapp}
                    className="w-full justify-center py-3.5 bg-[var(--exodo-red)] hover:bg-[var(--preto)] text-white font-bold"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    <span>Enviar Plano no WhatsApp</span>
                  </Button>

                  <button
                    onClick={handleCopyBudget}
                    className="w-full py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-subtitle font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 border border-neutral-700 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Detalhes do Plano</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* UNBOXING DO A3 MODAL DIALOG */}
      {/* ========================================================= */}
      {isUnboxingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[var(--branco)] border-2 border-[var(--preto)] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="bg-[var(--preto)] text-white p-5 sm:p-6 flex items-center justify-between border-b border-neutral-800 shrink-0">
              <div className="pr-4">
                <div className="flex items-center gap-2 text-xs font-subtitle text-[var(--exodo-red)] font-bold uppercase tracking-wider mb-1">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Porta de Entrada A3 (90 Dias)</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl text-white m-0">
                  Unboxing do A3: Conheça as 12 Entregas Inclusas
                </h3>
                <p className="font-body text-xs text-neutral-300 m-0 mt-1">
                  Cada entregável foi desenhado para gerar caixa, acelerar vendas e dar maturidade à sua clínica.
                </p>
              </div>
              <button
                onClick={() => setIsUnboxingOpen(false)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
                aria-label="Fechar modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 md:p-8 overflow-y-auto flex flex-col gap-8 bg-[var(--surface-card)]">
              
              <div className="bg-[var(--accent-tint)] border border-[var(--exodo-red)] p-4 flex items-center gap-3 text-[var(--preto)] text-xs">
                <Gift className="w-5 h-5 text-[var(--exodo-red)] shrink-0" />
                <div>
                  <strong className="font-subtitle text-[var(--preto)] block">
                    Valor total avulso somado das 12 entregas: R$ 5.480,00
                  </strong>
                  <span className="text-[var(--exodo-red)] block mt-0.5">
                    Ao contratar o A3, você recebe o pacote integral com 67% de desconto por apenas 3x de R$ 599,66 (ou R$ 1.799,00 à vista).
                  </span>
                </div>
              </div>

              {A3_STAGES.map((stage) => (
                <div key={stage.stageNumber} className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 flex-wrap pb-2 border-b border-[var(--border-default)]">
                    <span className="flex items-center justify-center w-6 h-6 bg-[var(--preto)] text-white font-subtitle font-bold text-xs">
                      {stage.stageNumber}
                    </span>
                    <h5 className="font-subtitle font-bold text-sm md:text-base text-[var(--text-primary)] m-0">
                      {stage.title}
                    </h5>
                    <span className="font-subtitle text-xs text-[var(--text-tertiary)]">
                      ({stage.period})
                    </span>
                    <span className={`font-subtitle text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 border ${stage.badgeBg}`}>
                      {stage.badge}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {stage.microProducts.map((mp) => {
                      const IconComp = mp.icon;
                      return (
                        <div key={mp.id} className="bg-white border border-[var(--border-default)] p-4 flex flex-col justify-between shadow-xs">
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-2">
                              <span className="font-subtitle font-extrabold text-[0.65rem] text-[var(--exodo-red)] bg-red-50 px-2 py-0.5 border border-red-100">
                                ENTREGA {mp.number}
                              </span>
                              <span className="font-body text-[0.65rem] text-neutral-400 line-through">
                                Val. {mp.valueAnchor}
                              </span>
                            </div>

                            <div className="flex items-start gap-2.5 mb-1.5">
                              <div className="p-1.5 bg-neutral-100 text-[var(--exodo-red)] shrink-0 border border-neutral-200">
                                <IconComp className="w-3.5 h-3.5" />
                              </div>
                              <h6 className="font-subtitle font-bold text-xs text-[var(--text-primary)] leading-tight m-0">
                                {mp.title}
                              </h6>
                            </div>

                            <p className="font-body text-[0.75rem] text-[var(--text-secondary)] leading-relaxed m-0 mt-1">
                              {mp.desc}
                            </p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-[var(--border-default)] flex items-center justify-between text-[0.65rem]">
                            <span className="font-subtitle font-bold text-[var(--exodo-red)] flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-[var(--exodo-red)] shrink-0" />
                              <span>INCLUSO NO PACOTE</span>
                            </span>
                            <span className="font-subtitle font-bold text-[var(--exodo-red)] bg-[var(--accent-tint)] px-1.5 py-0.5 border border-[var(--exodo-red)]">
                              R$ 0,00 (100% OFF)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

            </div>

            {/* Modal Footer Bar */}
            <div className="bg-[var(--preto)] text-white p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800 shrink-0">
              <div className="flex items-center gap-3 text-xs">
                <span className="font-subtitle text-neutral-300">
                  Total das 12 Entregas: <strong className="text-[var(--exodo-red)] font-display text-base">3x de R$ 599,66</strong> (R$ 1.799,00 à vista)
                </span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={() => setIsUnboxingOpen(false)}
                  className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-subtitle font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Fechar
                </button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setIsUnboxingOpen(false);
                    onOpenBooking();
                  }}
                  className="bg-[var(--exodo-red)] hover:bg-[var(--preto)] text-white font-bold py-2.5"
                >
                  <Calendar className="w-4 h-4 mr-1.5" />
                  <span>Garantir Meus 12 Entregáveis</span>
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
