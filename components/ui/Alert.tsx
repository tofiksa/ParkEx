import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva("rounded-md border p-3 text-sm", {
	variants: {
		variant: {
			default: "border-border bg-background text-foreground",
			success: "border-green-500/50 bg-green-500/10 text-green-400",
			error: "border-destructive/50 bg-destructive/10 text-destructive",
			warning: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
			info: "border-primary/40 bg-primary/10 text-foreground",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export interface AlertProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof alertVariants> {}

export function Alert({ className, variant, ...props }: AlertProps) {
	return <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h5 className={cn("mb-1 font-semibold leading-none tracking-tight", className)} {...props} />
	);
}

export function AlertDescription({
	className,
	...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
	return <p className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />;
}

export { alertVariants };
