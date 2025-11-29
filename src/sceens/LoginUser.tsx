import {useEffect, useState} from "react";
import {Button} from "@mui/joy";
import '../styles/createUser.css'
import {FormInputComponent} from "../components/FormInputComponent";
import {useDispatch} from "react-redux";
import {loginUser} from "../redux/userSlice";
import {useNavigate} from "react-router-dom";
import {useUserData} from "../hooks/useUserData";

export const LoginUser = () => {
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useUserData();
    const OnLoginUser = async () => {
       const response = await dispatch(loginUser({email: login, password})as any);
       if(response.payload.user){
           navigate('/home');
       }

    }
    useEffect(() => {
        if(user){
            navigate('/home');
        }
    },[])
    return (<>
        <div className="login-main">
            <div className="login-main-text">
        <h1>Вхід</h1>
        <h2>Будь ласка, введіть ваш Email та Пароль</h2>
            </div>
            <div className="login-main-form">
                <FormInputComponent placeholder={'Пошта'} value={login} setValue={setLogin} type={'email'}/>
                <FormInputComponent placeholder={'Пароль'} value={password} setValue={setPassword} type={'password'}/>
                <div className={'login-main-form-button'}>
                    <Button className={'login-main-form-button-login'} color={'success'} variant={'solid'}
                            onClick={() => OnLoginUser()}>Вхід</Button>
                    <p className='error'>{error}</p>
                    <span>Ще не маєте акаунту? <a href={'/register'}>Зареєструватися!</a></span>
                </div>
            </div>
        </div>
    </>)
}