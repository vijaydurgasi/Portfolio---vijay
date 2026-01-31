const Skills = ({ skillsData, toolsData }) => {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-6 pb-16">
      
      <h3 className="text-3xl font-bold mb-10">Skills & Tools 🚀</h3>
      <div className="mb-10">
        <h4 className="text-xl font-semibold mb-4">Skills</h4>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {skillsData.map((skill, index) => (
            <li
              key={index}
              className="px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-800">
              {skill}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-xl font-semibold mb-4">Tools</h4>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {toolsData.map((tool, index) => (
            <li
              key={index}
              className="px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-800">
              {tool}
            </li>
          ))}
        </ul>
      </div>

    </section>
  );
};

export default Skills;
