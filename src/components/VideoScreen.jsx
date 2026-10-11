import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/sound';

export default function VideoScreen({ onComplete, videoSrc = './assets/clip.mp4' }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [showUnmuteHint, setShowUnmuteHint] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start video playback
    const startPlay = async () => {
      try {
        video.muted = false;
        await video.play();
        setIsPlaying(true);
        setIsMuted(false);
      } catch (err) {
        // Autoplay with sound restricted by browser; fallback to muted autoplay
        console.warn('Autoplay unmuted blocked, falling back to muted:', err);
        try {
          video.muted = true;
          setIsMuted(true);
          setShowUnmuteHint(true);
          await video.play();
          setIsPlaying(true);
        } catch (playErr) {
          console.error('Video autoplay failed completely:', playErr);
        }
      }
    };

    startPlay();

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
    };

    const handleError = () => {
      if (video.src && !video.src.endsWith('/assets/clip.mp4')) {
        video.src = '/assets/clip.mp4';
        video.load();
        video.play().catch(err => console.log('Fallback play error:', err));
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
    };
  }, [videoSrc]);

  // Transition to next screen with fade out
  const handleFinish = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  const handleSkip = () => {
    sound.play('click');
    handleFinish();
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    sound.play('click');
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) setShowUnmuteHint(false);
  };

  const handleVideoTap = () => {
    // If muted hint is visible, unmute on tap
    if (isMuted && videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
      setShowUnmuteHint(false);
      return;
    }

    // Toggle play/pause
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      onClick={handleVideoTap}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        background: '#000000',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'scale(1.02)' : 'scale(1)',
        transition: 'opacity 0.4s ease-out, transform 0.4s ease-out'
      }}
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={videoSrc}
        playsInline
        autoPlay
        onEnded={handleFinish}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block'
        }}
      />

      {/* Buffering Indicator */}
      {isBuffering && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.4)',
            zIndex: 15,
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              border: '3px solid rgba(245, 184, 56, 0.3)',
              borderTopColor: '#F5B838',
              animation: 'compassSpin 0.8s linear infinite'
            }}
          />
        </div>
      )}

      {/* Unmute Prompt Banner if muted autoplay occurred */}
      {showUnmuteHint && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            toggleMute(e);
          }}
          style={{
            position: 'absolute',
            top: 70,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, rgba(233, 185, 73, 0.95), rgba(184, 133, 28, 0.95))',
            color: '#1A1202',
            padding: '7px 16px',
            borderRadius: 20,
            fontSize: '12px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            zIndex: 25,
            boxShadow: '0 4px 18px rgba(0,0,0,0.6)',
            cursor: 'pointer',
            animation: 'rtpPulse 2s infinite'
          }}
        >
          <span>🔊</span>
          <span>Tap to Unmute Audio</span>
        </div>
      )}

      {/* TOP OVERLAY HUD: Mute & Skip buttons */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '16px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
          zIndex: 20
        }}
      >
        {/* Mute / Unmute Button */}
        <button
          onClick={toggleMute}
          style={{
            background: 'rgba(11, 20, 48, 0.8)',
            border: '1px solid rgba(245, 184, 56, 0.4)',
            color: '#FFFFFF',
            borderRadius: 20,
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}
        >
          <span>{isMuted ? '🔇' : '🔊'}</span>
          <span>{isMuted ? 'UNMUTE' : 'MUTE'}</span>
        </button>

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          style={{
            background: 'linear-gradient(135deg, rgba(245, 184, 56, 0.25) 0%, rgba(20, 32, 70, 0.9) 100%)',
            border: '1.5px solid #F5B838',
            color: '#F5B838',
            borderRadius: 20,
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            fontSize: '12px',
            fontWeight: 900,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 0 14px rgba(245, 184, 56, 0.35)'
          }}
        >
          <span>SKIP</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 4 15 12 5 20 5 4" fill="currentColor" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </button>
      </div>

      {/* BOTTOM OVERLAY HUD: Progress Bar & Time */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '14px 16px 18px',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          zIndex: 20
        }}
      >
        {/* Progress Bar Track */}
        <div
          style={{
            width: '100%',
            height: 5,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.25)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #F5B838, #FFF0B8)',
              borderRadius: 3,
              boxShadow: '0 0 10px rgba(245, 184, 56, 0.8)',
              transition: 'width 0.1s linear'
            }}
          />
        </div>

        {/* Time and Info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#E2E8F0',
            fontWeight: 700
          }}
        >
          <span style={{ letterSpacing: '0.04em', color: '#F5B838' }}>
            ROAD TO PRAGUE
          </span>
          <span style={{ fontFamily: 'monospace' }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}
