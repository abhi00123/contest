import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LANES_DATA } from '../data/contestData';
import { LEADERSHIP_SHEETS } from '../data/leadershipData';
import { sound } from '../utils/sound';

// Helper to format target values in Lakhs (< 100) or Crores (>= 100)
function formatTargetUnit(valInLakhs, fullWord = false) {
  const num = Number(valInLakhs) || 0;
  if (num >= 100) {
    const crVal = Math.round((num / 100) * 100) / 100;
    return {
      val: crVal,
      suffix: fullWord ? ' Cr' : 'Cr'
    };
  }
  return {
    val: num,
    suffix: fullWord ? ' Lakh' : 'L'
  };
}

// Custom Searchable Dropdown for Leadership Role cascading selection
function SearchableDropdown({
  stepNumber,
  stepLabel,
  placeholder,
  searchPlaceholder = 'Type to search...',
  options = [],
  selectedValue,
  onSelect,
  isOpen,
  onToggle,
  onClose
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const selectedOption = useMemo(
    () => options.find((o) => o.value === selectedValue) || null,
    [options, selectedValue]
  );

  const filteredOptions = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => {
      const matchLabel = o.label?.toLowerCase().includes(q);
      const matchSub = o.sub?.toLowerCase().includes(q);
      const matchCode = o.code?.toLowerCase().includes(q);
      const matchEmp = o.empId?.toLowerCase().includes(q);
      return matchLabel || matchSub || matchCode || matchEmp;
    });
  }, [options, searchTerm]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        zIndex: isOpen ? 70 : 1
      }}
    >
      {stepLabel && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            marginBottom: 4,
            paddingLeft: 2
          }}
        >
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(10px, 1.32vh, 12px)',
              fontWeight: 800,
              color: selectedOption ? '#FDE68A' : '#7DD3FC',
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}
          >
            {stepNumber ? `${stepNumber}. ${stepLabel}` : stepLabel}
          </span>
        </div>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: '100%',
          minHeight: 'clamp(44px, 6vh, 54px)',
          borderRadius: 'clamp(10px, 1.4vh, 14px)',
          border: isOpen
            ? '2px solid #FFE28A'
            : selectedOption
            ? '1.5px solid rgba(245, 184, 56, 0.85)'
            : '1.5px solid rgba(56, 189, 248, 0.6)',
          background: isOpen
            ? 'linear-gradient(135deg, #1E3A8A 0%, #0F1E4E 100%)'
            : selectedOption
            ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.88) 0%, rgba(13, 25, 66, 0.96) 100%)'
            : 'linear-gradient(135deg, rgba(20, 39, 94, 0.78) 0%, rgba(10, 20, 52, 0.92) 100%)',
          color: '#FFFFFF',
          padding: 'clamp(8px, 1.15vh, 12px) clamp(12px, 2.5vw, 16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          cursor: 'pointer',
          boxShadow: isOpen
            ? '0 0 20px rgba(245, 184, 56, 0.55), 0 6px 16px rgba(0,0,0,0.45)'
            : selectedOption
            ? '0 0 14px rgba(245, 184, 56, 0.28), 0 4px 10px rgba(0,0,0,0.35)'
            : '0 0 12px rgba(56, 189, 248, 0.18), 0 4px 10px rgba(0,0,0,0.3)',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          textAlign: 'left',
          boxSizing: 'border-box'
        }}
      >
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(13.5px, 1.85vh, 16px)',
            fontWeight: selectedOption ? 800 : 700,
            color: selectedOption ? '#FFFFFF' : '#BAE6FD',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            letterSpacing: '0.01em',
            flex: 1,
            minWidth: 0
          }}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {/* Clean Chevron Icon (No Circle) */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={selectedOption ? '#FFE28A' : '#7DD3FC'}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.22s ease'
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Floating Searchable Popover Panel (Opens Upwards with generous height) */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            background: 'linear-gradient(180deg, #102052 0%, #091232 100%)',
            border: '2px solid #F5B838',
            borderRadius: '16px',
            boxShadow: '0 20px 48px rgba(0, 0, 0, 0.85), 0 0 28px rgba(245, 184, 56, 0.38)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 100,
            animation: 'screenFadeIn 0.18s ease-out'
          }}
        >
          {/* Sticky Search Input Header */}
          <div
            style={{
              padding: '11px 14px',
              background: 'linear-gradient(90deg, #162B6B 0%, #102052 100%)',
              borderBottom: '1.5px solid rgba(245, 184, 56, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 9
            }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFE28A"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.stopPropagation();
                  onClose();
                } else if (e.key === 'Enter' && filteredOptions.length > 0) {
                  e.preventDefault();
                  onSelect(filteredOptions[0].value);
                }
              }}
              placeholder={searchPlaceholder}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#FFFFFF',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '14.5px',
                fontWeight: 700,
                minWidth: 0
              }}
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  if (inputRef.current) inputRef.current.focus();
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#FFE28A',
                  fontSize: '13px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 2px',
                  flexShrink: 0
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Options Scroll List - Clean Flat List (No Individual Boxes) */}
          <div
            style={{
              maxHeight: 'clamp(240px, 34vh, 310px)',
              overflowY: 'auto',
              padding: '4px 0',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {filteredOptions.length === 0 ? (
              <div
                style={{
                  padding: '22px 14px',
                  textAlign: 'center',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: '#94A3B8'
                }}
              >
                No matching results for "{searchTerm}"
              </div>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = opt.value === selectedValue;
                const isLast = idx === filteredOptions.length - 1;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onSelect(opt.value)}
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: 0,
                      border: 'none',
                      borderBottom: isLast ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                      background: isSelected
                        ? 'rgba(245, 184, 56, 0.18)'
                        : 'transparent',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      cursor: 'pointer',
                      textAlign: 'left',
                      boxSizing: 'border-box',
                      transition: 'background 0.12s ease'
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '14.5px',
                        fontWeight: isSelected ? 900 : 700,
                        color: isSelected ? '#FFE28A' : '#FFFFFF',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        width: '100%'
                      }}
                    >
                      {opt.label}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Animated counting number component for dynamic target numbers
function AnimatedCount({ value, prefix = '', suffix = 'L', duration = 360, formatCommas = false }) {
  const [currentVal, setCurrentVal] = useState(value);
  const prevValRef = useRef(value);

  useEffect(() => {
    const start = Number(prevValRef.current);
    const end = Number(value);
    if (isNaN(start) || isNaN(end) || start === end) {
      setCurrentVal(value);
      prevValRef.current = value;
      return;
    }

    const startTime = performance.now();
    let animId;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const val = start + (end - start) * ease;

      const hasDecimals = end.toString().includes('.');
      const decimals = hasDecimals ? end.toString().split('.')[1].length : 0;
      setCurrentVal(decimals > 0 ? val.toFixed(decimals) : Math.round(val));

      if (progress < 1) {
        animId = requestAnimationFrame(tick);
      } else {
        setCurrentVal(end);
        prevValRef.current = end;
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [value, duration]);

  const displayVal = formatCommas
    ? Math.round(Number(currentVal) || 0).toLocaleString('en-IN')
    : currentVal;

  return (
    <span>
      {prefix}{displayVal}{suffix ? <span style={{ fontSize: '0.65em', opacity: 0.9, marginLeft: 1 }}>{suffix}</span> : null}
    </span>
  );
}

// Reusable medal icon component
function MedalIcon({ medal, selected, glowColor }) {
  const src = `./assets/medals/${medal}`;
  return (
    <img
      src={src}
      alt={medal}
      onError={(e) => {
        if (!e.target.src.includes(`/assets/medals/${medal}`)) {
          e.target.src = `/assets/medals/${medal}`;
        }
      }}
      style={{
        width: 'clamp(30px, 4.3vh, 42px)',
        height: 'clamp(30px, 4.3vh, 42px)',
        objectFit: 'contain',
        filter: selected
          ? `drop-shadow(0 0 12px ${glowColor}) drop-shadow(0 3px 6px rgba(0,0,0,0.6))`
          : 'drop-shadow(0 2px 5px rgba(0,0,0,0.45))',
        transform: selected ? 'scale(1.12)' : 'scale(1)',
        transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s ease',
        pointerEvents: 'none'
      }}
    />
  );
}

// Milestone Tiers Configuration
const ALL_TIERS = {
  BRONZE: {
    name: 'BRONZE',
    targetIndex: 0,
    medal: 'Bronze.png',
    reward: '10K Reward Points (RM only)',
    color: '#E3A06B',
    accentBorder: '#D97706',
    glowColor: 'rgba(217, 119, 6, 0.75)',
    bgGradient: 'linear-gradient(180deg, rgba(217, 119, 6, 0.35) 0%, rgba(14, 24, 60, 0.98) 100%)'
  },
  SILVER: {
    name: 'SILVER',
    targetIndex: 1,
    medal: 'Silver.png',
    reward: '25K Reward Points (RM only)',
    color: '#E2E8F0',
    accentBorder: '#CBD5E1',
    glowColor: 'rgba(226, 232, 240, 0.75)',
    bgGradient: 'linear-gradient(180deg, rgba(226, 232, 240, 0.3) 0%, rgba(14, 24, 60, 0.98) 100%)'
  },
  GOLD: {
    name: 'GOLD',
    targetIndex: 2,
    medal: 'Golden.png',
    reward: 'Sales Training Program, Prague',
    color: '#F6D77F',
    accentBorder: '#F5B838',
    glowColor: 'rgba(245, 184, 56, 0.85)',
    bgGradient: 'linear-gradient(180deg, rgba(245, 184, 56, 0.38) 0%, rgba(14, 24, 60, 0.98) 100%)'
  },
  TITANIUM: {
    name: 'TITANIUM',
    targetIndex: 3,
    medal: 'Titanium.png',
    reward: 'International Sales Training Program at PRAGUE + 25K Reward points',
    color: '#93C5FD',
    accentBorder: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.85)',
    bgGradient: 'linear-gradient(180deg, rgba(59, 130, 246, 0.32) 0%, rgba(14, 24, 60, 0.98) 100%)'
  },
  PLATINUM: {
    name: 'PLATINUM',
    targetIndex: 4,
    medal: 'Platinum.png',
    reward: 'International Sales Training Program at PRAGUE + 50K Reward points',
    color: '#C084FC',
    accentBorder: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.85)',
    bgGradient: 'linear-gradient(180deg, rgba(168, 85, 247, 0.32) 0%, rgba(14, 24, 60, 0.98) 100%)'
  }
};

const FRONTLINE_TIERS = [
  ALL_TIERS.BRONZE,
  ALL_TIERS.SILVER,
  ALL_TIERS.GOLD,
  ALL_TIERS.TITANIUM,
  ALL_TIERS.PLATINUM
];

const LEADERSHIP_TIERS = [
  { ...ALL_TIERS.GOLD, reward: 'International Sales Training Program - PRAGUE' },
  ALL_TIERS.TITANIUM,
  ALL_TIERS.PLATINUM
];

export default function LaneScreen({
  selectedLane,
  onSelectLane,
  wap,
  setWap,
  onNavigate,
  userRole = 'frontline',
  leadershipSelection,
  onUpdateLeadership
}) {
  const isLeadership = userRole === 'leadership';
  const tierConfigs = isLeadership ? LEADERSHIP_TIERS : FRONTLINE_TIERS;
  const numTiers = tierConfigs.length;

  // Leadership selection state (uses lifted state from App if provided)
  const [localLeadership, setLocalLeadership] = useState({
    sheetKey: '',
    subRoleKey: '',
    itemId: ''
  });
  const activeLeadership = leadershipSelection || localLeadership;
  const updateLeadership = onUpdateLeadership || setLocalLeadership;

  // Which dropdown is currently open: 'sheet' | 'subRole' | 'item' | null
  const [openDropdown, setOpenDropdown] = useState(null);

  const selectedSheetObj = useMemo(
    () => LEADERSHIP_SHEETS.find((s) => s.key === activeLeadership.sheetKey) || null,
    [activeLeadership.sheetKey]
  );

  const selectedSubRoleObj = useMemo(() => {
    if (!selectedSheetObj || !selectedSheetObj.hasSubRole) return null;
    return (
      selectedSheetObj.subRoles.find((sr) => sr.key === activeLeadership.subRoleKey) || null
    );
  }, [selectedSheetObj, activeLeadership.subRoleKey]);

  const activeItemsList = useMemo(() => {
    if (!selectedSheetObj) return [];
    if (selectedSheetObj.hasSubRole) {
      return selectedSubRoleObj ? selectedSubRoleObj.items : [];
    }
    return selectedSheetObj.items || [];
  }, [selectedSheetObj, selectedSubRoleObj]);

  const selectedLeadershipItem = useMemo(
    () => activeItemsList.find((item) => item.id === activeLeadership.itemId) || null,
    [activeItemsList, activeLeadership.itemId]
  );

  const currentLane = LANES_DATA[selectedLane] || LANES_DATA[2];

  const targets = useMemo(() => {
    if (!isLeadership) {
      return currentLane.t;
    }
    if (selectedLeadershipItem) {
      return [
        0,
        0,
        selectedLeadershipItem.gold,
        selectedLeadershipItem.titanium,
        selectedLeadershipItem.platinum
      ];
    }
    return [0, 0, 0, 0, 0];
  }, [isLeadership, currentLane.t, selectedLeadershipItem]);

  const rawTargets = useMemo(() => {
    if (!isLeadership || !selectedLeadershipItem) {
      return [0, 0, 0, 0, 0];
    }
    return [
      0,
      0,
      selectedLeadershipItem.goldRaw,
      selectedLeadershipItem.titaniumRaw,
      selectedLeadershipItem.platinumRaw
    ];
  }, [isLeadership, selectedLeadershipItem]);

  const selectedRoleTitle = useMemo(() => {
    if (!isLeadership) return currentLane.full;
    if (selectedLeadershipItem) {
      const rolePrefix = selectedSubRoleObj ? selectedSubRoleObj.label : selectedSheetObj?.label;
      return `${rolePrefix} – ${selectedLeadershipItem.name}`;
    }
    if (selectedSubRoleObj) return `${selectedSheetObj.label} – ${selectedSubRoleObj.label}`;
    if (selectedSheetObj) return selectedSheetObj.label;
    return 'Select Your Leadership Role Below';
  }, [isLeadership, currentLane.full, selectedLeadershipItem, selectedSubRoleObj, selectedSheetObj]);

  // Options formatted for SearchableDropdown (clean names only, no numbers or right-side badges)
  const sheetDropdownOptions = useMemo(
    () =>
      LEADERSHIP_SHEETS.map((s) => ({
        value: s.key,
        label: s.label
      })),
    []
  );

  const subRoleDropdownOptions = useMemo(() => {
    if (!selectedSheetObj || !selectedSheetObj.hasSubRole) return [];
    return selectedSheetObj.subRoles.map((sr) => ({
      value: sr.key,
      label: sr.label
    }));
  }, [selectedSheetObj]);

  const itemDropdownOptions = useMemo(
    () =>
      activeItemsList.map((item) => ({
        value: item.id,
        label: item.name
      })),
    [activeItemsList]
  );

  // Track which milestone tier card is selected
  const [selectedTierIndex, setSelectedTierIndex] = useState(() => {
    if (wap !== undefined && targets) {
      const idx = tierConfigs.findIndex((t) => targets[t.targetIndex] === wap && wap > 0);
      if (idx !== -1) return idx;
    }
    return numTiers - 1; // Default to Platinum
  });

  const currentTier = tierConfigs[selectedTierIndex] || tierConfigs[numTiers - 1];
  const currentTargetVal = targets ? targets[currentTier.targetIndex] : 0;
  const currentRawTargetVal = rawTargets ? rawTargets[currentTier.targetIndex] : 0;

  // Keep target value in sync with selected tier & lane
  useEffect(() => {
    if (setWap && targets && targets[currentTier.targetIndex] !== undefined) {
      setWap(targets[currentTier.targetIndex]);
    }
  }, [selectedTierIndex, selectedLane, userRole, currentTier.targetIndex, setWap, targets]);

  // Adjust selectedTierIndex if exceeding range on role change
  useEffect(() => {
    setSelectedTierIndex((prev) => Math.min(prev, numTiers - 1));
  }, [userRole, numTiers]);

  // Onboarding hand gesture tutorial state (👆 emoji)
  const tutorialStartPos = isLeadership ? 2 : 4; // Starts on Platinum
  const tutorialTargetPos = 0; // Bronze (index 0) for Frontline RM, Gold (index 0) for Leadership

  const [showTutorialHand, setShowTutorialHand] = useState(true);
  const [tutorialHandPos, setTutorialHandPos] = useState(tutorialStartPos);
  const [handTapping, setHandTapping] = useState(false);
  const [handFading, setHandFading] = useState(false);
  const userInteractedRef = useRef(false);
  const timeoutsRef = useRef([]);
  const targetsRef = useRef(targets);

  useEffect(() => {
    targetsRef.current = targets;
  }, [targets]);

  const cancelTutorial = () => {
    userInteractedRef.current = true;
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setShowTutorialHand(false);
  };

  useEffect(() => {
    if (userInteractedRef.current) return;

    const addTimeout = (fn, delay) => {
      const id = setTimeout(() => {
        if (!userInteractedRef.current) fn();
      }, delay);
      timeoutsRef.current.push(id);
      return id;
    };

    // Onboarding gesture animation sequence
    addTimeout(() => setTutorialHandPos(tutorialTargetPos), 1000);

    addTimeout(() => {
      setHandTapping(true);
      setSelectedTierIndex(tutorialTargetPos);
      const tier = tierConfigs[tutorialTargetPos];
      if (setWap && targetsRef.current && targetsRef.current[tier.targetIndex] !== undefined) {
        setWap(targetsRef.current[tier.targetIndex]);
      }
      sound.play('click');
    }, 1650);

    addTimeout(() => setHandTapping(false), 2100);
    addTimeout(() => setTutorialHandPos(tutorialStartPos), 2900);

    addTimeout(() => {
      setHandTapping(true);
      setSelectedTierIndex(tutorialStartPos);
      const tier = tierConfigs[tutorialStartPos];
      if (setWap && targetsRef.current && targetsRef.current[tier.targetIndex] !== undefined) {
        setWap(targetsRef.current[tier.targetIndex]);
      }
      sound.play('click');
    }, 3550);

    addTimeout(() => setHandTapping(false), 4000);
    addTimeout(() => setHandFading(true), 4800);
    addTimeout(() => setShowTutorialHand(false), 5350);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [setWap, tierConfigs, tutorialStartPos, tutorialTargetPos]);

  const handleSelect = (index) => {
    cancelTutorial();
    sound.play('click');
    onSelectLane(index);
    if (setWap) {
      const nextTargets = LANES_DATA[index]?.t;
      const tier = tierConfigs[selectedTierIndex] || tierConfigs[0];
      if (nextTargets && nextTargets[tier.targetIndex] !== undefined) {
        setWap(nextTargets[tier.targetIndex]);
      }
    }
  };

  const handleTierSelect = (idx) => {
    cancelTutorial();
    if (idx === selectedTierIndex) return;
    sound.play('click');
    setSelectedTierIndex(idx);
    const tier = tierConfigs[idx];
    if (setWap && targets && targets[tier.targetIndex] !== undefined) {
      setWap(targets[tier.targetIndex]);
    }
  };

  // Handlers for Leadership cascading dropdowns
  const handleSelectSheet = (sheetKey) => {
    cancelTutorial();
    sound.play('click');
    updateLeadership({
      sheetKey,
      subRoleKey: '',
      itemId: ''
    });
    setOpenDropdown(null);
  };

  const handleSelectSubRole = (subRoleKey) => {
    cancelTutorial();
    sound.play('click');
    updateLeadership((prev) => ({
      ...prev,
      subRoleKey,
      itemId: ''
    }));
    setOpenDropdown(null);
  };

  const handleSelectLeadershipItem = (itemId) => {
    cancelTutorial();
    sound.play('click');
    updateLeadership((prev) => ({
      ...prev,
      itemId
    }));
    setOpenDropdown(null);
  };

  return (
    <div
      className="second-screen-fadein"
      style={{
        position: 'relative',
        height: '100%',
        maxHeight: '100%',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#040818',
        padding: '0'
      }}
    >
      {/* Blurry & Darkened Prague Background Image Layer */}
      <div
        style={{
          position: 'absolute',
          inset: '-14px',
          backgroundImage: "url('./assets/prague_bg.jpg'), url('/assets/prague_bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(7px) brightness(0.58) contrast(1.15)',
          transform: 'scale(1.08)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Dark Luxury Vignette Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 35%, rgba(6, 14, 38, 0.45) 0%, rgba(3, 7, 20, 0.88) 100%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Sky Darken & Blur Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '46%',
          background: 'linear-gradient(180deg, rgba(3, 6, 18, 0.94) 0%, rgba(5, 12, 34, 0.72) 65%, rgba(3, 6, 18, 0) 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Animated Airplane flying across the sky */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(14px, 2.5vh, 28px)',
          left: 'clamp(40px, 16vw, 90px)',
          zIndex: 1,
          pointerEvents: 'none',
          animation: 'planeHover 4.5s ease-in-out infinite'
        }}
      >
        <svg width="52" height="26" viewBox="0 0 48 24" fill="none">
          <line x1="0" y1="12" x2="18" y2="12" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="2 2" />
          <path d="M18 12 L34 10 L44 11 C46 11.5 47 12 47 12.5 C47 13 46 13.5 44 14 L34 15 L18 13 Z" fill="#FFFFFF" />
          <polygon points="26,10 32,2 35,2 31,10" fill="#2563EB" />
          <polygon points="26,15 32,23 35,23 31,15" fill="#1D4ED8" />
          <polygon points="18,12 21,7 23,7 21,12" fill="#2563EB" />
        </svg>
      </div>

      {/* Responsive Content Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'clamp(14px, 2.5vh, 28px) clamp(10px, 2.8vw, 18px) clamp(12px, 2.2vh, 24px)',
          boxSizing: 'border-box',
          zIndex: 2,
          margin: '0 auto'
        }}
      >
        {/* ============================================================== */}
        {/* 1. FLOATING TROPHY / MEDAL CARDS (Interactive Selection)       */}
        {/* ============================================================== */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            width: '100%',
            zIndex: 2,
            flexShrink: 0,
            background: 'rgba(8, 14, 38, 0.45)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: 'clamp(14px, 2vh, 18px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: 'clamp(5px, 0.9vh, 9px) clamp(3px, 0.8vw, 6px)',
            boxSizing: 'border-box'
          }}
        >
          {/* Continuous Sliding Highlight Pill */}
          <div
            style={{
              position: 'absolute',
              top: 'clamp(5px, 0.9vh, 9px)',
              bottom: 'clamp(5px, 0.9vh, 9px)',
              left: 'clamp(3px, 0.8vw, 6px)',
              width: `calc((100% - 2 * clamp(3px, 0.8vw, 6px)) / ${numTiers})`,
              transform: `translateX(${selectedTierIndex * 100}%)`,
              background: currentTier.bgGradient,
              border: `1.5px solid ${currentTier.accentBorder}`,
              borderRadius: 'clamp(10px, 1.4vh, 14px)',
              boxShadow: `0 0 18px ${currentTier.glowColor}, 0 6px 16px rgba(0,0,0,0.55)`,
              animation:
                currentTier.name === 'GOLD'
                  ? 'goldTierPulse 2.4s ease-in-out infinite'
                  : currentTier.name === 'TITANIUM'
                  ? 'titaniumTierPulse 2.4s ease-in-out infinite'
                  : currentTier.name === 'PLATINUM'
                  ? 'platinumTierPulse 2.4s ease-in-out infinite'
                  : 'none',
              transition:
                'transform 0.4s cubic-bezier(0.25, 1, 0.35, 1), background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
              pointerEvents: 'none',
              zIndex: 1,
              overflow: 'hidden'
            }}
          >
            {(currentTier.name === 'GOLD' || currentTier.name === 'TITANIUM' || currentTier.name === 'PLATINUM') && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  width: '50%',
                  background:
                    'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0) 100%)',
                  animation: 'tierShimmerSweep 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                  pointerEvents: 'none'
                }}
              />
            )}
          </div>

          {/* Onboarding Hand Tutorial (👆) */}
          {showTutorialHand && (
            <div
              style={{
                position: 'absolute',
                bottom: 'clamp(-28px, -3.8vh, -20px)',
                left: 'clamp(3px, 0.8vw, 6px)',
                width: `calc((100% - 2 * clamp(3px, 0.8vw, 6px)) / ${numTiers})`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transform: `translateX(${tutorialHandPos * 100}%)`,
                transition: 'transform 0.65s cubic-bezier(0.25, 1, 0.35, 1), opacity 0.45s ease',
                opacity: handFading ? 0 : 1,
                pointerEvents: 'none',
                zIndex: 20
              }}
            >
              <div
                style={{
                  fontSize: 'clamp(28px, 4.2vh, 38px)',
                  lineHeight: 1,
                  filter:
                    'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 12px rgba(255, 255, 255, 0.6))',
                  animation: handTapping
                    ? 'handTapMotion 0.45s ease-in-out'
                    : 'handFloatMotion 1.8s ease-in-out infinite',
                  transformOrigin: 'top center'
                }}
              >
                👆
              </div>
            </div>
          )}

          {/* Medal Interactive Items */}
          {tierConfigs.map((tier, idx) => {
            const isSelected = idx === selectedTierIndex;
            const targetVal = targets ? targets[tier.targetIndex] : 0;

            return (
              <div
                key={tier.name}
                onClick={() => handleTierSelect(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTierSelect(idx);
                  }
                }}
                style={{
                  flex: 1,
                  position: 'relative',
                  zIndex: 2,
                  background: 'transparent',
                  border: 'none',
                  borderRadius: 'clamp(10px, 1.4vh, 14px)',
                  padding: 'clamp(5px, 0.9vh, 9px) 2px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
                  transition: 'transform 0.38s cubic-bezier(0.25, 1, 0.35, 1)',
                  userSelect: 'none'
                }}
              >
                {/* Medal Icon */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <MedalIcon medal={tier.medal} selected={isSelected} glowColor={tier.glowColor} />
                </div>

                {/* Tier Label */}
                <span
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    fontSize: isLeadership ? 'clamp(10.5px, 1.45vh, 13.5px)' : 'clamp(9px, 1.25vh, 12px)',
                    fontWeight: 900,
                    color: isSelected ? tier.color : '#94A3B8',
                    letterSpacing: '0.06em',
                    marginTop: 'clamp(2px, 0.35vh, 4px)',
                    transition: 'color 0.35s ease, text-shadow 0.35s ease',
                    textShadow: isSelected ? `0 0 8px ${tier.glowColor}` : 'none'
                  }}
                >
                  {tier.name}
                </span>

                {/* Target Value with Animated Count (Automatically in Cr if >= 100L) */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: isSelected ? 'clamp(16px, 2.2vh, 21px)' : 'clamp(14.5px, 2vh, 19.5px)',
                    fontWeight: 900,
                    color: isSelected ? '#FFFFFF' : '#CBD5E1',
                    lineHeight: 1.15,
                    marginTop: 'clamp(1px, 0.3vh, 3px)',
                    textShadow: isSelected ? `0 0 12px ${tier.glowColor}` : 'none',
                    transition: 'all 0.35s ease'
                  }}
                >
                  <AnimatedCount
                    value={formatTargetUnit(targetVal, false).val}
                    suffix={formatTargetUnit(targetVal, false).suffix}
                  />
                </div>

                {/* Validity Indication */}
                {tier.name === 'BRONZE' && (
                  <span
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      marginTop: 'clamp(2px, 0.4vh, 4px)',
                      fontSize: 'clamp(9.5px, 1.3vh, 12px)',
                      fontWeight: 900,
                      letterSpacing: '0.01em',
                      color: isSelected ? '#FFE28A' : '#F59E0B',
                      whiteSpace: 'nowrap',
                      lineHeight: 1.15,
                      textShadow: isSelected
                        ? '0 0 8px rgba(245, 158, 11, 0.6)'
                        : '0 1px 4px rgba(0, 0, 0, 0.9)'
                    }}
                  >
                    October only
                  </span>
                )}

                {tier.name === 'SILVER' && (
                  <span
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      marginTop: 'clamp(2px, 0.4vh, 4px)',
                      fontSize: 'clamp(8.5px, 1.18vh, 11px)',
                      fontWeight: 900,
                      letterSpacing: '-0.01em',
                      color: isSelected ? '#FFFFFF' : '#CBD5E1',
                      lineHeight: 1.12,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      textShadow: isSelected
                        ? '0 0 8px rgba(226, 232, 240, 0.7)'
                        : '0 1px 4px rgba(0, 0, 0, 0.9)'
                    }}
                  >
                    <span>October +</span>
                    <span>November only</span>
                  </span>
                )}

                {tier.name !== 'BRONZE' && tier.name !== 'SILVER' && (
                  <span
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      marginTop: 'clamp(2px, 0.4vh, 4px)',
                      fontSize: isLeadership ? 'clamp(10px, 1.35vh, 12.5px)' : 'clamp(9.5px, 1.3vh, 12px)',
                      fontWeight: 900,
                      letterSpacing: '0.02em',
                      color: isSelected ? '#FFFFFF' : '#94A3B8',
                      whiteSpace: 'nowrap',
                      lineHeight: 1.15,
                      textShadow: isSelected ? `0 0 8px ${tier.glowColor}` : '0 1px 4px rgba(0, 0, 0, 0.9)'
                    }}
                  >
                    Oct – Dec
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* 2. SELECTED ROLE, TARGET & REWARD STATUS BANNER                */}
        {/* ============================================================== */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(14, 26, 68, 0.96) 0%, rgba(8, 14, 40, 0.98) 100%)',
            border: '1.5px solid rgba(233, 185, 73, 0.6)',
            borderRadius: 'clamp(8px, 1.2vh, 12px)',
            padding: 'clamp(11px, 1.6vh, 16px) clamp(13px, 3.2vw, 19px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(5px, 0.9vh, 9px)',
            zIndex: 2,
            flexShrink: 0,
            boxShadow: '0 8px 24px rgba(0,0,0,0.55), 0 0 16px rgba(233, 185, 73, 0.2)'
          }}
        >
          {/* Row 1: Selected Role */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            <span
              style={{
                fontSize: 'clamp(10px, 1.35vh, 12.5px)',
                fontWeight: 900,
                color: '#F59E0B',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              SELECTED ROLE
            </span>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(16px, 2.2vh, 20.5px)',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.25
              }}
            >
              {selectedRoleTitle}
            </span>
          </div>

          {/* Row 2: Target Line */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              padding: 'clamp(1px, 0.3vh, 3px) 0'
            }}
          >
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(12px, 1.65vh, 15px)',
                fontWeight: 800,
                color: '#CBD5E1',
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}
            >
              {currentTier.name === 'GOLD' ? 'PRAGUE THRESHOLD' : `${currentTier.name} TARGET`}
            </span>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(12px, 1.65vh, 15px)',
                fontWeight: 800,
                color: '#94A3B8'
              }}
            >
              -
            </span>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(16px, 2.2vh, 20.5px)',
                fontWeight: 900,
                color: '#F5B838',
                letterSpacing: '0.01em',
                textShadow: '0 0 10px rgba(245, 184, 56, 0.35)'
              }}
            >
              {isLeadership ? (
                <AnimatedCount
                  value={currentRawTargetVal}
                  prefix="₹"
                  suffix=""
                  formatCommas={true}
                />
              ) : (
                <AnimatedCount
                  value={formatTargetUnit(currentTargetVal, true).val}
                  prefix="₹"
                  suffix={formatTargetUnit(currentTargetVal, true).suffix}
                />
              )}
            </span>
          </div>

          {/* Row 3: Selected Medal Tier Reward */}
          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.14)',
              paddingTop: 'clamp(6px, 0.85vh, 9px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 'clamp(3px, 0.45vh, 6px)',
              width: '100%'
            }}
          >
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(14px, 1.9vh, 17.5px)',
                fontWeight: 900,
                color: currentTier.color,
                letterSpacing: '0.02em',
                textShadow: '0 2px 8px rgba(0,0,0,0.5)'
              }}
            >
              {currentTier.reward}
            </span>

            {/* Glowing Indication for Bronze & Silver (Frontline only) */}
            {!isLeadership && currentTier.name === 'BRONZE' && (
              <div
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.24) 0%, rgba(180, 83, 9, 0.4) 100%)',
                  border: '1.5px solid #F59E0B',
                  borderRadius: '8px',
                  padding: 'clamp(4px, 0.6vh, 6px) clamp(12px, 2.8vw, 16px)',
                  marginTop: 'clamp(2px, 0.4vh, 5px)',
                  overflow: 'hidden',
                  animation: 'applicablePulseBronze 2s ease-in-out infinite alternate',
                  boxShadow: '0 0 16px rgba(245, 158, 11, 0.65), 0 0 30px rgba(245, 158, 11, 0.3)'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: '45%',
                    background:
                      'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 100%)',
                    transform: 'skewX(-20deg)',
                    animation: 'goldBtnShine 2.5s infinite',
                    pointerEvents: 'none'
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 'clamp(12px, 1.65vh, 14.5px)',
                    fontWeight: 900,
                    color: '#FFFBEB',
                    letterSpacing: '0.03em',
                    textShadow: '0 0 10px rgba(245, 158, 11, 0.85), 0 1px 3px rgba(0,0,0,0.85)',
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  Applicable for <span style={{ color: '#FDE047', fontWeight: 900 }}>October only</span>
                </span>
              </div>
            )}

            {!isLeadership && currentTier.name === 'SILVER' && (
              <div
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(226, 232, 240, 0.22) 0%, rgba(148, 163, 184, 0.35) 100%)',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: 'clamp(4px, 0.6vh, 6px) clamp(12px, 2.8vw, 16px)',
                  marginTop: 'clamp(2px, 0.4vh, 5px)',
                  overflow: 'hidden',
                  animation: 'applicablePulseSilver 2s ease-in-out infinite alternate',
                  boxShadow: '0 0 16px rgba(226, 232, 240, 0.65), 0 0 30px rgba(226, 232, 240, 0.3)'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: '45%',
                    background:
                      'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 100%)',
                    transform: 'skewX(-20deg)',
                    animation: 'goldBtnShine 2.5s infinite',
                    pointerEvents: 'none'
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 'clamp(12px, 1.65vh, 14.5px)',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    letterSpacing: '0.03em',
                    textShadow: '0 0 10px rgba(226, 232, 240, 0.85), 0 1px 3px rgba(0,0,0,0.85)',
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  Applicable for <span style={{ color: '#F8FAFC', fontWeight: 900 }}>October + November only</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. ROLE SELECTION CARD                                         */}
        {/* ============================================================== */}
        <div
          style={{
            background: isLeadership
              ? 'linear-gradient(145deg, rgba(15, 28, 72, 0.96) 0%, rgba(8, 15, 42, 0.98) 100%)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(18px)',
            border: isLeadership
              ? '1.5px solid rgba(245, 184, 56, 0.65)'
              : '1.5px solid rgba(255, 255, 255, 0.9)',
            borderRadius: 'clamp(12px, 1.6vh, 16px)',
            padding: isLeadership
              ? 'clamp(11px, 1.6vh, 16px) clamp(12px, 2.8vw, 18px) clamp(12px, 1.7vh, 17px)'
              : 'clamp(7px, 1.2vh, 14px) clamp(8px, 2.2vw, 14px) clamp(6px, 1vh, 12px)',
            boxShadow: isLeadership
              ? '0 10px 28px rgba(0, 0, 0, 0.6), 0 0 20px rgba(245, 184, 56, 0.2)'
              : '0 8px 24px rgba(0, 0, 0, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            gap: isLeadership ? 'clamp(8px, 1.2vh, 12px)' : 'clamp(4.5px, 0.8vh, 8px)',
            zIndex: openDropdown ? 60 : 2,
            flexShrink: 0,
            position: 'relative'
          }}
        >
          {/* Header inside Role Card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1vw, 9px)', padding: '0 2px' }}>
            <div
              style={{
                width: 'clamp(16px, 2.1vh, 20px)',
                height: 'clamp(16px, 2.1vh, 20px)',
                borderRadius: '50%',
                background: isLeadership
                  ? 'linear-gradient(135deg, #FFE28A 0%, #F5B838 100%)'
                  : '#EF4444',
                border: isLeadership ? '2px solid #FFFBEB' : '2px solid #FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isLeadership
                  ? '0 0 10px rgba(245, 184, 56, 0.7)'
                  : '0 1px 4px rgba(0,0,0,0.25)'
              }}
            >
              <div
                style={{
                  width: 'clamp(5px, 0.65vh, 6.5px)',
                  height: 'clamp(5px, 0.65vh, 6.5px)',
                  borderRadius: '50%',
                  background: isLeadership ? '#091232' : '#FFFFFF'
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: isLeadership ? 'clamp(11.5px, 1.5vh, 14px)' : 'clamp(10.5px, 1.4vh, 13.5px)',
                fontWeight: 900,
                letterSpacing: '0.06em',
                color: isLeadership ? '#FFE28A' : '#0F172A',
                textTransform: 'uppercase',
                textShadow: isLeadership ? '0 0 10px rgba(245, 184, 56, 0.35)' : 'none'
              }}
            >
              SELECT YOUR ROLE
            </span>
          </div>

          {!isLeadership ? (
            /* Frontline RM: 10 Role Buttons (2 Columns × 5 Rows) */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 'clamp(4px, 0.7vh, 7.5px)',
                columnGap: 'clamp(4px, 1.2vw, 8px)',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              {LANES_DATA.map((lane, index) => {
                const isSelected = index === selectedLane;

                return (
                  <button
                    key={lane.label}
                    type="button"
                    onClick={() => handleSelect(index)}
                    style={{
                      height: 'clamp(34px, 4.9vh, 48px)',
                      borderRadius: 'clamp(8px, 1.2vh, 12px)',
                      border: isSelected ? '1.5px solid #E9B949' : '1px solid #DCE6F5',
                      background: isSelected
                        ? 'linear-gradient(135deg, #0B1536 0%, #15224D 100%)'
                        : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
                      color: isSelected ? '#FFFFFF' : '#0F172A',
                      padding: '0 clamp(6px, 1.5vw, 10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      cursor: 'pointer',
                      boxShadow: isSelected
                        ? '0 0 14px rgba(233, 185, 73, 0.45), 0 3px 8px rgba(0,0,0,0.25)'
                        : '0 1px 4px rgba(15, 23, 42, 0.05)',
                      transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 'clamp(12px, 1.7vh, 15.5px)',
                        fontWeight: 900,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        textAlign: 'center',
                        letterSpacing: '0.01em'
                      }}
                    >
                      {lane.label}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Leadership Role: Progressive Searchable Cascading Dropdowns */
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(8px, 1.25vh, 13px)',
                width: '100%',
                paddingTop: 2,
                boxSizing: 'border-box'
              }}
            >
              {/* 1. Main Dropdown (Always visible first) */}
              <SearchableDropdown
                stepNumber="1"
                stepLabel="Leadership Role"
                placeholder="Select Role Category (BM, ZH_CH_TPP, etc.)..."
                searchPlaceholder="Search role category..."
                options={sheetDropdownOptions}
                selectedValue={activeLeadership.sheetKey}
                onSelect={handleSelectSheet}
                isOpen={openDropdown === 'sheet'}
                onToggle={() =>
                  setOpenDropdown((prev) => (prev === 'sheet' ? null : 'sheet'))
                }
                onClose={() => setOpenDropdown(null)}
              />

              {/* 2A. Sub-Role Dropdown (Only if selected sheet has sub-roles, e.g. ZH_CH_TPP, Insignia AH, Signature AH, Corp Salary) */}
              {selectedSheetObj && selectedSheetObj.hasSubRole && (
                <SearchableDropdown
                  stepNumber="2"
                  stepLabel="Select Designation"
                  placeholder={selectedSheetObj.subRolePlaceholder || 'Select Designation...'}
                  searchPlaceholder="Search designation..."
                  options={subRoleDropdownOptions}
                  selectedValue={activeLeadership.subRoleKey}
                  onSelect={handleSelectSubRole}
                  isOpen={openDropdown === 'subRole'}
                  onToggle={() =>
                    setOpenDropdown((prev) => (prev === 'subRole' ? null : 'subRole'))
                  }
                  onClose={() => setOpenDropdown(null)}
                />
              )}

              {/* 2B / 3. Branch or Name Dropdown (Appears directly for BM & PCAM AH, or after Sub-Role is selected) */}
              {selectedSheetObj &&
                (!selectedSheetObj.hasSubRole || selectedSubRoleObj) && (
                  <SearchableDropdown
                    stepNumber={selectedSheetObj.hasSubRole ? '3' : '2'}
                    stepLabel={
                      selectedSheetObj.hasSubRole
                        ? 'Select Your Name'
                        : selectedSheetObj.key === 'BM'
                        ? 'Select Your Branch'
                        : 'Select Your Name'
                    }
                    placeholder={
                      selectedSheetObj.key === 'BM'
                        ? 'Select Branch...'
                        : 'Select Name...'
                    }
                    searchPlaceholder={
                      selectedSheetObj.key === 'BM'
                        ? 'Search branch name...'
                        : 'Search name...'
                    }
                    options={itemDropdownOptions}
                    selectedValue={activeLeadership.itemId}
                    onSelect={handleSelectLeadershipItem}
                    isOpen={openDropdown === 'item'}
                    onToggle={() =>
                      setOpenDropdown((prev) => (prev === 'item' ? null : 'item'))
                    }
                    onClose={() => setOpenDropdown(null)}
                  />
                )}
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 4. GLOWING GOLDEN ACTION BUTTON (NEXT -> RULES)                */}
        {/* ============================================================== */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            zIndex: 2,
            flexShrink: 0
          }}
        >
          <button
            type="button"
            onClick={() => {
              sound.play('click');
              if (setWap) setWap(currentTargetVal || 0);
              onNavigate('rules');
            }}
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
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '40%',
                background:
                  'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 100%)',
                transform: 'skewX(-25deg)',
                animation: 'goldBtnShine 3s infinite'
              }}
            />

            <span style={{ whiteSpace: 'nowrap', WebkitTextStroke: '0.6px #1A1202' }}>NEXT</span>
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
    </div>
  );
}
