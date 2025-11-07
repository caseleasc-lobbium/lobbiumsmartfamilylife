"use client";

export default function AdminLayout({ children }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(to bottom right, #f3f4f6, #e9edf2)",
        fontFamily: "Inter, sans-serif",
        padding: "2rem",
      }}
    >
      {children}
    </div>
  );
}