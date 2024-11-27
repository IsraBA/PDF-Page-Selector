// SelectedPagesPreview.jsx
import React from "react";
import { Box, Typography, Chip } from "@mui/material";

const SelectedPagesPreview = ({ selectedPages }) => {
  return (
    <Box sx={{ width: "100%", mt: 2, p: 2, border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
      <Typography variant="h6" gutterBottom>
        עמודים שנבחרו:
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {selectedPages.length > 0 ? (
          selectedPages.map((page) => (
            <Chip key={page} label={`עמוד ${page}`} color="primary" />
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            עדיין לא נבחרו עמודים.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default SelectedPagesPreview;
