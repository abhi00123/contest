import React, { useState, useEffect, useRef } from 'react';

export default function LoaderScreen({ onLoaded }) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const animFrameRef = useRef(null);
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    const startTime = performance.now();
    const minDisplayMs = 1200; // smooth minimum display so it doesn't flash if cached
    let isVideoReady = false;

    // 1. Preload Poster Image
    const poster = new Image();
    poster.src = './assets/Prague Winners International Training Poster.png';
    poster.onerror = () => {
      poster.src = '/assets/Prague Winners International Training Poster.png';
    };

    // 2. Preload Video
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    video.src = './assets/clip.mp4';
    video.onerror = () => {
      if (!video.src.endsWith('/assets/clip.mp4')) {
        video.src = '/assets/clip.mp4';
      }
    };

    const handleReady = () => {
      isVideoReady = true;
      checkFinish();
    };

    video.addEventListener('canplaythrough', handleReady);
    video.addEventListener('loadeddata', () => {
      isVideoReady = true;
      checkFinish();
    });

    const checkFinish = () => {
      if (!isMounted || hasFinishedRef.current) return;
      const elapsed = performance.now() - startTime;
      const remainingTime = Math.max(0, minDisplayMs - elapsed);

      setTimeout(() => {
        if (!isMounted || hasFinishedRef.current) return;
        hasFinishedRef.current = true;
        setIsFadingOut(true);

        setTimeout(() => {
          if (isMounted && onLoaded) {
            onLoaded();
          }
        }, 400);
      }, remainingTime);
    };

    // Guaranteed fallback after 3.5s so user never gets stuck
    const fallbackTimer = setTimeout(() => {
      checkFinish();
    }, 3500);

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      video.removeEventListener('canplaythrough', handleReady);
      video.src = '';
    };
  }, [onLoaded]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 50%, #0F1A38 0%, #070D1E 70%, #03060E 100%)',
        overflow: 'hidden',
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.4s ease-out',
        userSelect: 'none',
        zIndex: 50
      }}
    >
      {/* Centered Loading Container matching the reference image */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 26
        }}
      >
        {/* Sweep Circular Spinner */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Soft Golden Ambient Glow */}
          <div
            style={{
              position: 'absolute',
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245, 184, 56, 0.2) 0%, transparent 70%)',
              filter: 'blur(10px)',
              pointerEvents: 'none'
            }}
          />
          <div className="sweep-spinner" />
        </div>

        {/* Text Container Below Spinner */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 5
          }}
        >
          {/* Main "LOADING..." matching reference image font style */}
          <span
            style={{
              fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: '#F6EFD9',
              textTransform: 'uppercase',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)'
            }}
          >
            LOADING...
          </span>

          {/* Single Concept Word Below: "DREAMS" */}
          <span
            style={{
              fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.3em',
              color: '#F5B838',
              textTransform: 'uppercase',
              textShadow: '0 0 12px rgba(245, 184, 56, 0.5)'
            }}
          >
            DREAMS
          </span>
        </div>
      </div>
    </div>
  );
}
