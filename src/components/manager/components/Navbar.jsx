import { AppBar, Avatar, Box, IconButton, Typography } from '@mui/material'
import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.jsx';

function Navbar(){

    const { sidebarOpen, setSidebarOpen, userData, isMobile } = useAppContext();
    const navigate = useNavigate();

    const handleSidebarOpen = () => {
        if(sidebarOpen){
            setSidebarOpen(false);
        }else{
            setSidebarOpen(true)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/');
    };

    return (
        <div>
            <AppBar elevation = {0} sx={{width : isMobile ? "100%" : (sidebarOpen ? "calc(100% - 300px)" : "calc(100% - 80px)"), left: isMobile ? "0px" : (sidebarOpen ? "300px" : "80px"), padding : "15px", background : "rgb(8, 15, 37)", zIndex : 1400 }}>
                <Box sx={{ display : "flex", flexDirection : "row", justifyContent : "space-between", alignItems : "center"}}>
                    <Box >
                        <IconButton onClick={handleSidebarOpen}>
                            <MenuIcon sx={{color : "white"}} />
                        </IconButton>
                    </Box>
                    <Box sx={{display : "flex", alignItems : "center", gap : "10px"}}>
                        <IconButton onClick={() => navigate('/manager/profile')}>
                            <Avatar sx={{ backgroundColor : "orangered", width : "32px", height : "32px", cursor : "pointer" }}>
                                {userData?.username ? userData.username.charAt(0).toUpperCase() : "M"}
                            </Avatar>
                        </IconButton>
                        <Box>
                            <IconButton onClick={handleLogout}>
                                <LogoutIcon sx={{color : "white"}} />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </AppBar>
        </div>
        
    )
}

export default Navbar
