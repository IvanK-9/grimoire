// Official Blood on the Clocktower Script Presets and Custom Script Parser

export const SCRIPT_PRESETS = {
  trouble_brewing: {
    id: 'trouble_brewing',
    name: 'Trouble Brewing',
    edition: 'Official Core',
    color: 'crimson',
    description: 'The quintessential Blood on the Clocktower experience. Perfect for both beginners and veterans.',
    roles: [
      'washerwoman', 'librarian', 'investigator', 'chef', 'empath',
      'fortuneteller', 'undertaker', 'monk', 'ravenkeeper', 'virgin',
      'slayer', 'soldier', 'mayor',
      'butler', 'drunk', 'recluse', 'saint',
      'poisoner', 'spy', 'scarletwoman', 'baron',
      'imp'
    ]
  },
  bad_moon_rising: {
    id: 'bad_moon_rising',
    name: 'Bad Moon Rising',
    edition: 'Official Core',
    color: 'amber',
    description: 'A deadly script filled with protection, resurrection, execution prevention, and multiple night deaths.',
    roles: [
      'grandmother', 'sailor', 'chambermaid', 'exorcist', 'innkeeper',
      'gambler', 'gossip', 'courtier', 'professor', 'minstrel',
      'tealady', 'pacifist', 'fool',
      'goon', 'lunatic', 'tinker', 'moonchild',
      'godfather', 'devilsadvocate', 'assassin', 'mastermind',
      'zombuul', 'pukka', 'shabaloth', 'po'
    ]
  },
  sects_and_violets: {
    id: 'sects_and_violets',
    name: 'Sects & Violets',
    edition: 'Official Core',
    color: 'purple',
    description: 'A wild script of information, madness, changing alignments, and reality-altering abilities.',
    roles: [
      'clockmaker', 'dreamer', 'snakecharmer', 'mathematician', 'flowergirl',
      'towncrier', 'oracle', 'savant', 'seamstress', 'philosopher',
      'artist', 'juggler', 'sage',
      'mutant', 'sweetheart', 'barber', 'klutz',
      'eviltwin', 'witch', 'cerenovus', 'pithag',
      'fanggu', 'vigormortis', 'nodashii', 'vortox'
    ]
  }
};

/**
 * Parses any official or community BotC Script JSON (file or string).
 * Supports standard array of string IDs, meta headers, or objects with { id: "..." }.
 */
export function parseScriptJson(jsonStringOrObject) {
  try {
    const data = typeof jsonStringOrObject === 'string' ? JSON.parse(jsonStringOrObject) : jsonStringOrObject;
    if (!Array.isArray(data)) {
      throw new Error('Script JSON must be an array of characters or objects.');
    }

    let scriptName = 'Custom Script';
    let author = '';
    const roles = [];

    data.forEach((item) => {
      if (typeof item === 'string') {
        const clean = item.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (clean && clean !== 'meta') roles.push(clean);
      } else if (item && typeof item === 'object') {
        if (item.id === '_meta' || item.id === 'meta') {
          if (item.name) scriptName = String(item.name).trim();
          if (item.author) author = String(item.author).trim();
        } else if (item.id) {
          const clean = String(item.id).toLowerCase().replace(/[^a-z0-9]/g, '');
          if (clean) roles.push(clean);
        }
      }
    });

    if (roles.length === 0) {
      throw new Error('No valid character IDs found in this script.');
    }

    // Deduplicate while preserving order
    const uniqueRoles = Array.from(new Set(roles));

    return {
      name: scriptName,
      author,
      roles: uniqueRoles,
    };
  } catch (err) {
    return {
      error: err.message || 'Invalid script JSON format',
    };
  }
}
