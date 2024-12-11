import {Button} from "@mui/joy";
import {useNavigate} from "react-router-dom";

export const HeaderLoginButtons = () => {
    const navigate = useNavigate();

    return (<div className={'landing-screen-header-buttons-block'}>
        <Button onClick={() => navigate('/register')} color={'primary'} variant={'outlined'}
                size={'lg'}>Register</Button>
        <Button onClick={() => navigate('/login')} color={'success'} variant={'outlined'} size={'lg'}>Login</Button>
    </div>)
}