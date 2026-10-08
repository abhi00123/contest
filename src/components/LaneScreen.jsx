import React, { useState, useEffect, useRef } from 'react';
import { LANES_DATA } from '../data/contestData';
import { sound } from '../utils/sound';

// Animated counting number hook / component for dynamic numbers
function AnimatedCount({ value, prefix = '', suffix = 'L', duration = 360 }) {
  const [currentVal, setCurrentVal] = useState(value);
  const prevValRef = useRef(value);

  useEffect(() => {
    const start = Number(prevValRef.current);
    const end = Number(value);
    if (isNaN(start) || isNaN(end) || start === end) {
      setCurrentVal(value);
      prevValRef.current = value;
      return;
    }

    const startTime = performance.now();
    let animId;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = start + (end - start) * ease;

      const hasDecimals = end.toString().includes('.');
      const decimals = hasDecimals ? end.toString().split('.')[1].length : 0;
      setCurrentVal(decimals > 0 ? val.toFixed(decimals) : Math.round(val));

      if (progress < 1) {
        animId = requestAnimationFrame(tick);
      } else {
        setCurrentVal(end);
        prevValRef.current = end;
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [value, duration]);

  return (
    <span>
      {prefix}{currentVal}<span style={{ fontSize: '0.65em', opacity: 0.9, marginLeft: 1 }}>{suffix}</span>
    </span>
  );
}

// 10 Roles matching the visual mock exactly
const ROLE_CONFIG = [
  {
    label: 'Rural',
    full: 'BBRL Staff – Rural',
    renderIcon: () => (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ borderRadius: 7, flexShrink: 0 }}>
        <rect width="32" height="32" rx="7" fill="#4ade80" />
        <path d="M0 20 Q16 12 32 20 L32 32 L0 32 Z" fill="#22c55e" />
        <path d="M0 24 Q16 16 32 24 L32 32 L0 32 Z" fill="#15803d" />
        <rect x="9" y="14" width="14" height="12" fill="#f97316" rx="1" />
        <polygon points="16,6 7,14 25,14" fill="#dc2626" />
        <rect x="13" y="19" width="6" height="7" fill="#78350f" />
        <rect x="18" y="15" width="4" height="4" fill="#fef08a" />
      </svg>
    )
  },
  {
    label: 'Semi Urban',
    full: 'BBRL Staff – Semi Urban',
    renderIcon: () => (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ borderRadius: 7, flexShrink: 0 }}>
        <rect width="32" height="32" rx="7" fill="#bae6fd" />
        <rect x="0" y="22" width="32" height="10" fill="#86efac" />
        <polygon points="16,7 6,15 26,15" fill="#0284c7" />
        <rect x="8" y="15" width="16" height="11" fill="#f1f5f9" />
        <rect x="13" y="19" width="6" height="7" fill="#dc2626" />
        <circle cx="27" cy="20" r="4" fill="#16a34a" />
      </svg>
    )
  },
  {
    label: 'Urban & Metro',
    full: 'BBRL Staff – Urban & Metro',
    renderIcon: () => (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ borderRadius: 7, flexShrink: 0 }}>
        <rect width="32" height="32" rx="7" fill="#38bdf8" />
        <rect x="4" y="14" width="7" height="18" fill="#0284c7" />
        <rect x="12" y="8" width="8" height="24" fill="#0369a1" />
        <rect x="21" y="12" width="7" height="20" fill="#075985" />
        <rect x="14" y="10" width="2" height="2" fill="#fef08a" />
        <rect x="17" y="10" width="2" height="2" fill="#fef08a" />
        <rect x="14" y="14" width="2" height="2" fill="#fef08a" />
        <rect x="17" y="14" width="2" height="2" fill="#fef08a" />
      </svg>
    )
  },
  {
    label: 'Aspire / PCAM',
    full: 'Aspire / PCAM RM',
    renderIcon: () => (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ borderRadius: 7, flexShrink: 0 }}>
        <rect width="32" height="32" rx="7" fill="#0284c7" />
        <polygon points="16,5 26,12 16,27 6,12" fill="#38bdf8" />
        <polygon points="16,5 21,12 16,27 11,12" fill="#bae6fd" />
        <polygon points="11,12 21,12 16,27" fill="#e0f2fe" />
      </svg>
    )
  },
  {
    label: 'Signature RM',
    full: 'Signature RM',
    renderIcon: () => (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ borderRadius: 7, flexShrink: 0 }}>
        <rect width="32" height="32" rx="7" fill="#fef3c7" />
        <path d="M6 22 L8 12 L12 17 L16 8 L20 17 L24 12 L26 22 Z" fill="#f59e0b" />
        <polygon points="6,22 26,22 24,25 8,25" fill="#d97706" />
        <circle cx="16" cy="8" r="1.5" fill="#ef4444" />
        <circle cx="8" cy="12" r="1.2" fill="#3b82f6" />
        <circle cx="24" cy="12" r="1.2" fill="#3b82f6" />
      </svg>
    )
  },
  {
    label: 'Insignia G1',
    full: 'Insignia RM – Group 1',
    renderIcon: (active) => (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ borderRadius: 7, flexShrink: 0 }}>
        <rect width="32" height="32" rx="7" fill={active ? "#1e293b" : "#fff7ed"} />
        <polygon points="18,4 8,17 15,17 13,28 24,14 17,14" fill="#f97316" />
        <polygon points="17,6 10,16 15,16 14,25 22,14 17,14" fill="#fbbf24" />
      </svg>
    )
  },
  {
    label: 'Insignia G2',
    full: 'Insignia RM – Group 2',
    renderIcon: (active) => (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ borderRadius: 7, flexShrink: 0 }}>
        <rect width="32" height="32" rx="7" fill={active ? "#1e293b" : "#fff7ed"} />
        <polygon points="18,4 8,17 15,17 13,28 24,14 17,14" fill="#f97316" />
        <polygon points="17,6 10,16 15,16 14,25 22,14 17,14" fill="#fbbf24" />
      </svg>
    )
  },
  {
    label: 'Insignia G3',
    full: 'Insignia RM – Group 3',
    renderIcon: (active) => (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ borderRadius: 7, flexShrink: 0 }}>
        <rect width="32" height="32" rx="7" fill={active ? "#1e293b" : "#fff7ed"} />
        <polygon points="18,4 8,17 15,17 13,28 24,14 17,14" fill="#f97316" />
        <polygon points="17,6 10,16 15,16 14,25 22,14 17,14" fill="#fbbf24" />
      </svg>
    )
  },
  {
    label: 'Insignia G4',
    full: 'Insignia RM – Group 4',
    renderIcon: (active) => (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ borderRadius: 7, flexShrink: 0 }}>
        <rect width="32" height="32" rx="7" fill={active ? "#1e293b" : "#fff7ed"} />
        <polygon points="18,4 8,17 15,17 13,28 24,14 17,14" fill="#f97316" />
        <polygon points="17,6 10,16 15,16 14,25 22,14 17,14" fill="#fbbf24" />
      </svg>
    )
  },
  {
    label: 'Commercial/BBG',
    full: 'Commercial / BBG / Other',
    renderIcon: () => (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ borderRadius: 7, flexShrink: 0 }}>
        <rect width="32" height="32" rx="7" fill="#e0e7ff" />
        <rect x="7" y="6" width="18" height="22" fill="#3b82f6" rx="2" />
        <rect x="10" y="9" width="3" height="3" fill="#ffffff" />
        <rect x="15" y="9" width="3" height="3" fill="#ffffff" />
        <rect x="19" y="9" width="3" height="3" fill="#ffffff" />
        <rect x="10" y="14" width="3" height="3" fill="#ffffff" />
        <rect x="15" y="14" width="3" height="3" fill="#ffffff" />
        <rect x="19" y="14" width="3" height="3" fill="#ffffff" />
        <rect x="13" y="21" width="6" height="7" fill="#1e3a8a" />
      </svg>
    )
  }
];

