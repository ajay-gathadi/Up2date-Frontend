import "./App.css";
import {Box, CssBaseline, Drawer, IconButton} from "@mui/material";
import {useState} from "react";
import {Outlet} from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import AppDrawer from "./components/AppDrawer.jsx";
import Toolbar from "@mui/material/Toolbar";

function App() {
    const [openDrawer, setOpenDrawer] = useState(false);

    const handleDrawerToggle = () => {
        setOpenDrawer(!openDrawer);
    };

    return (

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
                        backgroundColor: 'rgba(243,203,69, 0.4)',
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
                <Outlet/>
            </Box>
        </Box>
    )
        ;
}

export default App;
