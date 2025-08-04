import Image from "next/image";
import HeroSection from './components/HeroSection';
import Navbar from "./components/ui/Navbar";

export default function Home() {
  
const jabatan = ['Kepala Desa', 'Badan Desa', 'Tangan Desa', 'Kaki Desa'];
  return (
    <>
    <Navbar />
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
 <div className="w-full bg-white py-20 h-screen">
  <div className="max-w-screen-xl mx-auto px-12 flex justify-between items-start">
    {/* Kiri: Teks */}
    <div className="max-w-xs">
      <h2 className="text-3xl text-black font-bold italic mb-4 leading-snug">
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
    </>
  );
}