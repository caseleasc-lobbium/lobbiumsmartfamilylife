"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function ChartCard({ title, labels, data }) {
  const lineData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        borderColor: "rgba(37, 99, 235, 0.8)",
        backgroundColor: "rgba(37, 99, 235, 0.3)",
        tension: 0.3,
        borderWidth: 2,
        fill: true,
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
          "rgba(37, 99, 235, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(139, 92, 246, 0.8)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const isSmall = labels.length <= 4;

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>

      {isSmall ? (
        <Doughnut data={doughnutData} />
      ) : (
        <Line data={lineData} />
      )}
    </div>
  );
}