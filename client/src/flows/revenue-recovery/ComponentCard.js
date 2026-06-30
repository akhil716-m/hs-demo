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
        <div style={{ marginTop: '10px', borderTop: '1px solid #f0f2f5', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {/* Invoice row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', color: '#9099a8' }}>{invoiceDetails.id}</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#1a1f36' }}>{invoiceDetails.amount}</span>
          </div>
          {/* Card row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{
              width: 24, height: 15, borderRadius: 2,
              background: 'linear-gradient(135deg, #1a1f8c, #3b5bdb)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ fontSize: '6px', fontWeight: 900, color: '#fff', letterSpacing: '0.3px' }}>VISA</span>
            </div>
            <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#1a1f36' }}>•••• 4242</span>
            <span style={{ fontSize: '10px', color: '#9099a8', marginLeft: 'auto' }}>Exp 12/26</span>
          </div>
          {/* Account + email */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10px', color: '#9099a8' }}>cus_Np8x42</span>
            <span style={{ fontSize: '10px', color: '#9099a8' }}>john.doe@acme.io</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentCard;
