import {LandingScreenHeader} from "../components/LandingScreenHeader";
import '../styles/landingScreen.css'
import {LandingMainBlock} from "../features/LandingMainBlock";
import {LandingFooter} from "../components/LandingFooter";

export const LandingScreen = () => {

    return (
        <div className="landing-screen">
            <LandingScreenHeader/>
            <LandingMainBlock/>
            <LandingFooter/>
        </div>
    )
}