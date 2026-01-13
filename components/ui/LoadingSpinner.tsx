import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva(
	"animate-spin rounded-full border-2 border-current border-t-transparent",
	{
		variants: {
			size: {
				sm: "h-4 w-4",
				default: "h-6 w-6",
				lg: "h-8 w-8",
			},
		},
		defaultVariants: {
			size: "default",
		},
	},
);

export interface LoadingSpinnerProps
	extends React.HTMLAttributes<HTMLSpanElement>,
		VariantProps<typeof spinnerVariants> {}

export function LoadingSpinner({ className, size, ...props }: LoadingSpinnerProps) {
	return (
		<output aria-label="Laster...">
			<span className={cn(spinnerVariants({ size }), className)} {...props} />
		</output>
	);
}

export interface LoadingOverlayProps {
	message?: string;
}

export function LoadingOverlay({ message = "Laster..." }: LoadingOverlayProps) {
	return (
		<div className="flex min-h-[200px] items-center justify-center">
			<div className="flex flex-col items-center gap-2">
				<LoadingSpinner size="lg" />
				<p className="text-sm text-muted-foreground">{message}</p>
			</div>
		</div>
	);
}

export function LoadingText({ children }: { children?: React.ReactNode }) {
	return <div className="text-sm text-muted-foreground">{children ?? "Laster..."}</div>;
}
