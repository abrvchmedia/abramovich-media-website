import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Abramovich Media</h3>
            <p className="text-sm text-gray-400">
              Visuals that scale your vision. We plan, shoot, edit, and ship content that performs on social and converts on your site.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Services</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-400">Video Production</li>
              <li className="text-sm text-gray-400">Post Production</li>
              <li className="text-sm text-gray-400">Social Media Content</li>
              <li className="text-sm text-gray-400">Brand Strategy</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-400">abramovichmedia@gmail.com</p>
              <p className="text-sm text-gray-400">623-218-3990</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-900 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-400">
              © 2025 Abramovich Media LLC. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}