
const About = ({ aboutData }) => {
    const { heading, intro, points } = aboutData;

    return (
        <section className="max-w-6xl mx-auto px-6 py-16">
            <h3 className="text-3xl font-bold mb-6">{heading}</h3>

            <p className="max-w-3xl mb-8 text-xl md:text-2xl  text-gray-800 dark:text-gray-200 leading-relaxed  font-light">
                {intro}
            </p>

            <ul className="space-y-3">
                {points.map((point, index) => (
                    <li key={index}>
                        • {point}
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default About;
