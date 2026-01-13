"use client";

import { useEffect, useState } from "react";

type ObfuscatedEmailProps = {
	user: string;
	domain: string;
	className?: string;
};

/**
 * Renders an email link that is obfuscated to prevent automated harvesting.
 * The email is assembled client-side via JavaScript, making it invisible to
 * simple scrapers that only parse HTML.
 */
export function ObfuscatedEmail({ user, domain, className }: ObfuscatedEmailProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		// Server-side / initial render: show placeholder
		return (
			<span className={className} title="E-postadresse">
				[e-post beskyttet]
			</span>
		);
	}

	// Client-side: assemble the email
	const email = `${user}@${domain}`;

	return (
		<a
			href={`mailto:${email}`}
			className={className}
			onClick={(e) => {
				// Extra protection: construct href on click
				e.currentTarget.href = `mailto:${user}@${domain}`;
			}}
		>
			{email}
		</a>
	);
}
