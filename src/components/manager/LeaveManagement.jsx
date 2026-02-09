import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ThumbUpTwoToneIcon from '@mui/icons-material/ThumbUpTwoTone';
import ThumbDownAltTwoToneIcon from '@mui/icons-material/ThumbDownAltTwoTone';
import { useAppContext } from '../context/AppContext.jsx';
import axios from 'axios';
import api from '../../services/service.js';

const LeaveManagement = () => {

    const [open, setOpen] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const { isMobile } = useAppContext();
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [approvedRequests, setApprovedRequests] = useState([]);
    const [sopen, setSOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    const handleOpen = (row) => {
        setSelectedLeave(row);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedLeave(null);
    };

    const fetchPendingLeaves = async () => {
        try{
            const res = await api.get("leave/manager/pending-leaves/");
            setLeaveRequests(res.data);
        }catch(err){
            console.log(err);
        }
    };

    const fetchApprovedLeaves = async () => {
        try{
            const res = await api.get("leave/manager/approved-leaves/");
            setApprovedRequests(res.data);
        }catch(err){
            console.log(err);
        }
    };

    useEffect(() => {
        fetchPendingLeaves();
        fetchApprovedLeaves();
    }, []);

    const processLeave = async (leaveId, action) => {
        try {
            const res = await api.post(`leave/manager/process-leave/${leaveId}/`, { action });
            setMessage(res.data.message);
            setSOpen(true);
            setSeverity("success");
            await fetchPendingLeaves();
        } catch (err) {
            console.log(err.response?.data);
            setMessage(err.response?.data?.message);
            setSOpen(true);
            setSeverity("error");
        }
    };


    const getLeaveDuration = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);

        const diffTime = endDate - startDate;

        return diffTime / (1000 * 60 * 60 * 24) + 1;
    };


    const leaveWithDuration = leaveRequests.map((leave) => ({
        ...leave,
        days : getLeaveDuration(leave.start_date, leave.end_date),
    }))

    const approvedWithDuration = approvedRequests.map((leave) => ({
        ...leave,
        days : getLeaveDuration(leave.start_date, leave.end_date),
    }))

    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", }).format(new Date(dateString));
    }


    return (
        <div>
            <Typography variant='h5' component='p' sx={{
                fontFamily : "work sans",
                fontWeight : "600",
                color : "#080808"
            }}> Employees Leave Management </Typography>
            <div style={{ marginTop : "15px"}}>
                <Typography variant='h6' sx={{ fontFamily : "work sans"}}>Pending Approvals</Typography>
                <Box sx={{marginTop : "10px"}}>
                    <TableContainer
                        component={Paper}
                        sx={{
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
                                        Days
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "whitesmoke", fontWeight: 600 }}>
                                        Status
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "whitesmoke", fontWeight: 600 }}>
                                        View
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "whitesmoke", fontWeight: 600 }}>
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {!isMobile ?
                                leaveWithDuration.filter((leave) => leave.status === "PENDING").map((row, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell align="center" sx={{ color: "whitesmoke" }}>
                                            {row.employee_name}
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: "whitesmoke" }}>
                                            {row.days}
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: "whitesmoke" }}>
                                            <Chip label={row.status}
                                                size="small"
                                                sx={{
                                                    backgroundColor: "#ffd600",
                                                    color: "#000",
                                                    fontWeight: 600,
                                                    textTransform: "capitalize",
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton sx={{ color: "#90caf9" }} onClick={() => handleOpen(row)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell sx={{display : "flex", justifyContent : "center"}}>
                                            <Box sx={{ display : "flex", columnGap : "20px"}}>
                                                <IconButton sx={{ color: "#43a047" }} onClick={() => processLeave(row.id, "APPROVE")}>
                                                    <ThumbUpTwoToneIcon />
                                                </IconButton>
                                                <IconButton sx={{ color: "#e53935" }} onClick={() => processLeave(row.id, "REJECT")}>
                                                    <ThumbDownAltTwoToneIcon />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )) : 
                                leaveWithDuration.filter((leave) => leave.status === "PENDING").map((row, index) => (
                                    <TableRow key={index} sx={{ background : "#333"}}>
                                        <TableCell colSpan={5} sx={{ borderBottom: "none" }}>
                                            <Box sx={{ background: "#1e1e1e", borderRadius: "12px", padding: "14px", mb: 1, display: "flex", flexDirection: "column", gap: 1,}}>
                                                <Typography sx={{ fontWeight: 600, color: "whitesmoke" }}>
                                                    {row.employee_name}
                                                </Typography>

                                                <Typography sx={{ fontSize: "14px", opacity: 0.7, color: "whitesmoke"}}>
                                                    🗓️ {row.days} day(s)
                                                </Typography>

                                                <Chip label={row.status} size="small"
                                                    sx={{
                                                        width: "fit-content",
                                                        backgroundColor: "#ffd600",
                                                        color: "#000",
                                                        fontWeight: 600,
                                                    }}
                                                />

                                                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1,}}>
                                                    <IconButton sx={{ color: "#90caf9" }} onClick={() => handleOpen(row)}>
                                                        <VisibilityIcon />
                                                    </IconButton>

                                                    <Box sx={{ display: "flex", gap: 1 }}>
                                                        <IconButton sx={{ color: "#43a047" }} onClick={() => processLeave(row.id, "APPROVE")}>
                                                            <ThumbUpTwoToneIcon />
                                                        </IconButton>
                                                        <IconButton sx={{ color: "#e53935" }} onClick={() => processLeave(row.id, "APPROVE")}>
                                                            <ThumbDownAltTwoToneIcon />
                                                        </IconButton>
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
            </div>
            <div style={{ marginTop : "15px"}}>
                <Typography variant='h6' sx={{ fontFamily : "work sans"}}> Approved List </Typography>
                <Box sx={{marginTop : "10px"}}>
                    <TableContainer
                        component={Paper}
                        sx={{
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
                                        Days
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
                                approvedWithDuration.filter((leave) => leave.status === "APPROVED").map((row, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell align="center" sx={{ color: "whitesmoke" }}>
                                            {row.employee_name}
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: "whitesmoke" }}>
                                            {row.days}
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: "whitesmoke" }}>
                                            <Chip label={row.status}
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
                                            <IconButton sx={{ color: "#90caf9" }} onClick={() => handleOpen(row)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                                : approvedWithDuration.filter((leave) => leave.status === "APPROVED").map((row, index) => (
                                    <TableRow key={index} sx={{ background : "#333"}}>
                                        <TableCell colSpan={4} sx={{ borderBottom: "none" }}>
                                            <Box sx={{ background: "#1e1e1e", borderRadius: "12px", padding: "14px", mb: 1, display: "flex", flexDirection: "column", gap: 1,}}>
                                                <Typography sx={{ fontWeight: 600, color: "whitesmoke" }}>
                                                    {row.employee_name}
                                                </Typography>

                                                <Typography sx={{ fontSize: "14px", opacity: 0.7, color : "whitesmoke" }}>
                                                    🗓️ {row.days} day(s)
                                                </Typography>

                                                <Chip label={row.status} size="small"
                                                    sx={{
                                                        width: "fit-content",
                                                        backgroundColor: "#2e7d32",
                                                        color: "white",
                                                        fontWeight: 600,
                                                    }}
                                                />

                                                <Box sx={{ textAlign: "right" }}>
                                                    <IconButton sx={{ color: "#90caf9" }} onClick={() => handleOpen(row)}>
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
            </div>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 600 }}>
                    Leave Details
                </DialogTitle>

                <DialogContent dividers>
                    {selectedLeave && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, background: "#121212", padding: "12px", borderRadius: "8px", }}>
                            <AccountCircleIcon sx={{ fontSize: 36, color: "#90caf9" }} />
                            <Box>
                                <Typography sx={{ fontWeight: 600, fontSize: "18px", color : "whitesmoke"  }}>
                                    {selectedLeave.employee_name}
                                </Typography>
                                <Typography sx={{ fontSize: "13px", opacity: 0.6, color : "whitesmoke" }}>
                                    Leave Request Details
                                </Typography>
                            </Box>
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item size={6}>
                                <Typography sx={{ fontSize: "13px", opacity: 0.6, color : "#1e1e1e" }}>
                                    From
                                </Typography>
                                <Typography sx={{ fontWeight: 500, color : "#1e1e1e" }}>
                                    {selectedLeave.start_date}
                                </Typography>
                            </Grid>

                            <Grid item size={6}>
                                <Typography sx={{ fontSize: "13px", opacity: 0.6, color : "#1e1e1e" }}>
                                    To
                                </Typography>
                                <Typography sx={{ fontWeight: 500, color : "#1e1e1e" }}>
                                    {selectedLeave.end_date}
                                </Typography>
                            </Grid>

                            <Grid item size={6}>
                                <Typography sx={{ fontSize: "13px", opacity: 0.6, color : "#1e1e1e" }}>
                                    Duration
                                </Typography>
                                <Typography sx={{ fontWeight: 500, color : "#1e1e1e" }}>
                                    {selectedLeave.days} day(s)
                                </Typography>
                            </Grid>

                            <Grid item size={6}>
                                <Typography sx={{ fontSize: "13px", opacity: 0.6, color : "#1e1e1e" }}>
                                    Status
                                </Typography>
                                <Chip
                                    label={selectedLeave.status}
                                    size="small"
                                    sx={{
                                    mt: "4px",
                                    backgroundColor:
                                        selectedLeave.status === "APPROVED" ? "#2e7d32" : "#ffd600",
                                    color: selectedLeave.status === "APPROVED" ? "white" : "black",
                                    fontWeight: 600,
                                    }}
                                />
                            </Grid>

                            <Grid item size={6}>
                                <Typography sx={{ fontSize: "13px", opacity: 0.6, color : "#1e1e1e" }}>
                                    Applied On
                                </Typography>
                                <Typography sx={{ fontWeight: 500, color : "#1e1e1e" }}>
                                    {formatDate(selectedLeave.applied_on)}
                                </Typography>
                            </Grid>
                            
                        </Grid>
                        <Box sx={{ background: "#121212", padding: "12px", borderRadius: "8px", }}>
                            <Typography sx={{ fontSize: "13px", opacity: 0.6, mb: 0.5, color : "whitesmoke" }}>
                                Reason
                            </Typography>
                            <Typography sx={{ fontWeight: 400, color : "whitesmoke" }}>
                                {  selectedLeave.reason}
                            </Typography>
                        </Box>
                    </Box>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default LeaveManagement
