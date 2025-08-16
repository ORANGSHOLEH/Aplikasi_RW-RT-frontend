"use client";
import { useState } from "react";

export default function PendudukChart() {
  const [selectedRT, setSelectedRT] = useState("all");

  // Data dummy penduduk
  const pendudukData = {
    total: 2450,
    lakiLaki: 1250,
    perempuan: 1200,
    byAge: [
      { range: "0-10", count: 245 },
      { range: "11-20", count: 380 },
      { range: "21-30", count: 420 },
      { range: "31-40", count: 390 },
      { range: "41-50", count: 350 },
      { range: "51-60", count: 280 },
      { range: "60+", count: 385 },
    ],
    byRT: [
      { rt: "001", total: 245, lakiLaki: 125, perempuan: 120 },
      { rt: "002", total: 220, lakiLaki: 115, perempuan: 105 },
      { rt: "003", total: 280, lakiLaki: 140, perempuan: 140 },
      { rt: "004", total: 195, lakiLaki: 100, perempuan: 95 },
      { rt: "005", total: 310, lakiLaki: 160, perempuan: 150 },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">
          Data Penduduk RW 16
        </h3>
        <select
          value={selectedRT}
          onChange={(e) => setSelectedRT(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Semua RT</option>
          {pendudukData.byRT.map((rt) => (
            <option key={rt.rt} value={rt.rt}>
              RT {rt.rt}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <div className="text-3xl mr-4">👥</div>
            <div>
              <p className="text-blue-100">Total Penduduk</p>
              <p className="text-3xl font-bold">
                {pendudukData.total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <div className="text-3xl mr-4">👨</div>
            <div>
              <p className="text-green-100">Laki-Laki</p>
              <p className="text-3xl font-bold">
                {pendudukData.lakiLaki.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <div className="text-3xl mr-4">👩</div>
            <div>
              <p className="text-pink-100">Perempuan</p>
              <p className="text-3xl font-bold">
                {pendudukData.perempuan.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Distribution */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4">Distribusi Usia</h4>
          <div className="space-y-3">
            {pendudukData.byAge.map((age, index) => {
              const percentage = (age.count / pendudukData.total) * 100;
              return (
                <div key={index} className="flex items-center">
                  <div className="w-16 text-sm font-medium">{age.range}</div>
                  <div className="flex-1 mx-3">
                    <div className="bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-sm text-right">
                    {age.count} ({percentage.toFixed(1)}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RT Distribution */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4">Distribusi per RT</h4>
          <div className="space-y-3">
            {pendudukData.byRT.map((rt, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-white"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">RT {rt.rt}</span>
                  <span className="text-lg font-bold">{rt.total}</span>
                </div>
                <div className="flex space-x-4 text-sm text-gray-600">
                  <span>👨 {rt.lakiLaki}</span>
                  <span>👩 {rt.perempuan}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gender Pie Chart Simulation */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4">Rasio Jenis Kelamin</h4>
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <div
              className="absolute inset-0 rounded-full border-8 border-blue-500"
              style={{
                background: `conic-gradient(#3b82f6 0deg ${
                  (pendudukData.lakiLaki / pendudukData.total) * 360
                }deg, #ec4899 ${
                  (pendudukData.lakiLaki / pendudukData.total) * 360
                }deg 360deg)`,
              }}
            ></div>
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{pendudukData.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>
          <div className="ml-8 space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span>
                Laki-Laki: {pendudukData.lakiLaki} (
                {((pendudukData.lakiLaki / pendudukData.total) * 100).toFixed(
                  1
                )}
                %)
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-pink-500 rounded mr-2"></div>
              <span>
                Perempuan: {pendudukData.perempuan} (
                {((pendudukData.perempuan / pendudukData.total) * 100).toFixed(
                  1
                )}
                %)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
