import { GM_setValue } from '$';
import type { UserSettings, PageRange } from '../types';
import { loadSettings } from './config';

type StoreEvent = 'settingsChanged' | 'readerModeChanged';
type Listener = () => void;

class Store {
  private _settings: UserSettings;
  private listeners = new Map<StoreEvent, Set<Listener>>();

  // Pagination state
  currPage = 1;
  totalPages = 1;
  nextUrl: string | null = null;
  prevUrl: string | null = null;
  isFetching = false;
  loadedPageUrls = new Set<string>();

  // Reader state
  currentImageIndex = 0;
  allImages: string[] = [];
  pageRanges: PageRange[] = [];
  autoPlayTimer: ReturnType<typeof setInterval> | null = null;
  autoPlay = false;

  constructor() {
    this._settings = loadSettings();
  }

  get settings(): Readonly<UserSettings> {
    return this._settings;
  }

  updateSetting<K extends keyof UserSettings>(key: K, value: UserSettings[K]): void {
    this._settings[key] = value;
    GM_setValue(key, value);
    this.emit('settingsChanged');
  }

  on(event: StoreEvent, listener: Listener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  emit(event: StoreEvent): void {
    this.listeners.get(event)?.forEach(fn => fn());
  }
}

export const store = new Store();