// 5 Milestone Tiers Configuration
const TIER_CONFIGS = [
  {
    name: 'BRONZE',
    cleanName: 'BRONZE',
    symbol: '★',
    reward: '10K Reward Points (RM only)',
    rewardBadge: '10K PTS',
    subtitle: '10K Pts',
    pillLabel: '10K PTS',
    color: '#E3A06B',
    accentBorder: '#D97706',
    inactiveBorder: 'rgba(217, 119, 6, 0.4)',
    glowColor: 'rgba(217, 119, 6, 0.75)',
    bgGradient: 'linear-gradient(180deg, rgba(217, 119, 6, 0.35) 0%, rgba(14, 24, 60, 0.98) 100%)',
    renderIcon: () => (
      <div style={{
        width: 25,
        height: 25,
        borderRadius: 13,
        background: 'radial-gradient(circle at 32% 32%, #FFD6A5, #C67D42 58%, #7B3E14)',
        border: '1.5px solid #F0B98A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#3B1E08',
        fontSize: 11,
        fontWeight: 900,
        boxShadow: '0 2px 8px rgba(0,0,0,0.6)'
      }}>★</div>
    ),
    pillBg: 'linear-gradient(135deg, #FFD6A5, #D97706)',
    pillColor: '#2A1406'
  },
  {
    name: 'SILVER',
    cleanName: 'SILVER',
    symbol: '★',
    reward: '25K Reward Points (RM only)',
    rewardBadge: '25K PTS',
    subtitle: '25K Pts',
    pillLabel: '25K PTS',
    color: '#E2E8F0',
    accentBorder: '#CBD5E1',
    inactiveBorder: 'rgba(226, 232, 240, 0.4)',
    glowColor: 'rgba(226, 232, 240, 0.75)',
    bgGradient: 'linear-gradient(180deg, rgba(226, 232, 240, 0.3) 0%, rgba(14, 24, 60, 0.98) 100%)',
    renderIcon: () => (
      <div style={{
        width: 25,
        height: 25,
        borderRadius: 13,
        background: 'radial-gradient(circle at 32% 32%, #FFFFFF, #D5DDE8 58%, #8A97A8)',
        border: '1.5px solid #FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#1E293B',
        fontSize: 11,
        fontWeight: 900,
        boxShadow: '0 2px 8px rgba(0,0,0,0.6)'
      }}>★</div>
    ),
    pillBg: 'linear-gradient(135deg, #FFFFFF, #CBD5E1)',
    pillColor: '#0F172A'
  },
  {
    name: 'GOLD',
    cleanName: 'GOLD',
    symbol: '★',
    reward: 'Sales Training Program, Prague',
    rewardBadge: 'PRAGUE TRIP',
    subtitle: 'Prague Trip',
    pillLabel: 'PRAGUE TRIP',
    color: '#F6D77F',
    accentBorder: '#F5B838',
    inactiveBorder: 'rgba(245, 184, 56, 0.4)',
    glowColor: 'rgba(245, 184, 56, 0.85)',
    bgGradient: 'linear-gradient(180deg, rgba(245, 184, 56, 0.38) 0%, rgba(14, 24, 60, 0.98) 100%)',
    renderIcon: () => (
      <div style={{
        width: 25,
        height: 25,
        borderRadius: 13,
        background: 'radial-gradient(circle at 32% 32%, #FFF4B8, #F5B838 58%, #9C6F0A)',
        border: '1.5px solid #F6D77F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#2A1C02',
        fontSize: 11,
        fontWeight: 900,
        boxShadow: '0 2px 8px rgba(0,0,0,0.6)'
      }}>★</div>
    ),
    pillBg: 'linear-gradient(135deg, #FFE28A, #F5B838)',
    pillColor: '#0B1430'
  },
  {
    name: 'TITANIUM',
    cleanName: 'TITANIUM',
    symbol: '◆',
    reward: 'Prague Trip + 25K Reward Points',
    rewardBadge: 'PRAGUE + 25K',
    subtitle: '≈25K Pts',
    pillLabel: 'PRAGUE + 25K',
    color: '#93C5FD',
    accentBorder: '#3B82F6',
    inactiveBorder: 'rgba(59, 130, 246, 0.4)',
    glowColor: 'rgba(59, 130, 246, 0.75)',
    bgGradient: 'linear-gradient(180deg, rgba(59, 130, 246, 0.32) 0%, rgba(14, 24, 60, 0.98) 100%)',
    renderIcon: () => (
      <div style={{
        width: 25,
        height: 25,
        borderRadius: 13,
        background: 'radial-gradient(circle at 32% 32%, #E0F2FE, #38BDF8 58%, #0369A1)',
        border: '1.5px solid #93C5FD',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#04162C',
        fontSize: 10,
        fontWeight: 900,
        boxShadow: '0 2px 8px rgba(0,0,0,0.6)'
      }}>◆</div>
    ),
    pillBg: 'linear-gradient(135deg, #93C5FD, #3B82F6)',
    pillColor: '#0B1430'
  },
  {
    name: 'PLATINUM',
    cleanName: 'PLATINUM',
    symbol: '👑',
    reward: 'Prague Trip + 50K Reward Points',
    rewardBadge: 'PRAGUE + 50K',
    subtitle: '≈50K Pts',
    pillLabel: 'PRAGUE + 50K',
    color: '#C084FC',
    accentBorder: '#A855F7',
    inactiveBorder: 'rgba(168, 85, 247, 0.4)',
    glowColor: 'rgba(168, 85, 247, 0.75)',
    bgGradient: 'linear-gradient(180deg, rgba(168, 85, 247, 0.32) 0%, rgba(14, 24, 60, 0.98) 100%)',
    renderIcon: () => (
      <div style={{
        width: 25,
        height: 25,
        borderRadius: 13,
        background: 'radial-gradient(circle at 32% 32%, #FAF5FF, #C084FC 58%, #4C1D95)',
        border: '1.5px solid #F3E8FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#1A0B2E',
        fontSize: 11,
        fontWeight: 900,
        boxShadow: '0 2px 8px rgba(0,0,0,0.6)'
      }}>👑</div>
    ),
    pillBg: 'linear-gradient(135deg, #E9D5FF, #A855F7)',
    pillColor: '#0B1430'
  }
];

