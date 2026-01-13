import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { GarageCarouselItem } from "@/types";
import { RealtimeBidCarousel } from "./components/RealtimeBidCarousel";

export default async function Home() {
	const supabase = await getSupabaseServerClient();

	let initialGarages: GarageCarouselItem[] = [];

	if (supabase) {
		// Fetch active garages
		const { data: garages } = await supabase
			.from("garages")
			.select("id, title, address, start_price, bid_end_at")
			.gt("bid_end_at", new Date().toISOString())
			.order("created_at", { ascending: false })
			.limit(10);

		if (garages?.length) {
			const garageIds = garages.map((g) => g.id);

			// Fetch highest bids and latest bid times
			const { data: bids } = await supabase
				.from("bids")
				.select("garage_id, amount, created_at")
				.in("garage_id", garageIds)
				.order("amount", { ascending: false });

			// Build bid info map
			const bidInfoMap = new Map<string, { highest: number; lastBidAt: string }>();
			for (const bid of bids ?? []) {
				const existing = bidInfoMap.get(bid.garage_id);
				if (!existing) {
					bidInfoMap.set(bid.garage_id, {
						highest: Number(bid.amount),
						lastBidAt: bid.created_at,
					});
				} else {
					// Update lastBidAt if this bid is more recent
					if (new Date(bid.created_at) > new Date(existing.lastBidAt)) {
						existing.lastBidAt = bid.created_at;
					}
				}
			}

			// Build garage list with bid info, sorted by most recent bid first
			initialGarages = garages
				.map((g) => {
					const bidInfo = bidInfoMap.get(g.id);
					return {
						id: g.id,
						title: g.title,
						address: g.address,
						startPrice: Number(g.start_price),
						bidEndAt: g.bid_end_at,
						highestBid: bidInfo?.highest ?? null,
						lastBidAt: bidInfo?.lastBidAt ?? null,
					};
				})
				.sort((a, b) => {
					// Sort by most recent bid first, then by garages without bids
					if (!a.lastBidAt && !b.lastBidAt) return 0;
					if (!a.lastBidAt) return 1;
					if (!b.lastBidAt) return -1;
					return new Date(b.lastBidAt).getTime() - new Date(a.lastBidAt).getTime();
				});
		}
	}

	return (
		<main id="main" className="flex min-h-screen flex-col bg-transparent">
			<section className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 md:py-16">
				<div className="grid w-full max-w-5xl grid-cols-1 items-center gap-10 md:grid-cols-2">
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
							<a
								className="rounded-lg border-2 border-primary/50 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/20"
								href="/register"
							>
								Registrer deg
							</a>
						</div>
					</div>
					<div className="flex justify-end">
						<RealtimeBidCarousel initialGarages={initialGarages} />
					</div>
				</div>
			</section>

			<footer className="border-t border-border/40 bg-card/30 py-6">
				<div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
					<p className="text-sm text-muted-foreground">
						© {new Date().getFullYear()} ParkEx. Alle rettigheter forbeholdt.
					</p>
					<nav className="flex gap-6">
						<a
							href="/terms"
							className="text-sm text-muted-foreground transition-colors hover:text-foreground"
						>
							Vilkår for bruk
						</a>
						<a
							href="/privacy"
							className="text-sm text-muted-foreground transition-colors hover:text-foreground"
						>
							Personvern
						</a>
					</nav>
				</div>
			</footer>
		</main>
	);
}
