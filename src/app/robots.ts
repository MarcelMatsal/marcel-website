import type { MetadataRoute } from 'next';

/* AI crawlers listed explicitly (beyond the `*` catch-all) to document that
   they are welcome: training crawlers, search-index bots, and the on-demand
   fetchers agents use when a user asks about this site. */
const aiCrawlers = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'meta-externalagent',
  'CCBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: aiCrawlers, allow: '/' },
    ],
    sitemap: 'https://www.marcelmatsal.com/sitemap.xml',
  };
}
