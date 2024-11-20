import {Button,} from "@mui/joy";
import {useState} from "react";
import {ChooseYourRoleComponent} from "../features/ChooseYourRoleComponent";
import {FormInputComponent} from "../components/FormInputComponent";
import {UserDaoService} from "../services/userDaoService";
import {UserType} from "../constants/userConsts";

export const CreateUser = () => {
    const [login, setLogin] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [selectedValue, setSelectedValue] = useState<keyof typeof UserType>('Individual');
    const [error, setError] = useState<string>('');
    const createUser = async () => {
       const userData = await UserDaoService.createUser({
            firstName: login,
            email: email,
            password: password,
            role: UserType[selectedValue],
        }).catch(err => setError('This user is exist'));
    }
    return (<>
        <div className="login-main">
            <div className="login-main-text">
                <h1>Register</h1>
                <h2>Please enter your Name, Login and your Password, and choose your role</h2>
            </div>
            <div className="login-main-form">
                <FormInputComponent placeholder={'What are you name?'} value={login} setValue={setLogin} type={'text'}/>
                <FormInputComponent placeholder={'Email'} value={email} setValue={setEmail} type={'email'}/>
                <FormInputComponent placeholder={'Password'} value={password} setValue={setPassword} type={'password'}/>
                <div className={'login-main-form-role'}>
                    <h3>Who are you?</h3>
                    <ChooseYourRoleComponent setSelectedValue={setSelectedValue} selectedValue={selectedValue}/>
                </div>
                <div className={'login-main-form-button'}>
                    <Button className={'login-main-form-button-login'} color={'success'} variant={'solid'}
                            onClick={() => createUser()}>Register</Button>
                    <p className='error'>{error}</p>
                    <span>Do you have account <a href={'/login'}>Login!</a></span>
                </div>
            </div>
        </div>
    </>)
}