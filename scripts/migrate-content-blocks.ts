import { config } from "dotenv";
import path from "path";
config({ path: path.join(__dirname, "..", ".env.local") });
import fs from "fs";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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

async function main() {
  const [termsSnap, guideSnap] = await Promise.all([
    db.collection("siteContent").doc("terms").get(),
    db.collection("siteContent").doc("returnGuide").get(),
  ]);

  const backup: Record<string, unknown> = {};
  if (termsSnap.exists) backup["siteContent/terms"] = termsSnap.data();
  if (guideSnap.exists) backup["siteContent/returnGuide"] = guideSnap.data();

  if (Object.keys(backup).length === 0) {
    console.log("Tidak ada dokumen siteContent/terms atau siteContent/returnGuide. Tidak ada yang dimigrasikan.");
    return;
  }

  const backupPath = path.join(__dirname, `content-blocks-backup-${Date.now()}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
  console.log(`Backup data lama disimpan di: ${backupPath}`);

  const existing = await db.collection("contentBlocks").get();
  let order = existing.size;

  if (termsSnap.exists) {
    const data = termsSnap.data() as { title: string; points: string[] };
    await db.collection("contentBlocks").add({
      title: data.title,
      points: data.points ?? [],
      order: order++,
    });
    console.log(`- Dimigrasikan: ${data.title}`);
  }

  if (guideSnap.exists) {
    const data = guideSnap.data() as { title: string; points: string[]; image?: string };
    const block: Record<string, unknown> = {
      title: data.title,
      points: data.points ?? [],
      order: order++,
    };
    if (data.image) block.image = data.image;
    await db.collection("contentBlocks").add(block);
    console.log(`- Dimigrasikan: ${data.title}`);
  }

  if (termsSnap.exists) await db.collection("siteContent").doc("terms").delete();
  if (guideSnap.exists) await db.collection("siteContent").doc("returnGuide").delete();

  console.log("Selesai. siteContent/terms dan siteContent/returnGuide sudah dipindahkan ke koleksi contentBlocks.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
