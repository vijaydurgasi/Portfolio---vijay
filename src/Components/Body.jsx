import Hero from "./Hero";
import Skills from "./Skills";
import Projects from "./Project";
import About from "./About";
import Services from "./Service";
import Contact from "./Contact";

const Body = ({
    heroData,
    skillsData,
    toolsData,
    projectsData,
    aboutData,
    contactData,
    servicesData,
}) => {
    return (
        <div>
            <Hero heroData={heroData} />
            <Skills skillsData={skillsData} toolsData={toolsData} />
            <Projects projectsData={projectsData} />
            <About aboutData={aboutData} />
            <Services servicesData={servicesData} />
            <Contact contactData={contactData} />
        </div>
    );
};

export default Body;
