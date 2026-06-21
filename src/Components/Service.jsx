import { useNavigate } from "react-router-dom";

const Services = ({ servicesData }) => {
    const navigate = useNavigate();

    const handleContactClick = () => {
        navigate("/contact");
    };

    return (
        <section className="max-w-6xl mx-auto px-6 py-16">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-12">What I Do 💼</h3>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                {servicesData.map((service) => (
                    <div
                        key={service.id}
                        className="p-6 rounded-2xl surface card-hover"
                    >
                        <div className="text-3xl mb-4">{service.icon}</div>

                        <h4 className="text-xl font-semibold tracking-tight mb-3">
                            {service.title}
                        </h4>

                        <p className="text-mut mb-4 text-sm leading-relaxed">
                            {service.description}
                        </p>

                        <p className="text-sm text-dim">
                            <span className="font-medium text-accent">Who this is for:</span>{" "}
                            {service.for}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <p className="text-lg mb-4">Have a project in mind?</p>
                <button
                    onClick={handleContactClick}
                    className="px-7 py-3 rounded-full btn-accent text-sm font-medium"
                >
                    Let’s work together 🚀
                </button>
            </div>
        </section>
    );
};

export default Services;
