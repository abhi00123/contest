import React, { useState } from 'react';
import { RULE_QUEST_CARDS } from '../data/contestData';
import { sound } from '../utils/sound';

export default function RuleQuestScreen({ onNavigate, gameMode = 1 }) {
  const cards = RULE_QUEST_CARDS;
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [cardKey, setCardKey] = useState(0);

  const done = idx >= cards.length;
  const currentCard = cards[Math.min(idx, cards.length - 1)];
  const score = results.filter(Boolean).length;

  const handleAnswer = (userPick) => {
    if (answer !== null) return;
    const isCorrect = userPick === currentCard.a;
    if (isCorrect) sound.play('stamp');
    else sound.play('click');
    const nextResults = [...results];
    nextResults[idx] = isCorrect;
    setResults(nextResults);
    setAnswer(isCorrect);
  };

  const handleNext = () => {
    sound.play('click');
    setIdx(idx + 1);
    setAnswer(null);
    setCardKey(prev => prev + 1);
  };

  const handleRestart = () => {
    sound.play('click');
    setIdx(0);
    setResults([]);
    setAnswer(null);
    setCardKey(prev => prev + 1);
  };

  const title = score >= 7 ? 'Grand Rules Master 👑' : (score >= 5 ? 'Prague Scholar 🎓' : 'Contest Explorer 🧭');

  return (
    <div
      className="screen-animate"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        boxSizing: 'border-box',
        background: 'radial-gradient(ellipse at 50% 0%, #152248 0%, #091026 55%, #030612 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '12px 14px 12px',
        overflow: 'hidden',
        userSelect: 'none',
        gap: 10
      }}
    >
      {/* Background Ambient Stars */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
        <circle cx="20%" cy="15%" r="1.5" fill="rgba(245, 184, 56, 0.4)" />
        <circle cx="85%" cy="25%" r="2" fill="rgba(56, 189, 248, 0.4)" />
        <circle cx="70%" cy="80%" r="1.5" fill="rgba(245, 184, 56, 0.3)" />
      </svg>

      {/* ============================================================== */}
      {/* 1. CLEAN TITLE + BIG SCORE RIGHT BESIDE TITLE (Hidden on Results Screen) */}
      {/* ============================================================== */}
      {!done && (
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4 }}>
          {/* Title + Big Stamp Counter Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{
              margin: 0,
              fontFamily: "'Outfit', sans-serif",
              fontSize: '25px',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.15
            }}>
              Contest <span style={{ color: '#F5B838' }}>Rule Quest</span>
            </h1>

            {/* Current Question Count Beside Title */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '28px',
                fontWeight: 900,
                color: '#F5B838',
                lineHeight: 1
              }}>
                {Math.min(idx + 1, cards.length)}
              </span>
              <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '18px',
                fontWeight: 800,
                color: '#94A3B8'
              }}>
                /{cards.length}
              </span>
            </div>
          </div>

          {/* 8 Cleanly Spaced Progress Indicator Bars */}
          <div style={{ display: 'flex', gap: 6, width: '100%', marginTop: 2 }}>
            {cards.map((_, i) => {
              const r = results[i];
              let bg = 'rgba(255, 255, 255, 0.1)';
              let border = 'rgba(255, 255, 255, 0.15)';
              let glow = 'none';

              if (r === true) {
                bg = 'linear-gradient(135deg, #4ADE80 0%, #16A34A 100%)';
                border = '#22C55E';
                glow = '0 0 8px rgba(34, 197, 94, 0.8)';
              } else if (r === false) {
                bg = 'linear-gradient(135deg, #F87171 0%, #DC2626 100%)';
                border = '#EF4444';
                glow = '0 0 8px rgba(239, 68, 68, 0.8)';
              } else if (i === idx) {
                bg = 'linear-gradient(135deg, #FFE28A 0%, #F5B838 100%)';
                border = '#FFF0B8';
                glow = '0 0 10px rgba(245, 184, 56, 0.9)';
              }

              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    background: bg,
                    border: `1px solid ${border}`,
                    boxShadow: glow,
                    transition: 'all 0.3s ease'
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. COMPACT, CLEAN QUESTION CARD */}
      {/* ============================================================== */}
      {!done ? (
        <div
          key={cardKey}
          style={{
            position: 'relative',
            zIndex: 5,
            width: '100%',
            borderRadius: '24px',
            background: 'linear-gradient(165deg, #FFFDF8 0%, #F6EEDC 100%)',
            border: answer === null
              ? '2px solid #E6D5B8'
              : (answer ? '2.5px solid #22C55E' : '2.5px solid #EF4444'),
            padding: '24px 22px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '220px',
            boxShadow: answer === null
              ? '0 20px 45px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.4) inset'
              : (answer
                  ? '0 20px 45px rgba(0,0,0,0.55), 0 0 24px rgba(34, 197, 94, 0.4)'
                  : '0 20px 45px rgba(0,0,0,0.55), 0 0 24px rgba(239, 68, 68, 0.4)'),
            animation: 'screenFadeIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Watermark Seal */}
          <div style={{
            position: 'absolute',
            right: -25,
            bottom: -25,
            fontSize: '150px',
            opacity: 0.04,
            pointerEvents: 'none'
          }}>
            🏰
          </div>

          {/* Question Statement */}
          <div style={{
            padding: '6px 0',
            paddingRight: answer !== null ? '122px' : '0px',
            transition: 'padding-right 0.25s ease',
            zIndex: 2
          }}>
            <p style={{
              margin: 0,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '21px',
              fontWeight: 800,
              lineHeight: 1.4,
              color: '#0F172A',
              letterSpacing: '-0.01em'
            }}>
              {currentCard.s}
            </p>
          </div>

          {/* Answer Result / Guidance */}
          {answer !== null && (
            <div style={{
              marginTop: 14,
              background: answer
                ? 'linear-gradient(135deg, rgba(240, 253, 244, 0.98) 0%, rgba(220, 252, 231, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(254, 242, 242, 0.98) 0%, rgba(254, 226, 226, 0.95) 100%)',
              border: `1.5px solid ${answer ? '#22C55E' : '#EF4444'}`,
              borderRadius: '14px',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
              zIndex: 2,
              boxShadow: answer
                ? '0 4px 14px rgba(34, 197, 94, 0.15)'
                : '0 4px 14px rgba(239, 68, 68, 0.15)',
              animation: 'screenFadeIn 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '15px' }}>{answer ? '🎉' : '⚠️'}</span>
                <span style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '13px',
                  fontWeight: 900,
                  color: answer ? '#15803D' : '#B91C1C',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}>
                  {answer ? 'OFFICIAL STAMP COLLECTED!' : 'RULE MISALIGNED · RECHECK!'}
                </span>
              </div>
              <span style={{ fontSize: '12.5px', color: '#1E293B', fontWeight: 600, lineHeight: 1.45 }}>
                {currentCard.why}
              </span>
            </div>
          )}

          {/* High-Definition Physical Slam Stamp (Ultra-Sharp Vector & Prominent Large Circle) */}
          {answer !== null && (
            <div
              className="stamp-slam-container"
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                width: '118px',
                height: '118px',
                pointerEvents: 'none',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Expanding Shockwave Ring on Impact */}
              <div
                className="stamp-shockwave"
                style={{
                  position: 'absolute',
                  inset: -6,
                  borderRadius: '50%',
                  border: `2px solid ${answer ? '#22C55E' : '#EF4444'}`,
                  pointerEvents: 'none'
                }}
              />

              {/* Vector Crisp Stamp - Zero Blur & Generous Proportions */}
              <svg
                viewBox="0 0 140 140"
                width="118"
                height="118"
                style={{
                  filter: `drop-shadow(0 6px 18px ${answer ? 'rgba(22, 163, 74, 0.35)' : 'rgba(220, 38, 38, 0.4)'})`,
                  shapeRendering: 'geometricPrecision',
                  textRendering: 'geometricPrecision',
                  overflow: 'visible'
                }}
              >
                {/* Stamp Paper Fill Background */}
                <circle
                  cx="70"
                  cy="70"
                  r="65"
                  fill="rgba(255, 255, 255, 0.98)"
                  stroke={answer ? '#16A34A' : '#DC2626'}
                  strokeWidth="4"
                />

                {/* Inner Dashed Security Ring */}
                <circle
                  cx="70"
                  cy="70"
                  r="55"
                  fill="none"
                  stroke={answer ? '#16A34A' : '#DC2626'}
                  strokeWidth="1.6"
                  strokeDasharray="5 3.5"
                />

                {/* Main Bold Stamped Word - Perfectly Centered, Never Cuts Off */}
                <text
                  x="70"
                  y="70"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={answer ? '#15803D' : '#DC2626'}
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '20px',
                    fontWeight: 950,
                    letterSpacing: '0.04em'
                  }}
                >
                  {answer ? 'APPROVED' : 'RECHECK'}
                </text>
              </svg>
            </div>
          )}
        </div>
      ) : (
        /* Results Victory Card - Clean, Elegant & Uncluttered Luxury Design */
        <div
          className="screen-animate"
          style={{
            position: 'relative',
            zIndex: 5,
            width: '100%',
            flex: 1,
            background: 'linear-gradient(160deg, rgba(18, 30, 68, 0.96) 0%, rgba(8, 14, 34, 0.99) 100%)',
            border: '1.5px solid rgba(245, 184, 56, 0.55)',
            borderRadius: '28px',
            padding: '28px 20px 22px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            textAlign: 'center',
            boxShadow: '0 24px 60px rgba(0,0,0,0.65), 0 0 35px rgba(245, 184, 56, 0.18)',
            overflow: 'hidden'
          }}
        >
          {/* Hero Floating Medal with Soft Golden Ambient Halo */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
            {/* Soft Ambient Halo */}
            <div style={{
              position: 'absolute',
              width: 110,
              height: 110,
              borderRadius: 55,
              background: 'radial-gradient(circle, rgba(245, 184, 56, 0.35) 0%, rgba(245, 184, 56, 0) 70%)',
              filter: 'blur(10px)',
              pointerEvents: 'none'
            }} />

            {/* Radiant 3D Trophy Orb */}
            <div style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              background: 'radial-gradient(circle at 35% 35%, #FFF8E1 0%, #F5B838 52%, #9C6F0A 100%)',
              border: '3px solid #FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '44px',
              boxShadow: '0 12px 30px rgba(245, 184, 56, 0.5), 0 4px 12px rgba(0,0,0,0.4)',
              animation: 'rtpFloat 3.2s ease-in-out infinite',
              position: 'relative'
            }}>
              {score === 8 ? '👑' : (score >= 5 ? '🏆' : '🎖️')}
            </div>
          </div>

          {/* Clean Main Content Block */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: '100%' }}>
            {/* Achievement Tier Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(245, 184, 56, 0.12)',
              border: '1px solid rgba(245, 184, 56, 0.4)',
              padding: '5px 16px',
              borderRadius: '20px'
            }}>
              <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '13px',
                fontWeight: 800,
                color: '#FFE28A',
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}>
                {title}
              </span>
            </div>

            {/* Large Bold Stamp Counter */}
            <h2 style={{
              margin: 0,
              fontFamily: "'Outfit', sans-serif",
              fontSize: '32px',
              fontWeight: 950,
              color: '#FFFFFF',
              letterSpacing: '0.01em',
              lineHeight: 1.15
            }}>
              {score} / 8 Stamps Collected
            </h2>

            {/* Sleek Golden Progress Meter */}
            <div style={{
              width: '100%',
              maxWidth: '220px',
              height: 7,
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
              margin: '2px 0'
            }}>
              <div style={{
                width: `${Math.max(10, (score / 8) * 100)}%`,
                height: '100%',
                borderRadius: 4,
                background: 'linear-gradient(90deg, #F5B838 0%, #22C55E 100%)',
                boxShadow: '0 0 10px rgba(245, 184, 56, 0.6)',
                transition: 'width 0.6s ease'
              }} />
            </div>

            {/* Clean Inspiring Description */}
            <p style={{
              margin: '4px 0 0',
              fontSize: '13.5px',
              fontWeight: 500,
              lineHeight: 1.5,
              color: '#CBD5E1',
              maxWidth: '310px'
            }}>
              {score === 8
                ? 'Flawless score! You have mastered every contest rule. Safe travels to Prague!'
                : 'Great effort! Replay anytime to master all rules and claim your Prague stamps.'}
            </p>
          </div>

          {/* Contest Queries Support Note - Unboxed & Bigger Size */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 5,
            width: '100%',
            maxWidth: '330px',
            margin: '2px 0 0',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: '18px' }}>💬</span>
              <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '15px',
                fontWeight: 900,
                color: '#38BDF8',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                Contest Queries?
              </span>
            </div>
            <p style={{
              margin: 0,
              fontSize: '13.5px',
              fontWeight: 600,
              color: '#CBD5E1',
              lineHeight: 1.45
            }}>
              For any questions regarding targets or contest rules, please contact your <strong style={{ color: '#FFFFFF', fontWeight: 800 }}>Sales Manager (SM)</strong>.
            </p>
          </div>

          {/* Action Navigation Buttons */}
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button
              type="button"
              onClick={handleRestart}
              style={{
                flex: 1,
                height: 50,
                borderRadius: 25,
                border: '1.5px solid rgba(245, 184, 56, 0.4)',
                background: 'rgba(18, 30, 69, 0.85)',
                color: '#FFFFFF',
                fontFamily: "'Outfit', sans-serif",
                fontSize: '15px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer',
                transition: 'transform 0.15s ease'
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <span>🔄 Play Again</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate(gameMode === 1 ? 'lane' : 'journey')}
              style={{
                flex: 1.25,
                height: 50,
                borderRadius: 25,
                border: 'none',
                background: 'linear-gradient(135deg, #FFE28A 0%, #F5B838 50%, #E29B12 100%)',
                color: '#1A1202',
                fontFamily: "'Outfit', sans-serif",
                fontSize: '15.5px',
                fontWeight: 950,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(245, 184, 56, 0.45)',
                transition: 'transform 0.15s ease'
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <span>{gameMode === 1 ? 'Review Lane' : 'Review Roadmap'}</span>
              <span style={{ fontSize: '17px' }}>➔</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. CLEAN TRUE & FALSE BUTTONS */}
      {/* ============================================================== */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {!done && (
          answer === null ? (
            <div style={{ display: 'flex', gap: 14 }}>
              {/* FALSE BUTTON */}
              <button
                type="button"
                onClick={() => handleAnswer(false)}
                style={{
                  flex: 1,
                  height: 56,
                  borderRadius: 28,
                  border: '1.5px solid rgba(239, 68, 68, 0.6)',
                  background: 'linear-gradient(135deg, #1C1E38 0%, #121528 100%)',
                  color: '#FFFFFF',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '17px',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.4)',
                  transition: 'all 0.15s ease'
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.96)'; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                onTouchStart={(e) => { e.currentTarget.style.transform = 'scale(0.96)'; }}
                onTouchEnd={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                FALSE
              </button>

              {/* TRUE BUTTON */}
              <button
                type="button"
                onClick={() => handleAnswer(true)}
                style={{
                  flex: 1,
                  height: 56,
                  borderRadius: 28,
                  border: '1.5px solid #FFF0B8',
                  background: 'linear-gradient(135deg, #FFE28A 0%, #F5B838 50%, #E29B12 100%)',
                  color: '#1A1202',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '17px',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(245, 184, 56, 0.45)',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.96)'; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                onTouchStart={(e) => { e.currentTarget.style.transform = 'scale(0.96)'; }}
                onTouchEnd={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                {/* Shimmer reflection */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  width: '45%',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
                  transform: 'skewX(-25deg)',
                  animation: 'goldBtnShine 3s infinite'
                }} />

                TRUE
              </button>
            </div>
          ) : (
            /* NEXT CARD CTA */
            <button
              type="button"
              onClick={handleNext}
              style={{
                position: 'relative',
                width: '100%',
                height: 56,
                borderRadius: 28,
                border: '1.5px solid #FFF0B8',
                background: 'linear-gradient(135deg, #FFE28A 0%, #F5B838 50%, #E29B12 100%)',
                color: '#1A1202',
                fontFamily: "'Outfit', sans-serif",
                fontSize: '17px',
                fontWeight: 900,
                letterSpacing: '0.03em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(245, 184, 56, 0.45)',
                overflow: 'hidden'
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <span>{idx === cards.length - 1 ? 'VIEW FINAL RESULTS 🏆' : 'NEXT QUESTION CARD'}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1202" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          )
        )}
      </div>

    </div>
  );
}
