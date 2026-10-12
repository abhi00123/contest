import React, { useState, useEffect, useRef } from 'react';

// Complete list of game visual assets to preload
const GAME_IMAGE_ASSETS = [
  './assets/Prague Winners International Training Poster.png',
  './assets/prague_bg.jpg',
  './assets/Prague_Golden_Travel_Stamp.png',
  './assets/PP.png',
  './assets/medals/Bronze.png',
  './assets/medals/Silver.png',
  './assets/medals/Golden.png',
  './assets/medals/Titanium.png',
  './assets/medals/Platinum.png'
];

const preloadImage = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    if (img.complete && img.naturalWidth !== 0) {
      resolve();
    } else {
      img.onload = () => resolve();
      img.onerror = () => {
        if (src.startsWith('./')) {
          const fallback = new Image();
          fallback.src = src.replace(/^\.\//, '/');
          fallback.onload = () => resolve();
          fallback.onerror = () => resolve();
        } else {
          resolve();
        }
      };
    }
  });
};

const preloadVideo = (src) => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    video.src = src;

    let finished = false;
    const markDone = () => {
      if (!finished) {
        finished = true;
        resolve();
      }
    };

    video.addEventListener('canplaythrough', markDone, { once: true });
    video.addEventListener('loadeddata', markDone, { once: true });
    video.onerror = () => {
      if (src.startsWith('./')) {
        video.src = src.replace(/^\.\//, '/');
        video.load();
      } else {
        markDone();
      }
    };

    // Safety timeout in case of slow video buffer
    setTimeout(markDone, 6000);
  });
};

export default function LoaderScreen({ onLoaded }) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const animFrameRef = useRef(null);
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    const startTime = performance.now();
    const minDisplayMs = 1500; // smooth minimum display so spinner is seen cleanly

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

    // Preload ALL game images, video, and web fonts in parallel
    const imagePromises = GAME_IMAGE_ASSETS.map(preloadImage);
    const videoPromise = preloadVideo('./assets/clip.mp4');
    const fontsPromise = document.fonts ? document.fonts.ready : Promise.resolve();

    Promise.all([...imagePromises, videoPromise, fontsPromise]).then(() => {
      checkFinish();
    });

    // High safety fallback (8s) so user never gets stuck under severe network degradation
    const fallbackTimer = setTimeout(() => {
      checkFinish();
    }, 8000);

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
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
          {/* Main "LOADING" (no dots on loading text) */}
          <span
            style={{
              fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '20px',
              fontWeight: 800,
              letterSpacing: '0.18em',
              color: '#F6EFD9',
              textTransform: 'uppercase',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)'
            }}
          >
            LOADING
          </span>

          {/* Concept Word with dots: "DREAMS....." */}
          <span
            style={{
              fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '12.5px',
              fontWeight: 800,
              letterSpacing: '0.22em',
              color: '#F5B838',
              textTransform: 'uppercase',
              textShadow: '0 0 12px rgba(245, 184, 56, 0.5)'
            }}
          >
            DREAMS.....
          </span>
        </div>
      </div>
    </div>
  );
}
