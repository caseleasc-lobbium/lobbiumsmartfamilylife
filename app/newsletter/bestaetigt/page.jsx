export default function NewsletterBestaetigt() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-center p-8">
      <div className="max-w-md">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          ✅ Newsletter-Bestätigung erfolgreich!
        </h1>
        <p className="text-gray-700">
          Vielen Dank! Deine E-Mail wurde erfolgreich bestätigt.  
          Du erhältst ab sofort die neuesten Tipps von <b>Lobbium Smart Family Life</b>.
        </p>
      </div>
    </div>
  );
}