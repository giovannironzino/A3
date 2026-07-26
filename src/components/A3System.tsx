import React, { useState, useEffect } from 'react';
import {
  Sparkles,
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
  Compass,
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
import { Button, Tag, CornerAccent } from './UIPrimitives';
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
    return saved ? JSON.parse(saved) : null;
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
  const [startedWizard, setStartedWizard] = useState(false);
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
      <div className="min-h-[calc(100vh-76px)] bg-[var(--cinza-claro)] py-12 px-4 sm:px-6 md:px-12 flex flex-col justify-center items-center">
        <div className="w-full max-w-md bg-[var(--branco)] border-2 border-[var(--preto)] p-6 sm:p-10 relative">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--border-default)]">
            <button
              onClick={onBackToLanding}
              className="text-xs font-subtitle font-bold text-[var(--cinza-escuro)] hover:text-[var(--exodo-red)] flex items-center gap-1 cursor-pointer bg-transparent border-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao site
            </button>
            <Tag tone="evidencia">Área Exclusiva A3</Tag>
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[var(--preto)] text-[var(--branco)] mb-3">
              <span className="font-display text-xl">A3</span>
            </div>
            <h1 className="font-display text-2xl text-[var(--preto)] tracking-tight">
              Acesso ao Sistema A3
            </h1>
            <p className="font-body text-xs text-[var(--cinza-escuro)] mt-1 max-w-xs mx-auto">
              Apoio à Decisão Estratégica e Direcionamento Tático para Nutricionistas.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-subtitle font-bold text-[var(--cinza-escuro)] uppercase tracking-wider mb-1.5">
                Seu Nome
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[var(--cinza-medio)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Dra. Juliana Costa"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 border border-[var(--border-strong)] text-sm focus:border-[var(--exodo-red)] focus:ring-1 focus:ring-[var(--exodo-red)] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-subtitle font-bold text-[var(--cinza-escuro)] uppercase tracking-wider mb-1.5">
                E-mail Cadastrado
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--cinza-medio)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 border border-[var(--border-strong)] text-sm focus:border-[var(--exodo-red)] focus:ring-1 focus:ring-[var(--exodo-red)] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-subtitle font-bold text-[var(--cinza-escuro)] uppercase tracking-wider mb-1.5">
                Nome da Clínica / Consultório (Opcional)
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-[var(--cinza-medio)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ex: Instituto Nutri & Saúde"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 border border-[var(--border-strong)] text-sm focus:border-[var(--exodo-red)] focus:ring-1 focus:ring-[var(--exodo-red)] outline-none"
                />
              </div>
            </div>

            <Button variant="primary" type="submit" size="lg" className="w-full justify-center mt-1">
              Entrar no A3 <ArrowRight className="w-4 h-4 ml-1 inline" />
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border-default)]"></div></div>
            <div className="relative flex justify-center text-[0.65rem] uppercase font-subtitle font-bold">
              <span className="bg-[var(--branco)] px-3 text-[var(--cinza-medio)]">ou entre com</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full py-3 px-3 bg-[var(--branco)] hover:bg-[var(--cinza-claro)] text-[var(--preto)] text-xs font-subtitle font-bold border border-[var(--border-strong)] cursor-pointer transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Entrar com Conta Google
          </button>

          <div className="mt-6 pt-5 border-t border-[var(--border-default)] text-center">
            <p className="text-[0.7rem] text-[var(--cinza-medio)] mb-2 font-subtitle font-bold uppercase tracking-wider">
              Primeiro acesso para testes?
            </p>
            <button
              onClick={handleDemoLogin}
              className="w-full py-3 px-3 bg-[var(--cinza-claro)] hover:bg-[var(--border-default)] text-[var(--preto)] text-xs font-subtitle font-bold uppercase tracking-wider border border-[var(--border-default)] cursor-pointer transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--exodo-red)]" />
              Acessar com Perfil de Teste (Dra. Amanda)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Count answered questions
  const answeredCount = Object.keys(answers).length;

  const blocoAStages = ['products', 'patient-workload', 'schedule', 'other-activities', 'current-model'];
  const blocoBStages = ['expectations', 'boundaries', 'configuration-choice'];
  const navPillClass = (active: boolean) =>
    `px-3 py-2 border flex items-center gap-1.5 text-[0.7rem] font-subtitle font-bold uppercase tracking-wide cursor-pointer transition-colors ${
      active
        ? 'bg-[var(--accent-tint)] text-[var(--preto)] border-[var(--exodo-red)]'
        : 'bg-[var(--branco)] hover:bg-[var(--cinza-claro)] text-[var(--cinza-escuro)] border-[var(--border-default)]'
    }`;
  const navDropdownItemClass = (active: boolean) =>
    `w-full text-left px-2.5 py-2 text-[0.72rem] font-subtitle font-bold cursor-pointer transition-colors flex items-center justify-between ${
      active ? 'bg-[var(--accent-tint)] text-[var(--exodo-red)]' : 'text-[var(--cinza-escuro)] hover:bg-[var(--cinza-claro)]'
    }`;

  return (
    <div className="min-h-screen bg-[var(--cinza-claro)] pb-16">
      {/* Standalone A3 App Module Header Navbar */}
      <header className="bg-[var(--branco)] border-b border-[var(--border-default)] px-4 sm:px-6 md:px-8 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">

          {/* Left: Brand Logo & Module Indicator */}
          <div className="flex items-center justify-between md:justify-start gap-3">
            <div className="flex items-center gap-2.5">
              <Logo variant="color" height={22} />
              <span className="font-subtitle font-bold text-[0.65rem] uppercase px-2 py-0.5 bg-[var(--preto)] text-[var(--branco)] tracking-wide">
                SISTEMA A3
              </span>
            </div>
            <div className="hidden sm:block border-l border-[var(--border-default)] pl-3">
              <span className="text-[0.6rem] font-subtitle font-bold text-[var(--cinza-medio)] uppercase tracking-wide block leading-none">
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
              <button className={navPillClass(blocoAStages.includes(activeStage))}>
                <Eye className="w-3.5 h-3.5" />
                <span>Bloco A: Clareza</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute left-0 top-full mt-1 w-56 bg-[var(--branco)] border border-[var(--border-strong)] p-1.5 hidden group-hover:block z-50">
                <div className="text-[0.62rem] font-bold uppercase text-[var(--cinza-medio)] px-2.5 py-1">Macro-Pilar A • Clareza</div>
                <button onClick={() => { setActiveStage('products'); setStartedWizard(true); }} className={navDropdownItemClass(activeStage === 'products')}>
                  <span>01. Catálogo de Produtos</span>
                </button>
                <button onClick={() => { setActiveStage('patient-workload'); setStartedWizard(true); }} className={navDropdownItemClass(activeStage === 'patient-workload')}>
                  <span>02. Carga de Pacientes</span>
                </button>
                <button onClick={() => { setActiveStage('schedule'); setStartedWizard(true); }} className={navDropdownItemClass(activeStage === 'schedule')}>
                  <span>03. Agenda Disponível</span>
                </button>
                <button onClick={() => { setActiveStage('other-activities'); setStartedWizard(true); }} className={navDropdownItemClass(activeStage === 'other-activities')}>
                  <span>04. Outras Atividades</span>
                </button>
                <button onClick={() => { setActiveStage('current-model'); setStartedWizard(true); }} className={navDropdownItemClass(activeStage === 'current-model')}>
                  <span>05. Modelo Atual</span>
                </button>
              </div>
            </div>

            {/* Dropdown / Menu for Bloco B */}
            <div className="relative group">
              <button className={navPillClass(blocoBStages.includes(activeStage))}>
                <Compass className="w-3.5 h-3.5" />
                <span>Bloco B: Escolha</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute left-0 top-full mt-1 w-56 bg-[var(--branco)] border border-[var(--border-strong)] p-1.5 hidden group-hover:block z-50">
                <div className="text-[0.62rem] font-bold uppercase text-[var(--cinza-medio)] px-2.5 py-1">Macro-Pilar B • Escolha</div>
                <button onClick={() => { setActiveStage('expectations'); setStartedWizard(true); }} className={navDropdownItemClass(activeStage === 'expectations')}>
                  <span>06. Expectativas</span>
                </button>
                <button onClick={() => { setActiveStage('boundaries'); setStartedWizard(true); }} className={navDropdownItemClass(activeStage === 'boundaries')}>
                  <span>07. Condições & Limites</span>
                </button>
                <button onClick={() => { setActiveStage('configuration-choice'); setStartedWizard(true); }} className={navDropdownItemClass(activeStage === 'configuration-choice')}>
                  <span>08. Configuração Escolhida</span>
                </button>
              </div>
            </div>

            {/* Quick Button for Bloco C */}
            <button
              onClick={() => { setActiveStage('tactical-plan'); setStartedWizard(true); }}
              className={activeStage === 'tactical-plan'
                ? 'px-3 py-2 border flex items-center gap-1.5 text-[0.7rem] font-subtitle font-bold uppercase tracking-wide cursor-pointer transition-colors bg-[var(--preto)] text-[var(--branco)] border-[var(--preto)]'
                : navPillClass(false)}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Bloco C: Plano Tático</span>
            </button>

            {/* Modal Trigger for Entregas Formais */}
            <div className="relative group">
              <button className="px-3 py-2 bg-[var(--branco)] hover:bg-[var(--cinza-claro)] text-[var(--preto)] border border-[var(--border-strong)] flex items-center gap-1.5 text-[0.7rem] font-subtitle font-bold uppercase tracking-wide cursor-pointer transition-colors">
                <FileText className="w-3.5 h-3.5 text-[var(--exodo-red)]" />
                <span>Entregas Formais</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute right-0 md:left-0 top-full mt-1 w-60 bg-[var(--branco)] border border-[var(--border-strong)] p-1.5 hidden group-hover:block z-50">
                <div className="text-[0.62rem] font-bold uppercase text-[var(--cinza-medio)] px-2.5 py-1">Documentos Estratégicos</div>
                <button onClick={() => setActiveDeliverableModal('retrato')} className="w-full text-left px-2.5 py-2 text-[0.72rem] font-subtitle font-bold text-[var(--cinza-escuro)] hover:bg-[var(--accent-tint)] hover:text-[var(--exodo-red)] cursor-pointer transition-colors flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5" />
                  <span>01. Retrato da Clínica (Bloco A)</span>
                </button>
                <button onClick={() => setActiveDeliverableModal('caminho')} className="w-full text-left px-2.5 py-2 text-[0.72rem] font-subtitle font-bold text-[var(--cinza-escuro)] hover:bg-[var(--accent-tint)] hover:text-[var(--exodo-red)] cursor-pointer transition-colors flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5" />
                  <span>02. O Caminho Escolhido (Bloco B)</span>
                </button>
                <button onClick={() => setActiveDeliverableModal('plano')} className="w-full text-left px-2.5 py-2 text-[0.72rem] font-subtitle font-bold text-[var(--cinza-escuro)] hover:bg-[var(--accent-tint)] hover:text-[var(--exodo-red)] cursor-pointer transition-colors flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" />
                  <span>03. Plano Tático 90 Dias (Bloco C)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Subscriber Profile & Exit Button */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-2 border border-[var(--border-default)] text-[var(--cinza-escuro)] px-3 py-1.5 text-[0.68rem] font-subtitle font-bold">
              <User className="w-3.5 h-3.5" />
              <span>{user?.name || 'Dra. Amanda'}</span>
            </div>

            <button
              onClick={onBackToLanding}
              className="px-3 py-2 bg-[var(--preto)] hover:bg-[var(--exodo-red)] text-[var(--branco)] text-[0.7rem] font-subtitle font-bold uppercase tracking-wide transition-colors flex items-center gap-1.5 cursor-pointer min-h-[34px]"
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
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--preto)] text-[var(--branco)] px-4 py-3 border-l-4 border-[var(--exodo-red)] flex items-center gap-3 animate-fadeIn">
          <div className="w-6 h-6 bg-[var(--exodo-red)] text-[var(--branco)] flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <div>
            <p className="font-subtitle font-bold text-xs">Informação salva com sucesso!</p>
            <p className="font-body text-[0.7rem] text-[var(--cinza-medio)]">
              {lastSavedField ? `Registo efetuado para: ${lastSavedField}` : 'Dados registrados na sua sessão segura.'}
            </p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className={startedWizard ? "w-full max-w-7xl mx-auto px-2 sm:px-6 pt-4" : "max-w-[800px] mx-auto px-4 sm:px-6 pt-8"}>
        {!startedWizard ? (
          /* Welcome Card & Entry Point into Wizard */
          <div className="bg-[var(--branco)] border-2 border-[var(--preto)] p-6 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 pointer-events-none">
              <CornerAccent variant="arredondado" size={120} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Tag tone="evidencia">Diagnóstico & Plano Tático A3</Tag>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl text-[var(--preto)] tracking-tight leading-tight mb-3">
                Olá, {user.name.split(' ')[0]}! Vamos desenhar o rumo estratégico do seu negócio.
              </h1>

              <p className="font-body text-sm sm:text-base text-[var(--cinza-escuro)] leading-relaxed mb-6 max-w-2xl">
                O <strong>A3</strong> é o seu assistente de apoio à decisão. Vamos conduzir uma conversa simples, etapa por etapa, para analisar os pilares do seu consultório e montar um <strong>Plano Tático Sob Medida</strong>.
              </p>

              {/* Principles Banner */}
              <div className="bg-[var(--cinza-claro)] p-4 sm:p-6 mb-8 space-y-3">
                <h3 className="font-subtitle text-xs font-bold uppercase tracking-wide text-[var(--preto)]">
                  Como funciona a nossa conversa:
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm font-body text-[var(--cinza-escuro)]">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[var(--exodo-red)] font-bold shrink-0">✓</span>
                    <span><strong className="text-[var(--preto)]">Uma pergunta por vez:</strong> sem formulários longos ou cansativos.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[var(--exodo-red)] font-bold shrink-0">✓</span>
                    <span><strong className="text-[var(--preto)]">Estimativas são bem-vindas:</strong> se não souber um número exato, pode responder com um valor aproximado.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[var(--exodo-red)] font-bold shrink-0">✓</span>
                    <span><strong className="text-[var(--preto)]">Transparência total:</strong> sempre explicamos o porquê de cada pergunta antes de fazê-la.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[var(--exodo-red)] font-bold shrink-0">✓</span>
                    <span><strong className="text-[var(--preto)]">Salvamento automático:</strong> cada escolha é gravada instantaneamente e com segurança.</span>
                  </li>
                </ul>
              </div>

              {answeredCount > 0 && (
                <div className="mb-6 p-4 border border-[var(--border-default)] text-xs text-[var(--cinza-escuro)] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4 text-[var(--exodo-red)] shrink-0" />
                    <span>Você tem <strong className="text-[var(--preto)]">{answeredCount} resposta(s) anterior(es)</strong> salvas nesta sessão.</span>
                  </div>
                  <button
                    onClick={() => {
                      setAnswers({});
                      onToast('Respostas zeradas.');
                    }}
                    className="text-[0.68rem] font-subtitle font-bold uppercase text-[var(--exodo-red)] hover:underline cursor-pointer border-none bg-transparent"
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
                  className="flex-1 justify-center"
                >
                  <span>{answeredCount > 0 ? 'Continuar Jornada A3' : 'Iniciar Diagnóstico A3'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
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
