// PageSelector.jsx
import React from "react";
import { Button, Box } from "@mui/material";
import { FaFileDownload } from "react-icons/fa";

const PageSelector = ({ selectedPages, onDownloadPdf, isDownloadReady }) => (
    <Box sx={{ mt: 2 }}>
        <Button
            disabled={!isDownloadReady}
            variant="outlined"
            color="success"
            startIcon={<FaFileDownload style={{ marginLeft: 10 }} />}
            onClick={onDownloadPdf}
        >
            הורדת PDF
        </Button>
    </Box>
);

export default PageSelector;