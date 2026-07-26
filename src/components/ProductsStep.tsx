import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Check, 
  ArrowRight, 
  HelpCircle, 
  Package, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  Info, 
  Tag, 
  Target, 
  Clock, 
  CreditCard, 
  Edit2, 
  Users, 
  Video, 
  Building, 
  Monitor, 
  ChevronRight, 
  Bookmark, 
  LogOut, 
  MoreVertical, 
  Box, 
  ArrowLeft,
  Sparkles,
  Eye,
  Compass,
  Zap,
  FileText,
  Award,
  Lock
} from 'lucide-react';
import { Button } from './UIPrimitives';
import { A3Product, A3ScheduleOccupancy, A3ProductDeliverable } from '../types';
import { StageName } from './JourneyTrail';

interface ProductsStepProps {
  initialProducts?: A3Product[];
  initialOccupancy?: A3ScheduleOccupancy | null;
  onSaveProduct: (product: A3Product) => void;
  onDeleteProduct: (productId: string) => void;
  onSaveOccupancy: (occupancy: A3ScheduleOccupancy) => void;
  onCompleteStep: () => void;
  onToast: (msg: string) => void;
  activeStage?: StageName;
  onNavigateToStage?: (stage: StageName) => void;
  onOpenDeliverable?: (type: 'retrato' | 'caminho' | 'plano') => void;
}

// 1. Preset Audiences List
const PRESET_AUDIENCES = [
  'Adultos em busca de emagrecimento',
  'Hipertrofia e ganho de massa muscular',
  'Pessoas com doenças crônicas',
  'Gestantes',
  'Idosos',
  'Crianças e adolescentes',
  'Atletas e praticantes de esporte',
  'Pessoas com foco em saúde intestinal',
  'Pós-operatório bariátrica',
  'Reeducação alimentar',
  'Vegetarianos e veganos',
  'Outros (especificar)'
];

// 2. Preset Objectives List
const PRESET_OBJECTIVES = [
  'Emagrecimento saudável e sustentável',
  'Ganho de massa muscular',
  'Reeducação alimentar',
  'Melhora de performance esportiva',
  'Controle de doenças crônicas',
  'Saúde intestinal e digestiva',
  'Saúde hormonal',
  'Qualidade de vida e bem-estar',
  'Outro (especificar)'
];

// Default Deliveries for Trimestral Online
const DEFAULT_DELIVERIES_TRIMESTRAL: A3ProductDeliverable[] = [
  {
    id: 'del_1',
    name: 'Consultas por videochamada',
    occurrencesIn3Months: 3,
    frequency: '3x por mês',
    minutesPerOccurrence: 60,
    isMinutesEstimated: true,
  },
  {
    id: 'del_2',
    name: 'Avaliação física da composição corporal',
    occurrencesIn3Months: 3,
    frequency: '3x em 3 meses',
    minutesPerOccurrence: 60,
    isMinutesEstimated: true,
  },
  {
    id: 'del_3',
    name: 'Plano alimentar 100% personalizado',
    occurrencesIn3Months: 3,
    frequency: '3x em 3 meses',
    minutesPerOccurrence: 45,
    isMinutesEstimated: true,
  },
  {
    id: 'del_4',
    name: 'Suporte direto e diário no WhatsApp',
    occurrencesIn3Months: 24,
    frequency: 'Sob demanda',
    estimatedMonthlyFrequency: 8,
    minutesPerOccurrence: 10,
    isMinutesEstimated: true,
  },
  {
    id: 'del_5',
    name: 'Ajustes no plano e reavaliações',
    occurrencesIn3Months: 3,
    frequency: '3x em 3 meses',
    minutesPerOccurrence: 45,
    isMinutesEstimated: true,
  },
  {
    id: 'del_6',
    name: 'Análise de exames de sangue e suplementação',
    occurrencesIn3Months: 2,
    frequency: '2x em 3 meses',
    minutesPerOccurrence: 45,
    isMinutesEstimated: true,
  },
  {
    id: 'del_7',
    name: 'Guia prático de receitas e substituições',
    occurrencesIn3Months: 2,
    frequency: '2x em 3 meses',
    minutesPerOccurrence: 30,
    isMinutesEstimated: true,
  },
  {
    id: 'del_8',
    name: 'Encontros de acompanhamento e suporte',
    occurrencesIn3Months: 3,
    frequency: '3x em 3 meses',
    minutesPerOccurrence: 110,
    isMinutesEstimated: true,
  },
];

// Initial default sample product if list is empty
const INITIAL_SAMPLE_PRODUCT: A3Product = {
  id: 'prod_trimestral_default',
  name: 'Trimestral - Acompanhamento Online',
  objective: 'Emagrecimento saudável e sustentável',
  targetAudience: 'Adultos',
  format: 'Online',
  price: 450,
  paymentMethod: 'À vista / PIX',
  durationDays: 90,
  durationLabel: '90 dias',
  deliveries: DEFAULT_DELIVERIES_TRIMESTRAL.map((d) => d.name),
  detailedDeliverables: DEFAULT_DELIVERIES_TRIMESTRAL,
  totalTimeMinutes: 1368, // 22.8h
  activePatients: 5,
  isActivePatientsEstimated: false,
};

