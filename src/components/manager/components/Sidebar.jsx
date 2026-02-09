import { Divider, List, ListItem, ListItemButton } from '@mui/material'
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SecurityIcon from "@mui/icons-material/Security";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CampaignIcon from "@mui/icons-material/Campaign";
import { useAppContext } from '../../context/AppContext.jsx';

function Sidebar(){

    const navigate = useNavigate();
    const { sidebarOpen, setSidebarOpen, isMobile } = useAppContext();

    return (
        <div style={{ width : isMobile ? (sidebarOpen ? "300px" : "0px") : (sidebarOpen ? "300px" : "80px"), height : "100dvh",position: "fixed",top : 0, left : 0, zIndex: 1500, border : "white", background : "rgb(8, 15, 37)",boxShadow: isMobile && sidebarOpen ? "0 0 15px rgba(0,0,0,0.5)" : "none", overflow: "hidden",}}>
            <div style={{display : "flex", alignItems : "center", justifyContent : "center", height : "80px", padding : "10px", columnGap : "10px", textAlign : "center"}}>
                {sidebarOpen && 
                    <>
                        <h3 style={{ fontFamily: "Work Sans", color: "whitesmoke", fontWeight: 600 }}>
                            Techbrain
                        </h3>
                        <p style={{ fontSize: "12px", opacity: 0.6, color : "white", fontFamily : "work sans" }}>Employee Management</p>
                    </>
                }
            </div>
            <Divider sx={{ border : "1px solid gray" }} variant='middle' />
            <div>
                <List sx={{ display : "flex", rowGap : "15px", flexDirection : "column", paddingTop : "20px"}}>
                    <ListItem disablePadding> 
                        {sidebarOpen ? (
                            <ListItemButton component={NavLink} to="/manager/dashboard" sx={{padding : "15px", justifyContent : "flex-start",paddingLeft: "24px", gap: "12px", fontSize : "20px", fontFamily : "work sans",color : "whitesmoke",
                                "&.active": {
                                    backgroundColor: "rgba(255,255,255,0.15)",
                                    borderLeft: "4px solid #90caf9",
                                },
                                "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.08)",
                                    transition: "all 0.2s ease",
                                },
                            }} > <DashboardIcon /> Dashboard </ListItemButton>
                        ) : (
                            <ListItemButton component={NavLink} to="/manager/dashboard" sx={{padding : "15px", justifyContent : "flex-start",paddingLeft: "24px", gap: "12px", fontSize : "20px", fontFamily : "work sans",color : "whitesmoke",
                                "&.active": {
                                    backgroundColor: "rgba(255,255,255,0.15)",
                                    borderLeft: "4px solid #90caf9",
                                },
                                "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.08)",
                                    transition: "all 0.2s ease",
                                },
                            }} > <DashboardIcon /></ListItemButton>
                        )} 
                    </ListItem>
                    <ListItem disablePadding>
                        {sidebarOpen ? (
                            <ListItemButton component={NavLink} to="/manager/addemployee" sx={{padding : "15px", justifyContent : "flex-start",paddingLeft: "24px", gap: "12px", fontSize : "20px", fontFamily : "work sans",color : "whitesmoke",
                                "&.active": {
                                    backgroundColor: "rgba(255,255,255,0.15)",
                                    borderLeft: "4px solid #90caf9",
                                },
                                "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.08)",
                                    transition: "all 0.2s ease",
                                },
                            }} > <PeopleIcon /> Employees Management </ListItemButton>
                        ) : (
                            <ListItemButton component={NavLink} to="/manager/addemployee" sx={{padding : "15px", justifyContent : "flex-start",paddingLeft: "24px", gap: "12px", fontSize : "20px", fontFamily : "work sans",color : "whitesmoke",
                                "&.active": {
                                    backgroundColor: "rgba(255,255,255,0.15)",
                                    borderLeft: "4px solid #90caf9",
                                },
                                "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.08)",
                                    transition: "all 0.2s ease",
                                },
                            }} > <PeopleIcon /></ListItemButton>
                        )} 
                    </ListItem>
                    <ListItem disablePadding>
                        {sidebarOpen ? (
                            <ListItemButton component={NavLink} to="/manager/addRole" sx={{padding : "15px", justifyContent : "flex-start",paddingLeft: "24px", gap: "12px", fontSize : "20px", fontFamily : "work sans",color : "whitesmoke",
                                "&.active": {
                                    backgroundColor: "rgba(255,255,255,0.15)",
                                    borderLeft: "4px solid #90caf9",
                                },
                                "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.08)",
                                    transition: "all 0.2s ease",
                                },
                            }} > <SecurityIcon /> Role Management </ListItemButton>
                        ) : (
                            <ListItemButton component={NavLink} to="/manager/addRole" sx={{padding : "15px", justifyContent : "flex-start",paddingLeft: "24px", gap: "12px", fontSize : "20px", fontFamily : "work sans",color : "whitesmoke",
                                "&.active": {
                                    backgroundColor: "rgba(255,255,255,0.15)",
                                    borderLeft: "4px solid #90caf9",
                                },
                                "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.08)",
                                    transition: "all 0.2s ease",
                                },
                            }} > <SecurityIcon /></ListItemButton>
                        )}  
                    </ListItem>
                    <ListItem disablePadding>
                        {sidebarOpen ? (
                            <ListItemButton component={NavLink} to="/manager/leave-management" sx={{padding : "15px", justifyContent : "flex-start",paddingLeft: "24px", gap: "12px", fontSize : "20px", fontFamily : "work sans",color : "whitesmoke",
                                "&.active": {
                                    backgroundColor: "rgba(255,255,255,0.15)",
                                    borderLeft: "4px solid #90caf9",
                                },
                                "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.08)",
                                    transition: "all 0.2s ease",
                                },
                            }} > <EventNoteIcon /> Manage Leave </ListItemButton>
                        ) : (
                            <ListItemButton component={NavLink} to="/manager/leave-management" sx={{padding : "15px", justifyContent : "flex-start",paddingLeft: "24px", gap: "12px", fontSize : "20px", fontFamily : "work sans",color : "whitesmoke",
                                "&.active": {
                                    backgroundColor: "rgba(255,255,255,0.15)",
                                    borderLeft: "4px solid #90caf9",
                                },
                                "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.08)",
                                    transition: "all 0.2s ease",
                                },
                            }} > <EventNoteIcon /></ListItemButton>
                        )}
                        
                    </ListItem>
                    <ListItem disablePadding>
                        {sidebarOpen ? (
                            <ListItemButton component={NavLink} to="/manager/task-assign" sx={{padding : "15px", justifyContent : "flex-start",paddingLeft: "24px", gap: "12px", fontSize : "20px", fontFamily : "work sans",color : "whitesmoke",
                                "&.active": {
                                    backgroundColor: "rgba(255,255,255,0.15)",
                                    borderLeft: "4px solid #90caf9",
                                },
                                "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.08)",
                                    transition: "all 0.2s ease",
                                },
                            }} > <AssignmentIcon /> Task Assign </ListItemButton>
                        ) : (
                            <ListItemButton component={NavLink} to="/manager/task-assign" sx={{padding : "15px", justifyContent : "flex-start",paddingLeft: "24px", gap: "12px", fontSize : "20px", fontFamily : "work sans",color : "whitesmoke",
                                "&.active": {
                                    backgroundColor: "rgba(255,255,255,0.15)",
                                    borderLeft: "4px solid #90caf9",
                                },
                                "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.08)",
                                    transition: "all 0.2s ease",
                                },
                            }} > <AssignmentIcon /></ListItemButton>
                        )} 
                    </ListItem>
                    <ListItem disablePadding>
                        {sidebarOpen ? (
                            <ListItemButton component={NavLink} to="/manager/announcement" sx={{padding : "15px", justifyContent : "flex-start",paddingLeft: "24px", gap: "12px", fontSize : "20px", fontFamily : "work sans",color : "whitesmoke",
                                "&.active": {
                                    backgroundColor: "rgba(255,255,255,0.15)",
                                    borderLeft: "4px solid #90caf9",
                                },
                                "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.08)",
                                    transition: "all 0.2s ease",
                                },
                            }} > <CampaignIcon /> Announcement </ListItemButton>
                        ) : (
                            <ListItemButton component={NavLink} to="/manager/announcement" sx={{padding : "15px", justifyContent : "flex-start",paddingLeft: "24px", gap: "12px", fontSize : "20px", fontFamily : "work sans",color : "whitesmoke",
                                "&.active": {
                                    backgroundColor: "rgba(255,255,255,0.15)",
                                    borderLeft: "4px solid #90caf9",
                                },
                                "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.08)",
                                    transition: "all 0.2s ease",
                                },
                            }} > <CampaignIcon /></ListItemButton>
                        )}
                         
                    </ListItem>
                </List>
            </div>
            {isMobile && sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: "rgba(0,0,0,0.1)",
                    zIndex: 1300
                    }}
                />
            )}
        </div>
    )
}

export default Sidebar
