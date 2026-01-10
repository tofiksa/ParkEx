import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type GarageWithBidInfo = {
	garageId: string;
	garageTitle: string;
	garageAddress: string;
	bidEndAt: string;
	myHighestBid: number;
	myLatestBidDate: string;
	currentHighestBid: number;
	currentHighestBidderId: string;
	isMyBidHighest: boolean;
	isActive: boolean;
};

export default async function ProfileBidsPage() {
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
					<p className="text-sm text-muted-foreground">Logg inn for å se budene dine.</p>
					<div className="mt-3">
						<Link className="text-sm font-semibold text-primary hover:underline" href="/login">
							Gå til innlogging
						</Link>
					</div>
				</div>
			</main>
		);
	}

	// Fetch all bids from the user with garage info
	const { data: myBids, error: myBidsError } = await supabase
		.from("bids")
		.select("amount, created_at, garage_id, garages(id, title, address, bid_end_at)")
		.eq("bidder_id", user.id)
		.order("created_at", { ascending: false });

	if (myBidsError) {
		return (
			<main className="flex min-h-screen items-center justify-center px-6 py-16">
				<p className="text-sm text-red-400">Kunne ikke hente bud: {myBidsError.message}</p>
			</main>
		);
	}

	if (!myBids?.length) {
		return (
			<main
				id="main"
				className="flex min-h-screen items-start justify-center bg-transparent px-4 py-12 sm:px-6 md:py-16"
			>
				<div className="w-full max-w-4xl space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs uppercase tracking-[0.18em] text-primary">Mine bud</p>
							<h1 className="text-2xl font-semibold text-foreground">Dine deltagelser</h1>
						</div>
						<Link className="text-sm font-semibold text-primary hover:underline" href="/listings">
							Se annonser
						</Link>
					</div>
					<p className="text-sm text-muted-foreground">Du har ingen aktive bud enda.</p>
				</div>
			</main>
		);
	}

	// Get unique garage IDs
	const garageIds = [...new Set(myBids.map((b) => b.garage_id))];

	// Fetch the highest bid for each garage
	const { data: highestBids } = await supabase
		.from("bids")
		.select("garage_id, amount, bidder_id")
		.in("garage_id", garageIds)
		.order("amount", { ascending: false });

	// Build a map of garage_id -> highest bid info
	const highestBidMap = new Map<string, { amount: number; bidder_id: string }>();
	for (const bid of highestBids ?? []) {
		if (!highestBidMap.has(bid.garage_id)) {
			highestBidMap.set(bid.garage_id, { amount: Number(bid.amount), bidder_id: bid.bidder_id });
		}
	}

	// Group user's bids by garage and compute info
	const garageMap = new Map<string, GarageWithBidInfo>();
	const now = new Date();

	for (const bid of myBids) {
		const garageId = bid.garage_id;
		const garage = bid.garages as { id: string; title: string; address: string; bid_end_at: string } | null;
		
		if (!garage) continue;

		const existing = garageMap.get(garageId);
		const bidAmount = Number(bid.amount);
		const highestBid = highestBidMap.get(garageId);
		const isActive = new Date(garage.bid_end_at) > now;

		if (!existing) {
			garageMap.set(garageId, {
				garageId,
				garageTitle: garage.title,
				garageAddress: garage.address,
				bidEndAt: garage.bid_end_at,
				myHighestBid: bidAmount,
				myLatestBidDate: bid.created_at,
				currentHighestBid: highestBid?.amount ?? bidAmount,
				currentHighestBidderId: highestBid?.bidder_id ?? user.id,
				isMyBidHighest: highestBid?.bidder_id === user.id,
				isActive,
			});
		} else {
			// Update if this bid is higher than what we've seen
			if (bidAmount > existing.myHighestBid) {
				existing.myHighestBid = bidAmount;
			}
			// Keep the latest bid date (already sorted desc, so first is latest)
		}
	}

	// Convert to array and sort by latest bid date (descending)
	const garagesWithBids = Array.from(garageMap.values()).sort(
		(a, b) => new Date(b.myLatestBidDate).getTime() - new Date(a.myLatestBidDate).getTime()
	);

	// Separate active and ended auctions
	const activeGarages = garagesWithBids.filter((g) => g.isActive);
	const endedGarages = garagesWithBids.filter((g) => !g.isActive);

	return (
		<main
			id="main"
			className="flex min-h-screen items-start justify-center bg-transparent px-4 py-12 sm:px-6 md:py-16"
		>
			<div className="w-full max-w-4xl space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-xs uppercase tracking-[0.18em] text-primary">Mine bud</p>
						<h1 className="text-2xl font-semibold text-foreground">Dine deltagelser</h1>
						<p className="text-sm text-muted-foreground">
							{activeGarages.length} aktive · {endedGarages.length} avsluttede
						</p>
					</div>
					<Link className="text-sm font-semibold text-primary hover:underline" href="/listings">
						Se annonser
					</Link>
				</div>

				{activeGarages.length > 0 && (
					<div className="space-y-3">
						<h2 className="text-sm font-semibold text-foreground">Aktive auksjoner</h2>
						{activeGarages.map((g) => (
							<GarageBidCard key={g.garageId} garage={g} />
						))}
					</div>
				)}

				{endedGarages.length > 0 && (
					<div className="space-y-3">
						<h2 className="text-sm font-semibold text-muted-foreground">Avsluttede auksjoner</h2>
						{endedGarages.map((g) => (
							<GarageBidCard key={g.garageId} garage={g} />
						))}
					</div>
				)}
			</div>
		</main>
	);
}

