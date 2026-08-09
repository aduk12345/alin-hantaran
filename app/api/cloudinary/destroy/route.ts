import { NextRequest, NextResponse } from "next/server";
import { cloudinary, extractPublicId } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  if (!request.cookies.has("session")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url } = await request.json();
  const publicId = url ? extractPublicId(url) : null;
  if (!publicId) {
    return NextResponse.json({ ok: true });
  }

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary destroy failed:", err);
  }

  return NextResponse.json({ ok: true });
}
