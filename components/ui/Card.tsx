import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-xl border backdrop-blur transition", {
	variants: {
		variant: {
			default: "border-border/70 bg-card/70 shadow-lg",
			elevated:
				"border-border/80 bg-gradient-to-br from-card to-card/80 shadow-[0_24px_80px_rgba(7,12,28,0.55)]",
			interactive: "border-border/70 bg-card/70 shadow-md hover:border-border hover:shadow-lg",
			highlight: "border-green-500/30 bg-card/70 shadow-lg",
		},
		padding: {
			none: "",
			sm: "p-3",
			default: "p-4",
			lg: "p-6",
		},
	},
	defaultVariants: {
		variant: "default",
		padding: "default",
	},
});

export interface CardProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardVariants> {}

export function Card({ className, variant, padding, ...props }: CardProps) {
	return <div className={cn(cardVariants({ variant, padding, className }))} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return <div className={cn("space-y-1.5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
	return <h3 className={cn("text-lg font-semibold text-foreground", className)} {...props} />;
}

export function CardDescription({
	className,
	...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
	return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return <div className={cn("pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return <div className={cn("flex items-center pt-4", className)} {...props} />;
}

export { cardVariants };
