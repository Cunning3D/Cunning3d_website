"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, Layers, Grid3X3, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Animated background gradient component
function AnimatedGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Primary gradient orb */}
      <motion.div
        className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-primary-500) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary gradient orb */}
      <motion.div
        className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, -40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-gray-400) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-gray-400) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}

// Particle effect component
function ParticleField() {
  const particles = React.useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/20 dark:bg-primary/30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [-20, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// Search bar component with glassmorphism
function SearchBar({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn(
        "relative w-full max-w-2xl mx-auto group",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="relative flex items-center">
        <div className="absolute left-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200">
          <Search className="h-5 w-5" />
        </div>
        <Input
          type="text"
          placeholder="Search showcases, components, and more..."
          className={cn(
            "w-full pl-12 pr-4 py-6 text-base",
            "bg-background/60 dark:bg-background/40",
            "backdrop-blur-xl",
            "border border-border/50 dark:border-border/30",
            "rounded-2xl",
            "shadow-lg shadow-black/5 dark:shadow-black/20",
            "placeholder:text-muted-foreground/70",
            "focus:bg-background/80 dark:focus:bg-background/60",
            "focus:border-primary/50",
            "focus:ring-4 focus:ring-primary/10",
            "transition-all duration-300"
          )}
        />
        <div className="absolute right-3 hidden sm:flex items-center gap-1">
          <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>
    </motion.div>
  );
}

// Stat card component with glassmorphism
interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  delay?: number;
}

function StatCard({ icon, value, label, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      className={cn(
        "flex items-center gap-3 px-5 py-4",
        "bg-background/40 dark:bg-background/20",
        "backdrop-blur-xl",
        "border border-border/30 dark:border-border/20",
        "rounded-2xl",
        "shadow-lg shadow-black/5 dark:shadow-black/10",
        "hover:bg-background/60 dark:hover:bg-background/30",
        "hover:border-primary/20",
        "transition-all duration-300",
        "group"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
          {value}
        </span>
        <span className="text-xs text-muted-foreground font-medium">
          {label}
        </span>
      </div>
    </motion.div>
  );
}

// Main Hero Section Component
export interface HeroSectionProps {
  title: string;
  subtitle?: string;
  totalItems: number;
  categories: string[];
  className?: string;
}

export function HeroSection({
  title,
  subtitle,
  totalItems,
  categories,
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative w-full min-h-[600px] lg:min-h-[700px]",
        "flex flex-col items-center justify-center",
        "overflow-hidden",
        "py-20 px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {/* Animated Background */}
      <AnimatedGradient />

      {/* Particle Effect */}
      <ParticleField />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge
            variant="secondary"
            className={cn(
              "px-4 py-1.5 text-sm font-medium",
              "bg-primary/10 text-primary border-primary/20",
              "dark:bg-primary/20 dark:text-primary dark:border-primary/30"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Showcase Gallery
          </Badge>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          className={cn(
            "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
            "font-bold tracking-tight",
            "text-foreground",
            "mb-6",
            "font-heading"
          )}
          style={{ fontFamily: "var(--font-family-heading)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
            {title}
          </span>
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            className={cn(
              "text-lg sm:text-xl md:text-2xl",
              "text-muted-foreground",
              "max-w-3xl mx-auto",
              "mb-10",
              "leading-relaxed",
              "font-sans"
            )}
            style={{ fontFamily: "var(--font-family-sans)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Search Bar */}
        <SearchBar className="mb-12" />

        {/* Stats Row */}
        <motion.div
          className={cn(
            "flex flex-wrap items-center justify-center gap-3 sm:gap-4",
            "mb-8"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <StatCard
            icon={<Layers className="h-5 w-5" />}
            value={totalItems}
            label="Total Items"
            delay={0.4}
          />
          <StatCard
            icon={<Grid3X3 className="h-5 w-5" />}
            value={categories.length}
            label="Categories"
            delay={0.5}
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            value="99%"
            label="Satisfaction"
            delay={0.6}
          />
        </motion.div>

        {/* Category Tags */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {categories.slice(0, 5).map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
            >
              <Badge
                variant="outline"
                className={cn(
                  "px-3 py-1 text-xs font-medium",
                  "bg-background/50 dark:bg-background/30",
                  "border-border/50 hover:border-primary/50",
                  "hover:bg-primary/5 dark:hover:bg-primary/10",
                  "transition-all duration-300",
                  "cursor-pointer"
                )}
              >
                {category}
              </Badge>
            </motion.div>
          ))}
          {categories.length > 5 && (
            <Badge
              variant="outline"
              className={cn(
                "px-3 py-1 text-xs font-medium",
                "bg-background/50 dark:bg-background/30",
                "border-border/50"
              )}
            >
              +{categories.length - 5} more
            </Badge>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
