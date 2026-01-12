import Link from "next/link";
import type { Metadata } from "next";
import { ObfuscatedEmail } from "../components/ObfuscatedEmail";

export const metadata: Metadata = {
	title: "Personvernerklæring | ParkEx",
	description: "Les om hvordan ParkEx behandler og beskytter dine personopplysninger.",
};

export default function PrivacyPage() {
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
						Personvernerklæring
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">Sist oppdatert: Januar 2026</p>
				</header>

				<div className="prose prose-invert max-w-none space-y-8">
					<section>
						<h2 className="text-xl font-semibold text-foreground">1. Innledning</h2>
						<p className="mt-3 text-muted-foreground leading-relaxed">
							ParkEx tar personvern på alvor. Denne personvernerklæringen forklarer hvilke
							personopplysninger vi samler inn, hvordan vi bruker dem, og hvilke rettigheter du har.
							Vi behandler alle personopplysninger i samsvar med gjeldende personvernlovgivning,
							inkludert GDPR.
						</p>
					</section>

					<section id="google-oauth">
						<h2 className="text-xl font-semibold text-foreground">
							2. Google-innlogging og brukerdata
						</h2>
						<p className="mt-3 text-muted-foreground leading-relaxed">
							ParkEx tilbyr innlogging via Google (Google Sign-In). Når du velger å logge inn med
							Google, får vi tilgang til visse opplysninger fra din Google-konto. Her forklarer vi
							hvordan vi håndterer disse dataene i henhold til{" "}
							<a
								href="https://developers.google.com/terms/api-services-user-data-policy"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline"
							>
								Google API Services User Data Policy
							</a>
							.
						</p>

						<div className="mt-4 space-y-4 text-muted-foreground leading-relaxed">
							<div>
								<h3 className="font-medium text-foreground">Data vi får tilgang til fra Google:</h3>
								<ul className="mt-2 list-disc pl-5 space-y-1">
									<li>
										<strong>E-postadresse:</strong> Brukes til å identifisere og opprette din
										brukerkonto
									</li>
									<li>
										<strong>Navn:</strong> Vises i din profil og i forbindelse med dine annonser og
										bud
									</li>
									<li>
										<strong>Profilbilde:</strong> Vises i din brukerprofil (valgfritt)
									</li>
								</ul>
								<p className="mt-2 text-sm">
									Vi ber kun om grunnleggende profilinformasjon og har ikke tilgang til dine
									Google-kontakter, Google Drive-filer, kalender eller andre Google-tjenester.
								</p>
							</div>

							<div>
								<h3 className="font-medium text-foreground">
									Hvordan vi bruker Google-brukerdata:
								</h3>
								<ul className="mt-2 list-disc pl-5 space-y-1">
									<li>Opprette og administrere din brukerkonto på ParkEx</li>
									<li>Autentisere deg når du logger inn</li>
									<li>Vise ditt navn og eventuelt profilbilde i tjenesten</li>
									<li>Sende viktige varsler om din konto til din e-postadresse</li>
								</ul>
								<p className="mt-2 text-sm">
									Vi bruker ikke Google-brukerdata til markedsføring, profilering eller til å bygge
									annonseprofiler.
								</p>
							</div>

							<div>
								<h3 className="font-medium text-foreground">Deling av Google-brukerdata:</h3>
								<p className="mt-2">
									Vi deler <strong>ikke</strong> dine Google-brukerdata med tredjeparter, unntatt:
								</p>
								<ul className="mt-2 list-disc pl-5 space-y-1">
									<li>
										<strong>Supabase (dataleverandør):</strong> Lagrer dine kontodata sikkert i EU
										for drift av tjenesten
									</li>
									<li>
										<strong>Lovpålagte krav:</strong> Dersom vi er pålagt å utlevere data av
										myndigheter eller domstoler
									</li>
								</ul>
								<p className="mt-2 text-sm">
									Vi selger aldri dine personopplysninger til tredjeparter.
								</p>
							</div>

							<div>
								<h3 className="font-medium text-foreground">Lagring og sikkerhet:</h3>
								<ul className="mt-2 list-disc pl-5 space-y-1">
									<li>All data lagres kryptert hos Supabase i EU (GDPR-kompatibelt)</li>
									<li>Sikker overføring via HTTPS/TLS</li>
									<li>Tilgangskontroll og autentisering beskytter dine data</li>
									<li>Regelmessig sikkerhetskopiering</li>
								</ul>
							</div>

							<div>
								<h3 className="font-medium text-foreground">Oppbevaring og sletting:</h3>
								<p className="mt-2">
									Dine Google-brukerdata oppbevares så lenge du har en aktiv konto hos oss. Du kan
									når som helst:
								</p>
								<ul className="mt-2 list-disc pl-5 space-y-1">
									<li>
										<strong>Slette kontoen din:</strong> Kontakt oss på e-post for å be om sletting.
										Alle dine data, inkludert Google-brukerdata, slettes innen 30 dager.
									</li>
									<li>
										<strong>Fjerne Google-tilgang:</strong> Gå til{" "}
										<a
											href="https://myaccount.google.com/permissions"
											target="_blank"
											rel="noopener noreferrer"
											className="text-primary hover:underline"
										>
											Google-kontoinnstillinger
										</a>{" "}
										for å tilbakekalle ParkEx sin tilgang til din Google-konto.
									</li>
								</ul>
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-foreground">
							3. Hvilke opplysninger samler vi inn?
						</h2>
						<div className="mt-3 space-y-4 text-muted-foreground leading-relaxed">
							<div>
								<h3 className="font-medium text-foreground">Kontoinformasjon:</h3>
								<ul className="mt-2 list-disc pl-5 space-y-1">
									<li>E-postadresse (brukes til innlogging og kommunikasjon)</li>
									<li>Navn (valgfritt, for personalisering)</li>
									<li>Passord (lagres kryptert)</li>
								</ul>
							</div>
							<div>
								<h3 className="font-medium text-foreground">Annonsedata:</h3>
								<ul className="mt-2 list-disc pl-5 space-y-1">
									<li>Adresse og beskrivelse av garasjeplass</li>
									<li>Bilder du laster opp</li>
									<li>Prisopplysninger og budhistorikk</li>
								</ul>
							</div>
							<div>
								<h3 className="font-medium text-foreground">Bruksdata:</h3>
								<ul className="mt-2 list-disc pl-5 space-y-1">
									<li>Innloggingstidspunkt og aktivitet på plattformen</li>
									<li>Budhistorikk og interesser</li>
									<li>Teknisk informasjon om enhet og nettleser</li>
								</ul>
							</div>
						</div>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-foreground">
							4. Hvordan bruker vi opplysningene?
						</h2>
						<p className="mt-3 text-muted-foreground leading-relaxed">
							Vi bruker dine personopplysninger til følgende formål:
						</p>
						<ul className="mt-2 list-disc pl-5 space-y-1 text-muted-foreground">
							<li>Administrere din brukerkonto og gi tilgang til tjenesten</li>
							<li>Vise annonser og legge til rette for budrunder</li>
							<li>Sende varsler om bud og aktivitet på dine annonser</li>
							<li>Forbedre og videreutvikle tjenesten</li>
							<li>Sikre plattformen mot misbruk og svindel</li>
							<li>Oppfylle juridiske forpliktelser</li>
						</ul>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-foreground">5. Hvordan lagrer vi dataene?</h2>
						<p className="mt-3 text-muted-foreground leading-relaxed">
							Alle data lagres sikkert hos vår dataleverandør Supabase, som har servere i EU. Vi
							bruker følgende sikkerhetstiltak:
						</p>
						<ul className="mt-2 list-disc pl-5 space-y-1 text-muted-foreground">
							<li>Kryptert overføring (HTTPS/TLS)</li>
							<li>Kryptert lagring av sensitive data som passord</li>
							<li>Tilgangskontroll og autentisering</li>
							<li>Regelmessig sikkerhetskopiering</li>
						</ul>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-foreground">6. Deling av opplysninger</h2>
						<p className="mt-3 text-muted-foreground leading-relaxed">
							Vi selger aldri dine personopplysninger til tredjeparter. Vi kan dele opplysninger i
							følgende tilfeller:
						</p>
						<ul className="mt-2 list-disc pl-5 space-y-1 text-muted-foreground">
							<li>Med tjenesteleverandører som hjelper oss med drift (f.eks. hosting)</li>
							<li>Når det er påkrevd av lov eller offentlige myndigheter</li>
							<li>For å beskytte våre rettigheter eller sikkerheten til brukere</li>
						</ul>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-foreground">7. Oppbevaringstid</h2>
						<p className="mt-3 text-muted-foreground leading-relaxed">
							Vi oppbevarer dine personopplysninger så lenge du har en aktiv konto hos oss. Dersom
							du sletter kontoen din, vil vi slette eller anonymisere dine data innen 30 dager, med
							mindre vi er pålagt å oppbevare dem av juridiske grunner.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-foreground">8. Dine rettigheter</h2>
						<p className="mt-3 text-muted-foreground leading-relaxed">
							Du har følgende rettigheter i henhold til personvernlovgivningen:
						</p>
						<ul className="mt-2 list-disc pl-5 space-y-1 text-muted-foreground">
							<li>
								<strong>Innsyn:</strong> Du kan be om en kopi av alle opplysninger vi har om deg
							</li>
							<li>
								<strong>Retting:</strong> Du kan be om at feilaktige opplysninger rettes
							</li>
							<li>
								<strong>Sletting:</strong> Du kan be om at dine opplysninger slettes
							</li>
							<li>
								<strong>Dataportabilitet:</strong> Du kan be om å få utlevert dine data i et
								maskinlesbart format
							</li>
							<li>
								<strong>Innsigelse:</strong> Du kan motsette deg visse former for behandling
							</li>
						</ul>
						<p className="mt-3 text-muted-foreground leading-relaxed">
							For å utøve dine rettigheter, kontakt oss på{" "}
							<ObfuscatedEmail
								user="tofiksa"
								domain="gmail.com"
								className="text-primary hover:underline"
							/>
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-foreground">
							9. Informasjonskapsler (cookies)
						</h2>
						<p className="mt-3 text-muted-foreground leading-relaxed">
							Vi bruker nødvendige informasjonskapsler for å sikre at tjenesten fungerer korrekt,
							inkludert innlogging og sesjonshåndtering. Vi bruker ikke sporings- eller
							markedsføringskapsler.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-foreground">
							10. Endringer i personvernerklæringen
						</h2>
						<p className="mt-3 text-muted-foreground leading-relaxed">
							Vi kan oppdatere denne personvernerklæringen fra tid til annen. Vesentlige endringer
							vil bli varslet via e-post eller gjennom plattformen. Vi oppfordrer deg til å
							gjennomgå denne erklæringen regelmessig.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-foreground">11. Kontakt</h2>
						<p className="mt-3 text-muted-foreground leading-relaxed">
							Har du spørsmål om personvern eller ønsker å utøve dine rettigheter, kontakt oss på:
						</p>
						<div className="mt-3 rounded-lg border border-border/60 bg-card/30 p-4">
							<p className="text-foreground font-medium">ParkEx</p>
							<p className="text-muted-foreground">
								E-post:{" "}
								<ObfuscatedEmail
									user="tofiksa"
									domain="gmail.com"
									className="text-primary hover:underline"
								/>
							</p>
						</div>
					</section>
				</div>

				<footer className="mt-12 border-t border-border/60 pt-6">
					<p className="text-sm text-muted-foreground">
						Se også våre{" "}
						<Link href="/terms" className="text-primary hover:underline">
							vilkår for bruk
						</Link>{" "}
						for fullstendige brukervilkår.
					</p>
				</footer>
			</article>
		</main>
	);
}
