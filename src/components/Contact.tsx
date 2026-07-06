'use client';

import SectionHeading from './SectionHeading';
import LossCurve from './LossCurve';

export default function Contact() {
  return (
    <section id="contact" className="py-16 px-6">
      <div className="max-w-xl mx-auto">
        <SectionHeading overline="// output_layer" title="Get in Touch" />
        {/* gradient descent finale: loss bottoms out right where the CTA is */}
        <LossCurve />
        <div className="text-center">
          <p className="text-slate-300 mb-8">
            Think I&apos;d be a good fit for your team? I&apos;m always interested in hearing about new projects, opportunities, and challenges!
          </p>
          <a
            href="mailto:marcel_mateos_salles@brown.edu"
            className="rounded-full transition-shadow flex items-center justify-center gap-2 font-medium text-sm sm:text-base h-10 sm:h-12 px-5 sm:px-6 mx-auto w-fit text-white bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] hover:shadow-[0_0_28px_rgba(6,182,212,0.5)]"
          >
            Email Me!
          </a>
        </div>
      </div>
    </section>
  );
}
