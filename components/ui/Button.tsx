import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center rounded-lg text-sm font-semibold transition disabled:opacity-50 disabled:pointer-events-none",
	{
		variants: {
			variant: {
				primary:
					"bg-primary text-primary-foreground shadow-lg hover:translate-y-[-1px] hover:shadow-xl",
				secondary:
					"border border-border/60 bg-background/50 text-foreground hover:border-border hover:bg-background",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				outline:
					"border border-border/80 bg-white/5 text-foreground hover:border-border hover:bg-white/8",
				gradient:
					"bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:translate-y-[-2px] hover:shadow-xl",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "px-4 py-3",
				sm: "px-3 py-1.5 text-xs",
				lg: "px-6 py-4",
				icon: "h-9 w-9",
			},
			fullWidth: {
				true: "w-full",
				false: "",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "default",
			fullWidth: false,
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

export function Button({ className, variant, size, fullWidth, ...props }: ButtonProps) {
	return (
		<button className={cn(buttonVariants({ variant, size, fullWidth, className }))} {...props} />
	);
}

export { buttonVariants };
