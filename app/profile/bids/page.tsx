import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";

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

	const { data, error } = await supabase
		.from("bids")
		.select("amount, created_at, garages(id, title, address, bid_end_at)")
		.eq("bidder_id", user.id)
		.order("created_at", { ascending: false });

	if (error) {
		return (
			<main className="flex min-h-screen items-center justify-center px-6 py-16">
				<p className="text-sm text-red-400">Kunne ikke hente bud: {error.message}</p>
			</main>
		);
	}

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
				{data?.length ? (
					<div className="space-y-2">
						{data.map((b, idx) => (
							<div
								key={`${b.created_at}-${idx}`}
								className="rounded-xl border border-border/70 bg-card/70 p-4 shadow-md backdrop-blur"
							>
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-semibold text-foreground">
											{b.garages?.title ?? "Ukjent garasje"}
										</p>
										<p className="text-sm text-muted-foreground">{b.garages?.address ?? ""}</p>
									</div>
									<Link
										className="text-sm font-semibold text-primary hover:underline"
										href={`/listings/${b.garages?.id ?? ""}`}
									>
										Gå til annonse
									</Link>
								</div>
								<div className="mt-2 flex items-center justify-between text-sm">
									<span className="font-semibold text-foreground">
										{Number(b.amount).toLocaleString("no-NO")} kr
									</span>
									<span className="text-muted-foreground">
										Bud lagt: {new Date(b.created_at).toLocaleString("no-NO")}
									</span>
								</div>
								{b.garages?.bid_end_at && (
									<p className="mt-1 text-xs text-muted-foreground">
										Budfrist: {new Date(b.garages.bid_end_at).toLocaleString("no-NO")}
									</p>
								)}
							</div>
						))}
					</div>
				) : (
					<p className="text-sm text-muted-foreground">Ingen bud enda.</p>
				)}
			</div>
		</main>
	);
}
