// ─── Match Data ───────────────────────────────────────────────────────────────
// Seeded match/tournament data for the MVP demo.
// Replace with a live API or Soroban contract events in production.
// ─────────────────────────────────────────────────────────────────────────────

export const MATCHES = [
  {
    id: 'match-001',
    game: 'CS2',
    gameIcon: '🎯',
    tournament: 'ESL Pro League S19',
    teamA: { name: 'Natus Vincere', short: 'NAVI', logo: '🐻', region: 'CIS', winRate: 68 },
    teamB: { name: 'Team Vitality', short: 'VIT', logo: '🐝', region: 'EU', winRate: 72 },
    startTime: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 30 min from now
    status: 'upcoming',
    poolA: 450,
    poolB: 620,
    featured: true,
  },
  {
    id: 'match-002',
    game: 'Valorant',
    gameIcon: '🔫',
    tournament: 'VCT Masters Bangkok',
    teamA: { name: 'Sentinels', short: 'SEN', logo: '⚔️', region: 'NA', winRate: 61 },
    teamB: { name: 'Paper Rex', short: 'PRX', logo: '🦊', region: 'APAC', winRate: 74 },
    startTime: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
    status: 'upcoming',
    poolA: 310,
    poolB: 480,
    featured: false,
  },
  {
    id: 'match-003',
    game: 'Dota 2',
    gameIcon: '🛡️',
    tournament: 'PGL Wallachia S2',
    teamA: { name: 'Team Spirit', short: 'SPIRIT', logo: '👻', region: 'CIS', winRate: 79 },
    teamB: { name: 'Gaimin Gladiators', short: 'GG', logo: '🎮', region: 'EU', winRate: 65 },
    startTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // Live
    status: 'live',
    poolA: 1200,
    poolB: 890,
    featured: true,
  },
  {
    id: 'match-004',
    game: 'League of Legends',
    gameIcon: '⚡',
    tournament: 'LCK Spring 2025',
    teamA: { name: 'T1', short: 'T1', logo: '🦁', region: 'KR', winRate: 83 },
    teamB: { name: 'Gen.G', short: 'GEN', logo: '🐉', region: 'KR', winRate: 77 },
    startTime: new Date(Date.now() + 1000 * 60 * 180).toISOString(),
    status: 'upcoming',
    poolA: 2100,
    poolB: 1650,
    featured: false,
  },
  {
    id: 'match-005',
    game: 'Rocket League',
    gameIcon: '🚀',
    tournament: 'RLCS World Championship',
    teamA: { name: 'Karmine Corp', short: 'KC', logo: '🦋', region: 'EU', winRate: 70 },
    teamB: { name: 'NRG Esports', short: 'NRG', logo: '⚡', region: 'NA', winRate: 67 },
    startTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // Live
    status: 'live',
    poolA: 380,
    poolB: 410,
    featured: false,
  },
  {
    id: 'match-006',
    game: 'CS2',
    gameIcon: '🎯',
    tournament: 'BLAST Premier Spring',
    teamA: { name: 'FaZe Clan', short: 'FAZE', logo: '💀', region: 'INT', winRate: 71 },
    teamB: { name: 'G2 Esports', short: 'G2', logo: '🐻‍❄️', region: 'EU', winRate: 69 },
    startTime: new Date(Date.now() + 1000 * 60 * 240).toISOString(),
    status: 'upcoming',
    poolA: 760,
    poolB: 840,
    featured: false,
  },
];

export const GAME_FILTERS = ['All', 'CS2', 'Valorant', 'Dota 2', 'League of Legends', 'Rocket League'];
