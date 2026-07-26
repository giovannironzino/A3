export interface SimulationState {
  duration: number; // in days: 60, 90, 180, 360, 720
  rituals: number; // per month for nutri: 1, 2, 3, 4
  teamRituals: number; // per month for team: 0, 1, 2, 4 (unlocked at >= 180 days)
  supportFrequency: number; // for nutri: 1, 2, 3 times per week
  teamSupportFrequency: number; // for team: 0, 1, 2, 3 times per week
  sosCount: number; // per month: 0, 1, 2, 3, 4
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  clinicName: string;
  patientVolume: string;
  selectedDate: string;
  selectedTime: string;
}

export type ViewMode = 'landing' | 'print-report' | 'a3-app';

export interface A3UserData {
  name: string;
  email: string;
  clinicName: string;
}

export interface A3StepAnswer {
  questionId: string;
  value: any;
  isEstimate?: boolean;
  savedAt: string;
}

export interface A3ProductDeliverable {
  id: string;
  name: string; // e.g. "Consulta Anamnese", "Plano Alimentar", "Suporte WhatsApp"
  occurrencesIn3Months: number; // Quantidade de ocorrências ao longo dos 3 meses (ex: 13, 6, 3)
  frequency: 'semanal' | 'quinzenal' | 'mensal' | 'sob_demanda' | string;
  estimatedMonthlyFrequency?: number; // Se sob demanda: estimativa de quantas vezes por mês
  minutesPerOccurrence: number; // Minutos por ocorrência (ex: 60)
  isMinutesEstimated?: boolean; // Estimativa aceita
  minutesPerEvent?: number; // Backward compatibility
  eventsPerMonth?: number; // Backward compatibility
}

export interface A3Product {
  id: string;
  name: string;
  objective: string;
  targetAudience: string;
  format: 'Presencial' | 'Online (Teleconsulta)' | 'Híbrido' | string;
  price: number;
  paymentMethod: string;
  durationDays: number;
  durationLabel: string;
  deliveries: string[];
  detailedDeliverables?: A3ProductDeliverable[];
  totalTimeMinutes: number; // Calculated operational time per patient in minutes over the 3 months duration
  isTimeEstimated?: boolean;
  meetingFrequency?: string;
  activePatients: number;
  isActivePatientsEstimated: boolean;
}

export interface A3SubActivityDetail {
  id: string;
  name: string;
  timesPerWeek: number;
  minutesPerTime: number;
  isEstimate?: boolean;
}

export type ConfidenceLevel = 'sei-exato' | 'estimativa' | 'nao-sei';
export type AudienceConfidenceLevel = 'sei-descrever' | 'estimativa' | 'nao-sei';

// ------------------------------------
// BRANCH A: CRIAÇÃO DE VALOR
// ------------------------------------
export interface A3ValueCreationBranch {
  differentiationReason: string;
  differentiationSource: 'já ouvi de pacientes' | 'é minha percepção' | 'não sei';
}

// ------------------------------------
// BRANCH B: MARKETING, BRANDING E VENDAS
// ------------------------------------
export interface A3MarketingChannelDetail {
  id: string;
  channelName: string;
  newPatients90d: number;
  newPatientsConfidence: ConfidenceLevel;
  conversionRateOutOf10: number;
  conversionConfidence: ConfidenceLevel;
  targetAudienceDescription?: string;
  audienceConfidence: AudienceConfidenceLevel;
}

export interface A3MarketingBranch {
  selectedChannels: string[];
  channelDetails: A3MarketingChannelDetail[];
  timesPerWeek: number;
  minutesPerTime: number;
  isTimeEstimated?: boolean;
  isDetailedTime?: boolean;
  subActivitiesTime?: A3SubActivityDetail[];
  allocatedWeeklyHours: number;
}

