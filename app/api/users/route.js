// /app/api/users/route.js

export async function GET() {
  // Beispiel-Daten (später aus DB)
  const users = [
    {
      id: 1,
      name: "Max Mustermann",
      email: "max@lobbium.com",
      role: "Admin",
      status: "Aktiv",
    },
    {
      id: 2,
      name: "Sophie Müller",
      email: "sophie@lobbium.com",
      role: "Editor",
      status: "Inaktiv",
    },
    {
      id: 3,
      name: "Jonas Weber",
      email: "jonas@lobbium.com",
      role: "User",
      status: "Aktiv",
    },
    {
      id: 4,
      name: "Laura Schmidt",
      email: "laura@lobbium.com",
      role: "Manager",
      status: "Aktiv",
    },
  ];

  return new Response(JSON.stringify(users), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}