import type { Metadata } from "next";
import Link from "next/link";
import {
  experienceNodes,
  publications,
  languageFeatures,
  frameworkFeatures,
  featureId,
} from "@/lib/probeData";
import PrintButton from "@/components/PrintButton";

export const metadata: Metadata = {
  title: "Model Card · Marcel Mateos Salles",
  description:
    "A HuggingFace-style model card for marcel-mateos-salles: architecture, training data, evaluation, and intended use.",
};

const YAML_HEADER = `---
model: marcel-mateos-salles
architecture: ${experienceNodes.length}-layer experience stack · 2 probe-able unit layers
base_model: brown-university/cs-econ (magna cum laude, honors)
finetuned_for: [backend engineering, ML research, interpretability]
release: v2026.05
license: open-to-opportunities-1.0
contact: marcel_mateos_salles@alumni.brown.edu
---`;

const BIBTEX = `@misc{mateossalles2026,
  author = {Mateos Salles, Marcel},
  title  = {marcel-mateos-salles: an interpretable portfolio},
  year   = {2026},
  url    = {https://www.marcelmatsal.com}
}`;

function CardSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-mono text-sm uppercase tracking-[0.3em] text-cyan-400/90 mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function ModelCardPage() {
  return (
    <main className="model-card min-h-screen px-6 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto">
        {/* top bar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="print-hidden font-mono text-xs text-slate-400 hover:text-cyan-300 transition-colors"
          >
            ← back to the network
          </Link>
          <PrintButton />
        </div>

        {/* header */}
        <p className="font-mono text-xs text-cyan-400/80 tracking-[0.35em] uppercase mb-2">
          {"// model_card"}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wide text-slate-100">
          marcel-mateos-salles
        </h1>
        <p className="mt-3 text-slate-400 text-sm">
          The static, printable readout of the interactive network at{" "}
          <Link href="/" className="text-cyan-300 hover:underline">
            marcelmatsal.com
          </Link>
          .
        </p>

        {/* yaml frontmatter */}
        <pre className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-4 overflow-x-auto font-mono text-xs text-slate-300 leading-relaxed">
          {YAML_HEADER}
        </pre>

        <CardSection title="Model description">
          <p className="text-slate-300 text-sm leading-relaxed">
            Backend software engineer and ML researcher. Recent graduate of
            Brown University (Computer Science-Economics), member of the GalilAI
            Group with Prof. Randall Balestriero, and incoming Software Engineer
            at Pinterest. Research interests: LLMs, model interpretability, and
            self-supervised learning — with a particular focus on spurious
            correlations under parameter-efficient finetuning.
          </p>
        </CardSection>

        <CardSection title="Architecture">
          <p className="text-slate-400 text-sm mb-4">
            One unit per role, stacked in temporal order. t-0 is the most recent
            layer; activations reflect how central each unit is to the current
            model.
          </p>
          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="text-left px-3 py-2 font-normal">layer</th>
                  <th className="text-left px-3 py-2 font-normal">unit</th>
                  <th className="text-left px-3 py-2 font-normal">source</th>
                  <th className="text-left px-3 py-2 font-normal">period</th>
                  <th className="text-right px-3 py-2 font-normal">act</th>
                </tr>
              </thead>
              <tbody>
                {experienceNodes.map((node, i) => (
                  <tr
                    key={node.id}
                    className="border-b border-white/5 last:border-0 text-slate-300"
                  >
                    <td className="px-3 py-2 text-violet-400">t-{i}</td>
                    <td className="px-3 py-2">{node.label}</td>
                    <td className="px-3 py-2 text-slate-400">
                      {node.subtitle}
                    </td>
                    <td className="px-3 py-2 text-slate-400 whitespace-nowrap">
                      {node.date}
                    </td>
                    <td className="px-3 py-2 text-right text-cyan-300">
                      {node.activation.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardSection>

        <CardSection title="Training data">
          <ul className="space-y-2 text-sm text-slate-300">
            <li>
              <span className="text-slate-100 font-medium">
                Brown University
              </span>{" "}
              — B.S. Computer Science–Economics, Magna Cum Laude, Honors. GPA
              4.0/4.0.
            </li>
            <li>
              Reinforced by teaching: Deep Learning (CSCI 1470), Computational
              Linguistics (CSCI 1460, Head TA), and Using Big Data to Solve
              Social and Economic Problems (Econ 1000).
            </li>
            <li>
              Fine-tuned in production at Pinterest (GenAI tooling,
              observability) and Dexcom (mobile architecture).
            </li>
          </ul>
        </CardSection>

        <CardSection title="Evaluation">
          <div className="space-y-4">
            {publications.map((pub) => (
              <div
                key={pub.id}
                className="rounded-lg border border-white/10 p-4"
              >
                <p className="text-sm font-medium text-slate-100">
                  {pub.title}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {pub.authors.join(", ")}
                </p>
                <p className="mt-2 font-mono text-[11px] text-slate-400">
                  {pub.venues
                    .map((v) => `${v.name} · ${v.detail}`)
                    .join("  ·  ")}
                  {pub.links.map((l) => (
                    <span key={l.href}>
                      {"  ·  "}
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-300 hover:underline"
                      >
                        {l.label}
                      </a>
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </CardSection>

        <CardSection title="Feature dictionary">
          <div className="flex flex-wrap gap-2">
            {[...languageFeatures, ...frameworkFeatures].map((name) => (
              <span
                key={name}
                className="font-mono text-xs px-2.5 py-1 rounded-full border border-white/10 text-slate-300"
              >
                {name} <span className="text-slate-500">{featureId(name)}</span>
              </span>
            ))}
          </div>
        </CardSection>

        <CardSection title="Intended use">
          <p className="text-slate-300 text-sm leading-relaxed">
            Backend systems and ML research teams that want an engineer who
            reads the papers and ships the infrastructure. Direct use:{" "}
            <a
              href="mailto:marcel_mateos_salles@alumni.brown.edu"
              className="text-cyan-300 hover:underline"
            >
              marcel_mateos_salles@alumni.brown.edu
            </a>
            . See also{" "}
            <a
              href="https://github.com/MarcelMatsal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:underline"
            >
              GitHub
            </a>
            ,{" "}
            <a
              href="https://scholar.google.com/citations?hl=en&user=7QmQOSgAAAAJ&inst=7213243471243491304"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:underline"
            >
              Google Scholar
            </a>
            ,{" "}
            <a
              href="https://www.linkedin.com/in/marcelmatsal/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:underline"
            >
              LinkedIn
            </a>
            , and the{" "}
            <a
              href="/Marcel_Mateos_Salles_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:underline"
            >
              resume (PDF)
            </a>
            .
          </p>
        </CardSection>

        <CardSection title="Limitations">
          <ul className="space-y-1.5 text-sm text-slate-300 list-disc list-inside marker:text-slate-600">
            <li>
              Performance degrades measurably when the coffee supply is ablated.
            </li>
            <li>
              Addicted to fitness and spending time outside. Currently training
              for the Seawheeze Halfmarathon.
            </li>
            <li>Will occasionally overfit to a random fixation.</li>
          </ul>
        </CardSection>

        <CardSection title="Citation">
          <pre className="rounded-lg border border-white/10 bg-white/[0.03] p-4 overflow-x-auto font-mono text-xs text-slate-300 leading-relaxed">
            {BIBTEX}
          </pre>
        </CardSection>

        <p className="mt-12 font-mono text-[10px] text-slate-600 tracking-[0.3em]">
          {"// generated from the same data that powers the network"}
        </p>
      </div>
    </main>
  );
}
