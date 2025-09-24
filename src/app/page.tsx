import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Edit3, Share2, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/videos/Media Production Reel 1080.mov" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        
        {/* Content */}
        <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-6xl mx-auto">
            {/* Mobile-first responsive heading */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2" style={{color: '#F7F10A'}}>
              <span className="block sm:inline">Visuals that</span>{" "}
              <span className="block sm:inline bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                scale your vision
              </span>
            </h1>
            
            {/* Mobile-optimized subtitle */}
            <p className="text-lg xs:text-xl sm:text-2xl md:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-2">
              We plan, shoot, edit, and ship content that performs on social and converts on your site.
            </p>
            
            {/* Mobile-responsive button layout */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-2xl mx-auto px-4">
              <Link href="/portfolio" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto btn-primary text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8">
                  <span className="flex items-center justify-center">
                    View Portfolio
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </span>
                </Button>
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto btn-secondary text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8">
                  See Pricing
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto btn-success text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Mobile scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce sm:hidden">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{color: '#F7F10A'}}>
                      What We Do
                    </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From concept to delivery, we handle every aspect of your content creation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
                        <Card className="text-center group hover:shadow-lg transition-shadow trust-card">
                          <CardHeader>
                            <div className="mx-auto w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600/20 transition-colors">
                              <Camera className="h-8 w-8 text-blue-400" />
                            </div>
                <CardTitle className="text-white">Cinematography</CardTitle>
                <CardDescription className="text-gray-300">
                  Professional shooting with state-of-the-art equipment and creative direction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• 4K/8K video production</li>
                  <li>• Drone cinematography</li>
                  <li>• Professional lighting</li>
                  <li>• Creative direction</li>
                </ul>
              </CardContent>
            </Card>

                        <Card className="text-center group hover:shadow-lg transition-shadow trust-card">
                          <CardHeader>
                            <div className="mx-auto w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600/20 transition-colors">
                              <Edit3 className="h-8 w-8 text-blue-400" />
                            </div>
                <CardTitle className="text-white">Post Production</CardTitle>
                <CardDescription className="text-gray-300">
                  Expert editing, color grading, and motion graphics to bring your vision to life
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• Professional editing</li>
                  <li>• Color grading</li>
                  <li>• Motion graphics</li>
                  <li>• Sound design</li>
                </ul>
              </CardContent>
            </Card>

                        <Card className="text-center group hover:shadow-lg transition-shadow trust-card">
                          <CardHeader>
                            <div className="mx-auto w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600/20 transition-colors">
                              <Share2 className="h-8 w-8 text-blue-400" />
                            </div>
                <CardTitle className="text-white">Social Distribution</CardTitle>
                <CardDescription className="text-gray-300">
                  Optimized content for every platform with strategic distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• Platform optimization</li>
                  <li>• Content scheduling</li>
                  <li>• Performance analytics</li>
                  <li>• A/B testing</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{color: '#F7F10A'}}>
                  Ready to Launch Your Content Engine?
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  We&apos;ll stand up your content engine within 14 days. If we miss it, we work for free until it&apos;s live.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/pricing">
                    <Button size="lg" className="w-full sm:w-auto bg-white text-blue-900 hover:bg-gray-100">
                      View Pricing Plans
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" className="w-full sm:w-auto btn-success">
                      Start Your Project
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
    </div>
  );
}