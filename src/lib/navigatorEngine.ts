import { 
  A3CurrentModel, 
  A3ExpectationsData, 
  A3BoundariesData, 
  A3Configuration, 
  A3StructuralGroup, 
  A3ExplorationResult,
  A3ConfigurationReading,
  AllocationMode
} from '../types';

/**
 * MOTOR DE EXPLORAÇÃO, MOTOR DE REPRESENTATIVIDADE & MOTOR DE LEITURA
 * 
 * Lógica interna em segundo plano (headless engine).
 * 
 * Motor de Exploração:
 * 1. Gera todas as configurações estruturalmente possíveis a partir do Modelo Atual.
 * 2. Valida 100% das restrições fixas (NUNCA gera nenhuma configuração que viole o Contrato de Entrega ao Paciente ou compromissos assumidos).
 * 3. Identifica e elimina duplicidades estruturais usando a Chave de Deduplicação Estrutural (código interno).
 * 
 * Motor de Representatividade:
 * 1. Agrupa as configurações válidas por semelhança estrutural (dias trabalhados, distribuição do tempo entre atender e captar, modo de alocação).
 * 2. Seleciona um representante de cada grupo sem ordenar, pontuar ou escolher "a melhor".
 * 3. A quantidade de representantes varia dinamicamente de acordo com a quantidade de grupos distintos existentes.
 * 
 * Motor de Leitura:
 * 1. Traduz cada Configuração Representativa em sua Assinatura Estrutural (frase simples e objetiva em português).
 * 2. Calcula os números de apoio: ocupação da agenda (%), quantos pacientes cabem, tempo restante para captação e gestão.
 * 3. NUNCA classifica ou declara que uma configuração é "melhor" ou "pior" do que outra — mantém postura 100% neutra, descritiva e orientada a dados.
 */

