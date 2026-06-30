import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Inbox,
  Puzzle,
  Flag,
  HelpCircle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import WebhookField from '../WebhookField';

const BRAND = '#0066FF';
const BRAND_DARK = '#0052CC';
const BORDER = '#e5e7eb';
const TEXT = '#1a1f36';
const GRAY = '#5e6573';
const GRAY_LIGHT = '#9099a8';

const paymentConnectors = [
  { id: 'stripe', name: 'Stripe' },
  { id: 'adyen', name: 'Adyen' },
  { id: 'vantiv', name: 'Worldpay Vantiv' },
  { id: 'hyperswitch', name: 'Hyperswitch' },
];

const billingConnectors = [
  { id: 'chargebee', name: 'Chargebee', group: 'Billing Processors' },
  { id: 'recurly', name: 'Recurly', group: 'Billing Processors' },
  { id: 'stripe_billing', name: 'Stripe Billing', group: 'In house' },
  { id: 'custom_billing', name: 'Custom Billing', group: 'In house' },
];

const generateWebhookId = () => Math.random().toString(36).substring(2, 10);

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  background: '#fff',
  border: `1px solid ${BORDER}`,
  borderRadius: '9px',
  fontSize: '13px',
  color: TEXT,
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const focusRingStyle = {
  borderColor: BRAND,
  boxShadow: '0 0 0 3px rgba(0,102,255,.12)',
};

// ---------------------------------------------------------------------------
// Flat step model
// ---------------------------------------------------------------------------
const STEPS = [
  'payment-select',
  'payment-webhook',
  'billing-select',
  'billing-setup',
  'billing-retries',
  'review',
];

const GROUPS = [
  {
    key: 'processor',
    label: 'Connect Processor',
    icon: Inbox,
    steps: ['payment-select', 'payment-webhook'],
    subLabels: ['Select a Processor', 'Setup Webhook'],
  },
  {
    key: 'billing',
    label: 'Add Billing Processor',
    icon: Puzzle,
    steps: ['billing-select', 'billing-setup', 'billing-retries'],
    subLabels: ['Select Billing platform', 'Billing Processor Set-up', 'Configure Retries'],
  },
  {
    key: 'review',
    label: 'Review Details',
    icon: Flag,
    steps: ['review'],
    subLabels: [],
  },
];

// ---------------------------------------------------------------------------
// Field
// ---------------------------------------------------------------------------
const Field = ({ label, required, focusKey, focused, setFocused, suffix, ...inputProps }) => (
  <div>
    <label
      className="flex items-center gap-1 font-semibold"
      style={{ fontSize: '12.5px', color: TEXT, marginBottom: '6px' }}
    >
      {label}
      {required && <span style={{ color: '#e11d48' }}>*</span>}
    </label>
    <div style={{ position: 'relative' }}>
      <input
        {...inputProps}
        onFocus={() => setFocused(focusKey)}
        onBlur={() => setFocused(null)}
        style={{
          ...(focused === focusKey ? { ...inputStyle, ...focusRingStyle } : inputStyle),
          ...(suffix ? { paddingRight: '78px' } : {}),
        }}
      />
      {suffix && (
        <span
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '12px',
            color: GRAY_LIGHT,
            pointerEvents: 'none',
          }}
        >
          {suffix}
        </span>
      )}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Processor dropdown
