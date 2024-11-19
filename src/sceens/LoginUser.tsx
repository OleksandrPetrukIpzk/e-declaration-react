import {useState} from "react";
import {Button} from "@mui/joy";
import '../styles/createUser.css'
import {FormInputComponent} from "../components/FormInputComponent";

export const LoginUser = () => {
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    return (<>
        <div className="login-main">
            <div className="login-main-text">
        <h1>Login</h1>
        <h2>Please enter your Email and your Password</h2>
            </div>
            <div className="login-main-form">
                <FormInputComponent placeholder={'Email'} value={login} setValue={setLogin} type={'email'}/>
                <FormInputComponent placeholder={'Password'} value={password} setValue={setPassword} type={'password'}/>
                <div className={'login-main-form-button'}>
                <Button className={'login-main-form-button-login'} color={'success'} variant={'solid'} onClick={() => console.log()}>Login</Button>
                <span>Not remember yet <a href={'/register'}>Register!</a></span>
                </div>
            </div>
        </div>
    </>)
}