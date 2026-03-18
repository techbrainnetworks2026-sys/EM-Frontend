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
import '../ManagerLayout.css';

function Sidebar() {

    const navigate = useNavigate();
    const { sidebarOpen, setSidebarOpen } = useAppContext();

    return (
        <div className={`manager-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
            <div className="manager-sidebar-header">
                {sidebarOpen ? (
                    <>
                        <div className="manager-logo-icon">TN</div>
                        <div className="manager-logo-text-container">
                            <h3 className="manager-logo-title">Techbrain Networks</h3>
                            <p className="manager-logo-subtitle">Employee Management</p>
                        </div>
                    </>
                ) : (
                    <div className="manager-logo-icon" style={{ margin: "0 auto" }}>TN</div>
                )}
            </div>
            <Divider className="manager-sidebar-divider" variant='middle' />
            <div>
                <List className="manager-nav-list">
                    <ListItem disablePadding>
                        <ListItemButton
                            className="manager-nav-item"
                            component={NavLink}
                            to="/manager/dashboard"
                            sx={{ justifyContent: sidebarOpen ? "flex-start" : "center" }}
                        >
                            <DashboardIcon />
                            {sidebarOpen && "Dashboard"}
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            className="manager-nav-item"
                            component={NavLink}
                            to="/manager/addemployee"
                            sx={{ justifyContent: sidebarOpen ? "flex-start" : "center" }}
                        >
                            <PeopleIcon />
                            {sidebarOpen && "Employees Management"}
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            className="manager-nav-item"
                            component={NavLink}
                            to="/manager/addRole"
                            sx={{ justifyContent: sidebarOpen ? "flex-start" : "center" }}
                        >
                            <SecurityIcon />
                            {sidebarOpen && "Role Management"}
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            className="manager-nav-item"
                            component={NavLink}
                            to="/manager/leave-management"
                            sx={{ justifyContent: sidebarOpen ? "flex-start" : "center" }}
                        >
                            <EventNoteIcon />
                            {sidebarOpen && "Manage Leave"}
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            className="manager-nav-item"
                            component={NavLink}
                            to="/manager/task-assign"
                            sx={{ justifyContent: sidebarOpen ? "flex-start" : "center" }}
                        >
                            <AssignmentIcon />
                            {sidebarOpen && "Task Assign"}
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            className="manager-nav-item"
                            component={NavLink}
                            to="/manager/announcement"
                            sx={{ justifyContent: sidebarOpen ? "flex-start" : "center" }}
                        >
                            <CampaignIcon />
                            {sidebarOpen && "Announcement"}
                        </ListItemButton>
                    </ListItem>
                </List>
            </div>
        </div>
    )
}

export default Sidebar
