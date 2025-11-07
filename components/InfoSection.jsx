import theme from "../styles/theme";

export default function InfoSection({ title, description, items = [] }) {
  return (
    <section
      className={`bg-gradient-to-b from-[${theme.colors.gradientFrom}] to-[${theme.colors.gradientTo}] border-t border-[${theme.colors.border}] ${theme.spacing.sectionY} ${theme.spacing.sectionX}`}
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className={`text-2xl md:text-3xl font-bold text-[${theme.colors.primary}] mb-3`}>
          {title}
        </h2>
        <p className={`text-[${theme.colors.textLight}] mb-12 max-w-2xl mx-auto leading-relaxed`}>
          {description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className={`${theme.effects.card} ${theme.effects.shadow} p-6 text-left hover:-translate-y-1`}
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className={`text-lg font-semibold text-[${theme.colors.primary}] mb-2`}>
                {item.title}
              </h3>
              <p className={`text-[${theme.colors.textLight}] text-sm leading-relaxed`}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
