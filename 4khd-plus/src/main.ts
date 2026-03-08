import 'virtual:uno.css';
import './ui/styles.css';

import { store } from './state/store';
import { parseCurrentPageImages, parsePagination } from './services/page-parser';
import { createFloatControl } from './ui/float-control';
import { createSinglePageOverlay } from './ui/single-page/overlay';
import { registerMenuCommands } from './menu-commands';

// Neutralize the site's anti-devtools script (disabley.min.js) which
// detects DOM mutations and calls history.back() in a loop.
history.pushState(null, '', location.href);
window.addEventListener('popstate', () => {
  history.pushState(null, '', location.href);
});

(function main() {
  // 1. Check we're on a page with images
  const images = parseCurrentPageImages(document);
  if (images.length === 0) return;

  // 2. Parse pagination
  const pagination = parsePagination(document);
  store.currPage = pagination.currentPage;
  store.totalPages = pagination.totalPages;
  store.nextUrl = pagination.nextUrl;
  store.prevUrl = pagination.prevUrl;

  // 3. Store initial images
  store.allImages = images;
  store.pageRanges.push({ url: window.location.href, start: 0, count: images.length });
  store.loadedPageUrls.add(window.location.href);

  // 4. Create float control + reader overlay
  let spmHandle: ReturnType<typeof createSinglePageOverlay>;

  createFloatControl({
    open: (startIndex?: number) => spmHandle.open(startIndex),
    close: () => spmHandle.close(),
    isActive: () => spmHandle.isActive(),
    getOverlayElement: () => spmHandle.getOverlayElement(),
    jumpTo: (index: number) => spmHandle.jumpTo(index),
  });

  spmHandle = createSinglePageOverlay();

  // 5. Click page images to enter reader at that position
  const pageImgs = document.querySelectorAll('.entry-content img');
  const filteredImgs = Array.from(pageImgs).filter(img => {
    const src = (img as HTMLImageElement).src || img.getAttribute('src') || '';
    return src && !src.includes('data:') && !src.includes('emoji');
  });
  filteredImgs.forEach((img, localIndex) => {
    (img as HTMLElement).style.cursor = 'pointer';
    img.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      spmHandle.open(localIndex);
    });
  });

  // 6. Menu commands
  registerMenuCommands();

  // 7. Auto enter reader
  if (store.settings.autoEnterSinglePage) {
    setTimeout(() => spmHandle.open(), 500);
  }
})();
