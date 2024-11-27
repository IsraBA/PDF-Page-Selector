// PdfUploader.jsx
import React from "react";
import { Button, Box } from "@mui/material";
import { FaUpload } from "react-icons/fa";

const PdfUploader = ({ onFileUpload }) => {
    const handleFileChange = (e) => {
        if (e.target.files.length) {
            onFileUpload(e.target.files[0]);
        }
    };

    return (
        <Box>
            <Button
                variant="contained"
                component="label"
                startIcon={<FaUpload />}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.2rem' }}
            >
                העלאת PDF
                <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
            </Button>
        </Box>
    );
};

export default PdfUploader;