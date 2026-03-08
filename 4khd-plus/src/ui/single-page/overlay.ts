import { store } from '../../state/store';
import { fetchPageImages } from '../../services/page-parser';
import { createScrollbar } from './scrollbar';
import { setupNavigation } from './navigation';
import { createAutoPlay } from './auto-play';
import type { SinglePageModeHandle } from '../../types';

export function createSinglePageOverlay(): SinglePageModeHandle {
  const overlay = document.createElement('div');
  overlay.className = 'single-page-overlay';

  const closeBtn = document.createElement('div');
  closeBtn.className = 'sp-close-btn';
  closeBtn.innerHTML = '&#10005;';

  const imageContainer = document.createElement('div');
  imageContainer.className = 'sp-image-container';

  const currentImage = document.createElement('img');
  currentImage.className = 'sp-current-image';
  imageContainer.appendChild(currentImage);

  // Image load/error handlers
  currentImage.addEventListener('load', () => {
    if (!overlay.classList.contains('active')) return;
    removePlaceholder();
    scrollbar.update();
  });

  currentImage.addEventListener('error', () => {
    if (!overlay.classList.contains('active')) return;
    if (!currentImage.src || currentImage.src === location.href) return;
    showError();
  });

  function showPlaceholder(): void {
    currentImage.style.display = 'none';
    removeErrorUI();
    const existing = imageContainer.querySelector('.sp-placeholder');
    if (existing) existing.remove();

    const ph = document.createElement('div');
    ph.className = 'sp-placeholder';
    ph.innerHTML = `<div class="sp-placeholder-pulse"></div><div class="sp-placeholder-text">${store.currentImageIndex + 1} / ${store.allImages.length}</div>`;
    imageContainer.appendChild(ph);
  }

  function removePlaceholder(): void {
    const ph = imageContainer.querySelector('.sp-placeholder');
    if (ph) ph.remove();
    removeErrorUI();
    currentImage.style.display = '';
  }

  function showError(): void {
    currentImage.style.display = 'none';
    const existing = imageContainer.querySelector('.sp-placeholder');
    if (existing) existing.remove();
    removeErrorUI();

    const errorDiv = document.createElement('div');
    errorDiv.className = 'sp-error';
    errorDiv.innerHTML = `<div class="sp-error-text">${store.currentImageIndex + 1} / ${store.allImages.length}</div><div class="sp-error-msg">Load Failed</div><button class="sp-error-retry">Retry</button>`;
    const retryBtn = errorDiv.querySelector('.sp-error-retry') as HTMLButtonElement;
    retryBtn.onclick = (e) => {
      e.stopPropagation();
      updateImage();
    };
    imageContainer.appendChild(errorDiv);
  }

  function removeErrorUI(): void {
    const err = imageContainer.querySelector('.sp-error');
    if (err) err.remove();
  }

  function updateImage(): void {
    removeErrorUI();
    const idx = store.currentImageIndex;
    const url = store.allImages[idx];

    if (!url) {
      showPlaceholder();
      scrollbar.update();
      return;
    }

    showPlaceholder();
    // Force reload if same URL (retry case)
    if (currentImage.src === url) {
      currentImage.src = '';
    }
    currentImage.src = url;
    scrollbar.update();
  }

  // Auto-play
  const autoPlay = createAutoPlay(() => nav.nextImage());

  // Scrollbar
  const scrollbar = createScrollbar(
    (index) => {
      store.currentImageIndex = index;
      updateImage();
      autoPlay.reset();
    },
    () => loadNextPage(),
    () => loadPrevPage(),
  );

  // Navigation
  const nav = setupNavigation({
    overlay,
    updateImage,
    checkAndLoadNextPage: () => checkAndLoadNextPage(),
    checkAndLoadPrevPage: () => loadPrevPage(),
    resetAutoPlay: () => autoPlay.reset(),
    stopAutoPlayAtEnd: () => autoPlay.stopAtEnd(),
    closeSinglePageMode: () => close(),
  });

  // Click-to-navigate on image container
  imageContainer.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('.sp-error-retry')) return;
    if (target.closest('.sp-close-btn')) return;
    if (target.closest('.sp-scrollbar')) return;

    const rect = imageContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX < rect.width / 2) {
      nav.previousImage();
    } else {
      nav.nextImage();
    }
    autoPlay.reset();
  });

  // Assemble DOM
  overlay.appendChild(closeBtn);
  overlay.appendChild(scrollbar.getElement());
  overlay.appendChild(imageContainer);
  document.body.appendChild(overlay);

  closeBtn.onclick = () => close();

  function open(startIndex?: number): void {
    if (store.allImages.length === 0) {
      alert('No images found');
      return;
    }
    store.currentImageIndex = startIndex ?? 0;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateImage();
    store.emit('readerModeChanged');

    if (store.autoPlay) {
      autoPlay.start();
    }
  }

  function close(): void {
    removeErrorUI();
    autoPlay.stop();
    store.autoPlay = false;
    const exitIndex = store.currentImageIndex;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    store.emit('readerModeChanged');

    // Find which page the current image belongs to
    const currentPageRange = store.pageRanges.find(
      r => r.url === window.location.href,
    );

    if (currentPageRange && exitIndex >= currentPageRange.start && exitIndex < currentPageRange.start + currentPageRange.count) {
      // Image is on the current page — scroll to it
      const localIndex = exitIndex - currentPageRange.start;
      const imgs = document.querySelectorAll('.entry-content img');
      const filtered = Array.from(imgs).filter(img => {
        const src = (img as HTMLImageElement).src || img.getAttribute('src') || '';
        return src && !src.includes('data:') && !src.includes('emoji');
      });
      const targetImg = filtered[localIndex];
      if (targetImg) {
        setTimeout(() => {
          targetImg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    } else {
      // Image is on a different page — navigate to that page
      const targetRange = store.pageRanges.find(
        r => exitIndex >= r.start && exitIndex < r.start + r.count,
      );
      if (targetRange) {
        window.location.href = targetRange.url;
      }
    }
  }

  // Listen for autoPlay setting changes
  store.on('settingsChanged', () => {
    if (!overlay.classList.contains('active')) return;
    if (store.autoPlay) {
      autoPlay.start();
    } else {
      autoPlay.stop();
    }
  });

  function loadNextPage(): void {
    if (!store.nextUrl || store.isFetching) return;
    if (store.loadedPageUrls.has(store.nextUrl)) return;

    store.isFetching = true;
    const url = store.nextUrl;
    store.loadedPageUrls.add(url);

    fetchPageImages(url).then(({ images, nextUrl, prevUrl }) => {
      const start = store.allImages.length;
      store.allImages = [...store.allImages, ...images];
      store.pageRanges.push({ url, start, count: images.length });
      store.nextUrl = nextUrl;
      if (prevUrl && !store.prevUrl) store.prevUrl = prevUrl;
      store.isFetching = false;
      scrollbar.update();
    }).catch((err) => {
      console.error('[4KHD Reader] Load next page failed', err);
      store.loadedPageUrls.delete(url);
      store.isFetching = false;
    });
  }

  function loadPrevPage(): void {
    if (!store.prevUrl || store.isFetching) return;
    if (store.loadedPageUrls.has(store.prevUrl)) return;

    store.isFetching = true;
    const url = store.prevUrl;
    store.loadedPageUrls.add(url);

    fetchPageImages(url).then(({ images, nextUrl, prevUrl }) => {
      const prevCount = images.length;
      store.allImages = [...images, ...store.allImages];
      store.currentImageIndex += prevCount;
      // Shift existing page ranges and add new one at the front
      store.pageRanges.forEach(r => r.start += prevCount);
      store.pageRanges.unshift({ url, start: 0, count: prevCount });
      store.prevUrl = prevUrl;
      if (nextUrl && !store.nextUrl) store.nextUrl = nextUrl;
      store.isFetching = false;
      scrollbar.update();
    }).catch((err) => {
      console.error('[4KHD Reader] Load prev page failed', err);
      store.loadedPageUrls.delete(url);
      store.isFetching = false;
    });
  }

  function checkAndLoadNextPage(): void {
    if (!store.nextUrl || store.isFetching) return;
    const remaining = store.allImages.length - store.currentImageIndex;
    if (remaining <= 10) {
      loadNextPage();
    }
  }

  function jumpTo(index: number): void {
    if (!overlay.classList.contains('active')) return;
    store.currentImageIndex = Math.max(0, Math.min(index, store.allImages.length - 1));
    updateImage();
    autoPlay.reset();
  }

  return {
    open,
    close,
    isActive: () => overlay.classList.contains('active'),
    getOverlayElement: () => overlay,
    jumpTo,
  };
}
