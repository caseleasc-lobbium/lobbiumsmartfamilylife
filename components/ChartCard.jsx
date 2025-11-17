"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function ChartCard({ title, data, labels }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: title,
            data,
            borderColor: "#2563eb",
            backgroundColor: "rgba(37, 99, 235, 0.1)",
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }, [data, labels]);

  return (
    <div className="bg-white shadow rounded-3xl p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <canvas ref={canvasRef} height={120}></canvas>
    </div>
  );
}