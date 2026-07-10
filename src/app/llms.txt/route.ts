import {
  experienceNodes,
  projectNodes,
  publications,
} from '@/lib/probeData';

/* /llms.txt — a markdown summary of the site for LLMs and AI agents
   (https://llmstxt.org). Generated from probeData so it stays in sync
   with the interactive network. */

export const dynamic = 'force-static';

const SITE = 'https://www.marcelmatsal.com';

function absolute(href: string): string {
  return href.startsWith('/') ? `${SITE}${href}` : href;
}

export function GET() {
  const experience = experienceNodes
    .map((n) => {
      const parts = [n.title];
      if (n.subtitle) parts.push(n.subtitle);
      if (n.date) parts.push(n.date);
      const detail = [n.description, n.longDescription]
        .filter(Boolean)
        .join(' ');
      return `- ${parts.join(' · ')}${detail ? ` — ${detail}` : ''}`;
    })
    .join('\n');

  const projects = projectNodes
    .map((n) => {
      const links = (n.links ?? [])
        .map((l) => `[${l.label}](${absolute(l.href)})`)
        .join(', ');
      return `- **${n.title}** — ${n.description}${links ? ` (${links})` : ''}`;
    })
    .join('\n');

  const pubs = publications
    .map((p) => {
      const venues = p.venues
        .map((v) => `${v.name} (${v.detail})`)
        .join(', ');
      const links = p.links
        .map((l) => `[${l.label}](${absolute(l.href)})`)
        .join(', ');
      return `- **${p.title}** (${p.year}) — ${p.authors.join(', ')}. ${venues}. ${p.summary}${links ? ` ${links}` : ''}`;
    })
    .join('\n');

  const body = `# Marcel Mateos Salles

> Personal site of Marcel Mateos Salles: software engineer at Pinterest and ML researcher (Brown University, Sc.B. Computer Science-Economics, magna cum laude with honors). His research focuses on language model interpretability, LoRA finetuning, and spurious correlations. The homepage presents his experience and projects as an interactive neural network; a static readout is available at the model card below.

- Email: marcel_mateos_salles@alumni.brown.edu
- GitHub: https://github.com/MarcelMatsal
- LinkedIn: https://www.linkedin.com/in/marcelmatsal/
- Google Scholar: https://scholar.google.com/citations?hl=en&user=7QmQOSgAAAAJ

## Pages

- [Home](${SITE}): interactive portfolio — experience, skills, and projects
- [Model card](${SITE}/model-card): static, printable summary of everything on the site
- [Resume (PDF)](${SITE}/Marcel_Mateos_Salles_Resume.pdf)
- [Honors thesis (PDF)](${SITE}/Marcel_Mateos_Salles_Thesis.pdf)

## Publications

${pubs}

## Experience

${experience}

## Projects

${projects}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
