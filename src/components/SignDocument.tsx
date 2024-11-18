import {PopupComponent} from "./PopupComponent";
import {Dispatch, SetStateAction, useRef, useState} from "react";
import {Button} from "@mui/joy";
import Signature, {SignatureRef} from "@uiw/react-signature";
import {subscribeDocument} from "../functions/documentFunctions";

export const SignDocument = ({setPdfFile, setIsUserSigned, isUserSigned}: {setPdfFile: Dispatch<SetStateAction<string | null>>, setIsUserSigned: Dispatch<SetStateAction<boolean>>, isUserSigned:boolean}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const canvasRef = useRef<SignatureRef | null>(null);
    const clear = () =>{
        canvasRef?.current?.clear();
    }
    const sign = async () => {
        const svgelm = canvasRef.current?.svg?.cloneNode(true) as SVGSVGElement;
        const svgData = new XMLSerializer().serializeToString(svgelm);

        // Створіть Blob зі SVG
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        // Завантажте зображення з URL-адреси
        const img = new Image();
        img.src = url;

        img.onload = async () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.drawImage(img, 0, 0, 100, 60);

            // Використовуйте Promise для `canvas.toBlob`
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    console.error("Failed to create blob");
                    return;
                }

                // Збережіть URL PNG-зображення у змінній стану
                const pngUrl = URL.createObjectURL(blob);

                // Завантажте байти зображення у форматі PNG
                const imageBytes = await fetch(pngUrl).then((res) => res.arrayBuffer());
                await subscribeDocument(imageBytes, setPdfFile, 250, 445);
            }, "image/png");
        };
        setIsUserSigned(true);
        setIsOpen(false);
    };
    return(
        <>
            <Button disabled={isUserSigned} onClick={() => setIsOpen(true)}>Sign the document</Button>
            <PopupComponent open={isOpen} setOpen={setIsOpen} size={'md'} variant={'soft'} layout={'center'}>
            <Signature
                options={{
                    size: 2,
                    smoothing: 0.46,
                    thinning: 0.73,
                    streamline: 0.5,
                    easing: (t) => t,
                    simulatePressure: true,
                    last: true,
                    start: {
                        cap: true,
                        taper: 0,
                        easing: (t) => t,
                    },
                    end: {
                        cap: true,
                        taper: 0,
                        easing: (t) => t,
                    },
                }}
                readonly={isSaved}
                ref={canvasRef}
            />
                <Button onClick={() => {
                    setIsSaved(!isSaved);
                    isSaved && clear()
                }
                }>{isSaved ? 'Try again' : 'Set'}</Button>
                <Button disabled={!isSaved} onClick={() => sign()}>Subscribe</Button>
                <Button onClick={() => clear()}>clear</Button>
            </PopupComponent>
        </>
    )
}