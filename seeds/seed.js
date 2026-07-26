import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the server directory
dotenv.config({ path: path.join(__dirname, "..", ".env") });

import User from "../models/User.js";
import TourRequest from "../models/TourRequest.js";
import Message from "../models/Message.js";
import Service from "../models/Service.js";
import GalleryImage from "../models/GalleryImage.js";

/* ═══════════════════════════════════════════════════════════════════════════
   SEED DATA — mirrors the INITIAL_* arrays in admin.tsx
   ═══════════════════════════════════════════════════════════════════════════ */

const adminUser = {
  username: "1stgate",
  password: "1stGate!AdminKey",
};

const tours = [
  {
    name: "Margaret Thompson",
    email: "margaret.t@email.com",
    phone: "(202) 555-0134",
    date: "2026-07-18",
    time: "10:00 AM",
    status: "pending",
    notes: "Interested in memory care for mother.",
  },
  {
    name: "Robert Chen",
    email: "r.chen@email.com",
    phone: "(202) 555-0187",
    date: "2026-07-20",
    time: "2:00 PM",
    status: "confirmed",
    notes: "Looking for assisted living options.",
  },
  {
    name: "Patricia Williams",
    email: "p.williams@email.com",
    phone: "(202) 555-0219",
    date: "2026-07-15",
    time: "11:00 AM",
    status: "completed",
    notes: "Toured private suites and gardens.",
  },
  {
    name: "James Morrison",
    email: "j.morrison@email.com",
    phone: "(202) 555-0265",
    date: "2026-07-22",
    time: "3:00 PM",
    status: "pending",
    notes: "Wife requires mobility and rehab support.",
  },
  {
    name: "Susan Baker",
    email: "s.baker@email.com",
    phone: "(202) 555-0301",
    date: "2026-07-16",
    time: "9:00 AM",
    status: "cancelled",
    notes: "Rescheduled to next month.",
  },
];

const messages = [
  {
    firstName: "Linda",
    lastName: "Garcia",
    email: "linda.g@email.com",
    phone: "(202) 555-0142",
    message:
      "Hello, I am interested in learning about your memory care services for my father who has been recently diagnosed with Alzheimer's. Could you send me information about pricing and availability?",
    date: new Date("2026-07-15T09:23:00"),
    read: false,
  },
  {
    firstName: "Michael",
    lastName: "Davis",
    email: "m.davis@email.com",
    phone: "(202) 555-0198",
    message:
      "We toured your facility last week and were very impressed. We'd like to proceed with the admission process for my mother. What are the next steps?",
    date: new Date("2026-07-14T14:12:00"),
    read: true,
  },
  {
    firstName: "Jennifer",
    lastName: "Wilson",
    email: "j.wilson@email.com",
    phone: "(202) 555-0213",
    message:
      "Do you offer respite care services? My family needs temporary care for our grandmother while we travel. She would need approximately two weeks of care starting in August.",
    date: new Date("2026-07-13T11:45:00"),
    read: false,
  },
  {
    firstName: "David",
    lastName: "Lee",
    email: "d.lee@email.com",
    phone: "(202) 555-0256",
    message:
      "I am a registered nurse and would like to inquire about career opportunities at your facility. I have five years of experience in elder care. Is there an HR contact I can reach?",
    date: new Date("2026-07-12T16:30:00"),
    read: true,
  },
  {
    firstName: "Angela",
    lastName: "Martinez",
    email: "a.martinez@email.com",
    phone: "(202) 555-0289",
    message:
      "Thank you for the wonderful care you provided for my aunt during her stay. The staff was incredibly kind and professional. We would love to write a testimonial.",
    date: new Date("2026-07-11T08:15:00"),
    read: true,
  },
];