// ------------------------------------
// BRANCH D: FINANCEIRO
// ------------------------------------
export interface A3CostItem {
  id: string;
  name: string;
  hasCost: boolean;
  monthlyAmount: number;
  isEstimate?: boolean;
}

export interface A3PaymentDelayCheck {
  paymentMethod: string;
  hasDelayOrFailureIssue: boolean;
  notes?: string;
}

export interface A3FinancialBranch {
  reportedGrossMonthlyRevenue: number;
  revenueConfidence: ConfidenceLevel;
  costs: A3CostItem[];
  paymentDelays: A3PaymentDelayCheck[];
  totalMonthlyCosts: number;
  breakEvenDifference: number;
  isAboveBreakEven: boolean;
  monthlyRevenue?: number;
  paymentDelayLevel?: string;
  breakEvenCalculated?: {
    totalMonthlyCosts: number;
    difference: number;
    isAboveBreakEven: boolean;
  };
}

// ------------------------------------
// BRANCH E: EQUIPE (TEAM & CLINICAL DELEGATES)
// ------------------------------------
export interface A3HumanResource {
  id: string;
  name: string;
  role?: 'Recepção / Agendamento' | 'Nutricionista Auxiliar' | 'Marketing' | 'Financeiro' | 'Outro' | string;
  functions?: Array<'atende_pacientes' | 'recepcao' | 'marketing' | 'vendas' | 'financeiro' | 'outro' | string>;
  isClinicalDelegate: boolean;
  clinicalSchedule?: {
    type: 'fixa' | 'demanda';
    days?: number;
    hoursGrid?: number;
    estimatedWeeklyHours?: number;
  };
  nonClinicalActivities?: Array<{
    functionName: string;
    scheduleType: 'fixa' | 'demanda';
    daysPerWeek?: number;
    hoursPerDay?: number;
    timesPerWeek?: number;
    minutesEach?: number;
  }>;
  monthlyCost: number;
  sourceAxis?: 'sales' | 'team';
  daysPerWeek?: number;
  weeklyClinicalHours?: number;
  monthlySalaryOrCost?: number;
  timesPerWeek?: number;
  minutesPerTime?: number;
  clinicalDays?: number;
  supportTimesPerWeek?: number;
  supportMinutesEach?: number;
}

export const deduplicateTeamMembers = (members: A3HumanResource[]): A3HumanResource[] => {
  if (!members || !Array.isArray(members)) return [];

  const valid = members.filter((m) => m && m.name && m.name.trim().length > 0);
  const allTrimmedNames = valid.map((m) => m.name.trim());

  const result: A3HumanResource[] = [];
  const seenLowerNames = new Set<string>();

  for (const member of valid) {
    const trimmedName = member.name.trim();
    const lowerName = trimmedName.toLowerCase();

    // Skip character-by-character typing artifacts (e.g. "Gio" when "Giovanni" exists)
    const isPrefixArtifact = allTrimmedNames.some((other) => {
      const lowerOther = other.toLowerCase();
      return (
        lowerOther.startsWith(lowerName) &&
        lowerOther.length > lowerName.length &&
        !lowerOther.startsWith(lowerName + ' ')
      );
    });

    if (isPrefixArtifact) {
      continue;
    }

    if (!seenLowerNames.has(lowerName)) {
      seenLowerNames.add(lowerName);
      result.push({
        ...member,
        name: trimmedName,
      });
    }
  }

  return result;
};

export interface A3TeamBranch {
  hasTeam: boolean;
  members: A3HumanResource[];
  totalDelegatedClinicalWeeklyHours: number;
  totalTeamMonthlyCost: number;
}

// ------------------------------------
// BRANCH F: PROCESSOS
// ------------------------------------
export type ProcessChecklistStatus = 'Sim' | 'Mais ou menos' | 'Não';

