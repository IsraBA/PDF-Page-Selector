// functions/pdfUtils.js
import { PDFDocument } from "pdf-lib";

export const getPdfTotalPages = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const fileData = new Uint8Array(e.target.result);

            PDFDocument.load(fileData)
                .then((pdfDoc) => {
                    const totalPages = pdfDoc.getPageCount();
                    resolve(totalPages);
                })
                .catch((error) => {
                    reject(new Error("Error loading PDF: " + error.message));
                });
        };

        reader.onerror = (error) => {
            reject(new Error("Error reading file: " + error.message));
        };

        reader.readAsArrayBuffer(file);
    });
};
