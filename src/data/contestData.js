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
