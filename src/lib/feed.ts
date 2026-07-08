import { XMLParser } from 'fast-xml-parser';

const FEED_URL = 'https://feeds.buzzsprout.com/2570635.rss';

export interface Episode {
  num: number;
  title: string;
  slug: string;
  summary: string;
  /** Full show notes as HTML (from the RSS description). */
  notesHtml: string;
  mp3: string;
  date: Date;
  /** Duration in seconds. */
  duration: number;
  guid: string;
}

export function formatDuration(seconds: number): string {
  return `${Math.round(seconds / 60)} MIN`;
}

export function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export function formatDateShort(d: Date): string {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export function formatDateLong(d: Date): string {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function epNum(n: number): string {
  return `EP ${String(n).padStart(3, '0')}`;
}

function slugFromEnclosure(url: string): string {
  // .../episodes/19440756-micron-s-record-profits-....mp3 -> keep the words, drop the id
  const base = url.split('/').pop()?.replace(/\.mp3$/, '') ?? '';
  return base.replace(/^\d+-/, '');
}

function text(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'object' && '#text' in (v as Record<string, unknown>)) {
    return String((v as Record<string, unknown>)['#text']);
  }
  return String(v);
}

let cache: Episode[] | null = null;

export async function getEpisodes(): Promise<Episode[]> {
  if (cache) return cache;
  const res = await fetch(FEED_URL, { headers: { 'user-agent': 'semi-doped-website/1.0' } });
  if (!res.ok) throw new Error(`Feed fetch failed: ${res.status}`);
  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
  const doc = parser.parse(xml);
  const items = doc.rss?.channel?.item ?? [];
  const list = Array.isArray(items) ? items : [items];

  // Feed is newest-first; number from the oldest up.
  const total = list.length;
  const episodes: Episode[] = list.map((item: any, i: number) => {
    const mp3 = item.enclosure?.['@_url'] ?? '';
    return {
      num: total - i,
      title: text(item.title),
      slug: slugFromEnclosure(mp3),
      summary: text(item['itunes:summary']),
      notesHtml: text(item.description),
      mp3,
      date: new Date(text(item.pubDate)),
      duration: Number(text(item['itunes:duration'])) || 0,
      guid: text(item.guid),
    };
  });
  cache = episodes;
  return episodes;
}
