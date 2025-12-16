const STORAGE_KEYS = {
  auth: "zonaprint-auth",
  shop: "zonaprint-shop",
} as const;

type PersistedValue = Record<string, unknown>;

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const loadAuthState = <T>(fallback: T): T =>
  safeParse<T>(localStorage.getItem(STORAGE_KEYS.auth), fallback);

export const saveAuthState = (value: PersistedValue) => {
  localStorage.setItem(STORAGE_KEYS.auth, JSON.stringify(value));
};

export const loadShopState = <T>(fallback: T): T =>
  safeParse<T>(localStorage.getItem(STORAGE_KEYS.shop), fallback);

export const saveShopState = (value: PersistedValue) => {
  localStorage.setItem(STORAGE_KEYS.shop, JSON.stringify(value));
};

