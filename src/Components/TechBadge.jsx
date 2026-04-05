import { useEffect, useState } from "react";

const words = [
    "MERN Stack Developer",
    "MongoDB • Express • React • Node",
    "RAG systems"
];

const TechBadge = () => {
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false);

            setTimeout(() => {
                setIndex((prev) => (prev + 1) % words.length);
                setVisible(true);
            }, 400);
        }, 2800);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-center h-10 overflow-hidden">
            <span
                className={` font-semibold tracking-wide transition-all duration-500 ease-in-out
                             text-xs sm:text-sm md:text-sm  
                             ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
                             text-blue-600 dark:text-white whitespace-nowrap`}
            >
                {words[index]}
            </span>
        </div>
    );
};

export default TechBadge;