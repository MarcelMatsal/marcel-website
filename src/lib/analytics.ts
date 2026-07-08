/**
 * Thin wrapper around the GA4 gtag queue (loaded in layout.tsx).
 * Safe to call anywhere client-side: no-ops when gtag hasn't loaded
 * (SSR, ad blockers, consent tools stripping the script).
 */

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params?: EventParams) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}

const timers = new Map<string, ReturnType<typeof setTimeout>>();

/** Debounced per event name — for continuous controls like the steering slider. */
export function trackEventDebounced(
  name: string,
  params?: EventParams,
  delayMs = 800
) {
  const pending = timers.get(name);
  if (pending) clearTimeout(pending);
  timers.set(
    name,
    setTimeout(() => {
      timers.delete(name);
      trackEvent(name, params);
    }, delayMs)
  );
}