function GarageBidCard({ garage }: { garage: GarageWithBidInfo }) {
	const isWinning = garage.isMyBidHighest;
	const isActive = garage.isActive;
	
	// Determine border and badge styling
	let borderClass = "border-border/70";
	let badgeText = "";
	let badgeClass = "";
	
	if (isActive) {
		if (isWinning) {
			borderClass = "border-green-500/50 bg-green-500/5";
			badgeText = "Høyeste bud";
			badgeClass = "bg-green-500/20 text-green-400 border-green-500/30";
		} else {
			borderClass = "border-amber-500/50 bg-amber-500/5";
			badgeText = "Overbydd";
			badgeClass = "bg-amber-500/20 text-amber-400 border-amber-500/30";
		}
	} else {
		if (isWinning) {
			badgeText = "Vunnet";
			badgeClass = "bg-green-500/20 text-green-400 border-green-500/30";
		} else {
			badgeText = "Tapt";
			badgeClass = "bg-muted text-muted-foreground border-border";
		}
	}

	return (
		<div
			className={`rounded-xl border ${borderClass} bg-card/70 p-4 shadow-md backdrop-blur transition-all`}
		>
			<div className="flex items-start justify-between gap-4">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<p className="text-base font-semibold text-foreground truncate">
							{garage.garageTitle}
						</p>
						{badgeText && (
							<span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${badgeClass}`}>
								{badgeText}
							</span>
						)}
					</div>
					<p className="text-sm text-muted-foreground truncate">{garage.garageAddress}</p>
				</div>
				<Link
					className="shrink-0 text-sm font-semibold text-primary hover:underline"
					href={`/listings/${garage.garageId}`}
				>
					Se annonse →
				</Link>
			</div>
			
			<div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
				<div>
					<p className="text-xs text-muted-foreground">Ditt høyeste bud</p>
					<p className="text-sm font-semibold text-foreground">
						{garage.myHighestBid.toLocaleString("no-NO")} kr
					</p>
				</div>
				<div>
					<p className="text-xs text-muted-foreground">Ledende bud</p>
					<p className={`text-sm font-semibold ${isWinning ? "text-green-400" : "text-foreground"}`}>
						{garage.currentHighestBid.toLocaleString("no-NO")} kr
					</p>
				</div>
				<div>
					<p className="text-xs text-muted-foreground">Sist budt</p>
					<p className="text-sm text-foreground">
						{new Date(garage.myLatestBidDate).toLocaleDateString("no-NO")}
					</p>
				</div>
				<div>
					<p className="text-xs text-muted-foreground">{isActive ? "Budfrist" : "Avsluttet"}</p>
					<p className={`text-sm ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
						{new Date(garage.bidEndAt).toLocaleDateString("no-NO")}
					</p>
				</div>
			</div>
		</div>
	);
}
