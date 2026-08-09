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

type BackupDoc = { id: string; data: FirebaseFirestore.DocumentData };
type Backup = {
  createdAt: string;
  categories: BackupDoc[];
  standaloneProducts: BackupDoc[];
  contentBlocks: BackupDoc[];
  siteContent: { contact: FirebaseFirestore.DocumentData | null; hero: FirebaseFirestore.DocumentData | null };
};

export async function restoreFromBackup(backupPath: string) {
  const backup: Backup = JSON.parse(fs.readFileSync(backupPath, "utf8"));

  console.log(`Restore dari backup tanggal ${backup.createdAt}...`);

  for (const [name, docs] of [
    ["categories", backup.categories],
    ["standaloneProducts", backup.standaloneProducts],
    ["contentBlocks", backup.contentBlocks],
  ] as const) {
    for (const doc of docs) {
      await db.collection(name).doc(doc.id).set(doc.data);
    }
    console.log(`  - ${name}: ${docs.length} dokumen direstore`);
  }

  if (backup.siteContent.contact) {
    await db.collection("siteContent").doc("contact").set(backup.siteContent.contact);
    console.log("  - siteContent/contact: direstore");
  }
  if (backup.siteContent.hero) {
    await db.collection("siteContent").doc("hero").set(backup.siteContent.hero);
    console.log("  - siteContent/hero: direstore");
  }

  console.log("Restore selesai.");
}

if (require.main === module) {
  const backupPath = process.argv[2] ?? path.join(__dirname, "backups", "latest.json");
  if (!fs.existsSync(backupPath)) {
    console.error(`File backup tidak ditemukan: ${backupPath}`);
    process.exit(1);
  }
  restoreFromBackup(backupPath).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
