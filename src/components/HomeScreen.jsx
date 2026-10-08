import React from 'react';
import { sound } from '../utils/sound';

export default function HomeScreen({ onNavigate }) {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      maxHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#070D1E',
      overflow: 'hidden'
    }}>
      {/* Full Screen Poster: fills 100% of the screen with 0% side cut and 0% bottom gap */}
      <div style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}>
        <img
          src="/assets/Prague Winners International Training Poster.png"
          alt="Road to Prague – CEO's World of Winners"
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
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 20
      }}>
        <button
          onClick={() => {
            sound.play('click');
            onNavigate('lane');
          }}
          className="primary-btn rtp-cta"
          style={{
            height: '56px',
            borderRadius: '28px',
            fontSize: '17px',
            fontWeight: 800,
            letterSpacing: '.02em',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 24px rgba(233, 185, 73, 0.5)'
          }}
        >
          Start the journey
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
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
