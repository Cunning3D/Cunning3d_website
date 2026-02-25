"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export function WasmPlayerFrame({
  src,
  title,
  className,
}: {
  src: string;
  title: string;
  className?: string;
}) {
  const t = useTranslations("showcase");
  const [loaded, setLoaded] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [progress, setProgress] = useState(8);
  const hideOverlayTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset when switching to a new CDA / src.
    setLoaded(false);
    setOverlayVisible(true);
    setProgress(8);
    if (hideOverlayTimeoutRef.current) {
      window.clearTimeout(hideOverlayTimeoutRef.current);
      hideOverlayTimeoutRef.current = null;
    }
  }, [src]);

  useEffect(() => {
    if (loaded) return;

    let cancelled = false;
    const start = Date.now();

    // Pseudo-progress: quickly ramps up, then asymptotically approaches a cap
    // until the iframe fires `onLoad`.
    const tick = () => {
      if (cancelled) return;
      const elapsed = Date.now() - start;
      const cap = 92;
      const target = 15 + (cap - 15) * (1 - Math.exp(-elapsed / 3500));
      const next = Math.min(cap, Math.max(5, Math.round(target)));
      setProgress((prev) => (next > prev ? next : prev));
      window.setTimeout(tick, 180);
    };

    // Give immediate feedback.
    setProgress((prev) => (prev > 0 ? prev : 8));
    tick();

    return () => {
      cancelled = true;
    };
  }, [loaded]);

  useEffect(() => {
    return () => {
      if (hideOverlayTimeoutRef.current) {
        window.clearTimeout(hideOverlayTimeoutRef.current);
        hideOverlayTimeoutRef.current = null;
      }
    };
  }, []);

  return (
    <div className={cn("relative w-full aspect-[16/9]", className)}>
      {overlayVisible ? (
        <div className="absolute inset-0 grid place-items-center bg-black/50">
          <div className="w-full max-w-sm px-6">
            <div className="mb-2 flex items-center justify-between text-xs text-white/80">
              <span>{t("viewer.loading")}</span>
              <span className="tabular-nums">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-white/10" />
          </div>
        </div>
      ) : null}

      <iframe
        title={title}
        src={src}
        className={cn(
          "absolute inset-0 block w-full h-full border-0 bg-black",
          loaded ? "opacity-100" : "opacity-0"
        )}
        allow="autoplay; fullscreen"
        onLoad={() => {
          setLoaded(true);
          setProgress(100);
          // Let the bar fill to 100% before removing the overlay.
          hideOverlayTimeoutRef.current = window.setTimeout(() => {
            setOverlayVisible(false);
            hideOverlayTimeoutRef.current = null;
          }, 250);
        }}
      />
    </div>
  );
}
