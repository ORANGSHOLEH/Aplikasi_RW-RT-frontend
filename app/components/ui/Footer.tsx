// import Image from "next/image";
// import Link from "next/link";

// export default function Footer() {

//   const currentYear = new Date().getFullYear();

//   return (
//     <footer className="bg-[#0683b6] text-white pt-6 pb-3 px-4">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
//         {/* Logo & Alamat */}
//         <div className="flex flex-col items-start">
//           {/* <Image
//             src="/globe.svg" // Ganti dengan path logo Anda di public/
//             alt="Logo Kabupaten Bandung Barat"
//             width={100}
//             height={100}
//             className="mb-4"
//           /> */}
//           <h2 className="font-bold text-lg mb-2">Pemerintah Desa Ciwuruga</h2>
//           <p className="text-base leading-relaxed">
//             Jalan Waruga Jaya No 5<br />
//             Desa Desa Ciwuruga, Kecamatan Parongpong, Kabupaten Bandung Barat<br />
//             Provinsi Jawa Barat, 40559
//           </p>
//         </div>

//         {/* Hubungi Kami */}
//         <div>
//           <h3 className="font-bold text-lg mb-4">Hubungi Kami</h3>
//           <div className="flex items-center mb-2">
//             <span className="mr-2">📞</span>
//             <span className="text-base">022-63181013</span>
//           </div>
//           <div className="flex items-center mb-2">
//             <span className="mr-2">✉️</span>
//             <span className="text-base break-all">desaciwaruga0205@gmail.com</span>
//           </div>
//           <div className="flex space-x-4 mt-4 text-lg">
//             <a href="#" aria-label="Instagram" className="hover:text-gray-200">📷</a>
//             <a href="#" aria-label="Facebook" className="hover:text-gray-200">👍</a>
//             <a href="#" aria-label="YouTube" className="hover:text-gray-200">▶️</a>
//           </div>
//         </div>

//         {/* Nomor Telepon Penting */}
//         <div>
//           <h3 className="font-bold text-lg mb-4">Nomor Telepon Penting</h3>
//           <p>
//           <Link href="#" className="underline text-base hover:text-gray-200">
//             Rumah Sakit
//           </Link>
//           </p>
//           <p>
//           <Link href="#" className="underline text-base hover:text-gray-200">
//             Posyandu
//           </Link>
//           </p>
//           <p>
//           <Link href="#" className="underline text-base hover:text-gray-200">
//             Puskesmas
//           </Link>
//           </p>
//           <p>
//           <Link href="#" className="underline text-base hover:text-gray-200">
//             Polisi
//           </Link>
//           </p>
//           <p>
//           <Link href="#" className="underline text-base hover:text-gray-200">
//             Damkar
//           </Link>
//           </p>
//         </div>

//         {/* Jelajahi */}
//         <div>
//           <h3 className="font-bold text-lg mb-4">Jelajahi</h3>
//           <ul className="space-y-2 text-base">
//             <li>
//               <Link href="#" className="underline hover:text-gray-200">
//                 Website Kemendesa
//               </Link>
//             </li>
//             <li>
//               <Link href="#" className="underline hover:text-gray-200">
//                 Website Kemendagri
//               </Link>
//             </li>
//             <li>
//               <Link href="#" className="underline hover:text-gray-200">
//                 Portal Jabarprov
//               </Link>
//             </li>
//             <li>
//               <Link href="#" className="underline hover:text-gray-200">
//                 Website Kabupaten Bandung Barat
//               </Link>
//             </li>
//             <li>
//               <Link href="#" className="underline hover:text-gray-200">
//                 Cek DPT Online
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </div>

//       {/* Copyright */}
//       <div className="mt-12 text-center text-base">
//         © {currentYear} Powered by PT Digital Desa Indonesia
//       </div>
//     </footer>
//   )
// };


// components/Footer.js

import { useState } from 'react';
import Link from "next/link";

// Impor ikon dari Font Awesome melalui react-icons
import {
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaInstagram, FaYoutube, FaFacebook,
  FaHospital, FaBaby, FaBriefcaseMedical, FaShieldAlt, FaFireExtinguisher,
  FaLandmark, FaGlobeAsia, FaMapMarkedAlt, FaVoteYea, FaPlus, FaMinus
} from 'react-icons/fa';

