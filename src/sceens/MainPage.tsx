import {LandingScreenHeader} from "../components/LandingScreenHeader";
import {UserDaoService} from "../services/userDaoService";

export const MainPage = () => {

    return (<div>
    <LandingScreenHeader />
        <button onClick={() => UserDaoService.connectUsers(3)}>click</button>
    </div>)
}