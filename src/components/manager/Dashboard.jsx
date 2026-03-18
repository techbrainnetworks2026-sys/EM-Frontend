import { Box, Button, Chip, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import GroupsIcon from '@mui/icons-material/Groups';
import GroupOffIcon from '@mui/icons-material/GroupOff';
import DescriptionIcon from '@mui/icons-material/Description';
import '../../App.css'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';
import api from '../../services/service.js';
import EmployeeAttendanceWidget from './components/EmployeeLeaveWidget.jsx';
import './ManagerLayout.css';

import { formatTime } from '../../utils/timeFormatter.js';

const calculateTotalHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "--";

    const [inH, inM] = checkIn.split(':').map(Number);
    const [outH, outM] = checkOut.split(':').map(Number);

    let diffMinutes = (outH * 60 + outM) - (inH * 60 + inM);
    if (diffMinutes < 0) diffMinutes += 24 * 60; // Handle over-midnight shifts

    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    return `${hours}h ${mins}m`;
};

function Dashboard() {
    const [page, setPage] = useState(0);
    const { isMobile } = useAppContext();
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [rows, setRows] = useState([]);
    const [approvedUsers, setApprovedUsers] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const rowsPerPage = 5;

    const fetchAtendanceData = useCallback(async (date) => {
        try {
            const res = await api.get(`attendance/manager/today/?date=${date}`);
            setRows(res.data || []);
        } catch (err) {
            setRows([]);
        }
    }, []);

    const fetchApprovedUsers = useCallback(async () => {
        try {
            const res = await api.get("accounts/manager/approved-users/");
            setApprovedUsers(res.data || []);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const fetchPendingUsers = useCallback(async () => {
        try {
            const res = await api.get("accounts/manager/pending-users/");
            setPendingUsers(res.data || []);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const fetchPendingLeaves = useCallback(async () => {
        try {
            const res = await api.get("leave/manager/pending-leaves/");
            setLeaveRequests(res.data || []);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const fetchAllData = useCallback(async () => {
        try {
            // Parallelize independent API calls
            await Promise.all([
                fetchApprovedUsers(),
                fetchPendingLeaves(),
                fetchPendingUsers()
            ]);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
        }
    }, [fetchApprovedUsers, fetchPendingLeaves, fetchPendingUsers]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    useEffect(() => {
        if (selectedDate) {
            fetchAtendanceData(selectedDate);
            setSearchTerm("");
        }
    }, [selectedDate, fetchAtendanceData]);

    const approvedUsersCount = useMemo(() => approvedUsers.length, [approvedUsers]);
    const pendingUsersCount = useMemo(() => pendingUsers.length, [pendingUsers]);
    const leaveRequestsCount = useMemo(() => leaveRequests.length, [leaveRequests]);

    const filteredAndPaginatedRows = useMemo(() => {
        const filtered = rows.filter(r => 
            (r.employee_name || "").toLowerCase().includes((searchTerm || "").toLowerCase())
        );
        return {
            paginated: filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
            total: filtered.length
        };
    }, [rows, searchTerm, page, rowsPerPage]);

    const handlePageChange = useCallback((e, newPage) => {
        setPage(newPage);
    }, []);

    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
        setPage(0); // Reset to first page on search
    }, []);

    const handleDateChange = useCallback((e) => {
        setSelectedDate(e.target.value);
    }, []);

    return (
        <div>
            <Typography className="manager-dashboard-header" component="h1">Welcome Manager!</Typography>
            <div style={{ marginTop: "20px" }} >
                <div className="manager-widget-grid">
                    <div className="manager-widget-card widget-red">
                        <Box className="manager-widget-header">
                            <Box className="manager-widget-info">
                                <Typography className="manager-widget-title"> Total Employees </Typography>
                                <Typography className="manager-widget-value"> {approvedUsersCount} </Typography>
                            </Box>
                            <Box className="manager-widget-icon-box">
                                <GroupsIcon />
                            </Box>
                        </Box>
                        <Button className="manager-widget-action" onClick={() => navigate('/manager/addemployee')}>
                            Manage
                        </Button>
                    </div>
                    <div className="manager-widget-card widget-purple">
                        <Box className="manager-widget-header">
                            <Box className="manager-widget-info">
                                <Typography className="manager-widget-title"> Employee Requests </Typography>
                                <Typography className="manager-widget-value"> {pendingUsersCount} </Typography>
                            </Box>
                            <Box className="manager-widget-icon-box">
                                <GroupOffIcon />
                            </Box>
                        </Box>
                        <Button className="manager-widget-action" onClick={() => navigate('/manager/pending-employees')}>
                            View
                        </Button>
                    </div>
                    <div className="manager-widget-card widget-green">
                        <Box className="manager-widget-header">
                            <Box className="manager-widget-info">
                                <Typography className="manager-widget-title"> Leave Requests </Typography>
                                <Typography className="manager-widget-value"> {leaveRequestsCount} </Typography>
                            </Box>
                            <Box className="manager-widget-icon-box">
                                <DescriptionIcon />
                            </Box>
                        </Box>
                        <Button className="manager-widget-action" onClick={() => navigate('/manager/leave-management')}>
                            View
                        </Button>
                    </div>
                    <EmployeeAttendanceWidget employees={approvedUsers} />
                </div>

                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 3,
                    flexWrap: "wrap",
                    gap: 2
                }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "20px", color: "#1e293b" }}>
                        Today's Attendance
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: { xs: "100%", sm: "auto" } }}>
                        <TextField
                            size="small"
                            placeholder="Search employee..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            sx={{
                                width: { xs: "100%", sm: "240px" },
                                background: "white",
                                "& .MuiOutlinedInput-root": { borderRadius: "10px" }
                            }}
                        />
                        <Box
                            sx={{
                                border: "1px solid #e2e8f0",
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                background: "#f8fafc",
                                padding: "6px 14px",
                                gap: "8px",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                            }}
                        >
                            <CalendarMonthIcon sx={{ color: "#64748b", fontSize: 18 }} />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                style={{
                                    border: "none",
                                    outline: "none",
                                    fontFamily: "inherit",
                                    fontWeight: 600,
                                    color: "#1e293b",
                                    fontSize: "13px",
                                    cursor: "pointer",
                                    background: "transparent",
                                }}
                            />
                        </Box>
                    </Box>
                </Box>

                <div style={{ marginTop: "10px" }}>
                    <TableContainer component={Paper}
                        sx={{
                            background: "#ffffff",
                            borderRadius: "16px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                            border: "1px solid #e2e8f0"
                        }}
                    >
                        <Table>
                            <TableHead sx={{ display: { xs: "none", sm: "table-header-group" }, backgroundColor: "transparent" }}>
                                <TableRow>
                                    <TableCell sx={{ color: "#1e293b", fontWeight: 600 }}>Employee Name</TableCell>
                                    <TableCell sx={{ color: "#1e293b", fontWeight: 600 }}>Check-In Time</TableCell>
                                    <TableCell sx={{ color: "#1e293b", fontWeight: 600 }}>Check-Out Time</TableCell>
                                    <TableCell sx={{ color: "#1e293b", fontWeight: 600 }}>Total Hours</TableCell>
                                    <TableCell sx={{ color: "#1e293b", fontWeight: 600 }}>Status</TableCell>
                                </TableRow>
                            </TableHead>

                            {!isMobile ? (
                                <TableBody>
                                    {filteredAndPaginatedRows.paginated.map((row, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell sx={{ color: "#334155" }}>{row.employee_name}</TableCell>
                                            <TableCell sx={{ color: "#334155" }}>{formatTime(row.check_in)}</TableCell>
                                            <TableCell sx={{ color: "#334155" }}>{formatTime(row.check_out)}</TableCell>
                                            <TableCell sx={{ color: "#334155", fontWeight: 500 }}>
                                                {calculateTotalHours(row.check_in, row.check_out)}
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={row.status}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: row.status === "PRESENT" ? "#f0fdf4" : row?.status === "ONGOING" ? "#f3e8ff" : "#fef2f2",
                                                        color: row.status === "PRESENT" ? "#166534" : row?.status === "ONGOING" ? "#7e22ce" : "#991b1b",
                                                        fontWeight: 600,
                                                        fontSize: "11px",
                                                        border: `1px solid ${row.status === "PRESENT" ? "#bbf7d0" : row?.status === "ONGOING" ? "#e9d5ff" : "#fecaca"}`,
                                                        textTransform: "uppercase",
                                                        borderRadius: "6px",
                                                        padding: "4px"
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            ) : (
                                <TableBody>
                                    {filteredAndPaginatedRows.paginated.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell colSpan={5} sx={{ borderBottom: "none", padding: "8px" }}>
                                                <Box sx={{
                                                    background: "#ffffff",
                                                    borderRadius: "12px",
                                                    padding: "16px",
                                                    mb: 1,
                                                    border: "1px solid #e2e8f0",
                                                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 1
                                                }}>
                                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "15px" }}>
                                                            {row.employee_name}
                                                        </Typography>
                                                        <Chip
                                                            label={row.status}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: row.status === "PRESENT" ? "#f0fdf4" : row?.status === "ONGOING" ? "#f3e8ff" : "#fef2f2",
                                                                color: row.status === "PRESENT" ? "#166534" : row?.status === "ONGOING" ? "#7e22ce" : "#991b1b",
                                                                fontWeight: 600,
                                                                fontSize: "11px",
                                                                border: `1px solid ${row.status === "PRESENT" ? "#bbf7d0" : row?.status === "ONGOING" ? "#e9d5ff" : "#fecaca"}`,
                                                                textTransform: "uppercase",
                                                                borderRadius: "6px",
                                                                padding: "4px"
                                                            }}
                                                        />
                                                    </Box>
                                                    <Divider sx={{ opacity: 0.5, my: 0.5 }} />
                                                    <Box sx={{ display: "flex", gap: 2 }}>
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography sx={{ fontSize: "11px", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Check-In</Typography>
                                                            <Typography sx={{ fontSize: "14px", color: "#334155", fontWeight: 500 }}>{formatTime(row.check_in)}</Typography>
                                                        </Box>
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography sx={{ fontSize: "11px", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Check-Out</Typography>
                                                            <Typography sx={{ fontSize: "14px", color: "#334155", fontWeight: 500 }}>{formatTime(row.check_out)}</Typography>
                                                        </Box>
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography sx={{ fontSize: "11px", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Total Hrs</Typography>
                                                            <Typography sx={{ fontSize: "14px", color: "#334155", fontWeight: 500 }}>{calculateTotalHours(row.check_in, row.check_out)}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            )}
                        </Table>
                        <TablePagination
                            count={filteredAndPaginatedRows.total}
                            page={page}
                            onPageChange={handlePageChange}
                            rowsPerPage={rowsPerPage}
                            rowsPerPageOptions={[5]}
                            sx={{ color: "#334155" }}
                        />
                    </TableContainer>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
