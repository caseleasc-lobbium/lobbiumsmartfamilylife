import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const dummySubscribers = Array.from({ length: 100 }).map((_, i) => ({
    name: `Test User ${i + 1}`,
    email: `user${i + 1}@lobbium.com`,
    consent: i % 2 === 0, // jeder zweite hat "Zustimmung"
  }));

  await prisma.subscriber.createMany({ data: dummySubscribers });
  console.log("✅ 100 Dummy-Subscriber erfolgreich hinzugefügt!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });