import { forwardRef } from "react";

const Contact = forwardRef(({ contactData }, ref) => {
    const { heading, message, email, linkedin, github } = contactData;

    return (
        <section ref={ref} className="max-w-6xl mx-auto px-6 py-20 text-center">
            <h3 className="text-3xl font-bold mb-6">{heading}</h3>

            <p className="max-w-2xl mx-auto mb-10 text-gray-600 dark:text-gray-300">
                {message}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                    href={`mailto:${email}`}
                    className="px-6 py-3 rounded-md bg-blue-600 text-white">
                    Email Me 📧
                </a>

                <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-md border">
                    LinkedIn
                </a>

                <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-md border">
                    GitHub
                </a>
            </div>
        </section>
    );
});

export default Contact;
