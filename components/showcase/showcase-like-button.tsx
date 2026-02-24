"use client";

import { Heart } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useShowcaseLikes } from "@/components/showcase/use-showcase-likes";

export function ShowcaseLikeButton({ itemKey }: { itemKey: string }) {
  const { likedKeys, toggleLike } = useShowcaseLikes();
  const liked = itemKey ? likedKeys.has(itemKey) : false;

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => toggleLike(itemKey)}
      disabled={!itemKey}
      aria-pressed={liked}
    >
      <Heart className="w-4 h-4 mr-2" weight={liked ? "fill" : "light"} />
      {liked ? "Liked" : "Like"}
    </Button>
  );
}

