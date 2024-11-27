// App.jsx
import React, { useState, useEffect } from "react";
import { Container, Box, Button } from "@mui/material";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PdfUploader from "./components/PdfUploader";
import PdfViewer from "./components/PdfViewer";
import PageSelector from "./components/PageSelector";
import { PDFDocument } from "pdf-lib";

const App = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const [pdfBytes, setPdfBytes] = useState(null);

  const handleFileUpload = (file) => {
    if (file.type !== "application/pdf") {
      alert("יש לבחור קובץ PDF תקין");
      return;
    }
    const fileUrl = URL.createObjectURL(file);
    setPdfFile(fileUrl);
    setSelectedPages([]);
    setPdfBytes(null);
  };

  const handlePageSelect = (pageNumber) => {
    setSelectedPages((prev) =>
      prev.includes(pageNumber)
        ? prev.filter((page) => page !== pageNumber)
        : [...prev, pageNumber]
    );
  };

  const createNewPdf = async () => {
    if (!pdfFile || selectedPages.length === 0) return;

    const existingPdfBytes = await fetch(pdfFile).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const newPdfDoc = await PDFDocument.create();

    for (const pageNumber of selectedPages) {
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
      newPdfDoc.addPage(copiedPage);
    }

    const newPdfBytes = await newPdfDoc.save();
    setPdfBytes(newPdfBytes);
  };

  useEffect(() => {
    if (selectedPages.length > 0) {
      createNewPdf();
    }
  }, [selectedPages]); // הפעולה תתבצע כל פעם שהעמודים שנבחרו משתנים

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

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Navbar />
      <Container sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '25px', gap: '25px' }}>
        <PdfUploader onFileUpload={handleFileUpload} />
        {pdfFile && (
          <>
            <PdfViewer
              file={pdfFile}
              onPageSelect={handlePageSelect}
              selectedPages={selectedPages}
            />
            <PageSelector
              selectedPages={selectedPages}
              onDownloadPdf={downloadPdf}
              isDownloadReady={!!pdfBytes}
            />
          </>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default App;