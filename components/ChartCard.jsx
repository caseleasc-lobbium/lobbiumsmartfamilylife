"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

export default function ChartCard({ title, labels, data }) {
  const lineData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        borderColor: "rgba(37, 99, 235, 1)",
        backgroundColor: "rgba(37, 99, 235, 0.18)",
        tension: 0.35,
        borderWidth: 2.5,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: "rgba(37, 99, 235, 1)",
      },
    ],
  };

  const doughnutData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        backgroundColor: [
          "rgba(37, 99, 235, 0.9)",
          "rgba(16, 185, 129, 0.9)",
          "rgba(249, 115, 22, 0.9)",
          "rgba(139, 92, 246, 0.9)",
        ],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0F1C3F",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
        borderRadius: 10,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b" },
      },
      y: {
        grid: { color: "#e2e8f0" },
        ticks: { color: "#64748b" },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 15,
          color: "#475569",
          font: { size: 12 },
        },
      },
    },
  };

  const isSmall = labels.length <= 4;

  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-3xl p-6 transition-all">
      <h3 className="text-lg font-semibold mb-5 text-[#0F1C3F]">{title}</h3>

      <div className="w-full h-72">
        {isSmall ? (
          <Doughnut data={doughnutData} options={doughnutOptions} />
        ) : (
          <Line data={lineData} options={lineOptions} />
        )}
      </div>
    </div>
  );
}