import React, { useEffect, useRef } from 'react';

const DOT = {
  listen:     '#4D90FF',
  idle:       '#5e6573',
  failed:     '#EF4444',
  success:    '#10B981',
  scheduled:  '#F59E0B',
  processing: '#4D90FF',
  recovered:  '#10B981',
};

const BADGE = {
  listen:     { bg: '#EEF4FF', color: '#0066FF' },
  idle:       { bg: '#f1f3f7', color: '#5e6573' },
  failed:     { bg: '#FEE2E2', color: '#DC2626' },
  success:    { bg: '#D1FAE5', color: '#059669' },
  scheduled:  { bg: '#FEF3C7', color: '#D97706' },
  processing: { bg: '#EEF4FF', color: '#0066FF' },
  recovered:  { bg: '#D1FAE5', color: '#059669' },
};

const LINE_LEFT = 20;

const LogRow = ({ entry, index, isLast }) => {
  const dot = DOT[entry.tone] || '#5e6573';
  const badge = BADGE[entry.tone] || BADGE.idle;
  const num = String(index + 1).padStart(2, '0');

  return (
    <div style={{ display: 'flex', position: 'relative', paddingLeft: LINE_LEFT + 16, paddingBottom: isLast ? 0 : 18 }}>
      {/* timeline line segment */}
      {!isLast && (
        <div style={{
          position: 'absolute',
          left: LINE_LEFT - 0.5,
          top: 10,
          bottom: 0,
          width: 1,
          background: '#e5e7eb',
        }} />
      )}
      {/* dot */}
      <div style={{
        position: 'absolute',
        left: LINE_LEFT - 4,
        top: 4,
        width: 9,
        height: 9,
        borderRadius: '50%',
        background: dot,
        boxShadow: `0 0 6px ${dot}88`,
        zIndex: 1,
      }} />

      {/* content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: '10px', color: '#9099a8', fontVariantNumeric: 'tabular-nums' }}>
            #{num}
          </span>
          <span style={{ fontSize: '10.5px', color: '#5e6573', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {entry.route}
          </span>
          <span style={{ fontSize: '10px', color: '#9099a8', whiteSpace: 'nowrap' }}>
            {entry.time}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '10.5px',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '4px',
            background: badge.bg,
            color: badge.color,
            whiteSpace: 'nowrap',
          }}>
            {entry.status}
          </span>
          <span style={{ fontSize: '10.5px', color: '#9099a8', overflowWrap: 'anywhere' }}>
            {entry.label}
          </span>
        </div>
      </div>
    </div>
  );
};

const MessageStream = ({ log, phase }) => {
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const headerDot = phase === 'running' ? '#4D90FF' : phase === 'done' ? '#10B981' : '#3a3f4a';
  const headerLabel = phase === 'running' ? 'LIVE' : phase === 'done' ? 'COMPLETE' : 'IDLE';
  const headerText = phase === 'running'
    ? 'REVENUE RECOVERY IS ATTEMPTING RETRIES'
    : phase === 'done'
    ? 'RETRIES COMPLETED'
    : 'AWAITING START';

  return (
    <div
      style={{
        flex: '0 0 30%',
        minWidth: 0,
        minHeight: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        borderLeft: '1px solid #e5e7eb',
      }}
    >
      {/* Section header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '14px 18px 12px',
        borderBottom: '1px solid #e5e7eb',
        flexShrink: 0,
      }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: headerDot,
          boxShadow: phase !== 'idle' ? `0 0 8px ${headerDot}66` : 'none',
          flexShrink: 0,
        }} />
        <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#1a1f36', letterSpacing: '0.07em', flex: 1 }}>
          {headerText}
        </span>
        <span style={{
          fontSize: '10px', fontWeight: 600,
          color: headerDot,
          background: `${headerDot}18`,
          padding: '2px 8px',
          borderRadius: '999px',
        }}>
          {headerLabel}
        </span>
      </div>

      {/* Scrollable log */}
      <div
        ref={logRef}
        style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', padding: '16px 14px 16px' }}
      >
        {log.length === 0 ? (
          <div style={{ fontSize: '11px', color: '#9099a8', textAlign: 'center', paddingTop: 28 }}>
            No events yet — press Start.
          </div>
        ) : (
          log.map((entry, i) => (
            <LogRow key={i} entry={entry} index={i} isLast={i === log.length - 1} />
          ))
        )}
      </div>
    </div>
  );
};

export default MessageStream;
