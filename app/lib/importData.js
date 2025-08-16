import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

// Paste data export dari Laravel
const exportedData = {
  umkm: [
    {
      id: 1,
      name: "Toko Sembako Barokah",
      description:
        "Menyediakan kebutuhan sembako sehari-hari dengan harga terjangkau dan kualitas terbaik.",
      image: "https://placehold.co/600x400",
      contact: "08123456789",
      address: "Jl. Sembako No. 1, Bandung",
      created_at: "2025-08-11T11:20:39.000000Z",
      updated_at: "2025-08-11T11:20:39.000000Z",
    },
    {
      id: 2,
      name: "Salon Kecantikan Elok",
      description:
        "Layanan perawatan kecantikan lengkap dengan peralatan modern dan terapis profesional.",
      image: "https://placehold.co/600x400",
      contact: "08789012345",
      address: "Jl. Kecantikan No. 7, Bandung",
      created_at: "2025-08-11T11:20:39.000000Z",
      updated_at: "2025-08-11T11:20:39.000000Z",
    },
  ],
  loker: [
    {
      id: 1,
      url_gambar: "https://placehold.co/600x400",
      nama_perusahaan: "PT Google Indonesia",
      alamat_perusahaan:
        "Jl. Mega Kuningan Barat No.9, RT.5/RW.2, Kuningan, Jakarta Selatan 12950",
      kontak: "hr@google.co.id / 021-29889955",
      posisi: "Frontend Developer",
      gaji: "Rp 12.000.000 - Rp 18.000.000",
      syarat:
        "S1 Teknik Informatika/Sistem Informasi, Menguasai React/Vue.js, Pengalaman minimal 2 tahun, Kemampuan komunikasi yang baik",
      waktu_kerja: "Full-Time",
      tempat_kerja: "On-Site",
      is_active: true,
      created_at: "2025-08-11T11:20:39.000000Z",
      updated_at: "2025-08-11T11:20:39.000000Z",
    },
    {
      id: 2,
      url_gambar: "https://placehold.co/600x400",
      nama_perusahaan: "Shopee Indonesia",
      alamat_perusahaan:
        "Jl. Mega Kuningan Timur Lot 9.1, Jakarta Selatan 12950",
      kontak: "recruitment@shopee.co.id / 021-50959595",
      posisi: "Backend Developer",
      gaji: "Rp 15.000.000 - Rp 22.000.000",
      syarat:
        "S1 Teknik Informatika, Menguasai PHP/Laravel atau Node.js, Pengalaman dengan database MySQL/PostgreSQL, Pengalaman minimal 3 tahun",
      waktu_kerja: "Full-Time",
      tempat_kerja: "Work From Home",
      is_active: true,
      created_at: "2025-08-11T11:20:39.000000Z",
      updated_at: "2025-08-11T11:20:39.000000Z",
    },
    {
      id: 3,
      url_gambar: "https://placehold.co/600x400",
      nama_perusahaan: "PT Gojek Indonesia",
      alamat_perusahaan:
        "Jl. Iskandarsyah II No.2, Melawai, Jakarta Selatan 12160",
      kontak: "careers@gojek.com / 021-80827000",
      posisi: "Mobile Developer",
      gaji: "Rp 10.000.000 - Rp 16.000.000",
      syarat:
        "S1 Teknik Informatika, Menguasai Flutter/React Native, Pengalaman dengan API Integration, Fresh Graduate welcome",
      waktu_kerja: "Full-Time",
      tempat_kerja: "On-Site",
      is_active: true,
      created_at: "2025-08-11T11:20:39.000000Z",
      updated_at: "2025-08-11T11:20:39.000000Z",
    },
    {
      id: 4,
      url_gambar: "https://placehold.co/600x400",
      nama_perusahaan: "PT Tokopedia",
      alamat_perusahaan:
        "Menara Tokopedia, Jl. Prof. DR. Satrio Kav. 11, Jakarta Selatan 12950",
      kontak: "people@tokopedia.com / 021-50959500",
      posisi: "UI/UX Designer",
      gaji: "Rp 8.000.000 - Rp 14.000.000",
      syarat:
        "S1 Desain Grafis/DKV, Menguasai Figma/Adobe XD, Portfolio yang menarik, Pengalaman minimal 1 tahun",
      waktu_kerja: "Full-Time",
      tempat_kerja: "Work From Home",
      is_active: true,
      created_at: "2025-08-11T11:20:39.000000Z",
      updated_at: "2025-08-11T11:20:39.000000Z",
    },
    {
      id: 5,
      url_gambar: "https://placehold.co/600x400",
      nama_perusahaan: "PT Traveloka Indonesia",
      alamat_perusahaan:
        "Tower 42, Jl. TB Simatupang Kav. 1M, Jakarta Selatan 12560",
      kontak: "careers@traveloka.com / 021-29702929",
      posisi: "Data Analyst",
      gaji: "Rp 9.000.000 - Rp 15.000.000",
      syarat:
        "S1 Matematika/Statistik/Teknik Informatika, Menguasai Python/R, SQL, Pengalaman dengan tools visualisasi data",
      waktu_kerja: "Full-Time",
      tempat_kerja: "On-Site",
      is_active: true,
      created_at: "2025-08-11T11:20:39.000000Z",
      updated_at: "2025-08-11T11:20:39.000000Z",
    },
    {
      id: 6,
      url_gambar: "https://placehold.co/600x400",
      nama_perusahaan: "Digital Creative Agency",
      alamat_perusahaan: "Jl. Kemang Raya No.8, Jakarta Selatan 12560",
      kontak: "hello@digitalcreative.id / 021-71900000",
      posisi: "Social Media Specialist",
      gaji: "Rp 5.000.000 - Rp 8.000.000",
      syarat:
        "S1 Komunikasi/Marketing, Kreatif dalam membuat konten, Menguasai tools design, Bisa bekerja dalam tim",
      waktu_kerja: "Freelance",
      tempat_kerja: "Work From Home",
      is_active: true,
      created_at: "2025-08-11T11:20:39.000000Z",
      updated_at: "2025-08-11T11:20:39.000000Z",
    },
    {
      id: 7,
      url_gambar: "https://placehold.co/600x400",
      nama_perusahaan: "StartupTech Indonesia",
      alamat_perusahaan: "Jl. Senopati No.15, Jakarta Selatan 12110",
      kontak: "join@startuptech.id / 021-55555555",
      posisi: "DevOps Engineer",
      gaji: "Rp 13.000.000 - Rp 20.000.000",
      syarat:
        "S1 Teknik Informatika, Pengalaman dengan AWS/GCP, Docker, Kubernetes, CI/CD pipeline, Minimal 2 tahun pengalaman",
      waktu_kerja: "Full-Time",
      tempat_kerja: "Work From Home",
      is_active: true,
      created_at: "2025-08-11T11:20:39.000000Z",
      updated_at: "2025-08-11T11:20:39.000000Z",
    },
    {
      id: 8,
      url_gambar: "https://placehold.co/600x400",
      nama_perusahaan: "PT EduTech Indonesia",
      alamat_perusahaan: "Jl. Tebet Raya No.10, Jakarta Selatan 12810",
      kontak: "careers@edutech.co.id / 021-83703737",
      posisi: "Content Writer",
      gaji: "Rp 4.500.000 - Rp 7.000.000",
      syarat:
        "S1 Sastra/Jurnalistik/Komunikasi, Kemampuan menulis yang baik, SEO knowledge, Portfolio tulisan yang menarik",
      waktu_kerja: "Part-Time",
      tempat_kerja: "Work From Home",
      is_active: true,
      created_at: "2025-08-11T11:20:39.000000Z",
      updated_at: "2025-08-11T11:20:39.000000Z",
    },
    {
      id: 9,
      url_gambar: "https://placehold.co/600x400",
      nama_perusahaan: "PT FinTech Solutions",
      alamat_perusahaan: "Jl. Sudirman No.54, Jakarta Pusat 10220",
      kontak: "hr@fintech.co.id / 021-57575757",
      posisi: "Product Manager",
      gaji: "Rp 18.000.000 - Rp 25.000.000",
      syarat:
        "S1 Teknik/Bisnis, Pengalaman sebagai Product Manager min 3 tahun, Analytical thinking, Leadership skills",
      waktu_kerja: "Full-Time",
      tempat_kerja: "On-Site",
      is_active: true,
      created_at: "2025-08-11T11:20:39.000000Z",
      updated_at: "2025-08-11T11:20:39.000000Z",
    },
    {
      id: 10,
      url_gambar: "https://placehold.co/600x400",
      nama_perusahaan: "Indonesia Game Studio",
      alamat_perusahaan: "Jl. Fatmawati No.25, Jakarta Selatan 12420",
      kontak: "jobs@gamestudio.id / 021-22222222",
      posisi: "Game Developer",
      gaji: "Rp 8.000.000 - Rp 14.000.000",
      syarat:
        "S1 Teknik Informatika, Menguasai Unity/Unreal Engine, C# atau C++, Portfolio game yang pernah dibuat",
      waktu_kerja: "Full-Time",
      tempat_kerja: "On-Site",
      is_active: true,
      created_at: "2025-08-11T11:20:39.000000Z",
      updated_at: "2025-08-11T11:20:39.000000Z",
    },
    {
      id: 11,
      url_gambar: "https://placehold.co/600x400",
      nama_perusahaan: "PT Konsultan Digital",
      alamat_perusahaan: "Jl. HR Rasuna Said No.8, Jakarta Selatan 12940",
      kontak: "recruitment@konsultan.co.id / 021-88888888",
      posisi: "Business Analyst",
      gaji: "Rp 11.000.000 - Rp 17.000.000",
      syarat:
        "S1 Ekonomi/Manajemen/Teknik Industri, Analytical skills, Excel advanced, Pengalaman minimal 2 tahun",
      waktu_kerja: "Full-Time",
      tempat_kerja: "On-Site",
      is_active: true,
      created_at: "2025-08-11T11:20:39.000000Z",
      updated_at: "2025-08-11T11:20:39.000000Z",
    },
    {
      id: 12,
      url_gambar: "https://placehold.co/600x400",
      nama_perusahaan: "PT Media Technology",
      alamat_perusahaan: "Jl. Casablanca No.12, Jakarta Selatan 12870",
      kontak: "info@mediatech.id / 021-99999999",
      posisi: "Video Editor",
      gaji: "Rp 6.000.000 - Rp 10.000.000",
      syarat:
        "D3/S1 Broadcasting/DKV, Menguasai Adobe Premiere/Final Cut Pro, After Effects, Portfolio video yang menarik",
      waktu_kerja: "Freelance",
      tempat_kerja: "Work From Home",
      is_active: true,
      created_at: "2025-08-11T11:20:39.000000Z",
      updated_at: "2025-08-11T11:20:39.000000Z",
    },
    {
      id: 14,
      url_gambar: "https://placehold.co/600x400",
      nama_perusahaan: "HinziStore",
      alamat_perusahaan: "Bandung",
      kontak: "hinzistore@gmail.com",
      posisi: "CEO",
      gaji: "Rp 2.000.000",
      syarat: "Bebas",
      waktu_kerja: "Part-Time",
      tempat_kerja: "Work From Home",
      is_active: true,
      created_at: "2025-08-12T06:07:53.000000Z",
      updated_at: "2025-08-12T06:07:53.000000Z",
    },
  ],
  users: [
    {
      id: 1,
      name: "Administrator",
      email: "admin@rwrt.com",
      email_verified_at: null,
      created_at: "2025-08-11T11:20:39.000000Z",
      updated_at: "2025-08-11T11:20:39.000000Z",
    },
  ],
};

