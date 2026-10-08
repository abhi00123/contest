import React from 'react';
import { sound } from '../utils/sound';

export default function ModeSelectScreen({ onSelectMode }) {
  const handleSelect = (mode) => {
    sound.play('click');
    onSelectMode(mode);
  };

  return (
    <div
      className="screen-animate"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 20px',
        background: 'radial-gradient(ellipse at 50% 15%, #1A2750 0%, #0A1228 65%, #040816 100%)',
        userSelect: 'none'
      }}
    >
      {/* Top Branding */}
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(245, 184, 56, 0.15)',
          border: '1px solid rgba(245, 184, 56, 0.35)',
          padding: '4px 14px',
          borderRadius: 20,
          color: '#F5B838',
          fontSize: '11px',
          fontWeight: 900,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 10
        }}>
          <span>👑</span>
          <span>CEO's World of Winners</span>
        </div>

        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '28px',
          fontWeight: 900,
          color: '#FFFFFF',
          margin: '4px 0 6px',
          letterSpacing: '-0.02em',
          lineHeight: 1.15
        }}>
          Select Game <span style={{ color: '#F5B838' }}>Route</span>
        </h1>
        <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0, fontWeight: 500 }}>
          Choose how you want to experience the Road to Prague
        </p>
      </div>

      {/* Mode 1 & 2 Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, margin: 'auto 0', width: '100%' }}>
        
        {/* OPTION 1 */}
        <div
          onClick={() => handleSelect(1)}
          style={{
            background: 'linear-gradient(135deg, rgba(19, 31, 70, 0.95) 0%, rgba(11, 20, 48, 0.98) 100%)',
            border: '2px solid rgba(56, 189, 248, 0.5)',
            borderRadius: '20px',
            padding: '18px 16px',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 0 16px rgba(56, 189, 248, 0.2)',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          onTouchStart={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
          onTouchEnd={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Number 1 Badge */}
            <div style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              background: 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
              color: '#FFFFFF',
              fontFamily: "'Outfit', sans-serif",
              fontSize: '24px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.6)'
            }}>
              1
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '18px', fontWeight: 900, color: '#FFFFFF' }}>
                  Direct Quest
                </span>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#38BDF8', background: 'rgba(56, 189, 248, 0.15)', padding: '2px 8px', borderRadius: 8 }}>
                  Fast Track
                </span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '11.5px', color: '#CBD5E1', lineHeight: 1.35 }}>
                Intro ➔ Lane & Target Console ➔ Direct True/False Quiz
              </p>
            </div>
            <span style={{ color: '#38BDF8', fontSize: '18px', fontWeight: 900 }}>➔</span>
          </div>
        </div>

        {/* OPTION 2 */}
        <div
          onClick={() => handleSelect(2)}
          style={{
            background: 'linear-gradient(135deg, rgba(28, 38, 78, 0.95) 0%, rgba(16, 25, 56, 0.98) 100%)',
            border: '2px solid rgba(245, 184, 56, 0.6)',
            borderRadius: '20px',
            padding: '18px 16px',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 0 20px rgba(245, 184, 56, 0.25)',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          onTouchStart={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
          onTouchEnd={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Number 2 Badge */}
            <div style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              background: 'linear-gradient(135deg, #FFE28A 0%, #F5B838 50%, #D97706 100%)',
              color: '#1A1202',
              fontFamily: "'Outfit', sans-serif",
              fontSize: '24px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 18px rgba(245, 184, 56, 0.6)'
            }}>
              2
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '18px', fontWeight: 900, color: '#FFFFFF' }}>
                  Full Road Journey
                </span>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#F5B838', background: 'rgba(245, 184, 56, 0.15)', padding: '2px 8px', borderRadius: 8 }}>
                  Complete Tour
                </span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '11.5px', color: '#CBD5E1', lineHeight: 1.35 }}>
                Intro ➔ Road Map (Select Role Directly) ➔ True/False Quiz
              </p>
            </div>
            <span style={{ color: '#F5B838', fontSize: '18px', fontWeight: 900 }}>➔</span>
          </div>
        </div>

      </div>

      {/* Footer info */}
      <div style={{ textAlign: 'center', color: '#64748B', fontSize: '11px', fontWeight: 600 }}>
        Tap 1 or 2 to start your adventure
      </div>
    </div>
  );
}
