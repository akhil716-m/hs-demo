import React from 'react';
import { Inbox } from 'lucide-react';
import StatusPill from './StatusPill';
import { getTone } from './simulationData';

const RetryRow = ({ item }) => {
  const { color } = getTone(item.tone);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 10px', borderRadius: 8,
      background: '#fff', border: `1px solid #eef0f3`,
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

const ExternalRetryPanel = ({ items, isActive, escalated, position }) => {
  const count = items.length;
  const borderColor = isActive ? '#F59E0B' : '#e5e7eb';
  const glow = isActive
    ? { boxShadow: '0 0 0 3px rgba(245,158,11,.2), 0 12px 28px -10px rgba(245,158,11,.3)' }
    : { boxShadow: '0 8px 20px -10px rgba(0,0,0,.1)' };

  return (
    <div style={{
      position: 'absolute', ...position,
      background: '#fafbfc', border: `2px solid ${borderColor}`,
      borderRadius: 14, padding: '14px 16px',
      transition: 'border-color 0.3s, box-shadow 0.3s', ...glow,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Inbox size={15} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#92400e', letterSpacing: '-0.01em' }}>
            External Retries
          </div>
          <div style={{ fontSize: '10.5px', color: '#B45309', marginTop: 1 }}>
            Initiated by Billing Engine
          </div>
        </div>
        <div style={{ fontSize: '10.5px', color: '#9099a8' }}>
          {count} {count === 1 ? 'attempt' : 'attempts'}
        </div>
      </div>

      {/* Retry rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {count === 0 ? (
          <div style={{ fontSize: '11px', color: '#c0c8d4', textAlign: 'center', padding: '12px 0', border: '1px dashed #e5e7eb', borderRadius: 8 }}>
            No retries yet
          </div>
        ) : (
          items.map((item, i) => <RetryRow key={i} item={item} />)
        )}
      </div>

      {/* Escalated badge */}
      {escalated && (
        <div style={{
          marginTop: 10, padding: '6px 10px', borderRadius: 7,
          background: '#EEF4FF', border: '1px solid #CCE0FF',
          fontSize: '11px', fontWeight: 600, color: '#0052CC', textAlign: 'center',
        }}>
          ↗ Escalated to Revenue Recovery
        </div>
      )}
    </div>
  );
};

export default ExternalRetryPanel;