export interface A3ProcessesBranch {
  salesScriptStatus?: ProcessChecklistStatus;
  standardContractStatus?: ProcessChecklistStatus;
  onboardingProcessStatus?: ProcessChecklistStatus;
  offboardingProcessStatus?: ProcessChecklistStatus;
  hasSalesScript?: string;
  hasStandardContract?: string;
  hasWelcomeProcess?: string;
  hasOffboardingProcess?: string;
}

// ------------------------------------
// BRANCH G: FERRAMENTAS
// ------------------------------------
export interface A3ToolsBranch {
  selectedTools?: string[];
  customToolName?: string;
  selected?: string[];
  other?: string;
}

// ------------------------------------
// BRANCH H: JURÍDICO & COMPLIANCE
// ------------------------------------
export interface A3LegalBranch {
  consentTermStatus: 'Sim' | 'Não' | 'Não sei se preciso';
  cancellationPolicyStatus: 'Sim' | 'Não';
}

export interface A3AcquisitionChannel {
  id?: string;
  name: string;
  contactDirection: string;
  isContentChannel?: boolean;
  volume90d: number;
  volumeConfidence: string;
  contentOriginCount?: number;
  closedCount: number;
  closedConfidence: string;
  audienceDescription?: string;
  audienceConfidence?: string;
}

export interface A3InvestigationNamespacedData {
  valueProposition?: {
    promiseStatement: string;
    promiseType?: 'Resultado' | 'Experiência' | 'Um pouco dos dois';
    differentiator: string;
    differentiatorSource: string;
    uniqueApproach: string;
    promiseFulfillment: string;
  };
  acquisition?: {
    channels: A3AcquisitionChannel[];
    marketingTime: {
      timesPerWeek: number;
      minutesEach: number;
      totalWeeklyHours: number;
      detailedBreakdown?: Array<{ name: string; timesPerWeek: number; minutesPerTime: number }>;
    };
    branding: {
      hasVisualIdentity: string;
      feelsProfessional: string;
      communicationStyle: string;
      communicationStyleNote?: string;
      markingFeedback?: string;
    };
  };
  sales?: {
    usesScript: string;
    closingFormat: string;
    usesSystem: string;
    systemName?: string;
    whoCloses: string;
    whoClosesOtherRef?: string;
    followsUp: string;
    followUpDays?: number | string;
    followUpAttempts?: number | string;
    timeToClose?: string;
    nonClosingReasons: string[];
  };
  financial?: {
    monthlyRevenue: number;
    revenueConfidence?: string;
    costs: {
      rent: number;
      tools: Array<{ name: string; monthlyCost: number }>;
      accountant: number;
      teamCostTotal: number;
    };
    paymentDelayLevel: string;
    breakEvenCalculated: {
      totalMonthlyCosts: number;
      difference: number;
      isAboveBreakEven: boolean;
    };
  };
  team?: {
    hasTeam: boolean;
    members: A3HumanResource[];
  };
  processes?: {
    hasSalesScript?: string;
    hasStandardContract: string;
    hasWelcomeProcess: string;
    hasOffboardingProcess: string;
  };
  tools?: {
    selected: string[];
    other?: string;
  };
  compliance?: {
    hasConsentForm: string;
    hasCancellationPolicy: string;
  };
}

// ------------------------------------
// INVESTIGATION SAVED STATE
// ------------------------------------
export interface A3SavedNodeState {
  lastNodeId: string;
  nextNodeId: string;
  currentChannelIndex: number;
  currentTeamMemberIndex?: number;
  currentOtherRevenueIndex?: number;
  currentCostToolIndex?: number;
  selectedChannels?: string[];
  teamDraftFromSales?: { name: string } | null;
  investigationMode?: 'chat' | 'form';
  activeFormSection?: string;
  timestamp?: string;
}

