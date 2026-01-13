import Link from "next/link";

export interface SortLinkProps {
	href: string;
	active: boolean;
	children: React.ReactNode;
}

export function SortLink({ href, active, children }: SortLinkProps) {
	return (
		<Link
			href={href}
			className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
				active
					? "border-primary bg-primary/10 text-primary"
					: "border-border bg-card/50 text-muted-foreground hover:border-primary/50 hover:text-foreground"
			}`}
		>
			{children}
		</Link>
	);
}
