import React, { useRef, useState, useEffect } from 'react';
import { LANES_DATA } from '../data/contestData';
import { sound } from '../utils/sound';

export default function JourneyScreen({ selectedLane, onSelectLane, wap, setWap, onNavigate }) {
  const currentLane = LANES_DATA[selectedLane] || LANES_DATA[2];
  const targets = currentLane.t;
  const maxTarget = targets[4] || 50;

  const pathRef = useRef(null);
  const [pathLut, setPathLut] = useState(null);

  // The 5 Checkpoints along the straight highway with smooth gentle curves
  const STATIONS = [
    {
      id: 'bronze',
      name: 'Bronze',
      code: 'B',
      target: targets[0],
      reward: '10K Reward Points (RM only)',
      medalBg: 'radial-gradient(circle at 32% 32%, #FFD6A5, #C67D42 58%, #7B3E14)',
      medalBorder: '#F0B98A',
      medalColor: '#3B1E08',
      symbol: '★',
      theme: '#F97316',
      accent: '#FB923C',
      glow: 'rgba(249, 115, 22, 0.45)',
      bg: 'linear-gradient(135deg, rgba(30, 20, 16, 0.95) 0%, rgba(18, 14, 20, 0.98) 100%)',
      x: 28,
      y: 78,
      cardOffsetX: 22
    },
    {
      id: 'silver',
      name: 'Silver',
      code: 'S',
      target: targets[1],
      reward: '25K Reward Points (RM only)',
      medalBg: 'radial-gradient(circle at 32% 32%, #FFFFFF, #D5DDE8 58%, #8A97A8)',
      medalBorder: '#FFFFFF',
      medalColor: '#1E293B',
      symbol: '★',
      theme: '#CBD5E1',
      accent: '#F1F5F9',
      glow: 'rgba(203, 213, 225, 0.35)',
      bg: 'linear-gradient(135deg, rgba(24, 30, 48, 0.95) 0%, rgba(14, 18, 32, 0.98) 100%)',
      x: 72,
      y: 62,
      cardOffsetX: -124
    },
    {
      id: 'gold',
      name: 'Gold',
      code: 'G',
      target: targets[2],
      reward: 'Sales Training Program, Prague',
      medalBg: 'radial-gradient(circle at 32% 32%, #FFF4B8, #F5B838 58%, #9C6F0A)',
      medalBorder: '#F6D77F',
      medalColor: '#2A1C02',
      symbol: '★',
      theme: '#F5B838',
      accent: '#FFE28A',
      glow: 'rgba(245, 184, 56, 0.65)',
      bg: 'linear-gradient(135deg, rgba(40, 28, 8, 0.96) 0%, rgba(20, 16, 6, 0.98) 100%)',
      x: 28,
      y: 46,
      cardOffsetX: 22,
      isGoal: true
    },
    {
      id: 'titanium',
      name: 'Titanium',
      code: 'T',
      target: targets[3],
      reward: 'Prague Trip + 25K Reward Points',
      medalBg: 'radial-gradient(circle at 32% 32%, #E0F2FE, #38BDF8 58%, #0369A1)',
      medalBorder: '#93C5FD',
      medalColor: '#04162C',
      symbol: '◆',
      theme: '#38BDF8',
      accent: '#7DD3FC',
      glow: 'rgba(56, 189, 248, 0.4)',
      bg: 'linear-gradient(135deg, rgba(14, 28, 52, 0.95) 0%, rgba(8, 18, 36, 0.98) 100%)',
      x: 72,
      y: 30,
      cardOffsetX: -124
    },
    {
      id: 'platinum',
      name: 'Platinum',
      code: 'P',
      target: targets[4],
      reward: 'Prague Trip + 50K Reward Points',
      medalBg: 'radial-gradient(circle at 32% 32%, #FAF5FF, #C084FC 58%, #4C1D95)',
      medalBorder: '#F3E8FF',
      medalColor: '#1A0B2E',
      symbol: '👑',
      theme: '#C084FC',
      accent: '#E9D5FF',
      glow: 'rgba(192, 132, 252, 0.45)',
      bg: 'linear-gradient(135deg, rgba(32, 18, 48, 0.96) 0%, rgba(18, 10, 30, 0.98) 100%)',
      x: 28,
      y: 14,
      cardOffsetX: 22
    }
  ];

  const sliderPct = Math.min(100, Math.max(0, (wap / maxTarget) * 100));

  // Determine next milestone for the HUD status pill & active reward line
  let nextTier = null;
  for (let i = 0; i < STATIONS.length; i++) {
    if (wap < STATIONS[i].target) {
      nextTier = STATIONS[i];
      break;
    }
  }
  const diffToNext = nextTier ? Math.max(0, +(nextTier.target - wap).toFixed(1)) : 0;
  const currentRewardTier = nextTier || STATIONS[STATIONS.length - 1];

  // Clean vertical highway with gentle curves aligned through checkpoints
  const roadPathD = "M 28 92 L 28 78 C 28 70, 72 70, 72 62 C 72 54, 28 54, 28 46 C 28 38, 72 38, 72 30 C 72 22, 28 22, 28 14 L 28 4";

  // Pre-calculate 300 points along road path and exact milestone pin distances
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    try {
      const len = path.getTotalLength();
      if (!len || isNaN(len)) return;

      const SAMPLES = 300;
      const points = [];
      const delta = 1.0;

      for (let i = 0; i <= SAMPLES; i++) {
        const d = (i / SAMPLES) * len;
        const pt = path.getPointAtLength(d);
        const ptAhead = path.getPointAtLength(Math.min(len, d + delta));
        const ptBehind = path.getPointAtLength(Math.max(0, d - delta));
        const dx = ptAhead.x - ptBehind.x;
        const dy = ptAhead.y - ptBehind.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

        points.push({
          d,
          x: +pt.x.toFixed(2),
          y: +pt.y.toFixed(2),
          angle: +angle.toFixed(1)
        });
      }

      // Find the exact distance along the path corresponding to each checkpoint pin (st.x, st.y)
      const sDists = STATIONS.map(st => {
        let bestDist = 0;
        let bestDistSq = Infinity;
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          const distSq = (p.x - st.x) ** 2 + (p.y - st.y) ** 2;
          if (distSq < bestDistSq) {
            bestDistSq = distSq;
            bestDist = p.d;
          }
        }
        return bestDist;
      });

      setPathLut({ len, points, sDists });
    } catch (err) {
      console.error('Error precomputing path LUT:', err);
    }
  }, []);

  const isFlightMode = wap >= maxTarget;

  // Sound chime when entering full takeoff flight
  const wasFullRef = useRef(false);
  useEffect(() => {
    if (isFlightMode && !wasFullRef.current) {
      sound.play('success');
      wasFullRef.current = true;
    } else if (!isFlightMode) {
      wasFullRef.current = false;
    }
  }, [isFlightMode]);

  // Synchronous calculation: Map WAP directly to milestones so airplane arrives at pins EXACTLY when unlocked
  let plane = { x: 28, y: 92, angle: 0 };
  let activePathD = '';

  if (pathLut && pathLut.points && pathLut.sDists) {
    const { len, points, sDists } = pathLut;
    const m = [
      { w: 0, d: 0 },
      { w: targets[0], d: sDists[0] },
      { w: targets[1], d: sDists[1] },
      { w: targets[2], d: sDists[2] },
      { w: targets[3], d: sDists[3] },
      { w: targets[4], d: sDists[4] }
    ];

    let targetDist = 0;
    if (wap >= m[5].w) {
      // Reached full scrolled bar: golden line covers full runway to takeoff point
      targetDist = len;
    } else {
      for (let i = 0; i < 5; i++) {
        if (wap >= m[i].w && wap <= m[i + 1].w) {
          const span = m[i + 1].w - m[i].w;
          const ratio = span > 0 ? (wap - m[i].w) / span : 0;
          targetDist = m[i].d + ratio * (m[i + 1].d - m[i].d);
          break;
        }
      }
    }

    const idx = Math.min(points.length - 1, Math.max(0, Math.round((targetDist / len) * (points.length - 1))));
    plane = points[idx];

    if (idx > 0) {
      const pts = points.slice(0, idx + 1);
      activePathD = 'M ' + pts.map(p => `${p.x} ${p.y}`).join(' L ');
    }
  }

  return (
    <div
      className="screen-animate"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        boxSizing: 'border-box',
        background: 'radial-gradient(ellipse at 50% 0%, #152248 0%, #080E24 55%, #030510 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '10px 14px 10px',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* Background Ambient Grid Mesh */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
        <defs>
          <pattern id="cleanGrid" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="16" cy="16" r="1" fill="rgba(56, 189, 248, 0.12)" />
            <path d="M 0 16 L 32 16 M 16 0 L 16 32" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cleanGrid)" />
      </svg>

      {/* ============================================================== */}
      {/* Top Header Title: Roadmap to Prague */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '2px 0 2px',
        zIndex: 10,
        flexShrink: 0
      }}>
        <span style={{ fontSize: '16px', filter: 'drop-shadow(0 0 6px rgba(245, 184, 56, 0.5))' }}>✈️</span>
        <span style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '16px',
          fontWeight: 900,
          letterSpacing: '0.05em',
          background: 'linear-gradient(135deg, #FFFFFF 20%, #FFE28A 70%, #F5B838 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textTransform: 'uppercase',
          textShadow: '0 2px 10px rgba(0,0,0,0.35)'
        }}>
          Roadmap to Prague
        </span>
      </div>

      {/* ============================================================== */}
      {/* 1. ROADMAP HIGHWAY (PLACED ABOVE) */}
      {/* ============================================================== */}
      <div style={{ position: 'relative', flex: 1, width: '100%', minHeight: 0, margin: '2px 0', overflow: 'hidden' }}>
        
        {/* SVG Minimal Dotted Roadmap Trajectory & Active Solid Golden Path */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
        >
          {/* Faint Dotted Road Ahead (Entire Track) */}
          <path
            ref={pathRef}
            d={roadPathD}
            fill="none"
            stroke="#64748B"
            strokeWidth="2.4"
            strokeDasharray="5 5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            opacity="0.32"
          />

          {/* Active Reached Track Glowing Aura (ONLY Behind Airplane) */}
          {activePathD && (
            <path
              d={activePathD}
              fill="none"
              stroke="#F5B838"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              opacity="0.35"
              style={{ filter: 'blur(3px)' }}
            />
          )}

          {/* Active Reached Track Solid Golden Highway (ONLY Behind Airplane) */}
          {activePathD && (
            <path
              d={activePathD}
              fill="none"
              stroke="#F5B838"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              style={{
                filter: 'drop-shadow(0 0 6px rgba(245, 184, 56, 0.85))'
              }}
            />
          )}
        </svg>

        {/* Dynamic Flying Jet Airplane that follows the road, takes off into flight when full */}
        <div
          className={isFlightMode ? 'flight-airborne' : ''}
          style={{
            position: 'absolute',
            left: `${plane.x}%`,
            top: `${plane.y}%`,
            transform: `translate3d(-50%, -50%, 0) rotate(${plane.angle}deg)`,
            zIndex: 9,
            pointerEvents: 'none',
            willChange: 'left, top, transform',
            transition: isFlightMode ? 'none' : 'left 0.12s ease-out, top 0.12s ease-out, transform 0.12s ease-out'
          }}
        >
          {/* Twin Jet Afterburner Flames when in flight */}
          {isFlightMode && (
            <div style={{
              position: 'absolute',
              top: '28px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '10px',
              zIndex: -1,
              pointerEvents: 'none'
            }}>
              <div className="jet-flame" />
              <div className="jet-flame" />
            </div>
          )}
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            style={{
              filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.8)) drop-shadow(0 0 10px rgba(56, 189, 248, 0.95))'
            }}
          >
            {/* Plane fuselage & wings */}
            <path
              d="M 16 2 L 18.5 9 L 29 15.5 L 29 18 L 18.5 16 L 18.5 24 L 22.5 27.5 L 22.5 29.5 L 16 28 L 9.5 29.5 L 9.5 27.5 L 13.5 24 L 13.5 16 L 3 18 L 3 15.5 L 13.5 9 Z"
              fill="#FFFFFF"
              stroke="#0284C7"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Cockpit Canopy */}
            <path
              d="M 16 6 L 17.2 11 L 14.8 11 Z"
              fill="#0284C7"
            />
            {/* Wing Accent Stripes */}
            <path
              d="M 8 16.5 L 13.5 15 M 24 16.5 L 18.5 15"
              stroke="#38BDF8"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* The 5 Highway Checkpoints */}
        {STATIONS.map((st) => {
          const isUnlocked = wap >= st.target;

          return (
            <div
              key={st.id}
              onClick={() => {
                sound.play('click');
                setWap(st.target);
              }}
              style={{
                position: 'absolute',
                left: `${st.x}%`,
                top: `${st.y}%`,
                zIndex: st.isGoal ? 8 : 5,
                cursor: 'pointer',
                opacity: isUnlocked ? 1 : 0.35,
                filter: isUnlocked ? 'none' : 'grayscale(50%)',
                transform: isUnlocked ? 'scale(1)' : 'scale(0.96)',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Waypoint Circular Pin with Letter */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                transform: 'translate(-50%, -50%)',
                width: 30,
                height: 30,
                borderRadius: 15,
                background: isUnlocked
                  ? `linear-gradient(135deg, #FFFFFF 0%, ${st.theme} 100%)`
                  : 'linear-gradient(135deg, #334155 0%, #1E293B 100%)',
                border: isUnlocked ? '2px solid #FFFFFF' : '1.5px solid #64748B',
                boxShadow: isUnlocked ? `0 0 16px ${st.glow}, 0 4px 10px rgba(0,0,0,0.6)` : '0 2px 6px rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Outfit', sans-serif",
                fontSize: '13px',
                fontWeight: 900,
                color: isUnlocked ? '#0B1228' : '#94A3B8',
                transition: 'all 0.25s ease'
              }}>
                {st.code}
              </div>

              {/* Clean Minimal Medal Box: Medal on Left, Text on Right */}
              <div style={{
                position: 'absolute',
                left: `${st.cardOffsetX}px`,
                top: 0,
                transform: 'translate(0, -50%)',
                background: isUnlocked ? st.bg : 'rgba(10, 16, 36, 0.92)',
                backdropFilter: 'blur(10px)',
                border: isUnlocked
                  ? `1.5px solid ${st.theme}`
                  : '1px solid rgba(71, 85, 105, 0.5)',
                borderRadius: '12px',
                padding: '6px 9px',
                boxShadow: isUnlocked
                  ? `0 6px 16px rgba(0,0,0,0.6), 0 0 12px ${st.glow}`
                  : '0 3px 8px rgba(0,0,0,0.4)',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                whiteSpace: 'nowrap',
                transition: 'all 0.25s ease'
              }}>
                {/* Circular Metallic Medal on Left */}
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  background: st.medalBg,
                  border: `1.5px solid ${st.medalBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: st.medalColor,
                  fontSize: st.id === 'platinum' ? '11px' : (st.id === 'titanium' ? '9.5px' : '10.5px'),
                  fontWeight: 900,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
                  flexShrink: 0
                }}>
                  {st.symbol}
                </div>

                {/* Text on Right */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '11px',
                    fontWeight: 900,
                    color: st.theme,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    lineHeight: 1.1
                  }}>
                    {st.name}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                    <span style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '15px',
                      fontWeight: 900,
                      color: '#FFFFFF',
                      lineHeight: 1
                    }}>
                      {st.target}
                    </span>
                    <span style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '10.5px',
                      fontWeight: 800,
                      color: st.accent
                    }}>
                      Lacs
                    </span>
                  </div>
                </div>
              </div>

            </div>
          );
        })}

      </div>

      {/* ============================================================== */}
      {/* 2. CONTROLS CONSOLE (PLACED BELOW ROADMAP) */}
      {/* ============================================================== */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 7, flexShrink: 0 }}>
        
        {/* Unified Sleek Console Box - Enlarged */}
        <div style={{
          background: 'rgba(13, 22, 54, 0.95)',
          backdropFilter: 'blur(14px)',
          border: '1.5px solid rgba(245, 184, 56, 0.4)',
          borderRadius: '18px',
          padding: '12px 14px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 9,
          boxShadow: '0 10px 28px rgba(0,0,0,0.55), 0 0 16px rgba(245, 184, 56, 0.15)'
        }}>
          {/* Top Line: Role Switcher Dropdown */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(245, 184, 56, 0.4)',
            borderRadius: '12px',
            padding: '8px 12px',
            gap: 10,
            cursor: 'pointer'
          }}>
            <span style={{ fontSize: '17px', flexShrink: 0 }}>🏛️</span>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: '9px', fontWeight: 900, color: '#F5B838', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                ACTIVE ROLE
              </span>
              <select
                value={selectedLane}
                onChange={(e) => {
                  sound.play('click');
                  const idx = Number(e.target.value);
                  onSelectLane(idx);
                  setWap(0);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  padding: 0,
                  margin: 0,
                  width: '100%',
                  paddingRight: '22px'
                }}
              >
                {LANES_DATA.map((l, i) => (
                  <option key={l.label} value={i} style={{ background: '#0B1430', color: '#FFFFFF', fontSize: '13.5px' }}>
                    {l.full}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Dropdown Chevron Icon */}
            <div style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F5B838'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255, 255, 255, 0.08)', width: '100%' }} />

          {/* Middle Line: WAP Slider with Ticks & Target Counter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '11px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0 }}>
                WAP
              </span>

              <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <input
                  type="range"
                  className="rtp-range"
                  min="0"
                  max={maxTarget}
                  step="0.5"
                  value={wap}
                  onChange={(e) => setWap(parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    height: '7px',
                    borderRadius: '3.5px',
                    background: `linear-gradient(to right, #F5B838 0%, #F5B838 ${sliderPct}%, #1E2950 ${sliderPct}%, #1E2950 100%)`,
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />

                {/* Milestone Ticks: B, S, G, T, P */}
                <div style={{ position: 'relative', width: '100%', height: '15px', marginTop: '2px', padding: '0 10px', boxSizing: 'border-box' }}>
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    {STATIONS.map((st) => {
                      const pct = Math.min(100, Math.max(0, (st.target / maxTarget) * 100));
                      const isReached = wap >= st.target;
                      return (
                        <div
                          key={st.id}
                          onClick={() => {
                            sound.play('click');
                            setWap(st.target);
                          }}
                          style={{
                            position: 'absolute',
                            left: `${pct}%`,
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{
                            width: '2px',
                            height: '4px',
                            background: isReached ? '#F5B838' : '#475569',
                            borderRadius: '1px'
                          }} />
                          <span style={{
                            fontSize: '8.5px',
                            fontWeight: 800,
                            color: isReached ? '#F5B838' : '#64748B',
                            lineHeight: 1,
                            marginTop: '1px'
                          }}>
                            {st.code}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* WAP Amount */}
              <div style={{
                width: '68px',
                minWidth: '68px',
                maxWidth: '68px',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'flex-end',
                gap: 2,
                flexShrink: 0
              }}>
                <span style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '22px',
                  fontWeight: 900,
                  color: '#F5B838',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  {wap}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#AEB9D6' }}>₹L</span>
              </div>
            </div>

            {/* Shortfall Status Line (Clean text line, no box) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              padding: '3px 0 1px'
            }}>
              {isFlightMode ? (
                <span style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '15px',
                  fontWeight: 900,
                  color: '#FFE28A',
                  letterSpacing: '0.02em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7
                }}>
                  <span>✈️</span> PRAGUE FLIGHT IN AIR! GRAND CHAMPION 👑
                </span>
              ) : nextTier ? (
                <>
                  <span style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '16.5px',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    letterSpacing: '0.02em'
                  }}>
                    ₹{diffToNext}L
                  </span>
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#CBD5E1'
                  }}>
                    shortfall for {nextTier.name}
                  </span>
                </>
              ) : (
                <span style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#F5B838'
                }}>
                  🎉 All Milestones Reached!
                </span>
              )}
            </div>

            {/* Dotted Line Separator */}
            <div style={{
              width: '100%',
              borderTop: '1.5px dotted rgba(255, 255, 255, 0.22)',
              margin: '2px 0 3px'
            }} />

            {/* Below Shortfall: Rewards Line (Enlarged and matching Direct Quest style) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '0 4px 2px'
            }}>
              <span style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '15px',
                fontWeight: 800,
                color: currentRewardTier.theme,
                letterSpacing: '0.02em',
                textShadow: `0 2px 10px ${currentRewardTier.glow}`
              }}>
                {currentRewardTier.reward}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* 3. BOTTOM START QUEST CTA BUTTON */}
      {/* ============================================================== */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        marginTop: '12px',
        paddingBottom: '2px'
      }}>
        {/* Primary CTA button that proceeds directly to True/False Quiz */}
        <button
          type="button"
          onClick={() => {
            sound.play('click');
            onNavigate('rules');
          }}
          style={{
            position: 'relative',
            width: '100%',
            height: '52px',
            borderRadius: '26px',
            border: '1.5px solid #FFF0B8',
            background: 'linear-gradient(135deg, #FFE28A 0%, #F5B838 50%, #E29B12 100%)',
            color: '#1A1202',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '15.5px',
            fontWeight: 900,
            letterSpacing: '0.03em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(245, 184, 56, 0.45), 0 2px 6px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            transition: 'transform 0.15s ease'
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          onTouchStart={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
          onTouchEnd={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <span>CONFIRM ROLE &amp; START RULE QUEST</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1202" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>

    </div>
  );
}
