"use client";

export default function SectionHero({ title, subtitle }) {
  return (
    <section className="w-full text-center mt-10 sm:mt-16 mb-8 sm:mb-12 px-4 sm:px-6">
      
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0F1C3F]">
        {title}
      </h1>

      {subtitle && (
        <p className="text-base sm:text-lg text-gray-600 mt-3 sm:mt-4 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}

      {/* Premium Divider (Apple-Style Linie) */}
      <div className="mt-6 sm:mt-8 w-16 sm:w-20 h-1 bg-blue-600 mx-auto rounded-full opacity-80" />
    </section>
  );
}