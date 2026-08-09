import { config } from "dotenv";
import path from "path";
config({ path: path.join(__dirname, "..", ".env.local") });
import fs from "fs";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { v2 as cloudinary } from "cloudinary";
import type { CategoryInput } from "../types/category";
import type { StandaloneProductInput } from "../types/product";
import type { ContactContent, ContentBlockInput, HeroContent } from "../types/content";
import { restoreFromBackup } from "./restore-data";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;

if (!projectId || !clientEmail || !privateKey) {
  console.error(
    "Missing Firebase Admin env vars. Please set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY in .env.local"
  );
  process.exit(1);
}

if (!cloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
  console.error(
    "Missing Cloudinary env vars. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env.local"
  );
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
});

const db = getFirestore();
const ASSETS_DIR = path.join(__dirname, "..", "public", "assets");

async function uploadLocalImage(localPath: string, destination: string): Promise<string> {
  const publicId = destination.replace(/\.[^/.]+$/, "");
  const result = await cloudinary.uploader.upload(localPath, {
    public_id: publicId,
    folder: "hantaran-katalog",
    overwrite: true,
  });
  return result.secure_url;
}

async function uploadCategoryImages(slug: string, count: number): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 1; i <= count; i++) {
    const localPath = path.join(ASSETS_DIR, "categories", slug, `${i}.jpg`);
    urls.push(await uploadLocalImage(localPath, `categories/${slug}/${i}.jpg`));
  }
  return urls;
}

async function uploadSingle(relDir: string, filename: string): Promise<string> {
  const localPath = path.join(ASSETS_DIR, relDir, filename);
  return uploadLocalImage(localPath, `${relDir}/${filename}`);
}

const ALL_IN_BULLETS = [
  "Harga sudah include All in (Jasa Hias, Sewa Box, Bunga, Aksesoris dll)",
  "Bebas request warna bunga",
  "Sewa paket diatas 5 box free ringbox/money box",
];

const PRICE_LABELS: Record<string, string> = {
  sewa5: "Sewa 5 Box",
  sewa7: "Sewa 7 Box",
  sewa8: "Sewa 8 Box",
  perBox: "Sewa Per-Box",
  beli4: "Beli Paket 4 Box",
  beli8: "Beli Paket 8 Box",
};

function pricing(entries: Record<string, number>): CategoryInput["pricing"] {
  return Object.entries(entries).map(([key, price]) => ({
    id: key,
    label: PRICE_LABELS[key] ?? key,
    price,
  }));
}

