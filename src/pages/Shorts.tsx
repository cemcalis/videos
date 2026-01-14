import { useState } from "react";
import { ChevronUp, ChevronDown, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShortsCard from "@/components/ShortsCard";
import { mockShorts } from "@/data/mockData";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const Shorts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    if (currentIndex < mockShorts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="h-screen bg-background overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <Logo size="sm" />
          </div>
          <h1 className="text-lg font-bold hdyatak-gradient-text">Shorts</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Shorts Container */}
      <div className="h-full pt-14 relative">
        <div className="h-full overflow-hidden">
          <ShortsCard
            key={mockShorts[currentIndex].id}
            {...mockShorts[currentIndex]}
            isActive={true}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-50">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full w-12 h-12 bg-secondary/80 backdrop-blur-sm"
            onClick={goToPrev}
            disabled={currentIndex === 0}
          >
            <ChevronUp size={24} />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full w-12 h-12 bg-secondary/80 backdrop-blur-sm"
            onClick={goToNext}
            disabled={currentIndex === mockShorts.length - 1}
          >
            <ChevronDown size={24} />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-50">
          {mockShorts.map((_, index) => (
            <div
              key={index}
              className={`w-1 h-8 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-primary hdyatak-glow' 
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shorts;
