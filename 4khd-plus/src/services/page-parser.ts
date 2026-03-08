const parser = new DOMParser();

export function parseCurrentPageImages(doc: Document): string[] {
  const imgs = doc.querySelectorAll('.entry-content img');
  return Array.from(imgs)
    .map(img => (img as HTMLImageElement).src || img.getAttribute('src') || '')
    .filter(src => src && !src.includes('data:') && !src.includes('emoji'));
}

export function parsePagination(doc: Document): {
  currentPage: number;
  totalPages: number;
  nextUrl: string | null;
  prevUrl: string | null;
} {
  const items = doc.querySelectorAll('.page-links li');
  if (items.length === 0) {
    return { currentPage: 1, totalPages: 1, nextUrl: null, prevUrl: null };
  }

  let currentPage = 1;
  const totalPages = items.length;
  let currentIdx = -1;

  items.forEach((li, idx) => {
    const a = li.querySelector('a');
    if (!a) {
      currentPage = parseInt(li.textContent?.trim() || '1');
      currentIdx = idx;
    }
  });

  let nextUrl: string | null = null;
  let prevUrl: string | null = null;

  if (currentIdx >= 0 && currentIdx < items.length - 1) {
    const nextA = items[currentIdx + 1]?.querySelector('a');
    if (nextA) nextUrl = (nextA as HTMLAnchorElement).href;
  }
  if (currentIdx > 0) {
    const prevA = items[currentIdx - 1]?.querySelector('a');
    if (prevA) prevUrl = (prevA as HTMLAnchorElement).href;
  }

  return { currentPage, totalPages, nextUrl, prevUrl };
}

export async function fetchPageImages(url: string): Promise<{
  images: string[];
  nextUrl: string | null;
  prevUrl: string | null;
}> {
  const response = await fetch(url);
  const html = await response.text();
  const doc = parser.parseFromString(html, 'text/html');

  // Fix relative URLs: extract img src from parsed HTML
  const imgs = doc.querySelectorAll('.entry-content img');
  const images = Array.from(imgs)
    .map(img => {
      const src = img.getAttribute('src') || '';
      if (src.startsWith('http')) return src;
      // Resolve relative URL
      try { return new URL(src, url).href; } catch { return ''; }
    })
    .filter(src => src && !src.includes('data:') && !src.includes('emoji'));

  const pagination = parsePagination(doc);
  // Fix relative pagination URLs
  let nextUrl = pagination.nextUrl;
  let prevUrl = pagination.prevUrl;
  if (nextUrl && !nextUrl.startsWith('http')) {
    try { nextUrl = new URL(nextUrl, url).href; } catch { nextUrl = null; }
  }
  if (prevUrl && !prevUrl.startsWith('http')) {
    try { prevUrl = new URL(prevUrl, url).href; } catch { prevUrl = null; }
  }

  return { images, nextUrl, prevUrl };
}
