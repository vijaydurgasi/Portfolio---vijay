const Hero = ({ heroData, setHighlightProject, projectRef }) => {

  const { name, role, intro, image } = heroData;

  const handleProjectClick = () => {
    setHighlightProject(true);

    const yOffset = -100;
    const y =
      projectRef.current.getBoundingClientRect().top +
      window.pageYOffset +
      yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 py-2">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-16">

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-6">
              <span className="w-2 h-2 rounded-full accent-dot inline-block" />
              <span className="text-xs tracking-[0.15em] text-mut">AVAILABLE FOR WORK</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight">
              Hi, I’m{" "}
              <span className="text-accent">
                {name}
              </span>
            </h1>

            <h2 className="mt-4 text-xl md:text-2xl text-mut">
              {role}
            </h2>

            <p className="mt-6 max-w-xl text-mut">
              {intro}
            </p>

            <div className="mt-10 flex gap-4 justify-center md:justify-start">
              <button
                onClick={handleProjectClick}
                className="px-7 py-3 rounded-full btn-accent text-sm font-medium">
                View Projects
              </button>

              <a
                href="/vijay_Durgasi_Resume.pdf"
                download
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full btn-ghost text-sm font-medium">
                <span>Download Resume</span>
                <span>⬇️</span>
              </a>

            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="relative w-64 h-64 rounded-full p-[3px] [background:linear-gradient(135deg,var(--accent),transparent)]">
              <div className="w-full h-full rounded-full overflow-hidden surface">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover object-center aspect-square"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
