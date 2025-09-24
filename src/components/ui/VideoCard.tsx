"use client"

import Image from "next/image"
import { Play, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { VideoItem } from "@/data/portfolio"

interface VideoCardProps {
  video: VideoItem
  onClick: () => void
}

export function VideoCard({ video, onClick }: VideoCardProps) {
  return (
    <div 
      className="group cursor-pointer relative overflow-hidden rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <Play className="h-8 w-8 text-white" fill="currentColor" />
          </div>
        </div>

        {/* Duration badge */}
        {video.duration && (
          <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {video.duration}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
          {video.title}
        </h3>
        
        {video.client && (
          <p className="text-sm text-muted-foreground mb-3">
            {video.client}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {video.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
