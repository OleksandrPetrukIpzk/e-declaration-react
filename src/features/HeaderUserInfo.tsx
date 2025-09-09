import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {UserType} from "../constants/userConsts";
import {Button, Link, Stack} from "@mui/material";
import {logout} from "../redux/userSlice";
import {Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {HeaderNotificationIndicator} from "../components/notification/NotificationButtons";

export const HeaderUserInfo = () =>{
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogoutUser = () => {
        dispatch(logout());
    }
    const userLinksList: Record<UserType, { name: string; link: string }[]> = {
        [UserType.Individual]: [
            {
                name: 'Домашня сторінка',
                link: '/home'
            },
            {
                name: 'Створити декларацію',
                link: '/patient-create-declaration'
            },
            {
                name: 'Список лікарів',
                link: '/select-providers'
            },
            {
                name: 'Список привязаних користувачів',
                link: '/connected-users'
            }
        ],
        [UserType.Admin]: [{
            name: 'Домашня сторінка',
            link: '/home'
        },
            {
                name: 'Legal entity',
                link: '/legal-entity-management'
            },
            {
                name: 'Divisions',
                link: '/division-management'
            },
            {
                name: 'Мої клініки',
                link: '/my-clinic-list'
            },
            {
                name: 'Створити клініку',
                link: '/create-clinic'
            },
            {
                name: 'Адміністратори',
                link: '/active-admins'
            },
            {
                name: 'Експорт',
                link: '/export'
            },
        ],
        [UserType.Hospital]: [
            {
                name: 'Домашня сторінка',
                link: '/home'
            },
            {
            name: 'Список декларацій',
            link: '/doctor-dashboard'
        },
            {
                name: 'Список клінік',
                link: '/active-clinic-list'
            },
            {
                name: 'Список лікарів',
                link: '/select-providers'
            },
            {
                name: 'Список привязаних користувачів',
                link: '/connected-users'
            }
        ],
    }
    const role = (user?.role ?? UserType.Individual) as keyof typeof userLinksList;
    return(<Stack style={{display: 'flex', alignItems: 'center'}} gap={2} direction="row">
        <Stack gap={2} direction="row" alignItems={'center'}>
        {userLinksList[role]?.map((item: any) => {
            return <Link href={item.link}>{item.name}</Link>
        })}
            <HeaderNotificationIndicator userId={user?.id ?? 0} />
        </Stack>
            <Typography sx={{cursor: 'pointer'}} onClick={() => navigate('/edit-profile')}>{user?.firstName ? user?.firstName : UserType[user?.role ? user?.role : 0]}</Typography>
            <Button variant={'contained'} onClick={() => handleLogoutUser()}>Logout</Button>
        </Stack>);
}