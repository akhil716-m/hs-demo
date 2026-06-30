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
            stroke={isMuted ? '#d1d5db' : '#e3e6ec'}
            strokeWidth={isMuted ? 3 : 6}
            strokeLinecap="round"
            strokeDasharray={isMuted ? '6 9' : undefined}
            style={{ opacity: isMuted ? 0.5 : 1, transition: 'all 0.6s ease' }}
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
          strokeWidth={2.5}
          strokeLinecap="round"
          style={{ opacity: 0 }}
        />
      ))}

      {/* Ports */}
      <g fill="#cfd4dd">
        {PORTS.map((p, i) => <circle key={`po-${i}`} cx={p.cx} cy={p.cy} r={5} />)}
      </g>
      <g fill="#fff">
        {PORTS.map((p, i) => <circle key={`pi-${i}`} cx={p.cx} cy={p.cy} r={2.2} />)}
      </g>
    </svg>
  );
});

ChannelSVG.displayName = 'ChannelSVG';
export default ChannelSVG;
