export default function FooterSection() {
  return (
    <footer className="border-t border-border/50 py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-display text-xl font-bold">
              <span className="gradient-text">Yener</span>
              <span className="text-foreground ml-1 opacity-70">Solutions</span>
            </span>
            <p className="text-sm text-muted-foreground mt-1">Transforming businesses through innovation.</p>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Yener Solutions Agency. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
