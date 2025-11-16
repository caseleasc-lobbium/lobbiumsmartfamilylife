export default function SharedHero({ title, subtitle }) {
  return (
    <section className="text-center mt-14 mb-10 max-w-3xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-[#0F1C3F]">
        {title}
      </h1>
      {subtitle && (
        <p className="text-gray-600 mt-4 text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </section>
  );
}