import 'virtual:uno.css';
import './ui/styles.css';

import { store } from './state/store';
import { parseCurrentPageImages } from './services/page-parser';
import { getScrambleParams, resolveImageUrl } from './services/descrambler';
import { createFloatControl } from './ui/float-control';
import { createSinglePageOverlay } from './ui/single-page/overlay';
import { registerMenuCommands } from './menu-commands';

(async function main() {
  // 1. Parse page images with scramble metadata
  const pageImages = parseCurrentPageImages(document);
  if (pageImages.length === 0) return;

  const { aid } = getScrambleParams();
  store.aid = aid;

  // 2. Store URLs immediately (scrambled ones will be replaced as they resolve)
  store.allImages = pageImages.map(p => p.url);

  // 3. Create float control + reader overlay
  let spmHandle: ReturnType<typeof createSinglePageOverlay>;

  createFloatControl({
    open: (startIndex?: number) => spmHandle.open(startIndex),
    close: () => spmHandle.close(),
    isActive: () => spmHandle.isActive(),
    getOverlayElement: () => spmHandle.getOverlayElement(),
    jumpTo: (index: number) => spmHandle.jumpTo(index),
  });

  spmHandle = createSinglePageOverlay();

  // 4. Click page images to enter reader at that position
  const pageImgs = document.querySelectorAll('.scramble-page img');
  const filteredImgs = Array.from(pageImgs).filter(img => {
    const src = img.getAttribute('data-original') || (img as HTMLImageElement).src || '';
    return src && !src.includes('blank.jpg') && !src.includes('data:');
  });
  filteredImgs.forEach((img, localIndex) => {
    (img as HTMLElement).style.cursor = 'pointer';
    img.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      spmHandle.open(localIndex);
    });
  });

  // 5. Menu commands
  registerMenuCommands();

  // 6. Auto enter reader
  if (store.settings.autoEnterSinglePage) {
    setTimeout(() => spmHandle.open(), 500);
  }

  // 7. Resolve scrambled images in background
  const scrambled = pageImages
    .map((p, i) => ({ ...p, index: i }))
    .filter(p => p.needsDescramble);

  console.log(`[jm-plus] ${pageImages.length} images, ${scrambled.length} need descramble`);

  for (const page of scrambled) {
    try {
      const resolved = await resolveImageUrl(page, aid);
      store.allImages[page.index] = resolved;
      store.emit('imageResolved');
    } catch (e) {
      console.warn(`[jm-plus] Failed to descramble page ${page.pageId}:`, e);
    }
  }
})();
