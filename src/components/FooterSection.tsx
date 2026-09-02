import { Mail } from 'lucide-react';

/**
 * The footer carried a wordmark, a tagline and a copyright line — and no way to reach the
 * company, which is the one thing a visitor who liked the page actually needs. It also
 * carried no legal links, while the site hosts the privacy policies two shipped apps point
 * their App Store listings at.
 *
 * Both are here now. The layout is unchanged in spirit: brand left, everything else right,
 * stacking on mobile.
 */

const LEGAL = [
  { href: '/quakesafe-privacy.html', label: 'QuakeSafe Privacy' },
  { href: '/privacy.html', label: 'Cosmic Birth Chart Privacy' },
  { href: '/terms.html', label: 'Terms' },
];

export default function FooterSection() {
  return (
    <footer className="border-t border-border/50 py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="font-display text-xl font-bold">
              <span className="gradient-text">Yener</span>
              <span className="text-foreground ml-1 opacity-70">Solutions</span>
            </span>
            <p className="text-sm text-muted-foreground mt-1">
              Transforming businesses through digital excellence
            </p>

            {/* The address is a link, not text to copy out by hand. */}
            <a
              href="mailto:info@yenersolutions.com"
              className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              info@yenersolutions.com
            </a>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
              {LEGAL.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {label}
                </a>
              ))}
            </nav>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Yener Solutions Agency. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
