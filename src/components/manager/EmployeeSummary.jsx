import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { employeesTask } from '../../assets/assets.js';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Snackbar, TextField, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from '../../services/service.js';
import MuiAlert from "@mui/material/Alert";

const EmployeeSummary = () => {

    const {id} = useParams();
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
        try{
            const res = await api.get('task/tasks/');
            const employeeTasks = res.data.filter(
                task => task.assigned_to_details.id === Number(id)
            );
            setSelectedEmployeeSummary(employeeTasks);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        fetchEmployeeSummary();
    }, [id]);

    if (!selectedEmployeeSummary) {
        return <div>Loading...</div> ;
    }

    const inProgressCount = selectedEmployeeSummary.filter(
        (task) => task.status === "PENDING"
    ).length;
    

    const inCompletedCount = selectedEmployeeSummary.filter(
        (task) => task.status === "COMPLETED"
    ).length;
    
    const SummaryCard = ({ title, value, color }) => (
        <Box sx={{ background: "#1e1e1e", borderRadius: "16px", padding: "20px", textAlign: "center", border: `1px solid ${color}30`, }}>
            <Typography sx={{ opacity: 0.7, mb: 0.5, color : "whitesmoke" }}>{title}</Typography>
            <Typography sx={{ fontSize: "26px", fontWeight: 600, color }}>
                {value}
            </Typography>
        </Box>
    );

    const employee = selectedEmployeeSummary[0]?.assigned_to_details;

    const handleAddTask = async(e) => {
        e.preventDefault();
        try{
            const res = await api.post('task/tasks/', {
                title : title,
                description: description,
                assigned_to : id,
                end_date : dueDate,
                priority : priority
            });
            setMessage("Task updated Successfully!");
            setSOpen(true);
            setSeverity("success");

            await fetchEmployeeSummary();
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
                <Typography sx={{ opacity: 0.6, mt: 0.5, color : "#333" }}>
                    Track workload and task progress
                </Typography>
            </Box>
            <div>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4, padding: "16px", borderRadius: "14px", background: "linear-gradient(135deg, #0d47a1, #1e1e1e)", }}>
                    <Avatar sx={{ bgcolor: "#ffffff", color: "#0d47a1", width: 52, height: 52, fontWeight: 600, }}>
                        {employee?.username.charAt(0).toUpperCase()}
                    </Avatar>

                    <Box>
                        <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "white" }}>
                            {employee?.username}
                        </Typography>
                        <Typography sx={{ opacity: 0.8, color: "white" }}>
                            {employee?.designation}
                        </Typography>
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
                    <Box sx={{ display : "flex", justifyContent : "space-between"}}>
                        <Typography sx={{ fontWeight: 600, mb: 2, color: "#333" }}>
                            Assigned Tasks
                        </Typography>

                        <Button variant='contained' onClick={() => setOpen(true)} sx={{ textTransform : "none", background : "#00838f", color : "whitesmoke"}}> + Assign New Task</Button>
                    </Box>

                    {selectedEmployeeSummary.map((task) => (
                        <Box key={task.taskId}
                            sx={{
                                display: "flex",
                                alignItems: "stretch",
                                mb: 2,
                                mt : 2,
                                borderRadius: "16px",
                                overflow: "hidden",
                                background: "#1e1e1e",
                                transition: "0.25s ease",
                                "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
                                },
                        }}>
      
                            <Box sx={{ width: "6px", backgroundColor: task.status === "Completed" ? "#66bb6a" : task.status === "In-Progress" ? "#ffd600" : "#ef5350", }} />

                            <Box sx={{ p: 2, flex: 1 }}>

                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography sx={{ fontWeight: 600, color: "whitesmoke" }}>
                                        {task.title}
                                    </Typography>

                                    <Chip label={task.priority} size="small"
                                        sx={{ 
                                            backgroundColor: task.priority === "High" ? "#ef5350" : task.priority === "Medium" ? "#ffb74d" : "#81c784",
                                            color: "#000",
                                            fontWeight: 600,
                                        }}
                                    />
                                </Box>

                                <Typography sx={{ mt: 0.5, fontSize: "14px", opacity: 0.75, color: "whitesmoke", }} >
                                    {task.description}
                                </Typography>

                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2,}}>
                                    <Chip label={task.status} size="small"
                                        sx={{
                                            backgroundColor: "#333",
                                            color: "#fff",
                                            fontWeight: 500,
                                        }}
                                    />

                                    <Typography sx={{ fontSize: "13px", opacity: 0.6, color: "whitesmoke", }} >
                                        Due · {formatDate(task.end_date)}
                                    </Typography>
                                </Box>

                                <Box sx={{mt : 2}}>
                                    <Typography sx={{ fontWeight: 600, color: "whitesmoke" }}> Comments </Typography>

                                    {/* <Box sx={{ padding : "10px", background : "#333", borderRadius : "5px", mt : 1}}>
                                        {task.comments.length == 0 ? (
                                            <Box sx={{ display : "flex", justifyContent : "center", padding : "5px"}}>
                                                <Typography sx={{ color : "whitesmoke"}}> No Progress Yet </Typography>
                                            </Box>
                                            ):( 
                                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                                {task.comments.map((comment, index) => (
                                                    <Box key={index}
                                                        sx={{
                                                            alignSelf: comment.author === "employee" ? "flex-end" : "flex-start",
                                                            background: comment.author === "employee" ? "#424242" : "#0d47a1",
                                                            padding: "8px 12px",
                                                            borderRadius: "8px",
                                                            maxWidth: "80%",
                                                        }}
                                                    >
                                                        <Typography sx={{ fontSize: "14px", color: "whitesmoke" }}>
                                                            {comment.description}
                                                        </Typography>

                                                        <Typography sx={{ fontSize: "11px", opacity: 0.6, color : "whitesmoke" }}>
                                                            {comment.postedOn}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        )}
                                    </Box> */}

                                    {task.status == 'PENDING' && <Box sx={{mt : 2}}>
                                        <Typography sx={{ color : "whitesmoke"}}> Write Your Thoughts ! </Typography>
                                        <Box sx={{ display : "flex", justifyContent : "space-between",alignItems : "flex-end", mt : 1, padding : "10px"}}>
                                            <TextField multiline rows={1} placeholder="Write your feedback..." sx={{ width : "50%",
                                                "& .MuiInputBase-input": {
                                                    color: "white",
                                                },
                                                "& .MuiInputBase-input::placeholder": {
                                                    color: "rgba(255,255,255,0.7)",
                                                    opacity: 1,
                                                },
                                                "& .MuiOutlinedInput-root": {
                                                    "& fieldset": {
                                                        borderColor: "white",
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: "white",
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "white",
                                                    },
                                                },
                                            }} />
                                            <Button variant='contained' sx={{ width : "100px", height : "30px"}}> Post </Button>
                                        </Box>
                                    </Box>}
                                </Box>
                                
                                {task.status == 'PENDING' && <Box sx={{ mt : 2, display : "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Typography sx={{ color : "whitesmoke" }}> Actions : Change Status to</Typography>
                                    <Button variant='outlined' color="success"> Completed </Button>
                                </Box>}
                            </Box>
                        </Box>
                    ))}
                </Box>

            </div>

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

export default EmployeeSummary
