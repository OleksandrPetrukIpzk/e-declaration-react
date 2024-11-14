import {Modal} from "@mui/joy";
import {ModalDialog} from "@mui/joy";
import React from "react";
import {PopupComponentType} from "../constants/componentTypes";

export const PopupComponent = ({children, open, setOpen, size, variant, layout}: PopupComponentType) => {
    return(<Modal open={open} onClose={()=>setOpen(false)}>
        <ModalDialog size={size} variant={variant}  layout={layout}>
            {children}
        </ModalDialog>
    </Modal>)
}