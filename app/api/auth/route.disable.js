export async function POST(request) {
  try {
    const body = await request.json();

    // Beispielhafte Validierung
    if (!body.email || !body.password) {
      return new Response(JSON.stringify({ error: "Fehlende Felder" }), {
        status: 400,
      });
    }

    // Beispielhafte Antwort
    return new Response(JSON.stringify({ success: true, user: body.email }), {
      status: 200,
    });
  } catch (error) {
    console.error("Auth API Error:", error);
    return new Response(
      JSON.stringify({ error: "Interner Serverfehler", details: error.message }),
      { status: 500 }
    );
  }
}

export async function GET() {
  return new Response(JSON.stringify({ message: "Auth-Endpoint aktiv" }), {
    status: 200,
  });
}