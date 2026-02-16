import { useState } from "react";
import whatsapp from "../../src/assets/whatsapp.jpg";

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);

    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleWhatsAppClick = () => {
        const phoneNumber = "9182919974";
        const message = "Hi Vijay! I came across your portfolio and I’m interested in working with you.";

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
            message
        )}`;

        window.open(whatsappUrl, "_blank");
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const res = await fetch("https://formspree.io/f/xaqbponl", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus("success");
                alert("Message sent successfully ✅");
                setFormData({ name: "", email: "", message: "" });
            } else {
                setStatus("error");
            }
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-20">

            <h1 className="text-2xl md:text-3xl font-bold mb-6">Contact Me</h1>

            <form onSubmit={handleSubmit} className="space-y-6">

                <div>
                    <label className="block mb-2 font-medium">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-md border dark:bg-gray-900 dark:border-gray-700"
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
                        className="w-full px-4 py-2 rounded-md border dark:bg-gray-900 dark:border-gray-700"
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
                        className="w-full px-4 py-2 rounded-md border dark:bg-gray-900 dark:border-gray-700"
                        placeholder="Tell me about your project"
                        required
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 rounded-md bg-blue-600 text-white  hover:bg-blue-700 disabled:opacity-60">
                        {loading ? "Sending..." : "Send Message 🚀"}
                    </button>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleWhatsAppClick}
                        className="flex items-center gap-3 px-6 py-3 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-60">

                        <img
                            src={whatsapp}
                            alt="WhatsApp"
                            className="w-6 h-6 object-contain rounded-xl" />

                        <span className="font-medium">{loading ? "Opening WhatsApp..." : "Chat on WhatsApp"}</span>
                    </button>

                </div>

                {status === "success" && (
                    <p className="text-green-600 font-medium">
                        ✅ Message sent successfully!
                    </p>
                )}

                {status === "error" && (
                    <p className="text-red-600 font-medium">
                        ❌ Failed to send message. Please try again.
                    </p>
                )}
            </form>
        </div>
    );

};

export default ContactPage;
