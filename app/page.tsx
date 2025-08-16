import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/ui/Navbar";
import Footer from "./components/ui/Footer";

export default function Home() {
  const jabatan = ["Kepala Desa", "Badan Desa", "Tangan Desa", "Kaki Desa"];

  // Quick action items sesuai navbar
  const quickActions = [
    {
      title: "Profil Desa",
      description: "Informasi lengkap tentang Desa Ciwaruga",
      icon: "🏘️",
      href: "/profil",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Infografis",
      description: "Data dan statistik visual RW 16",
      icon: "📊",
      href: "/infografis",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Berita",
      description: "Berita terbaru dari Desa Ciwaruga",
      icon: "📰",
      href: "/berita",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Lowongan Kerja",
      description: "Peluang karir di sekitar Ciwaruga",
      icon: "💼",
      href: "/lowongan-kerja",
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "UMKM",
      description: "Usaha Mikro Kecil Menengah lokal",
      icon: "🏪",
      href: "/umkm",
      color: "from-emerald-500 to-emerald-600",
    },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section>
        <div
          className="relative h-screen bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: "url(/bgg.jpg)" }}
        >
          {/* Overlay hitam dengan opacity */}
          <div className="absolute inset-0 bg-black opacity-60"></div>

          {/* Konten utama harus di atas overlay */}
          <div className="relative p-6 rounded z-10">
            <h2 className="text-white text-4xl md:text-6xl font-bold text-center">
              SELAMAT DATANG
              <br />
              DI WEBSITE RESMI RW16 KEC. CIWARUGA
            </h2>
          </div>
        </div>
      </section>

      {/* Quick Action - Responsive */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl text-black font-bold mb-4">
              JELAJAHI INFORMASI RW
              <span className="block text-emerald-600">DISEKITARMU!</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Akses mudah ke berbagai layanan dan informasi RW 16 Desa Ciwaruga
            </p>
          </div>

          {/* Grid Quick Actions - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href} className="group block">
                <div
                  className={`
                  relative overflow-hidden rounded-xl p-6 h-48 sm:h-52 lg:h-56
                  bg-gradient-to-br ${action.color}
                  transform transition-all duration-300 ease-in-out
                  hover:scale-105 hover:shadow-xl
                  cursor-pointer
                `}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white rounded-full"></div>
                    <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-white rounded-full"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between text-white">
                    <div>
                      <div className="text-4xl mb-3">{action.icon}</div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-yellow-200 transition-colors">
                        {action.title}
                      </h3>
                    </div>

                    <div>
                      <p className="text-sm opacity-90 mb-3">
                        {action.description}
                      </p>
                      <div className="inline-flex items-center text-sm font-medium group-hover:translate-x-1 transition-transform">
                        Lihat Selengkapnya
                        <svg
                          className="ml-2 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Struktur Organisasi */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl text-black font-bold mb-4">
              Struktur Organisasi dan Tata Kerja
            </h3>
            <div className="w-24 h-1 bg-emerald-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8">
            {jabatan.map((nama, i) => (
              <div key={i} className="text-center group">
                <div className="relative mb-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <span className="text-2xl sm:text-3xl text-white">👤</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white"></div>
                </div>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">
                  {nama}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sambutan */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Bagian Gambar */}
            <div className="lg:col-span-1 flex justify-center">
              <div className="relative max-w-sm">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden border-4 border-emerald-100 shadow-2xl">
                  <Image
                    src="/bgg.jpg"
                    alt="Ketua RW"
                    width={400}
                    height={533}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-400 rounded-full opacity-60"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full opacity-60"></div>
              </div>
            </div>

            {/* Bagian Teks - dengan scroll */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-6 lg:p-8 shadow-lg">
                <div className="mb-6">
                  <h1 className="text-2xl lg:text-3xl font-bold text-emerald-800 mb-2">
                    SAMBUTAN
                  </h1>
                  <div className="h-1 w-16 bg-emerald-400 mb-4"></div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    [NAMA KETUA RW]
                  </h2>
                  <h3 className="text-lg text-emerald-600">
                    Ketua RW [NOMOR RW]
                  </h3>
                </div>

                {/* Scrollable Content Container */}
                <div className="relative">
                  <div className="max-h-96 lg:max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-gray-100">
                    <div className="prose prose-gray max-w-none">
                      <div className="text-gray-700 leading-relaxed">
                        <span className="block text-lg font-medium text-emerald-800 mb-4">
                          Assalamualaikum Warahmatullahi Wabarakatuh
                        </span>
                        Puji syukur kehadirat Tuhan Yang Maha Esa atas rahmat
                        dan karunia-Nya, kami dapat meluncurkan website resmi RW
                        kami ini. Website ini hadir sebagai media komunikasi dan
                        informasi antara pengurus RW dengan warga masyarakat.
                        <span className="block font-semibold my-4 text-emerald-700">
                          Visi Pembangunan:
                        </span>
                        <div className="ml-4 space-y-1">
                          <div className="flex items-start">
                            <span className="text-emerald-500 mr-2">•</span>
                            <span>
                              Mewujudkan lingkungan yang bersih dan sehat
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-emerald-500 mr-2">•</span>
                            <span>
                              Meningkatkan partisipasi warga dalam kegiatan RW
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-emerald-500 mr-2">•</span>
                            <span>
                              Mengembangkan sistem administrasi berbasis digital
                            </span>
                          </div>
                        </div>
                        <span className="block font-semibold my-4 text-emerald-700">
                          Layanan Unggulan:
                        </span>
                        <div className="ml-4 space-y-1">
                          <div className="flex items-start">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>Pelayanan administrasi warga</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>Posyandu terintegrasi</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>Sistem pengaduan online</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>Informasi program bulanan</span>
                          </div>
                        </div>
                        <div className="my-6 p-4 bg-white/70 rounded-lg border-l-4 border-emerald-400">
                          <span className="block italic text-gray-700 font-medium">
                            💡 "Kami berkomitmen untuk transparansi dan
                            pelayanan terbaik bagi seluruh warga."
                          </span>
                        </div>
                        <span className="block text-right font-medium text-emerald-800 mt-6">
                          Wassalamualaikum Warahmatullahi Wabarakatuh
                          <br />
                          <span className="text-gray-600">Hormat kami,</span>
                          <br />
                          <span className="text-lg font-bold">
                            [NAMA KETUA RW]
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Scroll Indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-emerald-50 to-transparent pointer-events-none rounded-b-2xl"></div>
                  <div className="text-center mt-2">
                    <span className="text-xs text-gray-400 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 mr-1 animate-bounce"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Scroll untuk membaca selengkapnya
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
