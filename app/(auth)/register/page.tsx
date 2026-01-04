import Link from "next/link";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { upsertProfile } from "./actions";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const supabase = getSupabaseBrowserClient();

  return (
    <main
      id="main"
      className="flex min-h-screen items-center justify-center bg-transparent px-4 py-12 sm:px-6 md:py-16"
    >
			<div className="w-full max-w-3xl rounded-2xl border border-border/60 bg-card/70 p-8 shadow-2xl backdrop-blur">
				<div className="mb-6 flex items-center justify-between">
					<div>
						<p className="text-xs uppercase tracking-[0.18em] text-primary">Registrering</p>
						<h1 className="text-2xl font-semibold text-foreground">Opprett konto</h1>
						<p className="text-sm text-muted-foreground">
							Velg kjøper eller selger. Google-innlogging støttes.
						</p>
					</div>
					<Link className="text-sm font-semibold text-primary hover:underline" href="/login">
						Har du konto? Logg inn
					</Link>
				</div>
				<Auth
					supabaseClient={supabase}
					appearance={{ theme: ThemeSupa }}
					providers={["google"]}
					onlyThirdPartyProviders={false}
					redirectTo="/"
				/>
				<div className="mt-6">
					<form action={upsertProfile} className="grid gap-4">
						<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
							<label className="grid gap-1 text-sm text-muted-foreground">
								Fornavn*
								<input
									required
									name="firstName"
									className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
									placeholder="Ola"
								/>
							</label>
							<label className="grid gap-1 text-sm text-muted-foreground">
								Etternavn*
								<input
									required
									name="lastName"
									className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
									placeholder="Nordmann"
								/>
							</label>
						</div>
						<label className="grid gap-1 text-sm text-muted-foreground">
							E-post*
							<input
								required
								type="email"
								name="email"
								className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
								placeholder="ola@example.com"
							/>
						</label>
						<label className="grid gap-1 text-sm text-muted-foreground">
							Rolle*
							<select
								required
								name="role"
								className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
								defaultValue=""
							>
								<option value="" disabled>
									Velg rolle
								</option>
								<option value="buyer">Kjøper</option>
								<option value="seller">Selger</option>
							</select>
						</label>
						<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
							<label className="grid gap-1 text-sm text-muted-foreground">
								Telefon (valgfritt)
								<input
									name="phone"
									className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
									placeholder="+47 999 99 999"
								/>
							</label>
							<label className="grid gap-1 text-sm text-muted-foreground">
								Adresse (valgfritt)
								<input
									name="address"
									className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
									placeholder="Storgata 1, 0101 Oslo"
								/>
							</label>
						</div>
						<p className="text-xs text-muted-foreground">
							Etter registrering lagres profilfelt i `profiles` med valgt rolle.
						</p>
						<button
							type="submit"
							className="rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:translate-y-[-1px] hover:shadow-xl"
						>
							Lagre profil
						</button>
					</form>
				</div>
			</div>
		</main>
	);
}
