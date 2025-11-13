export default function NewsletterSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          🎉 Anmeldung erfolgreich!
        </h1>
        <p className="text-gray-700 mb-6">
          Vielen Dank für deine Anmeldung zum Lobbium-Newsletter.
          Du erhältst ab sofort exklusive Tipps und News rund um Smart Family Life.
        </p>
        <a
          href="/"
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Zur Startseite
        </a>
      </div>
    </div>
  );
}