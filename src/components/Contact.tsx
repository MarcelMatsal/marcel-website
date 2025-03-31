'use client';

export default function Contact() {
  return (
    <section id="contact" className="py-20">
      <h2 className="text-3xl font-bold mb-8 text-center">Get in Touch</h2>
      <div className="max-w-xl mx-auto text-center">
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Think I&apos;d be a good fit for your team? I&apos;m always interested in hearing about new projects, opportunities, and challenges!
        </p>
        <a
          href="mailto:marcel_mateos_salles@brown.edu"
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 mx-auto w-fit"
        >
          Email Me!
        </a>
      </div>
    </section>
  );
}
