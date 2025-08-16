"use client";
import { useState } from "react";

export default function APBRWChart() {
  const [selectedYear, setSelectedYear] = useState("2024");

  // Data dummy APBRW
  const apbrwData = {
    totalAnggaran: 150000000,
    totalRealisasi: 120000000,
    byCategory: [
      {
        category: "Pembangunan Infrastruktur",
        anggaran: 60000000,
        realisasi: 50000000,
      },
      { category: "Kegiatan Sosial", anggaran: 30000000, realisasi: 25000000 },
      {
        category: "Operasional RT/RW",
        anggaran: 25000000,
        realisasi: 20000000,
      },
      { category: "Kesehatan", anggaran: 20000000, realisasi: 15000000 },
      { category: "Pendidikan", anggaran: 15000000, realisasi: 10000000 },
    ],
    byQuarter: [
      { quarter: "Q1", anggaran: 37500000, realisasi: 30000000 },
      { quarter: "Q2", anggaran: 37500000, realisasi: 32000000 },
      { quarter: "Q3", anggaran: 37500000, realisasi: 35000000 },
      { quarter: "Q4", anggaran: 37500000, realisasi: 23000000 },
    ],
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">
          Anggaran Pendapatan dan Belanja RW (APBRW)
        </h3>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="2024">Tahun 2024</option>
          <option value="2023">Tahun 2023</option>
          <option value="2022">Tahun 2022</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <div className="text-3xl mr-4">💰</div>
            <div>
              <p className="text-green-100">Total Anggaran</p>
              <p className="text-xl font-bold">
                {formatRupiah(apbrwData.totalAnggaran)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📊</div>
            <div>
              <p className="text-blue-100">Total Realisasi</p>
              <p className="text-xl font-bold">
                {formatRupiah(apbrwData.totalRealisasi)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📈</div>
            <div>
              <p className="text-purple-100">Persentase Realisasi</p>
              <p className="text-xl font-bold">
                {(
                  (apbrwData.totalRealisasi / apbrwData.totalAnggaran) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget by Category */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4">Anggaran per Kategori</h4>
        <div className="space-y-4">
          {apbrwData.byCategory.map((item, index) => {
            const percentage = (item.anggaran / apbrwData.totalAnggaran) * 100;
            const realisasiPercentage = (item.realisasi / item.anggaran) * 100;

            return (
              <div
                key={index}
                className="bg-white rounded-lg p-4 border border-gray-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-sm text-gray-600">
                    {percentage.toFixed(1)}% dari total
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Anggaran: {formatRupiah(item.anggaran)}</span>
                    <span>Realisasi: {formatRupiah(item.realisasi)}</span>
                  </div>

                  <div className="relative">
                    <div className="bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${realisasiPercentage}%` }}
                      ></div>
                    </div>
                    <span className="absolute right-0 top-0 text-xs text-gray-600 mt-4">
                      {realisasiPercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quarterly Report */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4">Laporan Triwulan</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {apbrwData.byQuarter.map((quarter, index) => {
            const realisasiPercentage =
              (quarter.realisasi / quarter.anggaran) * 100;

            return (
              <div
                key={index}
                className="bg-white rounded-lg p-4 border border-gray-200"
              >
                <div className="text-center">
                  <h5 className="font-semibold text-lg mb-2">
                    {quarter.quarter}
                  </h5>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Anggaran</p>
                      <p className="font-medium">
                        {formatRupiah(quarter.anggaran)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Realisasi</p>
                      <p className="font-medium text-blue-600">
                        {formatRupiah(quarter.realisasi)}
                      </p>
                    </div>
                    <div className="pt-2">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            realisasiPercentage >= 80
                              ? "bg-green-500"
                              : realisasiPercentage >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${realisasiPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-center mt-1">
                        {realisasiPercentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
