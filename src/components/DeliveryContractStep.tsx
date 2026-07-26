import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  ShieldAlert, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Users, 
  Layers, 
  Check, 
  Building2,
  AlertCircle
} from 'lucide-react';
import { Button } from './UIPrimitives';
import { 
  A3Product, 
  A3TimeLibraryData, 
  A3DeliveryContractsData,
  A3ProductDeliveryContract
} from '../types';

interface DeliveryContractStepProps {
  products: A3Product[];
  timeLibrary?: A3TimeLibraryData | null;
  initialContractsData?: A3DeliveryContractsData | null;
  onSaveContractsData: (data: A3DeliveryContractsData) => void;
  onCompleteStep: () => void;
  onToast: (msg: string) => void;
}

export const DeliveryContractStep: React.FC<DeliveryContractStepProps> = ({
  products,
  initialContractsData,
  onSaveContractsData,
  onCompleteStep,
  onToast,
}) => {
  const [isFixedConstraintConfirmed, setIsFixedConstraintConfirmed] = useState<boolean>(true);

  // Compute aggregated contract data directly from products list
  const aggregatedContracts = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }

    return products.map((prod) => {
      const activePts = prod.activePatients || 5;
      const durationDays = prod.durationDays || 90;
      const durationMonths = Math.max(1, durationDays / 30);

      // Detailed deliverables or fallback
      const deliverables = prod.detailedDeliverables && prod.detailedDeliverables.length > 0
        ? prod.detailedDeliverables
        : (prod.deliveries || []).map((name, i) => ({
            id: `del_fallback_${i}`,
            name,
            occurrencesIn3Months: 3,
            frequency: 'mensal' as const,
            minutesPerOccurrence: 60,
            isMinutesEstimated: true,
          }));

      // Calculate total 3-month minutes per patient from deliverables
      const total3MonthMinutesPerPatient = deliverables.reduce((acc, d) => {
        const occ = d.occurrencesIn3Months || 3;
        const mins = d.minutesPerOccurrence || 60;
        return acc + (occ * mins);
      }, 0);

      // Convert 3-month total to monthly total
      const monthlyMinsPerPatient = Math.round(total3MonthMinutesPerPatient / durationMonths);

      // Total monthly hours for clinic for this product
      const totalClinicMonthlyHours = Number(((monthlyMinsPerPatient * activePts) / 60).toFixed(1));

      const contractObj: A3ProductDeliveryContract = {
        productId: prod.id,
        productName: prod.name,
        productDurationDays: durationDays,
        activePatientsCount: activePts,
        consultationsCount: Math.max(1, Math.round(durationMonths)),
        consultationMinutes: 60,
        checkInsCount: Math.max(2, Math.round(durationMonths * 2)),
        checkInMinutes: 15,
        hasContinuousSupport: true,
        supportFrequency: 'Dias Úteis',
        supportMinutesPerEvent: 15,
        supportEstimatedTotalMinutes: 180,
        additionalActivities: [],
        totalContractMinutesPerPatient: total3MonthMinutesPerPatient,
        totalMonthlyMinutesPerPatient: monthlyMinsPerPatient,
        totalClinicMonthlyHours: totalClinicMonthlyHours,
        isFixedConstraintConfirmed: true,
      };

      return {
        product: prod,
        deliverables,
        activePatients: activePts,
        total3MonthMinutesPerPatient,
        monthlyMinsPerPatient,
        totalClinicMonthlyHours,
        contractObj,
      };
    });
  }, [products]);

  // Overall total monthly delivery hours for clinic
  const totalClinicDeliveryHoursOverall = useMemo(() => {
    return aggregatedContracts.reduce((acc, curr) => acc + curr.totalClinicMonthlyHours, 0);
  }, [aggregatedContracts]);

  // Handle final approval and lock of contract constraints
  const handleConfirmAndComplete = () => {
    if (!isFixedConstraintConfirmed) {
      onToast('Por favor, confirme a trava de restrição fixa do contrato para continuar.');
      return;
    }

    const contractsList = aggregatedContracts.map(item => item.contractObj);

    const resultData: A3DeliveryContractsData = {
      contracts: contractsList,
      totalClinicMonthlyDeliveryHours: Number(totalClinicDeliveryHoursOverall.toFixed(1)),
      isCompleted: true,
    };

    onSaveContractsData(resultData);
    onToast('Contratos de Entrega formalizados com sucesso! Restrição fixa salva no sistema.');
    onCompleteStep();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border-2 border-[var(--preto)] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6 animate-fadeIn">
        {/* Header Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
          <div>
            <span className="bg-red-100 text-red-900 border border-red-300 text-[0.65rem] font-subtitle font-bold px-2.5 py-0.5 uppercase tracking-wider inline-flex items-center gap-1 mb-1">
              <Lock className="w-3.5 h-3.5 text-red-700" />
              Objeto 04 — Consolidação e Trava do Contrato de Entrega ao Paciente
            </span>
            <h2 className="font-title text-2xl text-[var(--preto)] leading-snug">
              Resumo Consolidado das Entregas e Carga Operacional
            </h2>
          </div>

          <div className="bg-neutral-900 text-white p-3 border border-neutral-800 text-right shrink-0">
            <span className="text-[0.65rem] font-subtitle text-neutral-400 uppercase block">
              Carga Total Prometida na Clínica
            </span>
            <strong className="font-title text-xl text-emerald-400">
              {totalClinicDeliveryHoursOverall.toFixed(1)} hrs/mês
            </strong>
          </div>
        </div>

        {/* Informational Guidance Box */}
        <div className="p-4 bg-amber-50 border-l-4 border-amber-500 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <strong className="font-subtitle text-xs uppercase font-bold text-amber-950">
              Trava de Restrição Fixa do Navegador A3
            </strong>
          </div>
          <p className="text-xs font-body text-amber-900 leading-relaxed">
            As entregas parametrizadas em cada produto representam o compromisso operacional assumido com seus pacientes ativos. Estes valores constituem uma <strong>restrição fixa da clínica</strong> e serão utilizados automaticamente pelo motor de cálculo nas etapas de diagnóstico de capacidade da agenda.
          </p>
        </div>

        {/* Detailed Breakdown Per Product */}
        <div className="space-y-4">
          <h3 className="font-subtitle text-xs font-bold uppercase text-[var(--preto)] tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-700" />
            Detalhamento por Produto Cadastrado ({aggregatedContracts.length})
          </h3>

          <div className="space-y-4">
            {aggregatedContracts.map(({ product, deliverables, activePatients, total3MonthMinutesPerPatient, monthlyMinsPerPatient, totalClinicMonthlyHours }, idx) => (
              <div
                key={product.id || idx}
                className="bg-white border-2 border-[var(--preto)] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4"
              >
                {/* Product Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200">
                  <div>
                    <span className="text-[0.65rem] font-subtitle font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 uppercase tracking-wider">
                      {product.format || 'Online'} • {product.durationLabel || '90 Dias'}
                    </span>
                    <h4 className="font-title text-lg text-[var(--preto)] font-bold mt-1">
                      {product.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-subtitle">
                    <div className="bg-neutral-100 px-3 py-1.5 border border-neutral-300">
                      <span className="text-[0.65rem] text-neutral-500 uppercase block">Pacientes Ativos</span>
                      <strong className="text-neutral-900 font-bold">{activePatients} paciente(s)</strong>
                    </div>
                    <div className="bg-emerald-50 px-3 py-1.5 border border-emerald-300">
                      <span className="text-[0.65rem] text-emerald-800 uppercase block">Impacto Mensal Clínica</span>
                      <strong className="text-emerald-900 font-bold font-mono">{totalClinicMonthlyHours} hrs/mês</strong>
                    </div>
                  </div>
                </div>

                {/* Deliverables List */}
                <div className="space-y-2">
                  <span className="text-[0.68rem] font-subtitle font-bold text-neutral-600 uppercase block">
                    Entregas Parametrizadas ({deliverables.length}):
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {deliverables.map((del, dIdx) => (
                      <div
                        key={del.id || dIdx}
                        className="p-2.5 bg-neutral-50 border border-neutral-300 text-xs font-subtitle flex justify-between items-center"
                      >
                        <div>
                          <strong className="text-neutral-900 block">{del.name}</strong>
                          <span className="text-[0.68rem] text-neutral-500 capitalize">
                            Frequência: {del.frequency.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-right font-mono text-[0.7rem] font-bold text-neutral-700">
                          {del.occurrencesIn3Months}x em 3 meses
                          <span className="block text-[0.65rem] font-normal text-neutral-500">
                            {del.minutesPerOccurrence} min/evento
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Summary Footer */}
                <div className="pt-2 border-t border-neutral-200 flex flex-col sm:flex-row justify-between sm:items-center text-xs font-subtitle text-neutral-700 gap-1 bg-neutral-50 p-2.5">
                  <span>
                    ⏱️ Total por paciente: <strong>{total3MonthMinutesPerPatient} min</strong> em 3 meses (≈{monthlyMinsPerPatient} min/mês)
                  </span>
                  <span className="font-bold text-emerald-800">
                    Calculado automaticamente a partir das entregas parametrizadas
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confirmation Checkbox & Action Button */}
        <div className="p-5 bg-neutral-50 border-2 border-[var(--preto)] space-y-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="confirmFixedConstraint"
              checked={isFixedConstraintConfirmed}
              onChange={(e) => setIsFixedConstraintConfirmed(e.target.checked)}
              className="w-5 h-5 mt-0.5 accent-[var(--exodo-red)] cursor-pointer"
            />
            <label htmlFor="confirmFixedConstraint" className="text-xs font-subtitle font-bold text-neutral-900 cursor-pointer leading-relaxed">
              Confirmo que as entregas e tempos parametrizados representam fielmente os contratos vigentes dos meus pacientes e autorizo o registro desta Restrição Fixa de {totalClinicDeliveryHoursOverall.toFixed(1)} hrs/mês no Navegador A3.
            </label>
          </div>

          <div className="flex justify-end pt-2 border-t border-neutral-200">
            <Button
              variant="primary"
              size="lg"
              onClick={handleConfirmAndComplete}
              className="py-3.5 px-6 text-xs uppercase font-bold tracking-wider flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Aprovar e Avançar para Diagnóstico de Capacidade</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
