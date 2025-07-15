import {useSelector} from "react-redux";
import {RootState} from "../redux/store";

export const useUserData = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    return {user};
}