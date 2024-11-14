import React, {Dispatch, SetStateAction} from "react";
import {OverridableStringUnion} from "@mui/types";
import {
    ModalDialogPropsLayoutOverrides,
    ModalDialogPropsSizeOverrides,
    ModalDialogPropsVariantOverrides
} from "@mui/joy/ModalDialog/ModalDialogProps";
import {VariantProp} from "@mui/joy/styles/types";

export type PopupComponentType = {
    children: React.ReactNode,
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    size: OverridableStringUnion<'sm' | 'md' | 'lg',
        ModalDialogPropsSizeOverrides>,
    variant: OverridableStringUnion<VariantProp, ModalDialogPropsVariantOverrides>,
    layout: OverridableStringUnion<'center' | 'fullscreen', ModalDialogPropsLayoutOverrides>
}