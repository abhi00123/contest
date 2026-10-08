import React, { useState } from 'react';
import ModeSelectScreen from './components/ModeSelectScreen';
import HomeScreen from './components/HomeScreen';
import LaneScreen from './components/LaneScreen';
import JourneyScreen from './components/JourneyScreen';
import RuleQuestScreen from './components/RuleQuestScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('mode'); // 'mode', 'home', 'lane', 'journey', 'rules'
  const [gameMode, setGameMode] = useState(1); // 1 or 2
  const [selectedLane, setSelectedLane] = useState(2); // BBRL Staff Urban & Metro
  const [wap, setWap] = useState(0); // Default 0 Lakhs at starting

  const handleSelectMode = (mode) => {
    setGameMode(mode);
    setCurrentScreen('home'); // Go to intro screen first
    const el = document.getElementById('game-viewport');
    if (el) el.scrollTop = 0;
  };

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
    const el = document.getElementById('game-viewport');
    if (el) el.scrollTop = 0;
  };

  return (
    <div className="phone-container">
      <div className="phone-screen">
        
        {/* Game Viewport */}
        <div id="game-viewport" className="screen-content">
          {/* Mode Selection Screen (1 or 2) */}
          {currentScreen === 'mode' && (
            <ModeSelectScreen onSelectMode={handleSelectMode} />
          )}

          {/* Intro Screen */}
          {currentScreen === 'home' && (
            <HomeScreen 
              onNavigate={() => {
                // If Option 1: go to Lane Console
                // If Option 2: skip Lane Console, go directly to Road Screen
                if (gameMode === 1) {
                  handleNavigate('lane');
                } else {
                  handleNavigate('journey');
                }
              }} 
            />
          )}

          {/* Lane & Target Console (Option 1 only) */}
          {currentScreen === 'lane' && (
            <LaneScreen 
              selectedLane={selectedLane} 
              onSelectLane={setSelectedLane} 
              wap={wap}
              setWap={setWap}
              gameMode={gameMode}
              onNavigate={() => {
                // For Option 1, goes directly to True/False question screen
                handleNavigate('rules');
              }} 
            />
          )}

          {/* Road Screen (Option 2: selects directly from road, no car, then goes to True/False) */}
          {currentScreen === 'journey' && (
            <JourneyScreen 
              selectedLane={selectedLane} 
              onSelectLane={setSelectedLane}
              wap={wap}
              setWap={setWap}
              onNavigate={() => {
                handleNavigate('rules');
              }} 
            />
          )}

          {/* True / False Questions Screen */}
          {currentScreen === 'rules' && (
            <RuleQuestScreen onNavigate={handleNavigate} gameMode={gameMode} />
          )}
        </div>

      </div>
    </div>
  );
}
