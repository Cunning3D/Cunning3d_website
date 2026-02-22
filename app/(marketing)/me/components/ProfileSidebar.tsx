import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Download, Github, Linkedin, Mail, MapPin, Twitter, Globe } from "lucide-react"
import { CopyButton } from "./CopyButton"
import { SmoothScrollLink } from "./SmoothScrollLink"
import type { MeProfile } from "@/config/me"

export interface SidebarNavItem {
  id: string
  label: string
}

export function ProfileSidebar({
  profile,
  tocTitle,
  navItems,
  copyEmailLabel,
  downloadPdfLabel,
  downloadPdfHref,
  sendEmailLabel,
  copiedTitle,
  copiedDescription,
}: {
  profile: MeProfile
  tocTitle: string
  navItems: SidebarNavItem[]
  copyEmailLabel: string
  downloadPdfLabel: string
  downloadPdfHref: string
  sendEmailLabel: string
  copiedTitle: string
  copiedDescription: string
}) {
  return (
    <div className="space-y-4">
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <CardContent className="relative p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-14 h-14 ring-2 ring-background shadow-sm">
              <AvatarImage src={profile.avatarSrc} alt={profile.name} />
              <AvatarFallback className="font-semibold">{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="font-semibold truncate">{profile.name}</div>
              <div className="text-sm text-muted-foreground truncate">{profile.title}</div>
              <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{profile.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{profile.email}</span>
                </div>
              </div>
            </div>
          </div>

          {profile.interests?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="rounded-full">
                  {interest}
                </Badge>
              ))}
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <CopyButton
              value={profile.email}
              label={copyEmailLabel}
              copiedTitle={copiedTitle}
              copiedDescription={copiedDescription}
            />
            <a
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              href={downloadPdfHref}
            >
              <Download className="w-4 h-4 mr-2" />
              {downloadPdfLabel}
            </a>
            <a className={cn(buttonVariants({ size: "sm" }))} href={`mailto:${profile.email}`}>
              {sendEmailLabel}
            </a>
          </div>

          {profile.social ? (
            <div className="mt-4 flex items-center gap-2">
              {profile.social.github ? (
                <a
                  href={profile.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "w-9 h-9 p-0"
                  )}
                >
                  <Github className="w-4 h-4" />
                </a>
              ) : null}
              {profile.social.linkedin ? (
                <a
                  href={profile.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "w-9 h-9 p-0"
                  )}
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              ) : null}
              {profile.social.twitter ? (
                <a
                  href={profile.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "w-9 h-9 p-0"
                  )}
                >
                  <Twitter className="w-4 h-4" />
                </a>
              ) : null}
              {profile.social.website ? (
                <a
                  href={profile.social.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Website"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "w-9 h-9 p-0"
                  )}
                >
                  <Globe className="w-4 h-4" />
                </a>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            {tocTitle}
          </div>
          <nav className="grid gap-1">
            {navItems.map((item) => (
              <SmoothScrollLink
                key={item.id}
                href={`#${item.id}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md px-2 py-1 hover:bg-accent"
              >
                {item.label}
              </SmoothScrollLink>
            ))}
          </nav>
        </CardContent>
      </Card>
    </div>
  )
}
