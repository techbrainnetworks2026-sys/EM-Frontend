import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, MenuItem, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import BadgeIcon from '@mui/icons-material/Badge';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAppContext } from '../context/AppContext.jsx';
import api from '../../services/service.js';
import MuiAlert from "@mui/material/Alert";

const AddEmployee = () => {

    const [open, setOpen] = useState(false);
    const [uopen, setUOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const { isMobile, Register } = useAppContext();
    const [rows, setRows] = useState([]);
    const [arows, setARows] = useState([]);
    const [sopen, setSOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [dob, setDob] = useState("");
    const [bloodgrp, setBloodgrp] = useState("");
    const [dept, setDept] = useState("");
    const [design, setDesign] = useState("");
    const [pass, setPass] = useState("");
    const [cpass, setCPass] = useState("");
    const [role, setRole] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Error states for validation
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        mobile: "",
        dob: "",
        bloodgrp: "",
        dept: "",
        design: "",
        pass: "",
        cpass: "",
        role: ""
    });

    const handleSnackClose = () => setSOpen(false);

    // Validation functions
    const validateName = (value) => {
        if (!value || value.trim().length === 0) return "Name is required";
        if (value.trim().length < 3) return "Name must be at least 3 characters";
        if (!/^[a-zA-Z\s]+$/.test(value)) return "Name can only contain letters and spaces";
        return "";
    };

    const validateEmail = (value) => {
        if (!value) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Please enter a valid email";
        return "";
    };

    const validateMobile = (value) => {
        if (!value) return "Mobile number is required";
        if (!/^[0-9]{10}$/.test(value)) return "Mobile number must be 10 digits";
        return "";
    };

    const validatePassword = (value) => {
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
    };

    const validateConfirmPassword = (value, password) => {
        if (!value) return "Confirm password is required";
        if (value !== password) return "Passwords do not match";
        return "";
    };

    const validateSelect = (value, fieldName) => {
        if (!value) return `${fieldName} is required`;
        return "";
    };

    // Handle field changes with validation
    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        setErrors(prev => ({ ...prev, name: validateName(value) }));
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setErrors(prev => ({ ...prev, email: validateEmail(value) }));
    };

    const handleMobileChange = (e) => {
        const value = e.target.value;
        setMobile(value);
        setErrors(prev => ({ ...prev, mobile: validateMobile(value) }));
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPass(value);
        setErrors(prev => ({ ...prev, pass: validatePassword(value) }));
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setCPass(value);
        setErrors(prev => ({ ...prev, cpass: validateConfirmPassword(value, pass) }));
    };

    const handleBloodGroupChange = (e) => {
        const value = e.target.value;
        setBloodgrp(value);
        setErrors(prev => ({ ...prev, bloodgrp: validateSelect(value, "Blood Group") }));
    };

    const handleDepartmentChange = (e) => {
        const value = e.target.value;
        setDept(value);
        setErrors(prev => ({ ...prev, dept: validateSelect(value, "Department") }));
    };

    const handleDesignationChange = (e) => {
        const value = e.target.value;
        setDesign(value);
        setErrors(prev => ({ ...prev, design: validateSelect(value, "Designation") }));
    };

    const handleRoleChange = (e) => {
        const value = e.target.value;
        setRole(value);
        setErrors(prev => ({ ...prev, role: validateSelect(value, "Role") }));
    };

    const handleDobChange = (e) => {
        const value = e.target.value;
        setDob(value);
        if (!value) {
            setErrors(prev => ({ ...prev, dob: "Date of birth is required" }));
        } else {
            setErrors(prev => ({ ...prev, dob: "" }));
        }
    };

    const handleUOpen = (row) => {
        setUOpen(true);
        setSelectedUser(row);
    };

    const handleClose = () => setOpen(false);

    const handleUClose = () => {
        setUOpen(false);
        setSelectedUser(null);
    };

    const fetchPendingUsers = async () => {
        try {
            const res = await api.get("accounts/manager/pending-users/");
            setRows(res.data);
        } catch (err) {
            // Error handled by state if needed
        }
    };

    const ApprovedUsersList = async () => {
        try {
            const res = await api.get("accounts/manager/approved-users/");
            setARows(res.data);
        } catch (err) {
            // Error handled by state if needed
        }
    }

    useEffect(() => {
        fetchPendingUsers();
        ApprovedUsersList();
    }, []);

    const handleApproveUser = async (userId) => {
        try {
            const res = await api.post(`accounts/manager/approve-user/${userId}/`);
            setRows(prev => prev.map(user => user.id === userId ? { ...user, is_approved: true } : user));
            setMessage(res.data.message);
            setSeverity("success");
            setSOpen(true);
            handleUClose();
            await fetchPendingUsers();
            await ApprovedUsersList();
        } catch (err) {
            setMessage(
                err.response?.data?.error || "Approval failed"
            );
            setSeverity("error");
            setSOpen(true);
        }

    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();

        // Validate all fields
        const nameErr = validateName(name);
        const emailErr = validateEmail(email);
        const mobileErr = validateMobile(mobile);
        const dobErr = !dob ? "Date of birth is required" : "";
        const bloodgrpErr = validateSelect(bloodgrp, "Blood Group");
        const deptErr = validateSelect(dept, "Department");
        const designErr = validateSelect(design, "Designation");
        const passErr = validatePassword(pass);
        const cpassErr = validateConfirmPassword(cpass, pass);
        const roleErr = validateSelect(role, "Role");

        const newErrors = {
            name: nameErr,
            email: emailErr,
            mobile: mobileErr,
            dob: dobErr,
            bloodgrp: bloodgrpErr,
            dept: deptErr,
            design: designErr,
            pass: passErr,
            cpass: cpassErr,
            role: roleErr
        };

        setErrors(newErrors);

        // Check if any errors exist
        const hasErrors = Object.values(newErrors).some(err => err !== "");
        if (hasErrors) {
            setMessage("Please fix all validation errors");
            setSeverity("error");
            setSOpen(true);
            return;
        }

        try {
            const res = await Register(name, email, pass, role, dept, design, bloodgrp, mobile, dob);
            setMessage("Employee registered successfully! Awaiting approval.");
            setSeverity('success');
            setSOpen(true);

            // Reset form
            setName("");
            setEmail("");
            setMobile("");
            setDob("");
            setBloodgrp("");
            setDept("");
            setDesign("");
            setPass("");
            setCPass("");
            setRole("");
            setErrors({
                name: "",
                email: "",
                mobile: "",
                dob: "",
                bloodgrp: "",
                dept: "",
                design: "",
                pass: "",
                cpass: "",
                role: ""
            });

            handleClose();
            await fetchPendingUsers();
        } catch (err) {
            if (err.response?.data?.error) {
                const errorMsg = err.response?.data?.error;
                setMessage(errorMsg);
                setSeverity("error");
                setSOpen(true);
            } else if (err.response?.data?.email) {
                setMessage("Email already exists. Please use another email.");
                setSeverity("error");
                setSOpen(true);
            } else {
                setMessage("Something went wrong. Please try again later.");
                setSeverity("error");
                setSOpen(true);
            }
        }
    }




    return (
        <div>
            <Typography variant='h5' component='p' sx={{
                fontFamily: "work sans",
                fontWeight: "600",
                color: "#080808"
            }}> Techbrain Employees List </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, gap: 2, flexWrap: "wrap" }}>
                <TextField
                    size="small"
                    placeholder="Search employee by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        width: { xs: "100%", sm: "300px" },
                        background: "white",
                        borderRadius: "8px",
                    }}
                />
                <Button onClick={() => setOpen(true)} sx={{ textTransform: "none", background: "#00838f", color: "whitesmoke", height: "fit-content" }}> + Add Employee </Button>
            </Box>
            <Box sx={{ marginTop: "20px" }}>
                {/* <Box>
                    <Typography variant='h6' sx={{ fontFamily: "work sans", fontWeight: 600, color: "#080808" }}> Approved Employees List</Typography>
                </Box> */}
                <TableContainer
                    component={Paper}
                    sx={{
                        mt: 1,
                        background: "white",
                        borderRadius: "12px",
                    }}
                >
                    <Table>
                        <TableHead sx={{ display: { xs: "none", sm: "table-header-group" } }}>
                            <TableRow>
                                <TableCell align="left" sx={{ color: "#1e293b", fontWeight: 600 }}>
                                    Employee
                                </TableCell>
                                <TableCell align="left" sx={{ color: "#1e293b", fontWeight: 600 }}>
                                    Email
                                </TableCell>
                                <TableCell align="left" sx={{ color: "#1e293b", fontWeight: 600 }}>
                                    Designation
                                </TableCell>
                                <TableCell align="left" sx={{ color: "#1e293b", fontWeight: 600 }}>
                                    Status
                                </TableCell>
                                <TableCell align="left" sx={{ color: "#1e293b", fontWeight: 600 }}>
                                    View
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {!isMobile ?
                                arows.filter((pending) =>
                                    (pending?.is_approved === true) &&
                                    (pending?.username || "").toLowerCase().includes((searchTerm || "").toLowerCase())
                                ).map((row, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell sx={{ color: "#334155" }}>
                                            <div style={{ display: "flex", alignItems: "left", justifyContent: "left", columnGap: "10px" }}>
                                                <Avatar sx={{ width: 32, height: 32, background: "#0d47a1" }}>
                                                    {row.username.charAt(0).toUpperCase()}
                                                </Avatar>
                                                {row.username}
                                            </div>
                                        </TableCell>
                                        <TableCell align="left" sx={{ color: "#334155" }}>
                                            {row.email}
                                        </TableCell>
                                        <TableCell align="left" sx={{ color: "#334155" }}>
                                            {row.designation}
                                        </TableCell>
                                        <TableCell align="left" sx={{ color: "#334155" }}>
                                            <Chip label={"APPROVED"}
                                                size="small"
                                                sx={{
                                                    backgroundColor: "#2e7d32",
                                                    color: "white",
                                                    fontWeight: 600,
                                                    textTransform: "capitalize",
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="left">
                                            <IconButton sx={{ color: "#90caf9" }} onClick={() => handleUOpen(row)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                                : arows.filter((pending) =>
                                    (pending?.is_approved === true) &&
                                    (pending?.username || "").toLowerCase().includes((searchTerm || "").toLowerCase())
                                ).map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell colSpan={5} sx={{ borderBottom: "none", padding: "8px" }}>
                                            <Box sx={{
                                                background: "#ffffff",
                                                borderRadius: "12px",
                                                padding: "16px",
                                                mb: 1,
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 1.5,
                                                border: "1px solid #e2e8f0",
                                                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                                            }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                        <Avatar sx={{ width: 40, height: 40, bgcolor: "#0d47a1" }}>
                                                            {row.username.charAt(0).toUpperCase()}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography sx={{ fontWeight: 600, color: "#1e293b" }}>
                                                                {row.username}
                                                            </Typography>
                                                            <Typography sx={{ fontSize: "12px", color: "#64748b" }}>
                                                                {row.designation}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <IconButton sx={{ color: "#0d47a1", background: "#f1f5f9" }} onClick={() => handleUOpen(row)}>
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>

                                                <Divider sx={{ opacity: 0.6 }} />

                                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                                    <Typography sx={{ fontSize: "13px", color: "#475569", display: "flex", alignItems: "center", columnGap: "8px" }}>
                                                        <EmailIcon sx={{ fontSize: 18, color: "#64748b" }} /> {row.email}
                                                    </Typography>

                                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 0.5 }}>
                                                        <Chip
                                                            label="APPROVED"
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: "#e8f5e9",
                                                                color: "#2e7d32",
                                                                fontWeight: 700,
                                                                fontSize: "11px",
                                                                border: "1px solid #c8e6c9"
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    sx: {
                        borderRadius: "16px",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    }
                }}
            >
                <DialogTitle sx={{
                    fontWeight: 700,
                    color: "#1e293b",
                    borderBottom: "1px solid #e2e8f0",
                    py: 2.5
                }}>
                    Add New Employee
                </DialogTitle>

                <DialogContent sx={{ py: 3 }}>
                    <Grid container spacing={2}>
                        {/* Name */}
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Full Name"
                                fullWidth
                                required
                                value={name}
                                onChange={handleNameChange}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>

                        {/* Email */}
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Email"
                                type="email"
                                fullWidth
                                required
                                value={email}
                                onChange={handleEmailChange}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Grid>

                        {/* Mobile */}
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Mobile Number"
                                fullWidth
                                required
                                value={mobile}
                                onChange={handleMobileChange}
                                error={!!errors.mobile}
                                helperText={errors.mobile}
                                placeholder="10 digits"
                            />
                        </Grid>

                        {/* DOB */}
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Date of Birth"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                required
                                value={dob}
                                onChange={handleDobChange}
                                error={!!errors.dob}
                                helperText={errors.dob}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                label="Blood Group"
                                fullWidth
                                required
                                value={bloodgrp}
                                onChange={handleBloodGroupChange}
                                error={!!errors.bloodgrp}
                                helperText={errors.bloodgrp}
                            >
                                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(bg => (
                                    <MenuItem key={bg} value={bg}>
                                        {bg}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                label="Designation"
                                fullWidth
                                required
                                value={design}
                                onChange={handleDesignationChange}
                                error={!!errors.design}
                                helperText={errors.design}
                            >
                                <MenuItem value="MERN Stack">MERN Stack</MenuItem>
                                <MenuItem value="Backend Development">Backend Development</MenuItem>
                                <MenuItem value="Digital Marketing">Digital Marketing</MenuItem>
                                <MenuItem value="Graphic Designing">Graphic Designing</MenuItem>
                                <MenuItem value="Android Development">Android Development</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Department"
                                fullWidth
                                required
                                value={dept}
                                onChange={handleDepartmentChange}
                                error={!!errors.dept}
                                helperText={errors.dept}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                select
                                label="Role"
                                fullWidth
                                required
                                value={role}
                                onChange={handleRoleChange}
                                error={!!errors.role}
                                helperText={errors.role}
                            >
                                <MenuItem value="MANAGER">Manager</MenuItem>
                                <MenuItem value="EMPLOYEE">Employee</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Password"
                                type='password'
                                fullWidth
                                required
                                value={pass}
                                onChange={handlePasswordChange}
                                error={!!errors.pass}
                                helperText={errors.pass || "Minimum 6 characters"}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Confirm Password"
                                type='password'
                                fullWidth
                                required
                                value={cpass}
                                onChange={handleConfirmPasswordChange}
                                error={!!errors.cpass}
                                helperText={errors.cpass}
                            />
                        </Grid>

                    </Grid>
                </DialogContent>

                <DialogActions sx={{ padding: "16px 24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
                    <Button onClick={handleClose} sx={{ color: "#e53935", textTransform: "none", fontWeight: 600 }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleAddEmployee}
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            background: "#0d47a1",
                            borderRadius: "8px",
                            boxShadow: "none",
                            "&:hover": { background: "#0a3d8b", boxShadow: "none" }
                        }}
                    >
                        Save Employee
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={uopen}
                onClose={handleUClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: "20px",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
                        overflow: "hidden"
                    }
                }}
            >
                {/* Gradient Header */}
                <Box sx={{
                    background: "linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)",
                    px: 3, pt: 3, pb: 4, position: "relative"
                }}>
                    <IconButton
                        size="small"
                        onClick={handleUClose}
                        sx={{
                            position: "absolute", top: 12, right: 12,
                            color: "rgba(255,255,255,0.7)",
                            "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.15)" }
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>

                    {selectedUser && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                            <Avatar sx={{
                                width: 76, height: 76,
                                bgcolor: "rgba(255,255,255,0.2)",
                                border: "3px solid rgba(255,255,255,0.5)",
                                fontSize: "30px", fontWeight: 800, color: "white"
                            }}>
                                {(selectedUser.username || "U").charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontWeight: 800, fontSize: "22px", color: "white", lineHeight: 1.3 }}>
                                    {selectedUser.username || "Unknown"}
                                </Typography>
                                <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: "14px", mt: 0.3 }}>
                                    {selectedUser.designation || "Employee"}
                                </Typography>
                                <Chip
                                    label={selectedUser.is_approved ? "✓ Approved" : "⏳ Pending Approval"}
                                    size="small"
                                    sx={{
                                        mt: 1,
                                        bgcolor: selectedUser.is_approved ? "rgba(76,175,80,0.25)" : "rgba(255,152,0,0.25)",
                                        color: selectedUser.is_approved ? "#a5d6a7" : "#ffcc80",
                                        border: selectedUser.is_approved ? "1px solid rgba(76,175,80,0.5)" : "1px solid rgba(255,152,0,0.5)",
                                        fontWeight: 700, fontSize: "11px"
                                    }}
                                />
                            </Box>
                        </Box>
                    )}
                </Box>

                {/* Info Cards */}
                <DialogContent sx={{ p: 2.5, bgcolor: "#f8fafc" }}>
                    {selectedUser && (
                        <Grid container spacing={1.5}>
                            {[
                                { icon: <EmailIcon sx={{ fontSize: 17, color: "#3b82f6" }} />, label: "Email", value: selectedUser.email, fullWidth: true },
                                { icon: <PhoneIcon sx={{ fontSize: 17, color: "#10b981" }} />, label: "Mobile Number", value: selectedUser.mobile_number },
                                { icon: <BloodtypeIcon sx={{ fontSize: 17, color: "#ef4444" }} />, label: "Blood Group", value: selectedUser.blood_group },
                                { icon: <BadgeIcon sx={{ fontSize: 17, color: "#8b5cf6" }} />, label: "Role", value: selectedUser.role },
                                { icon: <BusinessIcon sx={{ fontSize: 17, color: "#f59e0b" }} />, label: "Department", value: selectedUser.department },
                                { icon: <WorkIcon sx={{ fontSize: 17, color: "#0d47a1" }} />, label: "Designation", value: selectedUser.designation },
                            ].map((item, i) => (
                                <Grid item xs={12} sm={item.fullWidth ? 12 : 6} key={i}>
                                    <Box sx={{
                                        bgcolor: "white",
                                        borderRadius: "12px",
                                        p: 1.8,
                                        border: "1px solid #e2e8f0",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5
                                    }}>
                                        <Box sx={{ bgcolor: "#f1f5f9", borderRadius: "8px", p: 0.8, display: "flex", flexShrink: 0 }}>
                                            {item.icon}
                                        </Box>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", mb: 0.2 }}>
                                                {item.label}
                                            </Typography>
                                            <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: "14px", wordBreak: "break-word" }}>
                                                {item.value || "—"}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2, background: "white", borderTop: "1px solid #e2e8f0", gap: 1 }}>
                    <Button onClick={handleUClose} sx={{ color: "#64748b", textTransform: "none", fontWeight: 600, borderRadius: "8px" }}>
                        Close
                    </Button>
                    {!selectedUser?.is_approved && (
                        <Button
                            variant="contained"
                            onClick={() => handleApproveUser(selectedUser.id)}
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                background: "linear-gradient(135deg, #2e7d32, #388e3c)",
                                borderRadius: "10px",
                                boxShadow: "0 4px 6px -1px rgba(46,125,50,0.3)",
                                px: 3,
                                "&:hover": { background: "linear-gradient(135deg, #1b5e20, #2e7d32)" }
                            }}
                        >
                            ✓ Approve Employee
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            <Snackbar
                open={sopen}
                autoHideDuration={2000}
                onClose={handleSnackClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleSnackClose}
                    severity={severity}
                    sx={{ width: "100%" }}
                >
                    {message}
                </MuiAlert>
            </Snackbar>
        </div>
    )
}

export default AddEmployee

const Detail = ({ label, value }) => (
    <Grid item xs={6}>
        <Typography sx={{ fontSize: "12px", color: "#64748b", fontWeight: 600, textTransform: "uppercase", mb: 0.5 }}>
            {label}
        </Typography>
        <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: "14px" }}>
            {value || "--"}
        </Typography>
    </Grid>
);