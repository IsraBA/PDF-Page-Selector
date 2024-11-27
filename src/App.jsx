// App.jsx
import React, { useState, useEffect, useRef } from "react";
import { Container, Box, Button, Typography } from "@mui/material";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PdfUploader from "./components/PdfUploader";
import PdfViewer from "./components/PdfViewer";
import PageSelector from "./components/PageSelector";
import SelectedPagesPreview from "./components/SelectedPagesPreview"; // Preview component
import { processExcelFile } from "./functions/processExcel"; // Import function
import { PDFDocument } from "pdf-lib";
import { getPdfTotalPages } from "./functions/pdfUtils";
import { HiMiniTableCells } from "react-icons/hi2";

const App = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const [pdfBytes, setPdfBytes] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  // Refs for file inputs
  const pdfInputRef = useRef(null);
  const excelInputRef = useRef(null);

  const handleFileUpload = (file) => {
    if (file.type !== "application/pdf") {
      alert("יש לבחור קובץ PDF תקין");
      return;
    }
    const fileUrl = URL.createObjectURL(file);
    setPdfFile(fileUrl);
    setSelectedPages([]);
    setPdfBytes(null);

    // Get total pages using the utility function
    getPdfTotalPages(file)
      .then((pages) => {
        console.log("Total pages in the PDF:", pages);
        setTotalPages(pages);
      })
      .catch((error) => {
        console.error(error.message);
        setTotalPages(0);
      })
      .finally(() => {
        // Reset the file input after processing
        if (pdfInputRef.current) {
          pdfInputRef.current.value = "";
        }
      });
  };

  const handlePageSelect = (pageNumber) => {
    setSelectedPages((prev) =>
      prev.includes(pageNumber)
        ? prev.filter((page) => page !== pageNumber)
        : [...prev, pageNumber]
    );
  };

  const handleExcelUpload = async (file) => {
    if (!totalPages || totalPages <= 0) {
      alert("יש לטעון קובץ PDF תקין לפני העלאת טבלת Excel.");
      return;
    }

    try {
      const pagesFromExcel = await processExcelFile(file, totalPages);
      setSelectedPages((prev) => [...new Set([...prev, ...pagesFromExcel])]); // Merge and deduplicate
    } catch (error) {
      alert(error);
    } finally {
      // Reset the file input after processing
      if (excelInputRef.current) {
        excelInputRef.current.value = "";
      }
    }
  };

  const createNewPdf = async () => {
    if (!pdfFile || selectedPages.length === 0) return;

    const sortedPages = [...selectedPages].sort((a, b) => a - b); // Sort pages in ascending order
    const existingPdfBytes = await fetch(pdfFile).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const newPdfDoc = await PDFDocument.create();

    for (const pageNumber of sortedPages) {
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
      newPdfDoc.addPage(copiedPage);
    }

    const newPdfBytes = await newPdfDoc.save();
    setPdfBytes(newPdfBytes);
  };

  useEffect(() => {
    if (selectedPages.length > 0) {
      createNewPdf();
    } else {
      setPdfBytes(null);
    }
  }, [selectedPages]);

  const downloadPdf = () => {
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "selected-pages.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    return () => {
      if (pdfFile) {
        URL.revokeObjectURL(pdfFile);
      }
    };
  }, [pdfFile]);

  const handleRemovePage = (page) => {
    setSelectedPages((prev) => prev.filter((p) => p !== page));
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <Navbar />
      <Container sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "25px", gap: "25px" }}>
        <PdfUploader onFileUpload={handleFileUpload} nputRef={pdfInputRef} />
        {pdfFile && (
          <>
            <Button
              variant="contained"
              component="label"
              color="secondary"
              startIcon={<HiMiniTableCells style={{ marginLeft: 12 }} />}
            >
              בחירת עמודים באמצעות טבלת Excel
              <input
                type="file"
                accept=".xlsx, .xls"
                hidden
                onChange={(e) => handleExcelUpload(e.target.files[0])}
                ref={excelInputRef}
              />
            </Button>
            <SelectedPagesPreview selectedPages={selectedPages} onRemovePage={handleRemovePage} // Pass the remove function
            />
            <PageSelector
              selectedPages={selectedPages}
              onDownloadPdf={downloadPdf}
              isDownloadReady={!!pdfBytes}
            />
            <PdfViewer
              file={pdfFile}
              onPageSelect={handlePageSelect}
              selectedPages={selectedPages}
            />
          </>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default App;