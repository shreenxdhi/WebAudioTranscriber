import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import { Button } from "@/components/ui/button";
import GetStartedGuide from "@/components/GetStartedGuide";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Navigation component for app pages
const AppNav = () => {
  return (
    <div className="bg-background border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <span className="text-xl font-bold text-primary flex items-center cursor-pointer">
            <span className="material-icons mr-2">record_voice_over</span>
            Transcription App
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <GetStartedGuide 
            trigger={
              <Button variant="outline" size="sm">
                <span className="material-icons mr-1 text-sm">help_outline</span>
                Get Started
              </Button>
            }
          />
          <Link href="/">
            <Button size="sm" variant="ghost" className="flex items-center">
              <span className="material-icons mr-1 text-sm">home</span>
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/app">
        {() => (
          <>
            <AppNav />
            <Home />
          </>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
