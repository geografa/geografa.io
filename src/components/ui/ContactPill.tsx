interface ContactPillProps {
  href: string;
  children: string;
  primary?: boolean;
  external?: boolean;
}

export function ContactPill({
  href,
  children,
  primary = false,
  external = false,
}: ContactPillProps) {
  const className = primary ? "contact-pill primary" : "contact-pill";
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
