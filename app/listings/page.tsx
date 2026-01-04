import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function ListingsPage() {
	const supabase = getSupabaseServerClient();
	if (!supabase) {
		return (
			<main
				id="main"
				className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 md:py-16"
			>
				<p className="text-sm text-red-400">
					Mangler Supabase konfig (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).
				</p>
			</main>
		);
	}
	const { data, error } = await supabase
		.from("garages")
		.select("*")
		.order("created_at", { ascending: false })
		.limit(30);

	if (error) {
		return (
			<main className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 md:py-16">
				<p className="text-sm text-red-400">Kunne ikke hente annonser: {error.message}</p>
			</main>
		);
	}

	return (
		<main
			id="main"
			className="flex min-h-screen items-start justify-center bg-transparent px-4 py-12 sm:px-6 md:py-16"
		>
			<div className="w-full max-w-6xl">
				<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-xs uppercase tracking-[0.18em] text-primary">Annonser</p>
						<h1 className="text-2xl font-semibold text-foreground">Garasjer til salgs</h1>
					</div>
					<Link
						className="inline-flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:-translate-y-[1px] hover:shadow-xl sm:w-auto"
						href="/sell/new"
					>
						Opprett annonse
					</Link>
				</div>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{data?.map((g) => (
						<Link
							key={g.id}
							href={`/listings/${g.id}`}
							className="rounded-xl border border-border/70 bg-card/70 p-4 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							<p className="text-xs uppercase tracking-wide text-primary">Budfrist</p>
							<p className="text-sm text-muted-foreground">
								{new Date(g.bid_end_at).toLocaleString("no-NO")}
							</p>
							<h2 className="mt-2 text-lg font-semibold text-foreground">{g.title}</h2>
							<p className="text-sm text-muted-foreground">{g.address}</p>
							<p className="mt-2 text-xl font-bold text-foreground">
								{Number(g.start_price).toLocaleString("no-NO")} kr
							</p>
						</Link>
					))}
					{!data?.length && (
						<div className="rounded-xl border border-border/70 bg-card/70 p-4 text-sm text-muted-foreground">
							Ingen annonser ennå.
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
