import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {HeaderLoginButtons} from "../features/HeaderLoginButtons";
import {HeaderUserInfo} from "../features/HeaderUserInfo";

export const LandingScreenHeader = () => {
    const user = useSelector((state: RootState) => state.auth.user);


    return(
        <div className={'landing-screen-header'}>
            <span className={'landing-screen-header-text-block'}>E-<p>Declaration</p></span>
            {user ?
                <HeaderUserInfo/>
                :
            <HeaderLoginButtons/>
            }
        </div>)
}