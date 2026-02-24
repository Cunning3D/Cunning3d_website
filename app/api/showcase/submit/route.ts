import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { readGitHubSession } from "@/lib/showcase/github-oauth";

const MAX_CDA_BYTES = 10 * 1024 * 1024;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".gif",
]);

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function sanitizeBaseName(input: string) {
  const base = String(input || "")
    .replace(/\.cda$/i, "")
    .trim()
    .slice(0, 80);

  const safe = base
    .replace(/[\\/:"*?<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .replace(/[\u0000-\u001F\u007F]+/g, "")
    .trim();

  return safe || "Untitled";
}

function randomId(len = 6) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < len; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

async function ghJson<T>(
  token: string,
  method: string,
  apiPath: string,
  body?: unknown
): Promise<{ status: number; ok: boolean; json: T }> {
  const url = `https://api.github.com${apiPath}`;
  const res = await fetch(url, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const json = (await res.json()) as T;
  return { status: res.status, ok: res.ok, json };
}

async function ghExists(token: string, owner: string, repo: string, filePath: string) {
  const url = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
    repo
  )}/contents/${filePath.split("/").map(encodeURIComponent).join("/")}`;
  const res = await fetch(`https://api.github.com${url}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  return res.status === 200;
}

async function ensureFork(
  token: string,
  upstreamOwner: string,
  upstreamRepo: string,
  forkOwner: string
) {
  // Already exists?
  const existing = await ghJson<{ id?: unknown }>(
    token,
    "GET",
    `/repos/${encodeURIComponent(forkOwner)}/${encodeURIComponent(upstreamRepo)}`
  );
  if (existing.ok) return;

  // Request fork creation.
  await ghJson(
    token,
    "POST",
    `/repos/${encodeURIComponent(upstreamOwner)}/${encodeURIComponent(
      upstreamRepo
    )}/forks`,
    {}
  );

  // Fork creation can be async; poll until available.
  for (let i = 0; i < 10; i++) {
    await sleep(2000);
    const probe = await ghJson<{ id?: unknown }>(
      token,
      "GET",
      `/repos/${encodeURIComponent(forkOwner)}/${encodeURIComponent(upstreamRepo)}`
    );
    if (probe.ok) return;
  }

  throw new Error("Fork is not ready yet. Please retry in a moment.");
}

async function getRepoInfo(token: string, owner: string, repo: string) {
  const r = await ghJson<{ default_branch?: unknown }>(
    token,
    "GET",
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`
  );
  if (!r.ok || typeof r.json.default_branch !== "string") {
    throw new Error("Cannot read repository info.");
  }
  return { defaultBranch: r.json.default_branch };
}

async function getRefSha(
  token: string,
  owner: string,
  repo: string,
  branch: string
) {
  const r = await ghJson<{ object?: { sha?: unknown } }>(
    token,
    "GET",
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
      repo
    )}/git/ref/heads/${encodeURIComponent(branch)}`
  );
  const sha = r.json?.object?.sha;
  if (!r.ok || typeof sha !== "string") throw new Error("Cannot resolve base branch.");
  return sha;
}

async function createBranch(
  token: string,
  owner: string,
  repo: string,
  branch: string,
  sha: string
) {
  const r = await ghJson(
    token,
    "POST",
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/refs`,
    { ref: `refs/heads/${branch}`, sha }
  );
  if (!r.ok) throw new Error("Cannot create branch.");
}

async function putFile(
  token: string,
  owner: string,
  repo: string,
  filePath: string,
  contentBase64: string,
  branch: string,
  message: string
) {
  const r = await ghJson(
    token,
    "PUT",
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
      repo
    )}/contents/${filePath.split("/").map(encodeURIComponent).join("/")}`,
    {
      message,
      content: contentBase64,
      branch,
    }
  );
  if (!r.ok) throw new Error(`Cannot upload ${filePath}.`);
}

async function createPr(
  token: string,
  upstreamOwner: string,
  upstreamRepo: string,
  pr: { title: string; head: string; base: string; body: string }
) {
  const r = await ghJson<{ html_url?: unknown }>(
    token,
    "POST",
    `/repos/${encodeURIComponent(upstreamOwner)}/${encodeURIComponent(
      upstreamRepo
    )}/pulls`,
    pr
  );
  if (!r.ok || typeof r.json.html_url !== "string") {
    throw new Error("Cannot create PR.");
  }
  return { url: r.json.html_url };
}

export async function POST(req: NextRequest) {
  const session = readGitHubSession(req);
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const submissionsRepo =
    process.env.SHOWCASE_SUBMISSIONS_REPO || "Cunning3D/Cunning3d_website";
  const [upstreamOwner, upstreamRepo] = submissionsRepo.split("/");
  if (!upstreamOwner || !upstreamRepo) {
    return NextResponse.json(
      { error: "Server misconfigured: invalid SHOWCASE_SUBMISSIONS_REPO" },
      { status: 500 }
    );
  }

  const examplesPath = (process.env.SHOWCASE_EXAMPLES_PATH || "public/examples")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  const form = await req.formData();
  const titleInput = String(form.get("title") || "").trim();
  const descriptionInput = String(form.get("description") || "").trim();
  const tagsInput = String(form.get("tags") || "").trim();

  const tags = parseTags(tagsInput);

  const cda = form.get("cda");
  if (!(cda instanceof File)) {
    return NextResponse.json({ error: "Missing .cda file" }, { status: 400 });
  }
  if (!cda.name.toLowerCase().endsWith(".cda")) {
    return NextResponse.json({ error: "Invalid CDA file" }, { status: 400 });
  }
  if (cda.size <= 0 || cda.size > MAX_CDA_BYTES) {
    return NextResponse.json(
      { error: `CDA too large (max ${MAX_CDA_BYTES} bytes)` },
      { status: 400 }
    );
  }

  const image = form.get("image");
  const imageFile = image instanceof File ? image : null;
  if (imageFile) {
    if (imageFile.size <= 0 || imageFile.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: `Image too large (max ${MAX_IMAGE_BYTES} bytes)` },
        { status: 400 }
      );
    }
    const ext = path.extname(imageFile.name).toLowerCase();
    if (!ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: "Unsupported image type" },
        { status: 400 }
      );
    }
  }

  const token = session.accessToken;

  const meRes = await ghJson<{
    login?: unknown;
    html_url?: unknown;
  }>(token, "GET", "/user");
  if (!meRes.ok || typeof meRes.json.login !== "string") {
    return NextResponse.json(
      { error: "GitHub auth failed. Please sign in again." },
      { status: 401 }
    );
  }
  const login = meRes.json.login;
  const authorLink =
    typeof meRes.json.html_url === "string" ? meRes.json.html_url : "";

  const upstreamInfo = await getRepoInfo(token, upstreamOwner, upstreamRepo);
  const baseBranch = upstreamInfo.defaultBranch || "main";

  const baseFrom =
    titleInput ||
    String(cda.name || "")
      .replace(/\.cda$/i, "")
      .trim();

  const baseCandidates = [
    sanitizeBaseName(baseFrom),
    sanitizeBaseName(`${baseFrom} (${login})`),
    sanitizeBaseName(`${baseFrom} (${login}-${randomId(4)})`),
  ].filter((v, i, a) => a.indexOf(v) === i);

  let baseName = baseCandidates[0] || "Untitled";
  for (const candidate of baseCandidates) {
    // Avoid clobbering examples index/placeholder names.
    if (/^index$/i.test(candidate)) continue;
    const exists = await ghExists(
      token,
      upstreamOwner,
      upstreamRepo,
      `${examplesPath}/${candidate}.cda`
    );
    if (!exists) {
      baseName = candidate;
      break;
    }
  }

  await ensureFork(token, upstreamOwner, upstreamRepo, login);
  const forkOwner = login;
  const forkRepo = upstreamRepo;

  const forkInfo = await getRepoInfo(token, forkOwner, forkRepo);
  const forkBaseBranch = (await (async () => {
    try {
      await getRefSha(token, forkOwner, forkRepo, baseBranch);
      return baseBranch;
    } catch {
      return forkInfo.defaultBranch;
    }
  })()) as string;

  const baseSha = await getRefSha(token, forkOwner, forkRepo, forkBaseBranch);
  const branchSlug = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const branch = `showcase/${branchSlug || "item"}-${randomId(6)}`;

  await createBranch(token, forkOwner, forkRepo, branch, baseSha);

  const message = `showcase: add ${baseName}`;

  const cdaBuf = Buffer.from(await cda.arrayBuffer());
  await putFile(
    token,
    forkOwner,
    forkRepo,
    `${examplesPath}/${baseName}.cda`,
    cdaBuf.toString("base64"),
    branch,
    message
  );

  if (imageFile) {
    const ext = path.extname(imageFile.name).toLowerCase();
    const imgBuf = Buffer.from(await imageFile.arrayBuffer());
    await putFile(
      token,
      forkOwner,
      forkRepo,
      `${examplesPath}/${baseName}${ext}`,
      imgBuf.toString("base64"),
      branch,
      message
    );
  }

  const metadata = {
    title: titleInput || baseName,
    author: login,
    authorLink: authorLink || undefined,
    description: descriptionInput || "",
    tags: tags.length ? tags : ["Community"],
    featured: false,
  };
  const metaBuf = Buffer.from(JSON.stringify(metadata, null, 2) + "\n", "utf8");
  await putFile(
    token,
    forkOwner,
    forkRepo,
    `${examplesPath}/${baseName}.json`,
    metaBuf.toString("base64"),
    branch,
    message
  );

  const prTitle = `Showcase: ${titleInput || baseName}`;
  const prBody = [
    "This PR was created via the Cunning3D Showcase uploader.",
    "",
    `- Title: ${titleInput || baseName}`,
    `- Author: @${login}`,
    tags.length ? `- Tags: ${tags.join(", ")}` : null,
    descriptionInput ? `- Description: ${descriptionInput}` : null,
    "",
    "Files:",
    `- ${examplesPath}/${baseName}.cda`,
    imageFile ? `- ${examplesPath}/${baseName}${path.extname(imageFile.name).toLowerCase()}` : null,
    `- ${examplesPath}/${baseName}.json`,
  ]
    .filter(Boolean)
    .join("\n");

  const pr = await createPr(token, upstreamOwner, upstreamRepo, {
    title: prTitle,
    head: `${forkOwner}:${branch}`,
    base: baseBranch,
    body: prBody,
  });

  return NextResponse.json({ prUrl: pr.url });
}