// Komponen untuk setiap item di akordeon/footer
const FooterSection = ({ title, children, isOpen, onClick }) => (
  <div>
    {/* Header yang bisa diklik di mobile */}
    <h3
      className="font-bold text-lg mb-4 flex justify-between items-center md:cursor-default cursor-pointer"
      onClick={onClick}
    >
      {title}
      {/* Tampilkan ikon +/- hanya di mobile */}
      <span className="md:hidden text-xl">
        {isOpen ? <FaMinus /> : <FaPlus />}
      </span>
    </h3>
    {/* Konten yang bisa disembunyikan/ditampilkan */}
    <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
      {children}
    </div>
  </div>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  // State untuk mengontrol akordeon yang sedang terbuka di mobile
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    // Jika index yang sama diklik lagi, tutup. Jika tidak, buka yang baru.
    setOpenIndex(openIndex === index ? null : index);
  };

  const footerLinksClass = "flex items-center gap-3 hover:text-gray-200 mb-2 text-base";

  return (
    <footer className="bg-[#0683b6] text-white pt-8 pb-4 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 md:gap-10">

        {/* 1. Alamat */}
        <div className="mb-6 md:mb-0">
          <h3 className="font-bold text-lg mb-4">Pemerintah Desa Ciwaruga</h3>
          <div className="flex gap-3">
            <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
            <p className="text-base leading-relaxed">
              Jalan Waruga Jaya No 5<br />
              Desa Ciwaruga, Kecamatan Parongpong, Kabupaten Bandung Barat<br />
              Provinsi Jawa Barat, 40559
            </p>
          </div>
        </div>

        {/* 2. Hubungi Kami (Accordion di Mobile) */}
        <FooterSection title="Hubungi Kami" isOpen={openIndex === 1} onClick={() => handleToggle(1)}>
          <div className="space-y-2">
            <p className={footerLinksClass}>
              <FaPhone />
              <span>022-63181013</span>
            </p>
            <p className={`${footerLinksClass} items-start`}>
              <FaEnvelope className="mt-1" />
              <span className="break-all">desaciwaruga0205@gmail.com</span>
            </p>
            <div className="flex space-x-4 pt-2 text-2xl">
              <a href="#" aria-label="Instagram" className="hover:text-gray-200"><FaInstagram /></a>
              <a href="#" aria-label="Facebook" className="hover:text-gray-200"><FaFacebook /></a>
              <a href="#" aria-label="YouTube" className="hover:text-gray-200"><FaYoutube /></a>
            </div>
          </div>
        </FooterSection>

        {/* 3. Nomor Telepon Penting (Accordion di Mobile) */}
        <FooterSection title="Nomor Telepon Penting" isOpen={openIndex === 2} onClick={() => handleToggle(2)}>
          <div className="space-y-2">
            <Link href="#" className={footerLinksClass}><FaHospital /> Rumah Sakit</Link>
            <Link href="#" className={footerLinksClass}><FaBaby /> Posyandu</Link>
            <Link href="#" className={footerLinksClass}><FaBriefcaseMedical /> Puskesmas</Link>
            <Link href="#" className={footerLinksClass}><FaShieldAlt /> Polisi</Link>
            <Link href="#" className={footerLinksClass}><FaFireExtinguisher /> Damkar</Link>
          </div>
        </FooterSection>

        {/* 4. Jelajahi (Accordion di Mobile) */}
        <FooterSection title="Jelajahi" isOpen={openIndex === 3} onClick={() => handleToggle(3)}>
          <div className="space-y-2">
            <Link href="#" className={footerLinksClass}><FaLandmark /> Website Kemendesa</Link>
            <Link href="#" className={footerLinksClass}><FaLandmark /> Website Kemendagri</Link>
            <Link href="#" className={footerLinksClass}><FaGlobeAsia /> Portal Jabarprov</Link>
            <Link href="#" className={footerLinksClass}><FaMapMarkedAlt /> Website Kab. Bandung Barat</Link>
            <Link href="#" className={footerLinksClass}><FaVoteYea /> Cek DPT Online</Link>
          </div>
        </FooterSection>

      </div>

      {/* Copyright */}
      <div className="mt-10 border-t border-white/20 pt-4 text-center text-base">
        © {currentYear} Powered by PT Digital Desa Indonesia
      </div>
    </footer>
  );
};






