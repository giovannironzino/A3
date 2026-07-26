import { 
  A3ChosenConfigurationData, 
  A3CurrentModel, 
  A3TacticalPlanData, 
  A3TacticalStage, 
  A3TacticalActivity
} from '../types';

export function generateTacticalPlan(
  chosenChoice: A3ChosenConfigurationData,
  currentModel?: A3CurrentModel | null
): A3TacticalPlanData {
  const { chosenConfig, reading } = chosenChoice;

  const modeLabel = chosenConfig.allocationMode?.includes('Concentrada')
    ? 'Dias Dedicados Exclusivos'
    : chosenConfig.allocationMode?.includes('Equilibrada')
    ? 'Blocos Diários de Horários'
    : 'Modo Híbrido Flexível';

  const formatScheduleNotice = chosenConfig.allocationMode?.includes('Concentrada')
    ? `Dias inteiros fixos (${chosenConfig.workDaysCount} dias/semana)`
    : `Blocos diários organizados (${chosenConfig.workDaysCount} dias/semana)`;

  // Gaps identified between current model and chosen config
  const currentClinicalHours = currentModel?.totalWeeklyClinicalHours || 30;
  const currentWorkDays = Math.max(3, Math.min(6, Math.round(currentClinicalHours / 6)));
  const targetWorkDays = chosenConfig.workDaysCount;

  const gapsIdentified: string[] = [
    `Ajuste da jornada semanal de atendimento de ~${currentWorkDays} dias para ${targetWorkDays} dias úteis por semana.`,
    `Implementação da rotina de alocação de tempo via ${modeLabel}, sem misturar atendimento clínico direto com prospecção no mesmo momento.`,
    `Ajuste do teto de capacidade ativa para até ${reading.maxActivePatientCapacity} pacientes em acompanhamento.`,
    `Reserva fixa de ${reading.weeklyAcquisitionHours}h semanais exclusivas para captação e gestão da clínica.`,
    `Alinhamento rigoroso dos contratos de entrega para garantir 100% dos retornos e acompanhamentos dentro do modelo escolhido.`
  ];

  const currentSituationSummary = currentModel 
    ? `Operação atual com ~${Math.round(currentModel.totalWeeklyClinicalHours)}h/semana de atendimento e ${currentModel.totalActivePatients} pacientes ativos em carteira, ocupando a agenda de forma dispersa.`
    : `Operação atual desestruturada, exigindo organização da agenda e dos contratos de entrega.`;

  const targetSituationSummary = `Operação organizada na "${chosenConfig.name}" com ${targetWorkDays} dias de trabalho/semana, ${reading.weeklyClinicalHours}h de clínica, ${reading.weeklyAcquisitionHours}h de captação/semana e capacidade para ${reading.maxActivePatientCapacity} pacientes.`;

  // STAGE 1: Mês 1 (Semanas 1-4)
  const stage1Activities: A3TacticalActivity[] = [
    {
      id: 'act_w1_01',
      title: 'Reestruturação da Grade Horária e Bloqueio na Agenda',
      description: `Ajustar a agenda oficial para o formato de ${modeLabel}, criando blocos protegidos e inegociáveis.`,
      objective: 'Garantir a divisão física e temporal entre horários de atendimento aos pacientes e horários de gestão/captação.',
      expectedResult: `Grade horária reconfigurada com ${reading.weeklyClinicalHours}h para clínica e ${reading.weeklyAcquisitionHours}h para captação.`,
      dependencies: ['Configuração Escolhida Validada'],
      weekNumber: 1,
      timeAllocationFormat: formatScheduleNotice,
      gapOrigin: `Diferença de organização temporal entre a agenda dispersa atual e o modelo de ${modeLabel}.`
    },
    {
      id: 'act_w2_02',
      title: 'Comunicação de Grade e Alinhamento com Pacientes Ativos',
      description: 'Avisar a base atual sobre a nova disponibilidade de horários e padronizar os reagendamentos dentro da nova grade.',
      objective: 'Encaixar todos os pacientes ativos dentro da nova disponibilidade estrutural sem violar o Contrato de Entrega.',
      expectedResult: '100% dos pacientes ativos reagendados na nova grade de atendimento.',
      dependencies: ['Act_w1_01: Reestruturação da Grade Horária'],
      weekNumber: 2,
      timeAllocationFormat: formatScheduleNotice,
      gapOrigin: 'Necessidade de migrar a carteira atual para os novos limites da agenda.'
    },
    {
      id: 'act_w3_03',
      title: 'Ativação do Protocolo Interno de Captação e Gestão',
      description: `Implementar a rotina de trabalho nos horários de captação (${reading.weeklyAcquisitionHours}h/semana), definindo roteiro de contatos, posts e parcerias.`,
      objective: 'Garantir que as horas reservadas para a captação sejam utilizadas de forma produtiva e focada.',
      expectedResult: 'Checklist de captação ativo e executado semanalmente.',
      dependencies: ['Act_w1_01: Reestruturação da Grade Horária'],
      weekNumber: 3,
      timeAllocationFormat: formatScheduleNotice,
      gapOrigin: 'Ausência prévia de um horário estruturado e protegido para atração de novos pacientes.'
    },
    {
      id: 'act_w4_04',
      title: 'Primeira Auditoria do Ritmo de Atendimento e Ocupação',
      description: 'Avaliar a adaptação à nova rotina no final do primeiro mês, medindo pontualidade, cansaço e ocupação.',
      objective: 'Validar a viabilidade prática da nova grade e realizar pequenos ajustes de transição.',
      expectedResult: 'Primeiro mês concluído com taxa de ocupação da agenda mapeada e sem estouro de carga horária.',
      dependencies: ['Act_w2_02: Comunicação de Grade', 'Act_w3_03: Protocolo de Captação'],
      weekNumber: 4,
      timeAllocationFormat: formatScheduleNotice,
      gapOrigin: 'Verificação da redução da lacuna entre a situação inicial e o Mês 1 da nova configuração.'
    }
  ];

  const stage1: A3TacticalStage = {
    stageNumber: 1,
    monthName: 'Mês 1 (Semanas 1 a 4)',
    title: 'Ajuste de Grade e Transição da Carteira Ativa',
    objective: 'Reorganizar a estrutura da agenda, bloquear os tempos de captação/gestão e alinhar a base atual de pacientes.',
    expectedOutcome: 'Agenda 100% migrada para a nova grade de horários, com blocos de captação protegidos e zero impacto negativo nos contratos vigentes.',
    activities: stage1Activities
  };

  // STAGE 2: Mês 2 (Semanas 5-8)
  const stage2Activities: A3TacticalActivity[] = [
    {
      id: 'act_w5_05',
      title: 'Otimização dos Processos de Pré e Pós-Consulta',
      description: 'Padronizar materiais de entrega e templates de prontuário para reduzir o tempo extra gasto fora da consulta.',
      objective: 'Garantir que cada atendimento respeite a margem de tempo planejada sem invadir horas de descanso.',
      expectedResult: 'Redução de 30% no tempo gasto em digitação e montagem de planos pós-consulta.',
      dependencies: ['Act_w4_04: Primeira Auditoria'],
      weekNumber: 5,
      timeAllocationFormat: formatScheduleNotice,
      gapOrigin: 'Adequação dos tempos operacionais à biblioteca de tempos da configuração.'
    },
    {
      id: 'act_w6_06',
      title: 'Aceleração do Funil de Captação nos Horários Protegidos',
      description: 'Utilizar integralmente as horas de captação para relacionamento com parceiros médicos, nutricionais e conteúdo de atração.',
      objective: 'Preencher as vagas remanescentes da agenda de novos pacientes com clientes de ticket ideal.',
      expectedResult: 'Aumento na conversão de primeiras consultas e ocupação gradual até a capacidade ideal.',
      dependencies: ['Act_w3_03: Protocolo Interno de Captação'],
      weekNumber: 6,
      timeAllocationFormat: formatScheduleNotice,
      gapOrigin: 'Meta de ocupação e captação sistemática definida na configuração escolhida.'
    },
    {
      id: 'act_w7_07',
      title: 'Monitoramento da Taxa de Retenção e Renovação',
      description: 'Acompanhar a aderência dos pacientes e aplicar protocolo de renovação ao final dos acompanhamentos.',
      objective: 'Manter a estabilidade da carteira e prevenir vacâncias na agenda.',
      expectedResult: 'Taxa de renovação superior a 75% nos acompanhamentos vigentes.',
      dependencies: ['Act_w5_05: Otimização de Processos'],
      weekNumber: 7,
      timeAllocationFormat: formatScheduleNotice,
      gapOrigin: 'Manutenção do fluxo contínuo de acompanhamento exigido no contrato de entrega.'
    },
    {
      id: 'act_w8_08',
      title: 'Revisão Intermediária de 60 Dias (Balanço de Metade do Ciclo)',
      description: 'Analisar faturamento acumulado, horas trabalhadas reais e nível de bem-estar do nutricionista.',
      objective: 'Medir o avanço real do plano e consolidar os hábitos da nova rotina.',
      expectedResult: 'Relatório de evolução com 60% do objetivo de transição alcançado com clareza.',
      dependencies: ['Act_w6_06: Funil de Captação', 'Act_w7_07: Taxa de Retenção'],
      weekNumber: 8,
      timeAllocationFormat: formatScheduleNotice,
      gapOrigin: 'Validação da progressão tática rumo ao estado final desejado.'
    }
  ];

  const stage2: A3TacticalStage = {
    stageNumber: 2,
    monthName: 'Mês 2 (Semanas 5 a 8)',
    title: 'Ganho de Eficiência e Expansão da Captação',
    objective: 'Aprimorar o fluxo de atendimento para economizar tempo e acelerar a captação de pacientes nos horários reservados.',
    expectedOutcome: 'Operação fluida, tempo pré/pós-consulta reduzido e agenda atingindo níveis elevados de ocupação com novos pacientes.',
    activities: stage2Activities
  };

  // STAGE 3: Mês 3 (Semanas 9-12)
  const stage3Activities: A3TacticalActivity[] = [
    {
      id: 'act_w9_09',
      title: 'Consolidação do Teto de Carteira Ativa',
      description: `Atingir e manter a estabilidade no limite planejado de até ${reading.maxActivePatientCapacity} pacientes ativos simultâneos.`,
      objective: 'Evitar sobrecarga e manter a qualidade da entrega com agenda lotada no limite saudável.',
      expectedResult: `Carteira estabilizada no teto de ${reading.maxActivePatientCapacity} pacientes ativos sem estouro de horários.`,
      dependencies: ['Act_w8_08: Revisão Intermediária'],
      weekNumber: 9,
      timeAllocationFormat: formatScheduleNotice,
      gapOrigin: 'Consolidação da capacidade máxima sustentável da clínica.'
    },
    {
      id: 'act_w10_10',
      title: 'Estabilização do Fluxo de Caixa e Previsibilidade Financeira',
      description: 'Consolidar as receitas recorrentes dos programas de acompanhamento e do fluxo contínuo de atendimentos.',
      objective: 'Alcançar previsibilidade financeira total para os meses subsequentes.',
      expectedResult: 'Faturamento estabilizado de acordo com o teto da configuração escolhida.',
      dependencies: ['Act_w9_09: Consolidação da Carteira'],
      weekNumber: 10,
      timeAllocationFormat: formatScheduleNotice,
      gapOrigin: 'Resultado financeiro derivado da migração para a nova estrutura.'
    },
    {
      id: 'act_w11_11',
      title: 'Padronização do Manual Operacional da Rotina',
      description: 'Documentar as regras da nova rotina para que o nutricionista mantenha os limites de forma perpétua.',
      objective: 'Impedir retrocessos para os maus hábitos anteriores de atendimento desorganizado.',
      expectedResult: 'Rotina de trabalho 100% automatizada e incorporada aos hábitos diários do profissional.',
      dependencies: ['Act_w10_10: Estabilização Financeira'],
      weekNumber: 11,
      timeAllocationFormat: formatScheduleNotice,
      gapOrigin: 'Garantia de perpetuidade do modelo operacional escolhido.'
    },
    {
      id: 'act_w12_12',
      title: 'Conclusão dos 90 Dias & Transição para Acompanhamento Contínuo',
      description: 'Realizar a sessão de encerramento do Plano Tático e aprovação final da transformação da clínica.',
      objective: 'Celebrar a migração com sucesso do Modelo Atual para a Configuração Selecionada.',
      expectedResult: 'Plano Tático 100% executado e clínica operando no estado desejado.',
      dependencies: ['Act_w11_11: Manual Operacional'],
      weekNumber: 12,
      timeAllocationFormat: formatScheduleNotice,
      gapOrigin: 'Encerramento oficial da Jornada de Transformação no Navegador.'
    }
  ];

  const stage3: A3TacticalStage = {
    stageNumber: 3,
    monthName: 'Mês 3 (Semanas 9 a 12)',
    title: 'Consolidação, Estabilidade e Autonomia Operacional',
    objective: 'Estabilizar o teto de pacientes ativos, previsibilidade de receita e perpetuar os novos hábitos de organização.',
    expectedOutcome: 'Clínica operando de forma 100% estável e equilibrada na nova configuração nos próximos 90 dias.',
    activities: stage3Activities
  };

  return {
    id: `plan_${Date.now()}`,
    configId: chosenConfig.id,
    configName: chosenConfig.name,
    allocationMode: chosenConfig.allocationMode,
    allocationModeLabel: modeLabel,
    signaturePhrase: reading.signaturePhrase,
    currentSituationSummary,
    targetSituationSummary,
    gapsIdentified,
    stages: [stage1, stage2, stage3],
    isApproved: false
  };
}
