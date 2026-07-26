import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ContextSection } from './components/ContextSection';
import { ProgramStructure } from './components/ProgramStructure';
import { Phase1DeepDive } from './components/Phase1DeepDive';
import { Phase2DeepDive } from './components/Phase2DeepDive';
import { BrandBanner } from './components/BrandBanner';
import { PricingSection } from './components/PricingSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { PrintReportView } from './components/PrintReportView';
import { A3System } from './components/A3System';
import { Toast } from './components/Toast';
import { ViewMode } from './types';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleOpenBooking = () => {
    setBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setBookingOpen(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const scrollToElement = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--branco)] text-[var(--text-primary)] font-body selection:bg-[var(--accent-tint)] selection:text-[var(--exodo-red)]">
      {/* Header Bar - Render sales site Header ONLY on landing page */}
      {viewMode === 'landing' && (
        <Header
          onOpenBooking={handleOpenBooking}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
        />
      )}

      {viewMode === 'a3-app' ? (
        /* Strategic Decision Support System A3 */
        <A3System
          onBackToLanding={() => setViewMode('landing')}
          onToast={showToast}
        />
      ) : viewMode === 'print-report' ? (
        /* Printable PDF / A4 Executive Report View */
        <PrintReportView
          onBackToLanding={() => setViewMode('landing')}
          onToast={showToast}
        />
      ) : (
        /* Main Interactive Web Page Clone */
        <main>
          {/* Hero Banner */}
          <Hero
            onOpenBooking={handleOpenBooking}
            onScrollToContent={() => scrollToElement('contexto')}
          />

          {/* Context Section */}
          <ContextSection />

          {/* Program Overview */}
          <ProgramStructure
            onGoToPhase1={() => scrollToElement('fase1')}
            onGoToPhase2={() => scrollToElement('fase2')}
          />

          {/* Phase 1 Deep Dive */}
          <Phase1DeepDive />

          {/* Phase 2 Deep Dive */}
          <Phase2DeepDive />

          {/* Quote & Brand Section */}
          <BrandBanner />

          {/* Pricing & Interactive Simulator */}
          <PricingSection
            onOpenBooking={handleOpenBooking}
            onToast={showToast}
          />

          {/* FAQ Accordion */}
          <FaqSection />

          {/* Footer & Final Callout */}
          <Footer
            onOpenBooking={handleOpenBooking}
            onToggleViewMode={setViewMode}
            viewMode={viewMode}
          />
        </main>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={handleCloseBooking}
        onToast={showToast}
      />

      {/* Toast Feedback */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}

