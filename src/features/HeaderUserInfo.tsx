import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {UserType} from "../constants/userConsts";
import {Button} from "@mui/material";
import {logout} from "../redux/userSlice";
import {Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

export const HeaderUserInfo = () =>{
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogoutUser = () => {
        dispatch(logout());
    }

    return(<div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <Typography sx={{cursor: 'pointer'}} onClick={() => navigate('/edit-profile')}>{user?.firstName ? user?.firstName : UserType[user?.role ? user?.role : 0]}</Typography>
            <Button variant={'contained'} onClick={() => handleLogoutUser()}>Logout</Button>
        </div>
    </div>);
}