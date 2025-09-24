"use client"

import { useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { VideoItem } from "@/data/portfolio"

interface VideoModalProps {
  video: VideoItem | null
  isOpen: boolean
  onClose: () => void
}

export function VideoModal({ video, isOpen, onClose }: VideoModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!isOpen && iframeRef.current) {
      // Pause video when modal closes
      const iframe = iframeRef.current
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
      }
    }
  }, [isOpen])

  if (!video) return null

  const getEmbedUrl = () => {
    switch (video.embedType) {
      case "youtube":
        return `https://www.youtube.com/embed/${video.embedIdOrUrl}?autoplay=1&rel=0&modestbranding=1`
      case "vimeo":
        return `https://player.vimeo.com/video/${video.embedIdOrUrl}?autoplay=1&title=0&byline=0&portrait=0`
      case "mp4":
        return video.embedIdOrUrl
      default:
        return ""
    }
  }

  const renderVideo = () => {
    if (video.embedType === "mp4") {
      return (
        <video
          controls
          autoPlay
          playsInline
          className="w-full h-full"
          onEnded={onClose}
        >
          <source src={video.embedIdOrUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )
    }

    return (
      <iframe
        ref={iframeRef}
        src={getEmbedUrl()}
        className="w-full aspect-video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={video.title}
      />
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold">
            {video.title}
          </DialogTitle>
          {video.client && (
            <p className="text-muted-foreground">
              Client: {video.client}
            </p>
          )}
        </DialogHeader>
        
        <div className="px-6 pb-6">
          <div className="relative bg-black rounded-lg overflow-hidden">
            {renderVideo()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
