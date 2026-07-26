import React, { useState } from 'react';
import { Button, Tag } from './UIPrimitives';
import { BookingFormData } from '../types';
import { X, Calendar, Clock, CheckCircle2, Send, Building, User, Mail, Phone, Users } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onToast,
}) => {
  const [step, setStep] = useState<'form' | 'confirmed'>('form');
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    clinicName: '',
    patientVolume: '20-50 pacientes/mês',
    selectedDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    selectedTime: '10:00',
  });

  if (!isOpen) return null;

  const timeSlots = ['09:00', '10:30', '14:00', '15:30', '17:00'];

  // Generate next 5 business dates
  const availableDates: { value: string; label: string }[] = [];
  let d = new Date();
  while (availableDates.length < 5) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      const value = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
      availableDates.push({ value, label });
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.clinicName) {
      onToast('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    setStep('confirmed');
    onToast('Diagnóstico agendado com sucesso!');
  };

  const handleSendBookingWhatsapp = () => {
    const lines = [
      'Olá, Êxodo! Gostaria de confirmar meu agendamento do AE3:',
      `• Nome: ${formData.name}`,
      `• Clínica: ${formData.clinicName}`,
      `• E-mail: ${formData.email}`,
      `• Telefone: ${formData.phone}`,
      `• Volume estimado: ${formData.patientVolume}`,
      `• Data sugerida: ${formData.selectedDate} às ${formData.selectedTime}`,
    ];
    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const resetAndClose = () => {
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-[var(--branco)] border-2 border-[var(--border-strong)] w-full max-w-[620px] p-4 sm:p-6 md:p-8 relative shadow-2xl my-4 sm:my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-[var(--text-tertiary)] hover:text-[var(--preto)] bg-transparent border-none cursor-pointer p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Fechar"
        >
          <X className="w-6 h-6" />
        </button>

        {step === 'form' ? (
          <div>
            <div className="mb-6">
              <Tag tone="diagnostico" className="mb-2">
                Agendamento Individual
              </Tag>
              <h2 className="font-display text-2xl sm:text-3xl text-[var(--text-primary)] m-0">
                Agende o seu Diagnóstico Estratégico (AE3)
              </h2>
              <p className="font-body text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 m-0">
                Preencha os dados da sua clínica para selecionar o horário do 1º Encontro com o estrategista.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-subtitle font-bold text-xs uppercase text-[var(--text-primary)] block mb-1">
                    Seu Nome Completo *
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 absolute left-3 text-[var(--text-tertiary)]" />
                    <input
                      type="text"
                      required
                      placeholder="Dra. Maria Silva"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-[var(--branco)] border border-[var(--border-default)] font-body text-sm focus:border-[var(--preto)] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-subtitle font-bold text-xs uppercase text-[var(--text-primary)] block mb-1">
                    E-mail Profissional *
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 absolute left-3 text-[var(--text-tertiary)]" />
                    <input
                      type="email"
                      required
                      placeholder="maria@nutri.com.br"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-[var(--branco)] border border-[var(--border-default)] font-body text-sm focus:border-[var(--preto)] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Phone & Clinic Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-subtitle font-bold text-xs uppercase text-[var(--text-primary)] block mb-1">
                    WhatsApp *
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 absolute left-3 text-[var(--text-tertiary)]" />
                    <input
                      type="tel"
                      required
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-[var(--branco)] border border-[var(--border-default)] font-body text-sm focus:border-[var(--preto)] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-subtitle font-bold text-xs uppercase text-[var(--text-primary)] block mb-1">
                    Nome da Clínica *
                  </label>
                  <div className="relative flex items-center">
                    <Building className="w-4 h-4 absolute left-3 text-[var(--text-tertiary)]" />
                    <input
                      type="text"
                      required
                      placeholder="Clínica Nutri Saúde"
                      value={formData.clinicName}
                      onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-[var(--branco)] border border-[var(--border-default)] font-body text-sm focus:border-[var(--preto)] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Patient Volume */}
              <div>
                <label className="font-subtitle font-bold text-xs uppercase text-[var(--text-primary)] block mb-1">
                  Volume de Pacientes Atendidos por Mês
                </label>
                <div className="relative flex items-center">
                  <Users className="w-4 h-4 absolute left-3 text-[var(--text-tertiary)]" />
                  <select
                    value={formData.patientVolume}
                    onChange={(e) => setFormData({ ...formData, patientVolume: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-[var(--branco)] border border-[var(--border-default)] font-body text-sm focus:border-[var(--preto)] outline-none appearance-none cursor-pointer"
                  >
                    <option value="Até 20 pacientes/mês">Até 20 pacientes/mês</option>
                    <option value="20-50 pacientes/mês">20 a 50 pacientes/mês</option>
                    <option value="50-100 pacientes/mês">50 a 100 pacientes/mês</option>
                    <option value="Mais de 100 pacientes/mês">Mais de 100 pacientes/mês</option>
                  </select>
                </div>
              </div>

              {/* Date & Time Picker */}
              <div className="pt-2 border-t border-[var(--border-default)]">
                <span className="font-subtitle font-bold text-xs uppercase text-[var(--exodo-red)] block mb-2">
                  Escolha a data do 1º Encontro (Cenário Atual)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-subtitle font-bold text-[0.65rem] uppercase text-[var(--text-tertiary)] block mb-1">
                      Data Preferencial
                    </label>
                    <select
                      value={formData.selectedDate}
                      onChange={(e) => setFormData({ ...formData, selectedDate: e.target.value })}
                      className="w-full p-2.5 bg-[var(--branco)] border border-[var(--border-default)] font-body text-xs font-semibold focus:border-[var(--preto)] outline-none cursor-pointer"
                    >
                      {availableDates.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label} ({item.value})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-subtitle font-bold text-[0.65rem] uppercase text-[var(--text-tertiary)] block mb-1">
                      Horário (45 minutos)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {timeSlots.map((t) => {
                        const active = formData.selectedTime === t;
                        return (
                          <button
                            type="button"
                            key={t}
                            onClick={() => setFormData({ ...formData, selectedTime: t })}
                            className={`font-subtitle text-xs font-bold px-2.5 py-1.5 border cursor-pointer transition-colors ${
                              active
                                ? 'bg-[var(--preto)] text-[var(--branco)] border-[var(--preto)]'
                                : 'bg-[var(--branco)] text-[var(--text-primary)] border-[var(--border-default)] hover:border-[var(--preto)]'
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-[var(--border-default)]">
                <Button type="button" variant="tertiary" size="md" onClick={resetAndClose}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" size="md">
                  <span>Confirmar Agendamento</span>
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <CheckCircle2 className="w-16 h-16 text-[var(--exodo-red)]" />
            <h2 className="font-display text-3xl text-[var(--text-primary)] m-0">
              Agendamento Confirmado!
            </h2>
            <p className="font-body text-sm text-[var(--text-secondary)] max-w-[460px] m-0">
              Obrigado, <strong>{formData.name}</strong>. O 1º encontro de diagnóstico da <strong>{formData.clinicName}</strong> está pré-reservado.
            </p>

            <div className="bg-[var(--cinza-claro)] p-4 w-full text-left my-2 font-subtitle text-xs flex flex-col gap-1.5 border border-[var(--border-default)]">
              <div>
                <strong>Data e Horário:</strong> {formData.selectedDate} às {formData.selectedTime}
              </div>
              <div>
                <strong>E-mail de confirmação enviado para:</strong> {formData.email}
              </div>
              <div>
                <strong>WhatsApp de contato:</strong> {formData.phone}
              </div>
            </div>

            <p className="font-body text-xs text-[var(--text-tertiary)] m-0">
              Seu estrategista dedicado entrará em contato via WhatsApp para enviar o link do Google Meet e o formulário prévio de informações.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
              <Button variant="primary" size="md" onClick={handleSendBookingWhatsapp} className="w-full">
                <Send className="w-4 h-4 mr-1.5" />
                <span>Confirmar via WhatsApp</span>
              </Button>
              <Button variant="tertiary" size="md" onClick={resetAndClose} className="w-full">
                <span>Voltar ao site</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
