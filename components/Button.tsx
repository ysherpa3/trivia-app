import { cn } from "@/lib/utils";

// Exported so a <Link> can be styled as a button without duplicating this.
export const buttonClass =
  "rounded-xl bg-brand hover:bg-brand-hover text-gray-900 font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-800 focus-visible:ring-offset-2";

// Sizing and weight stay at the call site and override buttonClass via cn().
export function Button({
  className,
  type = "button",
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button type={type} className={cn(buttonClass, className)} {...props} />
  );
}
