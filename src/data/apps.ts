export interface AppInfo {
  name: string;
  /** One line under the name. */
  tagline: string;
  description: string;
  category: string;
  /** Full Google Play listing URL. */
  playUrl: string;
  /** File name inside src/assets/apps/, e.g. "my-app-icon.png". */
  icon?: string;
  /** File names inside src/assets/apps/, portrait screenshots. Up to three are shown. */
  screenshots?: string[];
  highlights?: string[];
}

/**
 * Jaimin's own apps on Google Play.
 * The "Apps" section and its navigation link appear automatically
 * as soon as this list has at least one entry.
 */
export const apps: AppInfo[] = [];
