import type { UserProfile } from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'hangul-phonics-user',
} as const;

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
}

export function loadUserProfile(): UserProfile | null {
  const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  if (!data) return null;
  try {
    return JSON.parse(data) as UserProfile;
  } catch {
    return null;
  }
}

export function removeUserProfile(): void {
  localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
}
