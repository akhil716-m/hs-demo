import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';

const HeroIllustration = () => (
  <div style={{
    width: '100%', maxWidth: 480, borderRadius: 20,
    background: '#dde8ff', padding: '36px 32px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', minHeight: 180,
  }}>
    {/* Left system box */}
    <div style={{
      width: 72, height: 64, borderRadius: 10,
      background: 'rgba(255,255,255,0.55)',
      flexShrink: 0,
    }} />

    {/* Failed badge + arrow */}
    <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Arrow line left */}
      <svg width="80" height="40" viewBox="0 0 80 40" style={{ position: 'absolute', left: -8 }}>
        <defs>
          <marker id="ah-l" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill="#6b7280" />
          </marker>
        </defs>
        <path d="M0,20 C30,20 50,20 80,20" stroke="#9ca3af" strokeWidth="1.5" fill="none" markerEnd="url(#ah-l)" />
      </svg>

      {/* Failed badge */}
      <div style={{
        position: 'absolute', top: -22, left: '10%',
        display: 'flex', alignItems: 'center', gap: 4,
        background: '#fff', borderRadius: 8, padding: '4px 10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
        fontSize: 12, fontWeight: 600, color: '#dc2626', whiteSpace: 'nowrap',
      }}>
        <span style={{ fontSize: 12 }}>⚠</span> Failed
      </div>
    </div>

    {/* Center — Hyperswitch circle */}
    <div style={{
      width: 80, height: 80, borderRadius: 16,
      background: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 20px rgba(0,102,255,0.18)',
      flexShrink: 0, zIndex: 1,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: 'linear-gradient(135deg, #0066FF 0%, #3385FF 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Hyperswitch drop icon approximation */}
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="8" fill="white" fillOpacity="0.25" />
          <circle cx="11" cy="11" r="4.5" fill="white" />
        </svg>
      </div>
    </div>

    {/* Success badge + arrow */}
    <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Arrow line right */}
      <svg width="80" height="40" viewBox="0 0 80 40" style={{ position: 'absolute', right: -8 }}>
        <defs>
          <marker id="ah-r" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill="#6b7280" />
          </marker>
        </defs>
        <path d="M0,20 C30,20 50,20 80,20" stroke="#9ca3af" strokeWidth="1.5" fill="none" markerEnd="url(#ah-r)" />
      </svg>

      {/* Success badge */}
      <div style={{
        position: 'absolute', top: -22, right: '10%',
        display: 'flex', alignItems: 'center', gap: 4,
        background: '#fff', borderRadius: 8, padding: '4px 10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
        fontSize: 12, fontWeight: 600, color: '#16a34a', whiteSpace: 'nowrap',
      }}>
        <span>✓</span> Success
      </div>
    </div>

    {/* Right system box */}
    <div style={{
      width: 72, height: 64, borderRadius: 10,
      background: 'rgba(255,255,255,0.55)',
      flexShrink: 0,
    }} />
  </div>
);

const LandingPage = ({ onGetStarted }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '40px 24px',
    maxWidth: 600, margin: '0 auto', width: '100%',
  }}>
    <HeroIllustration />

    {/* Recovery chip */}
    <div style={{ marginTop: 28 }}>
      <span style={{
        display: 'inline-block',
        fontSize: '11px', fontWeight: 600, color: '#0066FF',
        border: '1px solid #bfdbfe', borderRadius: 999,
        padding: '3px 14px', letterSpacing: '0.04em',
      }}>
        Recovery
      </span>
    </div>

    {/* Heading */}
    <h2 style={{
      marginTop: 14, marginBottom: 0,
      fontSize: '22px', fontWeight: 800, color: '#111827',
      textAlign: 'center', lineHeight: 1.3, letterSpacing: '-0.02em',
    }}>
      Never lose revenue to unwarranted churn
    </h2>

    {/* Subtitle */}
    <p style={{
      marginTop: 10, marginBottom: 0,
      fontSize: '13.5px', color: '#6b7280', textAlign: 'center',
      lineHeight: 1.6, maxWidth: 420,
    }}>
      Maximize retention and recover failed transactions with automated retry strategies.
    </p>

    {/* CTA */}
    <button
      onClick={onGetStarted}
      style={{
        marginTop: 28,
        display: 'flex', alignItems: 'center', gap: 6,
        background: '#0066FF', color: '#fff',
        border: 'none', borderRadius: 10,
        padding: '11px 28px', fontSize: '14px', fontWeight: 700,
        cursor: 'pointer', letterSpacing: '-0.01em',
        boxShadow: '0 4px 14px rgba(0,102,255,0.35)',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#0052CC'}
      onMouseLeave={e => e.currentTarget.style.background = '#0066FF'}
    >
      Get Started <ArrowRight size={15} />
    </button>

    {/* Bottom cards */}
    <div style={{
      marginTop: 36, display: 'flex', gap: 12, width: '100%', maxWidth: 480,
    }}>
      {[
        { icon: '🔑', title: 'Set up API Keys', sub: 'Authenticate your integration' },
        { icon: '📄', title: 'Developer Docs', sub: 'Explore the full API reference' },
      ].map(({ icon, title, sub }) => (
        <div key={title} style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 12,
          background: '#fff', border: '1px solid #e5e7eb',
          borderRadius: 12, padding: '14px 16px',
          cursor: 'pointer', transition: 'border-color 0.15s, box-shadow 0.15s',
          boxShadow: '0 1px 3px rgba(0,0,0,.04)',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#bfdbfe'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,102,255,0.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,.04)'; }}
        >
          <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#111827' }}>{title}</div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: 1 }}>{sub}</div>
          </div>
          <ChevronRight size={14} color="#9ca3af" style={{ flexShrink: 0 }} />
        </div>
      ))}
    </div>
  </div>
);

export default LandingPage;
