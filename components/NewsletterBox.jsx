import theme from "../styles/theme";

export default function NewsletterBox() {
  return (
    <section
      className={`text-center bg-gradient-to-t from-[${theme.colors.gradientTo}] to-[${theme.colors.gradientFrom}] border-t border-[${theme.colors.border}] ${theme.spacing.sectionY} ${theme.spacing.sectionX}`}
    >
      <h2 className={`text-2xl md:text-3xl font-bold text-[${theme.colors.primary}] mb-4`}>
        📬 Bleib inspiriert – Tipps für Familien, Finanzen & Alltag
      </h2>
      <p className={`text-[${theme.colors.textLight}] mb-8 max-w-lg mx-auto leading-relaxed`}>
        Erhalte einmal im Monat unsere besten Spartipps, Familienideen &
        Empfehlungen direkt in dein Postfach.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert("Danke! Du erhältst bald unsere besten Tipps 💙");
        }}
        className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto"
      >
        <input
          type="email"
          placeholder="Deine E-Mail-Adresse"
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold transition"
        >
          Anmelden
        </button>
      </form>
    </section>
  );
}
