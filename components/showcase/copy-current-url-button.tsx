"use client";

import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export function CopyCurrentUrlButton({
  label = "Copy link",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Fallback for unsupported browsers / insecure context.
      window.prompt(label, window.location.href);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onCopy}
      className={className}
    >
      {copied ? (
        <Check className="w-4 h-4 mr-2" weight="bold" />
      ) : (
        <Copy className="w-4 h-4 mr-2" weight="light" />
      )}
      {copied ? "Copied" : label}
    </Button>
  );
}

