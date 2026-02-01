import About from "./About";
import Hero from "./Hero";
import Projects from "./Project";
import Services from "./Service";
import Skill from "./Skills";
import Contact from "./Contact";

const Body = ({ heroData, skillsData, toolsData, projectsData, aboutData, servicesData, contactData, }) => {

    return (
        <div>
            <Hero heroData={heroData} />
            <Skill skillsData={skillsData} toolsData={toolsData} />
            <Projects projectsData={projectsData} />
            <About aboutData={aboutData} />
            <Services servicesData={servicesData} />
            <Contact contactData={contactData} />

        </div>
    );
};

export default Body;