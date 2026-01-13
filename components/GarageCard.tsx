import Link from "next/link";
import type { GarageWithBid } from "@/types";

export interface GarageCardProps {
	garage: GarageWithBid;
}

export function GarageCard({ garage }: GarageCardProps) {
	const hasBids = (garage.bidCount ?? 0) > 0;
	const currentPrice = garage.highestBid ?? garage.startPrice;

	return (
		<Link
			href={`/listings/${garage.id}`}
			className={`rounded-xl border bg-card/70 p-4 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
				hasBids ? "border-green-500/30" : "border-border/70"
			}`}
		>
			<div className="flex items-start justify-between gap-2">
				<div>
					<p className="text-xs uppercase tracking-wide text-primary">Budfrist</p>
					<p className="text-sm text-muted-foreground">
						{new Date(garage.bidEndAt).toLocaleDateString("no-NO")}
					</p>
				</div>
				{hasBids && (
					<span className="rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
						{garage.bidCount} bud
					</span>
				)}
			</div>
			<h2 className="mt-2 truncate text-lg font-semibold text-foreground">{garage.title}</h2>
			<p className="truncate text-sm text-muted-foreground">{garage.address}</p>

			<div className="mt-3 flex items-end justify-between">
				<div>
					{hasBids ? (
						<>
							<p className="text-xs text-muted-foreground">Høyeste bud</p>
							<p className="text-xl font-bold text-green-400">
								{currentPrice.toLocaleString("no-NO")} kr
							</p>
						</>
					) : (
						<>
							<p className="text-xs text-muted-foreground">Startpris</p>
							<p className="text-xl font-bold text-foreground">
								{garage.startPrice.toLocaleString("no-NO")} kr
							</p>
						</>
					)}
				</div>
				{hasBids && (
					<p className="text-xs text-muted-foreground">
						Start: {garage.startPrice.toLocaleString("no-NO")} kr
					</p>
				)}
			</div>
		</Link>
	);
}
