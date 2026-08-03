// greetings.js

const greetings = [
    "hi",
    "hello",
    "hey",
    "good morning",
    "good evening",
    "good afternoon"
];

const farewells = [
    "bye",
    "goodbye",
    "see you",
    "see you later",
    "thanks",
    "thank you"
];

export const isGreeting = (text) => {
    const normalized = text.toLowerCase().trim();

    return greetings.some(
        (greet) =>
            normalized === greet ||
            normalized.startsWith(greet + " ")
    );
};

export const isFarewell = (text) => {
    const normalized = text.toLowerCase().trim();

    return farewells.some(
        (farewell) =>
            normalized === farewell ||
            normalized.startsWith(farewell + " ")
    );
};

export const greetingReply = `
I'm fine, you can ask me anything about:
- Projects
- Skills
- Experience
- Services
- Contact
`;

export const farewellReply = `
Goodbye 👋  

Thank you for visiting Vijay’s portfolio.

If you’d like to work together, feel free to reach out through the **"Let's Work Together"** section.

Have a great day!
`;