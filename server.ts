import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get Gemini Client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// SYSTEM INSTRUCTION FOR INVESTIGATION CHAT
const SYSTEM_INSTRUCTION = `
Você é o Gio, um consultor de negócios sênior e objetivo da Êxodo Nutrição.
Sua missão é realizar a etapa de "Investigação do Negócio" através de uma conversa contínua de texto no estilo WhatsApp.

REGRA DE TAMANHO CRÍTICA:
- MENSAGENS EXTREMAMENTE OBJETIVAS: NO MÁXIMO 3 FRASES POR RESPOSTA. NUNCA ultrapasse 3 frases!
- A conversa é 100% POR TEXTO, nada de mensagens de áudio ou chamadas de voz.

DIRETRIZES DA CONVERSA (SEÇÕES 1 A 4 DO PROTOCOLO A3):

1. CONTEXTO JÁ EXISTENTE (RELEMBRAR ATIVAMENTE):
O nutricionista já preencheu etapas anteriores. Sempre que fizer uma pergunta conectada a um dado existente, cite-o em poucas palavras para demonstrar contexto.
Contexto do nutricionista:
- Serviços/Produtos: formatos, preços, entregas, pacientes ativos.
- Agenda real de atendimento: dias, turnos e horas líquidas semanais disponíveis.
- Horas clínicas e Horas Livres (Z) fora do atendimento direto.
- Ticket médio e taxa de retenção.

2. DADOS-ALVO A COLETAR (EIXOS DE RACIOCÍNIO):
Colete estes dados de forma objetiva (uma pergunta por vez, sem citar eixos ou números de pergunta):
- Eixo 1 (Criação de Valor): Frase-promessa; Diferencial percebido; Algo único que faz; Cumprimento da promessa.
- Eixo 2 (Marketing & Aquisição): Canais de captação; Direção do contato; Origem em conteúdo; Volume de pacientes novos 90d (com nível de confiança); Conversão; Descrição do público; Branding; Tempo semanal em mkt.
- Eixo 3 (Vendas): Roteiro de vendas; Formato de fechamento; Sistema de conversas; Quem conduz a venda; Follow-up; Tempo até fechamento; Motivo de não-fechamento.
- Eixo 4 (Entrega): Qualidade percebida via retenção e cumprimento da promessa.
- Eixo 5 (Financeiro): Faturamento mensal relatado como fato direto (com confiança) - NUNCA pedir para calcular; Custos isolados (aluguel, ferramentas, contador, equipe, outros); Verificação de atrasos.
- Eixo 6 (Equipe): Trabalha sozinho ou com equipe; Para cada colaborador: nome, função, se é DELEGADO CLÍNICO (atende pacientes -> horas semanais somam na capacidade clínica total); custo mensal.
- Eixo 7 (Processos): Script de apresentação; Contrato padrão; Processo de boas-vindas; Processo de saída.
- Eixo 8 (Ferramentas): Prontuário eletrônico, agenda digital, CRM, WhatsApp Business, planilha, papel, etc.
- Eixo 9 (Jurídico): Termo de consentimento; Política de cancelamento.

3. REGRAS DE CONDUÇÃO:
- NO MÁXIMO 3 FRASES POR MENSAGEM.
- FAÇA APENAS UMA PERGUNTA POR VEZ.
- Ofereça sugestões de opções rápidas de resposta ('quickOptions') sempre que couber.
- Para perguntas numéricas ou descritivas, ofereça opções de confiança ('Sei com precisão', 'Tenho uma ideia aproximada', 'Não sei'). Se a resposta for 'Não sei', reaja brevemente e siga em frente.
- NUNCA peça para o nutricionista calcular somas ou taxas.
- NUNCA mencione o número da pergunta ou nome dos eixos.

4. REGRA DE PARADA:
Quando TODOS os itens tiverem sido respondidos, defina 'isCompleted: true', avise em no máximo 3 frases que o Modelo Atual foi investigado e encerre a conversa.
`;