// ------------------------------------
// INVESTIGATION HUB DATA
// ------------------------------------
export interface A3InvestigationData {
  // Namespaced Structure
  valueProposition?: {
    promiseStatement: string;
    promiseType?: 'Resultado' | 'Experiência' | 'Um pouco dos dois';
    differentiator: string;
    differentiatorSource: string;
    uniqueApproach: string;
    promiseFulfillment: string;
  };
  acquisition?: {
    channels: A3AcquisitionChannel[];
    marketingTime: {
      timesPerWeek: number;
      minutesEach: number;
      totalWeeklyHours: number;
      detailedBreakdown?: Array<{ name: string; timesPerWeek: number; minutesPerTime: number }>;
    };
    branding: {
      hasVisualIdentity: string;
      feelsProfessional: string;
      communicationStyle: string;
      communicationStyleNote?: string;
      communicationStyleFreeText?: string;
      markingFeedback?: string;
    };
    contentSchedulingTool?: string;
  };
  sales?: {
    usesScript: string;
    closingFormat: string;
    closingEffectiveness?: {
      knowsBasedOnData?: string;
      mostEffective?: 'Chamada' | 'Mensagem' | string;
    };
    usesSystem: string;
    systemName?: string;
    whoCloses: string;
    whoClosesTeamRef?: string;
    followsUp: string;
    followUpDays?: number | string;
    followUpAttempts?: number | string;
    timeToClose?: string;
    nonClosingReasons: string[];
  };
  delivery?: {
    renewalsLast90Days?: {
      confidenceLevel: string;
      count?: number;
    };
    hasElectronicRecords?: string;
    hasStandardContract?: string;
    hasWelcomeProcess?: string;
    hasOffboardingProcess?: string;
    hasConsentForm?: string;
  };
  financial?: {
    revenueConfirmed?: boolean | string;
    monthlyRevenueLast3?: Array<{
      monthLabel: string;
      confidenceLevel: string;
      value: number;
    }>;
    otherRevenueLines?: Array<{ description: string; monthlyValue: number }>;
    legalStructure?: 'Pessoa física' | 'Tenho CNPJ' | string;
    separatesPersonalBusiness?: string;
    financesSeparation?: string;
    proLaboreType?: string;
    hasBudgetPlanning?: string;
    budgetPlanning?: string;
    revenue3mConfidence?: string;
    revenueM1?: number;
    revenueM2?: number;
    revenueM3?: number;
    otherRevenues?: any[];
    costs?:
      | {
          rent?: number;
          tools?: Array<{ name: string; monthlyCost: number }>;
          aiTools?: number;
          crnFee?: number;
          paidAds?: number;
          accountant?: number;
          teamCostTotal?: number;
          otherCostsFreeText?: Array<{ description: string; monthlyCost: number }>;
        }
      | A3CostItem[];
    paymentDelayLevel?: string;
    hasCancellationPolicy?: string;
    financialTool?: string;
    breakEvenCalculated?: {
      totalMonthlyCosts: number;
      monthsAboveCount?: number;
      monthsCounted?: number;
      differenceLastMonth?: number;
      difference?: number;
      isAboveBreakEven: boolean;
    };
    reportedGrossMonthlyRevenue?: number;
    monthlyRevenue?: number;
    revenueConfidence?: string;
    totalMonthlyCosts?: number;
    breakEvenDifference?: number;
    isAboveBreakEven?: boolean;
  };
  team?: {
    hasTeam: boolean;
    members: A3HumanResource[];
    totalDelegatedClinicalWeeklyHours?: number;
    totalTeamMonthlyCost?: number;
  };
  compliance?: {
    hasConsentForm: string;
    hasCancellationPolicy: string;
  };

  savedState?: A3SavedNodeState;
  savedNodeState?: A3SavedNodeState;

  // Legacy Branches for backward compatibility
  valueCreation?: A3ValueCreationBranch;
  marketing?: A3MarketingBranch;
  processes?: A3ProcessesBranch;
  tools?: A3ToolsBranch;
  legal?: A3LegalBranch;
  isCompleted?: boolean;
  updatedAt?: string;
}

