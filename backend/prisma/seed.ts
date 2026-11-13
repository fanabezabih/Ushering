import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  // Languages (final list still pending TCA approval, decision D-07)
  const languages = ["Amharic", "English", "Oromiffa", "Tigrinya", "Somali", "Other"];
  for (const name of languages) {
    await prisma.language.upsert({ where: { name }, update: {}, create: { name } });
  }

  // One active event (replace with the real details once TCA confirms)
  const event = await prisma.event.findFirst({ where: { isActive: true } });
  if (!event) {
    await prisma.event.create({
      data: { name: "[EVENT NAME]", venue: "[VENUE]", isActive: true },
    });
  }

  // First admin user
  const email = process.env.SEED_ADMIN_EMAIL?.toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) throw new Error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env");

  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      fullName: "TCA Administrator",
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "ADMIN",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());