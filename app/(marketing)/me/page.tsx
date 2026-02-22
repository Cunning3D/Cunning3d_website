import type { Metadata } from "next"
import { getLocale } from "next-intl/server"
import { mePageByLocale, type MeLocale } from "@/config/me"
import { ProfileSidebar } from "./components/ProfileSidebar"
import { HighlightsSection } from "./sections/HighlightsSection"
import { ExperienceSection } from "./sections/ExperienceSection"
import { ProjectsSection } from "./sections/ProjectsSection"
import { SkillsSection } from "./sections/SkillsSection"
import { EducationSection } from "./sections/EducationSection"
import { ContactSection } from "./sections/ContactSection"

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as MeLocale;
  const config = mePageByLocale[locale] ?? mePageByLocale.zh;
  return {
    title: config.meta.title,
    description: config.meta.description,
  };
}

export default async function AboutMePage() {
  const locale = (await getLocale()) as MeLocale;
  const config = mePageByLocale[locale] ?? mePageByLocale.zh;

  const navItems = [
    { id: "about", label: config.meta.title },
    { id: "experience", label: config.experience.title },
    { id: "projects", label: config.projects.title },
    { id: "skills", label: config.skills.title },
    { id: "education", label: config.education.title },
    { id: "contact", label: config.contact.title },
  ]

  return (
    <main className="relative">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,hsl(var(--primary)/0.14),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,hsl(var(--secondary)/0.14),transparent_40%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_75%)] opacity-40" />
      </div>

      <div className="container py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          <aside className="lg:sticky lg:top-24 self-start">
            <ProfileSidebar
              profile={config.profile}
              tocTitle={config.tocTitle}
              navItems={navItems}
              copyEmailLabel={config.contact.copyEmail}
              sendEmailLabel={config.contact.sendEmail}
              copiedTitle={config.contact.copiedTitle}
              copiedDescription={config.contact.copiedDescription}
            />
          </aside>

          <div className="space-y-10 md:space-y-12">
            <section id="about" className="scroll-mt-24">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                {config.profile.name}
              </h1>
              <p className="mt-2 text-lg md:text-xl text-muted-foreground">{config.profile.title}</p>
              <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                {config.profile.bio}
              </p>
            </section>

            <HighlightsSection title={config.highlights.title} items={config.highlights.items} />
            <ExperienceSection id="experience" title={config.experience.title} items={config.experience.items} />
            <ProjectsSection id="projects" title={config.projects.title} items={config.projects.items} />
            <SkillsSection id="skills" title={config.skills.title} groups={config.skills.groups} />
            <EducationSection id="education" title={config.education.title} items={config.education.items} />
            <ContactSection
              id="contact"
              title={config.contact.title}
              subtitle={config.contact.subtitle}
              email={config.profile.email}
              sendEmailLabel={config.contact.sendEmail}
              copyEmailLabel={config.contact.copyEmail}
              copiedTitle={config.contact.copiedTitle}
              copiedDescription={config.contact.copiedDescription}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
