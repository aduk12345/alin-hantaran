export async function uploadImage(file: File, path: string): Promise<string> {
  const folder = path.split("/").slice(0, -1).join("/") || "hantaran-katalog";

  const signRes = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  });
  if (!signRes.ok) throw new Error("Gagal mendapatkan izin upload");
  const { signature, timestamp, apiKey, cloudName, folder: signedFolder } = await signRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", signedFolder);

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });
  if (!uploadRes.ok) throw new Error("Upload gambar gagal");
  const data = await uploadRes.json();
  return data.secure_url as string;
}

export async function deleteImageByUrl(url: string): Promise<void> {
  try {
    await fetch("/api/cloudinary/destroy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  } catch {
    // best-effort cleanup, ignore failures
  }
}
