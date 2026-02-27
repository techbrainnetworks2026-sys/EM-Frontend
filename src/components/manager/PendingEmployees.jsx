import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
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
            await api.patch(`accounts/manager/users/${selectedUser.id}/approve/`);
            setUOpen(false);
            fetchPendingUsers();
        } catch (err) {
            console.log(err);
        }
    };

    const handleReject = async () => {
        try {
            await api.patch(`accounts/manager/users/${selectedUser.id}/reject/`);
            setUOpen(false);
            fetchPendingUsers();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/manager/dashboard')}
                    sx={{ textTransform: "none", color: "#00838f" }}
                >
                    Back to Dashboard
                </Button>
                <Typography variant='h5' component='p' sx={{
                    fontFamily: "work sans",
                    fontWeight: "600",
                    color: "#080808"
                }}>
                    Pending Employee Requests
                </Typography>
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
                                rows.filter((pending) => pending.is_approved === false).map((row, index) => (
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
                                            <Chip label={"PENDING"} size="small"
                                                sx={{
                                                    width: "fit-content",
                                                    backgroundColor: "#ffd600",
                                                    color: "#000",
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
                                : rows.filter((pending) => pending.is_approved === false).map((row, index) => (
                                    <TableRow key={index} sx={{ background: "#333" }}>
                                        <TableCell colSpan={5} sx={{ borderBottom: "none" }}>
                                            <Box sx={{ background: "#1e1e1e", borderRadius: "12px", padding: "12px", mb: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <Avatar sx={{ width: 36, height: 36, bgcolor: "#0d47a1" }}>
                                                        {row.username.charAt(0).toUpperCase()}
                                                    </Avatar>

                                                    <Typography sx={{ fontWeight: 600, color: "whitesmoke" }}>
                                                        {row.username}
                                                    </Typography>
                                                </Box>

                                                <Typography sx={{ fontSize: "14px", opacity: 0.7, color: "whitesmoke", display: "flex", alignItems: "center", columnGap: "7px" }}>
                                                    <EmailIcon /> {row.email}
                                                </Typography>

                                                <Typography sx={{ fontSize: "14px", opacity: 0.7, color: "whitesmoke", display: "flex", alignItems: "center", columnGap: "7px" }}>
                                                    <PersonIcon /> {row.designation}
                                                </Typography>

                                                <Chip label={"PENDING"} size="small"
                                                    sx={{
                                                        mt: 1,
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
            )}

            {selectedUser && (
                <Dialog open={uopen} onClose={handleUClose} maxWidth="sm" fullWidth>
                    <DialogTitle>Employee Details</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Name</Typography>
                                <Typography>{selectedUser.username}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Email</Typography>
                                <Typography>{selectedUser.email}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Designation</Typography>
                                <Typography>{selectedUser.designation}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Status</Typography>
                                <Chip label={"PENDING"} size="small"
                                    sx={{
                                        backgroundColor: "#ffd600",
                                        color: "#000",
                                        fontWeight: 600,
                                    }}
                                />
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleUClose} sx={{ textTransform: "none" }}>Cancel</Button>
                        <Button onClick={handleReject} sx={{ textTransform: "none", color: "#ef4444" }}>Reject</Button>
                        <Button onClick={handleApprove} variant="contained" sx={{ textTransform: "none", background: "#2e7d32" }}>Approve</Button>
                    </DialogActions>
                </Dialog>
            )}
        </div>
    );
};

export default PendingEmployees;
