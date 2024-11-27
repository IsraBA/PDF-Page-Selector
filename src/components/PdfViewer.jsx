// PdfViewer.jsx
import React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.js";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import "@react-pdf-viewer/core/lib/styles/index.css";

const PdfViewer = ({ file, onPageSelect, selectedPages }) => {
    const renderPage = (props) => {
        const pageNumber = props.pageIndex + 1;
        const isSelected = selectedPages.includes(pageNumber);

        const handleCheckboxChange = (event) => {
            const checked = event.target.checked;
            onPageSelect(pageNumber, checked);
        };

        return (
            <div>
                {/* Checkbox and Page Number */}
                <div
                    style={{
                        position: "absolute",
                        top: "8px",
                        right: "-10px",
                        zIndex: 10,
                        // backgroundColor: "rgba(0, 0, 0, 0.8)",
                        padding: "2px",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                    }}
                >
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isSelected}
                                onChange={handleCheckboxChange}
                                color="primary"
                            />
                        }
                        label={
                            <Typography variant="body2" color="textSecondary">
                                עמוד {pageNumber}
                            </Typography>
                        }
                    />
                </div>

                {/* Page Content */}
                {props.canvasLayer.children}
                {props.textLayer.children}
                {props.annotationLayer && props.annotationLayer.children}
            </div>
        );
    };

    return (
        <Box sx={{ flexGrow: 1, width: "100%", maxWidth: "450px", overflowY: "auto" }}>
            <Worker workerUrl={workerSrc}>
                <Viewer fileUrl={file} renderPage={renderPage} />
            </Worker>
        </Box>
    );
};

export default PdfViewer;
