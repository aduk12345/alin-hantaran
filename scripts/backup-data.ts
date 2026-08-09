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
const BACKUP_DIR = path.join(__dirname, "backups");

async function dumpCollection(name: string) {
  const snap = await db.collection(name).get();
  return snap.docs.map((d) => ({ id: d.id, data: d.data() }));
}

async function main() {
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

  const [categories, standaloneProducts, contentBlocks, contactSnap, heroSnap] =
    await Promise.all([
      dumpCollection("categories"),
      dumpCollection("standaloneProducts"),
      dumpCollection("contentBlocks"),
      db.collection("siteContent").doc("contact").get(),
      db.collection("siteContent").doc("hero").get(),
    ]);

  const backup = {
    createdAt: new Date().toISOString(),
    categories,
    standaloneProducts,
    contentBlocks,
    siteContent: {
      contact: contactSnap.exists ? contactSnap.data() : null,
      hero: heroSnap.exists ? heroSnap.data() : null,
    },
  };

  const stamp = backup.createdAt.replace(/[:.]/g, "-");
  const timestampedPath = path.join(BACKUP_DIR, `backup-${stamp}.json`);
  const latestPath = path.join(BACKUP_DIR, "latest.json");

  fs.writeFileSync(timestampedPath, JSON.stringify(backup, null, 2));
  fs.writeFileSync(latestPath, JSON.stringify(backup, null, 2));

  console.log(`Backup selesai:`);
  console.log(`  - categories: ${categories.length}`);
  console.log(`  - standaloneProducts: ${standaloneProducts.length}`);
  console.log(`  - contentBlocks: ${contentBlocks.length}`);
  console.log(`  - siteContent/contact: ${contactSnap.exists ? "ada" : "kosong"}`);
  console.log(`  - siteContent/hero: ${heroSnap.exists ? "ada" : "kosong"}`);
  console.log(`Disimpan di: ${timestampedPath}`);
  console.log(`(juga di-copy ke ${latestPath} sebagai referensi restore terbaru)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
