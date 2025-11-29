import {Button,} from "@mui/joy";
import {useEffect, useState} from "react";
import {ChooseYourRoleComponent} from "../features/ChooseYourRoleComponent";
import {FormInputComponent} from "../components/FormInputComponent";
import {UserDaoService} from "../services/userDaoService";
import {UserType} from "../constants/userConsts";
import {useNavigate} from "react-router-dom";
import {useUserData} from "../hooks/useUserData";

export const CreateUser = () => {
    const [login, setLogin] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [selectedValue, setSelectedValue] = useState<keyof typeof UserType>('Individual');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    const {user} = useUserData();
    const createUser = async () => {
       const userData = await UserDaoService.createUser({
            firstName: login,
            email: email,
            password: password,
            role: UserType[selectedValue],
        }).then(() => navigate('/home')).catch(err => setError('Користувач з таким email вже існує'));
    }
    useEffect(() => {
        if(user){
            navigate('/home');
        }
    },[])
    return (<>
        <div className="login-main">
            <div className="login-main-text">
                <h1>Реєстрація</h1>
                <h2>Будь ласка, введіть ваше ім'я, email і пароль, а також оберіть вашу роль</h2>
            </div>
            <div className="login-main-form">
                <FormInputComponent placeholder={'Як ваше ім\'\'я?'} value={login} setValue={setLogin} type={'text'}/>
                <FormInputComponent placeholder={'Пошта'} value={email} setValue={setEmail} type={'email'}/>
                <FormInputComponent placeholder={'Пароль'} value={password} setValue={setPassword} type={'password'}/>
                <div className={'login-main-form-role'}>
                    <h3>Хто ви?</h3>
                    <ChooseYourRoleComponent setSelectedValue={setSelectedValue} selectedValue={selectedValue}/>
                </div>
                <div className={'login-main-form-button'}>
                    <Button className={'login-main-form-button-login'} color={'success'} variant={'solid'}
                            onClick={() => createUser()}>Зареєструватися</Button>
                    <p className='error'>{error}</p>
                    <span>У вас вже є акаунт? <a href={'/login'}>Увійти!</a></span>
                </div>
            </div>
        </div>
    </>)
}