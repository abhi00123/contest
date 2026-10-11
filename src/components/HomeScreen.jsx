import React from 'react';

export default function HomeScreen({ onStartJourney }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#070D1E',
        overflow: 'hidden'
      }}
    >
      {/* Full Screen Poster: fills 100% of the screen with 0% side cut and 0% bottom gap */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden'
        }}
      >
        <img
          src="./assets/Prague Winners International Training Poster.png"
          alt="Road to Prague – CEO's World of Winners"
          onError={(e) => {
            if (e.target.src !== '/assets/Prague Winners International Training Poster.png') {
              e.target.src = '/assets/Prague Winners International Training Poster.png';
            }
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block'
          }}
        />
      </div>

      {/* Floating Start Journey CTA Button */}
      <div
        style={{
          position: 'absolute',
          bottom: 'clamp(18px, 3vh, 28px)',
          left: 'clamp(14px, 4vw, 22px)',
          right: 'clamp(14px, 4vw, 22px)',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 20
        }}
      >
        <button
          type="button"
          onClick={onStartJourney}
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

          <span style={{ whiteSpace: 'nowrap', WebkitTextStroke: '0.6px #1A1202' }}>START THE JOURNEY</span>
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
  );
}
