import Link from "next/link";

export function Header() {
  return (
    <header className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center gap-6 justify-between">
      <Link
          href="/"
          className="font-semibold text-xl text-white"
        >
          Disc Golf Market
        </Link>

        <nav className="flex gap-6 text-l">
          <Link href="/products" className="hover:text-underline">
            Products
          </Link>
          <Link
            href={process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "http://localhost:5173"}
          >
            Login
          </Link>

        </nav>

      </div>
    </header>
  );
}
