import { getTranslations } from "next-intl/server"
import { HeroSection } from "./sections/HeroSection"

export const metadata = {
  title: "About Me | Alex Chen",
  description: "Creative Technologist & 3D Artist",
}

export default async function AboutMePage() {
  const t = await getTranslations("mePage")

  // Enhanced profile data with social links
  const profile = {
    name: "Alex Chen",
    title: "Creative Technologist & 3D Artist",
    location: "San Francisco, CA",
    email: "alex@example.com",
    avatar: "/avatar.png",
    bio: "Passionate about building elegant solutions to complex problems. With over 8 years of experience in web development and 3D graphics.",
    background: "Started as a self-taught developer, then studied Computer Science at UC Berkeley. Worked at several startups before focusing on procedural design tools.",
    interests: ["Procedural Modeling", "Generative Art", "Open Source", "Rock Climbing", "Photography"],
    social: {
      github: "https://github.com/alexchen",
      twitter: "https://twitter.com/alexchen",
      linkedin: "https://linkedin.com/in/alexchen",
    },
    stats: {
      experience: "8+ Years",
      projects: "50+",
      clients: "100+",
    },
  }

  return (
    <main className="relative">
      {/* Hero Section */}
      <HeroSection profile={profile} />

      {/* Placeholder for additional sections */}
      <div id="contact" className="min-h-[50vh] flex items-center justify-center text-muted-foreground">
        <p>More sections coming soon...</p>
      </div>
    </main>
  )
}
