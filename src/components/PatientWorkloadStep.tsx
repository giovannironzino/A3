import React from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Info, 
  HelpCircle,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { Button } from './UIPrimitives';
import { A3Product } from '../types';

interface PatientWorkloadStepProps {
  products: A3Product[];
  onCompleteStep: () => void;
  onNavigateToProducts: () => void;
  onToast: (msg: string) => void;
}

export const PatientWorkloadStep: React.FC<PatientWorkloadStepProps> = ({
  products,
  onCompleteStep,
  onNavigateToProducts,
  onToast,
}) => {
  // Calculate total active patients
  const totalActivePatients = products.reduce((acc, p) => acc + (p.activePatients || 0), 0);

  // Calculate total weekly hours consumed by current active patients across all products (X)
  // Monthly minutes per patient = p.totalTimeMinutes
  // Weekly hours per patient = (p.totalTimeMinutes / 60) / 4.33
  // Total weekly hours = sum(Weekly hours per patient * activePatients)
  const productCalculations = products.map((p) => {
    const monthlyMinutesPerPatient = p.totalTimeMinutes || 180;
    const monthlyHoursPerPatient = monthlyMinutesPerPatient / 60;
    const weeklyHoursPerPatient = monthlyHoursPerPatient / 4.33;
    const totalWeeklyHoursForProduct = weeklyHoursPerPatient * (p.activePatients || 0);

    return {
      product: p,
      monthlyHoursPerPatient: Math.round(monthlyHoursPerPatient * 10) / 10,
      weeklyHoursPerPatient: Math.round(weeklyHoursPerPatient * 10) / 10,
      totalWeeklyHoursForProduct: Math.round(totalWeeklyHoursForProduct * 10) / 10,
    };
  });

  const totalWeeklyPatientWorkload = Math.round(
    productCalculations.reduce((sum, item) => sum + item.totalWeeklyHoursForProduct, 0) * 10
  ) / 10;

  return (
    <div className="bg-white border border-neutral-200 p-6 sm:p-8 shadow-xs rounded-xl space-y-6 animate-fadeIn">
      {/* Header Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
        <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[0.65rem] font-subtitle font-bold px-2.5 py-0.5 uppercase tracking-wider inline-flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-emerald-700" />
          Diagnóstico Bloco A • Passo 2: Carga de Atendimento Atual
        </span>
        <button
          type="button"
          onClick={onNavigateToProducts}
          className="text-xs font-subtitle font-bold text-neutral-600 hover:text-[var(--preto)] underline cursor-pointer"
        >
          Editar Serviços e Pacientes
        </button>
      </div>

      {/* Prominent Calculation Result Banner */}
      <div className="bg-[var(--preto)] text-white p-6 sm:p-8 border-2 border-[var(--preto)] shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-subtitle font-bold uppercase tracking-widest">
          <Sparkles className="w-4 h-4" />
          Resultado Calculado da Carga Atual
        </div>

        <h2 className="font-title text-2xl sm:text-3xl text-white leading-tight">
          "Atender quem já é seu paciente hoje consome aproximadamente{' '}
          <span className="text-emerald-400 font-extrabold underline decoration-emerald-500 underline-offset-4">
            {totalWeeklyPatientWorkload} horas por semana
          </span>."
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-subtitle text-neutral-300 border-t border-neutral-800">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Total de Pacientes Ativos: <strong className="text-white font-bold">{totalActivePatients} pacientes</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Média de Atendimento Clínico: <strong className="text-white font-bold">~{totalWeeklyPatientWorkload}h / semana</strong></span>
          </div>
        </div>
      </div>

      {/* Explanation Note */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 space-y-1">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <strong className="font-subtitle text-xs uppercase font-bold text-amber-950">
            De onde vem esse cálculo?
          </strong>
        </div>
        <p className="font-body text-xs text-amber-900 leading-relaxed pl-6">
          Esse número é a soma do tempo de entregas (consultas, elaboração de planos, suporte e avaliações) multiplicado pelo número de pacientes ativos em cada serviço do seu catálogo.
        </p>
      </div>

      {/* Breakdown Table by Product */}
      <div className="space-y-3">
        <h3 className="font-subtitle text-xs font-bold uppercase tracking-wider text-[var(--preto)]">
          Detalhamento da Carga Horária por Serviço
        </h3>

        <div className="border-2 border-[var(--preto)] overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[550px]">
            <thead>
              <tr className="bg-[var(--preto)] text-white text-[0.7rem] font-subtitle font-bold uppercase tracking-wider">
                <th className="p-3 border-r border-neutral-700">Serviço / Produto</th>
                <th className="p-3 border-r border-neutral-700">Pacientes Ativos</th>
                <th className="p-3 border-r border-neutral-700">Horas / Mês por Paciente</th>
                <th className="p-3">Carga Semanal Dedicada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-xs font-body">
              {productCalculations.map(({ product, monthlyHoursPerPatient, totalWeeklyHoursForProduct }) => (
                <tr key={product.id} className="hover:bg-neutral-50">
                  <td className="p-3 border-r border-neutral-200 font-subtitle font-bold text-[var(--preto)]">
                    {product.name}
                    <span className="block text-[0.65rem] font-normal text-neutral-500">{product.format} • {product.durationLabel}</span>
                  </td>
                  <td className="p-3 border-r border-neutral-200 font-subtitle font-bold text-emerald-800">
                    {product.activePatients} paciente(s)
                  </td>
                  <td className="p-3 border-r border-neutral-200 text-neutral-700">
                    {monthlyHoursPerPatient}h / mês
                  </td>
                  <td className="p-3 font-subtitle font-bold text-[var(--preto)]">
                    {totalWeeklyHoursForProduct}h / semana
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={onNavigateToProducts}
          className="text-xs font-subtitle font-bold text-neutral-600 hover:text-[var(--preto)] cursor-pointer border-none bg-transparent flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar aos Serviços
        </button>

        <Button
          variant="primary"
          size="lg"
          onClick={onCompleteStep}
          className="py-3.5 px-6 text-xs uppercase font-bold tracking-wider flex items-center gap-2"
        >
          <span>Avançar para Agenda Disponível</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
