import Hero from "./Hero";
import Skills from "./Skills";
import Projects from "./Project";
import About from "./About";
import Services from "./Service";
import Contact from "./Contact";
import { useRef } from "react";

const Body = ({
    heroData,
    skillsData,
    toolsData,
    projectsData,
    aboutData,
    contactData,
    servicesData,
    highlightProject,
    setHighlightProject,
}) => {

    const projectRef = useRef(null);

    return (
        <div>
            <Hero heroData={heroData} setHighlightProject={setHighlightProject} projectRef={projectRef} />

            <Skills skillsData={skillsData} toolsData={toolsData} />
            <Projects projectsData={projectsData} highlightProject={highlightProject} projectRef={projectRef} />
            <About aboutData={aboutData} />
            <Services servicesData={servicesData} />
            <Contact contactData={contactData} />
        </div>
    );
};

export default Body;
