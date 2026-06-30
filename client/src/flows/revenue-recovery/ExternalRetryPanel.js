import React from 'react';
import { RotateCcw } from 'lucide-react';
import StatusPill from './StatusPill';
import { getTone } from './simulationData';

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

const ExternalRetryPanel = ({ items, isActive, escalated, position }) => {
  const count = items.length;

  return (
    <div
      className={isActive ? 'canvas-node-active-amber' : ''}
      style={{
      position: 'absolute', ...position,
      background: '#ffffff',
      border: `1px solid ${isActive ? '#fde68a' : '#e5e7eb'}`,
      borderRadius: 12,
      padding: '14px 15px',
      boxShadow: isActive
        ? '0 0 0 3px rgba(245,158,11,.1), 0 8px 24px -8px rgba(245,158,11,.2)'
        : '0 1px 3px rgba(0,0,0,.05), 0 4px 12px rgba(0,0,0,.04)',
      transition: 'border-color 0.25s, box-shadow 0.25s',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: '#fffbeb',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <RotateCcw size={14} color="#d97706" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' }}>
            External Retries
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: 1 }}>
            Initiated by Billing Engine
          </div>
        </div>
        <span style={{
          fontSize: '10px', fontWeight: 600, color: '#6b7280',
          background: '#f3f4f6', border: '1px solid #e5e7eb',
          borderRadius: 6, padding: '2px 8px',
        }}>
          {count} {count === 1 ? 'attempt' : 'attempts'}
        </span>
      </div>

      {/* Divider */}
      <div style={{ margin: '10px 0', borderTop: '1px solid #f3f4f6' }} />

      {/* Retry rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {count === 0 ? (
          <div style={{
            fontSize: '11px', color: '#d1d5db', textAlign: 'center',
            padding: '14px 0', border: '1px dashed #e5e7eb', borderRadius: 8,
          }}>
            No retries yet
          </div>
        ) : (
          items.map((item, i) => <RetryRow key={i} item={item} />)
        )}
      </div>

      {/* Escalated badge */}
      {escalated && (
        <div style={{
          marginTop: 10, padding: '7px 10px', borderRadius: 8,
          background: '#f0f9ff', border: '1px solid #bae6fd',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ fontSize: '13px' }}>↗</span>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#0369a1' }}>
            Escalated to Revenue Recovery
          </span>
        </div>
      )}
    </div>
  );
};

export default ExternalRetryPanel;
