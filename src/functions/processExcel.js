// functions/processExcel.js
import * as XLSX from "xlsx";

export const processExcelFile = (file, totalPages) => {
    return new Promise((resolve, reject) => {
        if (!totalPages || typeof totalPages !== "number" || totalPages <= 0) {
            return reject("Total pages in the PDF must be a positive number.");
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Using array-based headers

                // Find the column index for "דפים" or "pages"
                const headers = jsonData[0]; // First row as headers
                const pageIndex = headers.findIndex(
                    (header) => header === "דפים" || header.toLowerCase() === "pages"
                );

                if (pageIndex === -1) {
                    throw new Error('טבלת ה-Excel אינה מכילה עמודה בשם "דפים" או "pages".');
                }

                const pageNumbers = new Set();
                jsonData.slice(1).forEach((row) => {
                    const page = row[pageIndex];
                    if (typeof page === "number" && page > 0 && page <= totalPages) {
                        pageNumbers.add(page);
                    }
                });

                console.log('pageNumbers :>> ', [...pageNumbers]); // Log the extracted page numbers
                resolve([...pageNumbers]); // Convert the Set to an array
            } catch (error) {
                reject("שגיאה בעיבוד הקובץ: " + error.message);
            }
        };

        reader.onerror = () => reject("Error reading the file.");
        reader.readAsArrayBuffer(file);
    });
};