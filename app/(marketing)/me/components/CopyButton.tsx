'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Copy } from 'lucide-react';
import { useState } from 'react';

export function CopyButton({
  value,
  label,
  copiedTitle,
  copiedDescription,
}: {
  value: string;
  label: string;
  copiedTitle: string;
  copiedDescription: string;
}) {
  const { toast } = useToast();
  const [isCopying, setIsCopying] = useState(false);

  const onCopy = async () => {
    if (!value) return;
    let success = false;
    try {
      setIsCopying(true);
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        success = true;
        toast({ title: copiedTitle, description: copiedDescription });
      }
    } catch {
      // Fall back below.
    } finally {
      setIsCopying(false);
    }

    if (!success) {
      // Fallback for unsupported browsers / insecure context.
      window.prompt(label, value);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={onCopy} disabled={isCopying}>
      <Copy className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
}
