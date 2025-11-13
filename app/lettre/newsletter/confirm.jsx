import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function ConfirmPage({ searchParams }) {
  const token = searchParams.token;

  const user = await prisma.subscriber.updateMany({
    where: { token },
    data: { confirmed: true },
  });

  const success = user.count > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center">
      {success ? (
        <>
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            ✅ Newsletter-Bestätigung erfolgreich!
          </h1>
          <p className="text-gray-700 max-w-md">
            Vielen Dank! Deine E-Mail-Adresse wurde erfolgreich bestätigt.  
            Du erhältst ab sofort alle Neuigkeiten von Lobbium Smart Family Life.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            ❌ Ungültiger Bestätigungslink
          </h1>
          <p className="text-gray-700 max-w-md">
            Der Bestätigungslink ist abgelaufen oder ungültig.  
            Bitte registriere dich erneut über das Newsletter-Formular.
          </p>
        </>
      )}
    </div>
  );
}