const services = [
  {
    title: "24/7 Attentive Care",
    description:
      "Our licensed caregivers are awake and available around the clock, providing absolute peace of mind for both residents and their families.",
    icon: "🛡️",
    order: 1,
  },
  {
    title: "Medication Management",
    description:
      "Strict, RN-supervised protocols for medication administration, handling prescription refills and coordinating with pharmacies and physicians.",
    icon: "💊",
    order: 2,
  },
  {
    title: "Personal Hygiene",
    description:
      "Respectful assistance with activities of daily living including bathing, grooming, dressing, and incontinence care.",
    icon: "🛁",
    order: 3,
  },
  {
    title: "Nutritional Diet",
    description:
      "Three delicious, balanced meals and snacks daily accommodating specialized diets including diabetic, low-sodium, and allergy-specific requirements.",
    icon: "🍽️",
    order: 4,
  },
  {
    title: "Memory & Dementia Care",
    description:
      "Secure, structured environment designed to minimize confusion and anxiety through cognitive therapies, familiar routines, and sensory activities.",
    icon: "🧠",
    order: 5,
  },
  {
    title: "Mobility & Rehab Support",
    description:
      "Coordination with visiting physical and occupational therapists, featuring zero-entry showers, widened doorways, and safety rails.",
    icon: "🏃",
    order: 6,
  },
];

const BASE = "https://www.flowerafh.com/assets/images";

const galleryImages = [
  { src: `${BASE}/living-space-open-plan-01.webp`, alt: "Spacious open plan living area", category: "Living" },
  { src: `${BASE}/kitchen-modern-appliances.webp`, alt: "Modern kitchen with stainless steel", category: "Kitchen" },
  { src: `${BASE}/bedroom-care-bed-01.webp`, alt: "Private bedroom suite", category: "Bedrooms" },
  { src: `${BASE}/bathroom-accessible-shower.webp`, alt: "Accessible walk-in shower", category: "Bathrooms" },
  { src: `${BASE}/outdoor-patio-deck.webp`, alt: "Outdoor patio dining area", category: "Outdoor" },
  { src: `${BASE}/dining-table-setting.webp`, alt: "Dining table set for dinner", category: "Dining" },
  { src: `${BASE}/living-room-wide-01.webp`, alt: "Spacious living room", category: "Living" },
  { src: `${BASE}/kitchen-island-counter.webp`, alt: "Kitchen island counter", category: "Kitchen" },
  { src: `${BASE}/bedroom-sunflower-01.webp`, alt: "Cozy bedroom with sunflower decor", category: "Bedrooms" },
  { src: `${BASE}/exterior-front-entrance.webp`, alt: "Welcoming front entrance", category: "Outdoor" },
  { src: `${BASE}/activity-room.webp`, alt: "Activity and relaxation room", category: "Living" },
  { src: `${BASE}/backyard-fenced.webp`, alt: "Private fenced backyard", category: "Outdoor" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   SEED FUNCTION
   ═══════════════════════════════════════════════════════════════════════════ */

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB for seeding");

    // Clear existing data
    await User.deleteMany({});
    await TourRequest.deleteMany({});
    await Message.deleteMany({});
    await Service.deleteMany({});
    await GalleryImage.deleteMany({});
    console.log("🗑️  Cleared all existing data");

    // Seed admin user (password will be hashed by the pre-save hook)
    await User.create(adminUser);
    console.log("👤 Admin user created (username: 1stgate, password: 1stGate!AdminKey)");

    // Seed tours
    await TourRequest.insertMany(tours);
    console.log(`📅 Seeded ${tours.length} tour requests`);

    // Seed messages
    await Message.insertMany(messages);
    console.log(`✉️  Seeded ${messages.length} messages`);

    // Seed services
    await Service.insertMany(services);
    console.log(`🔧 Seeded ${services.length} services`);

    // Seed gallery
    await GalleryImage.insertMany(galleryImages);
    console.log(`🖼️  Seeded ${galleryImages.length} gallery images`);

    console.log("\n🎉 Database seeded successfully!\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  }
};

seedDB();