export async function importDataToFirebase() {
  try {
    console.log("🚀 Starting data import to Firebase...");

    // Import UMKM data
    console.log("📦 Importing UMKM data...");
    for (const umkm of exportedData.umkm) {
      const { id, ...umkmData } = umkm;
      await addDoc(collection(db, "umkm"), {
        ...umkmData,
        laravel_id: id,
        imported_at: new Date().toISOString(),
      });
      console.log(`✅ Imported UMKM: ${umkm.name}`);
    }

    // Import Loker data - MAP FIELDS CORRECTLY
    console.log("💼 Importing Loker data...");
    for (const loker of exportedData.loker) {
      const { id, ...lokerData } = loker;

      // Map Laravel fields to Firebase fields
      const mappedLoker = {
        title: lokerData.posisi, // posisi → title
        company: lokerData.nama_perusahaan, // nama_perusahaan → company
        description: `${lokerData.waktu_kerja} - ${lokerData.tempat_kerja}`, // combine info
        requirements: lokerData.syarat, // syarat → requirements
        salary: lokerData.gaji, // gaji → salary
        contact: lokerData.kontak, // kontak → contact
        location: lokerData.alamat_perusahaan, // alamat_perusahaan → location
        is_active: lokerData.is_active, // same
        image: lokerData.url_gambar, // url_gambar → image
        created_at: lokerData.created_at, // same
        updated_at: lokerData.updated_at, // same
        laravel_id: id,
        imported_at: new Date().toISOString(),

        // Keep original fields for reference
        original_data: {
          waktu_kerja: lokerData.waktu_kerja,
          tempat_kerja: lokerData.tempat_kerja,
        },
      };

      await addDoc(collection(db, "loker"), mappedLoker);
      console.log(
        `✅ Imported Loker: ${loker.posisi} at ${loker.nama_perusahaan}`
      );
    }

    // Import user data
    console.log("👤 Importing User data...");
    for (const user of exportedData.users) {
      const { id, ...userData } = user;
      await addDoc(collection(db, "users"), {
        ...userData,
        laravel_id: id,
        imported_at: new Date().toISOString(),
      });
      console.log(`✅ Imported User: ${user.name}`);
    }

    console.log("🎉 All data imported successfully!");
    return { success: true, message: "Data import completed!" };
  } catch (error) {
    console.error("❌ Import error:", error);
    return { success: false, error: error.message };
  }
}
