'use client';

export default function Footer() {
  return (
    <footer className="py-8 text-center text-sm text-gray-600 dark:text-gray-300">
      <p>© {new Date().getFullYear()} Marcel Mateos Salles. All rights reserved.</p>
    </footer>
  );
}