export interface A3OtherActivityAllocation {
  id: string;
  category: 'Marketing & Captação' | 'Gestão & Financeiro' | 'Estudos & Cursos' | 'Suporte Extra' | 'Outros';
  allocatedWeeklyHours: number;
  timesPerWeek?: number;
  minutesPerTime?: number;
  isEstimate?: boolean;
  isDetailed?: boolean;
  subActivities?: A3SubActivityDetail[];
  notes?: string;
}

export interface A3OtherActivitiesData {
  allocations: A3OtherActivityAllocation[];
  totalAllocatedWeeklyHours: number;
  remainingWeeklyHours: number;
  investigation?: A3InvestigationData;
  isCompleted: boolean;
  updatedAt?: string;
}

export interface A3ScheduleOccupancy {
  totalScheduledMonth: number;
  isTotalEstimated: boolean;
  newPatientsCount: number;
  followUpPatientsCount: number;
}

export interface A3ProductsStepData {
  products: A3Product[];
  occupancy: A3ScheduleOccupancy | null;
  isCompleted: boolean;
}

export type A3ShiftName = 'Manhã' | 'Tarde' | 'Noite';

export interface A3ShiftConfig {
  shift: A3ShiftName;
  enabled: boolean;
  startTime: string; // "08:00"
  endTime: string;   // "12:00"
}

export interface A3RecurringBlock {
  id: string;
  day: string;
  title: string; // e.g., 'Almoço/Intervalo', 'Reunião de Equipe', 'Estudos & Cursos', 'Administrativo'
  startTime: string;
  endTime: string;
}

export interface A3DaySchedule {
  day: 'Segunda-feira' | 'Terça-feira' | 'Quarta-feira' | 'Quinta-feira' | 'Sexta-feira' | 'Sábado' | 'Domingo';
  dayShort: 'Seg' | 'Ter' | 'Qua' | 'Qui' | 'Sex' | 'Sáb' | 'Dom';
  isWorkDay: boolean;
  shifts: A3ShiftConfig[];
  blocks: A3RecurringBlock[];
  totalGrossMinutes: number;
  totalNetMinutes: number;
}

export interface A3ScheduleData {
  days: A3DaySchedule[];
  totalGrossWeeklyHours: number;
  totalNetWeeklyHours: number;
  isCompleted: boolean;
}

export type A3ActivityCategory = 
  | 'Atendimento Clínico'
  | 'Elaboração & Planejamento'
  | 'Suporte & Comunicação'
  | 'Análise & Diagnóstico'
  | 'Gestão & Administração'
  | 'Outros';

export interface A3Activity {
  id: string;
  name: string;
  description: string;
  category: A3ActivityCategory;
  defaultMinutes: number;
  isApproximateTime: boolean;
  isReusable: boolean;
  createdAt?: string;
}

export interface A3TimeLibraryData {
  activities: A3Activity[];
  totalActivitiesCount: number;
  isCompleted: boolean;
}

export interface A3ContractActivityItem {
  id: string;
  activityId?: string;
  name: string;
  category: string;
  quantity: number;
  minutesPerUnit: number;
  totalMinutes: number;
  isFromLibrary: boolean;
}

export interface A3ProductDeliveryContract {
  productId: string;
  productName: string;
  productDurationDays: number;
  activePatientsCount: number;
  
  // Specific structured deliveries
  consultationsCount: number;
  consultationActivityId?: string;
  consultationMinutes: number;

  checkInsCount: number;
  checkInActivityId?: string;
  checkInMinutes: number;

  hasContinuousSupport: boolean;
  supportFrequency: 'Diário' | 'Dias Úteis' | '1x por Semana' | '2x por Semana' | 'Sob Demanda' | string;
  supportActivityId?: string;
  supportMinutesPerEvent: number;
  supportEstimatedTotalMinutes: number;

  // Additional activities from time library
  additionalActivities: A3ContractActivityItem[];