// ---------------------------------------------------------------------------
const ProcessorDropdown = ({ connectors, value, onChange, placeholder, grouped }) => {
  const [open, setOpen] = useState(false);
  const selected = connectors.find((c) => c.id === value);

  const Avatar = ({ name }) => (
    <span
      className="flex items-center justify-center font-bold flex-shrink-0"
      style={{
        width: 22,
        height: 22,
        borderRadius: '6px',
        background: '#E6F0FF',
        color: BRAND,
        fontSize: '11px',
      }}
    >
      {name.charAt(0)}
    </span>
  );

  const renderItem = (c) => (
    <button
      key={c.id}
      type="button"
      onClick={() => {
        onChange(c.id);
        setOpen(false);
      }}
      className="flex items-center w-full text-left transition-colors hover:bg-gray-50"
      style={{ padding: '9px 12px', gap: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
    >
      <Avatar name={c.name} />
      <span style={{ fontSize: '13px', color: TEXT, flex: 1 }}>{c.name}</span>
      <span
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 16,
          height: 16,
          borderRadius: '999px',
          border: value === c.id ? `5px solid ${BRAND}` : `1.5px solid ${BORDER}`,
        }}
      />
    </button>
  );

  let body;
  if (grouped) {
    const groups = [...new Set(connectors.map((c) => c.group))];
    body = groups.map((g) => (
      <div key={g}>
        <div style={{ padding: '8px 12px 4px', fontSize: '11px', color: GRAY_LIGHT, fontWeight: 600 }}>{g}</div>
        {connectors.filter((c) => c.group === g).map(renderItem)}
      </div>
    ));
  } else {
    body = connectors.map(renderItem);
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center w-full text-left"
        style={{
          ...inputStyle,
          ...(open ? focusRingStyle : {}),
          padding: '10px 12px',
          gap: '10px',
          cursor: 'pointer',
        }}
      >
        {selected && <Avatar name={selected.name} />}
        <span style={{ flex: 1, color: selected ? TEXT : GRAY_LIGHT }}>
          {selected ? selected.name : placeholder}
        </span>
        <ChevronDown size={16} style={{ color: GRAY_LIGHT }} />
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: '#fff',
            border: `1px solid ${BORDER}`,
            borderRadius: '11px',
            boxShadow: '0 12px 28px -12px rgba(15,23,42,.22)',
            padding: '4px 0',
            zIndex: 20,
          }}
        >
          {body}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Left stepper rail
// ---------------------------------------------------------------------------
const RAIL = 46;

const Line = ({ side }) => (
  <span
    style={{
      position: 'absolute',
      left: '50%',
      width: 1,
      marginLeft: '-0.5px',
      background: BORDER,
      ...(side === 'top' ? { top: 0, height: '50%' } : { bottom: 0, height: '50%' }),
    }}
  />
);

