import Image from "next/image";
import Link from "next/link";

export function Logo({ size = 90, className }: { size?: number; className?: string }) {
  return (
    <Link href="/" className="inline-flex flex-col items-center">
      <Image
        src="/assets/decor/logo-ah.png"
        alt="Alin Hantaran"
        width={900}
        height={588}
        style={{ width: `clamp(44px, 14vw, ${size}px)`, height: "auto" }}
        className={className}
        priority
      />
    </Link>
  );
}