  // Totals
  totalContractMinutesPerPatient: number; // For full product duration
  totalMonthlyMinutesPerPatient: number;  // Calculated per month (duration / 30)
  totalClinicMonthlyHours: number;        // totalMonthlyMinutesPerPatient * activePatientsCount / 60

  isFixedConstraintConfirmed: boolean;
}

export interface A3DeliveryContractsData {
  contracts: A3ProductDeliveryContract[];
  totalClinicMonthlyDeliveryHours: number;
  isCompleted: boolean;
}

export interface A3PortfolioItem {
  productId: string;
  productName: string;
  format?: string;
  price?: number;
  durationLabel?: string;
  activePatients: number;
  isEstimate?: boolean;
  isConfirmed: boolean;
}

export interface A3PortfolioData {
  items: A3PortfolioItem[];
  totalActivePatients: number;
  isCompleted: boolean;
  updatedAt?: string;
}

export interface A3CurrentModel {
  products: A3Product[];
  schedule: A3ScheduleData | null;
  timeLibrary: A3TimeLibraryData | null;
  deliveryContracts: A3DeliveryContractsData | null;
  portfolio: A3PortfolioData | null;
  otherActivities?: A3OtherActivitiesData | null;
  investigationData?: A3InvestigationData | null;
  teamMembers?: A3HumanResource[];
  hoursPerNewPatientAcquired?: number;
  // Summary Stats
  totalProductsCount: number;
  totalWeeklyClinicalHours: number;
  totalMonthlyDeliveryHours: number;
  totalActivePatients: number;
  patientWorkloadWeeklyHours?: number; // X hours consumed by current active patients
  totalAvailableWeeklyHours?: number;  // Y hours available in schedule
  remainingWeeklyHours?: number;        // Z = Y - X
  validatedBlocksCount: number;
  isApproved: boolean;
  approvedAt?: string;
}

export type ExpectationPriority = 'Alta' | 'Média' | 'Baixa';
export type ExpectationCategory = 
  | 'Rotina & Tempo' 
  | 'Faturamento & Valor' 
  | 'Qualidade de Vida' 
  | 'Perfil de Pacientes' 
  | 'Modelo de Atendimento' 
  | 'Outros';

export interface A3Expectation {
  id: string;
  desiredResult: string;
  meaningDetails?: string;
  category: ExpectationCategory;
  priority: ExpectationPriority;
  order: number;
  createdAt?: string;
}

export interface A3ExpectationsData {
  expectations: A3Expectation[];
  isCompleted: boolean;
  updatedAt?: string;
}

export type BoundaryType = 'Fixa' | 'Desejada';

export interface A3BoundaryItem {
  id: string;
  description: string;
  details?: string;
  type: BoundaryType; // 'Fixa' = Compromisso Assumido / Obrigatória; 'Desejada' = Preferência / Ajustável
  category?: string;
  createdAt?: string;
}

export interface A3BoundariesData {
  items: A3BoundaryItem[];
  isCompleted: boolean;
  updatedAt?: string;
}

export type AllocationMode = 
  | 'Concentrada (Blocos Dedicados)' 
  | 'Equilibrada (Diária Intercalada)' 
  | 'Flexível (Sob Demanda)';

export interface A3Configuration {
  id: string;
  name: string;
  description: string;
  workDaysCount: number;
  workDaysList: string[];
  weeklyGrossHours: number;
  weeklyNetHours: number;
  weeklyClinicalHours: number;
  weeklyManagementHours: number;
  weeklyAcquisitionHours: number;
  maxActivePatientCapacity: number;
  clinicalRatioPercentage: number; // e.g. 65%
  growthRatioPercentage: number;   // e.g. 35%
  patientDeliveryContractGuaranteed: true; // Always true for valid configs
  fulfilledDesiredBoundariesCount: number;
  unfulfilledDesiredBoundaries: string[];
  allocationMode: AllocationMode;
  structuralDeduplicationCode: string; // Chave de Deduplicação Estrutural (código interno de identificação e desduplicação do Motor de Exploração)
}

