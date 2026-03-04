import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Snackbar, TextField, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from '../../services/service.js';
import MuiAlert from "@mui/material/Alert";

const EmployeeSummary = () => {

    const { id } = useParams();
    const [selectedEmployeeSummary, setSelectedEmployeeSummary] = useState([]);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("");
    const [sopen, setSOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");


    const handleClose = () => setOpen(false);

    const fetchEmployeeSummary = async () => {
        try {
            const res = await api.get('task/tasks/');
            const employeeTasks = res.data.filter(
                task => task.assigned_to_details?.id === Number(id)
            );
            setSelectedEmployeeSummary(employeeTasks);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchEmployeeSummary();
    }, [id]);

    if (!selectedEmployeeSummary) {
        return <div>Loading...</div>;
    }

    const inProgressCount = selectedEmployeeSummary.filter(
        (task) => task.status === "PENDING"
    ).length;


    const inCompletedCount = selectedEmployeeSummary.filter(
        (task) => task.status === "COMPLETED"
    ).length;

    const SummaryCard = ({ title, value, color }) => (
        <Box sx={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "24px",
            textAlign: "center",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            position: "relative",
            overflow: "hidden"
        }}>
            <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", bgcolor: color }} />
            <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", mb: 1 }}>{title}</Typography>
            <Typography sx={{ fontSize: "32px", fontWeight: 800, color: "#1e293b" }}>
                {value}
            </Typography>
        </Box>
    );

    const employee = selectedEmployeeSummary[0]?.assigned_to_details;

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('task/tasks/', {
                title: title,
                description: description,
                assigned_to: id,
                start_date: dueDate,
                priority: priority
            });
            setMessage("Task assigned successfully!");
            setSOpen(true);
            setSeverity("success");

            await fetchEmployeeSummary();
            setOpen(false); // Close dialog
        } catch (err) {
            console.log(err);
            setMessage(err.response?.data?.message || "Failed to add task");
            setSOpen(true);
            setSeverity("error");
        }
    }

    const handleCompleteTask = async (taskId) => {
        try {
            await api.patch(`task/tasks/${taskId}/`, { status: 'COMPLETED' });
            setMessage("Task marked as completed!");
            setSOpen(true);
            setSeverity("success");
            await fetchEmployeeSummary();
        } catch (err) {
            console.log(err);
            alert("Failed to update task status");
        }
    }

    const handleSClose = (event, reason) => {
        if (reason === "clickaway") return;
        setSOpen(false);
    };

    const groupedTasks = {
        Pending: selectedEmployeeSummary.filter(t => t.status === "PENDING"),
        InProgress: selectedEmployeeSummary.filter(t => t.status === "IN_PROGRESS"),
        Completed: selectedEmployeeSummary.filter(t => t.status === "COMPLETED"),
    };

    const today = new Date().toISOString().slice(0, 10);
    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", }).format(new Date(dateString));
    };


    return (
        <div>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontFamily: "work sans", fontWeight: 600 }}>
                    Employee Task Overview
                </Typography>
                <Typography sx={{ opacity: 0.6, mt: 0.5, color: "#333" }}>
                    Track workload and task progress
                </Typography>
            </Box>
            <div>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    mb: 4,
                    padding: "24px",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #0d47a1 0%, #1e3a8a 100%)",
                    boxShadow: "0 10px 15px -3px rgba(13, 71, 161, 0.2)"
                }}>
                    <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", width: 64, height: 64, fontWeight: 700, fontSize: "24px", border: "3px solid rgba(255,255,255,0.1)" }}>
                        {(employee?.username || "U").charAt(0).toUpperCase()}
                    </Avatar>

                    <Box>
                        <Typography sx={{ fontSize: "22px", fontWeight: 800, color: "white" }}>
                            {employee?.username || "Employee"}
                        </Typography>
                        <Chip
                            label={employee?.designation || "Team Member"}
                            size="small"
                            sx={{ mt: 0.5, bgcolor: "rgba(255,255,255,0.15)", color: "white", fontWeight: 600, border: "1px solid rgba(255,255,255,0.1)" }}
                        />
                    </Box>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={4}>
                        <SummaryCard title="Total Tasks" value={selectedEmployeeSummary?.length || 0} color="#90caf9" />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <SummaryCard title="In Progress" value={inProgressCount} color="#ffd600" />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <SummaryCard title="Completed" value={inCompletedCount} color="#66bb6a" />
                    </Grid>
                </Grid>


                <Box sx={{ mt: 4 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "20px" }}>
                            Assigned Tasks
                        </Typography>

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
                            + Assign Task
                        </Button>
                    </Box>

                    {selectedEmployeeSummary.map((task) => (
                        <Box key={task.id}
                            sx={{
                                display: "flex",
                                alignItems: "stretch",
                                mb: 2,
                                borderRadius: "16px",
                                overflow: "hidden",
                                background: "#ffffff",
                                border: "1px solid #e2e8f0",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 12px 20px -5px rgba(0,0,0,0.1)",
                                    borderColor: task.priority === "HIGH" ? "#fecaca" : "#e2e8f0"
                                },
                            }}>

                            <Box sx={{ width: "6px", backgroundColor: task.status === "COMPLETED" ? "#10b981" : task.priority === "HIGH" ? "#ef4444" : "#f59e0b", }} />

                            <Box sx={{ p: 2.5, flex: 1 }}>

                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                                    <Box>
                                        <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "16px" }}>
                                            {task.title}
                                        </Typography>
                                        <Typography sx={{ mt: 0.5, fontSize: "14px", color: "#64748b", lineHeight: 1.5 }} >
                                            {task.description}
                                        </Typography>
                                    </Box>

                                    <Chip label={task.priority} size="small"
                                        sx={{
                                            backgroundColor: task.priority === "HIGH" ? "#fee2e2" : task.priority === "MEDIUM" ? "#fef3c7" : "#f0fdf4",
                                            color: task.priority === "HIGH" ? "#ef4444" : task.priority === "MEDIUM" ? "#92400e" : "#16a34a",
                                            fontWeight: 800,
                                            fontSize: "10px",
                                            border: "1px solid currentColor"
                                        }}
                                    />
                                </Box>

                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, pt: 2, borderTop: "1px solid #f1f5f9" }}>
                                    <Box sx={{ display: "flex", gap: 2 }}>
                                        <Chip label={task.status} size="small"
                                            sx={{
                                                backgroundColor: task.status === "COMPLETED" ? "#ecfdf5" : "#f1f5f9",
                                                color: task.status === "COMPLETED" ? "#10b981" : "#475569",
                                                fontWeight: 700,
                                                fontSize: "11px"
                                            }}
                                        />
                                        <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#94a3b8", display: "flex", alignItems: "center" }} >
                                            {task.status === "COMPLETED" ? `Completed` : `Due · ${formatDate(task.start_date)}`}
                                        </Typography>
                                    </Box>

                                    {task.status === 'PENDING' && (
                                        <Button
                                            size="small"
                                            variant='outlined'
                                            color="success"
                                            onClick={() => handleCompleteTask(task.id)}
                                            sx={{
                                                textTransform: "none",
                                                fontWeight: 700,
                                                borderRadius: "8px",
                                                fontSize: "13px"
                                            }}
                                        >
                                            Mark Completed
                                        </Button>
                                    )}
                                </Box>

                                {task.status === 'PENDING' && (
                                    <Box sx={{ mt: 2.5, p: 2, bgcolor: "#f8fafc", borderRadius: "12px" }}>
                                        <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", mb: 1 }}>
                                            Quick Feedback
                                        </Typography>
                                        <Box sx={{ display: "flex", gap: 1.5 }}>
                                            <TextField
                                                size="small"
                                                placeholder="Write your feedback..."
                                                variant="outlined"
                                                sx={{
                                                    flex: 1,
                                                    "& .MuiOutlinedInput-root": { backgroundColor: "white", borderRadius: "8px" }
                                                }}
                                            />
                                            <Button
                                                variant='contained'
                                                size="small"
                                                sx={{
                                                    minWidth: "80px",
                                                    borderRadius: "8px",
                                                    background: "#1e293b",
                                                    textTransform: "none",
                                                    fontWeight: 600
                                                }}
                                            >
                                                Post
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    ))}
                </Box>

            </div>

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
                        Assign to {employee?.username}
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

export default EmployeeSummary
