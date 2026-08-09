import { NextRequest, NextResponse } from "next/server";
import { signUploadParams } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  if (!request.cookies.has("session")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { folder } = await request.json();
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = { timestamp, folder: folder || "hantaran-katalog" };
  const signature = signUploadParams(paramsToSign);

  return NextResponse.json({
    signature,
    timestamp,
    folder: paramsToSign.folder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
}
