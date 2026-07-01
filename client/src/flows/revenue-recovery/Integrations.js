import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import OnboardingWizard from './onboarding/OnboardingWizard';
import SimulationView from './SimulationView';
import LandingPage from './LandingPage';

const Integrations = () => {
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [billingConfig, setBillingConfig] = useState(null);
  const [viewMode, setViewMode] = useState('landing');

  const handleComplete = (payment, billing) => {
    setPaymentConfig(payment);
    setBillingConfig(billing);
    setViewMode('simulation');
  };

  if (viewMode === 'landing') {
    return (
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <LandingPage onGetStarted={() => setViewMode('setup')} />
      </div>
    );
  }

  if (viewMode === 'setup') {
    return <OnboardingWizard onComplete={handleComplete} onBack={() => setViewMode('landing')} />;
  }

  return (
    <div className="flex flex-col min-h-0" style={{ flex: 1, minHeight: 0, padding: '24px 32px' }}>
      <div className="flex justify-start" style={{ flexShrink: 0, marginBottom: '16px' }}>
        <button
          onClick={() => setViewMode('setup')}
          className="flex items-center gap-1.5 font-medium"
          style={{
            fontSize: '12.5px',
            color: '#5e6573',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
          }}
        >
          <ArrowLeft size={16} /> Back to Setup
        </button>
      </div>

      <div className="min-h-0 flex flex-col" style={{ flex: 1 }}>
        <SimulationView paymentConfig={paymentConfig} billingConfig={billingConfig} />
      </div>
    </div>
  );
};

export default Integrations;
