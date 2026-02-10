'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Star, ExternalLink, Heart, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Types
export interface ShowcaseItem {
  id: string;
  title: string;
  author: string;
  authorLink?: string;
  image: string;
  description: string;
  tags: string[];
  featured?: boolean;
  likes?: number;
  views?: number;
}

export interface GalleryGridProps {
  items: ShowcaseItem[];
  loading?: boolean;
  onItemClick?: (item: ShowcaseItem) => void;
  className?: string;
}

// Loading Skeleton
function GallerySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[4/3] rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Empty State
function EmptyState() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
        <Eye className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No items found
      </h3>
      <p className="text-muted-foreground max-w-md">
        Try adjusting your search or filters to find what you&apos;re looking for.
      </p>
    </motion.div>
  );
}

// Individual Gallery Card
function GalleryCard({
  item,
  index,
  onClick,
}: {
  item: ShowcaseItem;
  index: number;
  onClick?: (item: ShowcaseItem) => void;
}) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className={cn(
        "group relative",
        "bg-background/60 dark:bg-background/40",
        "backdrop-blur-sm",
        "border border-border/50 dark:border-border/30",
        "rounded-2xl",
        "overflow-hidden",
        "shadow-sm hover:shadow-xl",
        "transition-all duration-500",
        "cursor-pointer",
        item.featured && "ring-2 ring-primary/20"
      )}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick?.(item)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </motion.div>

        {/* Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: isHovered ? 0.9 : 0.6 }}
          transition={{ duration: 0.3 }}
        />

        {/* Featured Badge */}
        {item.featured && (
          <motion.div
            className="absolute top-3 right-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Badge
              className={cn(
                "bg-amber-500/90 text-white border-0",
                "shadow-lg shadow-amber-500/30",
                "font-semibold text-xs",
                "px-2 py-0.5"
              )}
            >
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </Badge>
          </motion.div>
        )}

        {/* Hover Overlay Content */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            className={cn(
              "flex items-center gap-2 px-4 py-2",
              "bg-background/90 backdrop-blur-sm",
              "rounded-full text-sm font-medium",
              "shadow-lg",
              "hover:bg-primary hover:text-primary-foreground",
              "transition-colors duration-200"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className="w-4 h-4" />
            View
          </motion.button>
          <motion.button
            className={cn(
              "flex items-center gap-2 px-4 py-2",
              "bg-background/90 backdrop-blur-sm",
              "rounded-full text-sm font-medium",
              "shadow-lg",
              "hover:bg-primary hover:text-primary-foreground",
              "transition-colors duration-200"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ExternalLink className="w-4 h-4" />
            Open
          </motion.button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative p-4 space-y-3">
        {/* Title */}
        <motion.h3
          className={cn(
            "font-semibold text-base leading-tight",
            "text-foreground group-hover:text-primary",
            "line-clamp-1",
            "transition-colors duration-300"
          )}
        >
          {item.title}
        </motion.h3>

        {/* Author */}
        <p className="text-xs text-muted-foreground">
          by{' '}
          <span className="font-medium text-foreground/80 hover:text-primary transition-colors cursor-pointer">
            {item.author}
          </span>
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {item.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className={cn(
                "text-[10px] px-1.5 py-0.5 font-medium",
                "bg-muted/50 hover:bg-muted",
                "text-muted-foreground hover:text-foreground",
                "transition-colors duration-200"
              )}
            >
              {tag}
            </Badge>
          ))}
          {item.tags.length > 3 && (
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0.5 font-medium bg-muted/50 text-muted-foreground"
            >
              +{item.tags.length - 3}
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Main Gallery Grid Component
export function GalleryGrid({ items, loading = false, onItemClick, className }: GalleryGridProps) {
  if (loading) return <GallerySkeleton />;
  if (items.length === 0) return <EmptyState />;

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <GalleryCard key={item.id} item={item} index={index} onClick={onItemClick} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default GalleryGrid;
