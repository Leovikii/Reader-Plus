import { store } from '../../state/store';
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
  );

  // Navigation
  const nav = setupNavigation({
    overlay,
    updateImage,
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

    // Scroll to the image on the page
    const pageImgs = document.querySelectorAll('.scramble-page img');
    const filtered = Array.from(pageImgs).filter(img => {
      const src = img.getAttribute('data-original') || (img as HTMLImageElement).src || '';
      return src && !src.includes('blank.jpg') && !src.includes('data:');
    });
    const targetImg = filtered[exitIndex];
    if (targetImg) {
      setTimeout(() => {
        targetImg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
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

  // Refresh current image when a scrambled image finishes resolving
  store.on('imageResolved', () => {
    if (!overlay.classList.contains('active')) return;
    const idx = store.currentImageIndex;
    const url = store.allImages[idx];
    if (url && url !== currentImage.src) {
      updateImage();
    }
  });

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
