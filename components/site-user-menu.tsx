"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Github, LogOut, User, Upload } from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type GitHubMe =
  | {
      login: string;
      name?: string | null;
      avatarUrl: string;
      htmlUrl: string;
    }
  | null;

function normalizeBasePath(p: unknown) {
  const s = String(p || "").trim();
  if (!s) return "";
  const withLeadingSlash = s.startsWith("/") ? s : `/${s}`;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash;
}

const BASE_PATH = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);
const withBasePath = (p: string) =>
  `${BASE_PATH}${p.startsWith("/") ? p : `/${p}`}`;

export function SiteUserMenu() {
  const tNav = useTranslations("nav");
  const tAccount = useTranslations("account");
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [me, setMe] = useState<GitHubMe>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(withBasePath("/api/showcase/github/me"), {
          cache: "no-store",
        });
        if (!res.ok) {
          if (!cancelled) setMe(null);
          return;
        }
        const json = (await res.json()) as Exclude<GitHubMe, null>;
        if (!cancelled) setMe(json);
      } catch {
        if (!cancelled) setMe(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  const nextPath = useMemo(() => {
    const sp = searchParams?.toString();
    return `${pathname}${sp ? `?${sp}` : ""}`;
  }, [pathname, searchParams]);
  const loginHref = useMemo(
    () => withBasePath(`/api/showcase/github/login?next=${encodeURIComponent(nextPath)}`),
    [nextPath]
  );
  const logoutAction = useMemo(
    () => withBasePath(`/api/showcase/github/logout?next=${encodeURIComponent(nextPath)}`),
    [nextPath]
  );

  if (loading) {
    return <div className="h-9 w-9 rounded-md border bg-background/50" aria-hidden="true" />;
  }

  if (!me) {
    return (
      <a
        href={loginHref}
        className="h-9 px-3 inline-flex items-center justify-center rounded-md border bg-background hover:bg-accent transition-colors text-sm"
      >
        <Github className="w-4 h-4 mr-2" />
        {tNav("login")}
      </a>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="h-9 w-9 inline-flex items-center justify-center rounded-md border bg-background hover:bg-accent transition-colors"
          aria-label={tAccount("menuAria")}
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={me.avatarUrl} alt={me.login} />
            <AvatarFallback className="text-xs font-semibold">
              {me.login.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="min-w-0">
          <div className="truncate">{me.name || me.login}</div>
          <div className="text-xs font-normal text-muted-foreground truncate">
            @{me.login}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/account" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {tNav("account")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/showcase/submit" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            {tAccount("submitShowcase")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={me.htmlUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2"
          >
            <Github className="w-4 h-4" />
            {tAccount("viewGithub")}
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <form action={logoutAction} method="post" className="w-full">
            <button type="submit" className="flex w-full items-center gap-2">
              <LogOut className="w-4 h-4" />
              {tNav("logout")}
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
