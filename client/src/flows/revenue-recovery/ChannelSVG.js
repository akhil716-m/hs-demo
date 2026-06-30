import React, { forwardRef } from 'react';
import { CHANNELS, PORTS } from './simulationData';

const ChannelSVG = forwardRef(({ pathRefs, mutedChannels = [] }, _ref) => {
  const muted = new Set(mutedChannels);
  return (
    <svg
      width="1080"
      height="640"
      viewBox="0 0 1080 640"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      {/* Base pipes */}
      {Object.entries(CHANNELS).map(([id, d]) => {
        const isMuted = muted.has(id);
        return (
          <path
            key={`base-${id}`}
            d={d}
            fill="none"
            stroke={isMuted ? '#dde1e7' : '#d0d4dc'}
            strokeWidth={2}
            strokeLinecap="square"
            strokeDasharray={isMuted ? '5 8' : undefined}
            style={{ opacity: isMuted ? 0.45 : 1, transition: 'all 0.6s ease' }}
          />
        );
      })}

      {/* Flow overlays (lit during transmission) */}
      {Object.entries(CHANNELS).map(([id, d]) => (
        <path
          key={`flow-${id}`}
          ref={pathRefs[id]}
          d={d}
          fill="none"
          stroke="none"
          strokeWidth={2}
          strokeLinecap="square"
          style={{ opacity: 0 }}
        />
      ))}

      {/* Ports */}
      <g fill="#d0d4dc">
        {PORTS.map((p, i) => <circle key={`po-${i}`} cx={p.cx} cy={p.cy} r={4} />)}
      </g>
      <g fill="#f6f7f9">
        {PORTS.map((p, i) => <circle key={`pi-${i}`} cx={p.cx} cy={p.cy} r={2} />)}
      </g>
    </svg>
  );
});

ChannelSVG.displayName = 'ChannelSVG';
export default ChannelSVG;
