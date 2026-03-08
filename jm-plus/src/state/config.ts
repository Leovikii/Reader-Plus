import { GM_getValue } from '$';
import type { UserSettings } from '../types';

export function loadSettings(): UserSettings {
  return {
    showControl: GM_getValue('showControl', true),
    autoEnterSinglePage: GM_getValue('autoEnterSinglePage', false),
    autoPlayInterval: GM_getValue('autoPlayInterval', 3000),
  };
}
