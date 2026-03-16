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
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("");
    const [errors, setErrors] = useState({});
    const [priority, setPriority] = useState("");
    const [arows, setARows] = useState([]);
    const [editOpen, setEditOpen] = useState(false);
    const [editTaskId, setEditTaskId] = useState(null);
    const [newEndDate, setNewEndDate] = useState("");
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
            // Validation
            const newErrors = {};
            if (!title) newErrors.title = 'Task Title is required';
            if (!startDate) newErrors.startDate = 'Start Date is required';
            if (!endDate) newErrors.endDate = 'End Date is required';
            if (!priority) newErrors.priority = 'Priority is required';
            if (!assignedTo) newErrors.assignedTo = 'Assignee is required';
            if (!description) newErrors.description = 'Description is required';
            if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
                newErrors.endDate = 'End Date cannot be before Start Date';
            }
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
            setErrors({});
            const res = await api.post('task/tasks/', {
                title: title,
                description: description,
                assigned_to: assignedTo,
                start_date: startDate,
                end_date: endDate,
                priority: priority,
                status: 'PENDING'
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

    const handleEditClick = (task) => {
        setEditTaskId(task.id);
        setNewEndDate(task.end_date ? task.end_date.split('T')[0] : "");
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
        setEditTaskId(null);
        setNewEndDate("");
    };

    const handleEditSubmit = async () => {
        if (!newEndDate) {
            setMessage("End Date is required");
            setSeverity("error");
            setSOpen(true);
            return;
        }
        try {
            await api.patch(`task/tasks/${editTaskId}/`, { end_date: newEndDate });
            fetchEmployeesTask();
            setMessage("Task end date updated!");
            setSeverity("success");
            setSOpen(true);
            handleEditClose();
        } catch (err) {
            console.log(err);
            setMessage("Failed to update end date");
            setSeverity("error");
            setSOpen(true);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.patch(`task/tasks/${id}/`, { status: newStatus });
            fetchEmployeesTask();
            setMessage(`Task marked as ${newStatus.replace('_', ' ')}!`);
            setSeverity("success");
            setSOpen(true);
        } catch (err) {
            console.log(err);
            setMessage("Failed to update status");
            setSeverity("error");
            setSOpen(true);
        }
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
                                <TableCell sx={{ color: "#475569", fontWeight: 700, fontSize: "12px", textTransform: "uppercase" }}>Task Title</TableCell>
                                <TableCell sx={{ color: "#475569", fontWeight: 700, fontSize: "12px", textTransform: "uppercase" }}>Assigned Employee</TableCell>
                                <TableCell sx={{ color: "#475569", fontWeight: 700, fontSize: "12px", textTransform: "uppercase" }}>Priority</TableCell>
                                <TableCell sx={{ color: "#475569", fontWeight: 700, fontSize: "12px", textTransform: "uppercase" }}>Start Date</TableCell>
                                <TableCell sx={{ color: "#475569", fontWeight: 700, fontSize: "12px", textTransform: "uppercase" }}>End Date</TableCell>
                                <TableCell sx={{ color: "#475569", fontWeight: 700, fontSize: "12px", textTransform: "uppercase" }}>Status</TableCell>
                                <TableCell align="center" sx={{ color: "#475569", fontWeight: 700, fontSize: "12px", textTransform: "uppercase" }}>Action</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {!isMobile ?
                                selectedEmployee.map((row) => (
                                    <TableRow key={row.id} sx={{ "&:hover": { background: "#f8fafc" }, transition: "0.2s" }}>
                                        <TableCell>
                                            <Typography sx={{ fontWeight: 600, color: "#1e293b" }}>
                                                {row.title || "-"}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <Avatar sx={{ width: 32, height: 32, fontSize: "12px", bgcolor: "#e0e7ff", color: "#4338ca", fontWeight: 700 }}>
                                                    {(row.assigned_to_details?.username || "U").charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Typography sx={{ fontWeight: 600, color: "#1e293b" }}>
                                                    {row.assigned_to_details?.username || "Unknown"}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>{row.priority || "-"}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>{row.start_date ? row.start_date.split('T')[0] : "-"}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>{row.end_date ? row.end_date.split('T')[0] : "-"}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={row.status || "PENDING"}
                                                sx={{
                                                    bgcolor: (!row.status || row.status === 'PENDING') ? '#e0e0e0' :
                                                        row.status === 'IN_PROGRESS' ? '#90caf9' :
                                                            row.status === 'COMPLETED' ? '#a5d6a7' : '#e0e0e0',
                                                    color: '#000',
                                                    fontWeight: 'bold',
                                                    fontSize: '11px'
                                                }}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                                                {(!row.status || row.status === 'PENDING') && (
                                                    <Button size="small" variant="contained" sx={{ textTransform: 'none' }} onClick={() => handleStatusUpdate(row.id, 'IN_PROGRESS')}>Start Task</Button>
                                                )}
                                                {row.status === 'IN_PROGRESS' && (
                                                    <>
                                                        <Button size="small" variant="contained" color="success" sx={{ textTransform: 'none' }} onClick={() => handleStatusUpdate(row.id, 'COMPLETED')}>Complete</Button>
                                                        <Button size="small" variant="outlined" sx={{ textTransform: 'none' }} onClick={() => handleEditClick(row)}>Edit</Button>
                                                    </>
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )) :
                                selectedEmployee.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell colSpan={7} sx={{ p: 1, borderBottom: "none" }}>
                                            <Box
                                                sx={{
                                                    background: "#ffffff",
                                                    borderRadius: "16px",
                                                    padding: "16px",
                                                    border: "1px solid #e2e8f0",
                                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 1.5
                                                }}
                                            >
                                                <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "16px" }}>
                                                    {row.title}
                                                </Typography>
                                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                        <Avatar sx={{ bgcolor: "#e0e7ff", color: "#4338ca", fontWeight: 700 }}>
                                                            {(row.assigned_to_details?.username || "U").charAt(0).toUpperCase()}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography sx={{ fontWeight: 700, color: "#1e293b" }}>
                                                                {row.assigned_to_details?.username || "Unknown"}
                                                            </Typography>
                                                            <Typography sx={{ fontSize: "12px", color: "#64748b" }}>
                                                                Priority: {row.priority}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Chip label={row.status || "PENDING"}
                                                        sx={{
                                                            bgcolor: (!row.status || row.status === 'PENDING') ? '#e0e0e0' :
                                                                row.status === 'IN_PROGRESS' ? '#90caf9' :
                                                                    row.status === 'COMPLETED' ? '#a5d6a7' : '#e0e0e0',
                                                            color: '#000',
                                                            fontWeight: 'bold',
                                                            fontSize: '11px'
                                                        }}
                                                        size="small"
                                                    />
                                                </Box>

                                                <Box sx={{ display: "flex", gap: 2, pt: 1, borderTop: "1px solid #f1f5f9" }}>
                                                    <Box sx={{ flex: 1, textAlign: "center" }}>
                                                        <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Start</Typography>
                                                        <Typography sx={{ fontSize: "14px", fontWeight: 800, color: "#1e293b" }}>{row.start_date ? row.start_date.split('T')[0] : "-"}</Typography>
                                                    </Box>
                                                    <Box sx={{ width: "1px", bgcolor: "#f1f5f9" }} />
                                                    <Box sx={{ flex: 1, textAlign: "center" }}>
                                                        <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>End</Typography>
                                                        <Typography sx={{ fontSize: "14px", fontWeight: 800, color: "#1e293b" }}>{row.end_date ? row.end_date.split('T')[0] : "-"}</Typography>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ display: "flex", gap: 1, justifyContent: "center", mt: 1 }}>
                                                    {(!row.status || row.status === 'PENDING') && (
                                                        <Button size="small" variant="contained" sx={{ textTransform: 'none', width: '100%' }} onClick={() => handleStatusUpdate(row.id, 'IN_PROGRESS')}>Start Task</Button>
                                                    )}
                                                    {row.status === 'IN_PROGRESS' && (
                                                        <>
                                                            <Button size="small" variant="contained" color="success" sx={{ textTransform: 'none', flex: 1 }} onClick={() => handleStatusUpdate(row.id, 'COMPLETED')}>Complete</Button>
                                                            <Button size="small" variant="outlined" sx={{ textTransform: 'none', flex: 1 }} onClick={() => handleEditClick(row)}>Edit</Button>
                                                        </>
                                                    )}
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
                            <TextField label="Task Title" fullWidth required value={title} onChange={(e) => setTitle(e.target.value)} error={!!errors.title} helperText={errors.title} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Start Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                required
                                inputProps={{ min: today }}
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                error={!!errors.startDate}
                                helperText={errors.startDate}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="End Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                required
                                inputProps={{ min: today }}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                error={!!errors.endDate}
                                helperText={errors.endDate}
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

            {/* Edit End Date Dialog */}
            <Dialog
                open={editOpen}
                onClose={handleEditClose}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: { borderRadius: "16px" }
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: "#1e293b" }}>
                    Edit End Date
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="New End Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        required
                        inputProps={{ min: today }}
                        value={newEndDate}
                        onChange={(e) => setNewEndDate(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleEditClose} sx={{ textTransform: "none", color: "#64748b" }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleEditSubmit}
                        sx={{ textTransform: "none", bgcolor: "#0d47a1" }}
                    >
                        Save
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
