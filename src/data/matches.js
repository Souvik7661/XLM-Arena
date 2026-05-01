// ─── Match Data ───────────────────────────────────────────────────────────────
// Comprehensive game library for XLM Arena betting platform.
// ─────────────────────────────────────────────────────────────────────────────

export const MATCHES = [
  // ── CS2 ──
  {
    id: 'match-001',
    game: 'CS2',
    gameIcon: '🎯',
    tournament: 'ESL Pro League S19',
    teamA: { name: 'Natus Vincere', short: 'NAVI', logo: '🐻', region: 'CIS' },
    teamB: { name: 'Team Vitality', short: 'VIT', logo: '🐝', region: 'EU' },
    startTime: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
    status: 'upcoming', poolA: 450, poolB: 620, featured: true,
  },
  {
    id: 'match-006',
    game: 'CS2',
    gameIcon: '🎯',
    tournament: 'BLAST Premier Spring',
    teamA: { name: 'FaZe Clan', short: 'FAZE', logo: '💀', region: 'INT' },
    teamB: { name: 'G2 Esports', short: 'G2', logo: '🐻‍❄️', region: 'EU' },
    startTime: new Date(Date.now() + 1000 * 60 * 240).toISOString(),
    status: 'upcoming', poolA: 760, poolB: 840, featured: false,
  },
  // ── Valorant ──
  {
    id: 'match-002',
    game: 'Valorant',
    gameIcon: '🔫',
    tournament: 'VCT Masters Bangkok',
    teamA: { name: 'Sentinels', short: 'SEN', logo: '⚔️', region: 'NA' },
    teamB: { name: 'Paper Rex', short: 'PRX', logo: '🦊', region: 'APAC' },
    startTime: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
    status: 'upcoming', poolA: 310, poolB: 480, featured: false,
  },
  {
    id: 'match-007',
    game: 'Valorant',
    gameIcon: '🔫',
    tournament: 'VCT Champions 2025',
    teamA: { name: 'Team Liquid', short: 'TL', logo: '💧', region: 'EU' },
    teamB: { name: 'Cloud9', short: 'C9', logo: '☁️', region: 'NA' },
    startTime: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    status: 'live', poolA: 520, poolB: 390, featured: true,
  },
  // ── Dota 2 ──
  {
    id: 'match-003',
    game: 'Dota 2',
    gameIcon: '🛡️',
    tournament: 'PGL Wallachia S2',
    teamA: { name: 'Team Spirit', short: 'SPIRIT', logo: '👻', region: 'CIS' },
    teamB: { name: 'Gaimin Gladiators', short: 'GG', logo: '🎮', region: 'EU' },
    startTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    status: 'live', poolA: 1200, poolB: 890, featured: true,
  },
  {
    id: 'match-008',
    game: 'Dota 2',
    gameIcon: '🛡️',
    tournament: 'The International 2025',
    teamA: { name: 'OG', short: 'OG', logo: '🍀', region: 'EU' },
    teamB: { name: 'Evil Geniuses', short: 'EG', logo: '😈', region: 'NA' },
    startTime: new Date(Date.now() + 1000 * 60 * 360).toISOString(),
    status: 'upcoming', poolA: 890, poolB: 740, featured: false,
  },
  // ── League of Legends ──
  {
    id: 'match-004',
    game: 'League of Legends',
    gameIcon: '⚡',
    tournament: 'LCK Spring 2025',
    teamA: { name: 'T1', short: 'T1', logo: '🦁', region: 'KR' },
    teamB: { name: 'Gen.G', short: 'GEN', logo: '🐉', region: 'KR' },
    startTime: new Date(Date.now() + 1000 * 60 * 180).toISOString(),
    status: 'upcoming', poolA: 2100, poolB: 1650, featured: false,
  },
  {
    id: 'match-009',
    game: 'League of Legends',
    gameIcon: '⚡',
    tournament: 'LEC Spring 2025',
    teamA: { name: 'Fnatic', short: 'FNC', logo: '🦅', region: 'EU' },
    teamB: { name: 'G2 Esports', short: 'G2', logo: '🐻‍❄️', region: 'EU' },
    startTime: new Date(Date.now() + 1000 * 60 * 120).toISOString(),
    status: 'upcoming', poolA: 680, poolB: 720, featured: false,
  },
  // ── Rocket League ──
  {
    id: 'match-005',
    game: 'Rocket League',
    gameIcon: '🚀',
    tournament: 'RLCS World Championship',
    teamA: { name: 'Karmine Corp', short: 'KC', logo: '🦋', region: 'EU' },
    teamB: { name: 'NRG Esports', short: 'NRG', logo: '⚡', region: 'NA' },
    startTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'live', poolA: 380, poolB: 410, featured: false,
  },
  // ── FIFA / EA FC ──
  {
    id: 'match-010',
    game: 'EA FC 25',
    gameIcon: '⚽',
    tournament: 'eFootball World Cup 2025',
    teamA: { name: 'Real Madrid eFC', short: 'RMEFC', logo: '👑', region: 'EU' },
    teamB: { name: 'FC Barcelona eFC', short: 'BARCA', logo: '🔵', region: 'EU' },
    startTime: new Date(Date.now() + 1000 * 60 * 300).toISOString(),
    status: 'upcoming', poolA: 920, poolB: 880, featured: false,
  },
  // ── Overwatch 2 ──
  {
    id: 'match-011',
    game: 'Overwatch 2',
    gameIcon: '🦸',
    tournament: 'Overwatch League Grand Finals',
    teamA: { name: 'Seoul Dynasty', short: 'SEOUL', logo: '🐯', region: 'KR' },
    teamB: { name: 'San Francisco Shock', short: 'SF', logo: '⚡', region: 'NA' },
    startTime: new Date(Date.now() + 1000 * 60 * 200).toISOString(),
    status: 'upcoming', poolA: 430, poolB: 510, featured: false,
  },
  // ── PUBG ──
  {
    id: 'match-012',
    game: 'PUBG',
    gameIcon: '🪖',
    tournament: 'PUBG Global Championship 2025',
    teamA: { name: 'Danawa e-sports', short: 'DWG', logo: '🔷', region: 'KR' },
    teamB: { name: 'Nova Esports', short: 'NOVA', logo: '🌟', region: 'CN' },
    startTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    status: 'live', poolA: 290, poolB: 340, featured: false,
  },
  // ── Fortnite ──
  {
    id: 'match-013',
    game: 'Fortnite',
    gameIcon: '🏗️',
    tournament: 'FNCS Global Championship',
    teamA: { name: 'Bugha', short: 'BUGHA', logo: '👾', region: 'NA' },
    teamB: { name: 'Benjy', short: 'BENJY', logo: '🎭', region: 'EU' },
    startTime: new Date(Date.now() + 1000 * 60 * 500).toISOString(),
    status: 'upcoming', poolA: 180, poolB: 220, featured: false,
  },
  // ── Apex Legends ──
  {
    id: 'match-014',
    game: 'Apex Legends',
    gameIcon: '🎖️',
    tournament: 'ALGS Championship 2025',
    teamA: { name: 'NRG', short: 'NRG', logo: '⚡', region: 'NA' },
    teamB: { name: 'Alliance', short: 'ALLIANCE', logo: '🏰', region: 'EU' },
    startTime: new Date(Date.now() + 1000 * 60 * 420).toISOString(),
    status: 'upcoming', poolA: 260, poolB: 310, featured: false,
  },
  // ── Street Fighter ──
  {
    id: 'match-015',
    game: 'Street Fighter 6',
    gameIcon: '🥊',
    tournament: 'Capcom Cup XI',
    teamA: { name: 'Tokido', short: 'TOKIDO', logo: '🐉', region: 'JP' },
    teamB: { name: 'Punk', short: 'PUNK', logo: '⚡', region: 'NA' },
    startTime: new Date(Date.now() + 1000 * 60 * 600).toISOString(),
    status: 'upcoming', poolA: 140, poolB: 190, featured: false,
  },
  // ── Mobile Legends ──
  {
    id: 'match-016',
    game: 'Mobile Legends',
    gameIcon: '📱',
    tournament: 'M6 World Championship',
    teamA: { name: 'ECHO', short: 'ECHO', logo: '🔊', region: 'PH' },
    teamB: { name: 'ONIC PH', short: 'ONIC', logo: '🌊', region: 'PH' },
    startTime: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    status: 'live', poolA: 670, poolB: 590, featured: false,
  },
  // ── Call of Duty ──
  {
    id: 'match-017',
    game: 'Call of Duty',
    gameIcon: '💣',
    tournament: 'CDL Major 2025',
    teamA: { name: 'OpTic Texas', short: 'OPTIC', logo: '🎯', region: 'NA' },
    teamB: { name: 'Atlanta FaZe', short: 'ATL', logo: '🌊', region: 'NA' },
    startTime: new Date(Date.now() + 1000 * 60 * 280).toISOString(),
    status: 'upcoming', poolA: 450, poolB: 530, featured: false,
  },
  // ── StarCraft II ──
  {
    id: 'match-018',
    game: 'StarCraft II',
    gameIcon: '🌌',
    tournament: 'GSL Code S 2025',
    teamA: { name: 'Serral', short: 'SERRAL', logo: '🌟', region: 'EU' },
    teamB: { name: 'Maru', short: 'MARU', logo: '⚔️', region: 'KR' },
    startTime: new Date(Date.now() + 1000 * 60 * 700).toISOString(),
    status: 'upcoming', poolA: 320, poolB: 280, featured: false,
  },
];

export const GAME_FILTERS = [
  'All', 'CS2', 'Valorant', 'Dota 2', 'League of Legends',
  'Rocket League', 'EA FC 25', 'Overwatch 2', 'PUBG',
  'Fortnite', 'Apex Legends', 'Street Fighter 6', 'Mobile Legends',
  'Call of Duty', 'StarCraft II',
];
