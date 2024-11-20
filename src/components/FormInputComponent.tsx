import {InputComponent} from "./InputComponent";
import {Dispatch, HTMLInputTypeAttribute, SetStateAction, useState} from "react";
import {validationFunctions} from "../functions/validationFunctions";

type FormInputComponentType = {
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    placeholder: string;
    type: HTMLInputTypeAttribute;
}

export const FormInputComponent = ({value, setValue, placeholder, type}: FormInputComponentType) => {
    const [error, setError] = useState<string>('');

    const onChangeElement = (e: any) =>{
        setValue(e.target.value);
        validationFunctions(type, value, setError);
    }

    return(
        <div className="form-element-container">
        <InputComponent type={type} color={error ? 'danger' : 'primary'} variant={'soft'} value={value}
    onChangeFunction={e => onChangeElement(e)} isDisable={false} placeholder={placeholder}/>
        <p className={'error'}>{error}</p>
        </div>
    )
}