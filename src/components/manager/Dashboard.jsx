import { Box, Button, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import GroupsIcon from '@mui/icons-material/Groups';
import GroupOffIcon from '@mui/icons-material/GroupOff';
import DescriptionIcon from '@mui/icons-material/Description';
import '../../App.css'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';
import api from '../../services/service.js';


function Dashboard(){

    const [page, setPage] = useState(0);
    const { isMobile } = useAppContext();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [approvedUsers, setApprovedUsers] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);

    const rowsPerPage = 5;
    const today = new Date();

    const formattedDate = today.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    
    const fetchAtendanceData = async () => {
        try{
            const res = await api.get("attendance/manager/today/");
            setRows(res.data);
        }catch(err){
            console.log(err);
            setRows([]);
        }
    }

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

    useEffect(() => {
        fetchAtendanceData();
        fetchApprovedUsers();
        fetchPendingLeaves();
        fetchPendingUsers();
    }, []);

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
            <Typography variant='h5' component='p' sx={{fontFamily : "work sans", fontWeight : "500", color : "#080808"}}>Welcome Manager!</Typography>
            <div style={{ marginTop : "20px"}} >
                <div className='widgets'>
                    <div className='widget-1'>
                        <Box sx={{ display : "flex", flexDirection : "row", alignItems : "center", columnGap : "20px"}}>
                            <Box sx={{width : "60px", height : "60px", background : "#ef9a9a", display : "flex", alignItems : "center", justifyContent : "center", borderRadius : "5px"}}>
                                <GroupsIcon sx={{fontSize : 50}} />
                            </Box>
                            <Box sx={{ textAlign : "center"}}>
                                <Typography sx={{ fontSize: "14px", opacity: 0.7, color : "whitesmoke" }}> Total Employees </Typography>
                                <Typography variant="h5" fontWeight="bold" sx={{color : "whitesmoke"}}> {approvedUsersCount} </Typography>
                            </Box>
                        </Box>
                        
                        <Button size="small"
                            sx={{
                                alignSelf: "flex-end",
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: "8px",
                                paddingX: "14px",
                                border: "1px solid #ef9a9a",
                                color: "#ef9a9a",
                                "&:hover": {
                                    backgroundColor: "#ef9a9a",
                                    color: "#000",
                                },
                            }}
                        >Manage</Button>
                    </div>
                    <div className='widget-2'>
                        <Box sx={{ display : "flex", flexDirection : "row", alignItems : "center", columnGap : "20px"}}>
                            <Box sx={{width : "60px", height : "60px", background : "#b39ddb", display : "flex", alignItems : "center", justifyContent : "center", borderRadius : "5px"}}>
                                <GroupOffIcon sx={{fontSize : 40}} />
                            </Box>
                            <Box sx={{ textAlign : "center"}}>
                                <Typography sx={{ fontSize: "14px", opacity: 0.7, color : "whitesmoke" }}> Employee Requests </Typography>
                                <Typography variant="h5" fontWeight="bold" sx={{color : "whitesmoke"}}> {pendingUsersCount} </Typography>
                            </Box>
                        </Box>
                        
                        <Button size="small" onClick={() => navigate('/manager/addemployee')}
                            sx={{
                                alignSelf: "flex-end",
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: "8px",
                                paddingX: "14px",
                                border: "1px solid #b39ddb",
                                color: "#b39ddb",
                                "&:hover": {
                                    backgroundColor: "#b39ddb",
                                    color: "#000",
                                },
                            }}
                        >View </Button>
                    </div>
                    <div className='widget-3'>
                        <Box sx={{ display : "flex", flexDirection : "row", alignItems : "center", columnGap : "20px"}}>
                            <Box sx={{width : "60px", height : "60px", background : "#c5e1a5", display : "flex", alignItems : "center", justifyContent : "center", borderRadius : "5px"}}>
                                <DescriptionIcon sx={{fontSize : 40}} />
                            </Box>
                            <Box sx={{ textAlign : "center"}}>
                                <Typography sx={{ fontSize: "14px", opacity: 0.7, color : "whitesmoke" }}> Leave Requests </Typography> 
                                <Typography variant="h5" fontWeight="bold" sx={{color : "whitesmoke"}}> {leaveRequestsCount} </Typography>
                            </Box>
                        </Box>
                        <Button size="small" onClick={() => navigate('/manager/leave-management')}
                            sx={{
                                alignSelf: "flex-end",
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: "8px",
                                paddingX: "14px",
                                border: "1px solid #c5e1a5",
                                color: "#c5e1a5",
                                "&:hover": {
                                    backgroundColor: "#c5e1a5",
                                    color: "#000",
                                },
                            }}
                        >View</Button>
                    </div>
                </div>
                <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "20px",
                    }}
                >
                    <Typography
                        sx={{
                        fontFamily: "work sans",
                        fontWeight: 500,
                        fontSize: "20px",
                        }}
                    >
                        Employees Daily Login Status
                    </Typography>

                    <Box
                        sx={{
                        border: "2px solid grey",
                        borderRadius: "5px",
                        display: "flex",
                        alignItems: "center",
                        background: "white",
                        padding: "5px 10px",
                        gap: "5px",
                        }}
                    >
                        <CalendarMonthIcon sx={{ color: "#0d47a1" }} />
                        <Typography sx={{ fontFamily: "work sans", fontWeight: 600, color : "#1e1e1e" }}>
                            {formattedDate}
                        </Typography>
                    </Box>
                </div>

                <div style={{ marginTop : "10px"}}>
                    <TableContainer component={Paper} 
                        sx={{
                            background: "#1e1e1e",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                        }}
                    >
                        <Table>
                            
                            <TableHead sx={{ display: { xs: "none", sm: "table-header-group" } }}>
                                <TableRow>
                                    <TableCell sx={{ color: "whitesmoke", fontWeight: 600 }}>
                                        Employee Name
                                    </TableCell>
                                    <TableCell sx={{ color: "whitesmoke", fontWeight: 600 }}>
                                        Check-In Time
                                    </TableCell>
                                    <TableCell sx={{ color: "whitesmoke", fontWeight: 600 }}>
                                        Check-Out Time
                                    </TableCell>
                                    <TableCell sx={{ color: "whitesmoke", fontWeight: 600 }}>
                                        Status
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            {!isMobile ? (
                            <TableBody>
                            {rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                <TableRow key={index} hover>
                                    <TableCell sx={{ color: "whitesmoke" }}>
                                        {row.employee_name}
                                    </TableCell>
                                    <TableCell sx={{ color: "whitesmoke" }}>
                                        {formatTime(row.check_in)}
                                    </TableCell>
                                    <TableCell sx={{ color: "whitesmoke" }}>
                                        {formatTime(row.check_out)}
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={row.status}
                                            size="small"
                                            sx={{
                                                backgroundColor:
                                                row.status === "PRESENT" ? "#66bb6a" : row?.status === "ONGOING" ? "#3f51b5" : "#ef5350",
                                                color: "whitesmoke",
                                                fontWeight: 600,
                                                textTransform: "capitalize",
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                            ) : (
                                <TableBody>
                                    {rows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => (
                                        <TableRow key={index} sx={{ background : "#333"}}>
                                            <TableCell colSpan={4} sx={{ borderBottom: "none" }}>
                                                <Box sx={{ background: "#1e1e1e", borderRadius: "12px", padding: "12px", mb: 1, }}>
                                                    <Typography sx={{ fontWeight: 600, color: "whitesmoke" }}>
                                                        {row.employee_name}
                                                    </Typography>

                                                    <Typography sx={{ fontSize: "14px", opacity: 0.7, color: "whitesmoke" }}>
                                                        Check-In: {formatTime(row.check_in)}
                                                    </Typography>

                                                    <Typography sx={{ fontSize: "14px", opacity: 0.7, color: "whitesmoke" }}>
                                                        Check-Out: {formatTime(row.check_out)}
                                                    </Typography>

                                                    <Chip label={row.status} size="small"
                                                        sx={{
                                                            mt: 1,
                                                            backgroundColor:
                                                                row.status === "PRESENT" ? "#66bb6a" : row?.status === "ONGOING" ? "#3f51b5" : "#ef5350",
                                                            color: "whitesmoke",
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            )}
                            <TablePagination
                                count={rows.length}
                                page={page}
                                onPageChange={(e, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={[5]}
                                sx={{
                                    color : "whitesmoke"
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
