import React from 'react';
import { PullQuote } from './UIPrimitives';

export const BrandBanner: React.FC = () => {
  return (
    <>
      {/* Pull Quote Section */}
      <section className="py-16 md:py-24 border-b border-[var(--border-default)] bg-[var(--branco)]">
        <div className="max-w-[840px] mx-auto px-5 md:px-12">
          <PullQuote attribution="Êxodo">
            Ao término do acompanhamento, você terá passado por uma experiência de gestão profissional — a base para o próximo nível do seu negócio.
          </PullQuote>
        </div>
      </section>

      {/* Dark "Sobre a Êxodo" Section */}
      <section className="bg-[var(--preto)] text-[var(--branco)] py-16 md:py-24 border-b border-[var(--border-strong)]">
        <div className="max-w-[1120px] mx-auto px-5 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          <div className="md:col-span-4">
            <span className="font-subtitle font-bold text-xs uppercase tracking-[var(--tracking-wider)] text-[var(--exodo-red)] block mb-2">
              Sobre a Êxodo
            </span>
            <h3 className="font-display text-2xl md:text-3xl leading-tight text-[var(--branco)] m-0">
              Gestão estratégica aplicada à saúde
            </h3>
          </div>

          <div className="md:col-span-8 flex flex-col gap-5">
            <p className="font-body text-base md:text-lg leading-[var(--lh-relaxed)] text-[var(--text-on-inverse)] m-0">
              A Êxodo aplica um método exclusivo de diagnóstico e gestão estratégica a clínicas de nutrição, com estrategistas dedicados ao acompanhamento individual de cada negócio.
            </p>
            <p className="font-body text-base md:text-lg leading-[var(--lh-relaxed)] text-[var(--cinza-claro)] m-0">
              O AE3 é o ponto de entrada: um trimestre para sair do improviso, blindar a operação contra urgências diárias e instalar um ritmo de gestão profissional na clínica.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
