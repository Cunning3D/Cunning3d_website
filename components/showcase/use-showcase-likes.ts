"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "c3d_showcase_likes_v1";

function readLikedKeys(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((v) => typeof v === "string"));
  } catch {
    return new Set();
  }
}

function writeLikedKeys(keys: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...keys]));
  } catch {
    // ignore
  }
}

export function useShowcaseLikes() {
  const [likedKeys, setLikedKeys] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setLikedKeys(readLikedKeys());

    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      setLikedKeys(readLikedKeys());
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleLike = useCallback((key: string) => {
    if (!key) return;
    setLikedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      writeLikedKeys(next);
      return next;
    });
  }, []);

  return { likedKeys, toggleLike };
}

