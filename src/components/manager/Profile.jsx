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
    const [activeTab, setActiveTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
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

    const handleTabChange = (index) => {
        setActiveTab(activeTab === index ? null : index);
        setSearchTerm("");
    };

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

    const tabs = [
        { label: "Employees", value: approvedUsersCount, color: "#3b82f6" },
        { label: "Pending Users", value: pendingUsersCount, color: "#f59e0b" },
        { label: "Pending Leaves", value: leaveRequestsCount, color: "#10b981" },
        { label: "Pending Tasks", value: pendingTasksCount, color: "#ef4444" },
    ];

    return (
        <div>
            <Box sx={{ display: "flex", justifyContent: "center", padding: "10px" }}>
                <Typography variant='h5' sx={{ fontWeight: 600, fontFamily: 'work sans' }}> My Profile </Typography>
            </Box>
            <Box sx={{
                background: "linear-gradient(135deg, #0d47a1 0%, #1e3a8a 100%)",
                borderRadius: "20px",
                padding: { xs: "24px 16px", sm: "32px" },
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                gap: 3,
                mb: 4,
                boxShadow: "0 10px 15px -3px rgba(13, 71, 161, 0.2)"
            }}>
                <Avatar sx={{
                    width: { xs: 80, sm: 100 },
                    height: { xs: 80, sm: 100 },
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontSize: { xs: "32px", sm: "40px" },
                    fontWeight: 700,
                    border: "4px solid rgba(255,255,255,0.1)"
                }}>
                    {userData?.username ? userData.username.charAt(0).toUpperCase() : "M"}
                </Avatar>

                <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
                    <Typography sx={{ fontSize: { xs: "24px", sm: "28px" }, fontWeight: 800, color: "white", mb: 0.5 }}>
                        {userData?.username || "Manager"}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, justifyContent: { xs: "center", sm: "flex-start" }, flexWrap: "wrap" }}>
                        <Chip
                            label={userData?.role || "Manager"}
                            size="small"
                            sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", fontWeight: 600, border: "1px solid rgba(255,255,255,0.1)" }}
                        />
                        <Chip
                            label={userData?.designation || "Admin"}
                            size="small"
                            sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", fontWeight: 600, border: "1px solid rgba(255,255,255,0.1)" }}
                        />
                    </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1.5, width: { xs: "100%", sm: "auto" }, justifyContent: "center" }}>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: "white",
                            color: "#0d47a1",
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: "10px",
                            "&:hover": { bgcolor: "#f8fafc" }
                        }}
                        onClick={() => setOpenEdit(true)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{
                            color: "white",
                            borderColor: "rgba(255,255,255,0.4)",
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: "10px",
                            "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.05)" }
                        }}
                        onClick={() => setOpen(true)}
                    >
                        Password
                    </Button>
                </Box>
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
                    { label: "Employees", value: approvedUsersCount, color: "#3b82f6" },
                    { label: "Pending Users", value: pendingUsersCount, color: "#f59e0b" },
                    { label: "Pending Leaves", value: leaveRequestsCount, color: "#10b981" },
                    { label: "Pending Tasks", value: pendingTasksCount, color: "#ef4444" },
                ].map((item, index) => (
                    <Grid item xs={6} md={3} key={index}>
                        <Box
                            onClick={() => setActiveTab(index)}
                            sx={{
                                background: activeTab === index ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" : "#ffffff",
                                borderRadius: "16px",
                                padding: "20px",
                                textAlign: "center",
                                transition: "all 0.3s ease",
                                cursor: "pointer",
                                border: activeTab === index ? "none" : "1px solid #e2e8f0",
                                boxShadow: activeTab === index ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)" : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                    borderColor: item.color
                                },
                                position: "relative",
                                overflow: "hidden"
                            }} >
                            <Box sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "4px",
                                height: "100%",
                                bgcolor: item.color,
                                display: activeTab === index ? "none" : "block"
                            }} />
                            <Typography sx={{
                                fontSize: "12px",
                                fontWeight: 700,
                                color: activeTab === index ? "rgba(255,255,255,0.6)" : "#64748b",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                mb: 1
                            }}>
                                {item.label}
                            </Typography>
                            <Typography sx={{
                                fontSize: "28px",
                                fontWeight: 800,
                                color: activeTab === index ? "white" : "#1e293b"
                            }}>
                                {item.value}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Tab Content Section */}
            {activeTab !== null && (
                <Box sx={{
                    background: "#ffffff",
                    borderRadius: "20px",
                    padding: { xs: "16px", sm: "24px" },
                    mt: 2,
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
                    border: "1px solid #e2e8f0"
                }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
                        <Typography sx={{ fontWeight: 800, color: "#1e293b", fontSize: "18px" }}>
                            {activeTab === 0 ? "Approved Employees" :
                                activeTab === 1 ? "Pending Approvals" :
                                    activeTab === 2 ? "Recent Leave Requests" : "Ongoing Tasks"}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: { xs: "100%", sm: "auto" } }}>
                            <TextField
                                size="small"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{
                                    width: { xs: "100%", sm: "240px" },
                                    background: "#f8fafc",
                                    "& .MuiOutlinedInput-root": { borderRadius: "10px" }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <Box sx={{ color: "#94a3b8", mr: 1, display: "flex" }}>
                                            <VisibilityIcon sx={{ fontSize: "18px" }} />
                                        </Box>
                                    ),
                                }}
                            />
                            <IconButton onClick={() => setActiveTab(null)} size="small" sx={{ background: "#f1f5f9" }}>
                                <VisibilityOffIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Approved Employees List */}
                    {activeTab === 0 && (
                        <Box>
                            {approvedUsers.length > 0 ? (
                                <TableContainer sx={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
                                    <Table>
                                        <TableHead sx={{ backgroundColor: "#f8fafc" }}>
                                            <TableRow>
                                                <TableCell sx={{ color: "#475569", fontWeight: 700, fontSize: "12px", textTransform: "uppercase" }}>Name</TableCell>
                                                <TableCell sx={{ color: "#475569", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", display: { xs: "none", sm: "table-cell" } }}>Contact</TableCell>
                                                <TableCell sx={{ color: "#475569", fontWeight: 700, fontSize: "12px", textTransform: "uppercase" }}>Designation</TableCell>
                                                <TableCell sx={{ color: "#475569", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", display: { xs: "none", md: "table-cell" } }}>Department</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {approvedUsers.filter(u =>
                                                (u.username || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
                                                (u.first_name && (u.first_name || "").toLowerCase().includes((searchTerm || "").toLowerCase()))
                                            ).map((user, index) => (
                                                <TableRow key={index} sx={{ "&:hover": { background: "#f8fafc" } }}>
                                                    <TableCell>
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                            <Avatar sx={{ width: 32, height: 32, fontSize: "12px", bgcolor: "#e0e7ff", color: "#4338ca", fontWeight: 700 }}>
                                                                {(user.username || "U").charAt(0).toUpperCase()}
                                                            </Avatar>
                                                            <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: "14px" }}>
                                                                {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                                                        <Typography sx={{ color: "#64748b", fontSize: "13px" }}>{user.email}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip label={user.designation || "Employee"} size="small" sx={{ height: "20px", fontSize: "10px", fontWeight: 700, bgcolor: "#f1f5f9", color: "#475569" }} />
                                                    </TableCell>
                                                    <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                                                        <Typography sx={{ color: "#64748b", fontSize: "13px" }}>{user.department || "N/A"}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Box sx={{ py: 6, textAlign: "center", background: "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
                                    <Typography sx={{ color: "#94a3b8", fontWeight: 500 }}>No approved employees found</Typography>
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* Pending Users List */}
                    {activeTab === 1 && (
                        <Box>
                            {pendingUsers.length > 0 ? (
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                    {pendingUsers.filter(u =>
                                        (u.username || "").toLowerCase().includes((searchTerm || "").toLowerCase())
                                    ).map((user, index) => (
                                        <Box key={index} sx={{ p: 2, borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                <Avatar sx={{ bgcolor: "#fee2e2", color: "#ef4444", fontWeight: 700 }}>
                                                    {user.username.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Box>
                                                    <Typography sx={{ fontWeight: 700, color: "#1e293b" }}>{user.username}</Typography>
                                                    <Typography sx={{ fontSize: "12px", color: "#64748b" }}>{user.email}</Typography>
                                                </Box>
                                            </Box>
                                            <Chip label="PENDING" size="small" sx={{ fontWeight: 700, fontSize: "10px", bgcolor: "#fef3c7", color: "#92400e" }} />
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Box sx={{ py: 6, textAlign: "center", background: "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
                                    <Typography sx={{ color: "#94a3b8", fontWeight: 500 }}>No pending approval requests</Typography>
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* Pending Leaves List */}
                    {activeTab === 2 && (
                        <Box>
                            {leaveRequests.length > 0 ? (
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                    {leaveRequests.filter(l =>
                                        (l.user?.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        (l.reason || "").toLowerCase().includes(searchTerm.toLowerCase())
                                    ).map((leave, index) => (
                                        <Box key={index} sx={{ p: 2, borderRadius: "12px", border: "1px solid #e2e8f0", background: "#ffffff" }}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                                <Typography sx={{ fontWeight: 700, color: "#1e293b" }}>
                                                    {leave.user?.username || "Employee"}
                                                </Typography>
                                                <Chip label="LEAVE" size="small" sx={{ height: "18px", fontSize: "10px", fontWeight: 800, bgcolor: "#f1f5f9" }} />
                                            </Box>
                                            <Typography sx={{ fontSize: "13px", color: "#64748b", mb: 1 }}>
                                                {leave.start_date} to {leave.end_date}
                                            </Typography>
                                            <Typography sx={{ fontSize: "13px", color: "#475569", fontStyle: "italic" }}>
                                                "{leave.reason || "No reason provided"}"
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Box sx={{ py: 6, textAlign: "center", background: "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
                                    <Typography sx={{ color: "#94a3b8", fontWeight: 500 }}>No pending leave applications</Typography>
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* Pending Tasks List */}
                    {activeTab === 3 && (
                        <Box>
                            {pendingTasks.filter(t => t.status === "PENDING").length > 0 ? (
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                    {pendingTasks.filter(task =>
                                        task.status === "PENDING" &&
                                        ((task.title || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
                                            (task.assigned_to?.username || "").toLowerCase().includes((searchTerm || "").toLowerCase()))
                                    ).map((task, index) => (
                                        <Box key={index} sx={{ p: 2, borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Box>
                                                <Typography sx={{ fontWeight: 700, color: "#1e293b" }}>{task.title}</Typography>
                                                <Typography sx={{ fontSize: "12px", color: "#64748b" }}>
                                                    Assigned: {task.assigned_to?.username || "N/A"}
                                                </Typography>
                                            </Box>
                                            <Chip label="OVERDUE" size="small" sx={{ fontWeight: 700, fontSize: "10px", bgcolor: "#fee2e2", color: "#ef4444" }} />
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Box sx={{ py: 6, textAlign: "center", background: "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
                                    <Typography sx={{ color: "#94a3b8", fontWeight: 500 }}>No pending tasks found</Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            )}
            <Dialog
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: "16px",
                        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, color: "#1e293b", borderBottom: "1px solid #f1f5f9" }}>
                    Edit Profile Details
                </DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                        <TextField
                            label="Full Name"
                            name="username"
                            value={profileForm?.username}
                            onChange={handleProfileChange}
                            fullWidth
                            variant="outlined"
                        />
                        <TextField
                            label="Email Address"
                            name="email"
                            value={profileForm?.email}
                            disabled
                            fullWidth
                            helperText="Email cannot be changed"
                        />
                        <TextField
                            label="Mobile Number"
                            name="mobile_number"
                            value={profileForm?.mobile_number}
                            onChange={handleProfileChange}
                            fullWidth
                        />
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <TextField
                                label="Department"
                                name="department"
                                value={profileForm?.department}
                                onChange={handleProfileChange}
                                fullWidth
                            />
                            <TextField
                                label="Designation"
                                name="designation"
                                value={profileForm?.designation}
                                onChange={handleProfileChange}
                                fullWidth
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, bgcolor: "#f8fafc" }}>
                    <Button onClick={() => setOpenEdit(false)} sx={{ textTransform: "none", color: "#64748b", fontWeight: 600 }}>Cancel</Button>
                    <Button variant="contained" sx={{ textTransform: "none", bgcolor: "#0d47a1", fontWeight: 600, borderRadius: "8px" }}>
                        Update Profile
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: "16px",
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, color: "#1e293b" }}>Security Settings</DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontSize: "13px", color: "#64748b", mb: 2 }}>
                        Ensure your password is at least 8 characters long for better security.
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label="New Password"
                            type="password"
                            name="new_password"
                            value={passwordForm?.new_password}
                            onChange={handlePasswordChange}
                            fullWidth
                        />
                        <TextField
                            label="Confirm New Password"
                            type="password"
                            name="confirm_password"
                            value={passwordForm?.confirm_password}
                            onChange={handlePasswordChange}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, bgcolor: "#f8fafc" }}>
                    <Button onClick={() => setOpen(false)} sx={{ textTransform: "none", color: "#64748b" }}>Cancel</Button>
                    <Button variant="contained" sx={{ textTransform: "none", bgcolor: "#1e293b", fontWeight: 600 }}>
                        Update Password
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