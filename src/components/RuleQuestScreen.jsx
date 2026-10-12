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

  const handleNext = () => {
    if (userSelectedOption === null) return;
    const isCorrect = userSelectedOption === currentCard.correct;

    const nextResults = [...results];
    nextResults[idx] = isCorrect;
    setResults(nextResults);

    if (idx < cards.length - 1) {
      sound.play('click');
      setIdx(idx + 1);
      setUserSelectedOption(null);
      setCardKey(prev => prev + 1);
    } else {
      sound.play('stamp');
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
        padding: 'clamp(14px, 2.4vh, 26px) clamp(12px, 3vw, 18px)',
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
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1vh, 10px)' }}>
          {/* Top Row: Title & Question Counter */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{
              margin: 0,
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(22px, 3vh, 28px)',
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
                fontSize: 'clamp(24px, 3.4vh, 30px)',
                fontWeight: 900,
                color: '#F5B838',
                lineHeight: 1,
                textShadow: '0 2px 10px rgba(245, 184, 56, 0.35)'
              }}>
                {Math.min(idx + 1, cards.length)}
              </span>
              <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(15px, 2.1vh, 18px)',
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
              const isAnswered = i < idx;
              const isCurrent = i === idx;
              let bg = 'rgba(255, 255, 255, 0.12)';
              let border = 'rgba(255, 255, 255, 0.18)';
              let glow = 'none';

              if (isAnswered) {
                bg = 'linear-gradient(135deg, #FFE28A 0%, #F5B838 100%)';
                border = '#F5B838';
                glow = '0 0 8px rgba(245, 184, 56, 0.6)';
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
      {/* 2. CENTER QUESTION CARD (Direct Question + Options Selection) */}
      {/* ============================================================== */}
      {!done && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          zIndex: 2,
          padding: 'clamp(6px, 1vh, 14px) 0'
        }}>
          <div
            key={cardKey}
            style={{
              position: 'relative',
              width: '100%',
              borderRadius: 'clamp(18px, 2.4vh, 24px)',
              background: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(20px)',
              border: '1.5px solid rgba(255, 255, 255, 0.95)',
              padding: 'clamp(18px, 2.6vh, 26px) clamp(14px, 2.8vw, 20px)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 16px 45px rgba(0, 0, 0, 0.5), 0 0 25px rgba(233, 185, 73, 0.12)',
              animation: 'screenFadeIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              overflow: 'hidden'
            }}
          >
            {/* Question Statement */}
            <h2 style={{
              margin: 0,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(16px, 2.2vh, 20px)',
              fontWeight: 800,
              lineHeight: 1.4,
              color: '#0F172A',
              letterSpacing: '-0.01em'
            }}>
              {currentCard.q}
            </h2>

            {/* Options List */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(7px, 1.1vh, 10px)',
              marginTop: 'clamp(14px, 2.2vh, 22px)',
              width: '100%',
              zIndex: 2
            }}>
              {currentCard.options.map((optionText, optIdx) => {
                const optionLetters = ['A', 'B', 'C', 'D'];
                const isSelected = userSelectedOption === optIdx;

                return (
                  <div
                    key={optIdx}
                    onClick={() => {
                      sound.play('click');
                      setUserSelectedOption(optIdx);
                    }}
                    role="button"
                    tabIndex={0}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 'clamp(8px, 1.5vw, 12px)',
                      minHeight: 'clamp(44px, 5.8vh, 52px)',
                      padding: 'clamp(7px, 1.1vh, 11px) clamp(12px, 2.2vw, 16px)',
                      borderRadius: 'clamp(11px, 1.5vh, 14px)',
                      border: isSelected ? '2px solid #E9B949' : '1.5px solid #CBD5E1',
                      background: isSelected
                        ? 'linear-gradient(135deg, #0B1536 0%, #15244E 100%)'
                        : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
                      color: isSelected ? '#FFFFFF' : '#0F172A',
                      cursor: 'pointer',
                      transition: 'all 0.16s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: isSelected
                        ? '0 0 16px rgba(233, 185, 73, 0.4), 0 4px 12px rgba(0,0,0,0.25)'
                        : '0 2px 6px rgba(15, 23, 42, 0.05)',
                      userSelect: 'none'
                    }}
                    onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
                    onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    onTouchStart={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
                    onTouchEnd={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.5vw, 12px)', minWidth: 0 }}>
                      {/* Option Letter Badge: A, B, C, D */}
                      <div style={{
                        width: 'clamp(24px, 3.2vh, 28px)',
                        height: 'clamp(24px, 3.2vh, 28px)',
                        borderRadius: '50%',
                        background: isSelected
                          ? 'linear-gradient(135deg, #FFE28A 0%, #F5B838 100%)'
                          : 'linear-gradient(135deg, #0B1536 0%, #15244E 100%)',
                        color: isSelected ? '#0B1536' : '#FFE28A',
                        border: isSelected ? 'none' : '1px solid rgba(233, 185, 73, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 'clamp(11.5px, 1.5vh, 13px)',
                        fontWeight: 900,
                        flexShrink: 0,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                      }}>
                        {optionLetters[optIdx]}
                      </div>
                      {/* Option Text */}
                      <span style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 'clamp(14px, 1.85vh, 16.5px)',
                        fontWeight: 900,
                        lineHeight: 1.3
                      }}>
                        {optionText}
                      </span>
                    </div>

                    {/* Radio Indicator Pill */}
                    <div style={{
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      border: isSelected ? '2px solid #F5B838' : '1.5px solid #CBD5E1',
                      background: isSelected ? '#F5B838' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {isSelected && (
                        <div style={{ width: 6, height: 6, borderRadius: 3, background: '#0B1536' }} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. BOTTOM ACTION BUTTON (Only shows when an option is selected) */}
      {/* ============================================================== */}
      {!done && (
        <div style={{ position: 'relative', zIndex: 10, width: '100%', minHeight: 'clamp(54px, 7vh, 68px)', display: 'flex', alignItems: 'center' }}>
          {userSelectedOption !== null && (
            <button
              type="button"
              onClick={handleNext}
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

              <span style={{ whiteSpace: 'nowrap', WebkitTextStroke: '0.6px #1A1202' }}>{idx === cards.length - 1 ? 'SUBMIT' : 'NEXT'}</span>
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
