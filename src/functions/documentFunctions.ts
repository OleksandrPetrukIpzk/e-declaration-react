import {DocumentDaoService} from "../services/documentDaoService";
import {PDFDocument, PDFPage, rgb} from "pdf-lib";
import {inputPlaced, openSansUrls} from "../constants/componentsConsts";
import fontkit from "@pdf-lib/fontkit";
import {Dispatch, SetStateAction} from "react";
export const drawText = async (text: string[], page: PDFPage, pdfDoc: PDFDocument,) => {
    const url = openSansUrls.partial;
    console.log(`Downloading font from ${url}\n`);
    const openSansBytes = await fetch(url).then((res) => res.arrayBuffer());
    const openSansFont = await pdfDoc.embedFont(openSansBytes);
    const supportedCharacters = openSansFont
        .getCharacterSet()
        .map((codePoint) => String.fromCodePoint(codePoint))
        .join('');
    const { width, height } = page.getSize();
    console.log(`Characters supported by font: ${supportedCharacters}\n`);
    inputPlaced.forEach((parameters, id) => {
        if(text[id]) {
            page.drawText(text[id], {
                x: parameters.x,
                y: height - parameters.y,
                size: 15,
                color: rgb(0, 0, 0),
                font: openSansFont,
            });
        }
    });
}
const updatePdfWithText = async (pdfDoc: PDFDocument, text: string[]): Promise<Uint8Array> => {
    pdfDoc.registerFontkit(fontkit);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    await drawText(text, firstPage, pdfDoc);
    const pdfBytes = await pdfDoc.save();
    return new Uint8Array(pdfBytes);
};
export const subscribeDocument = async (imageBytes: ArrayBuffer, setPdfFile: Dispatch<SetStateAction<string | null>>, xCoordinate: number, yCoordinate: number) =>{
    const file = await DocumentDaoService.getDocument();
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const pdfDoc = await PDFDocument.load(uint8Array);
    const pngImage = await pdfDoc.embedPng(imageBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[1];
    const { width, height } = firstPage.getSize();
    firstPage.drawImage(pngImage, {
        x: xCoordinate,
        y: height - yCoordinate,
    });
    const pdfBytes = await pdfDoc.save();
    const updatedPdf = new Uint8Array(pdfBytes);
    const blob = new Blob([updatedPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setPdfFile(url);
}
export const renderPDFFile = async (inputValue: string[], setPdfFile: Dispatch<SetStateAction<string | null>>, setOpenPopup: Dispatch<SetStateAction<boolean>>) =>{
    const file = await DocumentDaoService.getDocument();
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const pdfDoc = await PDFDocument.load(uint8Array);
    const updatedPdf = await updatePdfWithText(pdfDoc, inputValue);
    const blob = new Blob([updatedPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setPdfFile(url);
    setOpenPopup(true);
}