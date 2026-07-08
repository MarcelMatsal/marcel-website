'use client';

import { useEffect } from 'react';
import { trackEvent, trackEventDebounced } from '@/lib/analytics';

const SECTION_IDS = ['home', 'experience', 'skills', 'projects', 'contact'];

/**
 * Central GA4 event instrumentation. Renders nothing; hooks into the
 * `interp:*` CustomEvents the site already routes its interactions through,
 * a delegated click listener for links, and an IntersectionObserver for
 * section reach. Direct-click interactions that bypass the window events
 * (probe panels, console, backprop) are tracked at their call sites.
 */
export default function AnalyticsTracker() {
  // interp:* window events — console commands, deep links, skill-chip probes
  useEffect(() => {
    const onProbe = (e: Event) => {
      const id = (e as CustomEvent).detail?.id;
      trackEvent('probe_open', { unit: String(id ?? ''), method: 'command' });
    };
    const onAblate = (e: Event) => {
      const { id, action } = (e as CustomEvent).detail ?? {};
      trackEvent('unit_ablate', { unit: String(id ?? ''), action: String(action ?? '') });
    };
    const onSteer = (e: Event) => {
      const value = (e as CustomEvent).detail?.value;
      if (typeof value === 'number') {
        trackEventDebounced('steering_change', { value, method: 'console' });
      }
    };
    const onRun = () => trackEvent('inference_run');
    const onFilter = (e: Event) => {
      const { skill, clear } = (e as CustomEvent).detail ?? {};
      trackEvent('feature_filter', {
        skill: clear ? '(clear)' : String(skill ?? ''),
      });
    };

    window.addEventListener('interp:probe', onProbe);
    window.addEventListener('interp:ablate', onAblate);
    window.addEventListener('interp:steer', onSteer);
    window.addEventListener('interp:run', onRun);
    window.addEventListener('interp:filter', onFilter);
    return () => {
      window.removeEventListener('interp:probe', onProbe);
      window.removeEventListener('interp:ablate', onAblate);
      window.removeEventListener('interp:steer', onSteer);
      window.removeEventListener('interp:run', onRun);
      window.removeEventListener('interp:filter', onFilter);
    };
  }, []);

  // delegated link tracking — resume, email, socials, model card
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest?.('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const href = anchor.getAttribute('href') ?? '';
      const text = anchor.textContent?.trim().slice(0, 60) ?? '';

      if (href.startsWith('mailto:')) {
        trackEvent('email_click');
      } else if (/\.pdf($|\?)/i.test(href)) {
        trackEvent('resume_download', { link_url: href });
      } else if (href === '/model-card') {
        trackEvent('model_card_click', { link_text: text });
      } else if (/^https?:\/\//.test(href) && anchor.host !== window.location.host) {
        trackEvent('outbound_click', {
          link_domain: anchor.hostname,
          link_url: href,
          link_text: text,
        });
      }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // section reach — fires once per section per page load
  useEffect(() => {
    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (!entry.isIntersecting || seen.has(id)) continue;
          seen.add(id);
          trackEvent('section_view', { section: id });
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return null;
}
