import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium transition-colors",
	{
		variants: {
			variant: {
				default: "border-border bg-background text-foreground",
				primary: "border-primary/30 bg-primary/10 text-primary",
				success: "border-green-500/30 bg-green-500/10 text-green-400",
				warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
				error: "border-destructive/30 bg-destructive/10 text-destructive",
				muted: "border-muted bg-muted/50 text-muted-foreground",
				outline: "border-border text-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLSpanElement>,
		VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
	return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

/** Status indicator dot with pulse animation */
export function StatusDot({ active, className }: { active: boolean; className?: string }) {
	return (
		<span className={cn("relative flex h-2 w-2", className)}>
			{active && (
				<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
			)}
			<span
				className={cn(
					"relative inline-flex h-2 w-2 rounded-full",
					active ? "bg-green-500" : "bg-gray-500",
				)}
			/>
		</span>
	);
}

export { badgeVariants };
