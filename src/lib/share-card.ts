// Share cards: the 1200×630 images link previews show. Drawn at build time with satori → resvg.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

import { CARD } from '../data/site';

const C = {
  paper: '#f1e9d8',
  paperDeep: '#e6dbc4',
  card: '#fbf7ee',
  ink: '#23201b',
  inkSoft: '#49423a',
  inkFaint: '#6e655a',
  moss: '#4f5d3a',
  rose: '#a8545c',
  tape: 'rgba(222, 204, 160, 0.78)',
};

const root = process.cwd();
const font = (pkg: string, file: string) => readFile(join(root, 'node_modules/@fontsource', pkg, 'files', file));

let fontsP: Promise<Parameters<typeof satori>[1]['fonts']> | undefined;
const fonts = () =>
  (fontsP ??= Promise.all([
    font('cormorant-garamond', 'cormorant-garamond-latin-500-italic.woff').then((data) => ({ name: 'Cormorant', data, weight: 500 as const, style: 'italic' as const })),
    font('cormorant-garamond', 'cormorant-garamond-latin-500-normal.woff').then((data) => ({ name: 'Cormorant', data, weight: 500 as const, style: 'normal' as const })),
    font('caveat', 'caveat-latin-600-normal.woff').then((data) => ({ name: 'Caveat', data, weight: 600 as const, style: 'normal' as const })),
    font('caveat', 'caveat-latin-ext-600-normal.woff').then((data) => ({ name: 'Caveat', data, weight: 600 as const, style: 'normal' as const })),
    font('jetbrains-mono', 'jetbrains-mono-latin-400-normal.woff').then((data) => ({ name: 'Mono', data, weight: 400 as const, style: 'normal' as const })),
  ]));

/** Read a local image, fit it inside w×h, and return a data URI plus its rendered size. */
export async function photo(relPath: string, w: number, h: number) {
  const { data, info } = await sharp(join(root, relPath))
    .resize(w, h, { fit: 'inside', withoutEnlargement: false })
    .flatten({ background: C.card })
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });
  return { src: `data:image/jpeg;base64,${data.toString('base64')}`, width: info.width, height: info.height };
}

// Tiny hyperscript so this file needs no JSX runtime.
type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: (Node | string | false | undefined)[]): Node => ({
  type,
  props: { style: { display: 'flex', ...style }, children: children.filter(Boolean) },
});

type Photo = Awaited<ReturnType<typeof photo>>;

/** A photo pinned to the page: white border, a strip of tape, a slight tilt. */
const pinned = (p: Photo, tilt: number, caption?: string) =>
  h(
    'div',
    {
      position: 'relative',
      flexDirection: 'column',
      padding: caption ? '14px 14px 10px' : '14px',
      background: C.card,
      transform: `rotate(${tilt}deg)`,
      boxShadow: '0 2px 3px rgba(60,44,24,0.10), 0 22px 40px -14px rgba(60,44,24,0.45)',
    },
    { type: 'img', props: { src: p.src, width: p.width, height: p.height, style: { objectFit: 'cover' } } },
    caption && h('div', { fontFamily: 'Mono', fontSize: 15, letterSpacing: 2, color: C.inkFaint, marginTop: 10 }, caption),
    h('div', {
      position: 'absolute',
      top: -16,
      left: p.width / 2 - 60,
      width: 150,
      height: 34,
      background: C.tape,
      transform: `rotate(${-tilt * 1.6 - 3}deg)`,
    }),
  );

const PAD_X = 64;
const PAD_Y = 56;
const GAP = 64;
const INNER_H = CARD.height - PAD_Y * 2;
/** A text column of an exact width, filling the page's inner height. */
const column = (width: number, ...children: (Node | undefined)[]) =>
  h('div', { width, height: INNER_H, flexShrink: 0, flexDirection: 'column', justifyContent: 'space-between' }, ...children);

