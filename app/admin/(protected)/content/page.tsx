"use client";

import { useEffect, useRef, useState } from "react";
import {
  createContentBlock,
  deleteContentBlock,
  getContact,
  getContentBlocks,
  getHero,
  reorderContentBlocks,
  setContact,
  setHero,
  updateContentBlock,
} from "@/lib/firestore";
import { ContactContent, HeroContent } from "@/types/content";
import { BulletListEditor } from "@/components/admin/BulletListEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { DeleteIconButton, EditIconButton } from "@/components/admin/IconButtons";
import { Modal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/Button";

type BlockForm = {
  localId: string;
  id: string | null;
  title: string;
  points: string[];
  image: string;
  saving: boolean;
};

const DEFAULT_HERO: HeroContent = {
  tagline: "Catalog & Pricelist",
  title: "Hantaran",
  subtitle: "Sewa & hias box seserahan dengan tampilan elegan — pilih paket, kami urus semuanya.",
  catalogButtonLabel: "Lihat Katalog",
  whatsappButtonLabel: "Hubungi Kami",
  whatsappMessage: "Halo, saya mau tanya-tanya soal Hantaran",
};

const DEFAULT_CONTACT: ContactContent = {
  whatsapp: "",
  instagram: "",
  tiktok: "",
  address: "",
  mapsLabel: "",
  mapsUrl: "",
  hours: "",
};

const inputClass =
  "mt-1 w-full rounded-lg border border-gold-light/70 px-3 py-2 text-sm outline-none focus:border-rose";

function SectionRow({
  title,
  subtitle,
  onEdit,
}: {
  title: string;
  subtitle: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gold-light bg-white p-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{title}</p>
        <p className="truncate text-xs text-ink/50">{subtitle}</p>
      </div>
      <EditIconButton onClick={onEdit} />
    </div>
  );
}

function ContentBlockRow({
  block,
  index,
  total,
  onEdit,
  onDelete,
  onMove,
}: {
  block: BlockForm;
  index: number;
  total: number;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (direction: "up" | "down") => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gold-light bg-white p-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">
          {block.title.trim() || "Konten baru"}
        </p>
        <p className="text-xs text-ink/50">{block.points.length} poin</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => onMove("up")}
          disabled={index === 0}
          title="Naik"
          aria-label="Naik"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/60 hover:bg-blush/40 disabled:opacity-30"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => onMove("down")}
          disabled={index === total - 1}
          title="Turun"
          aria-label="Turun"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/60 hover:bg-blush/40 disabled:opacity-30"
        >
          ↓
        </button>
        <EditIconButton onClick={onEdit} />
        <DeleteIconButton onClick={onDelete} />
      </div>
    </div>
  );
}

