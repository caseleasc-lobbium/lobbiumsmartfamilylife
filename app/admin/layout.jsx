"use client";

export default function AdminLayout({ children }) {
  return (
    <div
      style={{
        background: "linear-gradient(to bottom right, #f8faff, #e6eefb)",
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
        padding: "2rem",
      }}
      className="flex flex-col items-center justify-center"
    >
      {children}
    </div>
  );
}