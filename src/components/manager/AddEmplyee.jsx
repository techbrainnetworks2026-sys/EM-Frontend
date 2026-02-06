import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, MenuItem, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Details } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import { useAppContext } from '../context/AppContext.jsx';
import api from '../../services/service.js';
import MuiAlert from "@mui/material/Alert";

const AddEmplyee = () => {

    const [open, setOpen] = useState(false);
    const [uopen, setUOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const { isMobile, Register } = useAppContext();
    const [rows, setRows] = useState([]);
    const [arows, setARows] = useState([]);
    const [sopen, setSOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [name, setName ] = useState("");
    const [email, setEmail ] = useState("");
    const [mobile, setMobile ] = useState("");
    const [bloodgrp, setBloodgrp ] = useState("");
    const [dept, setDept ] = useState("");
    const [design, setDesign ] = useState("");
    const [pass, setPass ] = useState("");
    const [cpass, setCPass ] = useState("");
    const [role, setRole ] = useState("");

    const handleSnackClose = () => setSOpen(false);

    const handleUOpen = (row) => {
        setUOpen(true);
        setSelectedUser(row);
    };

    const handleClose = () => setOpen(false);

    const handleUClose = () =>{
        setUOpen(false);
        setSelectedUser(null);
    };

    const fetchPendingUsers = async () => {
        try{
            const res = await api.get("accounts/manager/pending-users/");
            setRows(res.data);
        }catch(err){
            console.log(err);
        }
    };

    const ApprovedUsersList = async () => {
        try{
            const res = await api.get("accounts/manager/approved-users/");
            setARows(res.data);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        fetchPendingUsers();
        ApprovedUsersList();
    }, []);

    const handleApproveUser = async (userId) => {
        try{
            const res = await api.post(`accounts/manager/approve-user/${userId}/`);
            setRows(prev => prev.map(user => user.id === userId ? { ...user, is_approved: true } : user ) );
            setMessage(res.data.message);
            setSeverity("success");
            setSOpen(true);
            handleUClose();
            await fetchPendingUsers();
            await ApprovedUsersList();
        }catch(err){
            setMessage(
                err.response?.data?.error || "Approval failed"
            );
            setSeverity("error");
            setSOpen(true);
        }

    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        try{
            if(!name || !email || !mobile || !bloodgrp || !dept || !design || !pass || !cpass || !role){
                setOpen(true);
                setMessage("Please fill all the fields");
                setSeverity("error");
                return;
            }else if(pass !== cpass){
                setOpen(true);
                setMessage("Password and Confirm Password do not match");
                setSeverity("error");
                return;
            }else{
                const res = await Register(name, email,pass, role, dept, design,bloodgrp, mobile,);
                setOpen(true);
                setMessage("User Data uploaded Successfully!")
                setSeverity('success');
                await fetchPendingUsers();
            }
        }catch(err){
            if(err.response?.data?.error){
                const errorMsg =  err.response?.data?.error;
                setMessage(errorMsg );
                setSeverity("error");
                setOpen(true);
            }else{
                setMessage("Something went wrong, Please try again later.");
                setSeverity("error");
                setOpen(true);
            }
        }
    }




    return (
        <div>
            <Typography variant='h5' component='p' sx={{
                fontFamily : "work sans",
                fontWeight : "600",
                color : "#080808"
            }}> Techbrain Employees List </Typography>
            <Box sx={{ display : "flex", justifyContent : "flex-end", margin : "auto", width : "100%"}}>
                <Button onClick={() => setOpen(true)} sx={{ textTransform : "none", background : "#00838f", color : "whitesmoke"}}> + Add Employee </Button>
            </Box>
            <Box sx={{ marginTop : "20px"}}>
                <Box>
                    <Typography variant='h6' sx={{ fontFamily : "work sans", fontWeight : 600}}> Pending Employees List</Typography>
                </Box>
                <TableContainer
                    component={Paper}
                    sx={{
                        mt : 1,
                        background: "#1e1e1e",
                        borderRadius: "12px",
                    }}
                    >
                    <Table>
                        <TableHead sx={{ display: { xs: "none", sm: "table-header-group" } }}>
                            <TableRow>
                                <TableCell align="center" sx={{ color: "whitesmoke", fontWeight: 600 }}>
                                    Employee
                                </TableCell>
                                <TableCell align="center" sx={{ color: "whitesmoke", fontWeight: 600 }}>
                                    Email
                                </TableCell>
                                <TableCell align="center" sx={{ color: "whitesmoke", fontWeight: 600 }}>
                                    Designation
                                </TableCell>
                                <TableCell align="center" sx={{ color: "whitesmoke", fontWeight: 600 }}>
                                    Status
                                </TableCell>
                                <TableCell align="center" sx={{ color: "whitesmoke", fontWeight: 600 }}>
                                    View
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {!isMobile ? 
                                rows.filter((pending) => pending.is_approved === false).map((row, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell sx={{ color : "whitesmoke" }}>
                                            <div style={{ display : "flex", alignItems : "center", justifyContent : "center", columnGap : "10px"}}>
                                                <Avatar sx={{ width: 32, height: 32, background : "#0d47a1" }}>
                                                    {row.username.charAt(0).toUpperCase()}
                                                </Avatar>
                                                {row.username}
                                            </div>
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: "whitesmoke" }}>
                                            {row.email}
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: "whitesmoke" }}>
                                            {row.designation}
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: "whitesmoke" }}>
                                            <Chip label={"PENDING"} size="small"
                                                sx={{
                                                    width: "fit-content",
                                                    backgroundColor: "#ffd600",
                                                    color: "#000",
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </TableCell>
                                        
                                        <TableCell align="center">
                                            <IconButton sx={{ color: "#90caf9" }} onClick={() => handleUOpen(row)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            : rows.filter((pending) => pending.is_approved === false).map((row, index) => (
                                <TableRow key={index} sx={{ background : "#333"}}>
                                    <TableCell colSpan={4} sx={{ borderBottom: "none" }}>
                                        <Box sx={{ background: "#1e1e1e", borderRadius: "12px", padding: "12px", mb: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Avatar sx={{ width: 36, height: 36, bgcolor: "#0d47a1" }}>
                                                    {row.username.charAt(0).toUpperCase()}
                                                </Avatar>

                                                <Typography sx={{ fontWeight: 600, color: "whitesmoke" }}>
                                                    {row.username}
                                                </Typography>
                                            </Box>

                                            <Typography sx={{ fontSize: "14px", opacity: 0.7, color: "whitesmoke",  display : "flex", alignItems : "center", columnGap : "7px" }}>
                                                <EmailIcon /> {row.email}
                                            </Typography>

                                            <Typography sx={{ fontSize: "14px", opacity: 0.7, color: "whitesmoke", display : "flex", alignItems : "center", columnGap : "7px" }}>
                                                <PersonIcon /> {row.designation}
                                            </Typography>

                                            <Chip label={"PENDING"} size="small"
                                                sx={{
                                                    mt : 1,
                                                    width: "fit-content",
                                                    backgroundColor: "#ffd600",
                                                    color: "#000",
                                                    fontWeight: 600,
                                                }}
                                            />

                                            <Box sx={{ textAlign: "right" }}>
                                                <IconButton sx={{ color: "#90caf9" }} onClick={() => handleUOpen(row)}>
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box sx={{ marginTop : "20px"}}>
                <Box>
                    <Typography variant='h6' sx={{ fontFamily : "work sans", fontWeight : 600}}> Approved Employees List</Typography>
                </Box>
                <TableContainer
                    component={Paper}
                    sx={{
                        mt : 1,
                        background: "#1e1e1e",
                        borderRadius: "12px",
                    }}
                    >
                    <Table>
                        <TableHead sx={{ display: { xs: "none", sm: "table-header-group" } }}>
                            <TableRow>
                                <TableCell align="center" sx={{ color: "whitesmoke", fontWeight: 600 }}>
                                    Employee
                                </TableCell>
                                <TableCell align="center" sx={{ color: "whitesmoke", fontWeight: 600 }}>
                                    Email
                                </TableCell>
                                <TableCell align="center" sx={{ color: "whitesmoke", fontWeight: 600 }}>
                                    Designation
                                </TableCell>
                                <TableCell align="center" sx={{ color: "whitesmoke", fontWeight: 600 }}>
                                    Status
                                </TableCell>
                                <TableCell align="center" sx={{ color: "whitesmoke", fontWeight: 600 }}>
                                    View
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {!isMobile ? 
                                arows.filter((pending) => pending.is_approved === true).map((row, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell sx={{ color : "whitesmoke" }}>
                                            <div style={{ display : "flex", alignItems : "center", justifyContent : "center", columnGap : "10px"}}>
                                                <Avatar sx={{ width: 32, height: 32, background : "#0d47a1" }}>
                                                    {row.username.charAt(0).toUpperCase()}
                                                </Avatar>
                                                {row.username}
                                            </div>
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: "whitesmoke" }}>
                                            {row.email}
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: "whitesmoke" }}>
                                            {row.designation}
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: "whitesmoke" }}>
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
                                        <TableCell align="center">
                                            <IconButton sx={{ color: "#90caf9" }} onClick={() => handleUOpen(row)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            : rows.filter((pending) => pending.is_approved === true).map((row, index) => (
                                <TableRow key={index} sx={{ background : "#333"}}>
                                    <TableCell colSpan={4} sx={{ borderBottom: "none" }}>
                                        <Box sx={{ background: "#1e1e1e", borderRadius: "12px", padding: "12px", mb: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Avatar sx={{ width: 36, height: 36, bgcolor: "#0d47a1" }}>
                                                    {row.username.charAt(0).toUpperCase()}
                                                </Avatar>

                                                <Typography sx={{ fontWeight: 600, color: "whitesmoke" }}>
                                                    {row.username}
                                                </Typography>
                                            </Box>

                                            <Typography sx={{ fontSize: "14px", opacity: 0.7, color: "whitesmoke",  display : "flex", alignItems : "center", columnGap : "7px" }}>
                                                <EmailIcon /> {row.email}
                                            </Typography>

                                            <Typography sx={{ fontSize: "14px", opacity: 0.7, color: "whitesmoke", display : "flex", alignItems : "center", columnGap : "7px" }}>
                                                <PersonIcon /> {row.designation}
                                            </Typography>

                                            <Chip label={"APPROVED"}
                                                size="small"
                                                sx={{
                                                    mt : 1,
                                                    backgroundColor: "#2e7d32",
                                                    color: "white",
                                                    fontWeight: 600,
                                                    textTransform: "capitalize",
                                                }}
                                            />

                                            <Box sx={{ textAlign: "right" }}>
                                                <IconButton sx={{ color: "#90caf9" }} onClick={() => handleUOpen(row)}>
                                                    <VisibilityIcon />
                                                </IconButton>
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
                >
                <DialogTitle sx={{ fontWeight: 600 }}>
                    Add New Employee
                </DialogTitle>

                <DialogContent dividers>
                    <Grid container spacing={2}>
                        {/* Name */}
                        <Grid item size={{xs: 12, sm: 6, md: 4}}>
                            <TextField label="Full Name" fullWidth required value={name} onChange={(e) => setName(e.target.value)} />
                        </Grid>

                        {/* Email */}
                        <Grid item size={{xs: 12, sm: 6, md: 4}}>
                            <TextField label="Email" type="email" fullWidth required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Grid>

                        {/* Mobile */}
                        <Grid item size={{xs: 12, sm: 6, md: 4}}>
                            <TextField label="Mobile Number" fullWidth required value={mobile} onChange={(e) => setMobile(e.target.value)} />
                        </Grid>

                        {/* DOB */}
                        <Grid item size={{xs: 12, sm: 6, md: 4}}>
                            <TextField
                                label="Date of Birth"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                required
                                sx={{
                                    "& input::-webkit-calendar-picker-indicator": {
                                        filter: "invert(0)"   // makes icon BLACK
                                    }
                                }}
                            />
                        </Grid>

                        {/* Blood Group */}
                        <Grid item size={{xs: 12, sm: 6, md: 4}}>
                            <TextField select label="Blood Group" fullWidth required value={bloodgrp} onChange={(e) => setBloodgrp(e.target.value)}>
                            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(bg => (
                                <MenuItem key={bg} value={bg}>
                                    {bg}
                                </MenuItem>
                            ))}
                            </TextField>
                        </Grid>

                        {/* Role */}
                        <Grid item size={{xs: 12, sm: 6, md: 4}}>
                            <TextField select label="Designation" fullWidth required value={design} onChange={(e) => setDesign(e.target.value)}>
                                <MenuItem value="MERN-Stack">MERN Stack</MenuItem>
                                <MenuItem value="Backend-Developer">Backend</MenuItem>
                                <MenuItem value="Digital-Marketing">Digital Marketing</MenuItem>
                                <MenuItem value="Graphic-Designer">Graphic Designer</MenuItem>
                                <MenuItem value="Video-Creator">Video Creator</MenuItem>
                                <MenuItem value="Android-Developer">Android Developer</MenuItem>
                            </TextField>
                        </Grid>
                       
                        <Grid item size={{xs: 12, sm: 6, md: 4}}>
                            <TextField label="Department" fullWidth required value={dept} onChange={(e) => setDept(e.target.value)} />
                        </Grid>

                        {/* Type */}
                        <Grid item size={{xs: 12, sm: 6, md: 4}}>
                            <TextField select label="Role" fullWidth required value={role} onChange={(e) => setRole(e.target.value)}>
                                <MenuItem value="MANAGER">Manager</MenuItem>
                                <MenuItem value="EMPLOYEE">Employee</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item size={{xs: 12, sm: 6, md: 4}}>
                            <TextField label="Password" type='password' fullWidth required value={pass} onChange={(e) => setPass(e.target.value)} />
                        </Grid>

                        <Grid item size={{xs: 12, sm: 6, md: 4}}>
                            <TextField label="Confirm Password" type='password' fullWidth required value={cpass} onChange={(e) => setCPass(e.target.value)} />
                        </Grid>
                        
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ padding: "16px" }}>
                    <Button onClick={handleClose} color="error">
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleAddEmployee} sx={{ textTransform: "none", fontWeight: 600 }}>
                        Save Employee
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={uopen}
                onClose={handleUClose}
                fullWidth
                maxWidth="md"
                >
                <DialogTitle sx={{ fontWeight: 600 }}>
                    Employee Details 
                </DialogTitle>

                <DialogContent dividers>
                    {selectedUser && (
                    <>
                    <Box sx={{ display: "flex", alignItems: "center",gap: 2,mb: 3,}}>
                        <Avatar sx={{ width: 56, height: 56, bgcolor: "#0d47a1" }}>
                            {selectedUser.username.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontWeight: 600, fontSize: "18px", color: "#333" }}>
                                {selectedUser.username}
                            </Typography>
                            <Typography sx={{ opacity: 0.7, color : "#333" }}>
                                {selectedUser.role}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                        <Detail label="Email" value={selectedUser.email} />
                        <Detail label="Mobile" value={selectedUser.mobile_number} />
                        {/* <Detail label="Date of Birth" value={selectedUser.dob} /> */}
                        <Detail label="Blood Group" value={selectedUser.blood_group} />
                        <Detail label="Role" value={selectedUser.role} />
                        <Detail label="Status" value={selectedUser.is_approved ? "Approved" : "Pending"} />
                        <Detail label="Department" value={selectedUser.department} />
                        <Detail label="Designation" value={selectedUser.designation} />

                        
                        {/* <Grid item xs={12}>
                            <Typography sx={{ fontSize: "13px", opacity: 0.6 }}>
                                Address
                            </Typography>
                            <Typography sx={{ fontWeight: 500 }}>
                                {selectedUser.address}
                            </Typography>
                        </Grid> */}
                    </Grid>
                    </>
                    )}
                </DialogContent>

                <DialogActions sx={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {selectedUser?.is_approved == false ? (
                        <>
                            <Button onClick={handleUClose} color="error">
                                Cancel
                            </Button>
                            <Box sx={{ display : "flex", columnGap : "12px"}}>
                                <Button variant="contained" onClick={() => handleApproveUser(selectedUser.id)} sx={{ textTransform: "none", fontWeight: 600 }}>
                                    Add Employee
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <Button onClick={handleUClose} color="error">
                            Cancel
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

export default AddEmplyee

const Detail = ({ label, value }) => (
    <Grid item size={6}>
        <Typography sx={{ fontSize: "13px", opacity: 0.6, color : "#333" }}>
            {label}
        </Typography>
        <Typography sx={{ fontWeight: 500, color : "#333" }}>
            {value}
        </Typography>
    </Grid>
);