export interface A3StructuralGroup {
  groupId: string;
  groupName: string;
  description: string;
  keyAttributes: {
    workDaysCount: number;
    careDistributionTier: string; // e.g. "Predominância Clínica (>70%)", "Equilibrada (50-70%)", "Foco em Gestão & Captação (<50%)"
    allocationMode: AllocationMode;
  };
  totalConfigurationsInGroup: number;
  allConfigurationsInGroup: A3Configuration[];
  representativeConfiguration: A3Configuration;
}

export interface A3ConfigurationReading {
  configId: string;
  configName: string;
  signaturePhrase: string; // Assinatura Estrutural da Configuração (frase simples e objetiva em português para o nutricionista)
  // Números de apoio
  scheduleOccupancyPercentage: number; // Ocupação da agenda com pacientes atuais (%)
  maxActivePatientCapacity: number; // Quantos pacientes cabem no total
  currentActivePatients: number; // Pacientes ativos atuais atendidos
  weeklyAcquisitionHours: number; // Quanto tempo sobra para captação de novos pacientes
  weeklyManagementHours: number; // Quanto tempo dedicado à gestão da clínica
  weeklyClinicalHours: number; // Quanto tempo dedicado a consultas
  totalWeeklyNetHours: number; // Carga horária semanal líquida
  allocationModeText: string; // Modo de alocação de tempo
  operationalImpactText: string; // Explicação operacional simples de como funcionaria na prática
  structuralDifferencesText: string; // Diferenças estruturais relevantes
  patientContractStatusText: string; // Confirmação da garantia de 100% do Contrato de Entrega
}

export interface A3ExplorationResult {
  totalCandidateConfigurationsGenerated: number;
  validConfigurationsCount: number;
  discardedConfigurationsCount: number;
  discardedReasonsSummary: Record<string, number>;
  validConfigurations: A3Configuration[];
  structuralGroups: A3StructuralGroup[];
  representativeConfigurations: A3Configuration[];
  readings: A3ConfigurationReading[]; // Leituras produzidas pelo Motor de Leitura
  executedAt: string;
}

export interface A3ChosenConfigurationData {
  chosenConfig: A3Configuration;
  reading: A3ConfigurationReading;
  confirmedAt: string;
  isConfirmed: boolean;
  userNotes?: string;
}

export interface A3TacticalActivity {
  id: string;
  title: string;
  description: string;
  objective: string;
  expectedResult: string;
  dependencies: string[];
  weekNumber: number; // 1..12
  timeAllocationFormat: string; // Inherited from allocationMode (e.g. "Dias Dedicados: Terça e Quinta" or "Blocos Diários: 08:00 - 11:30")
  gapOrigin: string; // Rastreabilidade: diferença entre Modelo Atual e Configuração Escolhida
}

export interface A3TacticalStage {
  stageNumber: number; // 1, 2, 3 (Representando os blocos de 30, 60 e 90 dias)
  monthName: string; // "Mês 1 (Semanas 1-4)", "Mês 2 (Semanas 5-8)", "Mês 3 (Semanas 9-12)"
  title: string;
  objective: string;
  expectedOutcome: string;
  activities: A3TacticalActivity[];
}

export interface A3TacticalPlanData {
  id: string;
  configId: string;
  configName: string;
  allocationMode: AllocationMode;
  allocationModeLabel: string;
  signaturePhrase: string;
  currentSituationSummary: string;
  targetSituationSummary: string;
  gapsIdentified: string[];
  stages: A3TacticalStage[];
  isApproved: boolean;
  approvedAt?: string;
  userFeedback?: string;
}

export interface A3State {
  user: A3UserData | null;
  currentStepIndex: number;
  answers: Record<string, A3StepAnswer>;
  isCompleted: boolean;
}
