import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext.jsx';
import api from '../../services/service.js';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Profile = () => {

    const { userData } = useAppContext();
    const [approvedUsers, setApprovedUsers] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [pendingTasks, setPendingTasks] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(null);
    const [showPersonalInfo, setShowPersonalInfo] = useState(true);

    const [profileForm, setProfileForm] = useState({
        username: userData?.username || "",
        email: userData?.email || "",
        mobile_number: userData?.mobile_number || "",
        department: userData?.department || "",
        designation: userData?.designation || "",
    });

    const [passwordForm, setPasswordForm] = useState({
        new_password: "",
        confirm_password: ""
    });

    const fetchApprovedUsers = async () => {
        try {
            const res = await api.get("accounts/manager/approved-users/");
            setApprovedUsers(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchPendingUsers = async () => {
        try {
            const res = await api.get("accounts/manager/pending-users/");
            setPendingUsers(res.data);
        } catch (err) {
            console.log(err);
        }
    };


    const fetchPendingLeaves = async () => {
        try {
            const res = await api.get("leave/manager/pending-leaves/");
            setLeaveRequests(res.data);
        } catch (err) {
            // Error handled
        }
    };

    const fetchPendingTasks = async () => {
        try {
            const res = await api.get("task/tasks/");
            setPendingTasks(res.data);
        } catch (err) {
            // Error handled
        }
    };

    useEffect(() => {
        fetchApprovedUsers();
        fetchPendingLeaves();
        fetchPendingUsers();
        fetchPendingTasks();
    }, []);

    useEffect(() => {
        if (userData) {
            setProfileForm({
                username: userData.username,
                email: userData.email,
                mobile_number: userData.mobile_number,
                department: userData.department,
                designation: userData.designation,
            });
        }
    }, [userData]);

    const handleProfileChange = (e) => {
        setProfileForm({
            ...profileForm,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value
        });
    };


    const approvedUsersCount = approvedUsers.length;
    const pendingUsersCount = pendingUsers.length;
    const leaveRequestsCount = leaveRequests.length;
    const pendingTasksCount = pendingTasks.filter(task => task.status === "PENDING").length;

    return (
        <div>
            <Box sx={{ display: "flex", justifyContent: "center", padding: "10px" }}>
                <Typography variant='h5' sx={{ fontWeight: 600, fontFamily: 'work sans' }}> My Profile </Typography>
            </Box>
            <Box sx={{ background: "linear-gradient(135deg, #0d47a1, #1565c0)", borderRadius: "16px", padding: "24px", display: "flex", alignItems: "center", gap: 3, mb: 4, }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: "white", color: "#0d47a1", fontSize: "32px", fontWeight: 600, }}>
                    {userData?.username ? userData.username.charAt(0).toUpperCase() : "M"}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: "22px", fontWeight: 600, color: "white" }}>
                        {userData?.username || "Manager"}
                    </Typography>
                    <Typography sx={{ opacity: 0.8, color: "white" }}>
                        {userData?.role} • {userData?.designation}
                    </Typography>
                </Box>

                <Button variant="outlined" sx={{ color: "white", borderColor: "white", textTransform: "none", }} onClick={() => setOpenEdit(true)}>
                    Edit Profile
                </Button>
                <Button variant="outlined" sx={{ color: "white", borderColor: "white", textTransform: "none", }} onClick={() => setOpen(true)}>
                    Change Password
                </Button>
            </Box>

            <Box sx={{ background: "#ffffff", borderRadius: "16px", padding: "24px", mb: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ fontWeight: 600, color: "#5c6bc0", fontSize: "18px" }}>
                        Personal Information
                    </Typography>
                    <IconButton
                        onClick={() => setShowPersonalInfo(!showPersonalInfo)}
                        sx={{ color: "#5c6bc0" }}
                        size="small"
                    >
                        {showPersonalInfo ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                </Box>

                {showPersonalInfo && (
                    <Grid container spacing={2}>
                        <Grid item size={{ xs: 12, sm: 6, md: 6 }}>
                            <Typography sx={{ color: "#1e293b", fontWeight: 600 }}>Username</Typography>
                            <Typography sx={{ opacity: 0.7, color: "#334155" }}>{userData?.username}</Typography>
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6, md: 6 }}>
                            <Typography sx={{ color: "#1e293b", fontWeight: 600 }}>Email</Typography>
                            <Typography sx={{ opacity: 0.7, color: "#334155" }}>{userData?.email}</Typography>
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6, md: 6 }}>
                            <Typography sx={{ color: "#1e293b", fontWeight: 600 }}>Phone</Typography>
                            <Typography sx={{ opacity: 0.7, color: "#334155" }}>{userData?.mobile_number}</Typography>
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6, md: 6 }}>
                            <Typography sx={{ color: "#1e293b", fontWeight: 600 }}>Department</Typography>
                            <Typography sx={{ opacity: 0.7, color: "#334155" }}>{userData?.department}</Typography>
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6, md: 6 }}>
                            <Typography sx={{ color: "#1e293b", fontWeight: 600 }}>Joined On</Typography>
                            <Typography sx={{ opacity: 0.7, color: "#334155" }}>12 Jan 2022</Typography>
                        </Grid>
                    </Grid>
                )}
            </Box>

            <Grid container spacing={2} sx={{ mb: 4 }}>
                {[
                    { label: "Employees", value: approvedUsersCount },
                    { label: "Pending Users", value: pendingUsersCount },
                    { label: "Pending Leaves", value: leaveRequestsCount },
                    { label: "Pending Tasks", value: pendingTasksCount },
                ].map((item, index) => (
                    <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                        <Box
                            onClick={() => setActiveTab(index)}
                            sx={{
                                background: activeTab === index ? "#0d47a1" : "#ffffff",
                                borderRadius: "14px",
                                padding: "16px",
                                textAlign: "center",
                                transition: "0.2s",
                                cursor: "pointer",
                                border: activeTab === index ? "2px solid #5c6bc0" : "1px solid #e2e8f0",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    background: activeTab === index ? "#0d47a1" : "#f8fafc"
                                },
                            }} >
                            <Typography sx={{ fontSize: "14px", opacity: 0.7, color: activeTab === index ? "white" : "#64748b" }}>
                                {item.label}
                            </Typography>
                            <Typography sx={{ fontSize: "22px", fontWeight: 600, color: activeTab === index ? "white" : "#1e293b" }}>
                                {item.value}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Tab Content Section */}
            {activeTab !== null && (
                <Box sx={{ background: "#ffffff", borderRadius: "16px", padding: "24px", mt: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
                    {/* Approved Employees List */}
                    {activeTab === 0 && (
                        <Box>
                            <Typography sx={{ fontWeight: 600, mb: 2, color: "#5c6bc0", fontSize: "18px" }}>
                                Approved Employees List
                            </Typography>
                            {approvedUsers.length > 0 ? (
                                <TableContainer component={Paper} sx={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                                    <Table>
                                        <TableHead sx={{ backgroundColor: "#0d47a1" }}>
                                            <TableRow>
                                                <TableCell sx={{ color: "white", fontWeight: 600 }}>Name</TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: 600 }}>Email</TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: 600 }}>Designation</TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: 600 }}>Department</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {approvedUsers.map((user, index) => (
                                                <TableRow key={index} sx={{ borderBottom: "1px solid #f1f5f9", "&:hover": { background: "#f8fafc" } }}>
                                                    <TableCell sx={{ color: "#334155" }}>{user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}</TableCell>
                                                    <TableCell sx={{ color: "#0d47a1" }}>{user.email}</TableCell>
                                                    <TableCell sx={{ color: "#334155" }}>{user.designation || "N/A"}</TableCell>
                                                    <TableCell sx={{ color: "#334155" }}>{user.department || "N/A"}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography sx={{ color: "gray", textAlign: "center", py: 4 }}>No approved employees</Typography>
                            )}
                        </Box>
                    )}

                    {/* Pending Users List */}
                    {activeTab === 1 && (
                        <Box>
                            <Typography sx={{ fontWeight: 600, mb: 2, color: "#5c6bc0", fontSize: "18px" }}>
                                Pending Users List
                            </Typography>
                            {pendingUsers.length > 0 ? (
                                <TableContainer component={Paper} sx={{ background: "#252525" }}>
                                    <Table>
                                        <TableHead sx={{ backgroundColor: "#0d47a1" }}>
                                            <TableRow>
                                                <TableCell sx={{ color: "white", fontWeight: 600 }}>Name</TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: 600 }}>Email</TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: 600 }}>Designation</TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: 600 }}>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {pendingUsers.map((user, index) => (
                                                <TableRow key={index} sx={{ borderBottom: "1px solid #333", "&:hover": { background: "#333" } }}>
                                                    <TableCell sx={{ color: "white" }}>{user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}</TableCell>
                                                    <TableCell sx={{ color: "#5c6bc0" }}>{user.email}</TableCell>
                                                    <TableCell sx={{ color: "white" }}>{user.designation || "N/A"}</TableCell>
                                                    <TableCell>
                                                        <Chip label="PENDING" size="small" sx={{ backgroundColor: "#ffd600", color: "#000", fontWeight: 600 }} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography sx={{ color: "gray", textAlign: "center", py: 4 }}>No pending users</Typography>
                            )}
                        </Box>
                    )}

                    {/* Pending Leaves List */}
                    {activeTab === 2 && (
                        <Box>
                            <Typography sx={{ fontWeight: 600, mb: 2, color: "#5c6bc0", fontSize: "18px" }}>
                                Pending Leaves
                            </Typography>
                            {leaveRequests.length > 0 ? (
                                <TableContainer component={Paper} sx={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                                    <Table>
                                        <TableHead sx={{ backgroundColor: "#0d47a1" }}>
                                            <TableRow>
                                                <TableCell sx={{ color: "white", fontWeight: 600 }}>Employee</TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: 600 }}>From Date</TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: 600 }}>To Date</TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: 600 }}>Reason</TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: 600 }}>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {leaveRequests.map((leave, index) => (
                                                <TableRow key={index} sx={{ borderBottom: "1px solid #f1f5f9", "&:hover": { background: "#f8fafc" } }}>
                                                    <TableCell sx={{ color: "#334155" }}>{leave.user?.first_name && leave.user?.last_name ? `${leave.user.first_name} ${leave.user.last_name}` : leave.user?.username}</TableCell>
                                                    <TableCell sx={{ color: "#334155" }}>{leave.start_date}</TableCell>
                                                    <TableCell sx={{ color: "#334155" }}>{leave.end_date}</TableCell>
                                                    <TableCell sx={{ color: "#334155" }}>{leave.reason || "N/A"}</TableCell>
                                                    <TableCell>
                                                        <Chip label="PENDING" size="small" sx={{ backgroundColor: "#ffc107", color: "#000", fontWeight: 600 }} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography sx={{ color: "gray", textAlign: "center", py: 4 }}>No pending leaves</Typography>
                            )}
                        </Box>
                    )}

                    {/* Pending Tasks List */}
                    {activeTab === 3 && (
                        <Box>
                            <Typography sx={{ fontWeight: 600, mb: 2, color: "#5c6bc0", fontSize: "18px" }}>
                                Pending Tasks
                            </Typography>
                            {pendingTasks.length > 0 ? (
                                <TableContainer component={Paper} sx={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                                    <Table>
                                        <TableHead sx={{ backgroundColor: "#0d47a1" }}>
                                            <TableRow>
                                                <TableCell sx={{ color: "white", fontWeight: 600 }}>Task Title</TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: 600 }}>Assigned To</TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: 600 }}>Start Date</TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: 600 }}>End Date</TableCell>
                                                <TableCell sx={{ color: "white", fontWeight: 600 }}>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {pendingTasks.filter(task => task.status === "PENDING").map((task, index) => (
                                                <TableRow key={index} sx={{ borderBottom: "1px solid #f1f5f9", "&:hover": { background: "#f8fafc" } }}>
                                                    <TableCell sx={{ color: "#334155" }}>{task.title}</TableCell>
                                                    <TableCell sx={{ color: "#334155" }}>{task.assigned_to?.first_name} {task.assigned_to?.last_name}</TableCell>
                                                    <TableCell sx={{ color: "#334155" }}>{task.start_date}</TableCell>
                                                    <TableCell sx={{ color: "#334155" }}>{task.end_date}</TableCell>
                                                    <TableCell>
                                                        <Chip label="PENDING" size="small" sx={{ backgroundColor: "#ffa726", color: "white", fontWeight: 600 }} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography sx={{ color: "gray", textAlign: "center", py: 4 }}>No pending tasks</Typography>
                            )}
                        </Box>
                    )}
                </Box>
            )}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>

                <DialogTitle>Edit Profile</DialogTitle>

                <DialogContent>

                    <TextField
                        margin="dense"
                        label="Username"
                        name="username"
                        value={profileForm?.username}
                        onChange={handleProfileChange}
                        fullWidth
                    />

                    <TextField
                        margin="dense"
                        label="Email"
                        name="email"
                        value={profileForm?.email}
                        disabled
                        fullWidth
                    />

                    <TextField
                        margin="dense"
                        label="Mobile"
                        name="mobile_number"
                        value={profileForm?.mobile_number}
                        onChange={handleProfileChange}
                        fullWidth
                    />


                    <TextField
                        margin="dense"
                        label="Department"
                        name="department"
                        value={profileForm?.department}
                        onChange={handleProfileChange}
                        fullWidth
                    />

                    <TextField
                        margin="dense"
                        label="Designation"
                        name="designation"
                        value={profileForm?.designation}
                        onChange={handleProfileChange}
                        fullWidth
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)} sx={{ textTransform: "none" }}>Cancel</Button>
                    {/* onClick={updateProfile} */}
                    <Button variant="contained" sx={{ textTransform: "none" }}>
                        Save Changes
                    </Button>
                </DialogActions>

            </Dialog>
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>

                <DialogTitle>Change Password</DialogTitle>

                <DialogContent>

                    <TextField
                        margin="dense"
                        label="New Password"
                        type="password"
                        name="new_password"
                        value={passwordForm?.new_password}
                        onChange={handlePasswordChange}
                        fullWidth
                    />

                    <TextField
                        margin="dense"
                        label="Confirm Password"
                        type="password"
                        name="confirm_password"
                        value={passwordForm?.confirm_password}
                        onChange={handlePasswordChange}
                        fullWidth
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)} sx={{ textTransform: "none" }}>Cancel</Button>
                    {/* onClick={updateProfile} */}
                    <Button variant="contained" sx={{ textTransform: "none" }}>
                        Change Password
                    </Button>
                </DialogActions>

            </Dialog>

        </div>
    )
}

export default Profile

const ProfileDetail = ({ label, value, icon }) => (
    <Grid item xs={12} sm={6}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, borderRadius: "8px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            {icon}
            <Box>
                <Typography variant="caption" sx={{ color: "#64748b", textTransform: "uppercase", fontSize: "10px", fontWeight: "bold" }}>
                    {label}
                </Typography>
                <Typography variant="body1" sx={{ color: "#1e293b", fontWeight: 500 }}>
                    {value || "Not specified"}
                </Typography>
            </Box>
        </Box>
    </Grid>
);