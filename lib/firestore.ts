import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  orderBy,
  writeBatch,
} from "firebase/firestore";
import { db, getFirebaseAuth } from "./firebase";
import type { Category, CategoryInput } from "@/types/category";
import type { StandaloneProduct, StandaloneProductInput } from "@/types/product";
import type { ContentBlock, ContentBlockInput, ContactContent, HeroContent } from "@/types/content";

const categoriesCol = collection(db, "categories");
const productsCol = collection(db, "standaloneProducts");
const contentBlocksCol = collection(db, "contentBlocks");

// Firebase Auth restores the signed-in user asynchronously on page load (from
// IndexedDB), while the admin route itself is already unlocked by the
// server-side session cookie. A write fired before this resolves hits
// Firestore before request.auth is populated, failing with
// "Missing or insufficient permissions" even though the user is logged in.
async function ensureAuthReady(): Promise<void> {
  await getFirebaseAuth().authStateReady();
}

async function safe<T>(fallback: T, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error("Firestore read failed:", err);
    return fallback;
  }
}

// ---- Categories ----

export async function getCategories(): Promise<Category[]> {
  return safe([], async () => {
    const snap = await getDocs(query(categoriesCol, orderBy("order", "asc")));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as CategoryInput) }));
  });
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const all = await getCategories();
  return all.find((c) => c.slug === slug) ?? null;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return safe(null, async () => {
    const snap = await getDoc(doc(categoriesCol, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as CategoryInput) };
  });
}

export async function createCategory(input: CategoryInput): Promise<string> {
  await ensureAuthReady();
  const ref = await addDoc(categoriesCol, input);
  return ref.id;
}

export async function updateCategory(id: string, input: Partial<CategoryInput>): Promise<void> {
  await ensureAuthReady();
  await updateDoc(doc(categoriesCol, id), input);
}

export async function deleteCategory(id: string): Promise<void> {
  await ensureAuthReady();
  await deleteDoc(doc(categoriesCol, id));
}

export async function reorderCategories(orderedIds: string[]): Promise<void> {
  await ensureAuthReady();
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    batch.update(doc(categoriesCol, id), { order: index });
  });
  await batch.commit();
}

// ---- Standalone products ----

export async function getStandaloneProducts(): Promise<StandaloneProduct[]> {
  return safe([], async () => {
    const snap = await getDocs(query(productsCol, orderBy("order", "asc")));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as StandaloneProductInput) }));
  });
}

export async function createStandaloneProduct(input: StandaloneProductInput): Promise<string> {
  await ensureAuthReady();
  const ref = await addDoc(productsCol, input);
  return ref.id;
}

export async function updateStandaloneProduct(
  id: string,
  input: Partial<StandaloneProductInput>
): Promise<void> {
  await ensureAuthReady();
  await updateDoc(doc(productsCol, id), input);
}

export async function deleteStandaloneProduct(id: string): Promise<void> {
  await ensureAuthReady();
  await deleteDoc(doc(productsCol, id));
}

export async function reorderStandaloneProducts(orderedIds: string[]): Promise<void> {
  await ensureAuthReady();
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    batch.update(doc(productsCol, id), { order: index });
  });
  await batch.commit();
}

// ---- Content blocks (Syarat & Ketentuan, Panduan, dll — custom & dinamis) ----

export async function getContentBlocks(): Promise<ContentBlock[]> {
  return safe([], async () => {
    const snap = await getDocs(query(contentBlocksCol, orderBy("order", "asc")));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as ContentBlockInput) }));
  });
}

export async function createContentBlock(input: ContentBlockInput): Promise<string> {
  await ensureAuthReady();
  const ref = await addDoc(contentBlocksCol, input);
  return ref.id;
}

export async function updateContentBlock(
  id: string,
  input: Partial<ContentBlockInput>
): Promise<void> {
  await ensureAuthReady();
  await updateDoc(doc(contentBlocksCol, id), input);
}

export async function deleteContentBlock(id: string): Promise<void> {
  await ensureAuthReady();
  await deleteDoc(doc(contentBlocksCol, id));
}

export async function reorderContentBlocks(orderedIds: string[]): Promise<void> {
  await ensureAuthReady();
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    batch.update(doc(contentBlocksCol, id), { order: index });
  });
  await batch.commit();
}

// ---- Site content ----

export async function getContact(): Promise<ContactContent | null> {
  return safe(null, async () => {
    const snap = await getDoc(doc(db, "siteContent", "contact"));
    return snap.exists() ? (snap.data() as ContactContent) : null;
  });
}

export async function setContact(data: ContactContent): Promise<void> {
  await ensureAuthReady();
  await setDoc(doc(db, "siteContent", "contact"), data);
}

export async function getHero(): Promise<HeroContent | null> {
  return safe(null, async () => {
    const snap = await getDoc(doc(db, "siteContent", "hero"));
    return snap.exists() ? (snap.data() as HeroContent) : null;
  });
}

export async function setHero(data: HeroContent): Promise<void> {
  await ensureAuthReady();
  await setDoc(doc(db, "siteContent", "hero"), data);
}
