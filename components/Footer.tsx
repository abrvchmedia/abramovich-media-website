const footerLinks = [
  { label: "Home", href: "#home" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="relative bg-navyLight border-t border-white/5">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <span className="font-black uppercase tracking-[0.05em] text-accent text-xl">
              Abramovich Media
            </span>
            <p className="text-gray-400 text-sm font-medium">
              Authority Infrastructure Studio
            </p>
            <p className="text-gray-400/40 text-xs leading-relaxed mt-1">
              We build cinematic media, digital infrastructure, and scalable
              authority systems that convert attention into revenue.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <span className="eyebrow text-[10px]">Quick Links</span>
            <ul className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <span className="eyebrow text-[10px]">Contact</span>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:abramovichmedia@gmail.com"
                className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                abramovichmedia@gmail.com
              </a>
              <a
                href="tel:6232183990"
                className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                623-218-3990
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400/30">
            © 2026 Abramovich Media LLC. All rights reserved.
          </p>
          <p className="text-xs text-gray-400/20 uppercase tracking-[0.2em]">
            Authority Infrastructure Studio
          </p>
        </div>
      </div>
    </footer>
  );
}
