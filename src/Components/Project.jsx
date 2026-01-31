import ProjectCard from "./ProjectCard";

const Projects = ({ projectsData = [] }) => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h3 className="text-3xl font-bold mb-8">Projects 💻</h3>

      <div className="grid md:grid-cols-2 gap-6">
        {projectsData.map((project) => (
          <ProjectCard key={project.id} projectData={project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
