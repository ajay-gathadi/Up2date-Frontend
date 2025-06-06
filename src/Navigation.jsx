import { Box, Drawer, IconButton, Menu } from "@mui/material";

const Navigation = () => {
  return (
    <Box>
      <IconButton>
        <Menu />
      </IconButton>

      <Drawer></Drawer>
    </Box>
  );
};

export default Navigation;
