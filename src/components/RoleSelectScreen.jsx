import React from 'react';
import { sound } from '../utils/sound';

export default function RoleSelectScreen({ onSelectRole }) {
  const handleSelect = (roleKey) => {
    sound.play('click');
    if (onSelectRole) {
      onSelectRole(roleKey);
    }
  };

  return (
    <div
      className="screen-animate"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px 16px clamp(20px, 3vh, 32px)',
        background: 'radial-gradient(ellipse at 50% 25%, #1D3576 0%, #081026 62%, #030610 100%)',
        userSelect: 'none',
        gap: 'clamp(16px, 2.6vh, 26px)'
      }}
    >
      {/* Prominent Hero Prague WoW Logo with Radiant Ambient Glow */}
      <div className="hero-logo-wrapper">
        <div className="hero-logo-ambient-glow" />
        <img
          src="./assets/PP.png"
          alt="CEO's World of Winners - Prague"
          className="hero-logo-img"
          onError={(e) => {
            if (e.target.src !== '/assets/PP.png') {
              e.target.src = '/assets/PP.png';
            }
          }}
        />
      </div>

      {/* Top Title: Only "Select Your Role" */}
      <h1
        style={{
          fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
          fontSize: '25px',
          fontWeight: 900,
          color: '#FFFFFF',
          margin: 0,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          textAlign: 'center',
          textShadow: '0 2px 12px rgba(0, 0, 0, 0.6)'
        }}
      >
        Select Your <span style={{ color: '#F5B838' }}>Role</span>
      </h1>

      {/* 2 Clean Option Boxes (No extra text) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          width: '100%',
          maxWidth: 340
        }}
      >
        {/* OPTION 1: Frontline RM */}
        <div
          onClick={() => handleSelect('frontline')}
          role="button"
          tabIndex={0}
          style={{
            background: 'linear-gradient(135deg, rgba(20, 32, 72, 0.95) 0%, rgba(10, 18, 44, 0.98) 100%)',
            border: '2px solid rgba(245, 184, 56, 0.55)',
            borderRadius: '20px',
            padding: '18px 20px',
            cursor: 'pointer',
            boxShadow: '0 10px 28px rgba(0, 0, 0, 0.55), 0 0 20px rgba(245, 184, 56, 0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease'
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          onTouchStart={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
          onTouchEnd={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Number 1 */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                background: 'linear-gradient(135deg, #FFE28A 0%, #F5B838 55%, #D97706 100%)',
                color: '#1A1202',
                fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                fontSize: '22px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 0 14px rgba(245, 184, 56, 0.55)'
              }}
            >
              1
            </div>

            {/* Title Only */}
            <span
              style={{
                fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                fontSize: '18px',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '0.02em'
              }}
            >
              Frontline RM
            </span>
          </div>

          <span style={{ color: '#F5B838', fontSize: '18px', fontWeight: 900 }}>➔</span>
        </div>

        {/* OPTION 2: Leadership Role */}
        <div
          onClick={() => handleSelect('leadership')}
          role="button"
          tabIndex={0}
          style={{
            background: 'linear-gradient(135deg, rgba(20, 32, 72, 0.95) 0%, rgba(10, 18, 44, 0.98) 100%)',
            border: '2px solid rgba(56, 189, 248, 0.55)',
            borderRadius: '20px',
            padding: '18px 20px',
            cursor: 'pointer',
            boxShadow: '0 10px 28px rgba(0, 0, 0, 0.55), 0 0 20px rgba(56, 189, 248, 0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease'
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          onTouchStart={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
          onTouchEnd={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Number 2 */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                background: 'linear-gradient(135deg, #7DD3FC 0%, #38BDF8 55%, #0284C7 100%)',
                color: '#07162C',
                fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                fontSize: '22px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 0 14px rgba(56, 189, 248, 0.55)'
              }}
            >
              2
            </div>

            {/* Title Only */}
            <span
              style={{
                fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                fontSize: '18px',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '0.02em'
              }}
            >
              Leadership Role
            </span>
          </div>

          <span style={{ color: '#38BDF8', fontSize: '18px', fontWeight: 900 }}>➔</span>
        </div>
      </div>
    </div>
  );
}
