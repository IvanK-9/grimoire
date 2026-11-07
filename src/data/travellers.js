// Canonical Blood on the Clocktower Travellers Database
// Includes official core Travellers (TB, BMR, SNV) and Carousel / Experimental Travellers

export const TRAVELLERS_DB = {
  // === Trouble Brewing (TB) Official Travellers ===
  gunslinger: {
    id: 'gunslinger',
    name: 'Gunslinger',
    icon: '🤠',
    team: 'traveller',
    edition: 'tb',
    editionLabel: 'Trouble Brewing',
    isOfficial: true,
    ability: 'Each day, after the 1st vote has been tallied, you may choose a player that voted: they die.',
  },
  beggar: {
    id: 'beggar',
    name: 'Beggar',
    icon: '🪙',
    team: 'traveller',
    edition: 'tb',
    editionLabel: 'Trouble Brewing',
    isOfficial: true,
    ability: 'You have no vote tokens. To vote, you must give a token to another player. If they agree, they vote for you.',
  },
  bureaucrat: {
    id: 'bureaucrat',
    name: 'Bureaucrat',
    icon: '📜',
    team: 'traveller',
    edition: 'tb',
    editionLabel: 'Trouble Brewing',
    isOfficial: true,
    ability: 'Each night, choose a player: their vote counts as 3 votes tomorrow.',
  },
  thief: {
    id: 'thief',
    name: 'Thief',
    icon: '🥷',
    team: 'traveller',
    edition: 'tb',
    editionLabel: 'Trouble Brewing',
    isOfficial: true,
    ability: 'Each night, choose a player: a negative vote counts against them tomorrow.',
  },
  scapegoat: {
    id: 'scapegoat',
    name: 'Scapegoat',
    icon: '🐐',
    team: 'traveller',
    edition: 'tb',
    editionLabel: 'Trouble Brewing',
    isOfficial: true,
    ability: 'If a player of your alignment is executed, you might be executed instead.',
  },

  // === Bad Moon Rising (BMR) Official Travellers ===
  butcher: {
    id: 'butcher',
    name: 'Butcher',
    icon: '🔪',
    team: 'traveller',
    edition: 'bmr',
    editionLabel: 'Bad Moon Rising',
    isOfficial: true,
    ability: 'Each day, you may nominate as many times as you like.',
  },
  bonecollector: {
    id: 'bonecollector',
    name: 'Bone Collector',
    icon: '🦴',
    team: 'traveller',
    edition: 'bmr',
    editionLabel: 'Bad Moon Rising',
    isOfficial: true,
    ability: 'Once per game, at night, choose a dead player: they regain their ability tonight and tomorrow day.',
  },
  harlot: {
    id: 'harlot',
    name: 'Harlot',
    icon: '💋',
    team: 'traveller',
    edition: 'bmr',
    editionLabel: 'Bad Moon Rising',
    isOfficial: true,
    ability: 'Each night*, choose a living player: learn their character, but the Demon might kill you.',
  },

  // === Sects & Violets (SNV) Official Travellers ===
  judge: {
    id: 'judge',
    name: 'Judge',
    icon: '⚖️',
    team: 'traveller',
    edition: 'snv',
    editionLabel: 'Sects & Violets',
    isOfficial: true,
    ability: 'Once per game, you may choose to execute a nominated player immediately.',
  },
  matron: {
    id: 'matron',
    name: 'Matron',
    icon: '👵',
    team: 'traveller',
    edition: 'snv',
    editionLabel: 'Sects & Violets',
    isOfficial: true,
    ability: 'Each day, you may choose up to 3 sets of players to swap seats.',
  },
  deviant: {
    id: 'deviant',
    name: 'Deviant',
    icon: '🎭',
    team: 'traveller',
    edition: 'snv',
    editionLabel: 'Sects & Violets',
    isOfficial: true,
    ability: 'If you were funny today, you cannot die by execution.',
  },

  // === Official Carousel Travellers ===
  barista: {
    id: 'barista',
    name: 'Barista',
    icon: '☕',
    team: 'traveller',
    edition: 'carousel',
    editionLabel: 'Official Carousel',
    isOfficial: true,
    ability: 'Each night, choose a player: they learn true info or wake twice tonight.',
  },

  // === Experimental / Custom Travellers ===
  orderly: {
    id: 'orderly',
    name: 'Orderly',
    icon: '🩺',
    team: 'traveller',
    edition: 'experimental',
    editionLabel: 'Experimental',
    isOfficial: false,
    isExperimental: true,
    ability: 'Each night*, choose a player: they are safe from the Demon tonight.',
  },
  vodyanoi: {
    id: 'vodyanoi',
    name: 'Vodyanoi',
    icon: '🌊',
    team: 'traveller',
    edition: 'experimental',
    editionLabel: 'Experimental',
    isOfficial: false,
    isExperimental: true,
    ability: 'Each night*, choose a Minion: they wake and make a choice.',
  },
};

/**
 * Filter Travellers by script name or edition
 */
export function getScriptTravellers(scriptName = '') {
  const norm = String(scriptName).toLowerCase();
  if (norm.includes('trouble')) {
    return Object.values(TRAVELLERS_DB).filter((t) => t.edition === 'tb');
  }
  if (norm.includes('bad moon') || norm.includes('bmr')) {
    return Object.values(TRAVELLERS_DB).filter((t) => t.edition === 'bmr');
  }
  if (norm.includes('sects') || norm.includes('violet') || norm.includes('snv')) {
    return Object.values(TRAVELLERS_DB).filter((t) => t.edition === 'snv');
  }
  // Default to official core Travellers if unknown
  return Object.values(TRAVELLERS_DB).filter((t) => t.isOfficial);
}

export function getAllTravellers() {
  return Object.values(TRAVELLERS_DB);
}
