import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router-dom';
// import { employeesTask } from "../../assets/assets.js"
import { useAppContext } from '../context/AppContext.jsx';
import api from '../../services/service.js';
import MuiAlert from "@mui/material/Alert";

const AddTask = () => {
    
    const navigate = useNavigate();
    const [selectedEmployee, setSelectedEmployee] = useState([]);
    const { isMobile } = useAppContext();
    const [open, setOpen] = useState(false);
    const [sopen, setSOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("");
    const [arows, setARows] = useState([]);
    const handleClose = () => setOpen(false);

    const groupedEmployees = Object.values(
        selectedEmployee.reduce((acc, task) => {

            const empId = task.assigned_to_details.id;

            if (!acc[empId]) {
                acc[empId] = {
                    employee: task.assigned_to_details,
                    tasks: []
                };
            }

            acc[empId].tasks.push(task);

            return acc;

        }, {})
    );

    const ApprovedUsersList = async () => {
        try{
            const res = await api.get("accounts/manager/approved-users/");
            setARows(res.data);
        }catch(err){
            console.log(err);
        }
    }

    const fetchEmployeesTask = async () => {
        try{
            const res = await api.get("task/tasks/");
            setSelectedEmployee(res.data);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        ApprovedUsersList();
        fetchEmployeesTask();
    },[]);

    const employeesWithSummary = groupedEmployees.map((emp) => {
        const inProgress = emp.tasks.filter(t => t.status === "PENDING").length;
        const completed = emp.tasks.filter(t => t.status === "COMPLETED").length;
        
        return {
            ...emp,
            taskSummary: {
                inProgress,
                completed,
            },
        };
    });

    const today = new Date().toISOString().slice(0, 10);


    const handleAddTask = async(e) => {
        e.preventDefault();
        try{
            const res = await api.post('task/tasks/', {
                title : title,
                description: description,
                assigned_to : assignedTo,
                end_date : dueDate,
                priority : priority
            });
            setMessage("Task updated Successfully!");
            setSOpen(true);
            setSeverity("success");
            fetchEmployeesTask();
            handleClose();
        }catch(err){
            console.log(err);
            setMessage(err.response?.data?.message);
            setSOpen(true);
            setSeverity("error");
        }
    }

    const handleSClose = (event, reason) => {
        if (reason === "clickaway") return;
        setSOpen(false);
    };
    

    return (
        <div>
            <Typography variant='h5' component='p' sx={{
                fontFamily : "work sans",
                fontWeight : "600",
                color : "#080808"
            }}> Employees Task Assignment </Typography>
            <Box sx={{ marginTop : "20px"}}>
                <Box sx={{ display : "flex", justifyContent : "flex-end", marginBottom : "10px"}}>
                    <Button variant='contained' onClick={() => setOpen(true)} sx={{ textTransform : "none", background : "#00838f", color : "whitesmoke"}}> + Assign New Task</Button>
                </Box>
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
                                    Role
                                </TableCell>
                                <TableCell align="center" sx={{ color: "whitesmoke", fontWeight: 600 }}>
                                    Pending Tasks
                                </TableCell>
                                <TableCell align="center" sx={{ color: "whitesmoke", fontWeight: 600 }}>
                                    Completed Tasks
                                </TableCell>
                                <TableCell align="center" sx={{ color: "whitesmoke", fontWeight: 600 }}>
                                    View
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {!isMobile ?
                            employeesWithSummary.map((row, index) => (
                                <TableRow key={index} hover>
                                    <TableCell align="center" sx={{ color : "whitesmoke" }}>
                                        {row.employee.username}    
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "whitesmoke" }}>
                                        {row.employee.designation}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "whitesmoke" }}>
                                        {row.taskSummary.inProgress}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "whitesmoke" }}>
                                        {row.taskSummary.completed}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton sx={{ color: "#90caf9" }} onClick={() => navigate("/manager/employee-task/"+row.employee.id)}>
                                            <KeyboardArrowRightIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )) :
                            employeesWithSummary.map((row, index) => (
                                <TableRow key={index} sx={{ background : "#333"}}>
                                    <TableCell colSpan={5} sx={{ borderBottom: "none" }}>
                                        <Box
                                            sx={{
                                            background: "#1e1e1e",
                                            borderRadius: "12px",
                                            padding: "14px",
                                            mb: 1,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1,
                                            }}
                                        >
                                            <Typography sx={{ fontWeight: 600, color: "whitesmoke" }}>
                                            {row.employee.username}
                                            </Typography>

                                            <Typography sx={{ fontSize: "14px", opacity: 0.7, color: "whitesmoke" }}>
                                            🧑‍💼 {row.employee.designation}
                                            </Typography>

                                            <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                mt: 1,
                                            }}
                                            >
                                            <Typography sx={{ fontSize: "14px", opacity: 0.7, color: "whitesmoke" }}>
                                                ⏳ Pending: {row.taskSummary.inProgress}
                                            </Typography>

                                            <Typography sx={{ fontSize: "14px", opacity: 0.7, color: "whitesmoke" }}>
                                                ✅ Completed: {row.taskSummary.completed}
                                            </Typography>
                                            </Box>

                                            <Box sx={{ textAlign: "right" }}>
                                            <IconButton
                                                sx={{ color: "#90caf9" }}
                                                onClick={() =>
                                                navigate("/manager/employee-task/" + row.employee.id)
                                                }
                                            >
                                                <KeyboardArrowRightIcon />
                                            </IconButton>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                                ))
                            }
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
                    Add New Task
                </DialogTitle>

                <DialogContent dividers>
                    <Grid container spacing={2}>
                        {/* Name */}
                        <Grid item size={{xs: 12, sm: 6, md: 4}}>
                            <TextField label="Title" fullWidth required value={title} onChange={(e) => setTitle(e.target.value)} />
                        </Grid>

                        <Grid item size={{xs: 12, sm: 6, md: 4}}>
                            <TextField
                                label="Due Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                required
                                inputProps={{ min: today }}
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                sx={{
                                    "& input::-webkit-calendar-picker-indicator": {
                                        filter: "invert(0)"
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item size={{xs: 12, sm: 6, md: 4}}>
                            <TextField select label="Assigned to" fullWidth required value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                                {arows.map((row,id) => (
                                    <MenuItem key={id} value={row.id}> {row.username} </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item size={{xs: 12, sm: 6, md: 4}}>
                            <TextField select label="Priority" fullWidth required value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <MenuItem value="HIGH"> High </MenuItem>
                                <MenuItem value="MEDIUM"> Medium </MenuItem>
                                <MenuItem value="LOW"> Low </MenuItem>
                            </TextField>
                        </Grid>


                        {/* Address */}
                        <Grid item size={{xs: 12, sm: 6, md: 6}}>
                            <TextField
                                label="Description"
                                multiline
                                rows={3}
                                fullWidth
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ padding: "16px" }}>
                    <Button onClick={handleClose} color="inherit">
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleAddTask} sx={{ textTransform: "none", fontWeight: 600 }}>
                        Assign Task
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={sopen}
                autoHideDuration={1800}
                onClose={handleSClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MuiAlert
                elevation={6}
                variant="filled"
                onClose={handleClose}
                severity={severity}
                sx={{ width: "100%" }}
                >
                {message}
                </MuiAlert>
            </Snackbar>
        </div>
    )
}

export default AddTask