const CATEGORIES: { slug: string; imageCount: number; data: Omit<CategoryInput, "images"> }[] = [
  {
    slug: "luxury-pearl",
    imageCount: 4,
    data: {
      name: "Luxury Pearl",
      slug: "luxury-pearl",
      order: 1,
      coverNote: "Tutup akrilik lengkung",
      featureBullets: ["Tutup akrilik lengkung", ...ALL_IN_BULLETS],
      pricing: pricing({ sewa5: 335000, sewa8: 550000, perBox: 75000 }),
      isActive: true,
    },
  },
  {
    slug: "luxury-crystal",
    imageCount: 4,
    data: {
      name: "Luxury Crystal",
      slug: "luxury-crystal",
      order: 2,
      coverNote: "Tutup akrilik lengkung",
      featureBullets: ["Tutup akrilik lengkung", ...ALL_IN_BULLETS],
      pricing: pricing({ sewa5: 335000, sewa8: 550000, perBox: 75000 }),
      isActive: true,
    },
  },
  {
    slug: "luxury-picasso",
    imageCount: 4,
    data: {
      name: "Luxury Picasso",
      slug: "luxury-picasso",
      order: 3,
      coverNote: "Tutup akrilik lengkung",
      featureBullets: ["Tutup akrilik lengkung", ...ALL_IN_BULLETS],
      pricing: pricing({ sewa5: 300000, sewa8: 450000, perBox: 65000 }),
      isActive: true,
    },
  },
  {
    slug: "gardenia-series",
    imageCount: 4,
    data: {
      name: "Gardenia Series",
      slug: "gardenia-series",
      order: 4,
      coverNote: "Tutup akrilik persegi",
      featureBullets: ["Tutup akrilik persegi", ...ALL_IN_BULLETS],
      pricing: pricing({ sewa5: 300000, sewa8: 450000, perBox: 65000 }),
      isActive: true,
    },
  },
  {
    slug: "classic-white",
    imageCount: 4,
    data: {
      name: "Classic White",
      slug: "classic-white",
      order: 5,
      coverNote: "Tutup akrilik persegi",
      featureBullets: ["Tutup akrilik persegi", ...ALL_IN_BULLETS],
      pricing: pricing({ sewa5: 275000, sewa8: 400000, perBox: 60000 }),
      isActive: true,
    },
  },
  {
    slug: "classic-silver",
    imageCount: 4,
    data: {
      name: "Classic Silver",
      slug: "classic-silver",
      order: 6,
      coverNote: "Tutup akrilik persegi",
      featureBullets: ["Tutup akrilik persegi", ...ALL_IN_BULLETS],
      pricing: pricing({ sewa5: 275000, sewa8: 400000, perBox: 60000 }),
      isActive: true,
    },
  },
  {
    slug: "classic-brown",
    imageCount: 3,
    data: {
      name: "Classic Brown",
      slug: "classic-brown",
      order: 7,
      coverNote: "Tutup akrilik persegi",
      featureBullets: ["Tutup akrilik persegi", ...ALL_IN_BULLETS],
      pricing: pricing({ sewa5: 275000, sewa8: 400000, perBox: 60000 }),
      isActive: true,
    },
  },
  {
    slug: "classic-wood",
    imageCount: 4,
    data: {
      name: "Classic Wood",
      slug: "classic-wood",
      order: 8,
      coverNote: "Tutup akrilik persegi",
      featureBullets: ["Tutup akrilik persegi", ...ALL_IN_BULLETS],
      pricing: pricing({ sewa5: 275000, sewa8: 400000, perBox: 60000 }),
      isActive: true,
    },
  },
  {
    slug: "classic-gold",
    imageCount: 4,
    data: {
      name: "Classic Gold",
      slug: "classic-gold",
      order: 9,
      coverNote: "Tutup akrilik persegi",
      featureBullets: ["Tutup akrilik persegi", ...ALL_IN_BULLETS],
      pricing: pricing({ sewa5: 275000, sewa8: 400000, perBox: 60000 }),
      isActive: true,
    },
  },
  {
    slug: "hidden-series",
    imageCount: 3,
    data: {
      name: "Hidden Series",
      slug: "hidden-series",
      order: 10,
      coverNote: "Menggunakan tray wood",
      featureBullets: [
        "Menggunakan tray wood",
        "Harga sudah include All in (Jasa Hias, Sewa Box, Bunga, Aksesoris dll)",
        "Bebas request warna bunga/kain",
        "Sewa paket diatas 5 box free ringbox/money box",
      ],
      pricing: pricing({ sewa7: 350000, perBox: 55000 }),
      isActive: true,
    },
  },
  {
    slug: "rattan-series",
    imageCount: 4,
    data: {
      name: "Rattan Series",
      slug: "rattan-series",
      order: 11,
      coverNote: "Ditutup dengan kain tile",
      featureBullets: [
        "Ditutup dengan kain tile",
        "Harga sudah include All in (Jasa Hias, Sewa Box, Bunga, Aksesoris dll)",
        "Bebas request warna bunga/kain",
        "Sewa paket diatas 5 box free ringbox/money box",
      ],
      pricing: pricing({ sewa5: 200000, sewa8: 320000, perBox: 45000 }),
      isActive: true,
    },
  },
  {
    slug: "box-mika",
    imageCount: 4,
    data: {
      name: "Box Mika (Beli/Hak Milik)",
      slug: "box-mika",
      order: 12,
      coverNote: "Tutup box terbuat dari mika 0,25m",
      featureBullets: [
        "Tutup box terbuat dari mika 0,25m",
        "Harga sudah All In (Jasa Hias, Box, Bunga, Aksesoris dll)",
        "Sudah menjadi hak milik, tidak perlu dikembalikan",
        "Sewa paket diatas 5 box free ringbox/money box",
      ],
      pricing: pricing({ beli4: 350000, beli8: 600000 }),
      isActive: true,
    },
  },
];

const STANDALONE_PRODUCTS: {
  filename: string;
  data: Omit<StandaloneProductInput, "image">;
}[] = [
  {
    filename: "ring-box-garden.jpg",
    data: { name: "Ring Box Garden", price: 50000, category: "ring-jewelry", order: 1, isActive: true },
  },
  {
    filename: "ring-box-cristal.jpg",
    data: { name: "Ring Box Cristal", price: 50000, category: "ring-jewelry", order: 2, isActive: true },
  },
  {
    filename: "jewelry-set-clasic.jpg",
    data: { name: "Jewelry Set Clasic", price: 65000, category: "ring-jewelry", order: 3, isActive: true },
  },
  {
    filename: "jewelry-set-gardenia.jpg",
    data: { name: "Jewelry Set Gardenia", price: 75000, category: "ring-jewelry", order: 4, isActive: true },
  },
  {
    filename: "jewelry-set-pearl.jpg",
    data: { name: "Jewelry Set Pearl", price: 75000, category: "ring-jewelry", order: 5, isActive: true },
  },
  {
    filename: "jewelry-set-cristal.jpg",
    data: { name: "Jewelry Set Cristal", price: 80000, category: "ring-jewelry", order: 6, isActive: true },
  },
  {
    filename: "money-box-1.jpg",
    data: { name: "Money Box", price: null, category: "money-box", order: 1, isActive: true },
  },
  {
    filename: "money-box-2.jpg",
    data: { name: "Money Box (Varian Pearl)", price: null, category: "money-box", order: 2, isActive: true },
  },
  {
    filename: "hias-bedcover.jpg",
    data: { name: "Hias Bedcover", price: 35000, category: "other", order: 1, isActive: true },
  },
];

