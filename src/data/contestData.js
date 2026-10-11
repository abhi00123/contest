// Shared Contest Tiers Data
export const TIERS_META = [
  {
    name: 'Bronze',
    initial: 'B',
    window: 'Oct only',
    reward: '10K reward points · RM only',
    metal: 'radial-gradient(circle at 30% 28%, #F0B98A, #B8703C 62%, #7A4420)',
    rim: '#E3A06B',
    ink: '#2A1406',
    delay: '0s'
  },
  {
    name: 'Silver',
    initial: 'S',
    window: 'Oct + Nov',
    reward: '25K reward points · RM only',
    metal: 'radial-gradient(circle at 30% 28%, #FFFFFF, #C9CFD8 60%, #8A93A1)',
    rim: '#E8ECF2',
    ink: '#1F2530',
    delay: '.3s'
  },
  {
    name: 'Gold',
    initial: 'G',
    symbol: '★',
    window: 'Oct – Dec',
    reward: 'Sales Training Program, Prague',
    metal: 'radial-gradient(circle at 30% 28%, #FFF0B8, #E9B949 58%, #9C7215)',
    rim: '#F6D77F',
    ink: '#2A1C02',
    delay: '.6s'
  },
  {
    name: 'Titanium',
    initial: 'T',
    symbol: '◆',
    window: 'Oct – Dec',
    reward: 'Prague + 25K reward points',
    metal: 'radial-gradient(circle at 30% 28%, #A9B7C6, #4E5D6E 60%, #232C37)',
    rim: '#8FA3B8',
    ink: '#F2F5F8',
    delay: '.9s'
  },
  {
    name: 'Platinum',
    initial: 'P',
    symbol: '👑',
    window: 'Oct – Dec',
    reward: 'Prague + 50K reward points',
    metal: 'radial-gradient(circle at 30% 28%, #FFFFFF, #DCE6F2 55%, #9FB2C8)',
    rim: '#FFFFFF',
    ink: '#14253D',
    delay: '1.2s'
  }
];

// 10 Lanes Target Data
export const LANES_DATA = [
  { label: 'Staff · Rural', full: 'BBRL Staff – Rural', t: [8, 14, 21, 27, 32] },
  { label: 'Staff · Semi Urban', full: 'BBRL Staff – Semi Urban', t: [8.5, 16, 24, 30, 36] },
  { label: 'Staff · Urban & Metro', full: 'BBRL Staff – Urban & Metro', t: [8.75, 17, 26, 32, 38] },
  { label: 'Aspire / PCAM RM', full: 'Aspire / PCAM RM', t: [9, 18, 27, 34, 41] },
  { label: 'Signature RM', full: 'Signature RM', t: [9.5, 19, 29, 37, 44] },
  { label: 'Insignia RM · G1', full: 'Insignia RM – Group 1', t: [10, 21, 31, 39, 47] },
  { label: 'Insignia RM · G2', full: 'Insignia RM – Group 2', t: [12, 22, 34, 42, 50] },
  { label: 'Insignia RM · G3', full: 'Insignia RM – Group 3', t: [13, 26, 39, 49, 58] },
  { label: 'Insignia RM · G4', full: 'Insignia RM – Group 4', t: [15.5, 32, 48, 60, 72] },
  { label: 'Commercial / BBG / Other', full: 'Commercial / Corporate / BBG / Other', t: [16, 32, 48, 60, 72] }
];

// 6 Rule Quest Cards: Know Your WOW
export const RULE_QUEST_CARDS = [
  {
    id: 1,
    q: 'What is the contest duration for the CEO’s World of Winners (WOW)?',
    options: [
      'October only',
      'October & November',
      'October, November & December'
    ],
    correct: 2,
    answerText: 'October, November & December',
    why: 'The WOW contest runs across October, November & December.'
  },
  {
    id: 2,
    q: 'Which product categories are covered under the WOW contest?',
    options: [
      'Life Insurance (LI)',
      'General Insurance (GI)',
      'Health Insurance (HI)',
      'All of the above'
    ],
    correct: 3,
    answerText: 'All of the above',
    why: 'All three product categories (LI, GI & HI) are considered.'
  },
  {
    id: 3,
    q: 'For how long is the Bronze slab applicable?',
    options: [
      'October only',
      'October & November',
      'October, November & December'
    ],
    correct: 0,
    answerText: 'October only',
    why: 'The Bronze slab is applicable for October only.'
  },
  {
    id: 4,
    q: 'For how long is the Silver slab applicable?',
    options: [
      'October only',
      'October & November',
      'October, November & December'
    ],
    correct: 1,
    answerText: 'October & November',
    why: 'The Silver slab is applicable for October & November.'
  },
  {
    id: 5,
    q: 'If SI tagging is not done for a Life Insurance policy, there will be no impact on your achievement calculation.',
    options: [
      'True',
      'False'
    ],
    correct: 1,
    answerText: 'False',
    why: 'If SI tagging is not completed, only 75% of the EPI amount will be considered for achievement calculations.'
  },
  {
    id: 6,
    q: 'What is the minimum persistency required to qualify for WOW?',
    options: [
      '70%',
      '80%',
      '90%'
    ],
    correct: 1,
    answerText: '80%',
    why: 'Achieving your sales target alone is not sufficient. If your persistency is below 80%, you will be disqualified from the contest, regardless of target achievement.'
  }
];

// 6 Passport Criteria
export const PASSPORT_CRITERIA = [
  { title: 'SP certified', detail: 'Every staff member and BM' },
  { title: '80% LI persistency', detail: '13M rolling, overall base · HDFC Life, Bajaj Life, ICICI Pru' },
  { title: 'CASA × 2', detail: '2 accounts in contest period, min. balance ₹10K' },
  { title: 'TD × 2 customers', detail: 'Under ₹3 Cr, 180-day tenor, live on 31 Dec 2026' },
  { title: 'KYC / CIF on every case', detail: 'CRM KYC or CIF number on all LI, GI and HI cases' },
  { title: 'Clean selling', detail: 'No force-selling, mis-selling or mapping-change cases' }
];
