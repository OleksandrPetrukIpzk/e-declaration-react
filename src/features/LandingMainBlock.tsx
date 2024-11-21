import {LandingScreenIntroductionComponent} from "../components/LandingScreenIntroductionComponent";
import {LandingScreenArguments} from "../components/LandingScreenArguments";
import {LandingScreenServices} from "../components/LandingScreenServices";
import {LandingScreenStatisticComponent} from "../components/LandingScreenStatisticComponent";

export const LandingMainBlock = () => {

    return (
        <div>
            <LandingScreenIntroductionComponent/>
            <LandingScreenArguments/>
            <LandingScreenServices/>
            <LandingScreenStatisticComponent/>
        </div>
    )
}