import { useState, useEffect, useRef, useCallback } from "react";
import ProjectCard from "./ProjectCard";

const Projects = ({ projectsData = [], highlightProject, projectRef }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // On mobile: 1 card per slide (7 slides)
  // On desktop: 2 cards per slide (4 slides)
  const slides = isMobile
    ? projectsData.map((p) => [p])
    : projectsData.reduce((acc, curr, i) => {
        if (i % 2 === 0) acc.push([curr]);
        else acc[acc.length - 1].push(curr);
        return acc;
      }, []);

  const slideCount = Math.max(slides.length, 1);
  const safeIndex = activeIndex % slideCount;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  // Auto-swap: slowly swaps with the next project card(s)
  useEffect(() => {
    if (isPaused || slideCount <= 1) return;
    const timer = setInterval(nextSlide, 3500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide, slideCount]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = true;
    setIsPaused(true);
  };

  const handleTouchEnd = (e) => {
    if (!isSwiping.current) return;
    isSwiping.current = false;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - endX;
    const diffY = touchStartY.current - endY;

    // Trigger swipe if horizontal movement is dominant and > 30px
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTimeout(() => setIsPaused(false), 3500);
  };

  return (
    <section
      ref={projectRef}
      className={`max-w-6xl mx-auto px-6 py-16 rounded-xl transition-colors duration-300 overflow-hidden ${
        highlightProject ? "blink-section" : ""
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Projects 💻
          </h3>
          <p className="text-sm text-mut mt-1">
            Production systems, AI agents, and full-stack client applications
          </p>
        </div>

        {/* Counter indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-mut font-medium bg-[var(--surface)] px-3 py-1.5 rounded-full border border-[var(--line)]">
            {safeIndex + 1} / {slideCount}
          </span>
        </div>
      </div>

      {/* Slide viewport */}
      <div
        className="relative overflow-hidden rounded-2xl touch-pan-y select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Horizontal track with slow 0.9s cubic-bezier swap */}
        <div
          className="flex w-full"
          style={{
            transform: `translateX(-${safeIndex * 100}%)`,
            transition: "transform 0.9s cubic-bezier(0.25, 1, 0.35, 1)",
          }}
        >
          {slides.map((group, groupIdx) => (
            <div key={groupIdx} className="w-full shrink-0 box-border">
              <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-6`}>
                {group.map((project) => (
                  <ProjectCard key={project.id} projectData={project} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation buttons & indicators */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-[var(--line)]">
          <button
            onClick={() => {
              prevSlide();
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 4000);
            }}
            aria-label="Previous project"
            className="w-8 h-8 flex items-center justify-center rounded-full surface card-hover text-mut hover:text-accent cursor-pointer transition-colors"
          >
            ←
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveIndex(idx);
                  setIsPaused(true);
                  setTimeout(() => setIsPaused(false), 4000);
                }}
                aria-label={`Go to project slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                  safeIndex === idx
                    ? "w-8 bg-accent"
                    : "w-2 bg-[var(--text-dim)] hover:bg-[var(--text-muted)]"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              nextSlide();
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 4000);
            }}
            aria-label="Next project"
            className="w-8 h-8 flex items-center justify-center rounded-full surface card-hover text-mut hover:text-accent cursor-pointer transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
