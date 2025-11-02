import Image from "next/image";

export default function LogoTest() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
      fontFamily: "sans-serif",
    }}>
      <h1>🔍 Logo-Test für Lobbium</h1>
      <p>Wenn das Logo unten sichtbar ist, ist alles korrekt eingerichtet:</p>

      <div style={{
        marginTop: "2rem",
        padding: "1rem",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <Image
          src="/logo.png"
          alt="Lobbium Logo Test"
          width={120}
          height={120}
          priority
        />
      </div>

      <p style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#555" }}>
        Falls das Bild fehlt oder ein Fragezeichen erscheint, überprüfe:
        <br />→ ob <code>/public/logo.png</code> wirklich existiert.
        <br />→ und ob die Datei exakt <strong>logo.png</strong> heißt.
      </p>
    </div>
  );
}

