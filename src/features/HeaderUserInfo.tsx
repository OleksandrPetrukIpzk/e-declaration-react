import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {UserType} from "../constants/userConsts";
import {Button} from "@mui/joy";
import {logout} from "../redux/userSlice";

export const HeaderUserInfo = () =>{
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();

    const handleLogoutUser = () => {
        dispatch(logout());
    }

    return(<div>
        <div style={{display: 'flex'}}>
            <p>{user?.firstName ? user?.firstName : UserType[user?.role ? user?.role : 0]}</p>
            <Button onClick={() => handleLogoutUser()}>Logout</Button>
        </div>
    </div>);
}