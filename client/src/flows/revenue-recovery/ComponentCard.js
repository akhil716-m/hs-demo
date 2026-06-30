import React from 'react';
import { FileText, CreditCard } from 'lucide-react';
import StatusPill from './StatusPill';

const ComponentCard = ({ title, provider, iconType, status, tone, isActive, position, invoiceDetails }) => {
  const Icon = iconType === 'billing' ? FileText : CreditCard;

  const baseStyle = {
    position: 'absolute',
    ...position,
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '13px',
    padding: '13px 15px',
    transition: 'box-shadow 0.3s ease',
  };

  const glowStyle = isActive
    ? { boxShadow: `0 0 0 3px rgba(94,101,115,.2), 0 10px 24px -8px rgba(94,101,115,.4)` }
    : { boxShadow: '0 6px 18px -10px rgba(15,23,42,.18)' };

  return (
    <div style={{ ...baseStyle, ...glowStyle }} className="dark:!bg-gray-800 dark:!border-gray-700">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center rounded-lg" style={{ width: 30, height: 30, background: '#eef1f6' }}>
          <Icon size={16} className="text-gray-500 dark:text-gray-400" />
        </div>
        <div>
          <div className="text-sm font-bold text-gray-900 dark:text-white" style={{ fontSize: '14px' }}>{title}</div>
          <div className="text-gray-400 dark:text-gray-500" style={{ fontSize: '11px' }}>{provider}</div>
        </div>
      </div>
      <div style={{ marginTop: '11px' }}>
        <StatusPill tone={tone} text={status} />
      </div>

      {invoiceDetails && (
        <div style={{ marginTop: '10px', borderTop: '1px solid #f0f2f5', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* Invoice ID + amount */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', color: '#9099a8' }}>{invoiceDetails.id}</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#1a1f36' }}>{invoiceDetails.amount}</span>
          </div>
          {/* Cards */}
          {(invoiceDetails.cards || []).map((card, i) => {
            const isActive = i === (invoiceDetails.activeCard ?? 0);
            const netBg = card.network === 'MC'
              ? 'linear-gradient(135deg, #c0392b, #e67e22)'
              : 'linear-gradient(135deg, #1a1f8c, #3b5bdb)';
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 7px', borderRadius: 6,
                background: isActive ? '#f0f6ff' : '#f7f8fa',
                border: `1px solid ${isActive ? '#c5d9f8' : '#e5e7eb'}`,
                opacity: isActive ? 1 : 0.55,
                transition: 'all 0.4s ease',
              }}>
                <div style={{
                  width: 24, height: 15, borderRadius: 2, background: netBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ fontSize: '6px', fontWeight: 900, color: '#fff', letterSpacing: '0.3px' }}>{card.network}</span>
                </div>
                <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#1a1f36' }}>•••• {card.last4}</span>
                <span style={{ fontSize: '10px', color: '#9099a8' }}>Exp {card.expiry}</span>
                <span style={{
                  marginLeft: 'auto', fontSize: '9px', fontWeight: 700, padding: '1px 6px',
                  borderRadius: 4, letterSpacing: '0.04em',
                  background: (card.expired && card.expiredRevealed) ? '#FEE2E2' : isActive ? '#0066FF' : '#e5e7eb',
                  color: (card.expired && card.expiredRevealed) ? '#B91C1C' : isActive ? '#fff' : '#9099a8',
                }}>
                  {(card.expired && card.expiredRevealed) ? 'EXPIRED' : isActive ? 'ACTIVE' : 'BACKUP'}
                </span>
              </div>
            );
          })}
          {/* Account + email (from first card) */}
          {invoiceDetails.cards?.[0]?.account && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10px', color: '#9099a8' }}>{invoiceDetails.cards[0].account}</span>
              <span style={{ fontSize: '10px', color: '#9099a8' }}>{invoiceDetails.cards[0].email}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComponentCard;
