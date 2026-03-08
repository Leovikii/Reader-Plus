export interface UserSettings {
  showControl: boolean;
  autoEnterSinglePage: boolean;
  autoPlayInterval: number;
}

export interface PageImage {
  url: string;
  pageId: string;
  needsDescramble: boolean;
}

export interface SinglePageModeHandle {
  open: (startIndex?: number) => void;
  close: () => void;
  isActive: () => boolean;
  getOverlayElement: () => HTMLElement;
  jumpTo: (index: number) => void;
}
