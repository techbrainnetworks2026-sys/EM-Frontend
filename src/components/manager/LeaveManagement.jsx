import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Avatar } from '@mui/material'
import React, { useEffect, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ThumbUpTwoToneIcon from '@mui/icons-material/ThumbUpTwoTone';
import ThumbDownAltTwoToneIcon from '@mui/icons-material/ThumbDownAltTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import { useAppContext } from '../context/AppContext.jsx';
import api from '../../services/service.js';
import { formatTime } from '../../utils/timeFormatter.js';

const LeaveManagement = () => {

    const [open, setOpen] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const { isMobile } = useAppContext();
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [approvedRequests, setApprovedRequests] = useState([]);
    const [sopen, setSOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [searchTerm, setSearchTerm] = useState("");

    const handleOpen = (row) => {
        setSelectedLeave(row);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedLeave(null);
    };

    const fetchPendingLeaves = async () => {
        try {
            const res = await api.get("leave/manager/pending-leaves/");
            setLeaveRequests(res.data);
        } catch (err) {
            // Error handled
        }
    };

    const fetchApprovedLeaves = async () => {
        try {
            const res = await api.get("leave/manager/approved-leaves/");
            setApprovedRequests(res.data);
        } catch (err) {
            // Error handled
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
            setMessage(err.response?.data?.message);
            setSOpen(true);
            setSeverity("error");
        }
    };


    const getLeaveDuration = (leave) => {
        if (leave.duration_type === 'HOURLY') return `${leave.total_hours} hr(s)`;
        if (leave.duration_type === 'HALF_DAY') return '0.5 day';

        const startDate = new Date(leave.start_date);
        const endDate = new Date(leave.end_date);
        const diffTime = endDate - startDate;
        return (diffTime / (1000 * 60 * 60 * 24) + 1) + ' day(s)';
    };

    const renderDuration = (leave) => {
        if (leave.duration_type === 'HOURLY') {
            return (
                <Box>
                    <Typography variant="body2">{leave.start_date}</Typography>
                    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                        🕒 {formatTime(leave.from_time)} - {formatTime(leave.to_time)}
                    </Typography>
                </Box>
            );
        }
        if (leave.duration_type === 'HALF_DAY') {
            return (
                <Box>
                    <Typography variant="body2">{leave.start_date}</Typography>
                    <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 600 }}>
                        ½ Day
                    </Typography>
                </Box>
            );
        }
        return (
            <Box>
                <Typography variant="body2">
                    {leave.start_date} to {leave.end_date}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {getLeaveDuration(leave)}
                </Typography>
            </Box>
        );
    };

    const leaveWithDuration = leaveRequests.map((leave) => ({
        ...leave,
        days: getLeaveDuration(leave),
    }))

    const approvedWithDuration = approvedRequests.map((leave) => ({
        ...leave,
        days: getLeaveDuration(leave),
    }))

    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", }).format(new Date(dateString));
    }


    return (
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
                <Typography variant='h5' sx={{ fontWeight: 700, color: "#1e293b" }}>
                    Leave Management
                </Typography>
                <TextField
                    size="small"
                    placeholder="Search employee..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        width: { xs: "100%", sm: "280px" },
                        background: "white",
                        "& .MuiOutlinedInput-root": { borderRadius: "10px" }
                    }}
                />
            </Box>

            <Box sx={{ mb: 4 }}>
                <Typography variant='h6' sx={{ fontWeight: 700, color: "#334155", mb: 2, fontSize: "16px", display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#f59e0b" }} />
                    Pending Approvals
                </Typography>
                <Box sx={{ marginTop: "10px" }}>
                    <TableContainer
                        component={Paper}
                        sx={{
                            background: "#ffffff",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                            border: "1px solid #e2e8f0"
                        }}
                    >
                        <Table>
                            <TableHead sx={{ display: { xs: "none", sm: "table-header-group" } }}>
                                <TableRow>
                                    <TableCell align="center" sx={{ color: "#1e293b", fontWeight: 600 }}>
                                        Employee
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "#1e293b", fontWeight: 600 }}>
                                        Days
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "#1e293b", fontWeight: 600 }}>
                                        Status
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "#1e293b", fontWeight: 600 }}>
                                        View
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "#1e293b", fontWeight: 600 }}>
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {!isMobile ?
                                    leaveWithDuration.filter((leave) =>
                                        leave.status === "PENDING" &&
                                        leave.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
                                    ).map((row, index) => (
                                        <TableRow key={index} hover sx={{ borderBottom: "1px solid #f1f5f9" }}>
                                            <TableCell align="center" sx={{ color: "#334155" }}>
                                                {row.employee_name}
                                            </TableCell>
                                            <TableCell align="center" sx={{ color: "#334155" }}>
                                                {renderDuration(row)}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip label={row.status}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: "#ffc107",
                                                        color: "#000",
                                                        fontWeight: 600,
                                                        textTransform: "capitalize",
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton sx={{ color: "#0d47a1" }} onClick={() => handleOpen(row)}>
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell sx={{ display: "flex", justifyContent: "center" }}>
                                                <Box sx={{ display: "flex", columnGap: "20px" }}>
                                                    <IconButton sx={{ color: "#2e7d32" }} onClick={() => processLeave(row.id, "APPROVE")}>
                                                        <ThumbUpTwoToneIcon />
                                                    </IconButton>
                                                    <IconButton sx={{ color: "#d32f2f" }} onClick={() => processLeave(row.id, "REJECT")}>
                                                        <ThumbDownAltTwoToneIcon />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )) :
                                    leaveWithDuration.filter((leave) =>
                                        leave.status === "PENDING" &&
                                        (leave.employee_name || "").toLowerCase().includes((searchTerm || "").toLowerCase())
                                    ).map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell colSpan={5} sx={{ borderBottom: "none", padding: "8px" }}>
                                                <Box sx={{
                                                    background: "#ffffff",
                                                    borderRadius: "12px",
                                                    border: "1px solid #e2e8f0",
                                                    padding: "16px",
                                                    mb: 1,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 1.5,
                                                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                                                }}>
                                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "15px" }}>
                                                            {row.employee_name}
                                                        </Typography>
                                                        <Chip
                                                            label={row.status}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: "#fef3c7",
                                                                color: "#92400e",
                                                                fontWeight: 700,
                                                                fontSize: "11px",
                                                                border: "1px solid #fde68a"
                                                            }}
                                                        />
                                                    </Box>

                                                    <Typography sx={{ fontSize: "13px", color: "#475569", display: "flex", alignItems: "center", columnGap: "8px" }}>
                                                        🗓️ {row.duration_type === 'HOURLY' ? `${row.start_date} (${formatTime(row.from_time)} - ${formatTime(row.to_time)})` : (row.duration_type === 'HALF_DAY' ? `${row.start_date} (Half Day)` : `${row.start_date} to ${row.end_date}`)}
                                                    </Typography>

                                                    <Divider sx={{ opacity: 0.5, my: 0.5 }} />

                                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <IconButton sx={{ color: "#0d47a1", background: "#f1f5f9" }} onClick={() => handleOpen(row)}>
                                                            <VisibilityIcon fontSize="small" />
                                                        </IconButton>

                                                        <Box sx={{ display: "flex", gap: 1.5 }}>
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                color="success"
                                                                onClick={() => processLeave(row.id, "APPROVE")}
                                                                sx={{ textTransform: "none", fontWeight: 700, borderRadius: "8px" }}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                color="error"
                                                                onClick={() => processLeave(row.id, "REJECT")}
                                                                sx={{ textTransform: "none", fontWeight: 700, borderRadius: "8px" }}
                                                            >
                                                                Reject
                                                            </Button>
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
            </Box>

            <Box>
                <Typography variant='h6' sx={{ fontWeight: 700, color: "#334155", mb: 2, fontSize: "16px", display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#10b981" }} />
                    Approved History
                </Typography>
                <Box sx={{ marginTop: "10px" }}>
                    <TableContainer
                        component={Paper}
                        sx={{
                            background: "#ffffff",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                            border: "1px solid #e2e8f0"
                        }}
                    >
                        <Table>
                            <TableHead sx={{ display: { xs: "none", sm: "table-header-group" } }}>
                                <TableRow>
                                    <TableCell align="center" sx={{ color: "#1e293b", fontWeight: 600 }}>
                                        Employee
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "#1e293b", fontWeight: 600 }}>
                                        Days
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "#1e293b", fontWeight: 600 }}>
                                        Status
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "#1e293b", fontWeight: 600 }}>
                                        View
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {!isMobile ?
                                    approvedWithDuration.filter((leave) =>
                                        leave.status === "APPROVED" &&
                                        (leave.employee_name || "").toLowerCase().includes((searchTerm || "").toLowerCase())
                                    ).map((row, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell align="center" sx={{ color: "black" }}>
                                                {row.employee_name}
                                            </TableCell>
                                            <TableCell align="center" sx={{ color: "black" }}>
                                                {renderDuration(row)}
                                            </TableCell>
                                            <TableCell align="center" sx={{ color: "black" }}>
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
                                    : leaveWithDuration.filter((leave) =>
                                        leave.status === "APPROVED" &&
                                        leave.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
                                    ).map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell colSpan={4} sx={{ borderBottom: "none", padding: "8px" }}>
                                                <Box sx={{
                                                    background: "#ffffff",
                                                    borderRadius: "12px",
                                                    border: "1px solid #e2e8f0",
                                                    padding: "16px",
                                                    mb: 1,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 1.5,
                                                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                                                }}>
                                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "15px" }}>
                                                            {row.employee_name}
                                                        </Typography>
                                                        <Chip
                                                            label={row.status}
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

                                                    <Typography sx={{ fontSize: "13px", color: "#475569", display: "flex", alignItems: "center", columnGap: "8px" }}>
                                                        🗓️ {row.duration_type === 'HOURLY' ? `${row.start_date} (${formatTime(row.from_time)} - ${formatTime(row.to_time)})` : (row.duration_type === 'HALF_DAY' ? `${row.start_date} (Half Day)` : `${row.start_date} to ${row.end_date}`)}
                                                    </Typography>

                                                    <Divider sx={{ opacity: 0.5, my: 0.5 }} />

                                                    <Box sx={{ textAlign: "right" }}>
                                                        <IconButton sx={{ color: "#0d47a1", background: "#f1f5f9" }} onClick={() => handleOpen(row)}>
                                                            <VisibilityIcon fontSize="small" />
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
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
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
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 2.5
                }}>
                    Leave Details
                    <IconButton size="small" onClick={handleClose} sx={{ color: "#64748b" }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ py: 3 }}>
                    {selectedLeave && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: 1 }}>
                                <Avatar sx={{ width: 56, height: 56, bgcolor: "#0d47a1", fontSize: "20px", fontWeight: 700 }}>
                                    {selectedLeave.employee_name.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography sx={{ fontWeight: 700, fontSize: "18px", color: "#1e293b" }}>
                                        {selectedLeave.employee_name}
                                    </Typography>
                                    <Typography sx={{ fontSize: "14px", color: "#64748b", fontWeight: 500 }}>
                                        Leave Request Details
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ opacity: 0.6 }} />

                            <Grid container spacing={3}>
                                <DetailItem label="From" value={selectedLeave.start_date} />
                                <DetailItem label="To" value={selectedLeave.end_date} />
                                <DetailItem label="Duration Type" value={selectedLeave.duration_type?.replace('_', ' ')} />
                                <DetailItem label="Total Duration" value={selectedLeave.days} />

                                {selectedLeave.duration_type === 'HOURLY' && (
                                    <>
                                        <DetailItem label="From Time" value={formatTime(selectedLeave.from_time)} />
                                        <DetailItem label="To Time" value={formatTime(selectedLeave.to_time)} />
                                    </>
                                )}

                                <Grid item size={6}>
                                    <Typography sx={{ fontSize: "12px", color: "#64748b", fontWeight: 600, textTransform: "uppercase", mb: 0.5 }}>
                                        Status
                                    </Typography>
                                    <Chip
                                        label={selectedLeave.status}
                                        size="small"
                                        sx={{
                                            mt: "4px",
                                            backgroundColor:
                                                selectedLeave.status === "APPROVED" ? "#e8f5e9" : (selectedLeave.status === "REJECTED" ? "#ffebee" : "#fef3c7"),
                                            color: selectedLeave.status === "APPROVED" ? "#2e7d32" : (selectedLeave.status === "REJECTED" ? "#d32f2f" : "#92400e"),
                                            fontWeight: 700,
                                            fontSize: "11px",
                                            border: `1px solid ${selectedLeave.status === "APPROVED" ? "#c8e6c9" : (selectedLeave.status === "REJECTED" ? "#ffcdd2" : "#fde68a")}`
                                        }}
                                    />
                                </Grid>

                                <DetailItem label="Applied On" value={formatDate(selectedLeave.applied_on)} />

                                {selectedLeave.status === "APPROVED" && (
                                    <>
                                        <DetailItem label="Approved On" value={selectedLeave.action_date ? formatDate(selectedLeave.action_date) : "N/A"} />
                                        <DetailItem label="Approved By" value={selectedLeave.action_by_name || "N/A"} />
                                    </>
                                )}
                            </Grid>

                            <Box sx={{
                                background: "#f8fafc",
                                padding: "16px",
                                borderRadius: "12px",
                                border: "1px solid #e2e8f0",
                                boxShadow: "inset 0 2px 4px 0 rgba(0,0,0,0.06)"
                            }}>
                                <Typography sx={{ fontSize: "12px", color: "#64748b", fontWeight: 600, textTransform: "uppercase", mb: 1 }}>
                                    Reason
                                </Typography>
                                <Typography sx={{ fontWeight: 400, color: "#334155", lineHeight: 1.6 }}>
                                    {selectedLeave.reason}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ padding: "16px 24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
                    <Button onClick={handleClose} sx={{ color: "#64748b", textTransform: "none", fontWeight: 600 }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default LeaveManagement

const DetailItem = ({ label, value }) => (
    <Grid item size={6}>
        <Typography sx={{ fontSize: "12px", color: "#64748b", fontWeight: 600, textTransform: "uppercase", mb: 0.5 }}>
            {label}
        </Typography>
        <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: "14px" }}>
            {value || "--"}
        </Typography>
    </Grid>
);
