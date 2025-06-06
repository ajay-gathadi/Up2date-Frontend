// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import {
  Navigate,
  Route,
  Routes,
  BrowserRouter,
  Router,
} from "react-router-dom";
import "./App.css";
import Customer from "./Customer_Information/Customer.jsx";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import AppDrawer from "./components/AppDrawer.jsx";
import CustomerPage from "./Customer_Information/Customer.jsx";
import DashboardPage from "./pages/DashBoard.jsx";
function App() {
  // const [count, setCount] = useState(0)
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleDrawerToggle = () => {
    setOpenDrawer(!openDrawer);
  };

  const drawerContent = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Up2date Family Salon
      </Typography>
    </Box>
  );

  return (
    <BrowserRouter>
      <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
        <CssBaseline />
        <Box sx={{ display: "flex" }}>
          <AppBar
            position="fixed"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                Up2date Family Salon
              </Typography>
            </Toolbar>
          </AppBar>

          <AppDrawer open={openDrawer} onClose={handleDrawerToggle} />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              mt: "64px",
              minHeight: "calc(100vh-64px)",
            }}
          >
            <Routes>
              <Route
                path="/"
                element={<Navigate replace to="/customer-details" />}
              />
              <Route path="/customer-details" element={<CustomerPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;
