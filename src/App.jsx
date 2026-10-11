import React, { useState, useRef, useEffect } from 'react';
import RoleSelectScreen from './components/RoleSelectScreen';
import LoaderScreen from './components/LoaderScreen';
import HomeScreen from './components/HomeScreen';
import LaneScreen from './components/LaneScreen';
import JourneyScreen from './components/JourneyScreen';
import RuleQuestScreen from './components/RuleQuestScreen';
import { sound } from './utils/sound';

export default function App() {
  // Screen sequence: 'roleSelect' -> 'loading' -> 'home' (with seamless video dissolve) -> 'lane' -> 'rules'
  const [currentScreen, setCurrentScreen] = useState('roleSelect');
  const [userRole, setUserRole] = useState(null); // 'frontline' or 'leadership'
  const [gameMode, setGameMode] = useState(1); // 1: Direct Quest
  const [selectedLane, setSelectedLane] = useState(2); // BBRL Staff Urban & Metro
  const [wap, setWap] = useState(0);

  // Smooth Video Transition States
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoFadingOut, setIsVideoFadingOut] = useState(false);
  const videoRef = useRef(null);
  const audioFadeRef = useRef(null);

  // Continuously suppress and purge any third-party video speed controller badges (1.00)
  useEffect(() => {
    const purgeVideoOverlays = () => {
      // 1. Remove any known extension elements
      const extensionBadges = document.querySelectorAll(
        '.vsc-controller, .vsc-modifier, #vsc-controller, [data-vscid], [class*="vsc-"], [id*="vsc-"]'
      );
      extensionBadges.forEach((el) => el.remove());

      // 2. Purge any stray element overlaying top-left with "1.00" / "1.00x"
      const allDivs = document.querySelectorAll('div, span, p');
      allDivs.forEach((el) => {
        if (
          el.id === 'root' ||
          el.id === 'game-viewport' ||
          el.classList.contains('phone-container') ||
          el.classList.contains('phone-screen')
        ) return;
        const text = el.textContent?.trim();
        if (text === '1.00' || text === '1.0' || text === '1.00x' || text === '1.0x') {
          const style = window.getComputedStyle(el);
          if (style.position === 'absolute' || style.position === 'fixed') {
            el.remove();
          }
        }
      });
    };

    purgeVideoOverlays();
    const observer = new MutationObserver(purgeVideoOverlays);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  // 0. Role Selection -> Starts loading screen
  const handleSelectRole = (roleKey) => {
    setUserRole(roleKey);
    setCurrentScreen('loading');
    const el = document.getElementById('game-viewport');
    if (el) el.scrollTop = 0;
  };

  // 1. Loader finishes -> Reveal Start Screen
  const handleLoaded = () => {
    setCurrentScreen('home');
  };

  // 2. User clicks "Start the journey" -> Seamless dissolve into video
  const handleStartJourney = () => {
    sound.play('click');
    setIsVideoPlaying(true);
    setIsVideoFadingOut(false);

    if (videoRef.current) {
      if (audioFadeRef.current) {
        cancelAnimationFrame(audioFadeRef.current);
        audioFadeRef.current = null;
      }
      videoRef.current.currentTime = 0;
      videoRef.current.volume = 1; // Full initial volume
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Browser restricted unmuted playback, attempting muted:', err);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch((e) => console.error('Play failed:', e));
          }
        });
      }
    }
  };

  // 3. Monitor video playback -> Start audio & video fade out together at last 1.5 seconds
  const handleVideoTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const remaining = video.duration - video.currentTime;

    // Trigger smooth fade out exactly at the last 1.5s
    if (remaining <= 1.5 && !isVideoFadingOut) {
      setIsVideoFadingOut(true);

      // Smooth audio volume fade out in exact sync with 1.5s visual dissolve
      const fadeDuration = 1500; // 1.5 seconds in ms
      const startVolume = video.volume > 0 ? video.volume : 1;
      const startTime = performance.now();

      if (audioFadeRef.current) cancelAnimationFrame(audioFadeRef.current);

      const fadeAudio = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / fadeDuration, 1);
        // Smooth logarithmic/linear volume reduction
        const newVolume = Math.max(0, startVolume * (1 - progress));
        if (videoRef.current) {
          videoRef.current.volume = newVolume;
        }
        if (progress < 1) {
          audioFadeRef.current = requestAnimationFrame(fadeAudio);
        } else if (videoRef.current) {
          videoRef.current.volume = 0;
          audioFadeRef.current = null;
        }
      };

      audioFadeRef.current = requestAnimationFrame(fadeAudio);
    }
  };

  // 4. Video ends -> Fade in Second Screen (LaneScreen)
  const handleVideoEnded = () => {
    if (audioFadeRef.current) {
      cancelAnimationFrame(audioFadeRef.current);
      audioFadeRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.volume = 1;
    }
    // Purge any third-party controller overlay before screen switch
    document.querySelectorAll('.vsc-controller, .vsc-modifier, #vsc-controller, [data-vscid], [class*="vsc-"], [id*="vsc-"]').forEach(el => el.remove());
    setIsVideoPlaying(false);
    setIsVideoFadingOut(false);
    if (gameMode === 1) {
      setCurrentScreen('lane');
    } else {
      setCurrentScreen('journey');
    }
  };

  // Fallback if video relative path needs root slash
  const handleVideoError = () => {
    const video = videoRef.current;
    if (video && !video.src.endsWith('/assets/clip.mp4')) {
      video.src = '/assets/clip.mp4';
      video.load();
      if (isVideoPlaying) {
        video.play().catch((e) => console.log('Video error reload:', e));
      }
    }
  };

  // Standard Navigation
  const handleNavigate = (screen) => {
    if (screen === 'home') {
      if (audioFadeRef.current) {
        cancelAnimationFrame(audioFadeRef.current);
        audioFadeRef.current = null;
      }
      setIsVideoPlaying(false);
      setIsVideoFadingOut(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        videoRef.current.volume = 1;
      }
    }
    setCurrentScreen(screen);
    const el = document.getElementById('game-viewport');
    if (el) el.scrollTop = 0;
  };

  return (
    <div className="phone-container">
      <div className="phone-screen">
        <div id="game-viewport" className="screen-content">

          {/* 0. Initial Role Selection Screen (Frontline RM vs Leadership Role) */}
          {currentScreen === 'roleSelect' && (
            <RoleSelectScreen onSelectRole={handleSelectRole} />
          )}

          {/* 1. Circular Sweep Loader (Reference Style with sweep spinner & DREAMS) */}
          {currentScreen === 'loading' && (
            <LoaderScreen onLoaded={handleLoaded} />
          )}

          {/* 2 & 3. Seamless Start Screen Dissolve to Clean Video */}
          {currentScreen === 'home' && (
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                background: '#000000'
              }}
            >
              {/* Clean Video Element (No buttons, no mute/skip, no timeline bar) */}
              <video
                ref={videoRef}
                src="./assets/clip.mp4"
                playsInline
                preload="auto"
                controls={false}
                controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
                disablePictureInPicture
                disableRemotePlayback
                tabIndex={-1}
                aria-hidden="true"
                onTimeUpdate={handleVideoTimeUpdate}
                onEnded={handleVideoEnded}
                onError={handleVideoError}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block',
                  zIndex: 1,
                  pointerEvents: 'none',
                  opacity: isVideoPlaying ? (isVideoFadingOut ? 0 : 1) : 0,
                  transition: isVideoFadingOut
                    ? 'opacity 1.5s ease-out'
                    : 'opacity 0.6s ease-in-out',
                  willChange: 'opacity'
                }}
              />

              {/* Poster and "Start the journey" CTA Layer */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 2,
                  opacity: isVideoPlaying ? 0 : 1,
                  pointerEvents: isVideoPlaying ? 'none' : 'auto',
                  transition: 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'opacity'
                }}
              >
                <HomeScreen onStartJourney={handleStartJourney} />
              </div>
            </div>
          )}

          {/* 4. Second Screen (Lane Selection) with smooth fade-in animation */}
          {currentScreen === 'lane' && (
            <LaneScreen
              selectedLane={selectedLane}
              onSelectLane={setSelectedLane}
              wap={wap}
              setWap={setWap}
              gameMode={gameMode}
              userRole={userRole}
              onNavigate={() => handleNavigate('rules')}
            />
          )}

          {/* Road Screen (Option 2) */}
          {currentScreen === 'journey' && (
            <JourneyScreen
              selectedLane={selectedLane}
              onSelectLane={setSelectedLane}
              wap={wap}
              setWap={setWap}
              onNavigate={() => handleNavigate('rules')}
            />
          )}

          {/* 5. Rule Quest Questions Screen */}
          {currentScreen === 'rules' && (
            <RuleQuestScreen
              onNavigate={handleNavigate}
              gameMode={gameMode}
            />
          )}

        </div>
      </div>
    </div>
  );
}
