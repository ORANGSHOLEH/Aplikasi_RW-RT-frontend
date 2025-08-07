'use client';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-green-600 text-white shadow z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">MyDesa</h1>
        <nav className="space-x-4">
          <a href="#home" className="hover:underline">Home</a>
          <a href="#home" className="hover:underline">Profil Desa</a>
          <a href="#info" className="hover:underline">Keuangan</a>
          <a href="#sambutan" className="hover:underline">Berita</a>
          <a href="#struktur" className="hover:underline">Loker</a>
          <a href="#struktur" className="hover:underline">UMKM</a>
        </nav>
      </div>
    </header>
  );
}
