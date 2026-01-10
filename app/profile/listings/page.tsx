import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type GarageWithBidInfo = {
	id: string;
	title: string;
	address: string;
	startPrice: number;
	bidEndAt: string;
	createdAt: string;
	isActive: boolean;
	highestBid: {
		amount: number;
		bidderId: string;
		bidderName: string;
		bidderEmail: string;
		bidderPhone: string | null;
	} | null;
	totalBids: number;
};

export default async function SellerListingsPage() {
	const supabase = await getSupabaseServerClient();
	if (!supabase) {
		return (
			<main
				id="main"
				className="flex min-h-screen items-center justify-center bg-transparent px-4 py-12 sm:px-6 md:py-16"
			>
				<p className="text-sm text-red-400">
					Mangler Supabase konfig (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).
				</p>
			</main>
		);
	}

	const {
		data: { user },
		error: userErr,
	} = await supabase.auth.getUser();

	if (userErr || !user) {
		return (
			<main className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 md:py-16">
				<div className="rounded-xl border border-border/70 bg-card/70 p-6 text-center shadow-lg">
					<p className="text-sm text-muted-foreground">Logg inn for å se annonsene dine.</p>
					<div className="mt-3">
						<Link className="text-sm font-semibold text-primary hover:underline" href="/login">
							Gå til innlogging
						</Link>
					</div>
				</div>
			</main>
		);
	}

	// Check if user is a seller
	const { data: profile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.maybeSingle();

	if (profile?.role !== "seller") {
		return (
			<main className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 md:py-16">
				<div className="rounded-xl border border-border/70 bg-card/70 p-6 text-center shadow-lg">
					<p className="text-sm text-muted-foreground">
						Kun selgere har tilgang til denne siden.
					</p>
					<div className="mt-3">
						<Link className="text-sm font-semibold text-primary hover:underline" href="/profile">
							Gå til profil
						</Link>
					</div>
				</div>
			</main>
		);
	}

	// Fetch all garages owned by this seller
	const { data: garages, error: garagesError } = await supabase
		.from("garages")
		.select("id, title, address, start_price, bid_end_at, created_at")
		.eq("owner_id", user.id)
		.order("created_at", { ascending: false });

	if (garagesError) {
		return (
			<main className="flex min-h-screen items-center justify-center px-6 py-16">
				<p className="text-sm text-red-400">Kunne ikke hente annonser: {garagesError.message}</p>
			</main>
		);
	}

	if (!garages?.length) {
		return (
			<main
				id="main"
				className="flex min-h-screen items-start justify-center bg-transparent px-4 py-12 sm:px-6 md:py-16"
			>
				<div className="w-full max-w-4xl space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs uppercase tracking-[0.18em] text-primary">Mine annonser</p>
							<h1 className="text-2xl font-semibold text-foreground">Dine garasjer</h1>
						</div>
						<Link
							className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
							href="/sell/new"
						>
							Opprett annonse
						</Link>
					</div>
					<p className="text-sm text-muted-foreground">Du har ingen annonser enda.</p>
				</div>
			</main>
		);
	}

	const now = new Date();
	const garageIds = garages.map((g) => g.id);

	// Fetch highest bid for each garage with bidder profile info
	const { data: allBids } = await supabase
		.from("bids")
		.select("garage_id, amount, bidder_id, profiles(first_name, last_name, email, phone)")
		.in("garage_id", garageIds)
		.order("amount", { ascending: false });

	// Fetch bid counts per garage
	const { data: bidCounts } = await supabase
		.from("bids")
		.select("garage_id")
		.in("garage_id", garageIds);

	// Build bid count map
	const bidCountMap = new Map<string, number>();
	for (const bid of bidCounts ?? []) {
		bidCountMap.set(bid.garage_id, (bidCountMap.get(bid.garage_id) ?? 0) + 1);
	}

	// Build highest bid map (first bid per garage is highest due to ordering)
	const highestBidMap = new Map<string, {
		amount: number;
		bidderId: string;
		bidderName: string;
		bidderEmail: string;
		bidderPhone: string | null;
	}>();

	for (const bid of allBids ?? []) {
		if (!highestBidMap.has(bid.garage_id)) {
			const profile = bid.profiles as { first_name: string; last_name: string; email: string; phone: string | null } | null;
			highestBidMap.set(bid.garage_id, {
				amount: Number(bid.amount),
				bidderId: bid.bidder_id,
				bidderName: profile ? `${profile.first_name} ${profile.last_name}` : "Ukjent",
				bidderEmail: profile?.email ?? "Ikke tilgjengelig",
				bidderPhone: profile?.phone ?? null,
			});
		}
	}

	// Build garage info list
	const garagesWithInfo: GarageWithBidInfo[] = garages.map((g) => {
		const isActive = new Date(g.bid_end_at) > now;
		const highestBid = highestBidMap.get(g.id) ?? null;
		const totalBids = bidCountMap.get(g.id) ?? 0;

		return {
			id: g.id,
			title: g.title,
			address: g.address,
			startPrice: Number(g.start_price),
			bidEndAt: g.bid_end_at,
			createdAt: g.created_at,
			isActive,
			highestBid,
			totalBids,
		};
	});

	// Separate active and ended
	const activeListings = garagesWithInfo.filter((g) => g.isActive);
	const endedListings = garagesWithInfo.filter((g) => !g.isActive);

	return (
		<main
			id="main"
			className="flex min-h-screen items-start justify-center bg-transparent px-4 py-12 sm:px-6 md:py-16"
		>
			<div className="w-full max-w-4xl space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-xs uppercase tracking-[0.18em] text-primary">Mine annonser</p>
						<h1 className="text-2xl font-semibold text-foreground">Dine garasjer</h1>
						<p className="text-sm text-muted-foreground">
							{activeListings.length} aktive · {endedListings.length} avsluttede
						</p>
					</div>
					<Link
						className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
						href="/sell/new"
					>
						Opprett annonse
					</Link>
				</div>

				{activeListings.length > 0 && (
					<div className="space-y-3">
						<h2 className="text-sm font-semibold text-foreground">Aktive auksjoner</h2>
						{activeListings.map((g) => (
							<GarageListingCard key={g.id} garage={g} />
						))}
					</div>
				)}

				{endedListings.length > 0 && (
					<div className="space-y-3">
						<h2 className="text-sm font-semibold text-muted-foreground">Avsluttede auksjoner</h2>
						{endedListings.map((g) => (
							<GarageListingCard key={g.id} garage={g} />
						))}
					</div>
				)}
			</div>
		</main>
	);
}

function GarageListingCard({ garage }: { garage: GarageWithBidInfo }) {
	const hasHighestBid = garage.highestBid !== null;
	const isActive = garage.isActive;

	// Styling based on status
	let borderClass = "border-border/70";
	let statusBadge = "";
	let statusBadgeClass = "";

	if (isActive) {
		if (hasHighestBid) {
			borderClass = "border-green-500/30";
			statusBadge = `${garage.totalBids} bud`;
			statusBadgeClass = "bg-green-500/20 text-green-400 border-green-500/30";
		} else {
			statusBadge = "Ingen bud";
			statusBadgeClass = "bg-muted text-muted-foreground border-border";
		}
	} else {
		if (hasHighestBid) {
			statusBadge = "Avsluttet - Solgt";
			statusBadgeClass = "bg-green-500/20 text-green-400 border-green-500/30";
		} else {
			statusBadge = "Avsluttet - Ingen bud";
			statusBadgeClass = "bg-muted text-muted-foreground border-border";
		}
	}

	return (
		<div
			className={`rounded-xl border ${borderClass} bg-card/70 p-4 shadow-md backdrop-blur transition-all`}
		>
			<div className="flex items-start justify-between gap-4">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<p className="text-base font-semibold text-foreground truncate">{garage.title}</p>
						<span
							className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusBadgeClass}`}
						>
							{statusBadge}
						</span>
					</div>
					<p className="text-sm text-muted-foreground truncate">{garage.address}</p>
				</div>
				<Link
					className="shrink-0 text-sm font-semibold text-primary hover:underline"
					href={`/listings/${garage.id}`}
				>
					Se annonse →
				</Link>
			</div>

			<div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
				<div>
					<p className="text-xs text-muted-foreground">Startpris</p>
					<p className="text-sm font-semibold text-foreground">
						{garage.startPrice.toLocaleString("no-NO")} kr
					</p>
				</div>
				<div>
					<p className="text-xs text-muted-foreground">Høyeste bud</p>
					<p className={`text-sm font-semibold ${hasHighestBid ? "text-green-400" : "text-muted-foreground"}`}>
						{hasHighestBid
							? `${garage.highestBid!.amount.toLocaleString("no-NO")} kr`
							: "Ingen bud"}
					</p>
				</div>
				<div>
					<p className="text-xs text-muted-foreground">Opprettet</p>
					<p className="text-sm text-foreground">
						{new Date(garage.createdAt).toLocaleDateString("no-NO")}
					</p>
				</div>
				<div>
					<p className="text-xs text-muted-foreground">{isActive ? "Budfrist" : "Avsluttet"}</p>
					<p className={`text-sm ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
						{new Date(garage.bidEndAt).toLocaleDateString("no-NO")}
					</p>
				</div>
			</div>

			{/* Show bidder contact info when auction is ended and there's a winner */}
			{!isActive && hasHighestBid && (
				<div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/5 p-4">
					<p className="text-xs font-semibold uppercase tracking-wide text-green-400 mb-2">
						Vinnende budgiver - Kontaktinformasjon
					</p>
					<div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
						<div>
							<p className="text-xs text-muted-foreground">Navn</p>
							<p className="text-sm font-semibold text-foreground">{garage.highestBid!.bidderName}</p>
						</div>
						<div>
							<p className="text-xs text-muted-foreground">E-post</p>
							<a
								href={`mailto:${garage.highestBid!.bidderEmail}`}
								className="text-sm font-semibold text-primary hover:underline"
							>
								{garage.highestBid!.bidderEmail}
							</a>
						</div>
						{garage.highestBid!.bidderPhone && (
							<div>
								<p className="text-xs text-muted-foreground">Telefon</p>
								<a
									href={`tel:${garage.highestBid!.bidderPhone}`}
									className="text-sm font-semibold text-primary hover:underline"
								>
									{garage.highestBid!.bidderPhone}
								</a>
							</div>
						)}
					</div>
				</div>
			)}

			{/* For active auctions, show a hint about contact info */}
			{isActive && hasHighestBid && (
				<p className="mt-3 text-xs text-muted-foreground italic">
					Kontaktinformasjon til høyeste budgiver blir tilgjengelig når auksjonen er avsluttet.
				</p>
			)}
		</div>
	);
}
