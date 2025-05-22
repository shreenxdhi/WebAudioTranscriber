import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GetStartedGuideProps {
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const GetStartedGuide = ({ 
  trigger, 
  isOpen, 
  onOpenChange 
}: GetStartedGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [controlledOpen, setControlledOpen] = useState(false);
  
  // Use either controlled or uncontrolled state
  const open = isOpen !== undefined ? isOpen : controlledOpen;
  const setOpen = onOpenChange || setControlledOpen;
  
  const steps = [
    {
      title: "Upload Your Audio",
      description: "Choose an audio file from your device, record directly, or paste a URL to an audio file online.",
      icon: "upload_file",
      image: "/upload-step.png"
    },
    {
      title: "Wait for Transcription",
      description: "Our AI-powered system will process your audio and convert it to text with speaker identification.",
      icon: "hourglass_top",
      image: "/processing-step.png"
    },
    {
      title: "Review Your Transcript",
      description: "Your transcription will appear with each speaker clearly labeled. Review the text for accuracy.",
      icon: "visibility",
      image: "/review-step.png"
    },
    {
      title: "Export and Share",
      description: "Download your transcript as a PDF or Word document, or copy the text directly to your clipboard.",
      icon: "download",
      image: "/export-step.png"
    }
  ];
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setOpen(false);
      setCurrentStep(0);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <span className="material-icons text-primary">{steps[currentStep].icon}</span>
            <span>Step {currentStep + 1}: {steps[currentStep].title}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-6 bg-gray-100 rounded-lg p-4 flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="material-icons text-primary text-2xl">{steps[currentStep].icon}</span>
            </div>
            <div className="flex-grow">
              <h3 className="font-medium text-lg">{steps[currentStep].title}</h3>
              <p className="text-gray-600">{steps[currentStep].description}</p>
            </div>
          </div>
          
          {/* Step progress indicators */}
          <div className="flex justify-center space-x-2 mb-4">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? "w-8 bg-primary" 
                    : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        
        <DialogFooter className="flex sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button type="button" onClick={handleNext}>
            {currentStep < steps.length - 1 ? "Next" : "Get Started"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GetStartedGuide;