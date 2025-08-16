import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rw-ciwaruga.web.app"),
  title: "RW 16 Desa Ciwaruga",
  description:
    "Website Resmi RW 16 Desa Ciwaruga - Informasi UMKM, Lowongan Kerja, dan Berita",
  keywords: "RW 16, Desa Ciwaruga, UMKM, Lowongan Kerja, Berita, Bandung",
  authors: [{ name: "RW 16 Desa Ciwaruga" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "RW 16 Desa Ciwaruga",
    description: "Website Resmi RW 16 Desa Ciwaruga",
    url: "https://rw16ciwaruga.vercel.app",
    siteName: "RW 16 Desa Ciwaruga",
    images: [
      {
        url: "/logokbb.png",
        width: 1200,
        height: 630,
        alt: "RW 16 Desa Ciwaruga",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RW 16 Desa Ciwaruga",
    description: "Website Resmi RW 16 Desa Ciwaruga",
    images: ["/logokbb.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
