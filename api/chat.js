import portfolioData from "./portfolioData.js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ reply: "Method not allowed" });
    }

    try {
        const { message } = req.body;

        if (!message || message.length > 500) {
            return res.status(400).json({ reply: "Invalid message" });
        }

        const lowerMessage = message.toLowerCase();

        /* =========================
           CONDITIONAL DATA INJECTION
        ========================== */

        let injectedData = "";

        if (lowerMessage.includes("skill") || lowerMessage.includes("technology") || lowerMessage.includes("tech")) {
            injectedData = `
### Skills
${portfolioData.skills.map(s => `- ${s}`).join("\n")}
`;
        }

        else if (lowerMessage.includes("project")) {
            injectedData = `
### Projects
${portfolioData.projects.map(p => `- ${p}`).join("\n")}
`;
        }

        else if (lowerMessage.includes("service")) {
            injectedData = `
### Services
${portfolioData.services.map(s => `- ${s}`).join("\n")}
`;
        }

        else if (lowerMessage.includes("contact") || lowerMessage.includes("reach")) {
            injectedData = `
### Contact Information
- ${portfolioData.contact.instruction}
`;
        }

        else if (
            lowerMessage.includes("capable") ||
            lowerMessage.includes("experience") ||
            lowerMessage.includes("handle") ||
            lowerMessage.includes("able to")
        ) {
            injectedData = `
### Capability
${portfolioData.capabilityStatement}
`;
        }

        else {
            injectedData = `
### Projects
${portfolioData.projects.map(p => `- ${p}`).join("\n")}

### Skills
${portfolioData.skills.map(s => `- ${s}`).join("\n")}

### Services
${portfolioData.services.map(s => `- ${s}`).join("\n")}
`;
        }

        const systemPrompt = `
You are Vijay’s AI Portfolio Assistant.

Use ONLY the portfolio data below.

${injectedData}

Rules:
- Format clearly with headings and bullet points.
- Keep responses concise and professional.
- Do not make up information.
`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `${systemPrompt}\n\nUser Question: ${message}`
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (response.status === 429) {
            return res.json({
                reply: "⚠️ AI quota reached. Please try again later."
            });
        }

        if (!response.ok) {
            return res.status(500).json({
                reply: "AI service temporarily unavailable."
            });
        }

        const reply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I couldn’t generate a response.";

        return res.status(200).json({ reply });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            reply: "Something went wrong."
        });
    }
}