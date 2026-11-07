// Canonical Blood on the Clocktower Role Reminder Tokens database
// Essential for Storytellers and the Spy who sees the full Grimoire with reminders

export const ROLE_REMINDERS_DB = {
  // === Trouble Brewing ===
  washerwoman: [
    { id: 'washerwoman_townsfolk', role: 'washerwoman', label: 'Townsfolk', icon: '🧺' },
    { id: 'washerwoman_wrong', role: 'washerwoman', label: 'Wrong', icon: '🧺' },
  ],
  librarian: [
    { id: 'librarian_outsider', role: 'librarian', label: 'Outsider', icon: '📚' },
    { id: 'librarian_wrong', role: 'librarian', label: 'Wrong', icon: '📚' },
  ],
  investigator: [
    { id: 'investigator_minion', role: 'investigator', label: 'Minion', icon: '🔍' },
    { id: 'investigator_wrong', role: 'investigator', label: 'Wrong', icon: '🔍' },
  ],
  fortuneteller: [
    { id: 'fortuneteller_red_herring', role: 'fortuneteller', label: 'Red herring', icon: '🔮' },
  ],
  undertaker: [
    { id: 'undertaker_died_today', role: 'undertaker', label: 'Died today', icon: '⚰️' },
  ],
  monk: [
    { id: 'monk_safe', role: 'monk', label: 'Safe', icon: '🛡️' },
  ],
  ravenkeeper: [
    { id: 'ravenkeeper_died_today', role: 'ravenkeeper', label: 'Died today', icon: '🦅' },
  ],
  virgin: [
    { id: 'virgin_no_ability', role: 'virgin', label: 'No ability', icon: '🕊️' },
  ],
  slayer: [
    { id: 'slayer_no_ability', role: 'slayer', label: 'No ability', icon: '🏹' },
  ],
  butler: [
    { id: 'butler_master', role: 'butler', label: 'Master', icon: '🛎️' },
  ],
  drunk: [
    { id: 'drunk_drunk', role: 'drunk', label: 'Drunk', icon: '🍺' },
  ],
  poisoner: [
    { id: 'poisoner_poisoned', role: 'poisoner', label: 'Poisoned', icon: '🧪' },
  ],
  scarletwoman: [
    { id: 'scarletwoman_demon', role: 'scarletwoman', label: 'Is the Demon', icon: '💃' },
  ],

  // === Bad Moon Rising ===
  grandmother: [
    { id: 'grandmother_grandchild', role: 'grandmother', label: 'Grandchild', icon: '👵' },
  ],
  sailor: [
    { id: 'sailor_drunk', role: 'sailor', label: 'Drunk', icon: '⚓' },
  ],
  exorcist: [
    { id: 'exorcist_chosen', role: 'exorcist', label: 'Chosen', icon: '✝️' },
  ],
  innkeeper: [
    { id: 'innkeeper_safe', role: 'innkeeper', label: 'Safe', icon: '🍺' },
    { id: 'innkeeper_drunk', role: 'innkeeper', label: 'Drunk', icon: '🍺' },
  ],
  gambler: [
    { id: 'gambler_dead', role: 'gambler', label: 'Dead', icon: '🎲' },
  ],
  gossip: [
    { id: 'gossip_dead', role: 'gossip', label: 'Dead', icon: '🗣️' },
  ],
  courtier: [
    { id: 'courtier_drunk_1', role: 'courtier', label: 'Drunk 1', icon: '👑' },
    { id: 'courtier_drunk_2', role: 'courtier', label: 'Drunk 2', icon: '👑' },
    { id: 'courtier_drunk_3', role: 'courtier', label: 'Drunk 3', icon: '👑' },
  ],
  professor: [
    { id: 'professor_alive', role: 'professor', label: 'Alive', icon: '🎓' },
    { id: 'professor_no_ability', role: 'professor', label: 'No ability', icon: '🎓' },
  ],
  minstrel: [
    { id: 'minstrel_everyone_drunk', role: 'minstrel', label: 'Everyone drunk', icon: '🪕' },
  ],
  fool: [
    { id: 'fool_no_ability', role: 'fool', label: 'No ability', icon: '🃏' },
  ],
  goon: [
    { id: 'goon_drunk', role: 'goon', label: 'Drunk', icon: '🥊' },
  ],
  lunatic: [
    { id: 'lunatic_attack_1', role: 'lunatic', label: 'Attack 1', icon: '🤪' },
    { id: 'lunatic_attack_2', role: 'lunatic', label: 'Attack 2', icon: '🤪' },
    { id: 'lunatic_attack_3', role: 'lunatic', label: 'Attack 3', icon: '🤪' },
  ],
  tinker: [
    { id: 'tinker_dead', role: 'tinker', label: 'Dead', icon: '🔧' },
  ],
  moonchild: [
    { id: 'moonchild_dead', role: 'moonchild', label: 'Dead', icon: '🌙' },
  ],
  godfather: [
    { id: 'godfather_died_today', role: 'godfather', label: 'Died today', icon: '🥀' },
    { id: 'godfather_dead', role: 'godfather', label: 'Dead', icon: '🥀' },
  ],
  devilsadvocate: [
    { id: 'devilsadvocate_survives', role: 'devilsadvocate', label: 'Survives execution', icon: '📜' },
  ],
  assassin: [
    { id: 'assassin_dead', role: 'assassin', label: 'Dead', icon: '🗡️' },
    { id: 'assassin_no_ability', role: 'assassin', label: 'No ability', icon: '🗡️' },
  ],
  zombuul: [
    { id: 'zombuul_died_today', role: 'zombuul', label: 'Died today', icon: '🧟' },
  ],
  pukka: [
    { id: 'pukka_poisoned_1', role: 'pukka', label: 'Poisoned 1', icon: '🪱' },
    { id: 'pukka_poisoned_2', role: 'pukka', label: 'Poisoned 2', icon: '🪱' },
    { id: 'pukka_dead', role: 'pukka', label: 'Dead', icon: '🪱' },
  ],
  shabaloth: [
    { id: 'shabaloth_alive', role: 'shabaloth', label: 'Alive', icon: '🐊' },
    { id: 'shabaloth_dead', role: 'shabaloth', label: 'Dead', icon: '🐊' },
  ],
  po: [
    { id: 'po_3_attacks', role: 'po', label: '3 attacks', icon: '💨' },
  ],

  // === Sects & Violets ===
  snakecharmer: [
    { id: 'snakecharmer_poisoned', role: 'snakecharmer', label: 'Poisoned', icon: '🐍' },
  ],
  mathematician: [
    { id: 'mathematician_abnormal', role: 'mathematician', label: 'Abnormal', icon: '➗' },
  ],
  flowergirl: [
    { id: 'flowergirl_demon_voted', role: 'flowergirl', label: 'Demon voted', icon: '🌸' },
  ],
  towncrier: [
    { id: 'towncrier_minions_voted', role: 'towncrier', label: 'Minions voted', icon: '📢' },
  ],
  seamstress: [
    { id: 'seamstress_no_ability', role: 'seamstress', label: 'No ability', icon: '🧵' },
  ],
  philosopher: [
    { id: 'philosopher_drunk', role: 'philosopher', label: 'Drunk', icon: '🏛️' },
    { id: 'philosopher_is_char', role: 'philosopher', label: 'Is Character', icon: '🏛️' },
  ],
  artist: [
    { id: 'artist_no_ability', role: 'artist', label: 'No ability', icon: '🎨' },
  ],
  sweetheart: [
    { id: 'sweetheart_drunk', role: 'sweetheart', label: 'Drunk', icon: '💔' },
  ],
  barber: [
    { id: 'barber_haircut', role: 'barber', label: 'Haircut', icon: '💈' },
  ],
  eviltwin: [
    { id: 'eviltwin_twin', role: 'eviltwin', label: 'Twin', icon: '♊' },
  ],
  witch: [
    { id: 'witch_cursed', role: 'witch', label: 'Cursed', icon: '🧙' },
  ],
  cerenovus: [
    { id: 'cerenovus_mad', role: 'cerenovus', label: 'Mad', icon: '🧠' },
  ],
  pithag: [
    { id: 'pithag_transformed', role: 'pithag', label: 'Transformed', icon: '🧙‍♀️' },
  ],
  fanggu: [
    { id: 'fanggu_once', role: 'fanggu', label: 'Once', icon: '🐒' },
  ],
  vigormortis: [
    { id: 'vigormortis_has_ability', role: 'vigormortis', label: 'Has ability', icon: '💀' },
    { id: 'vigormortis_poisoned', role: 'vigormortis', label: 'Poisoned', icon: '💀' },
  ],
  nodashii: [
    { id: 'nodashii_poisoned', role: 'nodashii', label: 'Poisoned', icon: '🐉' },
  ],

  // === Travellers ===
  bureaucrat: [
    { id: 'bureaucrat_3_votes', role: 'bureaucrat', label: '3 votes', icon: '📜' },
  ],
  thief: [
    { id: 'thief_negative_vote', role: 'thief', label: 'Negative vote', icon: '🥷' },
  ],
  bonecollector: [
    { id: 'bonecollector_has_ability', role: 'bonecollector', label: 'Has ability', icon: '🦴' },
    { id: 'bonecollector_no_ability', role: 'bonecollector', label: 'No ability', icon: '🦴' },
  ],
  barista: [
    { id: 'barista_sober', role: 'barista', label: 'Sober & Healthy', icon: '☕' },
    { id: 'barista_twice', role: 'barista', label: 'Acts twice', icon: '☕' },
  ],
  orderly: [
    { id: 'orderly_safe', role: 'orderly', label: 'Safe', icon: '🩺' },
  ],
};

