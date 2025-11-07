"use client";
import Image from "next/image";

export default function PartnerGrid() {
  const partners = [
    { name: "Anton App", src: "/partner/anton.png", alt: "Anton Lern-App", emoji: "📘" },
    { name: "Duolingo", src: "/partner/duolingo.png", alt: "Duolingo Sprachlern-App", emoji: "🦉" },
    { name: "Khan Academy", src: "/partner/khanacademy.png", alt: "Khan Academy Lernplattform", emoji: "🎓" },
    { name: "Familonet", src: "/partner/familonet.png", alt: "Familonet Familien-Tracker", emoji: "👨‍👩‍👧‍👦" },
    { name: "Todoist", src: "/partner/todoist.png", alt: "Todoist Aufgabenplaner", emoji: "📝" },
    { name: "Cozi", src: "/partner/cozi.png", alt: "Cozi Familienkalender", emoji: "📅" },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#f8fbff] to-[#eef3fb] border-t border-[#e1e5ee]">
      <div className="max-w-6xl mx-auto text-center px-6">
        {/* Titel */}
        <h2 className="text-3xl md:text-4xl font-bold text-[#1c3d6c] mb-10">
          Unsere Partner
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 justify-items-center items-center">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center w-full h-full bg-white/70 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 p-4 text-center"
            >
              {/* Logo oder Emoji */}
              <div className="w-20 h-20 flex items-center justify-center">
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  width={100}
                  height={60}
                  className="object-contain w-auto h-12 sm:h-14"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const emojiSpan = document.createElement("span");
                    emojiSpan.textContent = partner.emoji;
                    emojiSpan.style.fontSize = "2.2rem";
                    e.currentTarget.parentElement.appendChild(emojiSpan);
                  }}
                />
              </div>

              {/* Partnername */}
              <p className="mt-3 text-sm sm:text-base font-medium text-[#1c3d6c]">
                {partner.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}