import {Assessment, Dashboard, People} from "@mui/icons-material";
import {Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText,} from "@mui/material";
import {Link} from "react-router-dom";

const AppDrawer = ({open, onClose}) => {
    const drawerItems = [
        {
            text: "Customer Information",
            icon: <People/>,
            path: "/customer-details",
        },
        {
            text: "Dashboard",
            icon: <Dashboard/>,
            path: "/dashboard"
        },
        {
            text: "Reports",
            icon: <Assessment/>,
            path: "/reports"
        }
    ];

    return (
        <Box
            sx={{width: 245}}
            role="presentation"
            onClick={onClose}
            onKeyDown={onClose}
        >
            <List>
                <ListItem>
                    <ListItemText
                        // primary="Menu"
                        slotProps={{
                            primary: {variant: "h6", align: "center"},
                        }}
                    />
                </ListItem>
                {drawerItems.map((currentItem) => (
                    <ListItem key={currentItem.text} disablePadding>
                        <ListItemButton component={Link} to={currentItem.path}>
                            <ListItemIcon sx={
                                {color: 'rgba(223, 168, 18, 0.69)'}
                            }>{currentItem.icon}</ListItemIcon>
                            <ListItemText primary={currentItem.text}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default AppDrawer;
