import { config } from "dotenv";
import path from "path";
config({ path: path.join(__dirname, "..", ".env.local") });
import fs from "fs";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error(
    "Missing Firebase Admin env vars. Please set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY in .env.local"
  );
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

const db = getFirestore();

const PRICE_LABELS: Record<string, string> = {
  sewa5: "Sewa 5 Box",
  sewa7: "Sewa 7 Box",
  sewa8: "Sewa 8 Box",
  perBox: "Sewa Per-Box",
  beli4: "Beli Paket 4 Box",
  beli8: "Beli Paket 8 Box",
};

function isOldPricingShape(pricing: unknown): pricing is Record<string, number> {
  return typeof pricing === "object" && pricing !== null && !Array.isArray(pricing);
}

async function main() {
  const snap = await db.collection("categories").get();
  console.log(`Ditemukan ${snap.size} dokumen kategori.`);

  const backup: Record<string, unknown> = {};
  const updates: { id: string; name: string; pricing: unknown }[] = [];

  for (const doc of snap.docs) {
    const data = doc.data();
    backup[doc.id] = data;

    if (!isOldPricingShape(data.pricing)) {
      console.log(`- ${data.name ?? doc.id}: sudah format baru, dilewati.`);
      continue;
    }

    const newPricing = Object.entries(data.pricing)
      .filter(([, value]) => value != null)
      .map(([key, value]) => ({
        id: key,
        label: (data.pricingLabels && data.pricingLabels[key]) || PRICE_LABELS[key] || key,
        price: Number(value),
      }));

    updates.push({ id: doc.id, name: data.name ?? doc.id, pricing: newPricing });
  }

  if (updates.length === 0) {
    console.log("Tidak ada dokumen dengan format lama. Tidak ada yang diubah.");
    return;
  }

  const backupPath = path.join(__dirname, `pricing-backup-${Date.now()}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
  console.log(`Backup data lama disimpan di: ${backupPath}`);

  for (const update of updates) {
    await db.collection("categories").doc(update.id).update({
      pricing: update.pricing,
      pricingLabels: FieldValue.delete(),
    });
    console.log(`- ${update.name}: dimigrasikan (${(update.pricing as unknown[]).length} harga).`);
  }

  console.log(`Selesai. ${updates.length} kategori dimigrasikan.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
