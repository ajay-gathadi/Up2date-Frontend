// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import "./App.css";
import {Box, CssBaseline, Drawer, IconButton} from "@mui/material";
import {useState} from "react";
import MenuIcon from "@mui/icons-material/Menu";
import AppDrawer from "./components/AppDrawer.jsx";
import Toolbar from "@mui/material/Toolbar";
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
                    < AppDrawer
                        // open={openDrawer}
                        onClose={handleDrawerToggle}
                    />
                </Drawer>
                <Box
                    component='main'
                    sx={{
                        flexGrow: 1,
                        p: 3,
                    }}
                >
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
