export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-transparent px-6 py-16 md:py-20">
      <section className="grid w-full max-w-5xl grid-cols-1 items-center gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.18em] text-primary">
            Garasjemegling, forenklet
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-foreground md:text-5xl">
            Finn eller selg garasje med bud i sanntid
          </h1>
          <p className="text-base text-muted-foreground md:max-w-xl">
            Registrer deg som kjøper eller selger. Legg ut garasjen, sett budfrist, og følg bud
            direkte.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              className="rounded-lg bg-gradient-to-r from-primary to-primary/80 px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:translate-y-[-2px] hover:shadow-xl"
              href="/sell/new"
            >
              Opprett annonse
            </a>
            <a
              className="rounded-lg border border-border/80 bg-white/5 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-border hover:bg-white/8"
              href="/listings"
            >
              Se alle garasjer
            </a>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="card w-full max-w-md rounded-2xl border border-border/80 bg-gradient-to-br from-card to-card/80 p-6 shadow-[0_24px_80px_rgba(7,12,28,0.55)] backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-primary">Budrunde</p>
                <h3 className="mt-1 text-xl font-semibold text-foreground">Sentrum P2</h3>
              </div>
              <span className="pill">Pågår</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Siste bud</p>
              <p className="text-3xl font-bold text-foreground">1 250 000 kr</p>
              <p className="text-sm text-muted-foreground">Budfrist: 12. feb 2026, 18:00</p>
            </div>
            <div className="mt-6">
              <a
                className="block w-full rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground shadow-lg transition hover:translate-y-[-1px] hover:shadow-xl"
                href="/listings/sentrum-p2"
              >
                Legg inn bud
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
export default function Home() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-transparent px-6 py-16 md:py-20">
			<section className="grid w-full max-w-5xl grid-cols-1 items-center gap-10 md:grid-cols-2">
				<div className="flex flex-col gap-4">
					<p className="text-xs uppercase tracking-[0.18em] text-primary">
						Garasjemegling, forenklet
					</p>
					<h1 className="text-3xl font-semibold leading-tight text-foreground md:text-5xl">
						Finn eller selg garasje med bud i sanntid
					</h1>
					<p className="text-base text-muted-foreground md:max-w-xl">
						Registrer deg som kjøper eller selger. Legg ut garasjen, sett budfrist, og følg bud
						direkte.
					</p>
					<div className="flex flex-wrap gap-3 pt-2">
						<a
							className="rounded-lg bg-gradient-to-r from-primary to-primary/80 px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:translate-y-[-2px] hover:shadow-xl"
							href="/sell/new"
						>
							Opprett annonse
						</a>
						<a
							className="rounded-lg border border-border/80 bg-white/5 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-border hover:bg-white/8"
							href="/listings"
						>
							Se alle garasjer
						</a>
					</div>
				</div>
				<div className="flex justify-end">
					<div className="card w-full max-w-md rounded-2xl border border-border/80 bg-gradient-to-br from-card to-card/80 p-6 shadow-[0_24px_80px_rgba(7,12,28,0.55)] backdrop-blur">
						<div className="mb-4 flex items-center justify-between">
							<div>
								<p className="text-xs uppercase tracking-wide text-primary">Budrunde</p>
								<h3 className="mt-1 text-xl font-semibold text-foreground">Sentrum P2</h3>
							</div>
							<span className="pill">Pågår</span>
						</div>
						<div className="space-y-2">
							<p className="text-sm text-muted-foreground">Siste bud</p>
							<p className="text-3xl font-bold text-foreground">1 250 000 kr</p>
							<p className="text-sm text-muted-foreground">Budfrist: 12. feb 2026, 18:00</p>
						</div>
						<div className="mt-6">
							<a
								className="block w-full rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground shadow-lg transition hover:translate-y-[-1px] hover:shadow-xl"
								href="/listings/sentrum-p2"
							>
								Legg inn bud
							</a>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
