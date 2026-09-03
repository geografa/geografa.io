interface ButtonProps {
  href: string;
  variant?: "primary" | "ghost";
  children: string;
}

export function Button({ href, variant = "primary", children }: ButtonProps) {
  const className = variant === "primary" ? "btn-primary" : "btn-ghost";
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