const Stepper = ({ stepIndex, onGoToStep }) => {
  const currentKey = STEPS[stepIndex];

  // Flatten groups (+ active group's substeps) into one vertical timeline.
  const nodes = [];
  GROUPS.forEach((group) => {
    const lastStepIndex = Math.max(...group.steps.map((s) => STEPS.indexOf(s)));
    const isActive = group.steps.includes(currentKey);
    const isCompleted = lastStepIndex < stepIndex;
    nodes.push({ kind: 'group', group, isActive, isCompleted });
    if (isActive && group.subLabels.length > 0) {
      group.steps.forEach((stepKey, si) => {
        const idx = STEPS.indexOf(stepKey);
        nodes.push({
          kind: 'sub',
          label: group.subLabels[si],
          stepKey,
          active: idx === stepIndex,
          done: idx < stepIndex,
        });
      });
    }
  });

  return (
    <div style={{ width: 230, flexShrink: 0 }}>
      {nodes.map((node, i) => {
        const isFirst = i === 0;
        const isLast = i === nodes.length - 1;

        if (node.kind === 'group') {
          const { group, isActive, isCompleted } = node;
          const Icon = group.icon;
          return (
            <div
              key={`g-${group.key}`}
              className="flex items-stretch"
              onClick={isCompleted ? () => onGoToStep(group.steps[0]) : undefined}
              style={{ cursor: isCompleted ? 'pointer' : 'default' }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ width: RAIL, position: 'relative' }}
              >
                {!isFirst && <Line side="top" />}
                {!isLast && <Line side="bottom" />}
                <span
                  className="flex items-center justify-center"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '999px',
                    border: `1.5px solid ${BORDER}`,
                    background: '#fff',
                    color: isActive ? GRAY : GRAY_LIGHT,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {isCompleted ? <Check size={14} /> : <Icon size={14} />}
                </span>
              </div>
              <div className="flex items-center flex-1" style={{ paddingLeft: '14px', minHeight: 78 }}>
                <span
                  style={{
                    fontSize: '13.5px',
                    fontWeight: 600,
                    color: isActive ? TEXT : GRAY_LIGHT,
                    flex: 1,
                  }}
                >
                  {group.label}
                </span>
                {group.subLabels.length > 0 &&
                  (isActive ? (
                    <ChevronUp size={16} style={{ color: GRAY }} />
                  ) : (
                    <ChevronDown size={16} style={{ color: GRAY_LIGHT }} />
                  ))}
              </div>
            </div>
          );
        }

        // substep
        return (
          <div
            key={`s-${i}`}
            className="flex items-stretch"
            onClick={node.done ? () => onGoToStep(node.stepKey) : undefined}
            style={{ cursor: node.done ? 'pointer' : 'default' }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: RAIL, position: 'relative' }}
            >
              {!isFirst && <Line side="top" />}
              {!isLast && <Line side="bottom" />}
              {node.active ? (
                <span
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '999px',
                    background: '#DCE8FF',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <span style={{ width: 10, height: 10, borderRadius: '999px', background: BRAND }} />
                </span>
              ) : node.done ? (
                <span
                  className="flex-shrink-0"
                  style={{ width: 11, height: 11, borderRadius: '999px', background: BORDER, position: 'relative', zIndex: 1 }}
                />
              ) : (
                <span
                  className="flex-shrink-0"
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: '999px',
                    background: '#fff',
                    border: `1.5px solid ${BORDER}`,
                    position: 'relative',
                    zIndex: 1,
                  }}
                />
              )}
            </div>
            <div className="flex items-center flex-1" style={{ paddingLeft: '14px', minHeight: 42 }}>
              <span
                style={{
                  fontSize: '11.5px',
                  fontWeight: node.active ? 600 : 500,
                  color: node.active ? BRAND : GRAY_LIGHT,
                }}
              >
                {node.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Primary / content building blocks
// ---------------------------------------------------------------------------
const PrimaryButton = ({ children, disabled, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="w-full font-semibold text-white"
    style={{
      fontSize: '13.5px',
      padding: '12px 18px',
      borderRadius: '10px',
      border: 'none',
      background: disabled ? 'rgba(0,102,255,.45)' : BRAND,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background 0.2s',
    }}
  >
    {children}
  </button>
);

const ContentHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: '24px' }}>
    <h2 style={{ fontSize: '20px', fontWeight: 700, color: TEXT, letterSpacing: '-0.01em' }}>{title}</h2>
    <p style={{ fontSize: '13.5px', color: GRAY, marginTop: '6px' }}>{subtitle}</p>
  </div>
);

const InfoBox = ({ children }) => (
  <div
    className="flex items-start gap-2.5"
    style={{ background: '#E6F0FF', border: '1px solid #CCE0FF', borderRadius: '11px', padding: '13px 15px' }}
  >
    <Info size={16} className="flex-shrink-0" style={{ color: BRAND, marginTop: '1px' }} />
    <p style={{ fontSize: '12.5px', color: BRAND_DARK, lineHeight: 1.5 }}>{children}</p>
  </div>
);

const SelectLabel = ({ children }) => (
  <label className="flex items-center gap-1.5" style={{ fontSize: '12.5px', fontWeight: 600, color: TEXT, marginBottom: '8px' }}>
    {children}
    <span style={{ color: '#e11d48' }}>*</span>
    <HelpCircle size={13} style={{ color: GRAY_LIGHT }} />
  </label>
);

// ---------------------------------------------------------------------------
// Wizard
// ---------------------------------------------------------------------------
const OnboardingWizard = ({ onComplete }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [focused, setFocused] = useState(null);

  const [paymentProcessor, setPaymentProcessor] = useState('');
  const [paymentForm, setPaymentForm] = useState({
    apiKey: 'sk_live_demo_a1b2c3',
    sourceVerificationKey: 'whsec_demo_x7y8z9',
    label: '',
  });
  const [paymentWebhook, setPaymentWebhook] = useState('');
  const [paymentConnected, setPaymentConnected] = useState(false);

  const [billingProcessor, setBillingProcessor] = useState('');
  const [billingForm, setBillingForm] = useState({
    apiKey: 'sk_live_bill_d4e5f6',
    sourceVerificationKey: 'whsec_bill_u1v2w3',
    label: '',
  });
  const [billingWebhook, setBillingWebhook] = useState('');
  const [billingConnected, setBillingConnected] = useState(false);
  const [retry, setRetry] = useState({ startAfter: '03', maxAttempts: '15' });

  const step = STEPS[stepIndex];
  const next = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const back = () => setStepIndex((i) => Math.max(i - 1, 0));

  const paymentName = paymentConnectors.find((c) => c.id === paymentProcessor)?.name || '';
  const billingName = billingConnectors.find((c) => c.id === billingProcessor)?.name || '';

  const handlePaymentSelect = (id) => {
    setPaymentProcessor(id);
    setPaymentForm((f) => ({ ...f, label: `Production ${paymentConnectors.find((c) => c.id === id)?.name || ''}` }));
  };
  const handleBillingSelect = (id) => {
    setBillingProcessor(id);
    setBillingForm((f) => ({ ...f, label: `Production ${billingConnectors.find((c) => c.id === id)?.name || ''}` }));
  };

  const connectPayment = () => {
    setPaymentWebhook((w) => w || `https://rr.hyperswitch.io/webhooks/payments/${generateWebhookId()}`);
    setPaymentConnected(true);
  };
  const connectBilling = () => {
    setBillingWebhook((w) => w || `https://rr.hyperswitch.io/webhooks/billing/${generateWebhookId()}`);
    setBillingConnected(true);
  };

  const finish = () => {
    onComplete(
      {
        processor: paymentProcessor,
        apiKey: paymentForm.apiKey,
        sourceVerificationKey: paymentForm.sourceVerificationKey,
        label: paymentForm.label,
        webhookUrl: paymentWebhook,
      },
      {
        processor: billingProcessor,
        apiKey: billingForm.apiKey,
        sourceVerificationKey: billingForm.sourceVerificationKey,
        label: billingForm.label,
        webhookUrl: billingWebhook,
        retry,
      }
    );
  };

  const renderContent = () => {
    switch (step) {
      case 'payment-select':
        return (
          <>
            <ContentHeader
              title="Connect your payment processor"
              subtitle="Start by selecting one processor. You can add more later."
            />
            <div style={{ marginBottom: '24px' }}>
              <SelectLabel>Select a processor</SelectLabel>
              <ProcessorDropdown
                connectors={paymentConnectors}
                value={paymentProcessor}
                onChange={handlePaymentSelect}
                placeholder="Select Processor"
              />
            </div>
            <PrimaryButton disabled={!paymentProcessor} onClick={next}>
              Continue
            </PrimaryButton>
          </>
        );

      case 'payment-webhook':
        return (
          <>
            <ContentHeader
              title="Connect your payment processor"
              subtitle="Choose a processor to begin. You can connect others later if needed."
            />
            {!paymentConnected ? (
              <>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: TEXT, marginBottom: '16px' }}>
                  Enter credentials to connect your processor
                </h3>
                <div className="space-y-4" style={{ marginBottom: '24px' }}>
                  <Field
                    label="API Key"
                    required
                    type="password"
                    focusKey="p-apiKey"
                    focused={focused}
                    setFocused={setFocused}
                    value={paymentForm.apiKey}
                    onChange={(e) => setPaymentForm((f) => ({ ...f, apiKey: e.target.value }))}
                    placeholder="sk_live_..."
                  />
                  <Field
                    label="Source Verification Key"
                    required
                    type="password"
                    focusKey="p-svk"
                    focused={focused}
                    setFocused={setFocused}
                    value={paymentForm.sourceVerificationKey}
                    onChange={(e) => setPaymentForm((f) => ({ ...f, sourceVerificationKey: e.target.value }))}
                    placeholder="whsec_..."
                  />
                  <Field
                    label="Connector label"
                    required
                    type="text"
                    focusKey="p-label"
                    focused={focused}
                    setFocused={setFocused}
                    value={paymentForm.label}
                    onChange={(e) => setPaymentForm((f) => ({ ...f, label: e.target.value }))}
                    placeholder="Production Stripe"
                  />
                </div>
                <PrimaryButton
                  disabled={!paymentForm.apiKey || !paymentForm.sourceVerificationKey || !paymentForm.label}
                  onClick={connectPayment}
                >
                  Connect
                </PrimaryButton>
              </>
            ) : (
              <>
                <div className="space-y-3" style={{ marginBottom: '24px' }}>
                  <WebhookField url={paymentWebhook} label="Payment Processor Webhook URL" />
                  <InfoBox>
                    Configure this webhook URL in your payment processor's dashboard to receive payment events (e.g.
                    payment.failed, payment.succeeded).
                  </InfoBox>
                </div>
                <PrimaryButton onClick={next}>Continue</PrimaryButton>
              </>
            )}
          </>
        );

      case 'billing-select':
        return (
          <>
            <ContentHeader
              title="Choose your Billing Platform"
              subtitle="Choose one processor for now. You can connect more processors later."
            />
            <div style={{ marginBottom: '24px' }}>
              <SelectLabel>Select Billing Processor</SelectLabel>
              <ProcessorDropdown
                connectors={billingConnectors}
                value={billingProcessor}
                onChange={handleBillingSelect}
                placeholder="Select Processor"
                grouped
              />
            </div>
            <PrimaryButton disabled={!billingProcessor} onClick={next}>
              Next
            </PrimaryButton>
          </>
        );

      case 'billing-setup':
        return (
          <>
            <ContentHeader
              title="Choose your Billing Platform"
              subtitle="Choose one processor for now. You can connect more processors later."
            />
            {!billingConnected ? (
              <>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: TEXT, marginBottom: '16px' }}>
                  Enter credentials to connect your processor
                </h3>
                <div className="space-y-4" style={{ marginBottom: '24px' }}>
                  <Field
                    label={`${billingName || 'Billing'} API Key`}
                    required
                    type="password"
                    focusKey="b-apiKey"
                    focused={focused}
                    setFocused={setFocused}
                    value={billingForm.apiKey}
                    onChange={(e) => setBillingForm((f) => ({ ...f, apiKey: e.target.value }))}
                    placeholder="sk_live_..."
                  />
                  <Field
                    label="Source Verification Key"
                    required
                    type="password"
                    focusKey="b-svk"
                    focused={focused}
                    setFocused={setFocused}
                    value={billingForm.sourceVerificationKey}
                    onChange={(e) => setBillingForm((f) => ({ ...f, sourceVerificationKey: e.target.value }))}
                    placeholder="whsec_..."
                  />
                  <Field
                    label="Connector Label"
                    required
                    type="text"
                    focusKey="b-label"
                    focused={focused}
                    setFocused={setFocused}
                    value={billingForm.label}
                    onChange={(e) => setBillingForm((f) => ({ ...f, label: e.target.value }))}
                    placeholder="Production Chargebee"
                  />
                </div>
                <PrimaryButton
                  disabled={!billingForm.apiKey || !billingForm.sourceVerificationKey || !billingForm.label}
                  onClick={connectBilling}
                >
                  Connect
                </PrimaryButton>
              </>
            ) : (
              <>
                <div className="space-y-3" style={{ marginBottom: '24px' }}>
                  <WebhookField url={billingWebhook} label="Billing Processor Webhook URL" />
                  <InfoBox>
                    Configure this webhook URL in your billing processor to receive invoice events (e.g.
                    invoice.generated, payment.triggered).
                  </InfoBox>
                </div>
                <PrimaryButton onClick={next}>Continue</PrimaryButton>
              </>
            )}
          </>
        );

      case 'billing-retries':
        return (
          <>
            <ContentHeader
              title="Configure Retry Logic"
              subtitle="Set how and when you'd like retries to be attempted. You can modify this later."
            />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: TEXT, marginBottom: '16px' }}>Retry Settings</h3>
            <div style={{ marginBottom: '24px' }} className="space-y-4">
              <div>
                <Field
                  label="Start Retry After"
                  required
                  type="text"
                  suffix="Attempts"
                  focusKey="r-start"
                  focused={focused}
                  setFocused={setFocused}
                  value={retry.startAfter}
                  onChange={(e) => setRetry((r) => ({ ...r, startAfter: e.target.value }))}
                />
                <p style={{ fontSize: '11.5px', color: GRAY_LIGHT, marginTop: '6px' }}>
                  Number of failed attempts by the billing processor before retries triggered
                </p>
              </div>
              <div>
                <Field
                  label="Max Retry Attempts"
                  required
                  type="text"
                  suffix="Attempts"
                  focusKey="r-max"
                  focused={focused}
                  setFocused={setFocused}
                  value={retry.maxAttempts}
                  onChange={(e) => setRetry((r) => ({ ...r, maxAttempts: e.target.value }))}
                />
                <p style={{ fontSize: '11.5px', color: GRAY_LIGHT, marginTop: '6px' }}>
                  Maximum number of retry attempts allowed per invoice.
                </p>
              </div>
            </div>
            <PrimaryButton onClick={next}>Next</PrimaryButton>
          </>
        );

      case 'review':
        return (
          <>
            <ContentHeader
              title="Connection Successful"
              subtitle="Explore all the Revenue Recovery metrics in the dashboard."
            />
            <div className="space-y-3" style={{ marginBottom: '28px' }}>
              {[
                { icon: Puzzle, label: `Billing platform connection successful` },
                { icon: Inbox, label: `Payment processor connection successful` },
              ].map((row, i) => {
                const RowIcon = row.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center"
                    style={{
                      gap: '14px',
                      padding: '16px 18px',
                      border: `1px solid ${BORDER}`,
                      borderRadius: '12px',
                      background: '#fff',
                    }}
                  >
                    <span
                      className="flex items-center justify-center flex-shrink-0"
                      style={{ width: 34, height: 34, borderRadius: '9px', background: '#f1f3f7', color: GRAY }}
                    >
                      <RowIcon size={17} />
                    </span>
                    <span style={{ flex: 1, fontSize: '13.5px', fontWeight: 500, color: TEXT }}>{row.label}</span>
                    <span className="flex items-center gap-1.5 font-semibold" style={{ fontSize: '12.5px', color: '#047857' }}>
                      <CheckCircle2 size={16} /> Completed
                    </span>
                  </div>
                );
              })}
            </div>
            <PrimaryButton onClick={finish}>Start exploring</PrimaryButton>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full" style={{ flex: 1, minHeight: 0 }}>
      {/* Top bar */}
      <div className="flex items-center" style={{ gap: '12px', marginBottom: '24px', paddingTop: '24px' }}>
        <button
          type="button"
          onClick={back}
          disabled={stepIndex === 0}
          className="flex items-center justify-center"
          style={{
            width: 30,
            height: 30,
            borderRadius: '8px',
            border: 'none',
            background: 'none',
            color: stepIndex === 0 ? GRAY_LIGHT : TEXT,
            cursor: stepIndex === 0 ? 'default' : 'pointer',
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <span style={{ fontSize: '16px', fontWeight: 700, color: TEXT }}>Revenue Recovery</span>
      </div>

      {/* Body: stepper | divider | content */}
      <div className="flex" style={{ gap: '0', flex: 1, minHeight: 0 }}>
        <Stepper stepIndex={stepIndex} onGoToStep={(key) => setStepIndex(STEPS.indexOf(key))} />
        <div style={{ width: 1, background: BORDER, margin: '0 36px', alignSelf: 'stretch' }} />
        <div style={{ flex: 1, maxWidth: 560 }}>{renderContent()}</div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
