import About from "./About";
import Hero from "./Hero";
import Projects from "./Project";
import Services from "./Service";
import Skill from "./Skills";
import Contact from "./Contact";
import { useRef } from "react";

const Body = ({ heroData, skillsData, toolsData, projectsData, aboutData, servicesData, contactData, }) => {

    const contactRef = useRef(null);

    const handleContactClick = () => {
        contactRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div>
            <Hero heroData={heroData} />
            <Skill skillsData={skillsData} toolsData={toolsData} />
            <Projects projectsData={projectsData} />
            <About aboutData={aboutData} />
            <Services servicesData={servicesData} onContactClick={handleContactClick} />
            <Contact ref={contactRef} contactData={contactData} />
        </div>
    );
};

export default Body;