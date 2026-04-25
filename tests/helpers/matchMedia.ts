import { vi } from 'vitest';

export type MatchMediaListener = (event: MediaQueryListEvent) => void;

export function installMatchMediaMock(queryMatches: Record<string, boolean>) {
  const listenersByQuery = new Map<string, Set<MatchMediaListener>>();
  const state = new Map(Object.entries(queryMatches));

  const getListeners = (query: string) => {
    let listeners = listenersByQuery.get(query);

    if (!listeners) {
      listeners = new Set<MatchMediaListener>();
      listenersByQuery.set(query, listeners);
    }

    return listeners;
  };

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      get matches() {
        return state.get(query) ?? false;
      },
      media: query,
      onchange: null,
      addEventListener: (_event: string, listener: MatchMediaListener) => {
        getListeners(query).add(listener);
      },
      removeEventListener: (_event: string, listener: MatchMediaListener) => {
        getListeners(query).delete(listener);
      },
      addListener: (listener: MatchMediaListener) => {
        getListeners(query).add(listener);
      },
      removeListener: (listener: MatchMediaListener) => {
        getListeners(query).delete(listener);
      },
      dispatchEvent: () => true,
    })),
  });

  return {
    setMatches(query: string, matches: boolean) {
      state.set(query, matches);
      const event = { matches, media: query } as MediaQueryListEvent;
      getListeners(query).forEach((listener) => listener(event));
    },
  };
}
