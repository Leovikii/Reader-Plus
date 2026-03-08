export interface UserSettings {
  showControl: boolean;
  autoEnterSinglePage: boolean;
  autoPlayInterval: number;
}

export interface PageRange {
  url: string;
  start: number;
  count: number;
}

export interface SinglePageModeHandle {
  open: (startIndex?: number) => void;
  close: () => void;
  isActive: () => boolean;
  getOverlayElement: () => HTMLElement;
  jumpTo: (index: number) => void;
}
