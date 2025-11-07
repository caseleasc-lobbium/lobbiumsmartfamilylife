export async function GET() {
  // Hier später echte Daten einfügen
  const stats = {
    messages: 5,      // Anzahl gespeicherter Kontakt-Nachrichten
    newsletter: 12,   // Anzahl Newsletter-Abonnenten
    visits: 480,      // Beispiel Besucherzahl
  };

  return Response.json(stats);
}