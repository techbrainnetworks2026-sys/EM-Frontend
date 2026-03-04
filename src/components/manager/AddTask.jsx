import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
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

            const empId = task.assigned_to_details?.id;
            if (!empId) return acc;

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
        try {
            const res = await api.get("accounts/manager/approved-users/");
            setARows(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    const fetchEmployeesTask = async () => {
        try {
            const res = await api.get("task/tasks/");
            setSelectedEmployee(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        ApprovedUsersList();
        fetchEmployeesTask();
    }, []);

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


    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('task/tasks/', {
                title: title,
                description: description,
                assigned_to: assignedTo,
                start_date: dueDate,
                priority: priority
            });
            setMessage("Task assigned successfully!");
            setSOpen(true);
            setSeverity("success");
            fetchEmployeesTask();
            handleClose();
        } catch (err) {
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
                fontFamily: "work sans",
                fontWeight: "700",
                color: "#1e293b",
                mb: 1
            }}> Employees Task Assignment </Typography>
            <Typography sx={{ color: "#64748b", mb: 3, fontSize: "14px" }}>
                Monitor performance and delegate responsibilities across your team.
            </Typography>

            <Box sx={{ marginTop: "20px" }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
                    <Button
                        variant='contained'
                        onClick={() => setOpen(true)}
                        sx={{
                            textTransform: "none",
                            background: "#0d47a1",
                            color: "white",
                            fontWeight: 700,
                            borderRadius: "10px",
                            px: 3,
                            boxShadow: "0 4px 6px -1px rgba(13, 71, 161, 0.3)",
                            "&:hover": { background: "#1e3a8a" }
                        }}
                    >
                        + Assign New Task
                    </Button>
                </Box>
                <TableContainer
                    component={Paper}
                    sx={{
                        background: "white",
                        borderRadius: "12px",
                        border: "1px solid #e0e0e0"
                    }}
                >
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ display: { xs: "none", sm: "table-header-group" }, bgcolor: "#f8fafc" }}>
                            <TableRow>
                                <TableCell sx={{ color: "#475569", fontWeight: 700, fontSize: "12px", textTransform: "uppercase" }}>Employee</TableCell>
                                <TableCell sx={{ color: "#475569", fontWeight: 700, fontSize: "12px", textTransform: "uppercase" }}>Role</TableCell>
                                <TableCell align="center" sx={{ color: "#475569", fontWeight: 700, fontSize: "12px", textTransform: "uppercase" }}>Pending Tasks</TableCell>
                                <TableCell align="center" sx={{ color: "#475569", fontWeight: 700, fontSize: "12px", textTransform: "uppercase" }}>Completed</TableCell>
                                <TableCell align="center" sx={{ color: "#475569", fontWeight: 700, fontSize: "12px", textTransform: "uppercase" }}>Action</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {!isMobile ?
                                employeesWithSummary.map((row, index) => (
                                    <TableRow key={index} sx={{ "&:hover": { background: "#f8fafc" }, transition: "0.2s" }}>
                                        <TableCell>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <Avatar sx={{ width: 32, height: 32, fontSize: "12px", bgcolor: "#e0e7ff", color: "#4338ca", fontWeight: 700 }}>
                                                    {(row.employee?.username || "U").charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Typography sx={{ fontWeight: 600, color: "#1e293b" }}>
                                                    {row.employee?.username || "Unknown"}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={row.employee?.designation || "Employee"}
                                                size="small"
                                                sx={{ bgcolor: "#f1f5f9", color: "#475569", fontWeight: 600, fontSize: "11px" }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography sx={{ fontWeight: 700, color: row.taskSummary.inProgress > 0 ? "#ef4444" : "#64748b" }}>
                                                {row.taskSummary.inProgress}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography sx={{ fontWeight: 700, color: "#10b981" }}>
                                                {row.taskSummary.completed}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                size="small"
                                                endIcon={<KeyboardArrowRightIcon />}
                                                onClick={() => navigate("/manager/employee-task/" + row.employee.id)}
                                                sx={{ textTransform: "none", fontWeight: 600, color: "#0d47a1" }}
                                            >
                                                Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) :
                                employeesWithSummary.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell colSpan={5} sx={{ p: 1, borderBottom: "none" }}>
                                            <Box
                                                onClick={() => navigate("/manager/employee-task/" + row.employee.id)}
                                                sx={{
                                                    background: "#ffffff",
                                                    borderRadius: "16px",
                                                    padding: "16px",
                                                    border: "1px solid #e2e8f0",
                                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 1.5,
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                        <Avatar sx={{ bgcolor: "#e0e7ff", color: "#4338ca", fontWeight: 700 }}>
                                                            {row.employee.username.charAt(0).toUpperCase()}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography sx={{ fontWeight: 700, color: "#1e293b" }}>
                                                                {row.employee.username}
                                                            </Typography>
                                                            <Typography sx={{ fontSize: "12px", color: "#64748b" }}>
                                                                {row.employee.designation}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <KeyboardArrowRightIcon sx={{ color: "#94a3b8" }} />
                                                </Box>

                                                <Box sx={{ display: "flex", gap: 2, pt: 1, borderTop: "1px solid #f1f5f9" }}>
                                                    <Box sx={{ flex: 1, textAlign: "center" }}>
                                                        <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Pending</Typography>
                                                        <Typography sx={{ fontSize: "18px", fontWeight: 800, color: row.taskSummary.inProgress > 0 ? "#ef4444" : "#1e293b" }}>{row.taskSummary.inProgress}</Typography>
                                                    </Box>
                                                    <Box sx={{ width: "1px", bgcolor: "#f1f5f9" }} />
                                                    <Box sx={{ flex: 1, textAlign: "center" }}>
                                                        <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Completed</Typography>
                                                        <Typography sx={{ fontSize: "18px", fontWeight: 800, color: "#10b981" }}>{row.taskSummary.completed}</Typography>
                                                    </Box>
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
                maxWidth="sm"
                PaperProps={{
                    sx: { borderRadius: "16px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: "#1e293b", pt: 3, px: 3 }}>
                    Assign New Task
                </DialogTitle>

                <DialogContent sx={{ px: 3, py: 2 }}>
                    <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
                        <Grid item xs={12}>
                            <TextField label="Task Title" fullWidth required value={title} onChange={(e) => setTitle(e.target.value)} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Due Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                required
                                inputProps={{ min: today }}
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField select label="Priority Level" fullWidth required value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <MenuItem value="HIGH"> High Priority</MenuItem>
                                <MenuItem value="MEDIUM"> Medium Priority </MenuItem>
                                <MenuItem value="LOW"> Low Priority </MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField select label="Assign to Employee" fullWidth required value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                                {arows.map((row) => (
                                    <MenuItem key={row.id} value={row.id}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Avatar sx={{ width: 24, height: 24, fontSize: "10px" }}>{(row.username || "U").charAt(0)}</Avatar>
                                            {row.username || "Unknown"}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Task Description"
                                multiline
                                rows={4}
                                fullWidth
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Clearly describe the objective of this task..."
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ padding: "16px 24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
                    <Button onClick={handleClose} sx={{ fontWeight: 600, color: "#64748b", textTransform: "none" }}>
                        Discard
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleAddTask}
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            background: "#0d47a1",
                            borderRadius: "8px",
                            px: 3,
                            "&:hover": { background: "#1e3a8a" }
                        }}
                    >
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
