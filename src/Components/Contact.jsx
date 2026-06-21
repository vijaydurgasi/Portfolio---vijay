import { forwardRef } from "react";


const Contact = forwardRef(({ contactData }, ref) => {
    const { heading, message, email, linkedin, github } = contactData;

    return (
        <section ref={ref} className="max-w-6xl mx-auto px-6 py-20 text-center">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">{heading}</h3>

            <p className="max-w-2xl mx-auto mb-10 text-mut">
                {message}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                    href={`mailto:${email}`}
                    className="px-6 py-3 rounded-full btn-accent text-sm font-medium">
                    Email Me 📧
                </a>

                <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full btn-ghost text-sm font-medium">
                    LinkedIn
                </a>

                <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full btn-ghost text-sm font-medium">
                    GitHub
                </a>
            </div>
        </section>
    );
});

export default Contact;
