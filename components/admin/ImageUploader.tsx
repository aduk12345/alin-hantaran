"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { uploadImage, deleteImageByUrl } from "@/lib/storage";

export function ImageUploader({
  images,
  onChange,
  pathPrefix,
  multiple = true,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  pathPrefix: string;
  multiple?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const path = `${pathPrefix}/${Date.now()}-${file.name}`;
        uploaded.push(await uploadImage(file, path));
      }
      onChange(multiple ? [...images, ...uploaded] : uploaded);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove(url: string) {
    onChange(images.filter((i) => i !== url));
    await deleteImageByUrl(url);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((src) => (
          <div key={src} className="relative h-24 w-24 overflow-hidden rounded-lg border border-gold-light">
            <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(src)}
              className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 text-xs text-white"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-24 w-24 items-center justify-center rounded-lg border border-dashed border-gold-light text-xs text-ink/60 hover:bg-blush/40"
        >
          {uploading ? "..." : "+ Upload"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
