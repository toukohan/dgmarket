import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="bg-page">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Buy & sell disc golf discs
          <span className="block text-primary">
            without the hassle
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Disc Golf Market is a simple marketplace for buying and selling
          new and used discs directly between players.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/products"
            className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition"
          >
            Browse products
          </Link>

          <Link
            href={process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "http://localhost:5173"}
            className="rounded-md border border-white/30 px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/10 transition"
          >
            Sell your discs
          </Link>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-7xl px-4 py-16 grid gap-8 md:grid-cols-3">
        <ValueCard
          title="Player to player"
          text="Deal directly with other disc golfers. No middlemen, no platform lock-in."
        />
        <ValueCard
          title="New & used discs"
          text="Find rare molds, backups, or affordable used discs from real players."
        />
        <ValueCard
          title="Simple & transparent"
          text="No complicated checkout flows. Agree on deals the way disc golfers already do."
        />
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold">
          Ready to find your next disc?
        </h2>

        <Link
          href="/products"
          className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition"
        >
          View all products
        </Link>
      </section>
    </main>
  );
}

function ValueCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-white p-6 text-left">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {text}
      </p>
    </div>
  );
}