// API Route for Investigation Chat with Gemini
app.post('/api/investigation-chat', async (req, res) => {
  try {
    const ai = getGeminiClient();
    const { context, history, currentData, userMessage } = req.body;

    if (!ai) {
      return res.status(200).json({
        success: false,
        fallback: true,
        message: "Gemini API key não configurada. Usando motor inteligente local.",
      });
    }

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `CONTEXTO DO NUTRICIONISTA JÁ COLETADO:
${JSON.stringify(context, null, 2)}

ESTADO ATUAL DA INVESTIGAÇÃO DO NEGÓCIO (A3InvestigationData):
${JSON.stringify(currentData || {}, null, 2)}

HISTÓRICO DA CONVERSA DE ZAP COM GIO ATÉ AGORA:
${JSON.stringify(history || [], null, 2)}

ÚLTIMA MENSAGEM DO NUTRICIONISTA:
"${userMessage || 'Olá Gio, acabei de atender a ligação!'}"

Por favor, como Gio, analise o estado atual da investigação, a última resposta do nutri, atualize o objeto estruturado 'updatedInvestigation' incorporando as novas respostas extraídas, determine a próxima pergunta única e gere a resposta.`,
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            gioMessage: {
              type: Type.STRING,
              description: 'A fala/mensagem do Gio para o WhatsApp (1 parágrafo amigável + 1 pergunta clara).',
            },
            quickOptions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Botões de resposta rápida sugeridos para a UI do WhatsApp (ou array vazio se for resposta de texto livre).',
            },
            inputType: {
              type: Type.STRING,
              description: "Tipo de input sugerido: 'quick_options', 'text' ou 'number'.",
            },
            updatedInvestigation: {
              type: Type.OBJECT,
              description: 'O objeto A3InvestigationData atualizado contendo os 7 ramos de dados (valueCreation, marketing, financial, team, processes, tools, legal).',
              properties: {
                valueCreation: {
                  type: Type.OBJECT,
                  properties: {
                    differentiationReason: { type: Type.STRING },
                    differentiationSource: { type: Type.STRING },
                  },
                },
                marketing: {
                  type: Type.OBJECT,
                  properties: {
                    selectedChannels: { type: Type.ARRAY, items: { type: Type.STRING } },
                    channelDetails: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          channelName: { type: Type.STRING },
                          newPatients90d: { type: Type.NUMBER },
                          newPatientsConfidence: { type: Type.STRING },
                          conversionRateOutOf10: { type: Type.NUMBER },
                          conversionConfidence: { type: Type.STRING },
                          targetAudienceDescription: { type: Type.STRING },
                          audienceConfidence: { type: Type.STRING },
                        },
                      },
                    },
                    timesPerWeek: { type: Type.NUMBER },
                    minutesPerTime: { type: Type.NUMBER },
                    allocatedWeeklyHours: { type: Type.NUMBER },
                  },
                },
                financial: {
                  type: Type.OBJECT,
                  properties: {
                    reportedGrossMonthlyRevenue: { type: Type.NUMBER },
                    revenueConfidence: { type: Type.STRING },
                    costs: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          name: { type: Type.STRING },
                          hasCost: { type: Type.BOOLEAN },
                          monthlyAmount: { type: Type.NUMBER },
                          isEstimate: { type: Type.BOOLEAN },
                        },
                      },
                    },
                    totalMonthlyCosts: { type: Type.NUMBER },
                    breakEvenDifference: { type: Type.NUMBER },
                    isAboveBreakEven: { type: Type.BOOLEAN },
                  },
                },
                team: {
                  type: Type.OBJECT,
                  properties: {
                    hasTeam: { type: Type.BOOLEAN },
                    members: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          name: { type: Type.STRING },
                          role: { type: Type.STRING },
                          isClinicalDelegate: { type: Type.BOOLEAN },
                          daysPerWeek: { type: Type.NUMBER },
                          weeklyClinicalHours: { type: Type.NUMBER },
                          monthlySalaryOrCost: { type: Type.NUMBER },
                        },
                      },
                    },
                    totalDelegatedClinicalWeeklyHours: { type: Type.NUMBER },
                    totalTeamMonthlyCost: { type: Type.NUMBER },
                  },
                },
                processes: {
                  type: Type.OBJECT,
                  properties: {
                    salesScriptStatus: { type: Type.STRING },
                    standardContractStatus: { type: Type.STRING },
                    onboardingProcessStatus: { type: Type.STRING },
                    offboardingProcessStatus: { type: Type.STRING },
                  },
                },
                tools: {
                  type: Type.OBJECT,
                  properties: {
                    selectedTools: { type: Type.ARRAY, items: { type: Type.STRING } },
                    customToolName: { type: Type.STRING },
                  },
                },
                legal: {
                  type: Type.OBJECT,
                  properties: {
                    consentTermStatus: { type: Type.STRING },
                    cancellationPolicyStatus: { type: Type.STRING },
                  },
                },
              },
            },
            isCompleted: {
              type: Type.BOOLEAN,
              description: 'true se TODOS os itens dos 9 eixos estão preenchidos (com valor exato, estimativa ou "não sei").',
            },
          },
          required: ['gioMessage', 'updatedInvestigation', 'isCompleted'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      gioMessage: parsed.gioMessage,
      quickOptions: parsed.quickOptions || [],
      inputType: parsed.inputType || 'text',
      updatedInvestigation: parsed.updatedInvestigation,
      isCompleted: !!parsed.isCompleted,
    });
  } catch (error: any) {
    console.error('Error calling Gemini API for investigation:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Falha ao processar mensagem do Gio.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
