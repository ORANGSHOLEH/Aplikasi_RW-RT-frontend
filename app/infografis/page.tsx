"use client";
import { useState } from "react";
import Image from "next/image";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import PendudukChart from "../components/infografis/PendudukChart";
import APBRWChart from "../components/infografis/APBRWChart";
import StuntingChart from "../components/infografis/StuntingChart";
import BansosChart from "../components/infografis/BansosChart";
import SDGsChart from "../components/infografis/SDGsChart";

export default function Infografis() {
  const [activeTab, setActiveTab] = useState("penduduk");

  const tabs = [
    { id: "penduduk", name: "Data Penduduk", icon: "👥" },
    { id: "apbrw", name: "APBRW", icon: "💰" },
    { id: "stunting", name: "Stunting", icon: "📊" },
    { id: "bansos", name: "Bantuan Sosial", icon: "🎁" },
    { id: "sdgs", name: "SDGs", icon: "🎯" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Header Section - Using same colors as Berita */}
        <section className="py-12 bg-primary-gradient text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h2 className="text-sm uppercase font-semibold text-emerald-100">
                Ciwaruga Data
              </h2>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                INFOGRAFIS
              </h1>
              <h2 className="text-2xl lg:text-3xl font-medium text-gray-100">
                RW 16 DESA CIWARUGA
              </h2>
              <p className="mt-4 text-gray-100 max-w-2xl mx-auto">
                Visualisasi data dan statistik terkini mengenai kondisi
                demografis, ekonomi, dan sosial di wilayah RW 16 Desa Ciwaruga
              </p>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap gap-2 py-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Actions
        <section className="py-6 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setActiveTab("penduduk")}
                className="flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
              >
                <span className="mr-2">👥</span>
                Lihat Data Penduduk
              </button>
              <button
                onClick={() => setActiveTab("apbrw")}
                className="flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
              >
                <span className="mr-2">💰</span>
                Lihat Anggaran RW
              </button>
            </div>
          </div>
        </section> */}

        {/* Tab Content */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {activeTab === "penduduk" && <PendudukChart />}
              {activeTab === "apbrw" && <APBRWChart />}
              {activeTab === "stunting" && <StuntingChart />}
              {activeTab === "bansos" && <BansosChart />}
              {activeTab === "sdgs" && <SDGsChart />}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
