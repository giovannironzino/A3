import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  HelpCircle, 
  Lock, 
  User, 
  Building2, 
  Mail, 
  LogOut, 
  Save, 
  Check, 
  ChevronRight, 
  ChevronDown,
  BrainCircuit, 
  Compass, 
  Target, 
  ShieldCheck, 
  Calculator,
  RefreshCw,
  Eye,
  Zap,
  Award,
  FileText,
  Calendar,
  Package,
  Users,
  Clock
} from 'lucide-react';
import { Button } from './UIPrimitives';
import { Logo } from './Logo';
import { ProductsStep } from './ProductsStep';
import { PatientWorkloadStep } from './PatientWorkloadStep';
import { ScheduleStep } from './ScheduleStep';
import { OtherActivitiesStep } from './OtherActivitiesStep';
import { CurrentModelStep } from './CurrentModelStep';
import { ExpectationsStep } from './ExpectationsStep';
import { BoundariesStep } from './BoundariesStep';
import { ConfigurationChoiceStep } from './ConfigurationChoiceStep';
import { TacticalPlanStep } from './TacticalPlanStep';
import { JourneyTrail, StageName } from './JourneyTrail';
import { FormalDeliverablesModal } from './FormalDeliverablesModal';
import { A3Product, A3ScheduleOccupancy, A3ScheduleData, A3TimeLibraryData, A3DeliveryContractsData, A3PortfolioData, A3OtherActivitiesData, A3CurrentModel, A3ExpectationsData, A3BoundariesData, A3ExplorationResult, A3ChosenConfigurationData, A3TacticalPlanData, A3State, A3UserData, ViewMode } from '../types';
import { runNavigatorEngine } from '../lib/navigatorEngine';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

interface A3SystemProps {
  onBackToLanding: () => void;
  onToast: (msg: string) => void;
}

// Initial mock state for A3 system
const STORAGE_KEY = 'exodo_a3_state_v1';

