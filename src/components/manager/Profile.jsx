import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext.jsx';
import api from '../../services/service.js';

const Profile = () => {

    const {userData} = useAppContext();
    const [approvedUsers, setApprovedUsers] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [pendingTasks, setPendingTasks] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [open, setOpen] = useState(false);

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
        try{
            const res = await api.get("accounts/manager/approved-users/");
            setApprovedUsers(res.data);
        }catch(err){
            console.log(err);
        }
    };

    const fetchPendingUsers = async () => {
        try{
            const res = await api.get("accounts/manager/pending-users/");
            setPendingUsers(res.data);
        }catch(err){
            console.log(err);
        }
    };


    const fetchPendingLeaves = async () => {
        try{
            const res = await api.get("leave/manager/pending-leaves/");
            setLeaveRequests(res.data);
        }catch(err){
            console.log(err);
        }
    };

    const fetchPendingTasks = async () => {
        try{
            const res = await api.get("task/tasks/");
            setPendingTasks(res.data);
        }catch(err){
            console.log(err);
        }
    };

    useEffect(() => {
        fetchApprovedUsers();
        fetchPendingLeaves();
        fetchPendingUsers();
        fetchPendingTasks();
    }, []);

    useEffect(() => {
        if(userData){
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
            <Box sx={{ display : "flex", justifyContent : "center", padding : "10px"}}>
                <Typography variant='h5' sx={{ fontWeight : 600, fontFamily : 'work sans'}}> My Profile </Typography>
            </Box>
            <Box sx={{ background: "linear-gradient(135deg, #0d47a1, #1e1e1e)", borderRadius: "16px", padding: "24px", display: "flex", alignItems: "center", gap: 3, mb: 4, }}>
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

            <Grid container spacing={2} sx={{ mb: 4 }}>
                {[
                    { label: "Employees", value: approvedUsersCount },
                    { label: "Pending Users", value: pendingUsersCount },
                    { label: "Pending Leaves", value: leaveRequestsCount },
                    { label: "Pending Tasks", value: pendingTasksCount },
                ].map((item, index) => (
                    <Grid item size={{xs: 12, sm: 6, md: 3}} key={index}>
                        <Box sx={{ background: "#1e1e1e", borderRadius: "14px", padding: "16px", textAlign: "center", transition: "0.2s", "&:hover": { transform: "translateY(-4px)" }, }} >
                            <Typography sx={{ fontSize: "14px", opacity: 0.7, color: "white" }}>
                                {item.label}
                            </Typography>
                            <Typography sx={{ fontSize: "22px", fontWeight: 600, color: "white" }}>
                                {item.value}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ background: "#1e1e1e", borderRadius: "16px", padding: "24px", }}>
                <Typography sx={{ fontWeight: 600, mb: 2, color: "#5c6bc0" }}>
                    Personal Information
                </Typography>

                <Grid container spacing={2}>
                    <Grid item size={{xs: 12, sm: 6, md: 6}}>
                        <Typography sx={{ color: "white" }}>Email</Typography>
                        <Typography sx={{ opacity: 0.7, color: "white" }}>{userData?.email}</Typography>
                    </Grid>

                    <Grid item size={{xs: 12, sm: 6, md: 6}}>
                        <Typography sx={{ color: "white" }}>Phone</Typography>
                        <Typography sx={{ opacity: 0.7, color: "white" }}>{userData?.mobile_number}</Typography>
                    </Grid>

                    <Grid item size={{xs: 12, sm: 6, md: 6}}>
                        <Typography sx={{ color: "white" }}>Department</Typography>
                        <Typography sx={{ opacity: 0.7, color: "white" }}>{userData?.department}</Typography>
                    </Grid>

                    <Grid item size={{xs: 12, sm: 6, md: 6}}>
                        <Typography sx={{ color: "white" }}>Joined On</Typography>
                        <Typography sx={{ opacity: 0.7, color: "white" }}>12 Jan 2022</Typography>
                    </Grid>
                </Grid>
            </Box>
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
                    <Button onClick={() => setOpenEdit(false)} sx={{textTransform: "none"}}>Cancel</Button>
                    {/* onClick={updateProfile} */}
                    <Button variant="contained" sx={{textTransform: "none"}}>
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
                    <Button onClick={() => setOpen(false)} sx={{textTransform: "none"}}>Cancel</Button>
                    {/* onClick={updateProfile} */}
                    <Button variant="contained" sx={{textTransform: "none"}}>
                        Change Password
                    </Button>
                </DialogActions>

            </Dialog>

        </div>
    )
}

export default Profile


{/* PASSWORD SECTION */}

        // <Box mt={3}>
        //     <Typography variant="h6">Change Password</Typography>

        //     

        //     <Button
        //         sx={{ mt:2 }}
        //         variant="contained"
        //         // onClick={changePassword}
        //     >
        //         Change Password
        //     </Button>
        // </Box>