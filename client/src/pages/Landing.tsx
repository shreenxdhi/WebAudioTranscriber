import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const Landing = () => {
  const [, navigate] = useLocation();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <header className="pt-20 pb-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Turn Speech into Text,{" "}
          <span className="text-primary">Instantly</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Fast, accurate audio transcription with advanced speaker identification and easy export options.
        </p>
        <Button 
          size="lg" 
          className="px-8 py-6 text-lg rounded-lg bg-primary hover:bg-primary/90 transition-all"
          onClick={() => navigate("/app")}
        >
          Try it Now — Free
        </Button>
      </header>

      {/* Feature Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Powerful Features for Your Transcription Needs
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons text-primary">speed</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Rapid Transcription</h3>
              <p className="text-gray-600">
                Convert audio to text in minutes, not hours. Our AI-powered engine works quickly on files of any length.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons text-primary">record_voice_over</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Speaker Identification</h3>
              <p className="text-gray-600">
                Automatically identify different speakers in your audio with our advanced diarization technology.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons text-primary">description</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple Export Options</h3>
              <p className="text-gray-600">
                Download your transcripts as PDF or DOCX files, perfect for reports, articles, or research papers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Perfect For
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="material-icons text-blue-600">article</span>
              </div>
              <h3 className="font-semibold mb-1">Journalists</h3>
              <p className="text-gray-600 text-sm">
                Transcribe interviews quickly and accurately
              </p>
            </div>
            
            <div className="p-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="material-icons text-green-600">school</span>
              </div>
              <h3 className="font-semibold mb-1">Students</h3>
              <p className="text-gray-600 text-sm">
                Convert lectures and study sessions to text
              </p>
            </div>
            
            <div className="p-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="material-icons text-amber-600">gavel</span>
              </div>
              <h3 className="font-semibold mb-1">Legal Professionals</h3>
              <p className="text-gray-600 text-sm">
                Document depositions and case materials
              </p>
            </div>
            
            <div className="p-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="material-icons text-purple-600">podcasts</span>
              </div>
              <h3 className="font-semibold mb-1">Content Creators</h3>
              <p className="text-gray-600 text-sm">
                Generate transcripts for videos and podcasts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8 text-gray-800">
            Powered by Modern Technology
          </h2>
          <div className="flex flex-wrap justify-center gap-8 items-center max-w-2xl mx-auto mb-10">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 mb-2 flex items-center justify-center">
                <span className="material-icons text-3xl text-blue-500">psychology</span>
              </div>
              <span className="text-sm font-medium">OpenAI Whisper</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 mb-2 flex items-center justify-center">
                <span className="material-icons text-3xl text-blue-400">code</span>
              </div>
              <span className="text-sm font-medium">React</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 mb-2 flex items-center justify-center">
                <span className="material-icons text-3xl text-sky-500">style</span>
              </div>
              <span className="text-sm font-medium">Tailwind CSS</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 mb-2 flex items-center justify-center">
                <span className="material-icons text-3xl text-indigo-500">analytics</span>
              </div>
              <span className="text-sm font-medium">Custom Processing</span>
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Built with a modern React and Tailwind CSS frontend, our app leverages OpenAI's Whisper model combined with custom post-processing to deliver accurate transcriptions with speaker identification.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/90 to-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Audio?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Start transcribing your content with our powerful, easy-to-use platform.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="px-8 py-6 text-lg bg-white text-primary hover:bg-gray-100 rounded-lg transition-all"
            onClick={() => navigate("/app")}
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-800 text-gray-300">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Shreenidhi Vasishta</h2>
            <p className="mb-6 text-sm opacity-75">
              © {new Date().getFullYear()} Voice Transcription App. All rights reserved.
            </p>
            <div className="flex justify-center space-x-4">
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