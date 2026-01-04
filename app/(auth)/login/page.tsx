"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return (
      <main
        id="main"
        className="flex min-h-screen items-center justify-center bg-transparent px-4 py-12 sm:px-6 md:py-16"
      >
        <p className="text-sm text-red-400">
          Mangler Supabase klient-konfig. Sett NEXT_PUBLIC_SUPABASE_URL og NEXT_PUBLIC_SUPABASE_ANON_KEY.
        </p>
      </main>
    );
  }

	return (
		<main
			id="main"
			className="flex min-h-screen items-center justify-center bg-transparent px-4 py-12 sm:px-6 md:py-16"
		>
			<div className="w-full max-w-3xl rounded-2xl border border-border/60 bg-card/70 p-8 shadow-2xl backdrop-blur">
				<div className="mb-6 flex items-center justify-between">
					<div>
						<p className="text-xs uppercase tracking-[0.18em] text-primary">Logg inn</p>
						<h1 className="text-2xl font-semibold text-foreground">Velkommen tilbake</h1>
						<p className="text-sm text-muted-foreground">Bruk e-post eller Google.</p>
					</div>
					<Link className="text-sm font-semibold text-primary hover:underline" href="/register">
						Ny bruker? Registrer deg
					</Link>
				</div>
				<Auth
					supabaseClient={supabase}
					appearance={{ theme: ThemeSupa }}
					providers={["google"]}
					onlyThirdPartyProviders={false}
					redirectTo="/"
				/>
			</div>
		</main>
	);
}
