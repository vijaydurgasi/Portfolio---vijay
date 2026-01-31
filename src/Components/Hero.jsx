const Hero = ({heroData}) => {
   const { name, role, intro } = heroData;

  return (
    <section className="px-6 py-16">
      <h1 className="text-4xl font-bold">
        Hi, I'm {name}
      </h1>

      <p className="mt-4 max-w-xl text-gray-600 dark:text-gray-300">
        {role}
      </p>

      <p className="mt-4 max-w-xl text-gray-600 dark:text-gray-300">
        {intro}
      </p>

      <div className="mt-6 flex gap-4">
        <button className="px-5 py-2 rounded-md bg-blue-600 text-white">
          View Projects
        </button>

        <button className="px-5 py-2 rounded-md border">
          Contact
        </button>
      </div>
    </section>
  );
};

export default Hero;
