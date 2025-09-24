"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, Play, X } from "lucide-react";

// YouTube videos from @abramovich_hybrid_visuals
const youtubeVideos = [
  {
    id: "video-1",
    title: "CGI Reel 2025",
    description: "Professional video production showcase",
    embedId: "oSSsYl-Ij-s",
    tags: ["cinematic", "reel", "showcase"],
    category: "Featured Work"
  },
  {
    id: "video-2", 
    title: "WHY? - New York City Ad & Music Video",
    description: "High-quality commercial video content",
    embedId: "1-eL2m4jjYk",
    tags: ["commercial", "brand", "production"],
    category: "Commercial"
  },
  {
    id: "video-3",
    title: "CITY OF MERCY - Las Vegas Ad & Music Video",
    description: "Artistic and engaging visual content",
    embedId: "CELPdp9hXZU",
    tags: ["creative", "artistic", "visual"],
    category: "Creative"
  }
];

export default function Portfolio() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6" style={{color: '#F7F10A'}}>
            Our Portfolio
          </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Explore our recent work from{" "}
          <a 
            href="https://www.youtube.com/@abramovich_hybrid_visuals" 
            target="_blank" 
            rel="noopener noreferrer"
            className="brand-accent hover:text-yellow-300 transition-colors inline-flex items-center gap-1"
          >
            Abramovich Hybrid Visuals
            <ExternalLink className="w-4 h-4" />
          </a>
          {" "}and see how we create compelling content that drives results.
        </p>
          
          {/* YouTube Channel CTA */}
          <div className="flex justify-center mb-12">
                        <a 
                          href="https://www.youtube.com/@abramovich_hybrid_visuals" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Button className="btn-primary">
                            <Play className="w-4 h-4 mr-2" />
                            Visit Our YouTube Channel
                          </Button>
                        </a>
          </div>
        </div>


        {/* Video Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {youtubeVideos.map((video) => (
            <Card 
              key={video.id} 
              className="bg-gray-800 border-gray-700 hover:shadow-lg transition-all duration-300 hover:border-red-500/50 cursor-pointer"
              onClick={() => setSelectedVideo(video.embedId)}
            >
              <div className="aspect-[4/5] bg-gray-900 rounded-t-lg overflow-hidden relative group">
                <img
                  src={`https://img.youtube.com/vi/${video.embedId}/hqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to standard quality if high quality fails
                    const target = e.target as HTMLImageElement;
                    target.src = `https://img.youtube.com/vi/${video.embedId}/sddefault.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: '#F7F10A'}}>
                    <Play className="w-8 h-8 text-black ml-1" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white group-hover:text-yellow-400 transition-colors">
                      {video.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400 mt-2">
                      {video.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-gray-600 text-gray-400 hover:border-yellow-500/50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-red-900/20 to-gray-800/20 rounded-lg border border-red-500/20">
          <h2 className="text-2xl font-bold mb-4" style={{color: '#F7F10A'}}>Ready to Create Something Amazing?</h2>
          <p className="text-gray-300 mb-6">Let&apos;s discuss your next video project and bring your vision to life.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="btn-success">
                Start Your Project
              </Button>
            </Link>
            <Link href="/pricing">
              <Button className="btn-secondary">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>

        {/* Video Modal */}
        <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
          <DialogContent className="max-w-4xl w-full bg-black border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-white">Video Player</DialogTitle>
            </DialogHeader>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              {selectedVideo && (
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&rel=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}