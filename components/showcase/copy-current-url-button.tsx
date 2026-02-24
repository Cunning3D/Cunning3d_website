"use client";

import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function CopyCurrentUrlButton({
  label,
  copiedLabel,
  className,
}: {
  label?: string;
  copiedLabel?: string;
  className?: string;
}) {
  const t = useTranslations("showcase");
  const defaultLabel = label ?? t("actions.copyLink");
  const copiedText = copiedLabel ?? t("actions.copied");
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Fallback for unsupported browsers / insecure context.
      window.prompt(defaultLabel, window.location.href);
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
      {copied ? copiedText : defaultLabel}
    </Button>
  );
}
