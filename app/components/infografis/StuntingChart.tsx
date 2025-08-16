"use client";
import { useState } from "react";

export default function StuntingChart() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024");

  // Data dummy stunting
  const stuntingData = {
    totalAnak: 245,
    stuntingCases: 18,
    normalCases: 227,
    byAge: [
      { range: "0-6 bulan", total: 45, stunting: 2, normal: 43 },
      { range: "7-12 bulan", total: 40, stunting: 3, normal: 37 },
      { range: "13-24 bulan", total: 50, stunting: 5, normal: 45 },
      { range: "25-36 bulan", total: 55, stunting: 4, normal: 51 },
      { range: "37-48 bulan", total: 35, stunting: 2, normal: 33 },
      { range: "49-60 bulan", total: 20, stunting: 2, normal: 18 },
    ],
    trend: [
      { month: "Jan", cases: 22 },
      { month: "Feb", cases: 21 },
      { month: "Mar", cases: 20 },
      { month: "Apr", cases: 19 },
      { month: "May", cases: 18 },
      { month: "Jun", cases: 18 },
    ],
    interventions: [
      { program: "Pemberian Makanan Tambahan", sasaran: 50, tercapai: 45 },
      { program: "Edukasi Gizi Ibu", sasaran: 30, tercapai: 28 },
      { program: "Pemantauan Tumbuh Kembang", sasaran: 100, tercapai: 95 },
      { program: "Suplementasi Vitamin", sasaran: 80, tercapai: 75 },
    ]
  };

  const stuntingPercentage = (stuntingData.stuntingCases / stuntingData.totalAnak) * 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Data Stunting Balita RW 16</h3>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="2024">Tahun 2024</option>
          <option value="2023">Tahun 2023</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <div className="text-3xl mr-4">👶</div>
            <div>
              <p className="text-blue-100">Total Balita</p>
              <p className="text-3xl font-bold">{stuntingData.totalAnak}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <div className="text-3xl mr-4">⚠️</div>
            <div>
              <p className="text-red-100">Stunting</p>
              <p className="text-3xl font-bold">{stuntingData.stuntingCases}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <div className="text-3xl mr-4">✅</div>
            <div>
              <p className="text-green-100">Normal</p>
              <p className="text-3xl font-bold">{stuntingData.normalCases}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📊</div>
            <div>
              <p className="text-orange-100">Prevalensi</p>
              <p className="text-3xl font-bold">{stuntingPercentage.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Age Distribution */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4">Distribusi Stunting per Kelompok Usia</h4>
        <div className="space-y-4">
          {stuntingData.byAge.map((age, index) => {
            const stuntingPercentage = (age.stunting / age.total) * 100;
            
            return (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{age.range}</span>
                  <span className="text-sm text-gray-600">
                    {age.stunting}/{age.total} ({stuntingPercentage.toFixed(1)}%)
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-red-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${stuntingPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Stunting: {age.stunting}</span>
                  <span>Normal: {age.normal}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4">Tren Kasus Stunting</h4>
          <div className="space-y-3">
            {stuntingData.trend.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="font-medium">{item.month}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-red-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(item.cases / 25) * 100}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-sm font-medium">{item.cases}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intervention Programs */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4">Program Intervensi</h4>
          <div className="space-y-4">
            {stuntingData.interventions.map((program, index) => {
              const percentage = (program.tercapai / program.sasaran) * 100;
              
              return (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="mb-2">
                    <span className="font-medium text-sm">{program.program}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Sasaran: {program.sasaran}</span>
                    <span>Tercapai: {program.tercapai}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        percentage >= 90 ? 'bg-green-500' : 
                        percentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-xs text-gray-600 mt-1">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}