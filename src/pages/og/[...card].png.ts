import { readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE, SHELVES, pad } from '../../data/site';
import { pieceCard, wallCard, aboutCard } from '../../lib/share-card';

type Props = { kind: 'wall' } | { kind: 'about' } | { kind: 'piece'; piece: CollectionEntry<'pieces'> };

export const getStaticPaths = (async () => {
  const pieces = await getCollection('pieces');
  return [
    { params: { card: 'index' }, props: { kind: 'wall' } },
    { params: { card: 'about' }, props: { kind: 'about' } },
    ...pieces.map((piece) => ({ params: { card: `p/${piece.id}` }, props: { kind: 'piece', piece } })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute<Props> = async ({ props }) => {
  let png: Buffer;
  if (props.kind === 'wall') png = await wallCard({ tagline: SITE.tagline });
  else if (props.kind === 'about') png = await aboutCard();
  else {
    const d = props.piece.data;
    // The Cover's source file sits next to the Piece's index.md.
    const dir = dirname(props.piece.filePath!);
    const file = (await readdir(dir)).find((f) => /^cover\.(jpe?g|png|webp|avif)$/i.test(f));
    if (!file) throw new Error(`No cover.* beside ${props.piece.filePath}`);
    const cover = join(dir, file);
    png = await pieceCard({ title: d.title, subtitle: d.subtitle, no: pad(d.no), lang: d.lang, shelf: SHELVES[d.shelf].label, cover });
  }
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
