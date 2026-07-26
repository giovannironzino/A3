import React, { useState } from 'react';
import { SectionTopic } from './UIPrimitives';
import { Plus, Minus } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData = [
    {
      q: 'Para quem é o AE3?',
      a: 'Para nutricionistas que já têm uma clínica em funcionamento e precisam de um plano de ação claro para os próximos 90 dias, com acompanhamento individual de um estrategista.',
    },
    {
      q: 'Quanto tempo dura o acompanhamento?',
      a: 'A Fase 01 acontece em até 10 dias, com 3 encontros. A Fase 02 segue por um trimestre, com ritmo semanal e um Ritual de Gestão mensal.',
    },
    {
      q: 'Os encontros são individuais ou em grupo?',
      a: 'Individuais. Todos os encontros e rituais são feitos diretamente com o seu estrategista, online e agendados de forma personalizada.',
    },
    {
      q: 'O que acontece ao final do trimestre?',
      a: 'Você pode encerrar o acompanhamento ou seguir com uma assinatura recorrente personalizada (usando nosso simulador), escolhendo a quantidade de Rituais de Gestão e o tipo de suporte.',
    },
    {
      q: 'Preciso ter experiência com gestão para participar?',
      a: 'Não. O processo parte do cenário real da sua clínica hoje, sem exigir conhecimento prévio de gestão ou finanças complexas.',
    },
    {
      q: 'Como funciona o pagamento?',
      a: 'O AE3 custa R$ 1.799,00 à vista no PIX, ou em até 3x no cartão. A assinatura recorrente pós-AE3, quando ativada, é cobrada mensalmente.',
    },
  ];

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" className="py-10 sm:py-16 md:py-24 bg-[var(--surface-card)] border-b border-[var(--border-default)]">
      <div className="max-w-[820px] mx-auto px-4 sm:px-6 md:px-12">
        <SectionTopic label="Dúvidas Frequentes">
          O que perguntam antes de começar
        </SectionTopic>

        <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col border-t border-[var(--border-default)]">
          {faqData.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="border-b border-[var(--border-default)] bg-[var(--branco)] px-4 sm:px-5 py-3.5 sm:py-4 transition-all">
                <button
                  onClick={() => toggle(i)}
                  className="w-full text-left flex justify-between items-center gap-3 bg-transparent border-none cursor-pointer py-1 min-h-[44px]"
                  aria-expanded={isOpen}
                >
                  <span className="font-subtitle font-bold text-sm sm:text-base md:text-lg text-[var(--text-primary)] hover:text-[var(--exodo-red)] transition-colors pr-2">
                    {item.q}
                  </span>
                  <span className="font-subtitle text-xl font-bold text-[var(--exodo-red)] shrink-0 p-1">
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </span>
                </button>
                {isOpen && (
                  <p className="font-body text-xs sm:text-sm md:text-base leading-[var(--lh-relaxed)] text-[var(--text-secondary)] mt-2 mb-1 pt-2.5 border-t border-[var(--border-default)]">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
