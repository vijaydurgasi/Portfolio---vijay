const ProjectCard = ({ projectData }) => {
  const { title, description, tech = [], liveLink, status, year } = projectData;

  return (
    <a href={liveLink} target="_blank" rel="noopener noreferrer" className="block">
      <div className="h-full p-6 rounded-2xl surface card-hover cursor-pointer">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h4 className="text-xl font-semibold tracking-tight">{title}</h4>
          {year && (
            <span className="shrink-0 text-xs text-dim mt-1">
              {year}
            </span>
          )}
        </div>

        {status && (
          <span className="inline-flex items-center gap-1.5 mb-3 text-xs font-medium tracking-wide text-accent">
            <span className="w-1.5 h-1.5 rounded-full accent-dot inline-block" />
            {status}
          </span>
        )}

        <p className="text-mut mb-4 text-sm leading-relaxed">
          {description}
        </p>

        {tech.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tech.map((item) => (
              <span
                key={item}
                className="text-xs px-3 py-1 rounded-full surface-2 [border:1px_solid_var(--line)] text-mut"
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
