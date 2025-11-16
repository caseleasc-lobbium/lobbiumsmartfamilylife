"use client";

export default function SectionHero({ title, subtitle }) {
  return (
    <section className="w-full text-center mt-16 mb-12 px-6">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0F1C3F]">
        {title}
      </h1>

      {subtitle && (
        <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}

      {/* Premium Divider (Apple-Style Linie) */}
      <div className="mt-8 w-20 h-1 bg-blue-600 mx-auto rounded-full opacity-80" />
    </section>
  );
}