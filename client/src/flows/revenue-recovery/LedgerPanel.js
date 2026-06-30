import React from 'react';
import { RefreshCw } from 'lucide-react';
import StatusPill from './StatusPill';
import { getTone } from './simulationData';

const DECLINE_BADGE = {
  hard:    { bg: '#fef2f2', color: '#dc2626', border: '#fecaca', label: '⛔ Hard Decline' },
  expired: { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa', label: '💳 Card Expired' },
  soft:    { bg: '#fefce8', color: '#a16207', border: '#fde68a', label: '⚠ Soft Decline' },
};

const RetryRow = ({ item }) => {
  const { color } = getTone(item.tone);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '7px 10px', borderRadius: 8,
      background: '#fafafa',
      border: '1px solid #f0f0f0',
      borderLeft: `3px solid ${color}`,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#111827' }}>{item.label}</div>
        <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: 1 }}>{item.sub}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#111827' }}>{item.amount}</div>
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
  const badge = declineType ? DECLINE_BADGE[declineType] : null;

  return (
    <div
      className={(!muted && isActive) ? 'canvas-node-active' : ''}
      style={{
      position: 'absolute', ...position,
      background: muted ? '#fafafa' : '#ffffff',
      border: `1px solid ${muted ? '#e5e7eb' : isActive ? '#bfdbfe' : '#e5e7eb'}`,
      borderRadius: 12,
      padding: '14px 15px',
      transition: 'all 0.4s ease',
      opacity: muted ? 0.55 : 1,
      boxShadow: muted
        ? 'none'
        : isActive
        ? '0 0 0 3px rgba(37,99,235,.1), 0 8px 24px -8px rgba(37,99,235,.2)'
        : '0 1px 3px rgba(0,0,0,.05), 0 4px 12px rgba(0,0,0,.04)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: muted ? '#f3f4f6' : '#eff6ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <RefreshCw size={14} color={muted ? '#9ca3af' : '#2563EB'} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: muted ? '#9ca3af' : '#111827', letterSpacing: '-0.01em' }}>
            Revenue Recovery
          </div>
          <div style={{ fontSize: '11px', color: muted ? '#d1d5db' : '#6b7280', marginTop: 1 }}>
            {muted ? 'Awaiting handoff from merchant' : 'Hyperswitch internal retries'}
          </div>
        </div>
        {!muted && (
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: 3 }}>
              {invoiceId}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#111827' }}>{invoiceAmount}</span>
              <StatusPill tone={invoiceTone} text={invoiceStatus} size="small" />
            </div>
          </div>
        )}
      </div>

      {/* Decline classification badge */}
      {!muted && badge && (
        <div style={{ marginTop: 10 }}>
          <span style={{
            display: 'inline-block',
            fontSize: '10px', fontWeight: 700,
            padding: '3px 10px', borderRadius: 6,
            background: badge.bg, color: badge.color,
            border: `1px solid ${badge.border}`,
            letterSpacing: '0.03em',
          }}>
            {badge.label}
          </span>
        </div>
      )}

      {/* Divider + retry section */}
      {!muted && (
        <>
          <div style={{ margin: '10px 0', borderTop: '1px solid #f3f4f6' }} />
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <span style={{
              fontSize: '10px', fontWeight: 700, color: '#6b7280',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              Internal Retries
            </span>
            <span style={{
              marginLeft: 'auto', fontSize: '10px', fontWeight: 600, color: '#9ca3af',
              background: '#f3f4f6', border: '1px solid #e5e7eb',
              borderRadius: 6, padding: '2px 8px',
            }}>
              {count} {count === 1 ? 'attempt' : 'attempts'}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {count === 0 ? (
              <div style={{
                fontSize: '11px', color: '#d1d5db', textAlign: 'center',
                padding: '14px 0', border: '1px dashed #e5e7eb', borderRadius: 8,
              }}>
                No retries scheduled yet
              </div>
            ) : (
              internal.map((item, i) => <RetryRow key={i} item={item} />)
            )}
          </div>
        </>
      )}

      {muted && (
        <div style={{
          marginTop: 12, fontSize: '11px', color: '#d1d5db',
          textAlign: 'center', padding: '12px 0',
          border: '1px dashed #e5e7eb', borderRadius: 8,
        }}>
          Activates after merchant retries are exhausted
        </div>
      )}
    </div>
  );
};

export default LedgerPanel;
