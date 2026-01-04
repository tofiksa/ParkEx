import Link from "next/link";
import { createGarage } from "./actions";

export default function NewListingPage() {
	return (
		<main
			id="main"
			className="flex min-h-screen items-center justify-center bg-transparent px-4 py-12 sm:px-6 md:py-16"
		>
			<div className="w-full max-w-4xl rounded-2xl border border-border/60 bg-card/70 p-8 shadow-2xl backdrop-blur">
				<div className="mb-6 flex items-center justify-between">
					<div>
						<p className="text-xs uppercase tracking-[0.18em] text-primary">Ny garasje</p>
						<h1 className="text-2xl font-semibold text-foreground">Opprett annonse</h1>
						<p className="text-sm text-muted-foreground">
							Legg inn detaljer, startpris og budfrist (30 dager default om tomt).
						</p>
					</div>
					<Link className="text-sm font-semibold text-primary hover:underline" href="/listings">
						Til annonser
					</Link>
				</div>
				<form action={createGarage} className="grid gap-4">
					<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
						<label className="grid gap-1 text-sm text-muted-foreground">
							Tittel*
							<input
								required
								name="title"
								className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
								placeholder="Oppvarmet garasjeplass i sentrum"
							/>
						</label>
						<label className="grid gap-1 text-sm text-muted-foreground">
							Størrelse*
							<input
								required
								name="size"
								className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
								placeholder="5m x 2.5m"
							/>
						</label>
					</div>
					<label className="grid gap-1 text-sm text-muted-foreground">
						Adresse / lokasjon*
						<input
							required
							name="address"
							className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
							placeholder="Storgata 1, 0101 Oslo"
						/>
					</label>
					<label className="grid gap-1 text-sm text-muted-foreground">
						Beskrivelse
						<textarea
							name="description"
							rows={4}
							className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
							placeholder="Heis, kamera, elbillader ..."
						/>
					</label>
					<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
						<label className="grid gap-1 text-sm text-muted-foreground">
							Startpris (NOK)*
							<input
								required
								name="startPrice"
								type="number"
								min="1"
								step="0.01"
								className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
								placeholder="1200000"
							/>
						</label>
						<label className="grid gap-1 text-sm text-muted-foreground">
							Budfrist (valgfritt, default 30d)
							<input
								name="bidEndAt"
								type="datetime-local"
								className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
							/>
						</label>
					</div>
					<label className="grid gap-1 text-sm text-muted-foreground">
						Bilder (én URL per linje, last opp via /api/storage/garage-upload-url)
						<textarea
							name="images"
							rows={3}
							className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
							placeholder="https://.../garage-images/fil1.jpg"
						/>
					</label>
					<p className="text-xs text-muted-foreground">
						Tips: Kall `POST /api/storage/garage-upload-url` med filnavn for signed upload, legg
						deretter inn resulterende path/URL her. Budfrist er 30 dager hvis ikke satt.
					</p>
					<button
						type="submit"
						className="rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:translate-y-[-1px] hover:shadow-xl"
					>
						Opprett annonse
					</button>
				</form>
			</div>
		</main>
	);
}
