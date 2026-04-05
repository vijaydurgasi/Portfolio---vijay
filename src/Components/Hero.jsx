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
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 py-2">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-16">

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Hi, I’m{" "}
              <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                {name}
              </span>
            </h1>

            <h2 className="mt-4 text-xl md:text-2xl text-gray-600 dark:text-gray-300">
              {role}
            </h2>

            <p className="mt-6 max-w-xl text-gray-600 dark:text-gray-300">
              {intro}
            </p>

            <div className="mt-10 flex gap-4 justify-center md:justify-start">
              <button onClick={handleProjectClick} className="px-7 py-3 rounded-md bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:-translate-y-0.5 transition">
                View Projects
              </button>

              <a
                href="/vijay_Durgasi_Resume.pdf"
                download
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all hover:scale-[1.03]">
                <span>Download Resume</span>
                <span>⬇️</span>
              </a>

            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="relative w-64 h-64 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-cyan-400 shadow-xl">
              <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900">
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
