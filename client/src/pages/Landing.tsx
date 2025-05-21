import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const Landing = () => {
  const [, navigate] = useLocation();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="py-4 px-4 flex justify-between items-center">
        <div className="text-xl font-bold text-primary flex items-center">
          <span className="material-icons mr-2">record_voice_over</span>
          <span className="hidden sm:inline">Transcription App</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button 
            variant="outline"
            size="sm"
            onClick={() => navigate("/app")}
            className="whitespace-nowrap"
          >
            Go to App
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-12 md:pt-20 pb-12 md:pb-16 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
          Turn Speech into Text,{" "}
          <span className="text-primary">Instantly</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Fast, accurate audio transcription with advanced speaker identification and easy export options.
        </p>
        <Button 
          size="lg" 
          className="px-6 md:px-8 py-5 md:py-6 text-base md:text-lg rounded-lg bg-primary hover:bg-primary/90 transition-all"
          onClick={() => navigate("/app")}
        >
          Try it Now — Free
        </Button>
      </header>

      {/* Feature Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-foreground">
            Powerful Features for Your Transcription Needs
          </h2>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons text-primary">speed</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Rapid Transcription</h3>
              <p className="text-muted-foreground">
                Convert audio to text in minutes, not hours. Our AI-powered engine works quickly on files of any length.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons text-primary">record_voice_over</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Speaker Identification</h3>
              <p className="text-muted-foreground">
                Automatically identify different speakers in your audio with our advanced diarization technology.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons text-primary">description</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Multiple Export Options</h3>
              <p className="text-muted-foreground">
                Download your transcripts as PDF or DOCX files, perfect for reports, articles, or research papers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-12 md:py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-foreground">
            Perfect For
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
            <div className="p-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="material-icons text-blue-600 dark:text-blue-400">article</span>
              </div>
              <h3 className="font-semibold mb-1 text-foreground">Journalists</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Transcribe interviews quickly
              </p>
            </div>
            
            <div className="p-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="material-icons text-green-600 dark:text-green-400">school</span>
              </div>
              <h3 className="font-semibold mb-1 text-foreground">Students</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Convert lectures to text
              </p>
            </div>
            
            <div className="p-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="material-icons text-amber-600 dark:text-amber-400">gavel</span>
              </div>
              <h3 className="font-semibold mb-1 text-foreground">Legal Pros</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Document depositions
              </p>
            </div>
            
            <div className="p-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="material-icons text-purple-600 dark:text-purple-400">podcasts</span>
              </div>
              <h3 className="font-semibold mb-1 text-foreground">Content Creators</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Transcribe videos and podcasts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-foreground">
            Powered by Modern Technology
          </h2>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 items-center max-w-2xl mx-auto mb-8 md:mb-10">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 mb-2 flex items-center justify-center">
                <span className="material-icons text-3xl text-blue-500 dark:text-blue-400">psychology</span>
              </div>
              <span className="text-xs sm:text-sm font-medium">OpenAI Whisper</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 mb-2 flex items-center justify-center">
                <span className="material-icons text-3xl text-blue-400">code</span>
              </div>
              <span className="text-xs sm:text-sm font-medium">React</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 mb-2 flex items-center justify-center">
                <span className="material-icons text-3xl text-sky-500 dark:text-sky-400">style</span>
              </div>
              <span className="text-xs sm:text-sm font-medium">Tailwind CSS</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 mb-2 flex items-center justify-center">
                <span className="material-icons text-3xl text-indigo-500 dark:text-indigo-400">analytics</span>
              </div>
              <span className="text-xs sm:text-sm font-medium">Custom Processing</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Built with a modern React and Tailwind CSS frontend, our app leverages OpenAI's Whisper model combined with custom post-processing to deliver accurate transcriptions with speaker identification.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-primary/90 to-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
            Ready to Transform Your Audio?
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto">
            Start transcribing your content with our powerful, easy-to-use platform.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="px-6 md:px-8 py-5 md:py-6 text-base md:text-lg bg-white text-primary hover:bg-gray-100 rounded-lg transition-all"
            onClick={() => navigate("/app")}
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 md:py-8 bg-gray-800 dark:bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Shreenidhi Vasishta</h2>
            <p className="mb-4 md:mb-6 text-xs md:text-sm opacity-75">
              © {new Date().getFullYear()} Voice Transcription App. All rights reserved.
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;