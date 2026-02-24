import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

type CounterApiResponse = {
  count?: unknown;
};

function normalizeNamespace(ns: string) {
  const s = String(ns || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return s || "cunning3d_showcase";
}

const COUNTER_API_BASE = String(process.env.SHOWCASE_LIKES_COUNTER_API_BASE || "")
  .trim()
  .replace(/\/+$/, "") || "https://api.counterapi.dev";

const NAMESPACE = normalizeNamespace(
  process.env.SHOWCASE_LIKES_NAMESPACE || "cunning3d_showcase"
);

function parseIdsParam(value: string | null) {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 200);
}

function toCounterKey(id: string) {
  return encodeURIComponent(id);
}

async function readAllowedIds() {
  const p = path.join(process.cwd(), "public", "examples", "index.json");
  const txt = await fs.readFile(p, "utf8");
  const json = JSON.parse(txt) as { items?: { id?: unknown }[] };
  const ids = new Set<string>();
  for (const it of json.items || []) {
    if (typeof it?.id === "string" && it.id.trim()) ids.add(it.id.trim());
  }
  return ids;
}

let cachedAllowedIds:
  | {
      loadedAt: number;
      ids: Set<string>;
    }
  | undefined;

async function getAllowedIds() {
  const now = Date.now();
  if (cachedAllowedIds && now - cachedAllowedIds.loadedAt < 60_000) {
    return cachedAllowedIds.ids;
  }
  const ids = await readAllowedIds();
  cachedAllowedIds = { loadedAt: now, ids };
  return ids;
}

async function getCount(id: string) {
  const url = `${COUNTER_API_BASE}/v1/${NAMESPACE}/${toCounterKey(id)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return 0;
  const json = (await res.json()) as CounterApiResponse;
  const count = json?.count;
  return typeof count === "number" && Number.isFinite(count) && count >= 0
    ? Math.floor(count)
    : 0;
}

async function applyDelta(id: string, delta: 1 | -1) {
  const op = delta > 0 ? "up" : "down";
  const url = `${COUNTER_API_BASE}/v1/${NAMESPACE}/${toCounterKey(id)}/${op}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return 0;
  const json = (await res.json()) as CounterApiResponse;
  const count = json?.count;
  return typeof count === "number" && Number.isFinite(count) && count >= 0
    ? Math.floor(count)
    : 0;
}

export async function GET(req: NextRequest) {
  const ids = parseIdsParam(req.nextUrl.searchParams.get("ids"));
  if (ids.length === 0) {
    return NextResponse.json({ counts: {} }, { status: 200 });
  }

  const allowed = await getAllowedIds();
  const wanted = ids.filter((id) => allowed.has(id));
  const counts = Object.fromEntries(
    await Promise.all(wanted.map(async (id) => [id, await getCount(id)]))
  );

  return NextResponse.json({ counts }, { status: 200 });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const id = typeof (body as any)?.id === "string" ? (body as any).id.trim() : "";
  const delta = (body as any)?.delta;

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  if (delta !== 1 && delta !== -1) {
    return NextResponse.json({ error: "Invalid delta" }, { status: 400 });
  }

  const allowed = await getAllowedIds();
  if (!allowed.has(id)) {
    return NextResponse.json({ error: "Unknown id" }, { status: 404 });
  }

  const count = await applyDelta(id, delta);
  return NextResponse.json({ id, count }, { status: 200 });
}