const WORK_DAYS_OPTIONS = [
  { name: '3 Dias Concentrados', count: 3, days: ['Segunda-feira', 'Quarta-feira', 'Sexta-feira'] },
  { name: '4 Dias Intensivos', count: 4, days: ['Segunda-feira', 'Terça-feira', 'Quinta-feira', 'Sexta-feira'] },
  { name: '5 Dias Padrão', count: 5, days: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'] },
  { name: '6 Dias com Sábado', count: 6, days: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'] },
];

const RATIO_TIERS = [
  { 
    code: 'predominancia_clinica', 
    label: 'Predominância Clínica (>70%)', 
    clinicalRatio: 0.75, 
    growthRatio: 0.25 
  },
  { 
    code: 'equilibrada', 
    label: 'Equilibrada (50-70%)', 
    clinicalRatio: 0.60, 
    growthRatio: 0.40 
  },
  { 
    code: 'foco_estrategico', 
    label: 'Foco em Gestão & Captação (<50%)', 
    clinicalRatio: 0.45, 
    growthRatio: 0.55 
  },
];

const ALLOCATION_MODES: { mode: AllocationMode; code: string; desc: string }[] = [
  {
    mode: 'Concentrada (Blocos Dedicados)',
    code: 'blocos',
    desc: 'Dias dedicados exclusivamente ao atendimento clínico alternados com dias focados em gestão, captação e estudos.'
  },
  {
    mode: 'Equilibrada (Diária Intercalada)',
    code: 'intercalada',
    desc: 'Todos os dias de trabalho dividem turnos entre atendimento a pacientes e atividades administrativas/estratégicas.'
  },
  {
    mode: 'Flexível (Sob Demanda)',
    code: 'flexivel',
    desc: 'Grade flexível com horários nobres reservados para consultas e janelas flutuantes de suporte e captação.'
  },
];

/**
 * Motor de Leitura: Traduz a configuração técnica em linguagem de negócios simples e objetiva.
 */
function buildConfigurationReading(
  config: A3Configuration,
  totalActivePatients: number
): A3ConfigurationReading {
  // 1. Ocupação da agenda com pacientes atuais (%)
  const occupancyPercentage = config.maxActivePatientCapacity > 0
    ? Math.min(100, Math.round((totalActivePatients / config.maxActivePatientCapacity) * 100))
    : 100;

  // 2. Frase simples e objetiva (a "assinatura" da configuração)
  // Exemplos: "Trabalhando 4 dias, com mais tempo para buscar pacientes novos"
  let signaturePhrase = '';
  if (config.weeklyAcquisitionHours >= 8) {
    signaturePhrase = `Trabalhando ${config.workDaysCount} dias por semana, com ${config.weeklyAcquisitionHours}h semanais livres para buscar novos pacientes e expandir a clínica.`;
  } else if (config.clinicalRatioPercentage >= 70) {
    signaturePhrase = `Trabalhando ${config.workDaysCount} dias por semana, maximizando a capacidade de atendimento clínico para até ${config.maxActivePatientCapacity} pacientes ativos.`;
  } else {
    signaturePhrase = `Trabalhando ${config.workDaysCount} dias por semana em estrutura equilibrada entre consultations (${config.weeklyClinicalHours}h) e gestão/captação (${config.weeklyManagementHours + config.weeklyAcquisitionHours}h).`;
  }

  // 3. Explicação operacional neutra de como funcionaria na prática
  const operationalImpactText = `Na prática, esta configuração organiza a rotina em ${config.workDaysCount} dias úteis (${config.workDaysList.slice(0, 2).join(', ')}...), com ${config.weeklyClinicalHours} horas dedicadas às consultas e ${config.weeklyAcquisitionHours + config.weeklyManagementHours} horas reservadas para gestão e captação. A alocação ocorre no modo ${config.allocationMode}.`;

  // 4. Diferenças estruturais relevantes
  const structuralDifferencesText = `Suporta até ${config.maxActivePatientCapacity} pacientes ativos com uma taxa de ocupação inicial de ${occupancyPercentage}% para cobrir os ${totalActivePatients} pacientes atuais. Restam ${config.weeklyAcquisitionHours}h por semana especificamente destinadas à prospecção de novos clientes.`;

  const patientContractStatusText = '100% de garantia do Contrato de Entrega ao Paciente mantido integralmente.';

  return {
    configId: config.id,
    configName: config.name,
    signaturePhrase,
    scheduleOccupancyPercentage: occupancyPercentage,
    maxActivePatientCapacity: config.maxActivePatientCapacity,
    currentActivePatients: totalActivePatients,
    weeklyAcquisitionHours: config.weeklyAcquisitionHours,
    weeklyManagementHours: config.weeklyManagementHours,
    weeklyClinicalHours: config.weeklyClinicalHours,
    totalWeeklyNetHours: config.weeklyNetHours,
    allocationModeText: config.allocationMode,
    operationalImpactText,
    structuralDifferencesText,
    patientContractStatusText,
  };
}

/**
 * Auxiliary helper to calculate monthly delivery hours for a single product from detailed deliverables
 */
export function calculateProductMonthlyDeliveryHours(prod: any): number {
  const pts = typeof prod.activePatients === 'number' ? prod.activePatients : 5;
  const durationDays = prod.durationDays || 90;
  const durationMonths = Math.max(1, durationDays / 30);

  let total3MonthMins = 0;
  if (prod.detailedDeliverables && prod.detailedDeliverables.length > 0) {
    total3MonthMins = prod.detailedDeliverables.reduce((acc: number, d: any) => {
      const occ = d.occurrencesIn3Months || 3;
      const mins = d.minutesPerOccurrence || 60;
      return acc + (occ * mins);
    }, 0);
  } else {
    total3MonthMins = (prod.deliveries || []).length * 180;
  }

  const monthlyMinsPerPatient = Math.round(total3MonthMins / durationMonths);
  return Number(((monthlyMinsPerPatient * pts) / 60).toFixed(1));
}

/**
 * Helper to calculate total delegated clinical weekly hours from human resources
 */
export function calculateDelegatedClinicalWeeklyHours(currentModel: A3CurrentModel | null): number {
  const members = 
    currentModel?.teamMembers || 
    currentModel?.investigationData?.team?.members || 
    currentModel?.otherActivities?.investigation?.team?.members || 
    [];
  return (members as any[])
    .filter(m => m.isClinicalDelegate)
    .reduce((sum, m) => {
      const hrs = m.weeklyClinicalHours || 
        m.clinicalSchedule?.estimatedWeeklyHours || 
        m.clinicalSchedule?.hoursGrid || 
        ((m.clinicalSchedule?.days || 0) * 4) || 
        0;
      return sum + hrs;
    }, 0);
}

/**
 * Helper to calculate acquisition efficiency parameter: hours per new patient acquired
 */
export function calculateHoursPerNewPatientAcquired(currentModel: A3CurrentModel | null): number {
  const inv = currentModel?.investigationData || currentModel?.otherActivities?.investigation;
  if (!inv) return 1.5;

  let totalNewPatients90d = 0;
  if (inv.acquisition?.channels) {
    totalNewPatients90d = inv.acquisition.channels.reduce(
      (sum, ch) => sum + (ch.volume90d || 0),
      0
    );
  } else if (inv.marketing?.channelDetails) {
    totalNewPatients90d = inv.marketing.channelDetails.reduce(
      (sum, ch) => sum + (ch.newPatients90d || 0),
      0
    );
  }

  const monthlyNewPatients = totalNewPatients90d / 3;
  const weeklyMktHours = inv.acquisition?.marketingTime?.totalWeeklyHours || inv.marketing?.allocatedWeeklyHours || 2;
  const monthlyMktHours = weeklyMktHours * 4.33;

  if (monthlyNewPatients <= 0) return Math.round(monthlyMktHours * 10) / 10;
  return Math.round((monthlyMktHours / monthlyNewPatients) * 10) / 10;
}

/**
 * Principal function to run the Navigator Engine
 */
export function runNavigatorEngine(
  currentModel: A3CurrentModel | null,
  expectationsData: A3ExpectationsData | null,
  boundariesData: A3BoundariesData | null
): A3ExplorationResult {
  // 1. Extrair métricas do Modelo Atual
  const totalActivePatients = currentModel?.portfolio?.totalActivePatients || currentModel?.products?.reduce((acc, p) => acc + (p.activePatients || 0), 0) || 1;
  
  // Delegated clinical capacity from human resources in team
  const delegatedWeeklyClinicalHours = calculateDelegatedClinicalWeeklyHours(currentModel);
  const delegatedMonthlyClinicalHours = delegatedWeeklyClinicalHours * 4.33;

  let requiredMonthlyDeliveryHours = 0;
  if (currentModel?.products && currentModel.products.length > 0) {
    requiredMonthlyDeliveryHours = currentModel.products.reduce(
      (acc, p) => acc + calculateProductMonthlyDeliveryHours(p),
      0
    );
  }

  if (!requiredMonthlyDeliveryHours || requiredMonthlyDeliveryHours === 0) {
    requiredMonthlyDeliveryHours = currentModel?.deliveryContracts?.totalClinicMonthlyDeliveryHours || 20;
  }
  
  // Média de horas necessárias por paciente por mês
  const hoursPerPatientPerMonth = totalActivePatients > 0 ? (requiredMonthlyDeliveryHours / totalActivePatients) : 1;

  // Extrair Restrições
  const fixedBoundaries = boundariesData?.items.filter(b => b.type === 'Fixa') || [];
  const desiredBoundaries = boundariesData?.items.filter(b => b.type === 'Desejada') || [];

  let totalCandidateGenerated = 0;
  let discardedCount = 0;
  const discardedReasonsSummary: Record<string, number> = {
    'Insuficiência de horas clínicas para cobrir 100% do Contrato de Entrega': 0,
    'Violação de compromisso assumido / restrição fixa': 0,
  };

  const validConfigurations: A3Configuration[] = [];
  const seenDeduplicationCodes = new Set<string>();

  // 2. EXPLORAÇÃO SISTEMÁTICA DO ESPAÇO DE CONFIGURAÇÕES
  for (const dayOpt of WORK_DAYS_OPTIONS) {
    for (const ratioTier of RATIO_TIERS) {
      for (const allocMode of ALLOCATION_MODES) {
        totalCandidateGenerated++;

        // Calcular horas semanais para essa variação candidato
        const netDailyHours = 8;
        const weeklyNetHours = dayOpt.count * netDailyHours;
        const weeklyGrossHours = Math.round(weeklyNetHours * 1.25); // incluindo intervalos
        
        const weeklyClinicalHours = Math.round(weeklyNetHours * ratioTier.clinicalRatio * 10) / 10;
        const remainingHours = weeklyNetHours - weeklyClinicalHours;
        const weeklyManagementHours = Math.round(remainingHours * 0.5 * 10) / 10;
        const weeklyAcquisitionHours = Math.round(remainingHours * 0.5 * 10) / 10;

        // Horas clínicas mensais aproximadas + capacidade delegada (4.33 semanas por mês)
        const nutritionistMonthlyClinicalHours = weeklyClinicalHours * 4.33;
        const totalMonthlyClinicalHours = nutritionistMonthlyClinicalHours + delegatedMonthlyClinicalHours;

        // Capacidade máxima de pacientes ativos mantendo 100% do contrato de entrega
        const maxActivePatientCapacity = hoursPerPatientPerMonth > 0 
          ? Math.floor(totalMonthlyClinicalHours / hoursPerPatientPerMonth)
          : 0;

        // --- VALIDAÇÃO 100% DE RESTRIÇÕES FIXAS ---

        // Regra Inegociável A: Garantir 100% do Contrato de Entrega aos Pacientes
        if (totalMonthlyClinicalHours < requiredMonthlyDeliveryHours || maxActivePatientCapacity < totalActivePatients) {
          discardedCount++;
          discardedReasonsSummary['Insuficiência de horas clínicas para cobrir 100% do Contrato de Entrega']++;
          continue;
        }

        // Regra Inegociável B: Verificar se viola qualquer restrição fixa em texto livre
        let violatesFixedBoundary = false;
        for (const fixedBound of fixedBoundaries) {
          const descLower = fixedBound.description.toLowerCase();
          
          if ((descLower.includes('sábado') || descLower.includes('sabado')) && 
              (descLower.includes('não') || descLower.includes('livre') || descLower.includes('folga') || descLower.includes('sem')) && 
              dayOpt.count === 6) {
            violatesFixedBoundary = true;
            break;
          }

          if ((descLower.includes('máximo 4') || descLower.includes('maximo 4') || descLower.includes('4 dias no máximo')) && 
              dayOpt.count > 4) {
            violatesFixedBoundary = true;
            break;
          }

          if ((descLower.includes('máximo 3') || descLower.includes('maximo 3')) && 
              dayOpt.count > 3) {
            violatesFixedBoundary = true;
            break;
          }
        }

        if (violatesFixedBoundary) {
          discardedCount++;
          discardedReasonsSummary['Violação de compromisso assumido / restrição fixa']++;
          continue;
        }

        // --- AVALIAÇÃO DE RESTRIÇÕES DESEJADAS ---
        const fulfilledDesired: string[] = [];
        const unfulfilledDesired: string[] = [];

        for (const desiredBound of desiredBoundaries) {
          const descLower = desiredBound.description.toLowerCase();
          let fulfilled = true;

          if (descLower.includes('presencial') && allocMode.mode === 'Flexível (Sob Demanda)') {
            fulfilled = false;
          }
          if (descLower.includes('sábado') && dayOpt.count === 6) {
            fulfilled = false;
          }

          if (fulfilled) {
            fulfilledDesired.push(desiredBound.description);
          } else {
            unfulfilledDesired.push(desiredBound.description);
          }
        }

        // GERAR CHAVE DE DEDUPLICAÇÃO ESTRUTURAL (CÓDIGO INTERNO)
        const structuralDeduplicationCode = `${dayOpt.count}d_${ratioTier.code}_${allocMode.code}`;

        // Eliminar duplicidades estruturais
        if (seenDeduplicationCodes.has(structuralDeduplicationCode)) {
          continue;
        }
        seenDeduplicationCodes.add(structuralDeduplicationCode);

        // Criar objeto da Configuração Válida
        const configName = `Configuração ${dayOpt.name} - ${ratioTier.label.split(' ')[0]}`;
        const configDesc = `Grade de ${dayOpt.count} dias semanais com ${weeklyClinicalHours}h clínicas e ${weeklyManagementHours + weeklyAcquisitionHours}h dedicadas a gestão e captação, operando no modo ${allocMode.mode}.`;

        const candidateConfig: A3Configuration = {
          id: `config_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          name: configName,
          description: configDesc,
          workDaysCount: dayOpt.count,
          workDaysList: dayOpt.days,
          weeklyGrossHours,
          weeklyNetHours,
          weeklyClinicalHours,
          weeklyManagementHours,
          weeklyAcquisitionHours,
          maxActivePatientCapacity,
          clinicalRatioPercentage: Math.round(ratioTier.clinicalRatio * 100),
          growthRatioPercentage: Math.round(ratioTier.growthRatio * 100),
          patientDeliveryContractGuaranteed: true,
          fulfilledDesiredBoundariesCount: fulfilledDesired.length,
          unfulfilledDesiredBoundaries: unfulfilledDesired,
          allocationMode: allocMode.mode,
          structuralDeduplicationCode,
        };

        validConfigurations.push(candidateConfig);
      }
    }
  }

  // 3. MOTOR DE REPRESENTATIVIDADE (AGRUPAMENTO E SELEÇÃO DE REPRESENTANTES)
  const groupMap = new Map<string, A3Configuration[]>();

  for (const config of validConfigurations) {
    const tierLabel = config.clinicalRatioPercentage >= 70
      ? 'Predominância Clínica (>70%)'
      : config.clinicalRatioPercentage >= 50
      ? 'Equilibrada (50-70%)'
      : 'Foco em Gestão & Captação (<50%)';

    const groupKey = `${config.workDaysCount}d_${tierLabel}`;

    if (!groupMap.has(groupKey)) {
      groupMap.set(groupKey, []);
    }
    groupMap.get(groupKey)!.push(config);
  }

  const structuralGroups: A3StructuralGroup[] = [];
  const representativeConfigurations: A3Configuration[] = [];

  let groupIndex = 1;
  for (const [groupKey, groupConfigs] of groupMap.entries()) {
    const sampleConfig = groupConfigs[0];
    const tierLabel = sampleConfig.clinicalRatioPercentage >= 70
      ? 'Predominância Clínica (>70%)'
      : sampleConfig.clinicalRatioPercentage >= 50
      ? 'Equilibrada (50-70%)'
      : 'Foco em Gestão & Captação (<50%)';

    const representative = groupConfigs.find(c => c.allocationMode === 'Concentrada (Blocos Dedicados)') || groupConfigs[0];

    const groupObj: A3StructuralGroup = {
      groupId: `group_${groupIndex}_${sampleConfig.workDaysCount}d`,
      groupName: `Grupo ${groupIndex}: ${sampleConfig.workDaysCount} Dias com ${tierLabel}`,
      description: `Estrutura operacional para ${sampleConfig.workDaysCount} dias de trabalho semanais com foco de ${sampleConfig.clinicalRatioPercentage}% em atendimento.`,
      keyAttributes: {
        workDaysCount: sampleConfig.workDaysCount,
        careDistributionTier: tierLabel,
        allocationMode: representative.allocationMode,
      },
      totalConfigurationsInGroup: groupConfigs.length,
      allConfigurationsInGroup: groupConfigs,
      representativeConfiguration: representative,
    };

    structuralGroups.push(groupObj);
    representativeConfigurations.push(representative);
    groupIndex++;
  }

  // 4. MOTOR DE LEITURA
  // Traduz cada Configuração Representativa em uma leitura estruturada com frases simples e números de apoio.
  const readings: A3ConfigurationReading[] = representativeConfigurations.map((repConfig) =>
    buildConfigurationReading(repConfig, totalActivePatients)
  );

  return {
    totalCandidateConfigurationsGenerated: totalCandidateGenerated,
    validConfigurationsCount: validConfigurations.length,
    discardedConfigurationsCount: discardedCount,
    discardedReasonsSummary,
    validConfigurations,
    structuralGroups,
    representativeConfigurations,
    readings,
    executedAt: new Date().toISOString(),
  };
}
