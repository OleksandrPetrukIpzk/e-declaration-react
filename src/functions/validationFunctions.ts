import {Dispatch, HTMLInputTypeAttribute, SetStateAction} from "react";

export const validationFunctions = (type: HTMLInputTypeAttribute, value: string, setError: Dispatch<SetStateAction<string>>) => {

    switch (type) {
        case 'email':{
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;
            if(!emailRegex.test(value)){
                setError('Invalid email address');
            } else{
                setError('');
            }
            break;
        }
        default: {
            break;
        }
    }
}