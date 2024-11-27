// Navbar.jsx
import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { FaFilePdf } from "react-icons/fa";

const Navbar = () => (
    <AppBar position="static">
        <Toolbar>
            <FaFilePdf size={20} style={{ marginLeft: 8 }} />
            <Typography variant="h6" component="div">
                בורר דפי PDF
            </Typography>
        </Toolbar>
    </AppBar>
);

export default Navbar;