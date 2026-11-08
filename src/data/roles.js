// Comprehensive Blood on the Clocktower character database
// Includes all roles from Trouble Brewing, Bad Moon Rising, Sects & Violets, and official Travellers/Fabled/Experimental

export const EDITIONS = {
  all: { id: 'all', label: 'All Editions' },
  tb: { id: 'tb', label: 'Trouble Brewing', badge: 'bg-rose-950/70 text-rose-300 border-rose-600/40' },
  bmr: { id: 'bmr', label: 'Bad Moon Rising', badge: 'bg-amber-950/70 text-amber-300 border-amber-600/40' },
  snv: { id: 'snv', label: 'Sects & Violets', badge: 'bg-purple-950/70 text-purple-300 border-purple-600/40' },
  traveller: { id: 'traveller', label: 'Travellers', badge: 'bg-indigo-950/70 text-indigo-300 border-indigo-600/40' },
  experimental: { id: 'experimental', label: 'Experimental', badge: 'bg-emerald-950/70 text-emerald-300 border-emerald-600/40' },
};

export const ALL_ROLES_DB = {
  // === TROUBLE BREWING (TB) ===
  washerwoman: ['Washerwoman', 'townsfolk', '🧺', 'You start knowing that 1 of 2 players is a specific Townsfolk.', 'tb'],
  librarian: ['Librarian', 'townsfolk', '📚', 'You start knowing that 1 of 2 players is a specific Outsider, or that zero are in play.', 'tb'],
  investigator: ['Investigator', 'townsfolk', '🔍', 'You start knowing that 1 of 2 players is a specific Minion.', 'tb'],
  chef: ['Chef', 'townsfolk', '🍳', 'You start knowing how many pairs of evil players are sitting next to each other.', 'tb'],
  empath: ['Empath', 'townsfolk', '👁️', 'Each night, you learn how many of your 2 alive neighbours are evil.', 'tb'],
  fortuneteller: ['Fortune Teller', 'townsfolk', '🔮', 'Each night, choose 2 players: you learn if either is a Demon. 1 good player registers as a Demon.', 'tb'],
  undertaker: ['Undertaker', 'townsfolk', '⚰️', 'Each night*, you learn which character died by execution today.', 'tb'],
  monk: ['Monk', 'townsfolk', '🛡️', 'Each night*, choose a player (not yourself): they are safe from the Demon tonight.', 'tb'],
  ravenkeeper: ['Ravenkeeper', 'townsfolk', '🦅', 'If you die at night, you are woken to choose a player: you learn their character.', 'tb'],
  virgin: ['Virgin', 'townsfolk', '🕊️', 'The 1st time you are nominated, if the nominator is a Townsfolk, they are executed immediately.', 'tb'],
  slayer: ['Slayer', 'townsfolk', '🏹', 'Once per game, during the day, publicly choose a player: if they are the Demon, they die.', 'tb'],
  soldier: ['Soldier', 'townsfolk', '⚔️', 'You are safe from the Demon.', 'tb'],
  mayor: ['Mayor', 'townsfolk', '🏛️', 'If only 3 players live & no execution occurs, your team wins. If you die at night, another player might die instead.', 'tb'],
  butler: ['Butler', 'outsider', '🛎️', 'Each night, choose a master: you may only vote if they are voting too.', 'tb'],
  drunk: ['Drunk', 'outsider', '🍺', 'You do not know you are the Drunk. You think you are a Townsfolk, but you are not.', 'tb'],
  recluse: ['Recluse', 'outsider', '🦹', 'You might register as evil & as a Minion or Demon, even if dead.', 'tb'],
  saint: ['Saint', 'outsider', '😇', 'If you die by execution, your team loses.', 'tb'],
  poisoner: ['Poisoner', 'minion', '🧪', 'Each night, choose a player: they are poisoned tonight and tomorrow day.', 'tb'],
  spy: ['Spy', 'minion', '🕵️', 'Each night, you see the Grimoire. You might register as good & as a Townsfolk or Outsider, even if dead.', 'tb'],
  scarletwoman: ['Scarlet Woman', 'minion', '💃', 'If there are 5 or more players alive & the Demon dies, you become the Demon.', 'tb'],
  baron: ['Baron', 'minion', '🎩', 'There are extra Outsiders in play. [+2 Outsiders]', 'tb'],
  imp: ['Imp', 'demon', '😈', 'Each night*, choose a player: they die. If you kill yourself this way, a Minion becomes the Imp.', 'tb'],

  // === BAD MOON RISING (BMR) ===
  grandmother: ['Grandmother', 'townsfolk', '👵', 'You start knowing a good player & their character. If the Demon kills them, you die too.', 'bmr'],
  sailor: ['Sailor', 'townsfolk', '⚓', 'Each night, choose an alive player: either you or they are drunk until dusk. You can’t die.', 'bmr'],
  chambermaid: ['Chambermaid', 'townsfolk', '🧹', 'Each night, choose 2 alive players (not yourself): you learn how many woke tonight due to their ability.', 'bmr'],
  exorcist: ['Exorcist', 'townsfolk', '✝️', 'Each night*, choose a player (different to last night): the Demon, if chosen, learns who you are then doesn’t wake tonight.', 'bmr'],
  innkeeper: ['Innkeeper', 'townsfolk', '🍺', 'Each night*, choose 2 players: they can’t die tonight, but 1 is drunk until dusk.', 'bmr'],
  gambler: ['Gambler', 'townsfolk', '🎲', 'Each night*, choose a player & guess their character: if you guess wrong, you die tonight.', 'bmr'],
  gossip: ['Gossip', 'townsfolk', '🗣️', 'Each day, you may make a public statement. Tonight, if it was true, a player dies.', 'bmr'],
  courtier: ['Courtier', 'townsfolk', '👑', 'Once per game, at night, choose a character: they are drunk for 3 nights & 3 days.', 'bmr'],
  professor: ['Professor', 'townsfolk', '🎓', 'Once per game, at night*, choose a dead player: if they are a Townsfolk, they are resurrected.', 'bmr'],
  minstrel: ['Minstrel', 'townsfolk', '🪕', 'When a Minion dies by execution, all other players (except Travellers) are drunk until dusk tomorrow.', 'bmr'],
  tealady: ['Tea Lady', 'townsfolk', '🫖', 'If both your alive neighbours are good, they cannot die.', 'bmr'],
  pacifist: ['Pacifist', 'townsfolk', '☮️', 'Executed good players might not die.', 'bmr'],
  fool: ['Fool', 'townsfolk', '🃏', 'The first time you die, you don’t.', 'bmr'],
  goon: ['Goon', 'outsider', '🥊', 'Each night, the 1st player to choose you with their ability is drunk until dusk. You become their alignment.', 'bmr'],
  lunatic: ['Lunatic', 'outsider', '🤪', 'You think you are a Demon, but you are not. The Demon knows who you are & who you choose at night.', 'bmr'],
  tinker: ['Tinker', 'outsider', '🔧', 'You might die at any time.', 'bmr'],
  moonchild: ['Moonchild', 'outsider', '🌙', 'When you learn that you died, publicly choose 1 alive player. Tonight, if it was a good player, they die.', 'bmr'],
  godfather: ['Godfather', 'minion', '🥀', 'You start knowing which Outsiders are in play. If 1 died today, choose a player tonight: they die. [-1 or +1 Outsider]', 'bmr'],
  devilsadvocate: ['Devil’s Advocate', 'minion', '📜', 'Each night, choose a living player (different to last night): if executed tomorrow, they don’t die.', 'bmr'],
  assassin: ['Assassin', 'minion', '🗡️', 'Once per game, at night*, choose a player: they die, even if for some reason they could not.', 'bmr'],
  mastermind: ['Mastermind', 'minion', '🧠', 'If the Demon dies by execution (ending the game), play for 1 more day. If a player is then executed, their team loses.', 'bmr'],
  zombuul: ['Zombuul', 'demon', '🧟', 'Each night*, if no-one died today, choose a player: they die. The 1st time you die, you live but register as dead.', 'bmr'],
  pukka: ['Pukka', 'demon', '🐸', 'Each night, choose a player: they are poisoned. The previously poisoned player dies then becomes healthy.', 'bmr'],
  shabaloth: ['Shabaloth', 'demon', '🦷', 'Each night*, choose 2 players: they die. A dead player you chose last night might be regurgitated.', 'bmr'],
  po: ['Po', 'demon', '🦁', 'Each night*, you may choose a player: they die. If your last choice was no-one, choose 3 players tonight.', 'bmr'],

  // === SECTS & VIOLETS (S&V) ===
  clockmaker: ['Clockmaker', 'townsfolk', '🕰️', 'You start knowing how many steps from the Demon to its nearest Minion.', 'snv'],
  dreamer: ['Dreamer', 'townsfolk', '💭', 'Each night, choose a player (not yourself or Travellers): you learn 1 good & 1 evil character, 1 of which is correct.', 'snv'],
  snakecharmer: ['Snake Charmer', 'townsfolk', '🐍', 'Each night, choose an alive player: a chosen Demon swaps characters & alignments with you & is then poisoned.', 'snv'],
  mathematician: ['Mathematician', 'townsfolk', '📐', 'Each night, you learn how many players’ abilities worked abnormally (since dawn) due to another character’s ability.', 'snv'],
  flowergirl: ['Flowergirl', 'townsfolk', '🌸', 'Each night*, you learn if a Demon voted today.', 'snv'],
  towncrier: ['Town Crier', 'townsfolk', '📢', 'Each night*, you learn if a Minion nominated today.', 'snv'],
  oracle: ['Oracle', 'townsfolk', '🪞', 'Each night*, you learn how many dead players are evil.', 'snv'],
  savant: ['Savant', 'townsfolk', '💡', 'Each day, you may visit the Storyteller to learn 2 things in private: 1 is true & 1 is false.', 'snv'],
  seamstress: ['Seamstress', 'townsfolk', '🧵', 'Once per game, at night, choose 2 players: you learn if they are the same alignment.', 'snv'],
  philosopher: ['Philosopher', 'townsfolk', '🏛️', 'Once per game, at night, choose a Townsfolk character: you gain that ability. If it is in play, that character is drunk.', 'snv'],
  artist: ['Artist', 'townsfolk', '🎨', 'Once per game, by day, privately ask the Storyteller any yes/no question and get a truthful answer.', 'snv'],
  juggler: ['Juggler', 'townsfolk', '🤹', 'On your 1st day, publicly guess up to 5 players’ characters. That night, you learn how many you got correct.', 'snv'],
  sage: ['Sage', 'townsfolk', '🕯️', 'If the Demon kills you, you learn that you died to the Demon, and learn which of 2 players is the Demon.', 'snv'],
  mutant: ['Mutant', 'outsider', '🧬', 'If you are "mad" about being an Outsider, you might be executed.', 'snv'],
  sweetheart: ['Sweetheart', 'outsider', '💖', 'When you die, 1 player is drunk from now on.', 'snv'],
  barber: ['Barber', 'outsider', '💈', 'If you died at night, today or tonight the Demon may swap 2 players’ characters.', 'snv'],
  klutz: ['Klutz', 'outsider', '🤕', 'When you learn that you died, publicly choose 1 alive player: if they are evil, your team loses.', 'snv'],
  eviltwin: ['Evil Twin', 'minion', '♊', 'You & an opposing player know each other. If your twin dies by execution, Good wins. If both alive, Good cannot win.', 'snv'],
  witch: ['Witch', 'minion', '🧙', 'Each night, choose a player: if they nominate tomorrow, they die. If only 3 players live, you have no ability.', 'snv'],
  cerenovus: ['Cerenovus', 'minion', '🧠', 'Each night, choose a player & a character: they are "mad" that they are that character tomorrow, or risk execution.', 'snv'],
  pithag: ['Pit-Hag', 'minion', '🫕', 'Each night*, choose a player & a character they become (if not in play). Death might occur.', 'snv'],
  fanggu: ['Fang Gu', 'demon', '🐅', 'Each night*, choose a player: they die. The 1st Outsider you kill becomes an evil Fang Gu & you die instead. [+1 Outsider]', 'snv'],
  vigormortis: ['Vigormortis', 'demon', '💀', 'Each night*, choose a player: they die. Dead Minions keep their ability & 1 Townsfolk neighbor is poisoned. [-1 Outsider]', 'snv'],
  nodashii: ['No Dashii', 'demon', '🐙', 'Each night*, choose a player: they die. Your 2 Townsfolk neighbours are poisoned.', 'snv'],
  vortox: ['Vortox', 'demon', '🌀', 'Each night*, choose a player: they die. Townsfolk abilities yield false information. If no-one is executed today, Evil wins.', 'snv'],

  // === OFFICIAL TRAVELLERS ===
  gunslinger: ['Gunslinger', 'traveller', '🤠', 'Each day, after the 1st vote has been tallied, you may choose a player that voted: they die.', 'tb'],
  beggar: ['Beggar', 'traveller', '🪙', 'You have no vote tokens. To vote, you must give your token to another player.', 'tb'],
  bureaucrat: ['Bureaucrat', 'traveller', '📜', 'Each night, choose a player: their vote counts as 3 votes tomorrow.', 'tb'],
  thief: ['Thief', 'traveller', '🥷', 'Each night, choose a player: a negative vote counts against them tomorrow.', 'tb'],
  scapegoat: ['Scapegoat', 'traveller', '🐐', 'If a player of your alignment is executed, you might be executed instead.', 'tb'],
  butcher: ['Butcher', 'traveller', '🔪', 'Each day, you may nominate as many times as you like.', 'bmr'],
  bonecollector: ['Bone Collector', 'traveller', '🦴', 'Once per game, choose a dead player: they regain their ability tonight and tomorrow day.', 'bmr'],
  harlot: ['Harlot', 'traveller', '💋', 'Each night, choose a living player: learn their character, but Demon might kill you.', 'bmr'],
  judge: ['Judge', 'traveller', '⚖️', 'Once per game, you may choose to execute a nominated player immediately.', 'snv'],
  matron: ['Matron', 'traveller', '👵', 'Each day, you may choose up to 3 sets of players to swap seats.', 'snv'],
  deviant: ['Deviant', 'traveller', '🎭', 'If you were funny today, you cannot die by execution.', 'snv'],
  barista: ['Barista', 'traveller', '☕', 'Each night, choose a player: they learn true info or wake twice.', 'experimental'],
  orderly: ['Orderly', 'traveller', '🩺', 'Each night, choose a player: they are safe from the Demon tonight.', 'experimental'],
  vodyanoi: ['Vodyanoi', 'traveller', '🌊', 'Each night*, choose a Minion: they wake and make a choice.', 'experimental'],

  // === POPULAR EXPERIMENTAL / FABLED ===
  alchemist: ['Alchemist', 'townsfolk', '⚗️', 'You have a not-in-play Minion ability.', 'experimental'],
  amnesiac: ['Amnesiac', 'townsfolk', '❓', 'You do not know your ability. Each day, privately guess what it is: you learn how close you are.', 'experimental'],
  noble: ['Noble', 'townsfolk', '⚜️', 'You start knowing 3 players, 1 and only 1 of which is evil.', 'experimental'],
  pixie: ['Pixie', 'townsfolk', '🧚', 'You start knowing 1 in-play Townsfolk. If you are "mad" you are them when they die, you gain their ability.', 'experimental'],
  balloonist: ['Balloonist', 'townsfolk', '🎈', 'Each night, you learn 1 player of each character type until you learn all 4.', 'experimental'],
  heretic: ['Heretic', 'outsider', '🕯️', 'Whoever wins, loses & whoever loses, wins, even if dead.', 'experimental'],
  damsel: ['Damsel', 'outsider', '🎀', 'All Minions know you are in play. If a Minion guesses you, Evil wins.', 'experimental'],
  plaguedoctor: ['Plague Doctor', 'outsider', '🦤', 'If you die, the Storyteller gains a Minion ability.', 'experimental'],
  marionette: ['Marionette', 'minion', '🎎', 'You think you are a good character, but you are not. The Demon knows who you are. You neighbor the Demon.', 'experimental'],
  boomdandy: ['Boomdandy', 'minion', '💣', 'If you are executed, all players except 3 die.', 'experimental'],
  goblin: ['Goblin', 'minion', '👺', 'If you claim you are the Goblin publicly and are executed that day, your team wins.', 'experimental'],
  widow: ['Widow', 'minion', '🕷️', 'On night 1, you see the Grimoire and choose a player: they are poisoned. 1 good player knows a Widow is in play.', 'experimental'],
  mezepheles: ['Mezepheles', 'minion', '🗣️', 'You start knowing a secret word. The 1st good player to say it becomes evil tonight.', 'experimental'],
  riot: ['Riot', 'demon', '🔥', 'Nominees die immediately. Days are rapid fire.', 'experimental'],
  alhadikhia: ['Al-Hadikhia', 'demon', '🦂', 'Each night*, choose 3 players: they secretly decide whether to live or die. If all say live, all die.', 'experimental'],
  legion: ['Legion', 'demon', '👥', 'Each night*, a player might die. Executions require all evil players to vote. [Most players are Legion]', 'experimental'],
  leviathan: ['Leviathan', 'demon', '🐋', 'If more than 1 good player is executed, Evil wins. All players know Leviathan is in play. [No Minions]', 'experimental'],
};

export function resolveRoleInfo(id) {
  if (!id) return null;
  const cleanId = String(id).toLowerCase().replace(/[^a-z0-9]/g, '');
  if (ALL_ROLES_DB[cleanId]) {
    const entry = ALL_ROLES_DB[cleanId];
    const editionKey = entry[4] || 'custom';
    return {
      id: cleanId,
      name: entry[0],
      team: entry[1],
      icon: entry[2] || '✦',
      ability: entry[3] || '',
      edition: editionKey,
      editionLabel: EDITIONS[editionKey]?.label || 'Custom',
    };
  }
  return {
    id: cleanId,
    name: String(id).replace(/_/g, ' '),
    team: 'unknown',
    icon: '✦',
    ability: '',
    edition: 'custom',
    editionLabel: 'Custom',
  };
}

export function getAllRoles() {
  return Object.keys(ALL_ROLES_DB).map(resolveRoleInfo);
}
