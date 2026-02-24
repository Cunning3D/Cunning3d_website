"use client";

import { useState } from "react";
import { CircleNotch } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

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

  return (
    <div className={cn("relative w-full aspect-[16/9]", className)}>
      {!loaded ? (
        <div className="absolute inset-0 grid place-items-center bg-black/40">
          <div className="flex items-center gap-2 text-sm text-white/80">
            <CircleNotch className="w-5 h-5 animate-spin" weight="light" />
            {t("viewer.loading")}
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
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
