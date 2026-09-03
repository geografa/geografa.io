import { useState } from "react";

interface MapCopyButtonProps {
  getValue: () => Record<string, unknown> | void;
}

export function MapCopyButton({ getValue }: MapCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const value = getValue();
    if (!value) return;
    await navigator.clipboard.writeText(JSON.stringify(value, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      className={`map-copy-button ${copied ? "map-copy-button--copied" : ""}`}
      onClick={handleCopy}
      title="Copy properties to clipboard"
      aria-label="Copy properties to clipboard"
    >
      {copied ? "✓" : "📋"}
    </button>
  );
}
