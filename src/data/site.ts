export const SITE = {
  name: 'shattered poise,',
  author: 'Fayza Divanti',
  tagline: 'worn by time, yet unfurling in the ruins',
  url: 'https://www.sorrowflux.com',
  x: '@woesarrc',
  description:
    'shattered poise, | essays and prose poems by Fayza Divanti, on grief, tenderness, and the politics of being a woman. in english and bahasa indonesia.',
};

/** Share card size (the 1.91:1 link-preview shape). */
export const CARD = { width: 1200, height: 630 } as const;

/** schema.org identity, shared by the Wall, about and every Piece. */
export const PERSON = {
  '@type': 'Person',
  '@id': `${SITE.url}/about/#person`,
  name: SITE.author,
  url: `${SITE.url}/about/`,
  sameAs: ['https://x.com/woesarrc', 'https://x.com/etoixl', 'https://sorrowflux.substack.com'],
};

export const SHELVES = {
  'tender-things': { label: 'tender things', note: 'grief, healing, love, self-worth' },
  'against-the-grain': { label: 'against the grain', note: 'political & feminist essays' },
  'songs-and-tributes': { label: 'songs & tributes', note: 'pieces built around a song or an artist' },
} as const;
export type ShelfId = keyof typeof SHELVES;

export const LINKS = [
  { label: '@woesarrc', name: 'fay', href: 'https://x.com/woesarrc' },
  { label: '@etoixl', name: '❦', href: 'https://x.com/etoixl' },
];

/** Her own lines, verbatim. `slug` links back to the Piece they came from. */
export const QUOTES = [
  { text: 'i had been becoming, always becoming.', slug: 'how-could-i-have-been-so-tender-with' },
  { text: 'i want to be seen in full technicolor, not muted into some grayscale version of myself.', slug: 'if-volume-were-a-measure-of-emotion' },
  { text: 'lateness does not cancel meaning.', slug: 'i-release-you-gently' },
  { text: 'memory doesn’t obey timelines.', slug: 'where-healing-lingers' },
  { text: 'kadang aku sadar aku sedang merasa sesuatu tanpa langsung menilainya, dan itu terasa aneh sekaligus melegakan.', slug: 'aku-tinggal-di-sela-denyut-dan-ingatan', lang: 'id' },
  { text: 'i’m learning that calm doesn’t announce itself with relief.', slug: 'learning-to-look-at-myself-without' },
  { text: 'this framing depends on forgetting history.', slug: 'venezuela-and-america-in-an-imperial' },
  { text: 'perhaps acceptance begins the moment you stop negotiating with reality.', slug: 'on-grieving-possibility' },
];

export const LOGISMOS = {
  text: 'logismos (λογισμός), rational reckoning, restrains pleonexia (πλεονεξία), the desire to have more than one’s share.',
  cite: 'fr. 3, dk 47 b3',
};

export const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' }).toLowerCase();
export const pad = (n: number) => String(n).padStart(3, '0');
