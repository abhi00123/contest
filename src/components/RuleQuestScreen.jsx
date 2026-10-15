import React, { useState } from 'react';
import { RULE_QUEST_CARDS } from '../data/contestData';
import { sound } from '../utils/sound';

// Fisher-Yates shuffle algorithm for true random question sequencing
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function RuleQuestScreen({ onNavigate }) {
  // Questions are dynamically randomized every session
  const [cards, setCards] = useState(() => shuffleArray(RULE_QUEST_CARDS));
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState([]);
  const [userSelectedOption, setUserSelectedOption] = useState(null);
  const [cardKey, setCardKey] = useState(0);

  const done = idx >= cards.length;
  const currentCard = cards[Math.min(idx, cards.length - 1)];
  const score = results.filter(Boolean).length;

  const isAnswered = userSelectedOption !== null;
  const isCurrentCorrect = isAnswered && userSelectedOption === currentCard.correct;

  const handleSelectOption = (optIdx) => {
    if (userSelectedOption !== null) return; // Lock in selection once answered
    setUserSelectedOption(optIdx);
    const isCorrect = optIdx === currentCard.correct;
    sound.play('stamp');

    const nextResults = [...results];
    nextResults[idx] = isCorrect;
    setResults(nextResults);
  };

  const handleNext = () => {
    if (userSelectedOption === null) return;

    if (idx < cards.length - 1) {
      sound.play('click');
      setIdx(idx + 1);
      setUserSelectedOption(null);
      setCardKey(prev => prev + 1);
    } else {
      sound.play('fanfare');
      setIdx(cards.length);
    }
  };

  const handleRestart = () => {
    sound.play('click');
    setCards(shuffleArray(RULE_QUEST_CARDS)); // Fresh shuffle on replay
    setIdx(0);
    setResults([]);
    setUserSelectedOption(null);
    setCardKey(prev => prev + 1);
  };

  const title = score === cards.length ? 'Grand WOW Master' : (score >= 4 ? 'Prague Scholar' : 'Contest Explorer');

  return (
    <div
      className="screen-animate"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        boxSizing: 'border-box',
        backgroundImage: "url('./assets/prague_bg.jpg'), url('/assets/prague_bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(12px, 2vh, 22px) clamp(12px, 3vw, 18px)',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* Dark Scrim Gradient for Readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(8, 14, 38, 0.88) 0%, rgba(6, 10, 28, 0.94) 55%, rgba(3, 5, 16, 0.98) 100%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Ambient Stardust */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
        <circle cx="20%" cy="15%" r="1.5" fill="rgba(245, 184, 56, 0.5)" />
        <circle cx="85%" cy="22%" r="2" fill="rgba(56, 189, 248, 0.45)" />
        <circle cx="75%" cy="75%" r="1.5" fill="rgba(245, 184, 56, 0.35)" />
      </svg>

      {/* ============================================================== */}
      {/* 1. TOP HEADER: TITLE + QUESTION COUNTER + PROGRESS BARS */}
      {/* ============================================================== */}
      {!done && (
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 'clamp(5px, 0.9vh, 9px)', flexShrink: 0 }}>
          {/* Top Row: Title & Question Counter */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{
              margin: 0,
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(21px, 2.9vh, 27px)',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.15,
              letterSpacing: '0.02em',
              textShadow: '0 2px 12px rgba(0,0,0,0.6)'
            }}>
              Know Your <span style={{ color: '#F5B838', textShadow: '0 0 16px rgba(245, 184, 56, 0.55)' }}>WOW</span>
            </h1>

            {/* Question Counter (Without box, bigger font) */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 2
            }}>
              <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(23px, 3.2vh, 29px)',
                fontWeight: 900,
                color: '#F5B838',
                lineHeight: 1,
                textShadow: '0 2px 10px rgba(245, 184, 56, 0.35)'
              }}>
                {Math.min(idx + 1, cards.length)}
              </span>
              <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(14px, 2vh, 17px)',
                fontWeight: 800,
                color: '#94A3B8',
                lineHeight: 1
              }}>
                /{cards.length}
              </span>
            </div>
          </div>

          {/* 6 Clean Segmented Progress Indicator Bars */}
          <div style={{ display: 'flex', gap: 6, width: '100%', marginTop: 2 }}>
            {cards.map((_, i) => {
              const r = results[i];
              const isCurrent = i === idx;
              let bg = 'rgba(255, 255, 255, 0.12)';
              let border = 'rgba(255, 255, 255, 0.18)';
              let glow = 'none';

              if (r === true) {
                bg = 'linear-gradient(135deg, #34D399 0%, #10B981 100%)';
                border = '#34D399';
                glow = '0 0 8px rgba(16, 185, 129, 0.7)';
              } else if (r === false) {
                bg = 'linear-gradient(135deg, #F87171 0%, #EF4444 100%)';
                border = '#F87171';
                glow = '0 0 8px rgba(239, 68, 68, 0.7)';
              } else if (isCurrent) {
                bg = 'linear-gradient(135deg, #FFFFFF 0%, #FFE28A 100%)';
                border = '#FFFFFF';
                glow = '0 0 10px rgba(255, 255, 255, 0.8)';
              }

              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 'clamp(5px, 0.7vh, 7px)',
                    borderRadius: 4,
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
      {/* 2. CENTER QUESTION CARD (Question + Options + Stamp & Answer) */}
      {/* ============================================================== */}
      {!done && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          zIndex: 2,
          padding: 'clamp(4px, 0.8vh, 10px) 0',
          minHeight: 0
        }}>
          <div
            key={cardKey}
            className={isAnswered ? 'card-stamp-recoil' : ''}
            style={{
              position: 'relative',
              width: '100%',
              borderRadius: 'clamp(18px, 2.4vh, 24px)',
              background: 'linear-gradient(165deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%)',
              backdropFilter: 'blur(20px)',
              border: !isAnswered
                ? '1.5px solid rgba(255, 255, 255, 0.95)'
                : (isCurrentCorrect ? '2.5px solid #10B981' : '2.5px solid #EF4444'),
              padding: isAnswered
                ? 'clamp(13px, 1.9vh, 20px) clamp(13px, 2.6vw, 18px)'
                : 'clamp(18px, 2.6vh, 26px) clamp(14px, 2.8vw, 20px)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: !isAnswered
                ? '0 16px 45px rgba(0, 0, 0, 0.5), 0 0 25px rgba(233, 185, 73, 0.12)'
                : (isCurrentCorrect
                    ? '0 18px 45px rgba(0, 0, 0, 0.55), 0 0 28px rgba(16, 185, 129, 0.35)'
                    : '0 18px 45px rgba(0, 0, 0, 0.55), 0 0 28px rgba(239, 68, 68, 0.35)'),
              animation: !isAnswered ? 'screenFadeIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards' : undefined,
              transition: 'border-color 0.25s ease, box-shadow 0.25s ease, padding 0.2s ease',
              overflow: 'hidden'
            }}
          >
            {/* Question Statement */}
            <h2 style={{
              margin: 0,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: isAnswered ? 'clamp(14.5px, 1.95vh, 18px)' : 'clamp(16px, 2.2vh, 20px)',
              fontWeight: 800,
              lineHeight: 1.35,
              color: '#0F172A',
              letterSpacing: '-0.01em',
              transition: 'font-size 0.2s ease'
            }}>
              {currentCard.q}
            </h2>

            {/* Options List */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isAnswered ? 'clamp(5px, 0.8vh, 8px)' : 'clamp(7px, 1.1vh, 10px)',
              marginTop: isAnswered ? 'clamp(10px, 1.4vh, 15px)' : 'clamp(14px, 2.2vh, 22px)',
              width: '100%',
              zIndex: 2,
              transition: 'all 0.2s ease'
            }}>
              {currentCard.options.map((optionText, optIdx) => {
                const optionLetters = ['A', 'B', 'C', 'D'];
                const isSelected = userSelectedOption === optIdx;
                const isCorrectOption = optIdx === currentCard.correct;

                // Visual state calculations
                let optionBorder = '1.5px solid #CBD5E1';
                let optionBg = 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)';
                let optionColor = '#0F172A';
                let optionShadow = '0 2px 6px rgba(15, 23, 42, 0.05)';
                let optionOpacity = 1;
                let badgeBg = 'linear-gradient(135deg, #0B1536 0%, #15244E 100%)';
                let badgeColor = '#FFE28A';
                let badgeBorder = '1px solid rgba(233, 185, 73, 0.4)';

                if (isAnswered) {
                  if (isCorrectOption) {
                    optionBorder = '2px solid #10B981';
                    optionBg = 'linear-gradient(135deg, #064E3B 0%, #047857 100%)';
                    optionColor = '#FFFFFF';
                    optionShadow = '0 4px 14px rgba(16, 185, 129, 0.3)';
                    badgeBg = 'linear-gradient(135deg, #A7F3D0 0%, #34D399 100%)';
                    badgeColor = '#064E3B';
                    badgeBorder = 'none';
                  } else if (isSelected && !isCorrectOption) {
                    optionBorder = '2px solid #EF4444';
                    optionBg = 'linear-gradient(135deg, #7F1D1D 0%, #B91C1C 100%)';
                    optionColor = '#FFFFFF';
                    optionShadow = '0 4px 14px rgba(239, 68, 68, 0.3)';
                    badgeBg = 'linear-gradient(135deg, #FECACA 0%, #F87171 100%)';
                    badgeColor = '#7F1D1D';
                    badgeBorder = 'none';
                  } else {
                    optionOpacity = 0.52;
                    optionBorder = '1px solid #E2E8F0';
                    optionBg = '#F8FAFC';
                  }
                } else if (isSelected) {
                  optionBorder = '2px solid #E9B949';
                  optionBg = 'linear-gradient(135deg, #0B1536 0%, #15244E 100%)';
                  optionColor = '#FFFFFF';
                  optionShadow = '0 0 16px rgba(233, 185, 73, 0.4), 0 4px 12px rgba(0,0,0,0.25)';
                  badgeBg = 'linear-gradient(135deg, #FFE28A 0%, #F5B838 100%)';
                  badgeColor = '#0B1536';
                  badgeBorder = 'none';
                }

                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    role="button"
                    tabIndex={0}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 'clamp(8px, 1.5vw, 12px)',
                      minHeight: isAnswered ? 'clamp(36px, 4.7vh, 44px)' : 'clamp(44px, 5.8vh, 52px)',
                      padding: isAnswered
                        ? 'clamp(5px, 0.8vh, 8px) clamp(10px, 2vw, 14px)'
                        : 'clamp(7px, 1.1vh, 11px) clamp(12px, 2.2vw, 16px)',
                      borderRadius: 'clamp(10px, 1.4vh, 14px)',
                      border: optionBorder,
                      background: optionBg,
                      color: optionColor,
                      opacity: optionOpacity,
                      cursor: isAnswered ? 'default' : 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: optionShadow,
                      userSelect: 'none'
                    }}
                    onMouseDown={(e) => { if (!isAnswered) e.currentTarget.style.transform = 'scale(0.98)'; }}
                    onMouseUp={(e) => { if (!isAnswered) e.currentTarget.style.transform = 'scale(1)'; }}
                    onTouchStart={(e) => { if (!isAnswered) e.currentTarget.style.transform = 'scale(0.98)'; }}
                    onTouchEnd={(e) => { if (!isAnswered) e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.5vw, 12px)', minWidth: 0 }}>
                      {/* Option Letter Badge: A, B, C, D */}
                      <div style={{
                        width: isAnswered ? 'clamp(22px, 2.8vh, 25px)' : 'clamp(24px, 3.2vh, 28px)',
                        height: isAnswered ? 'clamp(22px, 2.8vh, 25px)' : 'clamp(24px, 3.2vh, 28px)',
                        borderRadius: '50%',
                        background: badgeBg,
                        color: badgeColor,
                        border: badgeBorder,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 'clamp(11px, 1.4vh, 12.5px)',
                        fontWeight: 900,
                        flexShrink: 0,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.18)'
                      }}>
                        {optionLetters[optIdx]}
                      </div>
                      {/* Option Text */}
                      <span style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: isAnswered ? 'clamp(13px, 1.7vh, 15.5px)' : 'clamp(14px, 1.85vh, 16.5px)',
                        fontWeight: 800,
                        lineHeight: 1.25
                      }}>
                        {optionText}
                      </span>
                    </div>

                    {/* Right Status Indicator Pill */}
                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: isAnswered
                        ? (isCorrectOption
                            ? '1.5px solid #A7F3D0'
                            : (isSelected ? '1.5px solid #FECACA' : '1.5px solid #CBD5E1'))
                        : (isSelected ? '2px solid #F5B838' : '1.5px solid #CBD5E1'),
                      background: isAnswered
                        ? (isCorrectOption
                            ? '#10B981'
                            : (isSelected ? '#EF4444' : 'transparent'))
                        : (isSelected ? '#F5B838' : 'transparent'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 900
                    }}>
                      {isAnswered && isCorrectOption && '✓'}
                      {isAnswered && isSelected && !isCorrectOption && '✕'}
                      {!isAnswered && isSelected && (
                        <div style={{ width: 6, height: 6, borderRadius: 3, background: '#0B1536' }} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ============================================================== */}
            {/* SIMPLE, SLEEK STAMP + CORRECT ANSWER & EXPLANATION VERDICT PANEL */}
            {/* ============================================================== */}
            {isAnswered && (
              <div
                className="verdict-panel-animate"
                style={{
                  position: 'relative',
                  marginTop: 'clamp(10px, 1.4vh, 14px)',
                  borderRadius: 'clamp(12px, 1.6vh, 16px)',
                  background: isCurrentCorrect
                    ? 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)'
                    : 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
                  border: `1.5px solid ${isCurrentCorrect ? '#22C55E' : '#EF4444'}`,
                  padding: 'clamp(10px, 1.4vh, 14px) clamp(11px, 2.2vw, 15px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'clamp(8px, 2vw, 12px)',
                  boxShadow: isCurrentCorrect
                    ? '0 6px 18px rgba(34, 197, 94, 0.16)'
                    : '0 6px 18px rgba(239, 68, 68, 0.16)',
                  zIndex: 5,
                  overflow: 'visible'
                }}
              >
                {/* Left Column: Clean Answer (only if wrong) + Rule Explanation */}
                <div style={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'clamp(4px, 0.6vh, 6px)',
                  textAlign: 'left'
                }}>
                  {/* Clean Correct Answer Line (Only shown when user selects wrong answer) */}
                  {!isCurrentCorrect && (
                    <div style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 'clamp(12px, 1.6vh, 14px)',
                      fontWeight: 800,
                      color: '#0F172A',
                      lineHeight: 1.3
                    }}>
                      <span style={{ color: '#B91C1C', fontWeight: 900 }}>Answer: </span>
                      {currentCard.answerText}
                    </div>
                  )}

                  {/* Detailed Rule Insight */}
                  <p style={{
                    margin: 0,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 'clamp(11.5px, 1.5vh, 13px)',
                    fontWeight: 600,
                    lineHeight: 1.4,
                    color: '#1E293B'
                  }}>
                    {currentCard.why}
                  </p>
                </div>

                {/* Right Column: Simple, Sleek Circular Stamp with Dual Shockwave Animation */}
                <div
                  className="stamp-slam-container"
                  style={{
                    position: 'relative',
                    width: 'clamp(80px, 11vh, 96px)',
                    height: 'clamp(80px, 11vh, 96px)',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    zIndex: 10
                  }}
                >
                  {/* Primary Expanding Shockwave Ring on Impact */}
                  <div
                    className="stamp-shockwave"
                    style={{
                      position: 'absolute',
                      inset: -4,
                      borderRadius: '50%',
                      border: `2px solid ${isCurrentCorrect ? '#22C55E' : '#EF4444'}`,
                      pointerEvents: 'none'
                    }}
                  />
                  {/* Secondary Delayed Shockwave Ripple */}
                  <div
                    className="stamp-shockwave-delayed"
                    style={{
                      position: 'absolute',
                      inset: -8,
                      borderRadius: '50%',
                      border: `1.5px solid ${isCurrentCorrect ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`,
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Clean, Simple & Crisp Circular Vector Stamp */}
                  <svg
                    viewBox="0 0 140 140"
                    style={{
                      width: '100%',
                      height: '100%',
                      filter: `drop-shadow(0 6px 16px ${isCurrentCorrect ? 'rgba(22, 163, 74, 0.32)' : 'rgba(220, 38, 38, 0.35)'})`,
                      shapeRendering: 'geometricPrecision',
                      textRendering: 'geometricPrecision',
                      overflow: 'visible'
                    }}
                  >
                    {/* Clean Outer Stamp Circle */}
                    <circle
                      cx="70"
                      cy="70"
                      r="64"
                      fill="rgba(255, 255, 255, 0.98)"
                      stroke={isCurrentCorrect ? '#16A34A' : '#DC2626'}
                      strokeWidth="4"
                    />

                    {/* Simple Inner Dashed Security Ring */}
                    <circle
                      cx="70"
                      cy="70"
                      r="54"
                      fill="none"
                      stroke={isCurrentCorrect ? '#16A34A' : '#DC2626'}
                      strokeWidth="1.6"
                      strokeDasharray="5 3.5"
                    />

                    {/* Main Bold Stamped Word - Clean & Perfectly Centered */}
                    <text
                      x="70"
                      y="70"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={isCurrentCorrect ? '#15803D' : '#DC2626'}
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '19.5px',
                        fontWeight: 950,
                        letterSpacing: '0.04em'
                      }}
                    >
                      {isCurrentCorrect ? 'APPROVED' : 'RECHECK'}
                    </text>
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. BOTTOM ACTION BUTTON (Only shows when an option is selected) */}
      {/* ============================================================== */}
      {!done && (
        <div style={{ position: 'relative', zIndex: 10, width: '100%', minHeight: 'clamp(50px, 6.6vh, 64px)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {userSelectedOption !== null && (
            <button
              type="button"
              onClick={handleNext}
              style={{
                position: 'relative',
                width: '100%',
                height: 'clamp(50px, 6.6vh, 64px)',
                borderRadius: 'clamp(14px, 2vh, 20px)',
                border: '1.5px solid #FFF0B8',
                background: 'linear-gradient(135deg, #FFE28A 0%, #F5B838 50%, #E29B12 100%)',
                color: '#1A1202',
                fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(18.5px, 2.5vh, 22.5px)',
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
                animation: 'screenFadeIn 0.22s ease',
                transition: 'transform 0.15s ease'
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              onTouchStart={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
              onTouchEnd={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '40%',
                background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 100%)',
                transform: 'skewX(-25deg)',
                animation: 'goldBtnShine 3s infinite'
              }} />

              <span style={{ whiteSpace: 'nowrap', WebkitTextStroke: '0.6px #1A1202' }}>{idx === cards.length - 1 ? 'VIEW RESULTS' : 'NEXT'}</span>
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
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. RESULTS SCREEN - Clean, Elegant Luxury Victory Card */}
      {/* ============================================================== */}
      {/* ============================================================== */}
      {/* 4. RESULTS SCREEN - Clean, Open Layout */}
      {/* ============================================================== */}
      {done && (
        <div
          className="screen-animate"
          style={{
            position: 'relative',
            zIndex: 5,
            width: '100%',
            height: '100%',
            flex: 1,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'clamp(10px, 1.6vh, 16px)',
            textAlign: 'center',
            padding: 'clamp(8px, 1.5vh, 16px) 0 0'
          }}
        >
          {/* Hero Floating Prague Golden Travel Stamp */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 'clamp(2px, 1vh, 10px)' }}>
            {/* Soft Ambient Halo */}
            <div style={{
              position: 'absolute',
              width: 'clamp(230px, 32vh, 290px)',
              height: 'clamp(230px, 32vh, 290px)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245, 184, 56, 0.55) 0%, rgba(245, 184, 56, 0.18) 50%, rgba(245, 184, 56, 0) 75%)',
              filter: 'blur(20px)',
              pointerEvents: 'none'
            }} />

            {/* Prague Golden Travel Stamp Asset */}
            <img
              src="./assets/Prague_Golden_Travel_Stamp.png"
              alt="Prague Golden Travel Stamp"
              onError={(e) => {
                if (!e.target.src.includes('/assets/Prague_Golden_Travel_Stamp.png')) {
                  e.target.src = '/assets/Prague_Golden_Travel_Stamp.png';
                }
              }}
              style={{
                width: 'clamp(200px, 28vh, 250px)',
                height: 'clamp(200px, 28vh, 250px)',
                objectFit: 'contain',
                filter: 'drop-shadow(0 16px 32px rgba(245, 184, 56, 0.7)) drop-shadow(0 8px 18px rgba(0,0,0,0.7))',
                animation: 'rtpFloat 3.2s ease-in-out infinite',
                position: 'relative',
                zIndex: 2
              }}
            />
          </div>

          {/* Clean Main Content Block */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.2vh, 12px)', width: '100%' }}>
            {/* Achievement Tier (Clean text without box or emoji) */}
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(14px, 2vh, 18px)',
              fontWeight: 800,
              color: '#FFE28A',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>
              {title}
            </span>

            {/* Clean Score Counter (Score only, e.g. 2/6, stamps collected removed) */}
            <h2 style={{
              margin: 0,
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(36px, 5.4vh, 48px)',
              fontWeight: 950,
              color: '#FFFFFF',
              letterSpacing: '0.01em',
              lineHeight: 1.1
            }}>
              <span style={{ color: '#F5B838' }}>{score}</span>
              <span style={{ color: '#94A3B8', fontSize: '0.65em', fontWeight: 800 }}>/{cards.length}</span>
            </h2>

            {/* Sleek Golden Progress Meter */}
            <div style={{
              width: '100%',
              maxWidth: '220px',
              height: 'clamp(6px, 0.9vh, 8px)',
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
              margin: '2px 0'
            }}>
              <div style={{
                width: `${Math.max(10, (score / cards.length) * 100)}%`,
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
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(14px, 1.9vh, 16.5px)',
              fontWeight: 600,
              lineHeight: 1.45,
              color: '#CBD5E1',
              maxWidth: '340px'
            }}>
              {score === cards.length
                ? 'Flawless score! You have mastered every contest rule. Safe travels to Prague!'
                : 'Great effort! Replay anytime to master all rules and qualify for Prague.'}
            </p>
          </div>

          {/* Contest Queries Support Note - Unboxed & Updated to ZH / AH TPP */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'clamp(5px, 0.9vh, 8px)',
            width: '100%',
            maxWidth: '350px',
            margin: '2px 0 0',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 'clamp(17px, 2.3vh, 21px)' }}>💬</span>
              <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(14.5px, 2vh, 17.5px)',
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
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(13.5px, 1.85vh, 16px)',
              fontWeight: 600,
              color: '#E2E8F0',
              lineHeight: 1.45
            }}>
              For any questions regarding targets or contest rules, please contact your <strong style={{ color: '#FFFFFF', fontWeight: 800 }}>ZH / AH TPP</strong>.
            </p>
          </div>

          {/* Action Navigation Buttons */}
          <div style={{ display: 'flex', gap: 10, width: '100%', flexShrink: 0 }}>
            <button
              type="button"
              onClick={handleRestart}
              style={{
                flex: 1,
                height: 'clamp(50px, 6.4vh, 60px)',
                borderRadius: 'clamp(14px, 2vh, 20px)',
                border: '1.5px solid rgba(245, 184, 56, 0.4)',
                background: 'rgba(18, 30, 69, 0.85)',
                color: '#FFFFFF',
                fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(15.5px, 2.1vh, 18.5px)',
                fontWeight: 900,
                WebkitTextStroke: '0.4px #FFFFFF',
                letterSpacing: '0.02em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.15s ease'
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <span style={{ WebkitTextStroke: '0.4px #FFFFFF' }}>Play Again</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('lane')}
              style={{
                flex: 1.25,
                height: 'clamp(50px, 6.4vh, 60px)',
                borderRadius: 'clamp(14px, 2vh, 20px)',
                border: '1.5px solid #FFF0B8',
                background: 'linear-gradient(135deg, #FFE28A 0%, #F5B838 50%, #E29B12 100%)',
                color: '#1A1202',
                fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(15.5px, 2.1vh, 18.5px)',
                fontWeight: 900,
                WebkitTextStroke: '0.5px #1A1202',
                letterSpacing: '0.02em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(245, 184, 56, 0.55), 0 2px 6px rgba(0,0,0,0.35)',
                transition: 'transform 0.15s ease'
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <span style={{ WebkitTextStroke: '0.5px #1A1202' }}>Review Lane</span>
              <span style={{ fontSize: '18px', fontWeight: 900, WebkitTextStroke: '0.5px #1A1202' }}>➔</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
