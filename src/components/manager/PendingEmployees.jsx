import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppContext } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import api from '../../services/service.js';

const PendingEmployees = () => {
    const [rows, setRows] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [uopen, setUOpen] = useState(false);
    const { isMobile } = useAppContext();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const fetchPendingUsers = async () => {
        try {
            const res = await api.get("accounts/manager/pending-users/");
            setRows(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const handleUOpen = (row) => {
        setSelectedUser(row);
        setUOpen(true);
    };

    const handleUClose = () => {
        setUOpen(false);
        setSelectedUser(null);
    };

    const handleApprove = async () => {
        try {
            await api.post(`accounts/manager/approve-user/${selectedUser.id}/`);
            setUOpen(false);
            fetchPendingUsers();
        } catch (err) {
            console.log(err);
        }
    };

    const handleReject = async () => {
        try {
            await api.post(`accounts/manager/reject-user/${selectedUser.id}/`);
            setUOpen(false);
            fetchPendingUsers();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                        onClick={() => navigate('/manager/dashboard')}
                        sx={{ color: "#0d47a1", background: "#f1f5f9", mr: 1 }}
                        size="small"
                    >
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>
                    <Typography variant='h5' sx={{
                        fontWeight: 700,
                        color: "#1e293b",
                        fontSize: { xs: "20px", sm: "24px" }
                    }}>
                        Pending Requests
                    </Typography>
                </Box>
                <TextField
                    size="small"
                    placeholder="Search name/email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: { xs: "100%", sm: "260px" }, background: "white", "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />
            </Box>

            {rows.filter((pending) => pending.is_approved === false).length === 0 ? (
                <Paper sx={{ p: 3, textAlign: "center", background: "#ffffff", borderRadius: "12px" }}>
                    <Typography sx={{ color: "#666" }}>No pending employee requests</Typography>
                </Paper>
            ) : (
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
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {!isMobile ?
                                rows.filter((pending) =>
                                    pending.is_approved === false &&
                                    ((pending.username || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
                                        (pending.email || "").toLowerCase().includes((searchTerm || "").toLowerCase()))
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
                                            <Chip
                                                label={row.is_rejected ? "REJECTED" : "PENDING"}
                                                size="small"
                                                sx={{
                                                    width: "fit-content",
                                                    backgroundColor: row.is_rejected ? "#ef4444" : "#ffd600",
                                                    color: row.is_rejected ? "#fff" : "#000",
                                                    fontWeight: 600,
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
                                : rows.filter((pending) =>
                                    pending.is_approved === false &&
                                    ((pending.username || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
                                        (pending.email || "").toLowerCase().includes((searchTerm || "").toLowerCase()))
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
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                    <Avatar sx={{ width: 40, height: 40, bgcolor: "#0d47a1", fontWeight: 700 }}>
                                                        {row.username.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "15px" }}>
                                                            {row.username}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>
                                                            {row.role}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, mt: 0.5 }}>
                                                    <Typography sx={{ fontSize: "13px", color: "#475569", display: "flex", alignItems: "center", columnGap: "8px" }}>
                                                        <EmailIcon sx={{ fontSize: 16, color: "#94a3b8" }} /> {row.email}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: "13px", color: "#475569", display: "flex", alignItems: "center", columnGap: "8px" }}>
                                                        <PersonIcon sx={{ fontSize: 16, color: "#94a3b8" }} /> {row.designation}
                                                    </Typography>
                                                </Box>

                                                <Divider sx={{ opacity: 0.5, my: 0.5 }} />

                                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <Chip
                                                        label={row.is_rejected ? "REJECTED" : "PENDING"}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: row.is_rejected ? "#fee2e2" : "#fef3c7",
                                                            color: row.is_rejected ? "#d32f2f" : "#92400e",
                                                            fontWeight: 700,
                                                            fontSize: "11px",
                                                            border: `1px solid ${row.is_rejected ? "#fecaca" : "#fde68a"}`
                                                        }}
                                                    />
                                                    <IconButton sx={{ color: "#0d47a1", background: "#f1f5f9" }} onClick={() => handleUOpen(row)}>
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
            )}

            {selectedUser && (
                <Dialog
                    open={uopen}
                    onClose={handleUClose}
                    maxWidth="sm"
                    fullWidth
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
                        Request Details
                    </DialogTitle>
                    <DialogContent sx={{ py: 3 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                                <Avatar sx={{ width: 56, height: 56, bgcolor: "#0d47a1", fontSize: "20px", fontWeight: 700 }}>
                                    {selectedUser.username.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography sx={{ fontWeight: 700, fontSize: "18px", color: "#1e293b" }}>
                                        {selectedUser.username}
                                    </Typography>
                                    <Typography sx={{ fontSize: "14px", color: "#64748b", fontWeight: 500 }}>
                                        {selectedUser.designation}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ opacity: 0.6 }} />

                            <Grid container spacing={2.5}>
                                <PendingDetail label="Email Address" value={selectedUser.email} />
                                <PendingDetail label="Designation" value={selectedUser.designation} />
                                <Grid item xs={12}>
                                    <Typography sx={{ fontSize: "12px", color: "#64748b", fontWeight: 600, textTransform: "uppercase", mb: 0.5 }}>
                                        Status
                                    </Typography>
                                    <Chip
                                        label={selectedUser.is_rejected ? "REJECTED" : "PENDING"}
                                        size="small"
                                        sx={{
                                            backgroundColor: selectedUser.is_rejected ? "#fee2e2" : "#fef3c7",
                                            color: selectedUser.is_rejected ? "#d32f2f" : "#92400e",
                                            fontWeight: 700,
                                            fontSize: "11px",
                                            border: `1px solid ${selectedUser.is_rejected ? "#fecaca" : "#fde68a"}`
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ padding: "16px 24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
                        <Button onClick={handleUClose} sx={{ textTransform: "none", fontWeight: 600, color: "#64748b" }}>Cancel</Button>
                        {!selectedUser.is_rejected && (
                            <Button onClick={handleReject} sx={{ textTransform: "none", fontWeight: 600, color: "#d32f2f" }}>Reject</Button>
                        )}
                        <Button
                            onClick={handleApprove}
                            variant="contained"
                            sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                background: "#2e7d32",
                                borderRadius: "8px",
                                boxShadow: "none",
                                "&:hover": { background: "#1b5e20", boxShadow: "none" }
                            }}
                        >
                            Approve Employee
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </div>
    );
};

const PendingDetail = ({ label, value }) => (
    <Grid item xs={12} sm={6}>
        <Typography sx={{ fontSize: "12px", color: "#64748b", fontWeight: 600, textTransform: "uppercase", mb: 0.5 }}>
            {label}
        </Typography>
        <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: "14px" }}>
            {value || "--"}
        </Typography>
    </Grid>
);

export default PendingEmployees;
