// PageSelector.jsx
import React from "react";
import { Button, Box } from "@mui/material";
import { FaFileDownload, FaFilePdf } from "react-icons/fa";

const PageSelector = ({ selectedPages, onCreatePdf, onDownloadPdf, isDownloadReady }) => (
    <Box sx={{ mt: 2 }}>
        <Button
            disabled={selectedPages.length === 0}
            variant="contained"
            color="primary"
            startIcon={<FaFilePdf style={{ marginLeft: 10 }} />}
            onClick={onCreatePdf}
            sx={{ ml: 2 }}
        >
            יצירת PDF חדש
        </Button>
        {isDownloadReady && (
            <Button
                variant="outlined"
                color="success"
                startIcon={<FaFileDownload style={{ marginLeft: 10 }} />}
                onClick={onDownloadPdf}
                sx={{ ml: 2 }}
            >
                הורדת PDF
            </Button>
        )}
    </Box>
);

export default PageSelector;
