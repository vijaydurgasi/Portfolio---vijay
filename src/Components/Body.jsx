import Hero from "./Hero";
import Projects from "./Project";
import Skill from "./Skills";


const Body = ({heroData ,skillsData, toolsData, projectsData}) => {

    return (
        <div>
            <Hero heroData = {heroData}/>
            <Skill skillsData = {skillsData} toolsData={toolsData}/>
            <Projects projectsData={projectsData} />
        </div>
    );
};

export default Body;