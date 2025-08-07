"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";

export default function Home() {
  const [showMoreMisi, setShowMoreMisi] = useState(false);
  const jabatan = ['Kepala Desa', 'Badan Desa', 'Tangan Desa', 'Kaki Desa'];

  const handleToggleMisi = () => {
    setShowMoreMisi(!showMoreMisi);
  };

  const misiList = [
    "Meningkatkan dan menggiatkan kegiatan keagamaan",
    "Pemberdayaan Kewirausahaan",
    "Optimalisasi Penyelenggaraan Pemerintahan Desa Ciwaruga",
    "Penyelenggaraan Pemerintahan Yang Transparan dan akuntabel",
    "Pelayanan Kepada Masyarakat yang prima yaitu Cepat, Tepat Dan Benar",
    "Pelaksanaan pembangunan yang berkesinambungan dan mengedepankan partisipasi dan gotong royong masyarakat.",
    "Melakukan pembenahan tata kelola system kinerja aparatur pemerintahan desa guna meningkatkan kualitas pelayanan kepada masyarakat",
    "Menyelenggarakan pemerintahan yang bersih, terbebas dari korupsi serta bentuk penyelewengan yang lainnya",
    "Menyelenggarakan urusan pemerintahan desa secara terbuka, dan bertanggung jawab sesuai dengan peraturan perundang-undangan.",
    "Meningkatkan perekonomian masyarakat melalui pendampingan berupa penyuluhan/pembinaan kewirausahaan masyarakat.",
    "Penataan Siskamling dan Linmas",
    "Meningkatkan kegiatan kepemudaan; bidang olah raga, keagamaan, sosial dan budaya.",
    "Penataan Posyandu dan kegiatan PKK",
    "Menghidupkan kembali kesenian-kesenian yang ada di daerah",
    "Pelayanan yang lebih dekat serta mudah terhadap kepentingan masyarakat.",
    "Meningkatkan kegiatan BUMDES/pengembangan usaha",
  ];

  return (
    <>
      <Navbar />

      

      {/* Visi and Misi Section */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-t-4 border-blue-500">
            <h3 className="text-3xl font-bold text-blue-700 text-center mb-4">Visi</h3>
            <p className="text-center text-lg text-gray-700">
              AMANAH (AGAMIS, MANDIRI, ASPIRATIF, NYAMAN, AMAN, HUMANIS)
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-blue-500">
            <h3 className="text-3xl font-bold text-blue-700 text-center mb-4">Misi</h3>
            <ol className="list-decimal list-inside text-lg text-gray-700 space-y-2">
              {misiList.slice(0, 5).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
              {showMoreMisi && (
                misiList.slice(5).map((item, index) => (
                  <li key={index + 5}>{item}</li>
                ))
              )}
            </ol>
            <button
              onClick={handleToggleMisi}
              className="mt-4 text-blue-500 hover:text-blue-700 font-semibold text-sm flex items-center gap-2"
            >
              Baca {showMoreMisi ? "Lebih Sedikit" : "Selengkapnya"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform duration-300 ${showMoreMisi ? "transform rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Sejarah Desa Section */}
      <section className="py-20 bg-white px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gray-50 rounded-xl shadow-lg p-8">
            <h3 className="text-3xl font-bold text-blue-700 mb-4">Sejarah Desa Ciwaruga</h3>
            <div className="prose max-w-none text-gray-700">
              <p className="font-bold mb-2">Sejarah Singkat Desa Ciwaruga</p>
              <p>Desa Ciwaruga terletak di Kecamatan Parongpong, Kabupaten Bandung Barat, Provinsi Jawa Barat. Desa ini berbatasan langsung dengan Kota Bandung dan Kota Cimahi, menjadikannya kawasan strategis yang menghubungkan wilayah perkotaan dan pedesaan. Dengan luas wilayah sekitar 279,053 hektar dan jumlah penduduk mencapai 13.455 jiwa, Ciwaruga merupakan desa yang dinamis dan berkembang pesat.</p>
              <p className="mt-4">Asal-usul nama "Ciwaruga" berasal dari bahasa Sunda, di mana "Ci" berarti air dan "Waruga" berarti tubuh atau jasad. Menurut cerita masyarakat setempat, dahulu kala daerah ini merupakan tempat pembuangan jasad-jasad tak dikenal. Namun, ada juga versi lain yang menyatakan bahwa nama tersebut berasal dari "Cai" (air) dan "Raga" (jiwa), merujuk pada sumber air deras yang dianggap sebagai sumber kehidupan bagi warga sekitar. Sumber air ini sangat membantu masyarakat, sehingga dianggap sebagai "Jiwa" bagi daerah tersebut.</p>
              <p className="mt-4">Sayangnya, informasi mengenai tahun berdirinya Desa Ciwaruga belum tersedia secara resmi dalam sumber yang ada. Namun, desa ini telah mengalami perkembangan signifikan seiring dengan pertumbuhan wilayah sekitarnya dan peningkatan jumlah penduduk.Perkembangan ini mencerminkan dinamika sosial dan ekonomi yang positif di kawasan tersebut.</p>
              <p className="mt-4">Mengenai kepemimpinan desa, salah satu nama kepala desa yang tercatat adalah Sulaeman Jajuli, S.Pd., yang menjabat hingga tahun 2013. Sayangnya, daftar lengkap kepala desa dari masa ke masa belum tersedia dalam sumber yang ada. Informasi lebih lanjut mengenai kepemimpinan desa dapat diperoleh melalui arsip desa atau dinas terkait.</p>
                <p className="mt-4">Mengenai kepemimpinan desa, salah satu nama kepala desa yang tercatat adalah Sulaeman Jajuli, S.Pd., yang menjabat hingga tahun 2013. Sayangnya, daftar lengkap kepala desa dari masa ke masa belum tersedia dalam sumber yang ada. Informasi lebih lanjut mengenai kepemimpinan desa dapat diperoleh melalui arsip desa atau dinas terkait.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bagan Desa Section */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-blue-700 text-center mb-12">Bagan Desa</h3>
          <div className="flex flex-col lg:flex-row gap-8 justify-center">
            <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 flex-1">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Struktur Organisasi Pemerintahan Desa</h4>
              <div className="relative w-full h-auto">
                <Image
                  src="/struktur-organisasi-pemerintahan.jpg"
                  alt="Struktur Organisasi Pemerintahan Desa"
                  width={800}
                  height={500}
                  layout="responsive"
                />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 flex-1">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Struktur Organisasi Badan Permusyawaratan Desa</h4>
              <div className="relative w-full h-auto">
                <Image
                  src="/struktur-organisasi-bpd.jpg"
                  alt="Struktur Organisasi Badan Permusyawaratan Desa"
                  width={800}
                  height={500}
                  layout="responsive"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Peta Lokasi Desa Section */}
      <section className="py-20 bg-white px-6">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-blue-700 text-center mb-12">Peta Lokasi Desa</h3>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-blue-500 flex-1">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Batas Desa:</h4>
              <div className="grid grid-cols-2 gap-4 text-lg text-gray-700">
                <div>
                  <span className="font-medium">Utara</span>
                  <p className="mt-1">Desa Cigugurgirang</p>
                </div>
                <div>
                  <span className="font-medium">Timur</span>
                  <p className="mt-1">Kelurahan Gegerkalong</p>
                </div>
                <div>
                  <span className="font-medium">Selatan</span>
                  <p className="mt-1">Kelurahan Sarijadi</p>
                </div>
                <div>
                  <span className="font-medium">Barat</span>
                  <p className="mt-1">Desa Sariwangi</p>
                </div>
              </div>
              <div className="mt-8">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Luas Desa:</h4>
                <p className="text-lg text-gray-700">0 m²</p>
              </div>
              <div className="mt-4">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Jumlah Penduduk:</h4>
                <p className="text-lg text-gray-700">16.355 Jiwa</p>
              </div>
            </div>

            <div className="flex-1 rounded-xl shadow-lg overflow-hidden">
              <Image
                src="/peta-lokasi.jpg"
                alt="Peta Lokasi Desa Ciwaruga"
                width={800}
                height={600}
                layout="responsive"
                objectFit="cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}