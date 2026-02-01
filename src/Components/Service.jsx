const Services = ({ servicesData, onContactClick }) => {
    return (
        <section className="max-w-6xl mx-auto px-6 py-16">
            <h3 className="text-3xl font-bold mb-12">What I Do 💼</h3>

            <div className="grid md:grid-cols-3 gap-8">
                {servicesData.map((service) => (
                    <div
                        key={service.id}
                        className="p-6 rounded-xl bg-gray-100 dark:bg-gray-800 hover:shadow-lg transition-all" >
                        <div className="text-4xl mb-4">{service.icon}</div>

                        <h4 className="text-xl font-semibold mb-3">
                            {service.title}
                        </h4>

                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {service.description}
                        </p>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-medium">Who this is for:</span>{" "}
                            {service.for}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <p className="text-lg mb-4">
                    Have a project in mind?
                </p>
                <button
                    onClick={onContactClick}
                    className="px-6 py-3 rounded-md bg-blue-600 text-white">
                    Let’s work together 🚀
                </button>

            </div>
        </section>
    );
};

export default Services;
