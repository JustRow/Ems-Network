'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { DUMMY_NEWS } from '@/lib/dummy-data'
import { cn } from '@/lib/utils'

const CATEGORIES = ['All', 'Police', 'Medical', 'Fire', 'Community'] as const

const CATEGORY_COLORS: Record<string, string> = {
  All: 'bg-primary',
  Police: 'bg-police',
  Medical: 'bg-medical',
  Fire: 'bg-fire',
  Community: 'bg-helpline',
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  Police: 'from-police to-police/80',
  Medical: 'from-medical to-medical/80',
  Fire: 'from-fire to-fire/80',
  Community: 'from-helpline to-helpline/80',
}

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[number]>('All')
  const [selectedArticle, setSelectedArticle] = useState<typeof DUMMY_NEWS[0] | null>(null)
  const [isLoading] = useState(false)

  const filteredNews = selectedCategory === 'All'
    ? DUMMY_NEWS
    : DUMMY_NEWS.filter((article) => article.category === selectedCategory)

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-background max-w-[430px] mx-auto">
        {/* Article header */}
        <div className={cn(
          'h-48 bg-gradient-to-br p-4 flex flex-col',
          CATEGORY_GRADIENTS[selectedArticle.category] || 'from-primary to-primary/80'
        )}>
          <button
            onClick={() => setSelectedArticle(null)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="mt-auto">
            <span className="inline-block px-2 py-1 bg-white/20 rounded-full text-xs text-white mb-2">
              {selectedArticle.category}
            </span>
            <h1 className="text-xl font-bold text-white text-balance">
              {selectedArticle.title}
            </h1>
          </div>
        </div>

        {/* Article content */}
        <div className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span>{selectedArticle.source}</span>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {selectedArticle.timestamp}
            </div>
          </div>

          <p className="text-foreground leading-relaxed">
            {selectedArticle.content}
          </p>

          <button
            onClick={() => setSelectedArticle(null)}
            className="mt-6 text-primary font-medium hover:underline"
          >
            ← Back to News
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background max-w-[430px] mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg z-10 border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <Link
            href="/app"
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <h1 className="text-xl font-bold text-foreground">News</h1>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                selectedCategory === category
                  ? cn(CATEGORY_COLORS[category], 'text-white')
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* News list */}
      <div className="p-4 space-y-4">
        {isLoading ? (
          // Skeleton loaders
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-24 h-24 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : (
          filteredNews.map((article, index) => (
            <motion.button
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedArticle(article)}
              className="w-full flex gap-4 text-left"
            >
              {/* Thumbnail */}
              <div className={cn(
                'w-24 h-24 rounded-xl flex-shrink-0 bg-gradient-to-br',
                CATEGORY_GRADIENTS[article.category] || 'from-muted to-muted'
              )} />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-xs text-white',
                    CATEGORY_COLORS[article.category] || 'bg-primary'
                  )}>
                    {article.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{article.timestamp}</span>
                </div>
                <h3 className="font-medium text-foreground line-clamp-2 text-sm">
                  {article.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">{article.source}</p>
              </div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  )
}
