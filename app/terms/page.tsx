import Link from "next/link";
import type { Metadata } from "next";
import { ObfuscatedEmail } from "../components/ObfuscatedEmail";

export const metadata: Metadata = {
	title: "Vilkår for bruk | ParkEx",
	description: "Les vilkårene for bruk av ParkEx garasjemegling.",
};

export default function TermsPage() {
	return (
		<main id="main" className="min-h-screen bg-transparent px-4 py-12 sm:px-6 md:py-16">
			<article className="mx-auto max-w-3xl">
				<header className="mb-8">
					<Link
						href="/"
						className="text-sm text-muted-foreground hover:text-primary transition-colors"
					>
						← Tilbake til forsiden
					</Link>
					<h1 className="mt-4 text-3xl font-semibold text-foreground md:text-4xl">
						Vilkår for bruk
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">Sist oppdatert: Januar 2026</p>
				</header>

				<div className="prose prose-invert max-w-none space-y-8">
					<section>
						<h2 className="text-xl font-semibold text-foreground">1. Om tjenesten</h2>
						<p className="mt-3 text-muted-foreground leading-relaxed">
							ParkEx er en digital markedsplass for kjøp og salg av garasjeplasser. Tjenesten kobler
							sammen selgere som ønsker å selge sin garasjeplass med potensielle kjøpere gjennom et
							budsystem i sanntid.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-foreground">2. Slik fungerer tjenesten</h2>
						<div className="mt-3 space-y-4 text-muted-foreground leading-relaxed">
							<div>
								<h3 className="font-medium text-foreground">For selgere:</h3>
								<ul className="mt-2 list-disc pl-5 space-y-1">
									<li>Opprett en brukerkonto og registrer deg som selger</li>
									<li>Legg ut din garasjeplass med beskrivelse, bilder og startpris</li>
									<li>Sett en budfrist for når budrunden avsluttes</li>
									<li>Følg med på innkomne bud i sanntid</li>
									<li>Når budfristen utløper, kan du velge å akseptere høyeste bud</li>
								</ul>
							</div>
							<div>
								<h3 className="font-medium text-foreground">For kjøpere:</h3>
								<ul className="mt-2 list-disc pl-5 space-y-1">
									<li>Opprett en brukerkonto for å kunne legge inn bud</li>
									<li>Bla gjennom tilgjengelige garasjeplasser</li>
									<li>Legg inn bud på garasjer du er interessert i</li>
									<li>Følg med på budutviklingen i sanntid</li>
									<li>Motta varsel hvis du blir overbydd</li>
								</ul>
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-foreground">3. Brukerregistrering</h2>
						<p className="mt-3 text-muted-foreground leading-relaxed">
							For å benytte tjenesten må du opprette en brukerkonto. Du er ansvarlig for å oppgi
							korrekt informasjon og holde dine innloggingsdetaljer konfidensielle. Du må være minst
							18 år for å bruke tjenesten.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-foreground">
							4. Google-innlogging og brukerdata
						</h2>
						<p className="mt-3 text-muted-foreground leading-relaxed">
							ParkEx tilbyr innlogging via Google (Google Sign-In). Ved å bruke denne funksjonen
							samtykker du til at vi får tilgang til grunnleggende profilinformasjon fra din
							Google-konto, inkludert e-postadresse, navn og profilbilde.
						</p>
						<p className="mt-3 text-muted-foreground leading-relaxed">
							Vår bruk av Google-brukerdata er i samsvar med{" "}
							<a
								href="https://developers.google.com/terms/api-services-user-data-policy"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline"
							>
								Google API Services User Data Policy
							</a>
							, inkludert kravene om begrenset bruk (Limited Use).
						</p>
						<p className="mt-3 text-muted-foreground leading-relaxed">
							For fullstendig informasjon om hvordan vi håndterer Google-brukerdata, se vår{" "}
							<Link href="/privacy#google-oauth" className="text-primary hover:underline">
								personvernerklæring (seksjon 2)
							</Link>
							.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-foreground">5. Bud og avtaler</h2>
						<p className="mt-3 text-muted-foreground leading-relaxed">
							Alle bud som legges inn på plattformen er bindende. Når du legger inn et bud,
							forplikter du deg til å gjennomføre kjøpet dersom budet ditt blir akseptert. ParkEx
							fungerer kun som en formidlingstjeneste og er ikke part i avtalen mellom kjøper og
							selger.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-foreground">6. Brukerens ansvar</h2>
						<p className="mt-3 text-muted-foreground leading-relaxed">Du forplikter deg til å:</p>
						<ul className="mt-2 list-disc pl-5 space-y-1 text-muted-foreground">
							<li>Oppgi korrekt og sannferdig informasjon i annonser</li>
							<li>Ikke misbruke plattformen til svindel eller villedende aktiviteter</li>
							<li>Respektere andre brukeres personvern</li>
							<li>Følge gjeldende lover og regler for eiendomsoverdragelse</li>
						</ul>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-foreground">7. Ansvarsbegrensning</h2>
						<p className="mt-3 text-muted-foreground leading-relaxed">
							ParkEx er en formidlingstjeneste og tar ikke ansvar for innholdet i annonsene,
							kvaliteten på garasjeplassene, eller gjennomføringen av transaksjoner mellom brukere.
							Vi oppfordrer alle brukere til å utvise forsiktighet og gjøre nødvendige undersøkelser
							før de inngår avtaler.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-foreground">8. Endringer i vilkårene</h2>
						<p className="mt-3 text-muted-foreground leading-relaxed">
							Vi forbeholder oss retten til å endre disse vilkårene. Vesentlige endringer vil bli
							varslet til registrerte brukere via e-post eller gjennom plattformen.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-foreground">9. Kontakt</h2>
						<p className="mt-3 text-muted-foreground leading-relaxed">
							Har du spørsmål om disse vilkårene, kan du kontakte oss på{" "}
							<ObfuscatedEmail
								user="tofiksa"
								domain="gmail.com"
								className="text-primary hover:underline"
							/>
						</p>
					</section>
				</div>

				<footer className="mt-12 border-t border-border/60 pt-6">
					<p className="text-sm text-muted-foreground">
						Se også vår{" "}
						<Link href="/privacy" className="text-primary hover:underline">
							personvernerklæring
						</Link>{" "}
						for informasjon om hvordan vi behandler dine data.
					</p>
				</footer>
			</article>
		</main>
	);
}
