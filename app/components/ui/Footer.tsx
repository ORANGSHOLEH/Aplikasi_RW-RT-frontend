import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">🏠</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Sistem RW-RT</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Sistem informasi pengelolaan data warga RT/RW untuk kemudahan
              administrasi dan pelayanan masyarakat.
            </p>
          </div>

          {/* Links */}
          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Menu Utama
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard?tab=kk"
                  className="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
                >
                  Data Kartu Keluarga
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard?tab=warga"
                  className="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
                >
                  Data Warga
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Kontak
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>📧 info@rwrt.com</p>
              <p>📞 (021) 123-4567</p>
              <p>📍 Jl. Contoh No. 123, Jakarta</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            © {currentYear} Sistem RW-RT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
