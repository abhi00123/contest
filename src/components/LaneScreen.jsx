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
    validity: 'October only',
    pillLabel: '10K PTS',
    color: '#E3A06B',
    accentBorder: '#D97706',
    inactiveBorder: 'rgba(217, 119, 6, 0.4)',
    glowColor: 'rgba(217, 119, 6, 0.75)',
    bgGradient: 'linear-gradient(180deg, rgba(217, 119, 6, 0.35) 0%, rgba(14, 24, 60, 0.98) 100%)',
    renderIcon: (selected) => (
      <img
        src="./assets/medals/Bronze.png"
        alt="Bronze Medal"
        onError={(e) => {
          if (!e.target.src.includes('/assets/medals/Bronze.png')) {
            e.target.src = '/assets/medals/Bronze.png';
          }
        }}
        style={{
          width: 'clamp(30px, 4.2vh, 40px)',
          height: 'clamp(30px, 4.2vh, 40px)',
          objectFit: 'contain',
          filter: selected
            ? 'drop-shadow(0 0 10px rgba(217, 119, 6, 0.85)) drop-shadow(0 3px 6px rgba(0,0,0,0.6))'
            : 'drop-shadow(0 2px 5px rgba(0,0,0,0.45))',
          transform: selected ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s ease',
          pointerEvents: 'none'
        }}
      />
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
    validity: 'October + November only',
    pillLabel: '25K PTS',
    color: '#E2E8F0',
    accentBorder: '#CBD5E1',
    inactiveBorder: 'rgba(226, 232, 240, 0.4)',
    glowColor: 'rgba(226, 232, 240, 0.75)',
    bgGradient: 'linear-gradient(180deg, rgba(226, 232, 240, 0.3) 0%, rgba(14, 24, 60, 0.98) 100%)',
    renderIcon: (selected) => (
      <img
        src="./assets/medals/Silver.png"
        alt="Silver Medal"
        onError={(e) => {
          if (!e.target.src.includes('/assets/medals/Silver.png')) {
            e.target.src = '/assets/medals/Silver.png';
          }
        }}
        style={{
          width: 'clamp(30px, 4.2vh, 40px)',
          height: 'clamp(30px, 4.2vh, 40px)',
          objectFit: 'contain',
          filter: selected
            ? 'drop-shadow(0 0 10px rgba(226, 232, 240, 0.85)) drop-shadow(0 3px 6px rgba(0,0,0,0.6))'
            : 'drop-shadow(0 2px 5px rgba(0,0,0,0.45))',
          transform: selected ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s ease',
          pointerEvents: 'none'
        }}
      />
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
    validity: 'Oct – Dec',
    pillLabel: 'PRAGUE TRIP',
    color: '#F6D77F',
    accentBorder: '#F5B838',
    inactiveBorder: 'rgba(245, 184, 56, 0.4)',
    glowColor: 'rgba(245, 184, 56, 0.85)',
    bgGradient: 'linear-gradient(180deg, rgba(245, 184, 56, 0.38) 0%, rgba(14, 24, 60, 0.98) 100%)',
    renderIcon: (selected) => (
      <img
        src="./assets/medals/Golden.png"
        alt="Gold Medal"
        onError={(e) => {
          if (!e.target.src.includes('/assets/medals/Golden.png')) {
            e.target.src = '/assets/medals/Golden.png';
          }
        }}
        style={{
          width: 'clamp(30px, 4.2vh, 40px)',
          height: 'clamp(30px, 4.2vh, 40px)',
          objectFit: 'contain',
          filter: selected
            ? 'drop-shadow(0 0 14px rgba(245, 184, 56, 0.95)) drop-shadow(0 3px 6px rgba(0,0,0,0.6))'
            : 'drop-shadow(0 2px 5px rgba(0,0,0,0.45))',
          transform: selected ? 'scale(1.12)' : 'scale(1)',
          transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s ease',
          pointerEvents: 'none'
        }}
      />
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
    validity: 'Oct – Dec',
    pillLabel: 'PRAGUE + 25K',
    color: '#93C5FD',
    accentBorder: '#3B82F6',
    inactiveBorder: 'rgba(59, 130, 246, 0.4)',
    glowColor: 'rgba(59, 130, 246, 0.85)',
    bgGradient: 'linear-gradient(180deg, rgba(59, 130, 246, 0.32) 0%, rgba(14, 24, 60, 0.98) 100%)',
    renderIcon: (selected) => (
      <img
        src="./assets/medals/Titanium.png"
        alt="Titanium Medal"
        onError={(e) => {
          if (!e.target.src.includes('/assets/medals/Titanium.png')) {
            e.target.src = '/assets/medals/Titanium.png';
          }
        }}
        style={{
          width: 'clamp(30px, 4.2vh, 40px)',
          height: 'clamp(30px, 4.2vh, 40px)',
          objectFit: 'contain',
          filter: selected
            ? 'drop-shadow(0 0 14px rgba(59, 130, 246, 0.9)) drop-shadow(0 3px 6px rgba(0,0,0,0.6))'
            : 'drop-shadow(0 2px 5px rgba(0,0,0,0.45))',
          transform: selected ? 'scale(1.12)' : 'scale(1)',
          transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s ease',
          pointerEvents: 'none'
        }}
      />
    ),
    pillBg: 'linear-gradient(135deg, #93C5FD, #3B82F6)',
    pillColor: '#0B1430'
  },
  {
    name: 'PLATINUM',
    cleanName: 'PLATINUM',
    symbol: '★',
    reward: 'Prague Trip + 50K Reward Points',
    rewardBadge: 'PRAGUE + 50K',
    subtitle: '≈50K Pts',
    validity: 'Oct – Dec',
    pillLabel: 'PRAGUE + 50K',
    color: '#C084FC',
    accentBorder: '#A855F7',
    inactiveBorder: 'rgba(168, 85, 247, 0.4)',
    glowColor: 'rgba(168, 85, 247, 0.85)',
    bgGradient: 'linear-gradient(180deg, rgba(168, 85, 247, 0.32) 0%, rgba(14, 24, 60, 0.98) 100%)',
    renderIcon: (selected) => (
      <img
        src="./assets/medals/Platinum.png"
        alt="Platinum Medal"
        onError={(e) => {
          if (!e.target.src.includes('/assets/medals/Platinum.png')) {
            e.target.src = '/assets/medals/Platinum.png';
          }
        }}
        style={{
          width: 'clamp(30px, 4.2vh, 40px)',
          height: 'clamp(30px, 4.2vh, 40px)',
          objectFit: 'contain',
          filter: selected
            ? 'drop-shadow(0 0 14px rgba(168, 85, 247, 0.9)) drop-shadow(0 3px 6px rgba(0,0,0,0.6))'
            : 'drop-shadow(0 2px 5px rgba(0,0,0,0.45))',
          transform: selected ? 'scale(1.12)' : 'scale(1)',
          transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s ease',
          pointerEvents: 'none'
        }}
      />
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

  // Onboarding hand gesture tutorial state (👆 emoji)
  const [showTutorialHand, setShowTutorialHand] = useState(true);
  const [tutorialHandPos, setTutorialHandPos] = useState(4); // Start at Platinum (index 4)
  const [handTapping, setHandTapping] = useState(false);
  const [handFading, setHandFading] = useState(false);
  const userInteractedRef = useRef(false);
  const timeoutsRef = useRef([]);
  const targetsRef = useRef(targets);

  useEffect(() => {
    targetsRef.current = targets;
  }, [targets]);

  const cancelTutorial = () => {
    userInteractedRef.current = true;
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setShowTutorialHand(false);
  };

  useEffect(() => {
    if (userInteractedRef.current) return;

    const addTimeout = (fn, delay) => {
      const id = setTimeout(() => {
        if (!userInteractedRef.current) {
          fn();
        }
      }, delay);
      timeoutsRef.current.push(id);
      return id;
    };

    // Onboarding gesture animation sequence:
    // 1. Starts on Platinum (pos 4)
    // 2. Glides smoothly to Gold (pos 2)
    addTimeout(() => {
      setTutorialHandPos(2);
    }, 1000);

    // 3. Reaches Gold, taps, selects Gold, updates number
    addTimeout(() => {
      setHandTapping(true);
      setSelectedTierIndex(2);
      if (setWap && targetsRef.current && targetsRef.current[2] !== undefined) {
        setWap(targetsRef.current[2]);
      }
      sound.play('click');
    }, 1650);

    // 4. Release tap
    addTimeout(() => {
      setHandTapping(false);
    }, 2100);

    // 5. Glides smoothly back to Platinum (pos 4)
    addTimeout(() => {
      setTutorialHandPos(4);
    }, 2900);

    // 6. Reaches Platinum, taps, selects Platinum, updates number back
    addTimeout(() => {
      setHandTapping(true);
      setSelectedTierIndex(4);
      if (setWap && targetsRef.current && targetsRef.current[4] !== undefined) {
        setWap(targetsRef.current[4]);
      }
      sound.play('click');
    }, 3550);

    // 7. Release tap
    addTimeout(() => {
      setHandTapping(false);
    }, 4000);

    // 8. Smoothly fade out hand gesture
    addTimeout(() => {
      setHandFading(true);
    }, 4800);

    // 9. Unmount hand tutorial
    addTimeout(() => {
      setShowTutorialHand(false);
    }, 5350);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [setWap]);

  const handleSelect = (index) => {
    cancelTutorial();
    sound.play('click');
    onSelectLane(index);
    if (setWap) {
      const nextTargets = LANES_DATA[index]?.t;
      if (nextTargets && nextTargets[selectedTierIndex] !== undefined) {
        setWap(nextTargets[selectedTierIndex]);
      }
    }
  };

  const handleTierSelect = (targetIdx) => {
    cancelTutorial();
    if (targetIdx === selectedTierIndex) return;
    sound.play('click');
    setSelectedTierIndex(targetIdx);
    if (setWap && targets[targetIdx] !== undefined) {
      setWap(targets[targetIdx]);
    }
  };


  return (
    <div
      className="second-screen-fadein"
      style={{
        position: 'relative',
        height: '100%',
        maxHeight: '100%',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#040818',
        padding: '0'
      }}
    >
      {/* Blurry & Darkened Prague Background Image Layer */}
      <div
        style={{
          position: 'absolute',
          inset: '-14px',
          backgroundImage: "url('./assets/prague_bg.jpg'), url('/assets/prague_bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(7px) brightness(0.58) contrast(1.15)',
          transform: 'scale(1.08)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Dark Luxury Vignette & Deepening Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 35%, rgba(6, 14, 38, 0.45) 0%, rgba(3, 7, 20, 0.88) 100%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Sky Darken & Blur Overlay for Top Bar & Medals Readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '46%',
        background: 'linear-gradient(180deg, rgba(3, 6, 18, 0.94) 0%, rgba(5, 12, 34, 0.72) 65%, rgba(3, 6, 18, 0) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Animated Airplane flying across the sky */}
      <div style={{
        position: 'absolute',
        top: 'clamp(14px, 2.5vh, 28px)',
        left: 'clamp(40px, 16vw, 90px)',
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

      {/* Responsive Content Container: Utilizes whole screen fluidly on iPhone SE, iPhone 16 Pro Max, and all mobile displays */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'clamp(14px, 2.5vh, 28px) clamp(10px, 2.8vw, 18px) clamp(12px, 2.2vh, 24px)',
          boxSizing: 'border-box',
          zIndex: 2,
          margin: '0 auto'
        }}
      >
        {/* ============================================================== */}
        {/* 2. 5 FLOATING TROPHY / MEDAL CARDS (Interactive Selection) */}
        {/* ============================================================== */}
        <div style={{
          position: 'relative',
          display: 'flex',
          width: '100%',
          zIndex: 2,
          flexShrink: 0,
          background: 'rgba(8, 14, 38, 0.45)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 'clamp(14px, 2vh, 18px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: 'clamp(5px, 0.9vh, 9px) clamp(3px, 0.8vw, 6px)',
          boxSizing: 'border-box'
        }}>
          {/* Continuous Sliding Highlight Pill (Glides smoothly through intermediate medals) */}
          <div
            style={{
              position: 'absolute',
              top: 'clamp(5px, 0.9vh, 9px)',
              bottom: 'clamp(5px, 0.9vh, 9px)',
              left: 'clamp(3px, 0.8vw, 6px)',
              width: 'calc((100% - 2 * clamp(3px, 0.8vw, 6px)) / 5)',
              transform: `translateX(${selectedTierIndex * 100}%)`,
              background: TIER_CONFIGS[selectedTierIndex].bgGradient,
              border: `1.5px solid ${TIER_CONFIGS[selectedTierIndex].accentBorder}`,
              borderRadius: 'clamp(10px, 1.4vh, 14px)',
              boxShadow: `0 0 18px ${TIER_CONFIGS[selectedTierIndex].glowColor}, 0 6px 16px rgba(0,0,0,0.55)`,
              animation: selectedTierIndex === 2 ? 'goldTierPulse 2.4s ease-in-out infinite' : (selectedTierIndex === 3 ? 'titaniumTierPulse 2.4s ease-in-out infinite' : (selectedTierIndex === 4 ? 'platinumTierPulse 2.4s ease-in-out infinite' : 'none')),
              transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.35, 1), background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
              pointerEvents: 'none',
              zIndex: 1,
              overflow: 'hidden'
            }}
          >
            {/* Subtle Shimmer Sweep Reflection for Prague Tiers (Gold, Titanium, Platinum) */}
            {selectedTierIndex >= 2 && (
              <div style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '50%',
                background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0) 100%)',
                animation: 'tierShimmerSweep 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                pointerEvents: 'none'
              }} />
            )}
          </div>

          {/* Onboarding Interactive Hand Gesture Tutorial (👆) */}
          {showTutorialHand && (
            <div
              style={{
                position: 'absolute',
                bottom: 'clamp(-28px, -3.8vh, -20px)',
                left: 'clamp(3px, 0.8vw, 6px)',
                width: 'calc((100% - 2 * clamp(3px, 0.8vw, 6px)) / 5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transform: `translateX(${tutorialHandPos * 100}%)`,
                transition: 'transform 0.65s cubic-bezier(0.25, 1, 0.35, 1), opacity 0.45s ease',
                opacity: handFading ? 0 : 1,
                pointerEvents: 'none',
                zIndex: 20
              }}
            >
              <div
                style={{
                  fontSize: 'clamp(28px, 4.2vh, 38px)',
                  lineHeight: 1,
                  filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 12px rgba(255, 255, 255, 0.6))',
                  animation: handTapping
                    ? 'handTapMotion 0.45s ease-in-out'
                    : 'handFloatMotion 1.8s ease-in-out infinite',
                  transformOrigin: 'top center'
                }}
              >
                👆
              </div>
            </div>
          )}

          {/* 5 Medal Interactive Items */}
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
                  flex: 1,
                  position: 'relative',
                  zIndex: 2,
                  background: 'transparent',
                  border: 'none',
                  borderRadius: 'clamp(10px, 1.4vh, 14px)',
                  padding: 'clamp(5px, 0.9vh, 9px) 2px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
                  transition: 'transform 0.38s cubic-bezier(0.25, 1, 0.35, 1)',
                  userSelect: 'none'
                }}
              >
                {/* Tier Icon */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                  {tier.renderIcon(isSelected)}
                </div>

                {/* Tier Label */}
                <span style={{
                  position: 'relative',
                  zIndex: 2,
                  fontSize: 'clamp(9px, 1.25vh, 12px)',
                  fontWeight: 900,
                  color: isSelected ? tier.color : '#94A3B8',
                  letterSpacing: '0.06em',
                  marginTop: 'clamp(2px, 0.35vh, 4px)',
                  transition: 'color 0.35s ease, text-shadow 0.35s ease',
                  textShadow: isSelected ? `0 0 8px ${tier.glowColor}` : 'none'
                }}>
                  {tier.name}
                </span>

                {/* Target Value with Animated Count */}
                <div style={{
                  position: 'relative',
                  zIndex: 2,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: isSelected ? 'clamp(16px, 2.2vh, 21px)' : 'clamp(14.5px, 2vh, 19.5px)',
                  fontWeight: 900,
                  color: isSelected ? '#FFFFFF' : '#CBD5E1',
                  lineHeight: 1.15,
                  marginTop: 'clamp(1px, 0.3vh, 3px)',
                  textShadow: isSelected ? `0 0 12px ${tier.glowColor}` : 'none',
                  transition: 'all 0.35s ease'
                }}>
                  <AnimatedCount value={targetVal} />
                </div>

                {/* Validity Indication (Clear, unboxed, bold text) */}
                {idx === 0 && (
                  <span style={{
                    position: 'relative',
                    zIndex: 2,
                    marginTop: 'clamp(2px, 0.4vh, 4px)',
                    fontSize: 'clamp(9.5px, 1.3vh, 12px)',
                    fontWeight: 900,
                    letterSpacing: '0.01em',
                    color: isSelected ? '#FFE28A' : '#F59E0B',
                    whiteSpace: 'nowrap',
                    lineHeight: 1.15,
                    textShadow: isSelected ? '0 0 8px rgba(245, 158, 11, 0.6)' : '0 1px 4px rgba(0, 0, 0, 0.9)'
                  }}>
                    October only
                  </span>
                )}

                {idx === 1 && (
                  <span style={{
                    position: 'relative',
                    zIndex: 2,
                    marginTop: 'clamp(2px, 0.4vh, 4px)',
                    fontSize: 'clamp(8.5px, 1.18vh, 11px)',
                    fontWeight: 900,
                    letterSpacing: '-0.01em',
                    color: isSelected ? '#FFFFFF' : '#CBD5E1',
                    lineHeight: 1.12,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    textShadow: isSelected ? '0 0 8px rgba(226, 232, 240, 0.7)' : '0 1px 4px rgba(0, 0, 0, 0.9)'
                  }}>
                    <span>October +</span>
                    <span>November only</span>
                  </span>
                )}

                {idx >= 2 && (
                  <span style={{
                    position: 'relative',
                    zIndex: 2,
                    marginTop: 'clamp(2px, 0.4vh, 4px)',
                    fontSize: 'clamp(9.5px, 1.3vh, 12px)',
                    fontWeight: 900,
                    letterSpacing: '0.02em',
                    color: isSelected ? '#FFFFFF' : '#94A3B8',
                    whiteSpace: 'nowrap',
                    lineHeight: 1.15,
                    textShadow: isSelected ? `0 0 8px ${tier.glowColor}` : '0 1px 4px rgba(0, 0, 0, 0.9)'
                  }}>
                    Oct – Dec
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* 3. SELECTED ROLE, TARGET & REWARD STATUS BANNER */}
        {/* ============================================================== */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(14, 26, 68, 0.96) 0%, rgba(8, 14, 40, 0.98) 100%)',
          border: '1.5px solid rgba(233, 185, 73, 0.6)',
          borderRadius: 'clamp(14px, 2vh, 20px)',
          padding: 'clamp(11px, 1.6vh, 16px) clamp(13px, 3.2vw, 19px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(5px, 0.9vh, 9px)',
          zIndex: 2,
          flexShrink: 0,
          boxShadow: '0 8px 24px rgba(0,0,0,0.55), 0 0 16px rgba(233, 185, 73, 0.2)'
        }}>
          {/* Row 1: Selected Role */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            <span style={{
              fontSize: 'clamp(10px, 1.35vh, 12.5px)',
              fontWeight: 900,
              color: '#F59E0B',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>
              SELECTED ROLE
            </span>
            <span style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(16px, 2.2vh, 20.5px)',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.25
            }}>
              {currentLane.full}
            </span>
          </div>

          {/* Row 2: Target Line - In front with hyphen and without box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            padding: 'clamp(1px, 0.3vh, 3px) 0'
          }}>
            <span style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(12px, 1.65vh, 15px)',
              fontWeight: 800,
              color: '#CBD5E1',
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}>
              {selectedTierIndex === 2 ? 'PRAGUE THRESHOLD' : `${TIER_CONFIGS[selectedTierIndex].cleanName} TARGET`}
            </span>
            <span style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(12px, 1.65vh, 15px)',
              fontWeight: 800,
              color: '#94A3B8'
            }}>
              -
            </span>
            <span style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(16px, 2.2vh, 20.5px)',
              fontWeight: 900,
              color: '#F5B838',
              letterSpacing: '0.01em',
              textShadow: '0 0 10px rgba(245, 184, 56, 0.35)'
            }}>
              <AnimatedCount value={targets[selectedTierIndex]} prefix="₹" suffix=" Lakh" />
            </span>
          </div>

          {/* Row 3: Selected Medal Tier Reward */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.14)',
            paddingTop: 'clamp(6px, 0.85vh, 9px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: 'clamp(3px, 0.45vh, 6px)',
            width: '100%'
          }}>
            <span style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(15px, 2vh, 18.5px)',
              fontWeight: 900,
              color: TIER_CONFIGS[selectedTierIndex].color,
              letterSpacing: '0.02em',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)'
            }}>
              {TIER_CONFIGS[selectedTierIndex].reward}
            </span>

            {/* Prominent Indication for Bronze & Silver without emoji or underline */}
            {selectedTierIndex === 0 && (
              <span style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(13px, 1.75vh, 15.5px)',
                fontWeight: 800,
                color: '#FDE68A',
                letterSpacing: '0.02em',
                textShadow: '0 1px 4px rgba(0,0,0,0.7)'
              }}>
                Applicable for <span style={{ color: '#F59E0B', fontWeight: 900 }}>October only</span>
              </span>
            )}

            {selectedTierIndex === 1 && (
              <span style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(13px, 1.75vh, 15.5px)',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '0.02em',
                textShadow: '0 1px 4px rgba(0,0,0,0.7)'
              }}>
                Applicable for <span style={{ color: '#CBD5E1', fontWeight: 900 }}>October + November only</span>
              </span>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* 4. FROSTED WHITE CARD: 10 ROLE CHIPS MATRIX */}
        {/* ============================================================== */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(18px)',
          border: '1.5px solid rgba(255, 255, 255, 0.9)',
          borderRadius: 'clamp(14px, 2vh, 20px)',
          padding: 'clamp(7px, 1.2vh, 14px) clamp(8px, 2.2vw, 14px) clamp(6px, 1vh, 12px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(4.5px, 0.8vh, 8px)',
          zIndex: 2,
          flexShrink: 0
        }}>
          {/* Header inside White Card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(5px, 0.8vw, 8px)', padding: '0 2px' }}>
            <div style={{
              width: 'clamp(15px, 2vh, 19px)',
              height: 'clamp(15px, 2vh, 19px)',
              borderRadius: '50%',
              background: '#EF4444',
              border: '2px solid #FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.25)'
            }}>
              <div style={{
                width: 'clamp(4.5px, 0.6vh, 6px)',
                height: 'clamp(4.5px, 0.6vh, 6px)',
                borderRadius: '50%',
                background: '#FFFFFF'
              }} />
            </div>
            <span style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(10.5px, 1.4vh, 13.5px)',
              fontWeight: 900,
              letterSpacing: '0.04em',
              color: '#0F172A',
              textTransform: 'uppercase'
            }}>
              SELECT YOUR ROLE
            </span>
          </div>

          {/* 10 Role Buttons (2 Columns × 5 Rows) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'clamp(4px, 0.7vh, 7.5px)',
            columnGap: 'clamp(4px, 1.2vw, 8px)',
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
                    height: 'clamp(34px, 4.9vh, 48px)',
                    borderRadius: 'clamp(8px, 1.2vh, 12px)',
                    border: isSelected ? '1.5px solid #E9B949' : '1px solid #DCE6F5',
                    background: isSelected
                      ? 'linear-gradient(135deg, #0B1536 0%, #15224D 100%)'
                      : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
                    color: isSelected ? '#FFFFFF' : '#0F172A',
                    padding: '0 clamp(6px, 1.5vw, 10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: isSelected
                      ? '0 0 14px rgba(233, 185, 73, 0.45), 0 3px 8px rgba(0,0,0,0.25)'
                      : '0 1px 4px rgba(15, 23, 42, 0.05)',
                    transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Role Label */}
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 'clamp(12px, 1.7vh, 15.5px)',
                    fontWeight: 900,
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
        </div>

        {/* ============================================================== */}
        {/* 5. COBBLESTONE GROUND & GLOWING GOLDEN ACTION BUTTON */}
        {/* ============================================================== */}
        <div style={{
          position: 'relative',
          width: '100%',
          zIndex: 2,
          flexShrink: 0
        }}>
          <button
            type="button"
            onClick={() => {
              sound.play('click');
              if (setWap) setWap(targets[selectedTierIndex] || 0);
              onNavigate(gameMode === 1 ? 'rules' : 'journey');
            }}
            style={{
              position: 'relative',
              width: '100%',
              height: 'clamp(54px, 7vh, 68px)',
              borderRadius: 'clamp(14px, 2vh, 20px)',
              border: '1.5px solid #FFF0B8',
              background: 'linear-gradient(135deg, #FFE28A 0%, #F5B838 50%, #E29B12 100%)',
              color: '#1A1202',
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(19.5px, 2.7vh, 23.5px)',
              fontWeight: 900,
              WebkitTextStroke: '0.6px #1A1202',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(8px, 1.2vw, 12px)',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(245, 184, 56, 0.55), 0 2px 6px rgba(0,0,0,0.35)',
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

            <span style={{ whiteSpace: 'nowrap', WebkitTextStroke: '0.6px #1A1202' }}>NEXT</span>
            <svg
              style={{ width: 'clamp(20px, 2.6vh, 25px)', height: 'clamp(20px, 2.6vh, 25px)', flexShrink: 0 }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1A1202"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
  </div>
);
}