const TERMS_POINTS = [
  "Membayar DP minimal Rp. 100.000 untuk booking tanggal acara",
  "Jika melakukan pembatalan sepihak, maka DP akan hangus",
  "Reschedule tanggal minimal H-2 minggu (selama ketersediaan box masih ada)",
  "Barang yang akan dihias diantar minimal H-14 dan paling lambat H-10 dari tanggal acara",
  "Pelunasan dibayarkan sebelum pengambilan box seserahan",
  "Pengambilan box yang sudah di hias bisa diambil H-1 / H-2 sebelum acara dengan menitipkan kartu identitas berupa kartu SIM / KTP dari klien penyewa sebagai jaminan bilamana ada kerusakan box dan tutup akrilik",
  "Pengembalian box seserahan yang sudah di sewa maksimal H+2 setelah acara",
  "Jika ada keterlambatan pengembalian box dan tutup akrilik lebih dari H+2 akan dikenakan denda sebesar Rp. 25.000 perbox /Hari",
  "Setiap pemesanan minimal 5 box free sewa ringbox (tempat cincin)",
  "Kerusakan atau kehilangan box maupun properti menjadi tanggung jawab klien dengan denda sesuai dengan nilai barang",
];

const RETURN_GUIDE_POINTS = [
  "Saat pengembalian box harap box tetap pada posisi semula (seperti digambar atas)",
  "Bunga & Properti tetap pada posisinya (tidak di preteli atau dicopot untuk memudahkan pengecekan)",
  "Tutup akrilik & box dalam satu kesatuan",
  "Tidak ditumpuk atau dicampur dalam tumpukan box dan tutup",
];

const CONTACT: ContactContent = {
  whatsapp: "0813 3024 7617",
  instagram: "alin.hantaran",
  tiktok: "alin hantaran",
  address: "Morowudi RT 1 RW 3 Cerme Gresik",
  mapsLabel: "Google Maps Alin Hantaran",
  mapsUrl: "https://maps.app.goo.gl/YUrbZ2APqzDJDZpZ6",
  hours: "Buka Senin - Jumat, 09.00 s/d 18.00",
};

const HERO: HeroContent = {
  tagline: "Catalog & Pricelist",
  title: "Hantaran",
  subtitle: "Sewa box seserahan pernikahan.",
  catalogButtonLabel: "Lihat Katalog",
  whatsappButtonLabel: "Hubungi Kami",
  whatsappMessage: "Halo, saya mau tanya-tanya soal Hantaran",
};

async function main() {
  const latestBackupPath = path.join(__dirname, "backups", "latest.json");
  if (fs.existsSync(latestBackupPath)) {
    console.log(`Ditemukan backup di ${latestBackupPath} — restore data dari backup, bukan seed data demo.`);
    await restoreFromBackup(latestBackupPath);
    return;
  }

  console.log("Tidak ada backup ditemukan — menjalankan seed data demo.");
  console.log("Uploading category images & seeding categories...");
  for (const cat of CATEGORIES) {
    const images = await uploadCategoryImages(cat.slug, cat.imageCount);
    await db.collection("categories").doc(cat.slug).set({ ...cat.data, images });
    console.log(`  ✓ ${cat.data.name} (${images.length} images)`);
  }

  console.log("Uploading standalone product images & seeding products...");
  for (const p of STANDALONE_PRODUCTS) {
    const image = await uploadSingle("products", p.filename);
    await db.collection("standaloneProducts").add({ ...p.data, image });
    console.log(`  ✓ ${p.data.name}`);
  }

  console.log("Seeding content blocks...");
  const guideImage = await uploadSingle("guide", "return-box.jpg");
  const contentBlocks: ContentBlockInput[] = [
    { title: "WAJIB DIBACA! Syarat & Ketentuan", points: TERMS_POINTS, order: 0 },
    {
      title: "WAJIB DIBACA! Pengembalian Box Seserahan",
      points: RETURN_GUIDE_POINTS,
      image: guideImage,
      order: 1,
    },
  ];
  for (const block of contentBlocks) {
    await db.collection("contentBlocks").add(block);
  }

  console.log("Seeding contact info...");
  await db.collection("siteContent").doc("contact").set(CONTACT);

  console.log("Seeding hero content...");
  await db.collection("siteContent").doc("hero").set(HERO);

  console.log("Done seeding.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
