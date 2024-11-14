import {PopupComponent} from "./PopupComponent";
import {Webcam} from "@webcam/react";
import {Dispatch, SetStateAction, useState} from "react";
import {Button} from "@mui/joy";

export const WebcamComponent = ({photo, setPhoto, isUserSigned}: {photo: any, setPhoto: Dispatch<SetStateAction<any>>, isUserSigned: boolean}) => {
    const [isOpenPopupCamera, setIsOpenPopupCamera] = useState(false);

    const handleCapture = (getSnapshot: any) => {
        const imageSrc = getSnapshot({ quality: 0.8 });
        setPhoto(imageSrc);
    };
    return<>
        <Button disabled={!isUserSigned} onClick={() => setIsOpenPopupCamera(true)}>Verify by photo</Button>
    <PopupComponent open={isOpenPopupCamera} layout={'center'} setOpen={setIsOpenPopupCamera} size={'md'} variant={'soft'}>
        {photo ? <div> <img width={'100%'} height={'100%'} src={photo} alt="Captured"/>
            <Button onClick={() => setPhoto(null)}>Refresh</Button>
            <Button onClick={() => setIsOpenPopupCamera(false)}>Close</Button>
        </div>: <Webcam>
            {({getSnapshot}) => (
                <Button onClick={() => handleCapture(getSnapshot)}>Make photo</Button>
            )}
        </Webcam>
        }
    </PopupComponent>
        </>
}