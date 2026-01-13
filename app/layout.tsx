import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { InactivityGuard } from "@/components/InactivityGuard";

export const metadata: Metadata = {
	title: "ParkEx Garasjemegling",
	description: "Kjøp og selg garasjer med budrunder i sanntid.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="no">
			<body>
				<a
					href="#main"
					className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-foreground focus:shadow-lg"
				>
					Hopp til innhold
				</a>
				<Header />
				<InactivityGuard />
				{children}
			</body>
		</html>
	);
}
