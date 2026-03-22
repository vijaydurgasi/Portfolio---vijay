const Skills = ({ skillsData, backendData, toolsData }) => {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-6 pb-16">

      <h3 className="text-2xl md:text-3xl font-bold mb-10">
        Tech Stack 🚀
      </h3>

      {/* Frontend */}
      <div className="mb-10">
        <h4 className="text-xl font-semibold mb-4">Frontend</h4>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {skillsData.map((skill, index) => (
            <li
              key={index}
              className="px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:scale-105 transition-transform duration-200"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>

      {/* Backend */}
      <div className="mb-10">
        <h4 className="text-xl font-semibold mb-4">Backend</h4>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {backendData.map((item, index) => (
            <li
              key={index}
              className="px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:scale-105 transition-transform duration-200"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Tools */}
      <div>
        <h4 className="text-xl font-semibold mb-4">Tools & Platforms</h4>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {toolsData.map((tool, index) => (
            <li
              key={index}
              className="px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:scale-105 transition-transform duration-200"
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