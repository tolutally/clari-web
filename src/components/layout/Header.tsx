import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full flex justify-center py-3 z-40 relative">
      <Link href="#" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
        <Image src="/clarivue-logo-v1.png" alt="Clarivue logo" width={160} height={40} priority />
      </Link>
    </header>
  );
}