// Common generic reminders always available
export const GENERIC_REMINDERS = [
  { id: 'Poisoned', label: 'Poisoned', icon: '🧪' },
  { id: 'Safe', label: 'Safe', icon: '🛡️' },
  { id: 'Drunk', label: 'Drunk', icon: '🍺' },
  { id: 'Mad', label: 'Mad', icon: '🤪' },
  { id: 'Dead', label: 'Died Tonight', icon: '💀' },
];

/**
 * Returns all reminder tokens associated with the characters active in the game,
 * plus generic reminders.
 */
export function getAvailableReminders(activeRoleIds = []) {
  const seen = new Set();
  const list = [];

  // 1. Role-specific reminders for all roles present
  activeRoleIds.forEach((rid) => {
    const roleRems = ROLE_REMINDERS_DB[rid];
    if (Array.isArray(roleRems)) {
      roleRems.forEach((rem) => {
        if (!seen.has(rem.id)) {
          seen.add(rem.id);
          list.push(rem);
        }
      });
    }
  });

  // 2. Generic fallback reminders
  GENERIC_REMINDERS.forEach((rem) => {
    if (!seen.has(rem.id)) {
      seen.add(rem.id);
      list.push(rem);
    }
  });

  return list;
}

/**
 * Resolves icon and label for any reminder ID (canonical or legacy string)
 */
export function resolveReminderInfo(remId) {
  if (!remId) return { id: '', label: '', icon: '🏷️' };

  // Look in all role reminders
  for (const group of Object.values(ROLE_REMINDERS_DB)) {
    const found = group.find((r) => r.id === remId);
    if (found) return found;
  }

  // Look in generic
  const gen = GENERIC_REMINDERS.find((r) => r.id === remId || r.label.toLowerCase() === remId.toLowerCase());
  if (gen) return gen;

  // Fallback for custom or legacy string
  return { id: remId, label: remId, icon: '🏷️' };
}