const page = (...children: Node[]) =>
  h(
    'div',
    {
      width: CARD.width,
      height: CARD.height,
      boxSizing: 'border-box',
      background: C.paper,
      backgroundImage: `radial-gradient(circle at 18% 12%, ${C.card} 0%, ${C.paper} 55%, ${C.paperDeep} 100%)`,
      padding: `${PAD_Y}px ${PAD_X}px`,
      alignItems: 'center',
      gap: GAP,
      color: C.ink,
    },
    ...children,
  );

const masthead = (size: number) =>
  h('div', { fontFamily: 'Caveat', fontSize: size, color: C.moss, lineHeight: 1 }, 'shattered poise,');

const mono = (text: string, extra: Record<string, unknown> = {}) =>
  h('div', { fontFamily: 'Mono', fontSize: 19, letterSpacing: 3, textTransform: 'uppercase', color: C.inkFaint, ...extra }, text);

async function render(node: Node) {
  const svg = await satori(node as never, { ...CARD, fonts: await fonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: CARD.width } }).render().asPng();
}

export async function pieceCard(o: { title: string; subtitle?: string; no: string; lang: 'en' | 'id'; shelf: string; cover: string }) {
  const cover = await photo(o.cover, 400, 440);
  const size = o.title.length > 70 ? 50 : o.title.length > 40 ? 60 : 74;
  return render(
    page(
      h('div', { width: 440, flexShrink: 0, justifyContent: 'center' }, pinned(cover, -2.2)),
      column(
        CARD.width - PAD_X * 2 - GAP - 440,
        mono(`no. ${o.no}  ·  ${o.lang === 'id' ? 'bahasa' : 'english'}  ·  ${o.shelf}`),
        h(
          'div',
          { flexDirection: 'column', gap: 18 },
          h('div', { fontFamily: 'Cormorant', fontStyle: 'italic', fontSize: size, lineHeight: 1.04, color: C.ink }, o.title),
          o.subtitle
            ? h('div', { fontFamily: 'Cormorant', fontSize: 30, lineHeight: 1.25, color: C.inkSoft }, o.subtitle.length > 120 ? `${o.subtitle.slice(0, 117).trimEnd()}…` : o.subtitle)
            : undefined,
        ),
        h('div', { flexDirection: 'column', gap: 6 }, masthead(54), mono('by fayza divanti', { fontSize: 17, color: C.rose })),
      ),
    ),
  );
}

export async function wallCard(o: { tagline: string }) {
  const art = await photo('src/assets/art/ophelia.jpg', 440, 400);
  return render(
    page(
      column(
        CARD.width - PAD_X * 2 - GAP - 480,
        mono('an archive in two languages'),
        h(
          'div',
          { flexDirection: 'column' },
          h('div', { fontFamily: 'Caveat', fontSize: 136, lineHeight: 0.95, color: C.moss }, 'shattered'),
          h('div', { fontFamily: 'Caveat', fontSize: 136, lineHeight: 0.95, color: C.moss, paddingLeft: 64 }, 'poise,'),
        ),
        h(
          'div',
          { flexDirection: 'column', gap: 8 },
          h('div', { fontFamily: 'Cormorant', fontStyle: 'italic', fontSize: 34, color: C.inkSoft }, o.tagline),
          mono('by fayza divanti', { fontSize: 17, color: C.rose }),
        ),
      ),
      h('div', { width: 480, flexShrink: 0, justifyContent: 'center' }, pinned(art, 2.4, 'FIG. 01  ·  OPHELIA')),
    ),
  );
}

export async function aboutCard() {
  const portrait = await photo('src/assets/portrait-bw.png', 380, 380);
  return render(
    page(
      h('div', { width: 440, flexShrink: 0, justifyContent: 'center' }, pinned(portrait, -2.6, 'FIG. 00  ·  FAY')),
      column(
        CARD.width - PAD_X * 2 - GAP - 440,
        mono('about'),
        h(
          'div',
          { flexDirection: 'column', gap: 14 },
          h('div', { fontFamily: 'Cormorant', fontStyle: 'italic', fontSize: 92, lineHeight: 1, color: C.ink }, 'Fayza Divanti,'),
          h('div', { fontFamily: 'Cormorant', fontSize: 40, color: C.inkSoft }, 'in her own words.'),
        ),
        masthead(54),
      ),
    ),
  );
}
