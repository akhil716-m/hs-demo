import React from 'react';
import { FileText, CreditCard } from 'lucide-react';
import StatusPill from './StatusPill';

const ICON_THEME = {
  billing: { bg: '#F0EDFF', color: '#6941C6' },
  payment: { bg: '#EFF6FF', color: '#2563EB' },
};

const ComponentCard = ({ title, provider, iconType, status, tone, isActive, position, invoiceDetails }) => {
  const Icon = iconType === 'billing' ? FileText : CreditCard;
  const theme = ICON_THEME[iconType] || ICON_THEME.payment;

  return (
    <div style={{
      position: 'absolute',
      ...position,
      background: '#ffffff',
      border: `1px solid ${isActive ? '#c7d7fe' : '#e5e7eb'}`,
      borderRadius: 12,
      padding: '14px 15px',
      boxShadow: isActive
        ? '0 0 0 3px rgba(99,102,241,.12), 0 8px 24px -8px rgba(99,102,241,.25)'
        : '0 1px 3px rgba(0,0,0,.05), 0 4px 12px rgba(0,0,0,.04)',
      transition: 'border-color 0.25s, box-shadow 0.25s',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: theme.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={15} color={theme.color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' }}>
            {title}
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: 1 }}>{provider}</div>
        </div>
        <div style={{ flexShrink: 0 }}>
          <StatusPill tone={tone} text={status} size="small" />
        </div>
      </div>

      {/* Invoice details */}
      {invoiceDetails && (
        <div style={{ marginTop: 12, borderTop: '1px solid #f3f4f6', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {/* Invoice ID + amount */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', color: '#9ca3af', fontFamily: 'monospace', letterSpacing: '0.02em' }}>
              {invoiceDetails.id}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>{invoiceDetails.amount}</span>
          </div>

          {/* Card rows */}
          {(invoiceDetails.cards || []).map((card, i) => {
            const isCardActive = i === (invoiceDetails.activeCard ?? 0);
            const showExpired = card.expired && card.expiredRevealed;
            const netBg = card.network === 'MC'
              ? 'linear-gradient(135deg, #c0392b, #e67e22)'
              : 'linear-gradient(135deg, #1e3a8a, #2563EB)';
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 8px', borderRadius: 7,
                background: isCardActive ? '#f8faff' : '#f9fafb',
                border: `1px solid ${isCardActive ? '#dbeafe' : '#f3f4f6'}`,
                opacity: isCardActive ? 1 : 0.6,
                transition: 'all 0.35s ease',
              }}>
                <div style={{
                  width: 26, height: 16, borderRadius: 3, background: netBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ fontSize: '6.5px', fontWeight: 900, color: '#fff', letterSpacing: '0.2px' }}>
                    {card.network}
                  </span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#374151', fontFamily: 'monospace' }}>
                  ···· {card.last4}
                </span>
                <span style={{ fontSize: '10px', color: '#9ca3af' }}>
                  {card.expiry}
                </span>
                <span style={{
                  marginLeft: 'auto', fontSize: '9px', fontWeight: 700, padding: '2px 6px',
                  borderRadius: 4, letterSpacing: '0.04em', textTransform: 'uppercase',
                  background: showExpired ? '#fef2f2' : isCardActive ? '#eff6ff' : '#f3f4f6',
                  color: showExpired ? '#dc2626' : isCardActive ? '#2563EB' : '#9ca3af',
                  border: `1px solid ${showExpired ? '#fecaca' : isCardActive ? '#bfdbfe' : '#e5e7eb'}`,
                }}>
                  {showExpired ? 'Expired' : isCardActive ? 'Active' : 'Backup'}
                </span>
              </div>
            );
          })}

          {/* Account + email */}
          {invoiceDetails.cards?.[0]?.account && (
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 2 }}>
              <span style={{ fontSize: '10px', color: '#9ca3af' }}>{invoiceDetails.cards[0].account}</span>
              <span style={{ fontSize: '10px', color: '#9ca3af' }}>{invoiceDetails.cards[0].email}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComponentCard;
