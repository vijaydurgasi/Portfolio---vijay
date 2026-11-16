import { useState, useEffect, useRef, useCallback } from "react";

const Skills = ({ skillsData, backendData, aiData = [], toolsData }) => {
  const categories = [
    {
      id: "frontend",
      title: "FRONTEND",
      badge: "User Interface",
      items: skillsData,
    },
    {
      id: "backend",
      title: "BACKEND",
      badge: "APIs & Databases",
      items: backendData,
    },
    ...(aiData.length > 0
      ? [
          {
            id: "ai",
            title: "AI / LLM & AUTOMATION",
            badge: "Intelligent Systems",
            items: aiData,
          },
        ]
      : []),
    {
      id: "tools",
      title: "TOOLS & PLATFORMS",
      badge: "DevOps & Cloud",
      items: toolsData,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % categories.length);
  }, [categories.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + categories.length) % categories.length);
  }, [categories.length]);

  // Auto-swap: slowly swap to the next category
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 3200);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

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
    <section className="max-w-6xl mx-auto px-6 pt-6 pb-16 overflow-hidden">
      {/* Header without category pill buttons */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Tech Stack 🚀
          </h3>
          <p className="text-sm text-mut mt-1">
            Technologies &amp; tools I use to build scalable products
          </p>
        </div>

        {/* Slide counter */}
        <span className="text-xs text-mut font-medium bg-[var(--surface)] px-3 py-1.5 rounded-full border border-[var(--line)]">
          {activeIndex + 1} / {categories.length}
        </span>
      </div>

      {/* Slide viewport: strict overflow-hidden with no outer padding so adjacent slides never peek through */}
      <div
        className="relative overflow-hidden rounded-2xl w-full touch-pan-y select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Horizontal track with slow 0.9s cubic-bezier swap */}
        <div
          className="flex w-full"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
            transition: "transform 0.9s cubic-bezier(0.25, 1, 0.35, 1)",
          }}
        >
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="w-full shrink-0 surface rounded-2xl p-6 md:p-8 box-border"
            >
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[var(--line)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full accent-dot inline-block animate-pulse" />
                  <span className="text-xs md:text-sm tracking-[0.15em] font-semibold text-accent uppercase">
                    {cat.title}
                  </span>
                </div>
                <span className="text-xs text-mut bg-[var(--surface-2)] px-2.5 py-1 rounded-full border border-[var(--line)]">
                  {cat.badge}
                </span>
              </div>

              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 md:gap-4">
                {cat.items.map((item, index) => (
                  <li
                    key={index}
                    className="px-4 py-3.5 rounded-xl chip text-sm md:text-base font-medium flex items-center gap-2"
                  >
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom controls: Prev / Next buttons & indicator dots */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--line)]">
          <button
            onClick={() => {
              prevSlide();
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 4000);
            }}
            aria-label="Previous tech category"
            className="w-8 h-8 flex items-center justify-center rounded-full surface card-hover text-mut hover:text-accent cursor-pointer transition-colors"
          >
            ←
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {categories.map((cat, idx) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveIndex(idx);
                  setIsPaused(true);
                  setTimeout(() => setIsPaused(false), 4000);
                }}
                aria-label={`Show ${cat.title}`}
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                  activeIndex === idx
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
            aria-label="Next tech category"
            className="w-8 h-8 flex items-center justify-center rounded-full surface card-hover text-mut hover:text-accent cursor-pointer transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Skills;
