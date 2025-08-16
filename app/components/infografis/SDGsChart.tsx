"use client";
import { useState } from "react";

export default function SDGsChart() {
  const [selectedGoal, setSelectedGoal] = useState("all");

  // Data dummy SDGs
  const sdgsData = {
    totalGoals: 17,
    achievedGoals: 11,
    inProgressGoals: 4,
    notStartedGoals: 2,
    goals: [
      {
        id: 1,
        title: "Tanpa Kemiskinan",
        progress: 85,
        status: "achieved",
        color: "red",
      },
      {
        id: 2,
        title: "Tanpa Kelaparan",
        progress: 75,
        status: "in-progress",
        color: "yellow",
      },
      {
        id: 3,
        title: "Kehidupan Sehat",
        progress: 90,
        status: "achieved",
        color: "green",
      },
      {
        id: 4,
        title: "Pendidikan Berkualitas",
        progress: 80,
        status: "achieved",
        color: "blue",
      },
      {
        id: 5,
        title: "Kesetaraan Gender",
        progress: 70,
        status: "in-progress",
        color: "orange",
      },
      {
        id: 6,
        title: "Air Bersih",
        progress: 95,
        status: "achieved",
        color: "cyan",
      },
      {
        id: 7,
        title: "Energi Terbarukan",
        progress: 45,
        status: "in-progress",
        color: "yellow",
      },
      {
        id: 8,
        title: "Pekerjaan Layak",
        progress: 88,
        status: "achieved",
        color: "purple",
      },
      {
        id: 9,
        title: "Infrastruktur",
        progress: 92,
        status: "achieved",
        color: "orange",
      },
      {
        id: 10,
        title: "Mengurangi Kesenjangan",
        progress: 65,
        status: "in-progress",
        color: "pink",
      },
      {
        id: 11,
        title: "Kota Berkelanjutan",
        progress: 85,
        status: "achieved",
        color: "yellow",
      },
      {
        id: 12,
        title: "Konsumsi Bertanggung Jawab",
        progress: 78,
        status: "achieved",
        color: "brown",
      },
      {
        id: 13,
        title: "Aksi Iklim",
        progress: 25,
        status: "not-started",
        color: "green",
      },
      {
        id: 14,
        title: "Kehidupan Bawah Laut",
        progress: 30,
        status: "not-started",
        color: "blue",
      },
      {
        id: 15,
        title: "Kehidupan Darat",
        progress: 82,
        status: "achieved",
        color: "green",
      },
      {
        id: 16,
        title: "Keadilan & Kelembagaan",
        progress: 87,
        status: "achieved",
        color: "blue",
      },
      {
        id: 17,
        title: "Kemitraan",
        progress: 89,
        status: "achieved",
        color: "navy",
      },
    ],
    initiatives: [
      {
        title: "Program Beasiswa Anak Tidak Mampu",
        sdg: [1, 4],
        status: "active",
        beneficiaries: 25,
      },
      {
        title: "Bank Sampah RW",
        sdg: [12, 13],
        status: "active",
        beneficiaries: 150,
      },
      {
        title: "Posyandu Balita",
        sdg: [2, 3],
        status: "active",
        beneficiaries: 245,
      },
      {
        title: "UMKM Pemberdayaan Perempuan",
        sdg: [5, 8],
        status: "active",
        beneficiaries: 45,
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "achieved":
        return "bg-green-500";
      case "in-progress":
        return "bg-yellow-500";
      case "not-started":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "achieved":
        return "Tercapai";
      case "in-progress":
        return "Dalam Proses";
      case "not-started":
        return "Belum Dimulai";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">
          Sustainable Development Goals (SDGs)
        </h3>
        <select
          value={selectedGoal}
          onChange={(e) => setSelectedGoal(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Semua Tujuan</option>
          {sdgsData.goals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              SDG {goal.id}: {goal.title}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <div className="text-3xl mr-4">✅</div>
            <div>
              <p className="text-green-100">Tercapai</p>
              <p className="text-3xl font-bold">{sdgsData.achievedGoals}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🔄</div>
            <div>
              <p className="text-yellow-100">Dalam Proses</p>
              <p className="text-3xl font-bold">{sdgsData.inProgressGoals}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <div className="text-3xl mr-4">⏸️</div>
            <div>
              <p className="text-red-100">Belum Dimulai</p>
              <p className="text-3xl font-bold">{sdgsData.notStartedGoals}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🎯</div>
            <div>
              <p className="text-blue-100">Total Tujuan</p>
              <p className="text-3xl font-bold">{sdgsData.totalGoals}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SDGs Grid */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4">Progress 17 Tujuan SDGs</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sdgsData.goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-2">
                    {goal.id}
                  </div>
                  <span className="text-sm font-medium">{goal.title}</span>
                </div>
                <span
                  className={`w-3 h-3 rounded-full ${getStatusColor(
                    goal.status
                  )}`}
                ></span>
              </div>

              <div className="mb-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getStatusColor(
                      goal.status
                    )}`}
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between text-xs text-gray-600">
                <span>{getStatusText(goal.status)}</span>
                <span>{goal.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Initiatives */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4">Inisiatif & Program SDGs</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sdgsData.initiatives.map((initiative, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-3">
                <h5 className="font-medium">{initiative.title}</h5>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  {initiative.status === "active" ? "Aktif" : "Tidak Aktif"}
                </span>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">Terkait SDGs:</p>
                <div className="flex space-x-2">
                  {initiative.sdg.map((sdgId) => (
                    <span
                      key={sdgId}
                      className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
                    >
                      {sdgId}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <span className="font-medium">{initiative.beneficiaries}</span>{" "}
                penerima manfaat
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4">
          Progress Keseluruhan SDGs RW 16
        </h4>
        <div className="flex items-center">
          <div className="flex-1">
            <div className="bg-gray-200 rounded-full h-6">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{
                  width: `${
                    ((sdgsData.achievedGoals + sdgsData.inProgressGoals * 0.5) /
                      sdgsData.totalGoals) *
                    100
                  }%`,
                }}
              >
                <span className="text-white text-sm font-bold">
                  {(
                    ((sdgsData.achievedGoals + sdgsData.inProgressGoals * 0.5) /
                      sdgsData.totalGoals) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
            </div>
          </div>
          <div className="ml-4 text-right">
            <div className="text-2xl font-bold text-gray-900">
              {sdgsData.achievedGoals}/{sdgsData.totalGoals}
            </div>
            <div className="text-sm text-gray-600">Tujuan Tercapai</div>
          </div>
        </div>
      </div>
    </div>
  );
}
