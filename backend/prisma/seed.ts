/**
 * prisma/seed.ts
 * Seeds the database with demo data for the Clinic Appointment & Health Services app.
 * Run with: npx ts-node prisma/seed.ts
 */

import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log("🌱 Seeding database...");

  // Keep repeated development seeds deterministic while retaining demo accounts.
  await prisma.$transaction([
    prisma.favorite.deleteMany(),
    prisma.appointment.deleteMany(),
    prisma.slot.deleteMany(),
    prisma.provider.deleteMany(),
    prisma.clinic.deleteMany(),
  ]);

  // ── 1. Seed Users ───────────────────────────────────────────────────────────

  const patientPassword = await bcrypt.hash("Password123!", 12);
  const adminPassword = await bcrypt.hash("Admin123!", 12);

  const patient = await prisma.user.upsert({
    where: { email: "patient@demo.com" },
    update: {},
    create: {
      email: "patient@demo.com",
      passwordHash: patientPassword,
      name: "Demo Patient",
      phone: "+251911000000",
      role: Role.PATIENT,
    },
  });
  console.log(`  ✔ Patient: ${patient.email}`);

  const admin = await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      email: "admin@demo.com",
      passwordHash: adminPassword,
      name: "Admin User",
      phone: "+251911000001",
      role: Role.ADMIN,
    },
  });
  console.log(`  ✔ Admin: ${admin.email}`);

  // ── 2. Seed Clinics (10 clinics across Addis Ababa) ─────────────────────────

  const clinicData = [
    {
      name: "Tikur Anbessa Specialized Hospital",
      address: "Churchill Avenue, Addis Ababa",
      latitude: 9.0192,
      longitude: 38.7525,
      phone: "+251111551211",
      category: "General Hospital",
    },
    {
      name: "St. Paul's Hospital Millennium Medical College",
      address: "Swaziland Street, Addis Ababa",
      latitude: 9.0403,
      longitude: 38.7465,
      phone: "+251112757692",
      category: "General Hospital",
    },
    {
      name: "Yekatit 12 Hospital Medical College",
      address: "Sidist Kilo, Addis Ababa",
      latitude: 9.0285,
      longitude: 38.7583,
      phone: "+251111553422",
      category: "General Hospital",
    },
    {
      name: "Bethel Teaching General Hospital",
      address: "Bole Sub-city, Addis Ababa",
      latitude: 9.0054,
      longitude: 38.7836,
      phone: "+251116630082",
      category: "Specialty Clinic",
    },
    {
      name: "Kadisco General Hospital",
      address: "Kirkos Sub-city, Addis Ababa",
      latitude: 9.0001,
      longitude: 38.7612,
      phone: "+251115530012",
      category: "General Hospital",
    },
    {
      name: "Hayat General Hospital",
      address: "Bole Road, Addis Ababa",
      latitude: 8.9958,
      longitude: 38.7878,
      phone: "+251116614390",
      category: "General Hospital",
    },
    {
      name: "Myungsung Christian Medical Center",
      address: "Bole, Addis Ababa",
      latitude: 9.0112,
      longitude: 38.7992,
      phone: "+251116293467",
      category: "Specialty Clinic",
    },
    {
      name: "Girum General Hospital",
      address: "Nifas Silk Lafto, Addis Ababa",
      latitude: 8.9784,
      longitude: 38.7389,
      phone: "+251114670022",
      category: "General Hospital",
    },
    {
      name: "Nordic Medical Centre",
      address: "Bole Medhane Alem, Addis Ababa",
      latitude: 9.0098,
      longitude: 38.7713,
      phone: "+251116630300",
      category: "Specialty Clinic",
    },
    {
      name: "Landmark General Hospital",
      address: "Arada Sub-city, Addis Ababa",
      latitude: 9.0345,
      longitude: 38.7401,
      phone: "+251111262800",
      category: "General Hospital",
    },
  ];

  const clinics = await Promise.all(
    clinicData.map((c) =>
      prisma.clinic.create({ data: c })
    )
  );
  console.log(`  ✔ Created ${clinics.length} clinics`);

  // ── 3. Seed Providers (2 per clinic, 20 total) ──────────────────────────────

  const specialties = [
    "General Medicine",
    "Pediatrics",
    "Dermatology",
    "Cardiology",
    "Orthopedics",
    "ENT",
    "Ophthalmology",
    "Gynecology",
    "Dentistry",
    "Neurology",
  ];

  const providerNames = [
    "Dr. Abebe Kebede",
    "Dr. Tigist Haile",
    "Dr. Solomon Tesfaye",
    "Dr. Meron Alemu",
    "Dr. Dawit Gebremedhin",
    "Dr. Helen Tadesse",
    "Dr. Yonas Bekele",
    "Dr. Sara Mekonnen",
    "Dr. Bereket Assefa",
    "Dr. Rahel Wolde",
    "Dr. Tesfaye Girma",
    "Dr. Hana Dejene",
    "Dr. Mulugeta Desta",
    "Dr. Bethlehem Fekadu",
    "Dr. Elias Teshome",
    "Dr. Lidia Worku",
    "Dr. Henok Berhane",
    "Dr. Selamawit Hailu",
    "Dr. Mikael Eshetu",
    "Dr. Aida Abera",
  ];

  const providers = [];
  for (let i = 0; i < clinics.length; i++) {
    for (let j = 0; j < 2; j++) {
      const idx = i * 2 + j;
      const provider = await prisma.provider.create({
        data: {
          name: providerNames[idx],
          specialty: specialties[idx % specialties.length],
          bio: `${providerNames[idx]} is a board-certified specialist in ${specialties[idx % specialties.length]} with over ${8 + idx} years of clinical experience. Dedicated to providing compassionate and evidence-based care.`,
          clinicId: clinics[i].id,
        },
      });
      providers.push(provider);
    }
  }
  console.log(`  ✔ Created ${providers.length} providers`);

  // ── 4. Seed Slots (15 per provider × 20 providers = 300 slots) ──────────────

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let slotCount = 0;

  for (const provider of providers) {
    const slotsToCreate = [];
    let created = 0;
    let dayOffset = 1; // start from tomorrow

    while (created < 15 && dayOffset <= 14) {
      const day = new Date(today);
      day.setDate(day.getDate() + dayOffset);

      // Skip weekends (0=Sun, 6=Sat)
      const dow = day.getDay();
      if (dow === 0 || dow === 6) {
        dayOffset++;
        continue;
      }

      // Generate slots 9:00 AM – 5:00 PM (30 min each = up to 16 per day)
      const slotsPerDay = Math.min(15 - created, 3); // spread across days
      for (let s = 0; s < slotsPerDay; s++) {
        const hourOffset = created % 16; // 0..15 covering 9:00-16:30
        const startHour = 9 + Math.floor(hourOffset / 2);
        const startMin = (hourOffset % 2) * 30;

        const startTime = new Date(day);
        startTime.setHours(startHour, startMin, 0, 0);

        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + 30);

        slotsToCreate.push({
          providerId: provider.id,
          startTime,
          endTime,
          isBooked: false,
        });
        created++;
      }
      dayOffset++;
    }

    await prisma.slot.createMany({ data: slotsToCreate });
    slotCount += slotsToCreate.length;
  }
  console.log(`  ✔ Created ${slotCount} slots`);

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