export const ProductsStep: React.FC<ProductsStepProps> = ({
  initialProducts = [],
  initialOccupancy = null,
  onSaveProduct,
  onDeleteProduct,
  onSaveOccupancy,
  onCompleteStep,
  onToast,
  activeStage = 'products',
  onNavigateToStage,
  onOpenDeliverable,
}) => {
  // Always ensure at least 1 product exists by default as in the screenshot if initial is empty
  const [products, setProducts] = useState<A3Product[]>(() => {
    if (initialProducts && initialProducts.length > 0) return initialProducts;
    return [INITIAL_SAMPLE_PRODUCT];
  });

  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // View Mode: 'dashboard', 'wizard', 'saved_success'
  const [mode, setMode] = useState<'dashboard' | 'wizard' | 'saved_success'>('dashboard');

  // Wizard Module: 1 through 4
  // Module 1: Identidade, Público, Objetivo, Formato (sub-steps 1, 2, 3, 4)
  // Module 2: Duração, Entregas (sub-steps 5, 6)
  // Module 3: Comercial (sub-step 7)
  // Module 4: Revisão (sub-step 8)
  const [currentModule, setCurrentModule] = useState<number>(1);
  const [currentSubStep, setCurrentSubStep] = useState<number>(1);

  // -------------------------------------------------------------------
  // FORM STATE FOR PRODUCT CREATION / EDITING
  // -------------------------------------------------------------------
  const [productName, setProductName] = useState('');
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>(['Adultos']);
  const [customAudienceInput, setCustomAudienceInput] = useState('');

  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([
    'Emagrecimento saudável e sustentável'
  ]);
  const [customObjectiveInput, setCustomObjectiveInput] = useState('');

  const [format, setFormat] = useState<'Presencial' | 'Online' | 'Híbrido' | string>('Online');

  const [durationDays, setDurationDays] = useState<number>(90);
  const [durationLabel, setDurationLabel] = useState('90 Dias (3 Meses)');
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [customDurationText, setCustomDurationText] = useState('');

  const [deliverablesList, setDeliverablesList] = useState<A3ProductDeliverable[]>(DEFAULT_DELIVERIES_TRIMESTRAL);
  const [customDeliveryInput, setCustomDeliveryInput] = useState('');

  const [price, setPrice] = useState<string>('450');
  const [isPriceEstimated, setIsPriceEstimated] = useState(false);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>(['À vista / PIX']);

  const [activePatients, setActivePatients] = useState<string>('5');
  const [isActivePatientsEstimated, setIsActivePatientsEstimated] = useState(false);

  // Reset or initialize product form
  const resetProductForm = () => {
    setEditingProductId(null);
    setProductName('');
    setSelectedAudiences(['Adultos em busca de emagrecimento']);
    setCustomAudienceInput('');
    setSelectedObjectives(['Emagrecimento saudável e sustentável']);
    setCustomObjectiveInput('');
    setFormat('Online');
    setDurationDays(90);
    setDurationLabel('90 Dias (3 Meses)');
    setIsCustomDuration(false);
    setCustomDurationText('');
    setDeliverablesList(DEFAULT_DELIVERIES_TRIMESTRAL);
    setCustomDeliveryInput('');
    setPrice('450');
    setIsPriceEstimated(false);
    setSelectedPaymentMethods(['À vista / PIX']);
    setActivePatients('5');
    setIsActivePatientsEstimated(false);
    setCurrentModule(1);
    setCurrentSubStep(1);
  };

  const handleStartNewProduct = () => {
    resetProductForm();
    setMode('wizard');
  };

  const handleEditProduct = (prod: A3Product) => {
    setEditingProductId(prod.id);
    setProductName(prod.name);
    setSelectedAudiences(prod.targetAudience ? prod.targetAudience.split(', ') : ['Adultos']);
    setSelectedObjectives(prod.objective ? prod.objective.split(', ') : ['Emagrecimento saudável e sustentável']);
    setFormat(prod.format || 'Online');
    setDurationDays(prod.durationDays || 90);
    setDurationLabel(prod.durationLabel || '90 dias');
    if (prod.detailedDeliverables && prod.detailedDeliverables.length > 0) {
      setDeliverablesList(prod.detailedDeliverables);
    } else {
      setDeliverablesList(DEFAULT_DELIVERIES_TRIMESTRAL);
    }
    setPrice(prod.price ? prod.price.toString() : '450');
    setSelectedPaymentMethods(prod.paymentMethod ? prod.paymentMethod.split(', ') : ['À vista / PIX']);
    setActivePatients(prod.activePatients ? prod.activePatients.toString() : '5');
    setCurrentModule(1);
    setCurrentSubStep(1);
    setMode('wizard');
  };

  const jumpToSubStep = (stepNumber: number) => {
    if (stepNumber <= 4) setCurrentModule(1);
    else if (stepNumber <= 6) setCurrentModule(2);
    else if (stepNumber === 7) setCurrentModule(3);
    else setCurrentModule(4);

    setCurrentSubStep(stepNumber);
  };

  // Toggle Audience
  const toggleAudience = (aud: string) => {
    if (selectedAudiences.includes(aud)) {
      if (selectedAudiences.length === 1) return;
      setSelectedAudiences(selectedAudiences.filter((a) => a !== aud));
    } else {
      setSelectedAudiences([...selectedAudiences, aud]);
    }
  };

  const addCustomAudience = () => {
    if (!customAudienceInput.trim()) return;
    const txt = customAudienceInput.trim();
    if (!selectedAudiences.includes(txt)) {
      setSelectedAudiences([...selectedAudiences, txt]);
    }
    setCustomAudienceInput('');
  };

  // Toggle Objective
  const toggleObjective = (obj: string) => {
    if (selectedObjectives.includes(obj)) {
      if (selectedObjectives.length === 1) return;
      setSelectedObjectives(selectedObjectives.filter((o) => o !== obj));
    } else {
      setSelectedObjectives([...selectedObjectives, obj]);
    }
  };

  const addCustomObjective = () => {
    if (!customObjectiveInput.trim()) return;
    const txt = customObjectiveInput.trim();
    if (!selectedObjectives.includes(txt)) {
      setSelectedObjectives([...selectedObjectives, txt]);
    }
    setCustomObjectiveInput('');
  };

  // Duration Handlers
  const handleSelectPresetDuration = (days: number, label: string) => {
    setDurationDays(days);
    setDurationLabel(label);
    setIsCustomDuration(false);
  };

  const handleApplyCustomDuration = () => {
    if (!customDurationText.trim()) return;
    setDurationLabel(customDurationText.trim());
    setIsCustomDuration(true);
  };

  // Deliverables Handlers
  const handleUpdateDeliverable = (id: string, field: keyof A3ProductDeliverable, val: any) => {
    setDeliverablesList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleRemoveDeliverable = (id: string) => {
    if (deliverablesList.length <= 1) {
      onToast('Mantenha pelo menos 1 entrega no produto.');
      return;
    }
    setDeliverablesList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddCustomDeliverable = () => {
    if (!customDeliveryInput.trim()) return;
    const newDel: A3ProductDeliverable = {
      id: `del_custom_${Date.now()}`,
      name: customDeliveryInput.trim(),
      occurrencesIn3Months: 3,
      frequency: '3x em 3 meses',
      minutesPerOccurrence: 45,
      isMinutesEstimated: true,
    };
    setDeliverablesList((prev) => [...prev, newDel]);
    setCustomDeliveryInput('');
  };

  // Payment method toggle
  const togglePaymentMethod = (pm: string) => {
    if (selectedPaymentMethods.includes(pm)) {
      if (selectedPaymentMethods.length === 1) return;
      setSelectedPaymentMethods(selectedPaymentMethods.filter((p) => p !== pm));
    } else {
      setSelectedPaymentMethods([...selectedPaymentMethods, pm]);
    }
  };

  // Total operational minutes calculation
  const calculatedTotalMinutes = deliverablesList.reduce((acc, del) => {
    const occ = del.occurrencesIn3Months || 1;
    const mins = del.minutesPerOccurrence || 0;
    return acc + occ * mins;
  }, 0);

  const calculatedTotalHours = (calculatedTotalMinutes / 60).toFixed(1);

  // Financial Calculators
  const numericPrice = parseFloat(price) || 0;
  const numericPatients = parseInt(activePatients, 10) || 0;
  const monthlyRevenue = Math.round(numericPrice * numericPatients);
  const threeMonthRevenue = Math.round(numericPrice * numericPatients * 3);

  // Save current product
  const handleSaveCurrentProduct = () => {
    if (!productName.trim()) {
      onToast('Por favor, digite o nome do produto.');
      jumpToSubStep(1);
      return;
    }

    const newProduct: A3Product = {
      id: editingProductId || `prod_${Date.now()}`,
      name: productName.trim(),
      objective: selectedObjectives.join(', '),
      targetAudience: selectedAudiences.join(', '),
      format,
      price: numericPrice,
      paymentMethod: selectedPaymentMethods.join(', '),
      durationDays,
      durationLabel,
      deliveries: deliverablesList.map((d) => d.name),
      detailedDeliverables: deliverablesList,
      totalTimeMinutes: calculatedTotalMinutes,
      activePatients: numericPatients,
      isActivePatientsEstimated,
    };

    if (editingProductId) {
      const updatedList = products.map((p) => (p.id === editingProductId ? newProduct : p));
      setProducts(updatedList);
    } else {
      setProducts((prev) => [...prev, newProduct]);
    }

    onSaveProduct(newProduct);
    onToast(`Produto "${newProduct.name}" salvo com sucesso!`);
    setMode('saved_success');
  };

  const handleDeleteProductHandler = (id: string, name: string) => {
    if (products.length <= 1) {
      onToast('Você deve manter pelo menos 1 produto no catálogo.');
      return;
    }
    const filtered = products.filter((p) => p.id !== id);
    setProducts(filtered);
    onDeleteProduct(id);
    onToast(`Produto "${name}" removido.`);
  };

  return (
    <div className="w-full text-[var(--preto)] font-body">
      {/* MAIN THREE-COLUMN GRID CONTAINER WITH LEFT SIDEBAR + MAIN CONTENT + RIGHT DRAWER */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 border border-neutral-200 bg-white shadow-xs rounded-xl overflow-hidden">
        {/* Left journey/trilha sidebar removed — now shown once via the shared <JourneyTrail> above this component */}
        <aside className="hidden lg:col-span-3 xl:col-span-3 bg-white border-r border-b lg:border-b-0 border-neutral-200 p-4 shrink-0 space-y-5">
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
                { id: 'products', label: '01. Catálogo de Produtos', icon: Package, badge: products.length },
                { id: 'patient-workload', label: '02. Carga de Pacientes', icon: Users },
                { id: 'schedule', label: '03. Agenda Disponível', icon: Calendar },
                { id: 'other-activities', label: '04. Outras Atividades', icon: Clock },
                { id: 'current-model', label: '05. Modelo Atual', icon: ShieldCheck },
              ].map((item) => {
                const IconComp = item.icon;
                const isActive = activeStage === item.id || (!activeStage && item.id === 'products');
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'products') {
                        setMode('dashboard');
                      }
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
                    {item.badge !== undefined && (
                      <span className="text-[0.6rem] bg-neutral-100 text-neutral-800 px-1.5 py-0.2 rounded font-mono shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
            {/* Action button inside products step */}
            {mode === 'dashboard' && (
              <button
                onClick={handleStartNewProduct}
                className="w-full text-left ml-2 py-1 text-[0.68rem] font-subtitle text-emerald-800 font-bold hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-emerald-600" />
                <span>+ Criar Novo Produto</span>
              </button>
            )}
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
                const isActive = activeStage === item.id;
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
                        ? 'border-amber-600 bg-amber-50/80 text-[var(--preto)] shadow-2xs'
                        : 'border-transparent text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <IconComp className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-600' : 'text-neutral-400'}`} />
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
              {[
                { id: 'tactical-plan', label: '09. Plano Tático 90 Dias', icon: Calendar },
              ].map((item) => {
                const IconComp = item.icon;
                const isActive = activeStage === item.id;
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
                        ? 'border-indigo-600 bg-indigo-50/80 text-[var(--preto)] shadow-2xs'
                        : 'border-transparent text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <IconComp className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-neutral-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* SHORTCUTS PARA ENTREGAS FORMAIS */}
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

          <div className="pt-3 border-t border-neutral-200">
            <button
              onClick={() => onToast('Central de apoio do Sistema A3')}
              className="text-[0.68rem] font-subtitle text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5 cursor-pointer bg-transparent border-none p-0"
            >
              <HelpCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>Precisa de apoio? Ver guia</span>
            </button>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* CENTER / MAIN PANEL CONTENT AREA                          */}
        {/* ========================================================= */}
        <main className="lg:col-span-9 xl:col-span-9 p-4 sm:p-6 space-y-6 min-w-0">
          {/* VIEW 1: DASHBOARD DO CATÁLOGO (Screen 1) */}
          {mode === 'dashboard' && (
            <div className="space-y-6">
              {/* Main Dashboard Header */}
              <div className="bg-white border-2 border-[var(--preto)] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
                  <div>
                    <h1 className="font-title text-2xl text-[var(--preto)] font-bold">
                      Seus Produtos e Serviços
                    </h1>
                    <p className="font-body text-xs text-neutral-600 mt-1">
                      Aqui estão os produtos e serviços que você já cadastrou. Adicione novos itens ou avance para registrar sua agenda.
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleStartNewProduct}
                    className="py-3 px-5 text-xs font-bold uppercase tracking-wider shrink-0 bg-[var(--exodo-red)] text-white hover:bg-red-700 flex items-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ NOVO PRODUTO</span>
                  </Button>
                </div>

                {/* Grid of registered product cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {products.map((prod) => {
                    const hoursText = (prod.totalTimeMinutes / 60).toFixed(1);
                    return (
                      <div
                        key={prod.id}
                        className="bg-white border-2 border-[var(--preto)] p-5 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-4"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[0.65rem] font-subtitle font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              ATIVO
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDeleteProductHandler(prod.id, prod.name)}
                                className="text-neutral-400 hover:text-red-600 p-1 cursor-pointer bg-transparent border-none"
                                title="Excluir produto"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <button className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer bg-transparent border-none">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <h3 className="font-title text-lg text-[var(--preto)] font-bold mb-3">
                            {prod.name}
                          </h3>

                          {/* Attributes Pills Grid */}
                          <div className="grid grid-cols-2 gap-2 text-[0.7rem] font-subtitle bg-neutral-50 p-3 border border-neutral-200 rounded mb-3">
                            <div>
                              <span className="text-neutral-400 text-[0.6rem] uppercase block font-bold">PÚBLICO</span>
                              <strong className="text-neutral-800">{prod.targetAudience}</strong>
                            </div>
                            <div>
                              <span className="text-neutral-400 text-[0.6rem] uppercase block font-bold">DURAÇÃO</span>
                              <strong className="text-neutral-800">{prod.durationLabel}</strong>
                            </div>
                            <div>
                              <span className="text-neutral-400 text-[0.6rem] uppercase block font-bold">FORMATO</span>
                              <strong className="text-neutral-800">{prod.format}</strong>
                            </div>
                            <div>
                              <span className="text-neutral-400 text-[0.6rem] uppercase block font-bold">PACIENTES</span>
                              <strong className="text-emerald-700 font-bold">{prod.activePatients} pacientes</strong>
                            </div>
                          </div>

                          {/* Price & Time Financial Metrics */}
                          <div className="grid grid-cols-2 gap-2 text-xs font-subtitle border-t border-neutral-200 pt-3">
                            <div>
                              <span className="text-neutral-400 text-[0.62rem] uppercase block font-bold">PREÇO</span>
                              <strong className="text-[var(--preto)] font-title text-base">
                                R$ {prod.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </strong>
                            </div>
                            <div>
                              <span className="text-neutral-400 text-[0.62rem] uppercase block font-bold">TEMPO ESTIMADO</span>
                              <strong className="text-neutral-900 font-title text-base">
                                {hoursText} horas
                              </strong>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-neutral-100 flex justify-end">
                          <button
                            onClick={() => handleEditProduct(prod)}
                            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 text-xs font-subtitle font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-neutral-600" />
                            <span>Editar</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom "+ Cadastrar outro produto" bar */}
                <div
                  onClick={handleStartNewProduct}
                  className="border-2 border-dashed border-neutral-300 hover:border-[var(--preto)] bg-neutral-50/50 p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1 mt-4"
                >
                  <span className="font-subtitle font-bold text-xs uppercase text-neutral-800 flex items-center gap-1">
                    <Plus className="w-4 h-4 text-[var(--exodo-red)]" />
                    + Cadastrar outro produto
                  </span>
                  <span className="text-[0.7rem] text-neutral-500 font-body">
                    Comece a cadastrar um novo produto ou serviço.
                  </span>
                </div>
              </div>

              {/* Action Banner to Proceed */}
              <div className="bg-neutral-900 text-white p-5 border-2 border-[var(--preto)] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div>
                  <h4 className="font-subtitle font-bold text-sm uppercase text-amber-300">
                    Catálogo de Produtos Estruturado
                  </h4>
                  <p className="font-body text-xs text-neutral-300 mt-0.5">
                    Se você já cadastrou todos os produtos atuais, avance para a próxima etapa da investigação A3.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={onCompleteStep}
                  className="py-3 px-6 text-xs uppercase font-bold tracking-wider shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white border-none flex items-center gap-2"
                >
                  <span>Avançar para Agenda e Capacidade →</span>
                </Button>
              </div>
            </div>
          )}

          {/* VIEW 2: WIZARD MODULES (Screens 2 through 8) */}
          {mode === 'wizard' && (
            <div className="bg-white border-2 border-[var(--preto)] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
              {/* Module Header Progress Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-subtitle font-bold text-[var(--exodo-red)] uppercase tracking-wider">
                    SISTEMA A3
                  </span>
                  <span className="text-xs text-neutral-300">•</span>
                  <span className="font-subtitle font-bold text-xs uppercase tracking-wider text-[var(--preto)]">
                    Etapa 01 • Catálogo de Produtos
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[0.68rem] font-subtitle font-bold text-neutral-500 uppercase">
                    MÓDULO 0{currentModule} DE 04
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4].map((mNum) => (
                      <span
                        key={mNum}
                        className={`w-6 h-6 rounded-full text-[0.68rem] font-subtitle font-bold flex items-center justify-center border ${
                          mNum === currentModule
                            ? 'bg-[var(--exodo-red)] text-white border-[var(--exodo-red)]'
                            : mNum < currentModule
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-neutral-100 text-neutral-400 border-neutral-300'
                        }`}
                      >
                        0{mNum}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ----------------------------------------------------- */}
              {/* SCREEN 2: MÓDULO 01 - IDENTIDADE DO PRODUTO (SubStep 1)*/}
              {/* ----------------------------------------------------- */}
              {currentSubStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-1">
                    <span className="text-[0.65rem] font-subtitle font-bold text-neutral-500 uppercase tracking-wider">
                      MÓDULO 01 DE 04
                    </span>
                    <h2 className="font-title text-xl text-[var(--preto)] font-bold">
                      Como você chama este produto ou serviço?
                    </h2>
                    <p className="font-body text-xs text-neutral-600">
                      Use o nome comercial que os pacientes já conhecem.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-subtitle font-bold text-neutral-800">
                      Nome do produto ou serviço
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={60}
                        placeholder="Ex: Consulta Avulsa, Acompanhamento Trimestral, Desafio 30 Dias..."
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full p-3 border-2 border-neutral-300 focus:border-[var(--preto)] font-title font-semibold text-sm outline-none bg-white"
                        autoFocus
                      />
                      <span className="absolute right-3 bottom-3 text-[0.68rem] font-mono text-neutral-400">
                        {productName.length}/60
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
                    <button
                      onClick={() => setMode('dashboard')}
                      className="text-xs font-subtitle font-bold text-neutral-600 hover:text-[var(--preto)] cursor-pointer border-none bg-transparent"
                    >
                      Cancelar
                    </button>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => {
                        if (!productName.trim()) {
                          onToast('Digite o nome do produto ou serviço.');
                          return;
                        }
                        jumpToSubStep(2);
                      }}
                      className="py-3 px-6 text-xs uppercase font-bold tracking-wider bg-[var(--exodo-red)] hover:bg-red-700 text-white"
                    >
                      Continuar →
                    </Button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------- */}
              {/* SCREEN 3: MÓDULO 01 - PÚBLICO-ALVO (SubStep 2)        */}
              {/* ----------------------------------------------------- */}
              {currentSubStep === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-1">
                    <span className="text-[0.65rem] font-subtitle font-bold text-neutral-500 uppercase tracking-wider">
                      MÓDULO 01 DE 04
                    </span>
                    <h2 className="font-title text-xl text-[var(--preto)] font-bold">
                      Para qual público-alvo principal este produto é oferecido?
                    </h2>
                    <p className="font-body text-xs text-neutral-600">
                      Selecione os públicos que mais se beneficiam deste produto.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {PRESET_AUDIENCES.map((aud) => {
                        const isSelected = selectedAudiences.includes(aud);
                        return (
                          <button
                            key={aud}
                            type="button"
                            onClick={() => toggleAudience(aud)}
                            className={`px-3 py-2 text-xs font-subtitle border transition-all cursor-pointer text-left ${
                              isSelected
                                ? 'bg-[var(--exodo-red)] text-white border-[var(--exodo-red)] font-bold shadow-sm'
                                : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-500'
                            }`}
                          >
                            {aud}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Adicionar outro público personalizado..."
                        value={customAudienceInput}
                        onChange={(e) => setCustomAudienceInput(e.target.value)}
                        className="flex-1 p-2 border border-neutral-300 text-xs outline-none"
                      />
                      <button
                        type="button"
                        onClick={addCustomAudience}
                        className="py-2 px-3 bg-neutral-800 text-white text-xs font-subtitle font-bold uppercase cursor-pointer border-none"
                      >
                        + Incluir
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
                    <button
                      onClick={() => jumpToSubStep(1)}
                      className="text-xs font-subtitle font-bold text-neutral-600 hover:text-[var(--preto)] cursor-pointer border-none bg-transparent"
                    >
                      ← Voltar
                    </button>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => jumpToSubStep(3)}
                      className="py-3 px-6 text-xs uppercase font-bold tracking-wider bg-[var(--exodo-red)] hover:bg-red-700 text-white"
                    >
                      Continuar →
                    </Button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------- */}
              {/* SCREEN 4: MÓDULO 01 - OBJETIVO PRINCIPAL (SubStep 3)  */}
              {/* ----------------------------------------------------- */}
              {currentSubStep === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-1">
                    <span className="text-[0.65rem] font-subtitle font-bold text-neutral-500 uppercase tracking-wider">
                      MÓDULO 01 DE 04
                    </span>
                    <h2 className="font-title text-xl text-[var(--preto)] font-bold">
                      Qual é o objetivo principal deste produto?
                    </h2>
                    <p className="font-body text-xs text-neutral-600">
                      Selecione quantos objetivos forem necessários.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PRESET_OBJECTIVES.map((obj) => {
                        const isSelected = selectedObjectives.includes(obj);
                        return (
                          <button
                            key={obj}
                            type="button"
                            onClick={() => toggleObjective(obj)}
                            className={`p-3 text-left text-xs font-subtitle border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-[var(--exodo-red)] text-white border-[var(--exodo-red)] font-bold'
                                : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400'
                            }`}
                          >
                            <span>{obj}</span>
                            {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Adicionar outro objetivo personalizado..."
                        value={customObjectiveInput}
                        onChange={(e) => setCustomObjectiveInput(e.target.value)}
                        className="flex-1 p-2 border border-neutral-300 text-xs outline-none"
                      />
                      <button
                        type="button"
                        onClick={addCustomObjective}
                        className="py-2 px-3 bg-neutral-800 text-white text-xs font-subtitle font-bold uppercase cursor-pointer border-none"
                      >
                        + Incluir
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
                    <button
                      onClick={() => jumpToSubStep(2)}
                      className="text-xs font-subtitle font-bold text-neutral-600 hover:text-[var(--preto)] cursor-pointer border-none bg-transparent"
                    >
                      ← Voltar
                    </button>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => jumpToSubStep(4)}
                      className="py-3 px-6 text-xs uppercase font-bold tracking-wider bg-[var(--exodo-red)] hover:bg-red-700 text-white"
                    >
                      Continuar →
                    </Button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------- */}
              {/* SCREEN 5: MÓDULO 01 - FORMATO DO ATENDIMENTO (SubStep 4)*/}
              {/* ----------------------------------------------------- */}
              {currentSubStep === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-1">
                    <span className="text-[0.65rem] font-subtitle font-bold text-neutral-500 uppercase tracking-wider">
                      MÓDULO 01 DE 04
                    </span>
                    <h2 className="font-title text-xl text-[var(--preto)] font-bold">
                      Qual é o formato do atendimento?
                    </h2>
                    <p className="font-body text-xs text-neutral-600">
                      Selecione o formato principal deste produto.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { id: 'Online', label: 'Online', desc: 'Atendimentos por videoconferência', icon: Video },
                      { id: 'Presencial', label: 'Presencial', desc: 'Consultório físico', icon: Building },
                      { id: 'Híbrido', label: 'Híbrido', desc: 'Presencial + Online', icon: Monitor }
                    ].map((fmt) => {
                      const IconComponent = fmt.icon;
                      const isSelected = format === fmt.id;
                      return (
                        <button
                          key={fmt.id}
                          type="button"
                          onClick={() => setFormat(fmt.id)}
                          className={`p-5 text-center border-2 transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 relative ${
                            isSelected
                              ? 'bg-red-50/30 border-[var(--exodo-red)] shadow-md'
                              : 'bg-white border-neutral-300 hover:border-neutral-400'
                          }`}
                        >
                          {isSelected && (
                            <span className="absolute top-2 right-2 w-5 h-5 bg-[var(--exodo-red)] text-white rounded-full flex items-center justify-center text-[0.65rem] font-bold">
                              ✓
                            </span>
                          )}
                          <div className={`p-3 rounded-full ${isSelected ? 'bg-[var(--exodo-red)] text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <span className="font-title font-bold text-sm block">{fmt.label}</span>
                          <span className="text-[0.7rem] text-neutral-500 block leading-tight">{fmt.desc}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
                    <button
                      onClick={() => jumpToSubStep(3)}
                      className="text-xs font-subtitle font-bold text-neutral-600 hover:text-[var(--preto)] cursor-pointer border-none bg-transparent"
                    >
                      ← Voltar
                    </button>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => jumpToSubStep(5)}
                      className="py-3 px-6 text-xs uppercase font-bold tracking-wider bg-[var(--exodo-red)] hover:bg-red-700 text-white"
                    >
                      Continuar →
                    </Button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------- */}
              {/* SCREEN 6: MÓDULO 02 - DURAÇÃO DO ACOMPANHAMENTO (SubStep 5)*/}
              {/* ----------------------------------------------------- */}
              {currentSubStep === 5 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-1">
                    <span className="text-[0.65rem] font-subtitle font-bold text-neutral-500 uppercase tracking-wider">
                      MÓDULO 02 DE 04
                    </span>
                    <h2 className="font-title text-xl text-[var(--preto)] font-bold">
                      Qual é a duração total do acompanhamento?
                    </h2>
                    <p className="font-body text-xs text-neutral-600">
                      Defina o tempo total de vigência do contrato deste produto.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { days: 1, label: 'Sessão Única / Avulsa' },
                      { days: 30, label: '30 Dias (1 Mês)' },
                      { days: 60, label: '60 Dias (2 Meses)' },
                      { days: 90, label: '90 Dias (3 Meses)' },
                      { days: 180, label: '180 Dias (6 Meses)' },
                      { days: 360, label: '360 Dias (12 Meses)' }
                    ].map((opt) => {
                      const isSelected = !isCustomDuration && durationDays === opt.days;
                      return (
                        <button
                          key={opt.days}
                          type="button"
                          onClick={() => handleSelectPresetDuration(opt.days, opt.label)}
                          className={`p-3.5 text-center border-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[var(--exodo-red)] text-white border-[var(--exodo-red)] font-bold shadow-sm'
                              : 'bg-white text-neutral-800 border-neutral-300 hover:border-neutral-400'
                          }`}
                        >
                          <span className="font-subtitle text-xs block">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-4 bg-neutral-50 border border-neutral-300 space-y-2">
                    <span className="text-xs font-subtitle font-bold text-neutral-800 uppercase block">
                      Outra duração personalizada
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ex: 45 Dias (6 Semanas)"
                        value={customDurationText}
                        onChange={(e) => setCustomDurationText(e.target.value)}
                        className="flex-1 p-2 border border-neutral-300 text-xs font-subtitle outline-none bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCustomDuration}
                        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-subtitle font-bold uppercase cursor-pointer border-none"
                      >
                        Usar esta duração
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
                    <button
                      onClick={() => jumpToSubStep(4)}
                      className="text-xs font-subtitle font-bold text-neutral-600 hover:text-[var(--preto)] cursor-pointer border-none bg-transparent"
                    >
                      ← Voltar
                    </button>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => jumpToSubStep(6)}
                      className="py-3 px-6 text-xs uppercase font-bold tracking-wider bg-[var(--exodo-red)] hover:bg-red-700 text-white"
                    >
                      Continuar →
                    </Button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------- */}
              {/* SCREEN 7: MÓDULO 02 - ENTREGAS E FREQUÊNCIAS (SubStep 6)*/}
              {/* ----------------------------------------------------- */}
              {currentSubStep === 6 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[0.65rem] font-subtitle font-bold text-neutral-500 uppercase tracking-wider">
                        MÓDULO 02 DE 04
                      </span>
                      <h2 className="font-title text-xl text-[var(--preto)] font-bold">
                        Quais entregas e serviços fazem parte deste produto?
                      </h2>
                      <p className="font-body text-xs text-neutral-600">
                        Defina as entregas, a frequência e o tempo de cada uma.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCustomDeliveryInput('Nova Entrega Customizada')}
                      className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-xs font-subtitle font-bold uppercase text-neutral-800 cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Nova entrega</span>
                    </button>
                  </div>

                  {/* Deliverables List */}
                  <div className="space-y-2">
                    {deliverablesList.map((del) => {
                      const totalMins = (del.occurrencesIn3Months || 1) * (del.minutesPerOccurrence || 0);
                      return (
                        <div
                          key={del.id}
                          className="p-3 bg-white border border-neutral-300 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex-1 space-y-1">
                            <input
                              type="text"
                              value={del.name}
                              onChange={(e) => handleUpdateDeliverable(del.id, 'name', e.target.value)}
                              className="w-full font-subtitle font-bold text-neutral-900 border-none outline-none focus:bg-neutral-50 p-1"
                            />
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="text"
                              value={del.frequency}
                              onChange={(e) => handleUpdateDeliverable(del.id, 'frequency', e.target.value)}
                              className="w-28 p-1.5 border border-neutral-300 text-[0.7rem] font-subtitle text-neutral-700 bg-white"
                              placeholder="Frequência"
                            />

                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min="1"
                                value={del.minutesPerOccurrence}
                                onChange={(e) =>
                                  handleUpdateDeliverable(
                                    del.id,
                                    'minutesPerOccurrence',
                                    parseInt(e.target.value, 10) || 0
                                  )
                                }
                                className="w-16 p-1.5 border border-neutral-300 font-mono text-[0.7rem] font-bold text-center"
                              />
                              <span className="text-[0.65rem] text-neutral-500">min por ocor.</span>
                            </div>

                            <span className="text-[0.7rem] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                              = {totalMins} min em 3 meses
                            </span>

                            <button
                              type="button"
                              onClick={() => handleRemoveDeliverable(del.id)}
                              className="text-neutral-400 hover:text-red-600 p-1 cursor-pointer bg-transparent border-none"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Custom Delivery Input Bar */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Nome da nova entrega/serviço..."
                      value={customDeliveryInput}
                      onChange={(e) => setCustomDeliveryInput(e.target.value)}
                      className="flex-1 p-2 border border-neutral-300 text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomDeliverable}
                      className="py-2 px-3 bg-neutral-800 text-white text-xs font-subtitle font-bold uppercase cursor-pointer border-none"
                    >
                      Adicionar Entrega
                    </button>
                  </div>

                  {/* Calculated Total Minutes Card */}
                  <div className="bg-emerald-50 border border-emerald-300 p-4 rounded flex items-center justify-between">
                    <div>
                      <span className="text-[0.65rem] font-subtitle font-bold text-emerald-800 uppercase block">
                        Tempo total calculado
                      </span>
                      <strong className="font-title text-xl text-emerald-950 font-bold">
                        {calculatedTotalMinutes} min ({calculatedTotalHours} horas) em 3 meses
                      </strong>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
                    <button
                      onClick={() => jumpToSubStep(5)}
                      className="text-xs font-subtitle font-bold text-neutral-600 hover:text-[var(--preto)] cursor-pointer border-none bg-transparent"
                    >
                      ← Voltar
                    </button>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => jumpToSubStep(7)}
                      className="py-3 px-6 text-xs uppercase font-bold tracking-wider bg-[var(--exodo-red)] hover:bg-red-700 text-white"
                    >
                      Continuar →
                    </Button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------- */}
              {/* SCREEN 8: MÓDULO 03 - COMERCIAL (SubStep 7)          */}
              {/* ----------------------------------------------------- */}
              {currentSubStep === 7 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-1">
                    <span className="text-[0.65rem] font-subtitle font-bold text-neutral-500 uppercase tracking-wider">
                      MÓDULO 03 DE 04
                    </span>
                    <h2 className="font-title text-xl text-[var(--preto)] font-bold">
                      Qual é o valor e a forma de pagamento?
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Q1: Valor */}
                    <div className="space-y-2">
                      <label className="block text-xs font-subtitle font-bold text-neutral-800">
                        1. Qual o valor cobrado por este produto?
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-title font-bold text-sm text-neutral-500">
                          R$
                        </span>
                        <input
                          type="number"
                          placeholder="450,00"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 border-2 border-neutral-300 font-title font-bold text-base outline-none bg-white"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="estPrice"
                          checked={isPriceEstimated}
                          onChange={(e) => setIsPriceEstimated(e.target.checked)}
                          className="w-4 h-4 accent-[var(--exodo-red)] cursor-pointer"
                        />
                        <label htmlFor="estPrice" className="text-xs text-neutral-600 cursor-pointer">
                          Este é um valor estimado / aproximado
                        </label>
                      </div>
                    </div>

                    {/* Q2: Forma de Pagamento */}
                    <div className="space-y-2 pt-3 border-t border-neutral-200">
                      <label className="block text-xs font-subtitle font-bold text-neutral-800">
                        2. Como o paciente normalmente realiza o pagamento?
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          'À vista / PIX',
                          'Parcelado no cartão',
                          'Boleto / Carnê',
                          'Mensalidade / Recorrência',
                          'Por sessão realizada',
                          'Transferência / Depósito'
                        ].map((pm) => {
                          const isSelected = selectedPaymentMethods.includes(pm);
                          return (
                            <button
                              key={pm}
                              type="button"
                              onClick={() => togglePaymentMethod(pm)}
                              className={`p-2.5 text-center text-xs font-subtitle border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[var(--exodo-red)] text-white border-[var(--exodo-red)] font-bold'
                                  : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400'
                              }`}
                            >
                              {pm}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Q3: Quantos pacientes ativos */}
                    <div className="space-y-2 pt-3 border-t border-neutral-200">
                      <label className="block text-xs font-subtitle font-bold text-neutral-800">
                        3. Quantos pacientes ativos você atende neste produto hoje?
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            const val = Math.max(0, (parseInt(activePatients, 10) || 0) - 1);
                            setActivePatients(val.toString());
                          }}
                          className="w-8 h-8 bg-neutral-200 hover:bg-neutral-300 font-bold text-neutral-800 rounded flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={activePatients}
                          onChange={(e) => setActivePatients(e.target.value)}
                          className="w-20 p-2 border-2 border-neutral-300 text-center font-title font-bold text-lg outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const val = (parseInt(activePatients, 10) || 0) + 1;
                            setActivePatients(val.toString());
                          }}
                          className="w-8 h-8 bg-neutral-200 hover:bg-neutral-300 font-bold text-neutral-800 rounded flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="estPatients"
                          checked={isActivePatientsEstimated}
                          onChange={(e) => setIsActivePatientsEstimated(e.target.checked)}
                          className="w-4 h-4 accent-[var(--exodo-red)] cursor-pointer"
                        />
                        <label htmlFor="estPatients" className="text-xs text-neutral-600 cursor-pointer">
                          Este é um número estimado / aproximado
                        </label>
                      </div>
                    </div>

                    {/* 3 Calculated Financial Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-neutral-200">
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">
                        <span className="text-[0.62rem] font-subtitle font-bold text-emerald-800 uppercase block">
                          Receita mensal
                        </span>
                        <strong className="font-title text-base text-emerald-950 font-bold block mt-0.5">
                          R$ {monthlyRevenue.toLocaleString('pt-BR')}
                        </strong>
                        <span className="text-[0.62rem] text-emerald-700">({numericPatients} pacientes)</span>
                      </div>

                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">
                        <span className="text-[0.62rem] font-subtitle font-bold text-emerald-800 uppercase block">
                          Receita em 3 meses
                        </span>
                        <strong className="font-title text-base text-emerald-950 font-bold block mt-0.5">
                          R$ {threeMonthRevenue.toLocaleString('pt-BR')}
                        </strong>
                      </div>

                      <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                        <span className="text-[0.62rem] font-subtitle font-bold text-amber-800 uppercase block">
                          Tempo por paciente
                        </span>
                        <strong className="font-title text-base text-amber-950 font-bold block mt-0.5">
                          {calculatedTotalHours} horas
                        </strong>
                        <span className="text-[0.62rem] text-amber-800">em 3 meses</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
                    <button
                      onClick={() => jumpToSubStep(6)}
                      className="text-xs font-subtitle font-bold text-neutral-600 hover:text-[var(--preto)] cursor-pointer border-none bg-transparent"
                    >
                      ← Voltar
                    </button>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => jumpToSubStep(8)}
                      className="py-3 px-6 text-xs uppercase font-bold tracking-wider bg-[var(--exodo-red)] hover:bg-red-700 text-white"
                    >
                      Continuar →
                    </Button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------- */}
              {/* SCREEN 9: MÓDULO 04 - REVISÃO E RESUMO FINAL (SubStep 8)*/}
              {/* ----------------------------------------------------- */}
              {currentSubStep === 8 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-1">
                    <span className="text-[0.65rem] font-subtitle font-bold text-neutral-500 uppercase tracking-wider">
                      MÓDULO 04 DE 04
                    </span>
                    <h2 className="font-title text-xl text-[var(--preto)] font-bold">
                      Revise seu produto antes de salvar
                    </h2>
                    <p className="font-body text-xs text-neutral-600">
                      Confira os detalhes e faça ajustes se necessário.
                    </p>
                  </div>

                  {/* Summary Table with per-line "Editar" link */}
                  <div className="border border-neutral-300 divide-y divide-neutral-200 bg-white text-xs">
                    <div className="p-3 flex items-center justify-between hover:bg-neutral-50">
                      <div>
                        <span className="text-[0.65rem] font-bold text-neutral-400 uppercase block">Nome do produto</span>
                        <strong className="text-neutral-900 font-subtitle">{productName || 'Sem nome'}</strong>
                      </div>
                      <button onClick={() => jumpToSubStep(1)} className="text-[0.7rem] font-bold text-[var(--exodo-red)] cursor-pointer bg-transparent border-none">
                        Editar
                      </button>
                    </div>

                    <div className="p-3 flex items-center justify-between hover:bg-neutral-50">
                      <div>
                        <span className="text-[0.65rem] font-bold text-neutral-400 uppercase block">Público-alvo</span>
                        <span className="text-neutral-800">{selectedAudiences.join(', ')}</span>
                      </div>
                      <button onClick={() => jumpToSubStep(2)} className="text-[0.7rem] font-bold text-[var(--exodo-red)] cursor-pointer bg-transparent border-none">
                        Editar
                      </button>
                    </div>

                    <div className="p-3 flex items-center justify-between hover:bg-neutral-50">
                      <div>
                        <span className="text-[0.65rem] font-bold text-neutral-400 uppercase block">Objetivo principal</span>
                        <span className="text-neutral-800">{selectedObjectives.join(', ')}</span>
                      </div>
                      <button onClick={() => jumpToSubStep(3)} className="text-[0.7rem] font-bold text-[var(--exodo-red)] cursor-pointer bg-transparent border-none">
                        Editar
                      </button>
                    </div>

                    <div className="p-3 flex items-center justify-between hover:bg-neutral-50">
                      <div>
                        <span className="text-[0.65rem] font-bold text-neutral-400 uppercase block">Formato</span>
                        <span className="text-neutral-800">{format}</span>
                      </div>
                      <button onClick={() => jumpToSubStep(4)} className="text-[0.7rem] font-bold text-[var(--exodo-red)] cursor-pointer bg-transparent border-none">
                        Editar
                      </button>
                    </div>

                    <div className="p-3 flex items-center justify-between hover:bg-neutral-50">
                      <div>
                        <span className="text-[0.65rem] font-bold text-neutral-400 uppercase block">Duração</span>
                        <span className="text-neutral-800">{durationLabel}</span>
                      </div>
                      <button onClick={() => jumpToSubStep(5)} className="text-[0.7rem] font-bold text-[var(--exodo-red)] cursor-pointer bg-transparent border-none">
                        Editar
                      </button>
                    </div>

                    <div className="p-3 flex items-center justify-between hover:bg-neutral-50">
                      <div>
                        <span className="text-[0.65rem] font-bold text-neutral-400 uppercase block">Entregas e frequências</span>
                        <span className="text-neutral-800">{deliverablesList.length} entregas configuradas</span>
                      </div>
                      <button onClick={() => jumpToSubStep(6)} className="text-[0.7rem] font-bold text-[var(--exodo-red)] cursor-pointer bg-transparent border-none">
                        Editar
                      </button>
                    </div>

                    <div className="p-3 flex items-center justify-between hover:bg-neutral-50">
                      <div>
                        <span className="text-[0.65rem] font-bold text-neutral-400 uppercase block">Tempo total estimado</span>
                        <strong className="text-emerald-800 font-mono">{calculatedTotalHours} horas em 3 meses</strong>
                      </div>
                      <button onClick={() => jumpToSubStep(6)} className="text-[0.7rem] font-bold text-[var(--exodo-red)] cursor-pointer bg-transparent border-none">
                        Editar
                      </button>
                    </div>

                    <div className="p-3 flex items-center justify-between hover:bg-neutral-50">
                      <div>
                        <span className="text-[0.65rem] font-bold text-neutral-400 uppercase block">Valor do produto</span>
                        <strong className="text-neutral-900 font-title">R$ {numericPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                      </div>
                      <button onClick={() => jumpToSubStep(7)} className="text-[0.7rem] font-bold text-[var(--exodo-red)] cursor-pointer bg-transparent border-none">
                        Editar
                      </button>
                    </div>

                    <div className="p-3 flex items-center justify-between hover:bg-neutral-50">
                      <div>
                        <span className="text-[0.65rem] font-bold text-neutral-400 uppercase block">Forma de pagamento</span>
                        <span className="text-neutral-800">{selectedPaymentMethods.join(', ')}</span>
                      </div>
                      <button onClick={() => jumpToSubStep(7)} className="text-[0.7rem] font-bold text-[var(--exodo-red)] cursor-pointer bg-transparent border-none">
                        Editar
                      </button>
                    </div>

                    <div className="p-3 flex items-center justify-between hover:bg-neutral-50">
                      <div>
                        <span className="text-[0.65rem] font-bold text-neutral-400 uppercase block">Pacientes ativos</span>
                        <span className="text-neutral-800">{numericPatients} pacientes</span>
                      </div>
                      <button onClick={() => jumpToSubStep(7)} className="text-[0.7rem] font-bold text-[var(--exodo-red)] cursor-pointer bg-transparent border-none">
                        Editar
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-300 text-xs font-subtitle text-emerald-900 flex items-center gap-2 rounded">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Tudo pronto! Este produto está completo e pronto para ser salvo.</span>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
                    <button
                      onClick={() => jumpToSubStep(7)}
                      className="text-xs font-subtitle font-bold text-neutral-600 hover:text-[var(--preto)] cursor-pointer border-none bg-transparent"
                    >
                      ← Voltar
                    </button>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleSaveCurrentProduct}
                      className="py-3 px-6 text-xs uppercase font-bold tracking-wider bg-[var(--exodo-red)] hover:bg-red-700 text-white shadow-md"
                    >
                      Salvar Produto ✓
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 3: SAVED SUCCESS CANVAS VIEW */}
          {mode === 'saved_success' && (
            <div className="bg-white border-2 border-[var(--preto)] p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="font-title text-2xl text-[var(--preto)] font-bold">
                  Produto cadastrado com sucesso!
                </h2>
                <p className="font-body text-xs text-neutral-600 max-w-md mx-auto">
                  Seu catálogo agora possui {products.length} {products.length === 1 ? 'produto cadastrado' : 'produtos cadastrados'}.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-neutral-100">
                <button
                  onClick={handleStartNewProduct}
                  className="w-full sm:w-auto py-3 px-6 bg-[var(--exodo-red)] hover:bg-red-700 text-white font-subtitle font-bold text-xs uppercase tracking-wider cursor-pointer border-none shadow-sm transition-all"
                >
                  Adicionar outro produto
                </button>
                <button
                  onClick={() => setMode('dashboard')}
                  className="w-full sm:w-auto py-3 px-6 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-subtitle font-bold text-xs uppercase tracking-wider cursor-pointer border border-neutral-300 transition-all"
                >
                  Ver catálogo completo
                </button>
              </div>
            </div>
          )}
        </main>

        {/* ========================================================= */}
        {/* RIGHT DRAWER / SIDEBAR: PRODUTO EM CONSTRUÇÃO             */}
        {/* ========================================================= */}
        <aside className="lg:col-span-3 xl:col-span-3 bg-white border-l border-t lg:border-t-0 border-neutral-200 p-4 shrink-0 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <span className="text-[0.68rem] font-subtitle font-bold uppercase tracking-wider text-[var(--preto)] flex items-center gap-1.5">
              <Box className="w-4 h-4 text-[var(--exodo-red)]" />
              PRODUTO EM CONSTRUÇÃO
            </span>
          </div>

          {mode === 'dashboard' ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 bg-neutral-100 text-neutral-400 rounded-lg flex items-center justify-center mx-auto border border-neutral-200">
                <Box className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <strong className="font-subtitle font-bold text-xs text-neutral-800 block">
                  Nenhum produto em edição
                </strong>
                <p className="text-[0.7rem] text-neutral-500 font-body px-2">
                  Clique em "Novo Produto" para começar a cadastrar.
                </p>
              </div>
            </div>
          ) : mode === 'saved_success' ? (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <strong className="font-subtitle font-bold text-xs text-emerald-950 uppercase">
                  Produto cadastrado com sucesso!
                </strong>
              </div>
              <p className="text-[0.72rem] text-emerald-800 font-body">
                Seu catálogo agora possui {products.length} {products.length === 1 ? 'produto cadastrado' : 'produtos cadastrados'}.
              </p>
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleStartNewProduct}
                  className="w-full py-2 bg-[var(--exodo-red)] text-white text-[0.7rem] font-subtitle font-bold uppercase tracking-wider border-none cursor-pointer"
                >
                  Adicionar outro produto
                </button>
                <button
                  onClick={() => setMode('dashboard')}
                  className="w-full py-2 bg-white text-neutral-800 text-[0.7rem] font-subtitle font-bold uppercase tracking-wider border border-neutral-300 cursor-pointer"
                >
                  Ver catálogo completo
                </button>
              </div>
            </div>
          ) : (
            /* Live Checklist during Wizard Mode */
            <div className="space-y-3 text-xs font-subtitle">
              <div className="p-3 bg-neutral-50 border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[0.65rem] text-neutral-400 uppercase font-bold">STATUS DO CADASTRO</span>
                  <span className="text-[0.68rem] font-bold text-[var(--exodo-red)]">
                    Módulo 0{currentModule} / 04
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-neutral-700">
                      {productName ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 inline-block" />
                      )}
                      <span>Nome</span>
                    </span>
                    <strong className="text-[0.7rem] text-neutral-900 truncate max-w-[100px]">
                      {productName || 'Pendente'}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-neutral-700">
                      {selectedAudiences.length > 0 ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 shrink-0 inline-block" />
                      )}
                      <span>Público</span>
                    </span>
                    <strong className="text-[0.7rem] text-neutral-900 truncate max-w-[100px]">
                      {selectedAudiences[0] || 'Pendente'}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-neutral-700">
                      {selectedObjectives.length > 0 ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 shrink-0 inline-block" />
                      )}
                      <span>Objetivo</span>
                    </span>
                    <strong className="text-[0.7rem] text-neutral-900 truncate max-w-[100px]">
                      {selectedObjectives[0] || 'Pendente'}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-neutral-700">
                      {format ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 shrink-0 inline-block" />
                      )}
                      <span>Formato</span>
                    </span>
                    <strong className="text-[0.7rem] text-neutral-900">{format}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-neutral-700">
                      {durationLabel ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 shrink-0 inline-block" />
                      )}
                      <span>Duração</span>
                    </span>
                    <strong className="text-[0.7rem] text-neutral-900">{durationLabel}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-neutral-700">
                      {deliverablesList.length > 0 ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 shrink-0 inline-block" />
                      )}
                      <span>Entregas</span>
                    </span>
                    <strong className="text-[0.7rem] text-emerald-800 font-mono">
                      {deliverablesList.length} items ({calculatedTotalHours}h)
                    </strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-neutral-700">
                      {price ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 shrink-0 inline-block" />
                      )}
                      <span>Comercial</span>
                    </span>
                    <strong className="text-[0.7rem] text-neutral-900">
                      R$ {numericPrice} | {numericPatients} pac.
                    </strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-neutral-700">
                      {currentSubStep === 8 ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 shrink-0 inline-block" />
                      )}
                      <span>Revisão</span>
                    </span>
                    <strong className="text-[0.7rem] text-neutral-500">
                      {currentSubStep === 8 ? 'Concluída' : 'Pendente'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
