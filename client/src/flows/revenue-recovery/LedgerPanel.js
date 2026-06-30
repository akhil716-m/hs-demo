import React from 'react';
import { RefreshCw } from 'lucide-react';
import StatusPill from './StatusPill';
import { getTone } from './simulationData';

const RetryRow = ({ item }) => {
  const { color } = getTone(item.tone);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 10px', borderRadius: 8,
      background: '#f7faff', border: `1px solid #e6f0ff`,
      borderLeft: `3px solid ${color}`,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#1a1f36' }}>{item.label}</div>
        <div style={{ fontSize: '10.5px', color: '#9099a8', marginTop: 1 }}>{item.sub}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#1a1f36' }}>{item.amount}</div>
        <div style={{ marginTop: 3 }}><StatusPill tone={item.tone} text={item.status} size="small" /></div>
      </div>
    </div>
  );
};

const LedgerPanel = ({
  invoiceId, invoiceAmount, invoiceStatus, invoiceTone,
  internal, isActive, muted, declineType, position,
}) => {
  const count = internal.length;
  const borderColor = muted ? '#d1d5db' : isActive ? '#0066FF' : '#0066FF';
  const glow = muted
    ? { boxShadow: '0 4px 12px -6px rgba(0,0,0,.06)' }
    : isActive
    ? { boxShadow: '0 0 0 4px rgba(0,102,255,.2), 0 16px 34px -12px rgba(0,102,255,.4)' }
    : { boxShadow: '0 12px 28px -12px rgba(0,102,255,.28)' };

  return (
    <div style={{
      position: 'absolute', ...position,
      background: muted ? '#f3f4f6' : 'linear-gradient(165deg, #f5f9ff, #eaf2ff)',
      border: `2px solid ${borderColor}`,
      borderRadius: 14, padding: '14px 16px',
      transition: 'all 0.5s ease', opacity: muted ? 0.55 : 1,
      ...glow,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: muted ? '#9ca3af' : 'linear-gradient(135deg, #0066FF, #0052CC)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <RefreshCw size={15} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13.5px', fontWeight: 800, color: muted ? '#6b7280' : '#0a3a8c', letterSpacing: '-0.01em' }}>
            Revenue Recovery
          </div>
          <div style={{ fontSize: '10.5px', color: muted ? '#9ca3af' : '#0066FF', marginTop: 1 }}>
            {muted ? 'Awaiting handoff from merchant' : 'Hyperswitch internal retries'}
          </div>
        </div>
        {!muted && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#9099a8', letterSpacing: '0.03em' }}>Invoice {invoiceId}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginTop: 2 }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#1a1f36' }}>{invoiceAmount}</span>
              <StatusPill tone={invoiceTone} text={invoiceStatus} />
            </div>
          </div>
        )}
      </div>

      {/* Decline classification badge — appears after first internal attempt */}
      {!muted && declineType && (
        <div style={{ marginTop: 8 }}>
          <span style={{
            fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: 5,
            background: declineType === 'hard' ? '#FEE2E2' : declineType === 'expired' ? '#FFF7ED' : '#FEF3C7',
            color: declineType === 'hard' ? '#B91C1C' : declineType === 'expired' ? '#C2410C' : '#B45309',
            letterSpacing: '0.04em', textTransform: 'uppercase',
            border: `1px solid ${declineType === 'hard' ? '#FECACA' : declineType === 'expired' ? '#FED7AA' : '#FDE68A'}`,
          }}>
            {declineType === 'hard' ? '⛔ Hard Decline' : declineType === 'expired' ? '💳 Card Expired' : '⚠ Soft Decline'}
          </span>
        </div>
      )}

      {/* Retry rows */}
      {!muted && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ width: 7, height: 7, borderRadius: 2, background: '#0066FF', display: 'inline-block', marginRight: 6 }} />
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#0a3a8c', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Internal Retries
            </span>
            <span style={{ marginLeft: 'auto', fontSize: '10.5px', color: '#9099a8' }}>
              {count} {count === 1 ? 'attempt' : 'attempts'}
            </span>
          </div>
          {count === 0 ? (
            <div style={{ fontSize: '11px', color: '#c0c8d4', textAlign: 'center', padding: '12px 0', border: '1px dashed #d4e3fb', borderRadius: 8 }}>
              No retries scheduled yet
            </div>
          ) : (
            internal.map((item, i) => <RetryRow key={i} item={item} />)
          )}
        </div>
      )}

      {muted && (
        <div style={{ marginTop: 10, fontSize: '11px', color: '#9ca3af', textAlign: 'center', padding: '10px 0', border: '1px dashed #d1d5db', borderRadius: 8 }}>
          Activates after merchant retries are exhausted
        </div>
      )}
    </div>
  );
};

export default LedgerPanel;
