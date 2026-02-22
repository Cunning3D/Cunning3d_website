"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Github, Twitter, Linkedin, Mail, Download, ChevronDown, MapPin, Globe } from "lucide-react"
import { useReducedMotion } from "@/lib/animations/hooks"
import { cn } from "@/lib/utils"

interface HeroSectionProps {
  profile: {
    name: string
    title: string
    location: string
    email: string
    avatarSrc?: string
    bio: string
    interests?: string[]
    resume?: { href: string; fileName: string }
    social?: {
      github?: string
      twitter?: string
      linkedin?: string
      website?: string
    }
    ui: {
      downloadResume: string
      getInTouch: string
      scrollToExplore: string
    }
  }
}

export function HeroSection({ profile }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion()
  const easeStandard = [0.4, 0, 0.2, 1] as const

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
        delayChildren: prefersReducedMotion ? 0 : 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: easeStandard,
      },
    },
  }

  const avatarVariants = {
    hidden: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.8,
        ease: easeStandard,
      },
    },
  }

  const handleScrollToContact = () => {
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/50" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <motion.div
        className="relative z-10 container mx-auto px-4 py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Avatar */}
          <motion.div variants={avatarVariants} className="mb-8">
            <div className="relative">
              <Avatar className="w-40 h-40 md:w-48 md:h-48 ring-4 ring-background shadow-2xl">
                <AvatarImage src={profile.avatarSrc} alt={profile.name} />
                <AvatarFallback className="text-5xl font-bold">
                  {profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-background" />
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
          >
            {profile.name}
          </motion.h1>

          {/* Title */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground mb-6"
          >
            {profile.title}
          </motion.p>

          {/* Meta */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-muted-foreground mb-6"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="break-all">{profile.email}</span>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed"
          >
            {profile.bio}
          </motion.p>

          {/* Interests */}
          {profile.interests?.length ? (
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2 mb-10">
              {profile.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="rounded-full">
                  {interest}
                </Badge>
              ))}
            </motion.div>
          ) : (
            <div className="mb-10" />
          )}

          {/* Social Links */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 mb-10"
          >
            {profile.social?.github && (
              <a
                href={profile.social?.github}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "rounded-full w-12 h-12 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                )}
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {profile.social?.twitter && (
              <a
                href={profile.social?.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "rounded-full w-12 h-12 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                )}
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {profile.social?.linkedin && (
              <a
                href={profile.social?.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "rounded-full w-12 h-12 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                )}
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {profile.social?.website && (
              <a
                href={profile.social?.website}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "rounded-full w-12 h-12 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                )}
                aria-label="Website"
              >
                <Globe className="w-5 h-5" />
              </a>
            )}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            {profile.resume?.href ? (
              <a
                href={profile.resume.href}
                download={profile.resume.fileName}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                )}
              >
                <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                {profile.ui.downloadResume}
              </a>
            ) : null}
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 text-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              onClick={handleScrollToContact}
            >
              <Mail className="w-5 h-5 mr-2" />
              {profile.ui.getInTouch}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center text-muted-foreground cursor-pointer"
          onClick={handleScrollToContact}
        >
          <span className="text-sm mb-2">{profile.ui.scrollToExplore}</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </section>
  )
}
