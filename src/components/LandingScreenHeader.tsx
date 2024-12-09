import {Button} from "@mui/joy";
import {useNavigate} from "react-router-dom";
import {UserDaoService} from "../services/userDaoService";

export const LandingScreenHeader = () => {
    const navigate = useNavigate();
    return(
        <div className={'landing-screen-header'}>
            <span className={'landing-screen-header-text-block'}>E-<p>Declaration</p></span>
            <div className={'landing-screen-header-buttons-block'}>
                <Button onClick={() => navigate('/register')} color={'primary'} variant={'outlined'} size={'lg'}>Register</Button>
                <Button onClick={() => navigate('/login')} color={'success'} variant={'outlined'} size={'lg'}>Login</Button>
                <Button onClick={() => UserDaoService.getUserInfo(1)} color={'success'} variant={'outlined'} size={'lg'}>Get</Button>
            </div>
        </div>)
}