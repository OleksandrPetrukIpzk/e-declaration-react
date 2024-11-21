import {Button} from "@mui/joy";
import {useEffect, useState} from "react";
import {UserDaoService} from "../services/userDaoService";
import {useNavigate} from "react-router-dom";


export const LandingScreenIntroductionComponent = () => {
    const [usersCount, setUsersCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
       const getUsers = async () =>{
           const usersCount: number = await UserDaoService.getUsersCount();
           setUsersCount(usersCount);
       }
       getUsers();
    });

    return(<div className="landing-screen-introduction">
        <img src={'/images/Group9415.svg'} alt={'123'}/>
        <div className="landing-screen-introduction-block">
            <div className="landing-screen-introduction-block-text">
        <p className="landing-screen-introduction-block-text-large">Medical Courier</p>
        <p className="landing-screen-introduction-block-text-small">Spesialist</p>
        <p className="landing-screen-introduction-block-text-subscribe">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis eleifend quam, non efficitur nisi mattis quis. Vivamus scelerisque orci nec erat cursus, sed facilisis velit porttitor.</p>
            </div>
            <Button onClick={() => navigate('/register')} size={'lg'}>Get started</Button>
            <div>
                <span className={'landing-screen-introduction-block-statistic'}>{usersCount}<p>+</p></span>
                <p className={'landing-screen-introduction-block-statistic-subscribe'}>Joined in already</p>
            </div>
        </div>
    </div>)
}