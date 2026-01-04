import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { BidRealtime } from "./BidRealtime";

export default async function ListingDetail({
  params
}: {
  params: { id: string };
}) {
  const supabase = getSupabaseServerClient();
  const { data: garage, error } = await supabase
    .from("garages")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !garage) {
    notFound();
  }

  const { data: bids } = await supabase
    .from("bids")
    .select("amount, created_at, bidder_id")
    .eq("garage_id", params.id)
    .order("amount", { ascending: false })
    .limit(5);

  const _topBid = bids?.[0];

  return (
    <main className="flex min-h-screen items-start justify-center bg-transparent px-6 py-16">
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Garasje</p>
            <h1 className="text-2xl font-semibold text-foreground">{garage.title}</h1>
            <p className="text-sm text-muted-foreground">{garage.address}</p>
          </div>
          <Link className="text-sm font-semibold text-primary hover:underline" href="/listings">
            Tilbake til oversikt
          </Link>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card/70 p-6 shadow-xl backdrop-blur">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Størrelse</p>
              <p className="text-base text-foreground">{garage.size}</p>
              <p className="text-sm text-muted-foreground">Startpris</p>
              <p className="text-xl font-bold text-foreground">
                {Number(garage.start_price).toLocaleString("no-NO")} kr
              </p>
              <p className="text-sm text-muted-foreground">Budfrist</p>
              <p className="text-base text-foreground">
                {new Date(garage.bid_end_at).toLocaleString("no-NO")}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Beskrivelse</p>
              <p className="text-base text-foreground">{garage.description ?? "Ingen beskrivelse."}</p>
              <p className="text-sm text-muted-foreground">Bilder</p>
              <div className="space-y-1">
                {garage.images?.length
                  ? garage.images.map((img: string) => (
                      <a
                        key={img}
                        href={img}
                        className="block truncate text-sm text-primary underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {img}
                      </a>
                    ))
                  : "Ingen bilder"}
              </div>
            </div>
          </div>
        </div>
        <BidRealtime
          garageId={garage.id}
          startPrice={Number(garage.start_price)}
          initialBids={bids ?? []}
        />
      </div>
    </main>
  );
}

