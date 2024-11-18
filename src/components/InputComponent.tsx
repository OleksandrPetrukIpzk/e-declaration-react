import {Input} from "@mui/joy";
import {OverridableStringUnion} from "@mui/types";
import {ColorPaletteProp, VariantProp} from "@mui/joy/styles/types";
import {InputPropsColorOverrides} from "@mui/joy/Input/InputProps";

type InputComponentType = {
    color: OverridableStringUnion<ColorPaletteProp, InputPropsColorOverrides>,
    variant: OverridableStringUnion<VariantProp, InputPropsColorOverrides>,
    value: string,
    onChangeFunction: (e: React.ChangeEvent<HTMLInputElement>) => void,
    isDisable: boolean
    placeholder: string
}

export const InputComponent = ({color, variant, value, onChangeFunction, isDisable, placeholder}: InputComponentType) => {

    return <Input placeholder={placeholder} color={color} variant={variant} value={value} onChange={(e) => onChangeFunction(e)} disabled={isDisable} />
}