import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography, Chip, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext.jsx';
import api from '../../services/service.js';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Profile = () => {

    const { userData } = useAppContext();
    const [openEdit, setOpenEdit] = useState(false);
    const [open, setOpen] = useState(false);
    const [showPersonalInfo, setShowPersonalInfo] = useState(true);

    const [profileForm, setProfileForm] = useState({
        username: userData?.username || "",
        email: userData?.email || "",
        mobile_number: userData?.mobile_number || "",
        department: userData?.department || "",
        designation: userData?.designation || "",
        profile_picture: "",
        profile_preview: ""
    });

    const [passwordForm, setPasswordForm] = useState({
        new_password: "",
        confirm_password: ""
    });


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


    // Profile Update
    const handleUpdateProfile = async () => {
        try {

            const formData = new FormData();

            formData.append("username", profileForm.username);
            formData.append("mobile_number", profileForm.mobile_number);
            formData.append("department", profileForm.department);
            formData.append("designation", profileForm.designation);

            if (profileForm.profile_picture) {
                formData.append("profile_picture", profileForm.profile_picture);
            }

            const res = await api.patch(
                "accounts/profile/update/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            alert("Profile updated successfully");

            setOpenEdit(false);

        } catch (err) {
            console.log(err);
            alert("Profile update failed");
        }
    };
    // Profile Update
    const handleProfileChange = (e) => {
        const { name, value, files } = e.target;

        if (files && files[0]) {
            const imageFile = files[0];

            setProfileForm({
                ...profileForm,
                [name]: imageFile,
                profile_preview: URL.createObjectURL(imageFile)
            });
        } else {
            setProfileForm({
                ...profileForm,
                [name]: value
            });
        }
    };
    const handlePasswordChange = (e) => {
        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value
        });
    };



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
                <Avatar
                    src={profileForm?.profile_preview || userData?.profile_picture}
                    sx={{
                        width: { xs: 80, sm: 100 },
                        height: { xs: 80, sm: 100 },
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontSize: { xs: "32px", sm: "40px" },
                        fontWeight: 700,
                        border: "4px solid rgba(255,255,255,0.1)"
                    }}
                >
                    {!profileForm?.profile_preview &&
                        !userData?.profile_picture &&
                        (userData?.username
                            ? userData.username.charAt(0).toUpperCase()
                            : "M")}
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
                    </Grid>
                )}
            </Box>

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
                <DialogTitle
                    sx={{
                        fontWeight: 700,
                        color: "#1e293b",
                        borderBottom: "1px solid #f1f5f9",
                        textAlign: "center"
                    }}
                >
                    Edit Profile Details
                </DialogTitle>

                <DialogContent sx={{ py: 3 }}>

                    {/* Profile Image Section */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            mb: 3
                        }}
                    >
                        <Avatar
                            src={profileForm?.profile_preview || profileForm?.profile_picture}
                            sx={{
                                width: 90,
                                height: 90,
                                mb: 1,
                                border: "3px solid #e2e8f0"
                            }}
                        />

                        <Button
                            variant="outlined"
                            component="label"
                            sx={{
                                textTransform: "none",
                                borderRadius: "8px"
                            }}
                        >
                            Upload Photo
                            <input
                                hidden
                                accept="image/*"
                                type="file"
                                name="profile_picture"
                                onChange={handleProfileChange}
                            />
                        </Button>
                    </Box>

                    {/* Form Fields */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

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
                    <Button
                        onClick={() => setOpenEdit(false)}
                        sx={{
                            textTransform: "none",
                            color: "#64748b",
                            fontWeight: 600
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleUpdateProfile}
                        sx={{
                            textTransform: "none",
                            bgcolor: "#0d47a1",
                            fontWeight: 600,
                            borderRadius: "8px"
                        }}
                    >
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