export default function LaneScreen({ selectedLane, onSelectLane, wap, setWap, onNavigate, gameMode = 1 }) {
  const currentLane = LANES_DATA[selectedLane] || LANES_DATA[5];
  const targets = currentLane.t;

  // Track which of the 5 milestone tier cards is selected (0: Bronze, 1: Silver, 2: Gold, 3: Titanium, 4: Platinum)
  const [selectedTierIndex, setSelectedTierIndex] = useState(() => {
    if (wap !== undefined && targets) {
      const idx = targets.indexOf(wap);
      if (idx !== -1) return idx;
    }
    return 4; // Default to Platinum
  });

  const handleSelect = (index) => {
    sound.play('click');
    onSelectLane(index);
    if (setWap) {
      const nextTargets = LANES_DATA[index]?.t;
      if (nextTargets && nextTargets[selectedTierIndex] !== undefined) {
        setWap(nextTargets[selectedTierIndex]);
      }
    }
  };

  const handleTierSelect = (tierIdx) => {
    sound.play('click');
    setSelectedTierIndex(tierIdx);
    if (setWap && targets[tierIdx] !== undefined) {
      setWap(targets[tierIdx]);
    }
  };

  return (
    <div
      className="screen-animate"
      style={{
        position: 'relative',
        height: '100%',
        minHeight: '100%',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '14px 12px 14px',
        backgroundImage: "url('/assets/prague_bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        gap: 8
      }}
    >
      {/* Sky Darken Gradient for Top Bar & Medals Readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '46%',
        background: 'linear-gradient(180deg, rgba(6, 12, 34, 0.9) 0%, rgba(8, 16, 42, 0.5) 65%, rgba(0, 0, 0, 0) 100%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Animated Airplane flying across the sky */}
      <div style={{
        position: 'absolute',
        top: 42,
        left: 80,
        zIndex: 1,
        pointerEvents: 'none',
        animation: 'planeHover 4.5s ease-in-out infinite'
      }}>
        <svg width="52" height="26" viewBox="0 0 48 24" fill="none">
          <line x1="0" y1="12" x2="18" y2="12" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="2 2" />
          <path d="M18 12 L34 10 L44 11 C46 11.5 47 12 47 12.5 C47 13 46 13.5 44 14 L34 15 L18 13 Z" fill="#FFFFFF" />
          <polygon points="26,10 32,2 35,2 31,10" fill="#2563EB" />
          <polygon points="26,15 32,23 35,23 31,15" fill="#1D4ED8" />
          <polygon points="18,12 21,7 23,7 21,12" fill="#2563EB" />
        </svg>
      </div>

      {/* ============================================================== */}
      {/* 1. TOP HEADER BAR */}
      {/* ============================================================== */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        zIndex: 2,
        flexShrink: 0
      }}>
        {/* Stage Pill */}
        <div style={{
          background: 'linear-gradient(135deg, #FFE28A 0%, #F5B838 100%)',
          color: '#0B1430',
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: '0.04em',
          padding: '4px 11px',
          borderRadius: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: 4
        }}>
          STAGE 1/3
        </div>

        {/* Center Title */}
        <h1 style={{
          margin: 0,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 15,
          fontWeight: 900,
          letterSpacing: '0.04em',
          color: '#FFFFFF',
          textTransform: 'uppercase',
          textShadow: '0 2px 8px rgba(0,0,0,0.9)'
        }}>
          LANE &amp; TARGET CONSOLE
        </h1>

        {/* WAP Pill */}
        <div style={{
          background: 'rgba(11, 20, 48, 0.88)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          color: '#FFFFFF',
          fontSize: 10.5,
          fontWeight: 800,
          letterSpacing: '0.02em',
          padding: '4px 10px',
          borderRadius: 14,
          backdropFilter: 'blur(8px)'
        }}>
          WAP (₹ Lakh)
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. 5 FLOATING TROPHY / MEDAL CARDS (Interactive Selection) */}
      {/* ============================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 5,
        width: '100%',
        zIndex: 2,
        flexShrink: 0
      }}>
        {TIER_CONFIGS.map((tier, idx) => {
          const isSelected = idx === selectedTierIndex;
          const targetVal = targets[idx];

          return (
            <div
              key={tier.name}
              onClick={() => handleTierSelect(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTierSelect(idx);
                }
              }}
              style={{
                position: 'relative',
                background: isSelected ? tier.bgGradient : 'rgba(10, 16, 38, 0.86)',
                backdropFilter: 'blur(14px)',
                border: isSelected ? `2px solid ${tier.accentBorder}` : `1px solid ${tier.inactiveBorder}`,
                borderRadius: 14,
                padding: '10px 4px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                transform: isSelected ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: isSelected
                  ? `0 0 22px ${tier.glowColor}, 0 8px 18px rgba(0,0,0,0.55)`
                  : '0 5px 14px rgba(0,0,0,0.45)',
                animation: isSelected ? 'goldCardHalo 2.5s ease-in-out infinite' : 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                userSelect: 'none'
              }}
            >
              {/* Floating Crown above Selected Card */}
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: -14,
                  fontSize: 15,
                  animation: 'crownFloat 2s ease-in-out infinite',
                  pointerEvents: 'none',
                  zIndex: 3
                }}>👑</div>
              )}

              {/* Tier Icon */}
              {tier.renderIcon()}

              {/* Tier Label */}
              <span style={{
                fontSize: 10.5,
                fontWeight: 900,
                color: isSelected ? tier.color : '#CBD5E1',
                letterSpacing: '0.06em',
                marginTop: 4,
                transition: 'color 0.2s ease'
              }}>
                {tier.name}
              </span>

              {/* Target Value with Animated Count */}
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: isSelected ? 18.5 : 17,
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.15,
                marginTop: 3,
                textShadow: isSelected ? `0 0 12px ${tier.glowColor}` : 'none',
                transition: 'all 0.2s ease'
              }}>
                <AnimatedCount value={targetVal} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* 3. SELECTED ROLE & TIER REWARD STATUS BANNER (Enlarged & Clear) */}
      {/* ============================================================== */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(14, 26, 68, 0.96) 0%, rgba(8, 14, 40, 0.98) 100%)',
        border: '1.5px solid rgba(233, 185, 73, 0.6)',
        borderRadius: 20,
        padding: '16px 18px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        zIndex: 2,
        flexShrink: 0,
        boxShadow: '0 12px 32px rgba(0,0,0,0.6), 0 0 20px rgba(233, 185, 73, 0.25)'
      }}>
        {/* Top Row: Selected Role & Target Threshold */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Left: Role Title */}
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, paddingRight: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 900, color: '#F59E0B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              SELECTED ROLE
            </span>
            <span style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 16.5,
              fontWeight: 800,
              color: '#FFFFFF',
              whiteSpace: 'nowrap'
            }}>
              {currentLane.full}
            </span>
          </div>

          {/* Right: Selected Tier Threshold */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
            <span style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 11,
              fontWeight: 800,
              color: '#CBD5E1',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 3
            }}>
              {selectedTierIndex === 2 ? 'PRAGUE THRESHOLD' : `${TIER_CONFIGS[selectedTierIndex].cleanName} TARGET`}
            </span>
            <div style={{
              background: 'linear-gradient(135deg, #FFE28A, #FDE68A)',
              color: '#0B1430',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 18,
              fontWeight: 900,
              padding: '5px 14px',
              borderRadius: 10,
              boxShadow: '0 3px 10px rgba(0,0,0,0.35)'
            }}>
              <AnimatedCount value={targets[selectedTierIndex]} prefix="₹" suffix=" Lakh" />
            </div>
          </div>
        </div>

        {/* Bottom Row: Selected Medal Tier Reward - Simple Clean Line */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.16)',
          paddingTop: 10,
          marginTop: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <span style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 14.5,
            fontWeight: 800,
            color: TIER_CONFIGS[selectedTierIndex].color,
            letterSpacing: '0.02em',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)'
          }}>
            {TIER_CONFIGS[selectedTierIndex].reward}
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. FROSTED WHITE CARD: 10 ROLE CHIPS MATRIX (Expanded & Filled) */}
      {/* ============================================================== */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(18px)',
        border: '1.5px solid rgba(255, 255, 255, 0.9)',
        borderRadius: 22,
        padding: '13px 13px 11px',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        zIndex: 2,
        flexShrink: 0
      }}>
        {/* Header inside White Card - Clean, no Platinum Target */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '0 2px' }}>
          <div style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            background: '#EF4444',
            border: '2px solid #FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 5px rgba(0,0,0,0.25)'
          }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: '#FFFFFF' }} />
          </div>
          <span style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: '0.04em',
            color: '#0F172A',
            textTransform: 'uppercase'
          }}>
            SELECT YOUR ROLE
          </span>
        </div>

        {/* 10 Role Buttons (2 Columns × 5 Rows) - Text only, no lacs, centered and clean */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 7,
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {LANES_DATA.map((lane, index) => {
            const isSelected = index === selectedLane;

            return (
              <button
                key={lane.label}
                type="button"
                onClick={() => handleSelect(index)}
                style={{
                  height: 46,
                  borderRadius: 12,
                  border: isSelected ? '2px solid #E9B949' : '1px solid #DCE6F5',
                  background: isSelected
                    ? 'linear-gradient(135deg, #0B1536 0%, #15224D 100%)'
                    : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
                  color: isSelected ? '#FFFFFF' : '#0F172A',
                  padding: '0 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: isSelected
                    ? '0 0 16px rgba(233, 185, 73, 0.45), 0 4px 10px rgba(0,0,0,0.3)'
                    : '0 2px 6px rgba(15, 23, 42, 0.05)',
                  transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Role Label - Text only, clean and centered */}
                <span style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: isSelected ? 800 : 700,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textAlign: 'center',
                  letterSpacing: '0.01em'
                }}>
                  {lane.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Informative Rule Footnote */}
        <div style={{
          background: '#DBEAFE',
          borderRadius: 9,
          padding: '5px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 7
        }}>
          <div style={{
            width: 15,
            height: 15,
            borderRadius: 7.5,
            background: '#2563EB',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9.5,
            fontWeight: 900,
            flexShrink: 0
          }}>
            i
          </div>
          <span style={{ fontSize: 10, color: '#1E40AF', fontWeight: 600, lineHeight: 1.3 }}>
            Kharghar, Vasai, Panjim count as Urban. Rural BMs qualify via self-sourcing.
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. COBBLESTONE GROUND & GLOWING GOLDEN ACTION BUTTON */}
      {/* ============================================================== */}
      <div style={{
        position: 'relative',
        width: '100%',
        zIndex: 2,
        flexShrink: 0,
        marginBottom: 2
      }}>
        <button
          type="button"
          onClick={() => {
            sound.play('click');
            if (setWap) setWap(0);
            onNavigate(gameMode === 1 ? 'rules' : 'journey');
          }}
          style={{
            position: 'relative',
            width: '100%',
            height: 52,
            borderRadius: 26,
            border: '1.5px solid #FFF0B8',
            background: 'linear-gradient(135deg, #FFE28A 0%, #F5B838 50%, #E29B12 100%)',
            color: '#1A1202',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 15,
            fontWeight: 900,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 9,
            cursor: 'pointer',
            boxShadow: '0 8px 26px rgba(245, 184, 56, 0.6), 0 3px 8px rgba(0,0,0,0.4)',
            overflow: 'hidden',
            transition: 'transform 0.15s ease'
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          onTouchStart={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
          onTouchEnd={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {/* Golden Shimmer Streak Animation */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '40%',
            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 100%)',
            transform: 'skewX(-25deg)',
            animation: 'goldBtnShine 3s infinite'
          }} />

          <span>
            {gameMode === 1 
              ? `LOCK ${TIER_CONFIGS[selectedTierIndex].cleanName || TIER_CONFIGS[selectedTierIndex].name.replace(/[ ★◆👑]/g, '')} & START RULE QUEST` 
              : `LOCK ${TIER_CONFIGS[selectedTierIndex].cleanName || TIER_CONFIGS[selectedTierIndex].name.replace(/[ ★◆👑]/g, '')} & DEPLOY TO MAP`}
          </span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1202" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
