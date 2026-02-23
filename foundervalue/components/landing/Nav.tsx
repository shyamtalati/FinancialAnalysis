"use client";

import { useState } from "react";
import Link from "next/link";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-teal rounded"
        >
          <div
            className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="text-teal font-bold text-sm">FV</span>
          </div>
          <span className="font-bold text-navy text-lg tracking-tight">
            FounderValue
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink href="/#how-it-works">How It Works</NavLink>
          <NavLink href="/#stages">Stages</NavLink>
          <NavLink href="/#features">Features</NavLink>
          <Link
            href="/tool/"
            className="bg-navy text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-navy-light transition-colors focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
          >
            Calculate Valuation
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-teal"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3"
        >
          <MobileNavLink href="/#how-it-works" onClick={() => setMenuOpen(false)}>
            How It Works
          </MobileNavLink>
          <MobileNavLink href="/#stages" onClick={() => setMenuOpen(false)}>
            Stages
          </MobileNavLink>
          <MobileNavLink href="/#features" onClick={() => setMenuOpen(false)}>
            Features
          </MobileNavLink>
          <Link
            href="/tool/"
            className="block w-full text-center bg-navy text-white text-sm font-semibold px-4 py-3 rounded-lg hover:bg-navy-light transition-colors mt-2"
            onClick={() => setMenuOpen(false)}
          >
            Calculate Valuation
          </Link>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-slate-600 hover:text-navy font-medium transition-colors focus-visible:text-navy focus-visible:underline"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block text-sm text-slate-700 font-medium py-2 border-b border-slate-100 last:border-0"
    >
      {children}
    </Link>
  );
}
