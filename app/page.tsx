import Image from "next/image";
// import HeroSection from "./components/HeroSection";
import Navbar from "./components/ui/Navbar";
import Footer from "./components/ui/Footer";
export default function Home() {
  
const jabatan = ['Kepala Desa', 'Badan Desa', 'Tangan Desa', 'Kaki Desa'];
  return (
    <>
    <Navbar />
<section>
<div className="relative h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'url(/bgg.jpg)' }}>
  {/* Overlay hitam dengan opacity */}
  <div className="absolute inset-0 bg-black opacity-60"></div>

  {/* Konten utama harus di atas overlay */}
  <div className="relative p-6 rounded z-10">
    <h2 className="text-white text-4xl md:text-6xl font-bold text-center">
      SELAMAT DATANG<br />
      DI WEBSITE RESMI RW16 KEC. CIWARUGA
    </h2>
  </div>
</div>
</section>

<section>
 <div className="w-full bg-white py-20 h-screen">
  <div className="max-w-screen-xl mx-auto px-12 flex justify-between items-start">
    {/* Kiri: Teks */}
    <div className="max-w-xs m-4">
      <h2 className="text-4xl text-black font-bold italic leading-snug">
        JELAJAHI INFORMASI RW <br />
        <span className="text-black italic font-bold">DISEKITARMU!</span>
      </h2>
      <p className="italic font-bold text-lg text-gray-400">Lorem Ipsum Dolor Sit Amet</p>
    </div>

    {/* Kanan: Grid 2x2 kotak */}
    <div className="grid grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="w-40 h-40 bg-gray-300 rounded-md" />
      ))}
    </div>
  </div>
</div>
</section>

<section>
<div className="py-20 bg-white px-6">
    <h3 className="text-xl text-black font-bold text-center mb-6">Struktur Organisasi dan Tata Kerja</h3>
      <br/>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
        {jabatan.map((nama, i) => (
          <div key={i} className="text-center">
            <div className="w-24 h-24 bg-blue-300 rounded-full mx-auto mb-2" />
            <p className="font-medium text-black">{nama}</p>
          </div>
        ))}
      </div>
    </div>
</section>

<section className="py-12 bg-white">
  <div className="container mx-auto px-4">
    <div className="flex flex-col lg:flex-row items-start gap-8">
      {/* Bagian Gambar (Kiri) */}
      <div className="lg:w-1/3 flex flex-col items-center">
        <div className="max-w-76 h-96 rounded-3xl overflow-hidden border-4 border-emerald-100 shadow-lg">
          <Image
            src="/bgg.jpg"
            alt="Ketua RW"
            width={2240}
            height={3200}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Bagian Teks (Kanan) */}
      <div className="lg:w-3/5">

        {/* Konten Scrollable */}
        <div className="bg-gradient-to-b from-emerald-50 to-white rounded-2xl p-6 shadow-inner max-h-96 overflow-y-auto mx-2">
          <div className="prose max-w-none px-2">
            {/* Judul dan Nama */}
        <div className="mb-6 text-center lg:text-left">
          <h1 className="text-2xl font-bold text-emerald-800 mb-2">SAMBUTAN</h1>
          <div className="h-1 w-16 bg-emerald-400 mx-auto lg:mx-0 mb-3"></div>
          <h2 className="text-xl font-semibold text-gray-800">[NAMA KETUA RW]</h2>
          <h3 className="text-lg text-emerald-600">Ketua RW [NOMOR RW]</h3>
        </div>
            <p className="text-gray-700 leading-relaxed">
              <span className="block text-lg font-medium text-emerald-800 mb-4">Assalamualaikum Warahmatullahi Wabarakatuh</span>
              
              Puji syukur kehadirat Tuhan Yang Maha Esa atas rahmat dan karunia-Nya, kami dapat meluncurkan website resmi RW kami ini. Website ini hadir sebagai media komunikasi dan informasi antara pengurus RW dengan warga masyarakat.
              
              <span className="block font-semibold my-4">Visi Pembangunan:</span>
              
              • Mewujudkan lingkungan yang bersih dan sehat<br />
              • Meningkatkan partisipasi warga dalam kegiatan RW<br />
              • Mengembangkan sistem administrasi berbasis digital<br /><br />
              
              <span className="block font-semibold my-4">Layanan Unggulan:</span>
              
              - Pelayanan administrasi warga<br />
              - Posyandu terintegrasi<br />
              - Sistem pengaduan online<br />
              - Informasi program bulanan<br /><br />
              
              <span className="block italic text-gray-600">"Kami berkomitmen untuk transparansi dan pelayanan terbaik bagi seluruh warga."</span><br /><br />
              
              <span className="block text-right font-medium text-emerald-800">
                Wassalamualaikum Warahmatullahi Wabarakatuh<br />
                Hormat kami,<br />
                <span className="text-lg">[NAMA KETUA RW]</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  <Footer/>
    </>
  );
}