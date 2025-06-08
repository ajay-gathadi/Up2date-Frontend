// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import {BrowserRouter, Navigate, Route, Routes,} from "react-router-dom";
import "./App.css";
import {AppBar, Box, CssBaseline, Drawer, IconButton, Toolbar,} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {useState} from "react";
import AppDrawer from "./components/AppDrawer.jsx";
import CustomerPage from "./Customer_Information/Customer.jsx";
import DashboardPage from "./pages/DashBoard.jsx";

function App() {
    // const [count, setCount] = useState(0)
    const [openDrawer, setOpenDrawer] = useState(false);

    const handleDrawerToggle = () => {
        setOpenDrawer(!openDrawer);
    };

    return (
        <BrowserRouter>
            <Box sx={{display: "flex", minHeight: "100vh", width: "100%"}}>
                <CssBaseline/>
                <AppBar
                    position="fixed"
                    sx={{
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        // backgroundColor: 'rgba(223, 168, 18, 0.69)'
                        backgroundColor: 'transparent',
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            disableRipple
                            sx={{
                                mr: 2,
                                color: 'black',
                                '&.Mui-focusVisible': {
                                    backgroundColor: 'transparent',
                                    outline: 'none !important',
                                    boxShadow: 'none !important',
                                    border: 'none !important',
                                    '&::before': {
                                        content: '"none !important"',
                                        display: 'none !important',
                                    },
                                    '&::after': {
                                        content: '"none !important"',
                                        display: 'none',
                                        boxShadow: 'none !important',
                                        backgroundColor: 'transparent !important',
                                    },

                                },
                                '&:hover': {
                                    backgroundColor: 'rgb(255,222,89)',
                                }
                            }}
                        >
                            <MenuIcon sx={{color: 'black'}}/>
                        </IconButton>
                    </Toolbar>
                </AppBar>

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
                    <Toolbar/>
                    < AppDrawer open={openDrawer} onClose={handleDrawerToggle}/>
                </Drawer>
                <Box
                    component='main'
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        // mt: "64px",
                        // minHeight: "calc(100vh-64px)",
                    }}
                >
                    <Toolbar/>
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