function ContentBlockEditor({
  block,
  onChange,
  onSave,
}: {
  block: BlockForm;
  onChange: (patch: Partial<BlockForm>) => void;
  onSave: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-ink/70">Judul</label>
        <input
          value={block.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Contoh: Syarat & Ketentuan"
          className={inputClass}
        />
      </div>

      <div>
        <p className="mb-2 text-sm text-ink/70">Gambar (opsional)</p>
        <ImageUploader
          images={block.image ? [block.image] : []}
          onChange={(images) => onChange({ image: images[0] ?? "" })}
          pathPrefix="content"
          multiple={false}
        />
      </div>

      <BulletListEditor
        items={block.points}
        onChange={(points) => onChange({ points })}
        placeholder="Poin konten"
      />

      <Button type="button" onClick={onSave} disabled={block.saving}>
        {block.saving ? "Menyimpan..." : "Simpan"}
      </Button>
    </div>
  );
}

export default function AdminContentPage() {
  const [blocks, setBlocks] = useState<BlockForm[]>([]);
  const [editingLocalId, setEditingLocalId] = useState<string | null>(null);
  const nextLocalId = useRef(0);

  const [contact, setContactState] = useState<ContactContent>(DEFAULT_CONTACT);
  const [savingContact, setSavingContact] = useState(false);
  const [editingContact, setEditingContact] = useState(false);

  const [hero, setHeroState] = useState<HeroContent>(DEFAULT_HERO);
  const [savingHero, setSavingHero] = useState(false);
  const [editingHero, setEditingHero] = useState(false);

  useEffect(() => {
    getContentBlocks().then((items) =>
      setBlocks(
        items.map((b) => ({
          localId: b.id,
          id: b.id,
          title: b.title,
          points: b.points,
          image: b.image ?? "",
          saving: false,
        }))
      )
    );
    getContact().then((c) => c && setContactState(c));
    getHero().then((h) => h && setHeroState(h));
  }, []);

  function newLocalId() {
    nextLocalId.current += 1;
    return `new-${nextLocalId.current}`;
  }

  function addBlock() {
    const localId = newLocalId();
    setBlocks((prev) => [
      ...prev,
      { localId, id: null, title: "", points: [], image: "", saving: false },
    ]);
    setEditingLocalId(localId);
  }

  function closeBlockModal() {
    if (editingLocalId) {
      const block = blocks.find((b) => b.localId === editingLocalId);
      if (block && block.id === null) {
        setBlocks((prev) => prev.filter((b) => b.localId !== editingLocalId));
      }
    }
    setEditingLocalId(null);
  }

  function updateBlock(localId: string, patch: Partial<BlockForm>) {
    setBlocks((prev) => prev.map((b) => (b.localId === localId ? { ...b, ...patch } : b)));
  }

  async function persistOrder(list: BlockForm[]) {
    const savedIds = list.map((b) => b.id).filter((id): id is string => id !== null);
    if (savedIds.length > 1) await reorderContentBlocks(savedIds);
  }

  async function moveBlock(localId: string, direction: "up" | "down") {
    const index = blocks.findIndex((b) => b.localId === localId);
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || swapWith < 0 || swapWith >= blocks.length) return;
    const previous = blocks;
    const next = [...blocks];
    [next[index], next[swapWith]] = [next[swapWith], next[index]];
    setBlocks(next);
    try {
      await persistOrder(next);
    } catch (err) {
      console.error("Gagal menyimpan urutan konten:", err);
      setBlocks(previous);
      alert("Gagal menyimpan urutan konten. Coba lagi.");
    }
  }

  async function saveBlock(localId: string) {
    const block = blocks.find((b) => b.localId === localId);
    if (!block) return;
    updateBlock(localId, { saving: true });
    try {
      const input = {
        title: block.title,
        points: block.points.filter((p) => p.trim() !== ""),
        image: block.image || undefined,
      };
      if (block.id) {
        await updateContentBlock(block.id, input);
      } else {
        const order = blocks.filter((b) => b.id !== null).length;
        const newId = await createContentBlock({ ...input, order });
        updateBlock(localId, { id: newId });
      }
      setEditingLocalId(null);
    } finally {
      updateBlock(localId, { saving: false });
    }
  }

  async function deleteBlock(localId: string) {
    const block = blocks.find((b) => b.localId === localId);
    if (!block) return;
    if (block.id) {
      if (!confirm(`Hapus konten "${block.title || "ini"}"?`)) return;
      await deleteContentBlock(block.id);
    }
    setBlocks((prev) => prev.filter((b) => b.localId !== localId));
    if (editingLocalId === localId) setEditingLocalId(null);
  }

  async function handleSaveContact() {
    setSavingContact(true);
    try {
      await setContact(contact);
      setEditingContact(false);
    } finally {
      setSavingContact(false);
    }
  }

  async function handleSaveHero() {
    setSavingHero(true);
    try {
      await setHero(hero);
      setEditingHero(false);
    } finally {
      setSavingHero(false);
    }
  }

  const editingBlock = blocks.find((b) => b.localId === editingLocalId) ?? null;

  return (
    <div className="space-y-10">
      <h1 className="font-serif-title text-2xl text-ink">Kelola Konten</h1>

      <div className="space-y-4">
        <h2 className="font-serif-title text-lg text-ink">Halaman Utama (Hero)</h2>
        <SectionRow title={hero.title} subtitle={hero.tagline} onEdit={() => setEditingHero(true)} />
      </div>

      <div className="space-y-4">
        <h2 className="font-serif-title text-lg text-ink">Info Kontak</h2>
        <SectionRow
          title="Info Kontak"
          subtitle={contact.whatsapp || "Belum diisi"}
          onEdit={() => setEditingContact(true)}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-title text-lg text-ink">Konten Informasi</h2>
          <Button type="button" onClick={addBlock}>
            + Tambah Konten
          </Button>
        </div>
        <p className="text-xs text-ink/50">
          Mis. &quot;Syarat &amp; Ketentuan&quot;, &quot;Panduan Pengembalian Box&quot;, atau
          konten lain — judul dan isinya bebas ditentukan.
        </p>

        {blocks.length === 0 && (
          <p className="rounded-2xl border border-gold-light bg-white p-6 text-center text-sm text-ink/60">
            Belum ada konten.
          </p>
        )}

        {blocks.map((block, index) => (
          <ContentBlockRow
            key={block.localId}
            block={block}
            index={index}
            total={blocks.length}
            onEdit={() => setEditingLocalId(block.localId)}
            onDelete={() => deleteBlock(block.localId)}
            onMove={(direction) => moveBlock(block.localId, direction)}
          />
        ))}
      </div>

      {editingBlock && (
        <Modal title={editingBlock.title.trim() || "Konten baru"} onClose={closeBlockModal}>
          <ContentBlockEditor
            block={editingBlock}
            onChange={(patch) => updateBlock(editingBlock.localId, patch)}
            onSave={() => saveBlock(editingBlock.localId)}
          />
        </Modal>
      )}

      {editingHero && (
        <Modal title="Halaman Utama (Hero)" onClose={() => setEditingHero(false)}>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-ink/70">Label Kecil</label>
              <input
                value={hero.tagline}
                onChange={(e) => setHeroState({ ...hero, tagline: e.target.value })}
                placeholder="Contoh: Catalog & Pricelist"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm text-ink/70">Judul</label>
              <input
                value={hero.title}
                onChange={(e) => setHeroState({ ...hero, title: e.target.value })}
                placeholder="Contoh: Hantaran"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm text-ink/70">Sub Judul</label>
              <textarea
                value={hero.subtitle}
                onChange={(e) => setHeroState({ ...hero, subtitle: e.target.value })}
                rows={3}
                className={inputClass}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-ink/70">Label Tombol Katalog</label>
                <input
                  value={hero.catalogButtonLabel}
                  onChange={(e) => setHeroState({ ...hero, catalogButtonLabel: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm text-ink/70">Label Tombol WhatsApp</label>
                <input
                  value={hero.whatsappButtonLabel}
                  onChange={(e) => setHeroState({ ...hero, whatsappButtonLabel: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-ink/70">Pesan WhatsApp Otomatis</label>
              <input
                value={hero.whatsappMessage}
                onChange={(e) => setHeroState({ ...hero, whatsappMessage: e.target.value })}
                className={inputClass}
              />
            </div>
            <Button type="button" onClick={handleSaveHero} disabled={savingHero}>
              {savingHero ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </Modal>
      )}

      {editingContact && (
        <Modal title="Info Kontak" onClose={() => setEditingContact(false)}>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-ink/70">Nomor WhatsApp</label>
                <input
                  value={contact.whatsapp}
                  onChange={(e) => setContactState({ ...contact, whatsapp: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm text-ink/70">Instagram</label>
                <input
                  value={contact.instagram}
                  onChange={(e) => setContactState({ ...contact, instagram: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm text-ink/70">TikTok</label>
                <input
                  value={contact.tiktok}
                  onChange={(e) => setContactState({ ...contact, tiktok: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm text-ink/70">Label Google Maps</label>
                <input
                  value={contact.mapsLabel}
                  onChange={(e) => setContactState({ ...contact, mapsLabel: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm text-ink/70">Link Google Maps (opsional)</label>
                <input
                  value={contact.mapsUrl ?? ""}
                  onChange={(e) => setContactState({ ...contact, mapsUrl: e.target.value })}
                  placeholder="https://maps.app.goo.gl/..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm text-ink/70">Jam Buka</label>
                <input
                  value={contact.hours}
                  onChange={(e) => setContactState({ ...contact, hours: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm text-ink/70">Alamat</label>
                <input
                  value={contact.address}
                  onChange={(e) => setContactState({ ...contact, address: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
            <Button type="button" onClick={handleSaveContact} disabled={savingContact}>
              {savingContact ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
