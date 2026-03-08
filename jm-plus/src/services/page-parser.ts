import type { PageImage } from '../types';
import { getScrambleParams } from './descrambler';

export function parseCurrentPageImages(doc: Document): PageImage[] {
  const { aid, scrambleId } = getScrambleParams();
  const needsScramble = aid >= scrambleId;

  const pages = doc.querySelectorAll('.scramble-page');
  return Array.from(pages)
    .map((page): PageImage | null => {
      const img = page.querySelector('img') as HTMLImageElement | null;
      if (!img) return null;

      const src = img.getAttribute('data-original') || img.src || '';
      if (!src || src.includes('blank.jpg') || src.includes('data:')) return null;

      const pageId = (page.id || img.id || '').split('.')[0];
      if (!pageId) return null;
      const isGif = src.endsWith('.gif');

      return {
        url: src,
        pageId,
        needsDescramble: needsScramble && !isGif,
      };
    })
    .filter((item): item is PageImage => item !== null);
}
