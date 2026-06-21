import ProjectCard from "./ProjectCard";

const Projects = ({ projectsData = [], highlightProject, projectRef }) => {
  return (
    <section ref={projectRef}
      className={`max-w-6xl mx-auto px-6 py-16 rounded-xl transition-colors duration-300 ${highlightProject ? "blink-section" : ""
        }`}>
      <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-8">Projects 💻</h3>

      <div className="grid md:grid-cols-2 gap-6">
        {projectsData.map((project) => (
          <ProjectCard key={project.id} projectData={project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
