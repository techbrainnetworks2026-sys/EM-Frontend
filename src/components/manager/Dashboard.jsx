import { Box, Button, Chip, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import GroupsIcon from '@mui/icons-material/Groups';
import GroupOffIcon from '@mui/icons-material/GroupOff';
import DescriptionIcon from '@mui/icons-material/Description';
import '../../App.css'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';
import api from '../../services/service.js';
import EmployeeLeaveWidget from './components/EmployeeLeaveWidget.jsx';


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

    const fetchAtendanceData = async (date) => {
        try {
            const res = await api.get(`attendance/manager/today/?date=${date}`);
            setRows(res.data);
        } catch (err) {
            setRows([]);
        }
    }

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
            console.log(err);
        }
    };



    useEffect(() => {
        fetchApprovedUsers();
        fetchPendingLeaves();
        fetchPendingUsers();
    }, []);

    useEffect(() => {
        if (selectedDate) {
            fetchAtendanceData(selectedDate);
            setSearchTerm("");
        }
    }, [selectedDate]);

    const approvedUsersCount = approvedUsers.length;
    const pendingUsersCount = pendingUsers.length;
    const leaveRequestsCount = leaveRequests.length;



    const formatTime = (timeStr) => {
        if (!timeStr) return "--";

        const [hour, minute] = timeStr.split(":");
        const h = Number(hour);

        const period = h >= 12 ? "PM" : "AM";
        const displayHour = h % 12 === 0 ? 12 : h % 12;

        return `${displayHour.toString().padStart(2, "0")}:${minute} ${period}`;
    };

    return (
        <div>
            <Typography variant='h5' component='p' sx={{ fontFamily: "work sans", fontWeight: "500", color: "#080808" }}>Welcome Manager!</Typography>
            <div style={{ marginTop: "20px" }} >
                <div className='widgets' style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    <div className='widget-1' style={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", background: "#ffffff", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1px solid #fee2e2" }}>
                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", columnGap: "20px", mb: 2 }}>
                            <Box sx={{ width: "56px", height: "56px", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px" }}>
                                <GroupsIcon sx={{ fontSize: 32, color: "#ef4444" }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}> Total Employees </Typography>
                                <Typography variant="h4" fontWeight="800" sx={{ color: "#1e293b" }}> {approvedUsersCount} </Typography>
                            </Box>
                        </Box>

                        <Button size="small" onClick={() => navigate('/manager/addemployee')}
                            sx={{
                                alignSelf: "flex-end",
                                textTransform: "none",
                                fontWeight: 700,
                                borderRadius: "8px",
                                px: 2,
                                py: 1,
                                background: "#fee2e2",
                                color: "#ef4444",
                                border: "none",
                                "&:hover": {
                                    backgroundColor: "#fecaca",
                                },
                            }}
                        >Manage</Button>
                    </div>
                    <div className='widget-2' style={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", background: "#ffffff", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1px solid #ede9fe" }}>
                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", columnGap: "20px", mb: 2 }}>
                            <Box sx={{ width: "56px", height: "56px", background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px" }}>
                                <GroupOffIcon sx={{ fontSize: 32, color: "#8b5cf6" }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}> Employee Requests </Typography>
                                <Typography variant="h4" fontWeight="800" sx={{ color: "#1e293b" }}> {pendingUsersCount} </Typography>
                            </Box>
                        </Box>

                        <Button size="small" onClick={() => navigate('/manager/pending-employees')}
                            sx={{
                                alignSelf: "flex-end",
                                textTransform: "none",
                                fontWeight: 700,
                                borderRadius: "8px",
                                px: 2,
                                py: 1,
                                background: "#ede9fe",
                                color: "#8b5cf6",
                                border: "none",
                                "&:hover": {
                                    backgroundColor: "#ddd6fe",
                                },
                            }}
                        >View </Button>
                    </div>
                    <div className='widget-3' style={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", background: "#ffffff", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1px solid #ecfdf5" }}>
                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", columnGap: "20px", mb: 2 }}>
                            <Box sx={{ width: "56px", height: "56px", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px" }}>
                                <DescriptionIcon sx={{ fontSize: 32, color: "#10b981" }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}> Leave Requests </Typography>
                                <Typography variant="h4" fontWeight="800" sx={{ color: "#1e293b" }}> {leaveRequestsCount} </Typography>
                            </Box>
                        </Box>
                        <Button size="small" onClick={() => navigate('/manager/leave-management')}
                            sx={{
                                alignSelf: "flex-end",
                                textTransform: "none",
                                fontWeight: 700,
                                borderRadius: "8px",
                                px: 2,
                                py: 1,
                                background: "#ecfdf5",
                                color: "#10b981",
                                border: "none",
                                "&:hover": {
                                    backgroundColor: "#d1fae5",
                                },
                            }}
                        >View</Button>
                    </div>
                    <EmployeeLeaveWidget />
                </div>
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 3,
                    flexWrap: "wrap",
                    gap: 2
                }}>
                    <Typography
                        sx={{
                            fontWeight: 700,
                            fontSize: "20px",
                            color: "#1e293b"
                        }}
                    >
                        Today's Attendance
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: { xs: "100%", sm: "auto" } }}>
                        <TextField
                            size="small"
                            placeholder="Search employee..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                                onChange={(e) => setSelectedDate(e.target.value)}
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
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            border: "1px solid #e2e8f0"
                        }}
                    >
                        <Table>
                            {/* ... table content exists here in original snippet ... */}

                            <TableHead sx={{ display: { xs: "none", sm: "table-header-group" } }}>
                                <TableRow>
                                    <TableCell sx={{ color: "#1e293b", fontWeight: 600 }}>
                                        Employee Name
                                    </TableCell>
                                    <TableCell sx={{ color: "#1e293b", fontWeight: 600 }}>
                                        Check-In Time
                                    </TableCell>
                                    <TableCell sx={{ color: "#1e293b", fontWeight: 600 }}>
                                        Check-Out Time
                                    </TableCell>
                                    <TableCell sx={{ color: "#1e293b", fontWeight: 600 }}>
                                        Status
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            {!isMobile ? (
                                <TableBody>
                                    {rows?.filter(r => (r.employee_name || "").toLowerCase().includes((searchTerm || "").toLowerCase()))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                            <TableRow key={index} hover>
                                                <TableCell sx={{ color: "#334155" }}>
                                                    {row.employee_name}
                                                </TableCell>
                                                <TableCell sx={{ color: "#334155" }}>
                                                    {formatTime(row.check_in)}
                                                </TableCell>
                                                <TableCell sx={{ color: "#334155" }}>
                                                    {formatTime(row.check_out)}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={row.status}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor:
                                                                row.status === "PRESENT" ? "#e8f5e9" : row?.status === "ONGOING" ? "#e0e7ff" : "#ffebee",
                                                            color: row.status === "PRESENT" ? "#2e7d32" : row?.status === "ONGOING" ? "#3730a3" : "#d32f2f",
                                                            fontWeight: 700,
                                                            fontSize: "11px",
                                                            border: `1px solid ${row.status === "PRESENT" ? "#c8e6c9" : row?.status === "ONGOING" ? "#c7d2fe" : "#ffcdd2"}`,
                                                            textTransform: "uppercase",
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            ) : (
                                <TableBody>
                                    {rows?.filter(r => (r.employee_name || "").toLowerCase().includes((searchTerm || "").toLowerCase()))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell colSpan={4} sx={{ borderBottom: "none", padding: "8px" }}>
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
                                                                    backgroundColor:
                                                                        row.status === "PRESENT" ? "#e8f5e9" : row?.status === "ONGOING" ? "#e8eaf6" : "#ffebee",
                                                                    color:
                                                                        row.status === "PRESENT" ? "#2e7d32" : row?.status === "ONGOING" ? "#3f51b5" : "#d32f2f",
                                                                    fontWeight: 700,
                                                                    fontSize: "11px",
                                                                    border: `1px solid ${row.status === "PRESENT" ? "#c8e6c9" : row?.status === "ONGOING" ? "#c5cae9" : "#ffcdd2"}`
                                                                }}
                                                            />
                                                        </Box>

                                                        <Divider sx={{ opacity: 0.5, my: 0.5 }} />

                                                        <Box sx={{ display: "flex", gap: 2 }}>
                                                            <Box sx={{ flex: 1 }}>
                                                                <Typography sx={{ fontSize: "11px", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
                                                                    Check-In
                                                                </Typography>
                                                                <Typography sx={{ fontSize: "14px", color: "#334155", fontWeight: 500 }}>
                                                                    {formatTime(row.check_in)}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ flex: 1 }}>
                                                                <Typography sx={{ fontSize: "11px", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
                                                                    Check-Out
                                                                </Typography>
                                                                <Typography sx={{ fontSize: "14px", color: "#334155", fontWeight: 500 }}>
                                                                    {formatTime(row.check_out)}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            )}
                            <TablePagination
                                count={rows?.filter(r => (r.employee_name || "").toLowerCase().includes((searchTerm || "").toLowerCase())).length || 0}
                                page={page}
                                onPageChange={(e, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={[5]}
                                sx={{
                                    color: "#334155"
                                }}
                            />
                        </Table>
                    </TableContainer>
                </div>

            </div>
        </div>

    )
}

export default Dashboard