export const A3System: React.FC<A3SystemProps> = ({ onBackToLanding, onToast }) => {
  // Authentication & User State (Defaults to active subscriber profile)
  const [user, setUser] = useState<A3UserData | null>(() => {
    const saved = localStorage.getItem('exodo_a3_user');
    return saved ? JSON.parse(saved) : {
      name: 'Dra. Amanda Silva',
      email: 'amanda@nutricao.com.br',
      clinicName: 'Consultório de Nutrição',
    };
  });

  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');
  const [clinicName, setClinicName] = useState('');

  // Structured answers store
  const [answers, setAnswers] = useState<Record<string, { value: any; isEstimate?: boolean; savedAt: string }>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  // Flow State
  const [startedWizard, setStartedWizard] = useState(true);
  const [activeStage, setActiveStage] = useState<StageName>('products');
  const [activeDeliverableModal, setActiveDeliverableModal] = useState<'retrato' | 'caminho' | 'plano' | null>(null);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [lastSavedField, setLastSavedField] = useState<string | null>(null);

  // Monitor Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUid(fbUser.uid);
        const userData: A3UserData = {
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Nutricionista',
          email: fbUser.email || '',
          clinicName: clinicName || 'Consultório de Nutrição',
        };
        setUser(userData);

        // Fetch answers from Firestore if available
        try {
          const answersCol = collection(db, 'users', fbUser.uid, 'a3_answers');
          const snapshot = await getDocs(answersCol);
          if (!snapshot.empty) {
            const loadedAnswers: Record<string, { value: any; isEstimate?: boolean; savedAt: string }> = {};
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              loadedAnswers[docSnap.id] = {
                value: data.value,
                isEstimate: data.isEstimate,
                savedAt: data.savedAt,
              };
            });
            setAnswers((prev) => ({ ...prev, ...loadedAnswers }));
          }
        } catch (err) {
          console.warn('Firestore load warning:', err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('exodo_a3_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('exodo_a3_user');
    }
  }, [user]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      setFirebaseUid(fbUser.uid);
      const newUser: A3UserData = {
        name: fbUser.displayName || 'Nutricionista',
        email: fbUser.email || '',
        clinicName: clinicName || 'Consultório de Nutrição',
      };
      setUser(newUser);

      // Save user profile to Firestore
      try {
        await setDoc(doc(db, 'users', fbUser.uid), {
          userId: fbUser.uid,
          name: newUser.name,
          email: newUser.email,
          clinicName: newUser.clinicName,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (err) {
        console.warn('Firestore user profile save notice:', err);
      }

      onToast(`Conectado com Google como ${newUser.name}!`);
    } catch (err: any) {
      console.error(err);
      onToast('Não foi possível entrar com Google. Tente o login padrão.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginName || !loginEmail) {
      onToast('Por favor, preencha seu nome e e-mail de acesso.');
      return;
    }
    const newUser: A3UserData = {
      name: loginName,
      email: loginEmail,
      clinicName: clinicName || 'Minha Clínica / Consultório',
    };
    setUser(newUser);
    onToast(`Bem-vindo(a), ${loginName}! Login realizado com sucesso.`);
  };

  const handleDemoLogin = () => {
    const demoUser: A3UserData = {
      name: 'Dra. Amanda Silva',
      email: 'amanda.nutri@clinica.com.br',
      clinicName: 'Clínica Amanda Silva Nutrição',
    };
    setUser(demoUser);
    onToast('Sessão iniciada como Dra. Amanda Silva.');
  };

  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      // ignore
    }
    setUser(null);
    setFirebaseUid(null);
    setStartedWizard(false);
    onToast('Você saiu do sistema A3.');
  };

  // Helper function to record a structured answer with visual confirmation
  const saveAnswer = async (questionId: string, value: any, isEstimate = false, fieldLabel?: string) => {
    const savedAt = new Date().toISOString();
    const newAnswers = {
      ...answers,
      [questionId]: {
        value,
        isEstimate,
        savedAt,
      },
    };
    setAnswers(newAnswers);
    setLastSavedField(fieldLabel || questionId);
    setShowSaveToast(true);

    // Sync to Firestore if Firebase user is authenticated
    if (firebaseUid) {
      try {
        const answerRef = doc(db, 'users', firebaseUid, 'a3_answers', questionId);
        await setDoc(answerRef, {
          questionId,
          value: typeof value === 'object' ? JSON.stringify(value) : String(value),
          isEstimate,
          savedAt,
          userId: firebaseUid,
        });
      } catch (err) {
        console.error('Firestore save warning:', err);
      }
    }

    setTimeout(() => {
      setShowSaveToast(false);
    }, 3000);
  };

  // Helper to extract saved products from answers state
  const savedProductsList: A3Product[] = answers['a3_products_catalog']?.value
    ? (typeof answers['a3_products_catalog'].value === 'string'
        ? JSON.parse(answers['a3_products_catalog'].value)
        : answers['a3_products_catalog'].value)
    : [];

  const savedOccupancyData: A3ScheduleOccupancy | null = answers['a3_agenda_occupancy']?.value
    ? (typeof answers['a3_agenda_occupancy'].value === 'string'
        ? JSON.parse(answers['a3_agenda_occupancy'].value)
        : answers['a3_agenda_occupancy'].value)
    : null;

  const savedScheduleData: A3ScheduleData | null = answers['a3_schedule_data']?.value
    ? (typeof answers['a3_schedule_data'].value === 'string'
        ? JSON.parse(answers['a3_schedule_data'].value)
        : answers['a3_schedule_data'].value)
    : null;

  const savedTimeLibraryData: A3TimeLibraryData | null = answers['a3_time_library_data']?.value
    ? (typeof answers['a3_time_library_data'].value === 'string'
        ? JSON.parse(answers['a3_time_library_data'].value)
        : answers['a3_time_library_data'].value)
    : null;

  const savedDeliveryContractsData: A3DeliveryContractsData | null = answers['a3_delivery_contracts_data']?.value
    ? (typeof answers['a3_delivery_contracts_data'].value === 'string'
        ? JSON.parse(answers['a3_delivery_contracts_data'].value)
        : answers['a3_delivery_contracts_data'].value)
    : null;

  const savedPortfolioData: A3PortfolioData | null = answers['a3_portfolio_data']?.value
    ? (typeof answers['a3_portfolio_data'].value === 'string'
        ? JSON.parse(answers['a3_portfolio_data'].value)
        : answers['a3_portfolio_data'].value)
    : null;

  const savedOtherActivitiesData: A3OtherActivitiesData | null = answers['a3_other_activities_data']?.value
    ? (typeof answers['a3_other_activities_data'].value === 'string'
        ? JSON.parse(answers['a3_other_activities_data'].value)
        : answers['a3_other_activities_data'].value)
    : null;

  const savedCurrentModelData: A3CurrentModel | null = answers['a3_current_model_data']?.value
    ? (typeof answers['a3_current_model_data'].value === 'string'
        ? JSON.parse(answers['a3_current_model_data'].value)
        : answers['a3_current_model_data'].value)
    : null;

  const savedExpectationsData: A3ExpectationsData | null = answers['a3_expectations_data']?.value
    ? (typeof answers['a3_expectations_data'].value === 'string'
        ? JSON.parse(answers['a3_expectations_data'].value)
        : answers['a3_expectations_data'].value)
    : null;

  const savedBoundariesData: A3BoundariesData | null = answers['a3_boundaries_data']?.value
    ? (typeof answers['a3_boundaries_data'].value === 'string'
        ? JSON.parse(answers['a3_boundaries_data'].value)
        : answers['a3_boundaries_data'].value)
    : null;

  const savedExplorationResult: A3ExplorationResult | null = answers['a3_exploration_result']?.value
    ? (typeof answers['a3_exploration_result'].value === 'string'
        ? JSON.parse(answers['a3_exploration_result'].value)
        : answers['a3_exploration_result'].value)
    : null;

  const savedChosenConfigData: A3ChosenConfigurationData | null = answers['a3_chosen_configuration']?.value
    ? (typeof answers['a3_chosen_configuration'].value === 'string'
        ? JSON.parse(answers['a3_chosen_configuration'].value)
        : answers['a3_chosen_configuration'].value)
    : null;

  const savedTacticalPlanData: A3TacticalPlanData | null = answers['a3_tactical_plan']?.value
    ? (typeof answers['a3_tactical_plan'].value === 'string'
        ? JSON.parse(answers['a3_tactical_plan'].value)
        : answers['a3_tactical_plan'].value)
    : null;

  // Calculated X: Weekly clinical hours consumed by current active patients across all products
  const patientWorkloadWeeklyHours = Math.round(
    savedProductsList.reduce((acc, prod) => {
      const activeCount = prod.activePatients || 0;
      const minutesPerPatient = prod.totalTimeMinutes || 180;
      const weeklyHoursPerPatient = (minutesPerPatient / 60) / 4.33;
      return acc + (activeCount * weeklyHoursPerPatient);
    }, 0) * 10
  ) / 10;

  // Available Y: Net weekly hours from schedule
  const availableWeeklyHours = savedScheduleData?.totalNetWeeklyHours || 40;

  // Calculated Z: Remaining weekly hours outside clinical care
  const remainingWeeklyHours = Math.round((availableWeeklyHours - patientWorkloadWeeklyHours) * 10) / 10;

  const handleSaveProduct = (product: A3Product) => {
    const existing = savedProductsList.filter(p => p.id !== product.id);
    const updated = [...existing, product];
    saveAnswer('a3_products_catalog', updated, false, `Produto: ${product.name}`);
  };

  const handleDeleteProduct = (productId: string) => {
    const updated = savedProductsList.filter(p => p.id !== productId);
    saveAnswer('a3_products_catalog', updated, false, 'Remoção de Produto');
  };

  const handleSaveOccupancy = (occupancy: A3ScheduleOccupancy) => {
    saveAnswer('a3_agenda_occupancy', occupancy, occupancy.isTotalEstimated, 'Ocupação da Agenda');
  };

  const handleSaveSchedule = (schedule: A3ScheduleData) => {
    saveAnswer('a3_schedule_data', schedule, false, 'Agenda Semanal Atual');
  };

  const handleSaveOtherActivities = (data: A3OtherActivitiesData) => {
    saveAnswer('a3_other_activities_data', data, false, 'Investigação Hub do Negócio');

    // Also sync investigationData, teamMembers and hoursPerNewPatientAcquired into a3_current_model_data
    const inv = data.investigation;
    const teamMembers = inv?.team?.members || [];
    
    let hoursPerNewPatientAcquired = 1.5;
    if (inv?.marketing) {
      const totalNewPatients90d = inv.marketing.channelDetails?.reduce(
        (sum, ch) => sum + (ch.newPatients90d || 0),
        0
      ) || 0;
      const monthlyNewPatients = totalNewPatients90d / 3;
      const monthlyMktHours = (inv.marketing.allocatedWeeklyHours || 2) * 4.33;
      if (monthlyNewPatients > 0) {
        hoursPerNewPatientAcquired = Math.round((monthlyMktHours / monthlyNewPatients) * 10) / 10;
      }
    }

    const existingModel = savedCurrentModelData || {
      products: savedProductsList,
      schedule: savedScheduleData,
      timeLibrary: savedTimeLibraryData,
      deliveryContracts: savedDeliveryContractsData,
      portfolio: savedPortfolioData,
      otherActivities: data,
      totalProductsCount: savedProductsList.length,
      totalWeeklyClinicalHours: savedScheduleData?.totalNetWeeklyHours || 40,
      totalMonthlyDeliveryHours: savedDeliveryContractsData?.totalClinicMonthlyDeliveryHours || 20,
      totalActivePatients: savedPortfolioData?.totalActivePatients || 10,
      validatedBlocksCount: 4,
      isApproved: true,
    };

    const updatedModel: A3CurrentModel = {
      ...existingModel,
      otherActivities: data,
      investigationData: inv || null,
      teamMembers: teamMembers,
      hoursPerNewPatientAcquired,
    };

    saveAnswer('a3_current_model_data', updatedModel, false, 'Modelo Atual Atualizado com Investigação');
  };

  const handleSaveTimeLibrary = (library: A3TimeLibraryData) => {
    saveAnswer('a3_time_library_data', library, false, 'Biblioteca de Tempos');
  };

  const handleSaveDeliveryContracts = (data: A3DeliveryContractsData) => {
    saveAnswer('a3_delivery_contracts_data', data, false, 'Contratos de Entrega ao Paciente');
  };

  const handleSavePortfolioData = (portfolio: A3PortfolioData) => {
    saveAnswer('a3_portfolio_data', portfolio, false, 'Carteira Atual de Pacientes');

    // Sync activePatients back into products list in answers so catalog has the latest patient numbers
    if (portfolio.items && portfolio.items.length > 0) {
      const updatedProducts = savedProductsList.map((prod) => {
        const item = portfolio.items.find((i) => i.productId === prod.id);
        if (item) {
          return {
            ...prod,
            activePatients: item.activePatients,
            isActivePatientsEstimated: item.isEstimate || false,
          };
        }
        return prod;
      });
      saveAnswer('a3_products_catalog', updatedProducts, false, 'Sincronização de Pacientes da Carteira');
    }
  };

  const handleSaveCurrentModel = (model: A3CurrentModel) => {
    saveAnswer('a3_current_model_data', model, false, 'Modelo Atual da Clínica');
  };

  const handleSaveExpectations = (data: A3ExpectationsData) => {
    saveAnswer('a3_expectations_data', data, false, 'Expectativas da Clínica');

    // Execução em segundo plano do Motor de Exploração e Representatividade
    if (data.expectations && data.expectations.length > 0) {
      const explorationResult = runNavigatorEngine(
        savedCurrentModelData,
        data,
        savedBoundariesData
      );
      saveAnswer('a3_exploration_result', explorationResult, false, 'Exploração do Espaço de Configurações');
    }
  };

  const handleSaveBoundaries = (data: A3BoundariesData) => {
    saveAnswer('a3_boundaries_data', data, false, 'Condições e Limites Operacionais');

    // Execução em segundo plano do Motor de Exploração e Representatividade
    if (data.items && data.items.length > 0) {
      const explorationResult = runNavigatorEngine(
        savedCurrentModelData,
        savedExpectationsData,
        data
      );
      saveAnswer('a3_exploration_result', explorationResult, false, 'Exploração do Espaço de Configurações');
    }
  };

  const handleSaveChosenConfiguration = (data: A3ChosenConfigurationData) => {
    saveAnswer('a3_chosen_configuration', data, false, `Configuração Escolhida: ${data.chosenConfig.name}`);
  };

  const handleSaveTacticalPlan = (data: A3TacticalPlanData) => {
    saveAnswer('a3_tactical_plan', data, false, `Plano Tático Aprovado: ${data.configName}`);
  };

  // Render Login View if not logged in
  if (!user) {
    return (
      <div className="min-h-[calc(100vh-76px)] bg-[var(--branco-off)] py-12 px-4 sm:px-6 md:px-12 flex flex-col justify-center items-center">
        <div className="w-full max-w-md bg-white border-2 border-[var(--preto)] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-200">
            <button
              onClick={onBackToLanding}
              className="text-xs font-subtitle font-bold text-neutral-600 hover:text-[var(--exodo-red)] flex items-center gap-1 cursor-pointer bg-transparent border-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao site
            </button>
            <span className="bg-[var(--exodo-red)] text-white text-[0.65rem] font-subtitle font-bold px-2.5 py-0.5 uppercase tracking-wider">
              Área Exclusiva A3
            </span>
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 text-[var(--exodo-red)] rounded-full mb-3 border border-red-100">
              <Compass className="w-6 h-6" />
            </div>
            <h1 className="font-title text-2xl text-[var(--preto)] tracking-tight">
              Acesso ao Sistema A3
            </h1>
            <p className="font-body text-xs text-neutral-600 mt-1 max-w-xs mx-auto">
              Apoio à Decisão Estratégica e Direcionamento Tático para Nutricionistas.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-subtitle font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Seu Nome
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Dra. Juliana Costa"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 text-sm focus:border-[var(--exodo-red)] focus:ring-1 focus:ring-[var(--exodo-red)] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-subtitle font-bold text-neutral-700 uppercase tracking-wider mb-1">
                E-mail Cadastrado
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 text-sm focus:border-[var(--exodo-red)] focus:ring-1 focus:ring-[var(--exodo-red)] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-subtitle font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Nome da Clínica / Consultório (Opcional)
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ex: Instituto Nutri & Saúde"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 text-sm focus:border-[var(--exodo-red)] focus:ring-1 focus:ring-[var(--exodo-red)] outline-none"
                />
              </div>
            </div>

            <Button variant="primary" type="submit" fullWidth className="py-3 text-xs tracking-wider uppercase font-bold">
              Entrar no A3 <ArrowRight className="w-4 h-4 ml-1 inline" />
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-200"></div></div>
            <div className="relative flex justify-center text-[0.65rem] uppercase font-subtitle font-bold">
              <span className="bg-white px-2 text-neutral-400">ou entre com</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full py-2.5 px-3 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-subtitle font-bold border border-neutral-300 cursor-pointer transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Entrar com Conta Google
          </button>

          <div className="mt-6 pt-5 border-t border-neutral-200 text-center">
            <p className="text-[0.7rem] text-neutral-500 mb-2 font-subtitle uppercase tracking-wider">
              Primeiro acesso para testes?
            </p>
            <button
              onClick={handleDemoLogin}
              className="w-full py-2.5 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-subtitle font-bold uppercase tracking-wider border border-neutral-300 cursor-pointer transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Acessar com Perfil de Teste (Dra. Amanda)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Count answered questions
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-[var(--branco-off)] pb-16">
      {/* Standalone A3 App Module Header Navbar */}
      <header className="bg-white border-b border-neutral-200 px-4 sm:px-6 md:px-8 py-2.5 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Left: Brand Logo & Module Indicator */}
          <div className="flex items-center justify-between md:justify-start gap-3">
            <div className="flex items-center gap-2.5">
              <Logo variant="color" height={24} />
              <span className="font-title font-bold text-[0.65rem] uppercase px-2 py-0.5 bg-[var(--preto)] text-white tracking-wider rounded-xs">
                SISTEMA A3
              </span>
            </div>
            <div className="hidden sm:block border-l border-neutral-300 pl-3">
              <span className="text-[0.6rem] font-title font-bold text-neutral-400 uppercase tracking-wider block leading-none">
                Módulo do Assinante
              </span>
              <span className="text-xs font-subtitle font-bold text-[var(--preto)]">
                {user?.clinicName || 'Consultório de Nutrição'}
              </span>
            </div>
          </div>

          {/* Center: Stage Navigation Menus & Deliverables */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-subtitle font-bold">
            {/* Dropdown / Menu for Bloco A */}
            <div className="relative group">
              <button className={`px-2.5 py-1.5 rounded border flex items-center gap-1.5 text-[0.72rem] font-bold uppercase cursor-pointer transition-colors ${['products', 'patient-workload', 'schedule', 'other-activities', 'current-model'].includes(activeStage) ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200'}`}>
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bloco A: Clareza</span>
                <ChevronDown className="w-3 h-3 text-neutral-500" />
              </button>
              <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-neutral-300 shadow-xl rounded-lg p-1.5 hidden group-hover:block z-50 animate-fadeIn">
                <div className="text-[0.62rem] font-bold uppercase text-neutral-400 px-2.5 py-1">Macro-Pilar A • Clareza</div>
                <button onClick={() => { setActiveStage('products'); setStartedWizard(true); }} className={`w-full text-left px-2.5 py-1.5 text-[0.72rem] font-bold rounded cursor-pointer transition-colors flex items-center justify-between ${activeStage === 'products' ? 'bg-emerald-50 text-emerald-900' : 'text-neutral-700 hover:bg-neutral-100'}`}>
                  <span>01. Catálogo de Produtos</span>
                </button>
                <button onClick={() => { setActiveStage('patient-workload'); setStartedWizard(true); }} className={`w-full text-left px-2.5 py-1.5 text-[0.72rem] font-bold rounded cursor-pointer transition-colors flex items-center justify-between ${activeStage === 'patient-workload' ? 'bg-emerald-50 text-emerald-900' : 'text-neutral-700 hover:bg-neutral-100'}`}>
                  <span>02. Carga de Pacientes</span>
                </button>
                <button onClick={() => { setActiveStage('schedule'); setStartedWizard(true); }} className={`w-full text-left px-2.5 py-1.5 text-[0.72rem] font-bold rounded cursor-pointer transition-colors flex items-center justify-between ${activeStage === 'schedule' ? 'bg-emerald-50 text-emerald-900' : 'text-neutral-700 hover:bg-neutral-100'}`}>
                  <span>03. Agenda Disponível</span>
                </button>
                <button onClick={() => { setActiveStage('other-activities'); setStartedWizard(true); }} className={`w-full text-left px-2.5 py-1.5 text-[0.72rem] font-bold rounded cursor-pointer transition-colors flex items-center justify-between ${activeStage === 'other-activities' ? 'bg-emerald-50 text-emerald-900' : 'text-neutral-700 hover:bg-neutral-100'}`}>
                  <span>04. Outras Atividades</span>
                </button>
                <button onClick={() => { setActiveStage('current-model'); setStartedWizard(true); }} className={`w-full text-left px-2.5 py-1.5 text-[0.72rem] font-bold rounded cursor-pointer transition-colors flex items-center justify-between ${activeStage === 'current-model' ? 'bg-emerald-50 text-emerald-900' : 'text-neutral-700 hover:bg-neutral-100'}`}>
                  <span>05. Modelo Atual</span>
                </button>
              </div>
            </div>

            {/* Dropdown / Menu for Bloco B */}
            <div className="relative group">
              <button className={`px-2.5 py-1.5 rounded border flex items-center gap-1.5 text-[0.72rem] font-bold uppercase cursor-pointer transition-colors ${['expectations', 'boundaries', 'configuration-choice'].includes(activeStage) ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-2xs' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200'}`}>
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                <span>Bloco B: Escolha</span>
                <ChevronDown className="w-3 h-3 text-neutral-500" />
              </button>
              <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-neutral-300 shadow-xl rounded-lg p-1.5 hidden group-hover:block z-50 animate-fadeIn">
                <div className="text-[0.62rem] font-bold uppercase text-neutral-400 px-2.5 py-1">Macro-Pilar B • Escolha</div>
                <button onClick={() => { setActiveStage('expectations'); setStartedWizard(true); }} className={`w-full text-left px-2.5 py-1.5 text-[0.72rem] font-bold rounded cursor-pointer transition-colors flex items-center justify-between ${activeStage === 'expectations' ? 'bg-amber-50 text-amber-900' : 'text-neutral-700 hover:bg-neutral-100'}`}>
                  <span>06. Expectativas</span>
                </button>
                <button onClick={() => { setActiveStage('boundaries'); setStartedWizard(true); }} className={`w-full text-left px-2.5 py-1.5 text-[0.72rem] font-bold rounded cursor-pointer transition-colors flex items-center justify-between ${activeStage === 'boundaries' ? 'bg-amber-50 text-amber-900' : 'text-neutral-700 hover:bg-neutral-100'}`}>
                  <span>07. Condições & Limites</span>
                </button>
                <button onClick={() => { setActiveStage('configuration-choice'); setStartedWizard(true); }} className={`w-full text-left px-2.5 py-1.5 text-[0.72rem] font-bold rounded cursor-pointer transition-colors flex items-center justify-between ${activeStage === 'configuration-choice' ? 'bg-amber-50 text-amber-900' : 'text-neutral-700 hover:bg-neutral-100'}`}>
                  <span>08. Configuração Escolhida</span>
                </button>
              </div>
            </div>

            {/* Quick Button for Bloco C */}
            <button 
              onClick={() => { setActiveStage('tactical-plan'); setStartedWizard(true); }}
              className={`px-2.5 py-1.5 rounded border flex items-center gap-1.5 text-[0.72rem] font-bold uppercase cursor-pointer transition-colors ${activeStage === 'tactical-plan' ? 'bg-[var(--preto)] text-white border-[var(--preto)] shadow-2xs' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200'}`}
            >
              <Zap className="w-3.5 h-3.5 text-indigo-500" />
              <span>Bloco C: Plano Tático</span>
            </button>

            {/* Modal Trigger for Entregas Formais */}
            <div className="relative group">
              <button className="px-2.5 py-1.5 bg-amber-50/70 hover:bg-amber-100 text-amber-900 rounded border border-amber-300 flex items-center gap-1.5 text-[0.72rem] font-bold uppercase cursor-pointer transition-colors">
                <FileText className="w-3.5 h-3.5 text-amber-700" />
                <span>Entregas Formais</span>
                <ChevronDown className="w-3 h-3 text-amber-700" />
              </button>
              <div className="absolute right-0 md:left-0 top-full mt-1 w-60 bg-white border border-neutral-300 shadow-xl rounded-lg p-1.5 hidden group-hover:block z-50 animate-fadeIn">
                <div className="text-[0.62rem] font-bold uppercase text-neutral-400 px-2.5 py-1">Documentos Estratégicos</div>
                <button onClick={() => setActiveDeliverableModal('retrato')} className="w-full text-left px-2.5 py-1.5 text-[0.72rem] font-bold text-neutral-800 hover:bg-amber-50 rounded cursor-pointer transition-colors flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>01. Retrato da Clínica (Bloco A)</span>
                </button>
                <button onClick={() => setActiveDeliverableModal('caminho')} className="w-full text-left px-2.5 py-1.5 text-[0.72rem] font-bold text-neutral-800 hover:bg-amber-50 rounded cursor-pointer transition-colors flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-amber-600" />
                  <span>02. O Caminho Escolhido (Bloco B)</span>
                </button>
                <button onClick={() => setActiveDeliverableModal('plano')} className="w-full text-left px-2.5 py-1.5 text-[0.72rem] font-bold text-neutral-800 hover:bg-amber-50 rounded cursor-pointer transition-colors flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>03. Plano Tático 90 Dias (Bloco C)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Subscriber Profile & Exit Button */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-2 bg-emerald-50/80 border border-emerald-200 text-emerald-900 px-2.5 py-1 text-[0.68rem] font-subtitle font-bold rounded-md">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>{user?.name || 'Dra. Amanda'}</span>
            </div>

            <button
              onClick={onBackToLanding}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-[var(--exodo-red)] text-white text-[0.7rem] font-subtitle font-bold uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5 cursor-pointer min-h-[34px]"
              title="Sair do módulo A3 e retornar à página de vendas"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair do Módulo</span>
            </button>
          </div>

        </div>
      </header>

      {/* Floating Save Toast Confirmation */}
      {showSaveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--preto)] text-white px-4 py-3 rounded shadow-2xl border-l-4 border-emerald-500 flex items-center gap-3 animate-fadeIn">
          <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <div>
            <p className="font-subtitle font-bold text-xs">Informação salva com sucesso!</p>
            <p className="font-body text-[0.7rem] text-neutral-300">
              {lastSavedField ? `Registo efetuado para: ${lastSavedField}` : 'Dados registrados na sua sessão segura.'}
            </p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className={startedWizard ? "w-full max-w-7xl mx-auto px-2 sm:px-6 pt-4" : "max-w-[800px] mx-auto px-4 sm:px-6 pt-8"}>
        {!startedWizard ? (
          /* Welcome Card & Entry Point into Wizard */
          <div className="bg-white border-2 border-[var(--preto)] p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 -mr-10 -mt-10 rounded-full pointer-events-none opacity-60" />
            
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[0.68rem] font-subtitle font-bold px-2.5 py-1 uppercase tracking-wider flex items-center gap-1">
                <BrainCircuit className="w-3.5 h-3.5 text-amber-700" />
                Diagnóstico & Plano Tático A3
              </span>
            </div>

            <h1 className="font-title text-2xl sm:text-3xl text-[var(--preto)] tracking-tight leading-tight mb-3">
              Olá, {user.name.split(' ')[0]}! Vamos desenhar o rumo estratégico do seu negócio.
            </h1>

            <p className="font-body text-sm sm:text-base text-neutral-700 leading-relaxed mb-6">
              O <strong>A3</strong> é o seu assistente de apoio à decisão. Vamos conduzir uma conversa simples, etapa por etapa, para analisar os pilares do seu consultório e montar um <strong>Plano Tático Sob Medida</strong>.
            </p>

            {/* Principles Banner */}
            <div className="bg-[var(--branco-off)] border border-neutral-300 p-4 sm:p-5 mb-8 space-y-3">
              <h3 className="font-subtitle text-xs font-bold uppercase tracking-wider text-[var(--preto)] flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[var(--exodo-red)]" />
                Como funciona a nossa conversa:
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm font-body text-neutral-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Uma pergunta por vez:</strong> sem formulários longos ou cansativos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Estimativas são bem-vindas:</strong> se não souber um número exato, pode responder com um valor aproximado.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Transparência total:</strong> sempre explicamos o porquê de cada pergunta antes de fazê-la.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Salvamento automático:</strong> cada escolha é gravada instantaneamente e com segurança.</span>
                </li>
              </ul>
            </div>

            {answeredCount > 0 && (
              <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Você tem <strong>{answeredCount} resposta(s) anterior(es)</strong> salvas nesta sessão.</span>
                </div>
                <button
                  onClick={() => {
                    setAnswers({});
                    onToast('Respostas zeradas.');
                  }}
                  className="text-[0.68rem] font-subtitle font-bold uppercase text-red-700 hover:underline cursor-pointer border-none bg-transparent"
                >
                  Reiniciar
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setStartedWizard(true)}
                className="py-4 text-sm font-bold uppercase tracking-wider flex-1 flex items-center justify-center gap-2"
              >
                <span>{answeredCount > 0 ? 'Continuar Jornada A3' : 'Iniciar Diagnóstico A3'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          /* Conversational Stage Shell */
          <div>
            {/* Stage Component Rendering */}
            {activeStage === 'products' && (
              <ProductsStep
                initialProducts={savedProductsList}
                initialOccupancy={savedOccupancyData}
                onSaveProduct={handleSaveProduct}
                onDeleteProduct={handleDeleteProduct}
                onSaveOccupancy={handleSaveOccupancy}
                activeStage={activeStage}
                onNavigateToStage={(stg) => setActiveStage(stg as StageName)}
                onOpenDeliverable={(type) => setActiveDeliverableModal(type)}
                onCompleteStep={() => {
                  onToast('Serviços e Entregas salvos! Avançando para Carga de Pacientes Atuais.');
                  setActiveStage('patient-workload');
                }}
                onToast={onToast}
              />
            )}

            {activeStage === 'patient-workload' && (
              <PatientWorkloadStep
                products={savedProductsList}
                onCompleteStep={() => {
                  onToast('Carga de Atendimento calculada! Avançando para Agenda Disponível.');
                  setActiveStage('schedule');
                }}
                onNavigateToProducts={() => setActiveStage('products')}
                onToast={onToast}
              />
            )}

            {activeStage === 'schedule' && (
              <ScheduleStep
                initialSchedule={savedScheduleData}
                patientWorkloadWeeklyHours={patientWorkloadWeeklyHours}
                onSaveSchedule={handleSaveSchedule}
                activeStage={activeStage}
                onNavigateToStage={(stg) => setActiveStage(stg as StageName)}
                onOpenDeliverable={(type) => setActiveDeliverableModal(type)}
                onCompleteStep={() => {
                  onToast('Agenda Semanal definida com sucesso! Avançando para Distribuição de Outras Atividades.');
                  setActiveStage('other-activities');
                }}
                onToast={onToast}
              />
            )}

            {activeStage === 'other-activities' && (
              <OtherActivitiesStep
                remainingWeeklyHours={remainingWeeklyHours}
                initialData={savedOtherActivitiesData}
                products={savedProductsList}
                scheduleData={savedScheduleData}
                patientWorkloadWeeklyHours={patientWorkloadWeeklyHours}
                portfolioData={savedPortfolioData}
                deliveryContractsData={savedDeliveryContractsData}
                onSaveActivities={handleSaveOtherActivities}
                onCompleteStep={() => {
                  onToast('Investigação do Negócio concluída! Avançando para a Consolidação do Modelo Atual.');
                  setActiveStage('current-model');
                }}
                onNavigateBack={() => setActiveStage('schedule')}
                onToast={onToast}
              />
            )}

            {activeStage === 'current-model' && (
              <CurrentModelStep
                products={savedProductsList}
                scheduleData={savedScheduleData}
                timeLibraryData={savedTimeLibraryData}
                deliveryContractsData={savedDeliveryContractsData}
                portfolioData={savedPortfolioData}
                initialModelData={savedCurrentModelData}
                onSaveModel={handleSaveCurrentModel}
                onNavigateToStage={(stage) => setActiveStage(stage)}
                onCompleteStep={() => {
                  onToast('Bloco A Concluído! Gerando a entrega formal "Retrato da Sua Clínica Hoje".');
                  setActiveDeliverableModal('retrato');
                  setActiveStage('expectations');
                }}
                onToast={onToast}
              />
            )}

            {activeStage === 'expectations' && (
              <ExpectationsStep
                initialData={savedExpectationsData}
                remainingWeeklyHours={remainingWeeklyHours}
                onSaveData={handleSaveExpectations}
                onCompleteStep={() => {
                  onToast('Etapa "Expectativas" concluída com sucesso! Avançando para Condições e Limites.');
                  setActiveStage('boundaries');
                }}
                onToast={onToast}
              />
            )}

            {activeStage === 'boundaries' && (
              <BoundariesStep
                initialData={savedBoundariesData}
                onSaveData={handleSaveBoundaries}
                onCompleteStep={() => {
                  onToast('Etapa "Condições e Limites" concluída com sucesso! Avançando para a Escolha da Configuração.');
                  setActiveStage('configuration-choice');
                }}
                onToast={onToast}
              />
            )}

            {activeStage === 'configuration-choice' && (
              <ConfigurationChoiceStep
                explorationResult={savedExplorationResult}
                savedChoice={savedChosenConfigData}
                currentModel={savedCurrentModelData}
                expectationsData={savedExpectationsData}
                boundariesData={savedBoundariesData}
                onSaveChoice={handleSaveChosenConfiguration}
                onCompleteStep={() => {
                  onToast('Bloco B Concluído! Gerando a entrega formal "O Caminho que Você Escolheu".');
                  setActiveDeliverableModal('caminho');
                  setActiveStage('tactical-plan');
                }}
                onToast={onToast}
              />
            )}

            {/* MÓDULO SEPARADO: PLANO TÁTICO (Consome o objeto Configuração gerado pelo Navegador de Promessas) */}
            {activeStage === 'tactical-plan' && (
              <TacticalPlanStep
                chosenChoice={savedChosenConfigData}
                currentModel={savedCurrentModelData}
                savedPlan={savedTacticalPlanData}
                onSavePlan={handleSaveTacticalPlan}
                onCompleteStep={() => {
                  onToast('Bloco C Concluído! Gerando a entrega formal "Seu Plano de Ação — Próximos 90 Dias".');
                  setActiveDeliverableModal('plano');
                }}
                onToast={onToast}
              />
            )}
          </div>
        )}
      </main>

      {/* MODAL DE ENTREGAS FORMAIS DOS BLOCOS (Retrato, Decisão, Plano de Ação) */}
      <FormalDeliverablesModal
        type={activeDeliverableModal}
        onClose={() => setActiveDeliverableModal(null)}
        currentModelData={savedCurrentModelData}
        chosenConfigData={savedChosenConfigData}
        tacticalPlanData={savedTacticalPlanData}
        userName={user?.name}
        clinicName={user?.clinicName}
      />
    </div>
  );
};
