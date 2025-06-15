// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import "./App.css";
import {Box, CssBaseline, Drawer, IconButton} from "@mui/material";
import {useState} from "react";
import MenuIcon from "@mui/icons-material/Menu";
import AppDrawer from "./components/AppDrawer.jsx";
import CustomerPage from "./Customer_Information/Customer.jsx";
import DashboardPage from "./pages/DashBoard.jsx";
import Toolbar from "@mui/material/Toolbar";

function App() {
    const [openDrawer, setOpenDrawer] = useState(false);

    const handleDrawerToggle = () => {
        setOpenDrawer(!openDrawer);
    };

    return (
        <BrowserRouter>
            <Box sx={{display: "flex", minHeight: "100vh", width: "100%"}}>
                <CssBaseline/>

                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={handleDrawerToggle}
                    disableRipple
                    disableFocusRipple
                    sx={{
                        position: 'fixed',
                        top: 20,
                        left: 25,
                        color: 'black',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        outline: 'none !important',

                        '&:hover': {
                            backgroundColor: 'rgba(223, 168, 18, 0.69)',
                        }
                    }}
                >
                    <MenuIcon sx={{color: 'black'}}/>
                </IconButton>

                <Drawer
                    variant="temporary"
                    anchor="left"
                    open={openDrawer}
                    onClose={handleDrawerToggle}
                    sx={{
                        width: 200,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                        }
                    }}
                >
                    <Toolbar sx={{minHeight: '35px !important'}}/>
                    < AppDrawer
                        onClose={handleDrawerToggle}
                    />
                </Drawer>


                <Box
                    component='main'
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        pt: 7.5,

                    }}
                >
                    <Routes>
                        <Route
                            path="/"
                            element={<Navigate replace to="/customer-details"/>}
                        />
                        <Route path="/customer-details" element={<CustomerPage/>}/>
                        <Route path="/dashboard" element={<DashboardPage/>}/>
                    </Routes>
                </Box>
            </Box>
        </BrowserRouter>
    )
        ;
}

export default App;
