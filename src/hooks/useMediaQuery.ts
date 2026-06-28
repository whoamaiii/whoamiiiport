import { useCallback, useSyncExternalStore } from 'react';

function getInitialMediaQueryMatch(query: string, defaultValue = false): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return defaultValue;
  }

  return window.matchMedia(query).matches;
}

interface MediaQueryStoreEntry {
  readonly mediaQuery: MediaQueryList;
  readonly listeners: Set<() => void>;
  readonly dispose: () => void;
}

const mediaQueryStores = new Map<string, MediaQueryStoreEntry>();

function createMediaQueryStore(query: string): MediaQueryStoreEntry | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return null;
  }

  const mediaQuery = window.matchMedia(query);
  const listeners = new Set<() => void>();
  const notifyListeners = () => {
    listeners.forEach((listener) => listener());
  };

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', notifyListeners);
    return {
      mediaQuery,
      listeners,
      dispose: () => mediaQuery.removeEventListener('change', notifyListeners),
    };
  }

  mediaQuery.addListener(notifyListeners);
  return {
    mediaQuery,
    listeners,
    dispose: () => mediaQuery.removeListener(notifyListeners),
  };
}

function getMediaQueryStore(query: string): MediaQueryStoreEntry | null {
  const existingStore = mediaQueryStores.get(query);

  if (existingStore) {
    return existingStore;
  }

  const store = createMediaQueryStore(query);

  if (store) {
    mediaQueryStores.set(query, store);
  }

  return store;
}

function subscribeToMediaQuery(query: string, listener: () => void) {
  const store = getMediaQueryStore(query);

  if (!store) {
    return () => {};
  }

  store.listeners.add(listener);

  return () => {
    store.listeners.delete(listener);

    if (store.listeners.size === 0) {
      store.dispose();
      mediaQueryStores.delete(query);
    }
  };
}

export function useMediaQuery(query: string, defaultValue = false): boolean {
  const subscribe = useCallback(
    (listener: () => void) => subscribeToMediaQuery(query, listener),
    [query],
  );
  const getSnapshot = useCallback(
    () => getInitialMediaQueryMatch(query, defaultValue),
    [defaultValue, query],
  );
  const getServerSnapshot = useCallback(() => defaultValue, [defaultValue]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
