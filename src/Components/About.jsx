
const About = ({ aboutData }) => {
    const { heading, intro, points } = aboutData;

    return (
        <section className="max-w-6xl mx-auto px-6 py-16">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">{heading}</h3>

            <p className="max-w-3xl mb-8 text-xl md:text-2xl leading-relaxed font-light">
                {intro}
            </p>

            <ul className="space-y-3">
                {points.map((point, index) => (
                    <li key={index} className="flex gap-3 text-mut">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full accent-dot inline-block shrink-0" />
                        <span>{point}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default About;
