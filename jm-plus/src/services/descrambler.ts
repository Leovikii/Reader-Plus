import type { PageImage } from '../types';

/** Read scramble params from the page's global variables. */
export function getScrambleParams(): { aid: number; scrambleId: number } {
  const w = (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window) as any;
  return {
    aid: parseInt(w.aid, 10) || 0,
    scrambleId: parseInt(w.scramble_id, 10) || 0,
  };
}

/** Get the page's md5 function (lives on the page, not in userscript sandbox). */
function pageMd5(input: string): string {
  const w = (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window) as any;
  if (typeof w.md5 === 'function') return w.md5(input);
  throw new Error('md5 function not found on page');
}

/**
 * Compute how many slices a page is split into.
 * Mirrors the site's `get_num(btoa(aid), btoa(pageId))`.
 */
function getSliceCount(aid: number, pageId: string): number {
  const combined = pageMd5(btoa(String(aid)) + btoa(pageId));
  let code = combined.charCodeAt(combined.length - 1);

  if (aid >= 268850 && aid <= 421925) {
    code %= 10;
  } else if (aid >= 421926) {
    code %= 8;
  }

  const table: Record<number, number> = {
    0: 2, 1: 4, 2: 6, 3: 8, 4: 10, 5: 12, 6: 14, 7: 16, 8: 18, 9: 20,
  };
  return table[code] ?? 10;
}

/** Convert a canvas to a blob URL. */
function canvasToBlobUrl(canvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob));
        } else {
          reject(new Error('toBlob returned null'));
        }
      },
      'image/webp',
      0.92,
    );
  });
}

/** Download an image via GM_xmlhttpRequest (bypasses CORS) and return a same-origin blob URL. */
function fetchImageAsBlob(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      responseType: 'blob',
      onload(resp) {
        if (resp.status >= 200 && resp.status < 300) {
          resolve(URL.createObjectURL(resp.response as Blob));
        } else {
          reject(new Error(`GM_xmlhttpRequest failed: ${resp.status}`));
        }
      },
      onerror() {
        reject(new Error(`GM_xmlhttpRequest network error`));
      },
    });
  });
}

/** Load an image from a (same-origin) URL and wait for it to be ready. */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = src;
  });
}

/**
 * Descramble an image by reversing the slice shuffle.
 * Returns a blob-URL pointing to the restored image.
 */
async function descrambleImage(img: HTMLImageElement, sliceCount: number): Promise<string> {
  const { naturalWidth: w, naturalHeight: h } = img;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const baseHeight = Math.floor(h / sliceCount);
  const remainder = h % sliceCount;

  for (let i = 0; i < sliceCount; i++) {
    const sliceH = i === 0 ? baseHeight + remainder : baseHeight;
    const destY = i === 0 ? 0 : baseHeight * i + remainder;
    const srcY = h - baseHeight * (i + 1) - remainder;
    ctx.drawImage(img, 0, srcY, w, sliceH, 0, destY, w, sliceH);
  }

  return canvasToBlobUrl(canvas);
}

// In-memory cache: original url → resolved blob-URL
const cache = new Map<string, string>();

/**
 * Resolve a PageImage to a displayable URL.
 * For normal images, returns the original URL.
 * For scrambled images:
 *   1. GM_xmlhttpRequest downloads the image (bypasses CORS)
 *   2. Creates a same-origin blob URL from the response
 *   3. Loads a new Image from the blob URL (no taint)
 *   4. Draws slices onto canvas and exports as blob URL
 */
export async function resolveImageUrl(
  page: PageImage,
  aid: number,
): Promise<string> {
  if (!page.needsDescramble) return page.url;

  const cached = cache.get(page.url);
  if (cached) return cached;

  const blobSrc = await fetchImageAsBlob(page.url);
  const img = await loadImage(blobSrc);
  URL.revokeObjectURL(blobSrc);

  const sliceCount = getSliceCount(aid, page.pageId);
  const blobUrl = await descrambleImage(img, sliceCount);

  cache.set(page.url, blobUrl);
  return blobUrl;
}
