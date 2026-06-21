const SkillGroup = ({ label, items }) => (
  <div className="mb-10">
    <h4 className="text-xs tracking-[0.15em] text-mut mb-4 flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full accent-dot inline-block" />
      {label}
    </h4>
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {items.map((item, index) => (
        <li
          key={index}
          className="px-4 py-3 rounded-xl chip text-sm"
        >
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const Skills = ({ skillsData, backendData, aiData = [], toolsData }) => {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-6 pb-16">

      <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-10">
        Tech Stack 🚀
      </h3>

      <SkillGroup label="FRONTEND" items={skillsData} />
      <SkillGroup label="BACKEND" items={backendData} />
      {aiData.length > 0 && <SkillGroup label="AI / LLM" items={aiData} />}

      <div>
        <h4 className="text-xs tracking-[0.15em] text-mut mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full accent-dot inline-block" />
          TOOLS &amp; PLATFORMS
        </h4>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {toolsData.map((tool, index) => (
            <li
              key={index}
              className="px-4 py-3 rounded-xl chip text-sm"
            >
              {tool}
            </li>
          ))}
        </ul>
      </div>

    </section>
  );
};

export default Skills;
