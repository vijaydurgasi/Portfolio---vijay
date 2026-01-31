const ProjectCard = ({ projectData }) => {
  const {
    title,
    description,
    tech = [],
    liveLink,
  } = projectData;

  return (
    <a
      href={liveLink}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div
        className="p-6 rounded-xl bg-gray-100 dark:bg-gray-800
                   hover:shadow-xl hover:-translate-y-1
                   transition-all cursor-pointer"
      >
        <h4 className="text-xl font-semibold mb-2">{title}</h4>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {description}
        </p>

        {tech.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tech.map((item, index) => (
              <span
                key={index}
                className="text-sm px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
};

export default ProjectCard;
