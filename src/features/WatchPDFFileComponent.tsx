import {Button} from "@mui/joy";
import {useState} from "react";
import {PopupComponent} from "../components/PopupComponent";
import {Viewer, Worker} from "@react-pdf-viewer/core";
import {WORKER_URL} from "../constants/urls";
import {renderPDFFile} from "../functions/documentFunctions";
import {WebcamComponent} from "../components/WebcamComponent";
import {SignDocument} from "../components/SignDocument";

export const WatchPDFFileComponent = ({inputValue}: {inputValue: string[]}) => {
    const [openPopup, setOpenPopup] = useState(false);
    const [pdfFile, setPdfFile] = useState<string | null>(null);
    const [isUserSigned, setIsUserSigned] = useState(false);
    const [photo, setPhoto] = useState(null);
    return(
        <>
            <Button variant={'solid'} onClick={() => renderPDFFile(inputValue, setPdfFile, setOpenPopup)}>Render PFD</Button>
            <PopupComponent open={openPopup} variant={'soft'} setOpen={setOpenPopup} size={'lg'} layout={'fullscreen'}>
                <Button onClick={() => setOpenPopup(false)}>Close</Button>
                <SignDocument isUserSigned={isUserSigned} setIsUserSigned={setIsUserSigned} setPdfFile={setPdfFile}/>
                <WebcamComponent setPhoto={setPhoto} photo={photo} isUserSigned={isUserSigned} />
                <Button disabled={!photo && !isUserSigned}>Send to server</Button>
                <Worker workerUrl={WORKER_URL}>
                    {pdfFile && <Viewer fileUrl={pdfFile} />}
                </Worker>
            </PopupComponent>

        </>
    )
}