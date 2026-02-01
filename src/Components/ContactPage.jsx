import { useState } from "react";

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Form submitted:", formData);

        // backend will be added later
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-20">
            <h1 className="text-3xl font-bold mb-6">Contact Me</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2 font-medium">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-md border"
                        placeholder="Your name"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-md border"
                        placeholder="Your email"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">Message</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="5"
                        className="w-full px-4 py-2 rounded-md border"
                        placeholder="Tell me about your project"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="px-6 py-3 rounded-md bg-blue-600 text-white"
                >
                    Send Message 🚀
                </button>
            </form>
        </div>
    );
};

export default ContactPage;
