import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, IconButton, Snackbar } from '@mui/material';
import React, { useState, useEffect } from 'react';
import api from '../../services/service';
import CodeIcon from "@mui/icons-material/Code";
import StorageIcon from "@mui/icons-material/Storage";
import AndroidIcon from "@mui/icons-material/Android";
import BrushIcon from "@mui/icons-material/Brush";
import CampaignIcon from "@mui/icons-material/Campaign";
import EditIcon from "@mui/icons-material/Edit";
import MuiAlert from "@mui/material/Alert";

function AddRole(){

    const [open, setOpen] = useState(false);
    const [selectedDesignation, setSelectedDesignation] = useState(null);
    const [employeesOpen, setEmployeesOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [designationsLoading, setDesignationsLoading] = useState(true);
    const [designations, setDesignations] = useState([]);
    const [designationCounts, setDesignationCounts] = useState({});
    const [newDesignationName, setNewDesignationName] = useState("");
    const [editingDesignation, setEditingDesignation] = useState(null);
    const [editingName, setEditingName] = useState("");
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");
    const [snackSeverity, setSnackSeverity] = useState("success");
    
    const handleClose = () => {
        setOpen(false);
        setNewDesignationName("");
        setEditingDesignation(null);
        setEditingName("");
    };
    
    const handleEmployeesClose = () => {
        setEmployeesOpen(false);
        setSelectedDesignation(null);
        setEmployees([]);
    };

    const handleSnackClose = () => setSnackOpen(false);

    const showSnack = (message, severity = "success") => {
        setSnackMessage(message);
        setSnackSeverity(severity);
        setSnackOpen(true);
    };

    // Icon and color mapping for designations
    const designationConfig = {
        "MERN Stack": { icon: <CodeIcon />, color: "#90caf9" },
        "Backend Development": { icon: <StorageIcon />, color: "#ce93d8" },
        "Digital Marketing": { icon: <CampaignIcon />, color: "#ffcc80" },
        "Android Development": { icon: <AndroidIcon />, color: "#81c784" },
        "Graphic Designing": { icon: <BrushIcon />, color: "#f48fb1" },
    };

    useEffect(() => {
        fetchDesignationsFromEmployees();
    }, []);

    const fetchDesignationsFromEmployees = async () => {
        setDesignationsLoading(true);
        try {
            const response = await api.get('/accounts/manager/approved-users/');
            const approvedEmployees = response.data;
            
            // Get unique designations from employees
            const uniqueDesignations = [...new Set(approvedEmployees.map(emp => emp.designation))].filter(d => d && d.trim());
            
            // Count employees by designation
            const counts = {};
            uniqueDesignations.forEach(designation => {
                const count = approvedEmployees.filter(emp => emp.designation === designation).length;
                counts[designation] = count;
            });
            
            // Create designation objects with config data
            const designationList = uniqueDesignations.map(designation => ({
                name: designation,
                icon: designationConfig[designation]?.icon || <CodeIcon />,
                color: designationConfig[designation]?.color || "#90caf9",
            }));
            
            setDesignations(designationList);
            setDesignationCounts(counts);
        } catch (error) {
            console.error('Error fetching designations:', error);
            setDesignations([]);
        } finally {
            setDesignationsLoading(false);
        }
    };

    const fetchEmployeesByDesignation = async (designationName) => {
        setLoading(true);
        try {
            const response = await api.get('/accounts/manager/approved-users/');
            const filteredEmployees = response.data.filter(emp => emp.designation === designationName);
            setEmployees(filteredEmployees);
            setSelectedDesignation(designationName);
            setEmployeesOpen(true);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setEmployees([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDesignationClick = (designationName) => {
        fetchEmployeesByDesignation(designationName);
    };

    const handleSaveDesignation = () => {
        if (editingDesignation) {
            // Update existing designation
            if (!editingName.trim()) {
                showSnack("Designation name cannot be empty", "error");
                return;
            }
            setDesignations(prev => prev.map(d => 
                d.name === editingDesignation 
                    ? { ...d, name: editingName.trim() }
                    : d
            ));
            
            // Update counts
            const oldCount = designationCounts[editingDesignation];
            if (oldCount !== undefined) {
                setDesignationCounts(prev => {
                    const updated = { ...prev };
                    delete updated[editingDesignation];
                    updated[editingName.trim()] = oldCount;
                    return updated;
                });
            }
            
            showSnack("Designation updated successfully");
            handleClose();
        } else {
            // Add new designation
            if (!newDesignationName.trim()) {
                showSnack("Designation name cannot be empty", "error");
                return;
            }
            
            const nameToAdd = newDesignationName.trim();
            
            // Check if designation already exists
            if (designations.some(d => d.name === nameToAdd)) {
                showSnack("This designation already exists", "error");
                return;
            }
            
            const newDesignation = {
                name: nameToAdd,
                icon: designationConfig[nameToAdd]?.icon || <CodeIcon />,
                color: designationConfig[nameToAdd]?.color || "#90caf9",
            };
            
            setDesignations(prev => [...prev, newDesignation]);
            setDesignationCounts(prev => ({ ...prev, [nameToAdd]: 0 }));
            
            showSnack("New designation added successfully");
            handleClose();
        }
    };

    const handleEditDesignation = (designation) => {
        setEditingDesignation(designation.name);
        setEditingName(designation.name);
        setOpen(true);
    };
 

    return (
        <div>
            <Typography variant='h5' component='p' sx={{
                fontFamily : "work sans",
                fontWeight : "600",
                color : "#080808"
            }}> Techbrain Designation List </Typography>
            <Box sx={{ display : "flex", justifyContent : "flex-end", margin : "auto", width : "100%"}}>
                <Button onClick={() => setOpen(true)} sx={{ textTransform : "none", background : "#00838f", color : "whitesmoke"}}> + Add Designation </Button>
            </Box>
            <div style={{ marginTop : "10px" }}>
                {designationsLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" }}>
                        <CircularProgress />
                    </Box>
                ) : designations.length === 0 ? (
                    <Typography sx={{ textAlign: "center", padding: "30px", color: "gray" }}>
                        No designations found. Add employees first.
                    </Typography>
                ) : (
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
                    {designations.map((designation, index) => (
                        <Box 
                            key={index} 
                            onClick={() => handleDesignationClick(designation.name)}
                            sx={{ background: "#1e1e1e", padding: "20px",
                            borderRadius: "14px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "14px",
                            transition: "0.2s ease",
                            position: "relative",
                            cursor: "pointer",
                            "&:hover": { 
                                transform: "translateY(-5px)",
                                boxShadow: "0 6px 16px rgba(0,0,0,0.6)"
                            },
                        }}>
                            <IconButton 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditDesignation(designation);
                                }}
                                sx={{ position: "absolute", top: 10, right: 10, color: "#90caf9", background: "rgba(0,0,0,0.3)" }}
                                size="small"
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                            
                            <Box sx={{ width: 48, height: 48, borderRadius: "10px", backgroundColor: designation.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#000",}}>
                                {designation.icon ? designation.icon : <CodeIcon />} 
                            </Box>
                            <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "whitesmoke",}} >
                                {designation.name}
                            </Typography>
                            <Typography sx={{ opacity: 0.7, color : "gray" }}>
                                {designationCounts[designation.name] || 0} Employees
                            </Typography>
                        </Box>
                    ))}
                    </Box>
                )}
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
                >
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {editingDesignation ? "Edit Designation" : "Add New Designation"}
                </DialogTitle>

                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item size={{xs: 12, sm: 12, md: 12}}>
                            <TextField 
                                label="Designation Name" 
                                fullWidth 
                                required
                                value={editingDesignation ? editingName : newDesignationName}
                                onChange={(e) => editingDesignation ? setEditingName(e.target.value) : setNewDesignationName(e.target.value)}
                                placeholder="e.g., Full Stack Developer"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ padding: "16px" }}>
                    <Button onClick={handleClose} color="inherit">
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={handleSaveDesignation}
                        sx={{ textTransform: "none", fontWeight: 600 }}
                    >
                        {editingDesignation ? "Update Designation" : "Save Designation"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Employees List Dialog */}
            <Dialog
                open={employeesOpen}
                onClose={handleEmployeesClose}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle sx={{ fontWeight: 600 }}>
                    Employees - {selectedDesignation}
                </DialogTitle>

                <DialogContent dividers>
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" }}>
                            <CircularProgress />
                        </Box>
                    ) : employees.length > 0 ? (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Mobile</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {employees.map((emp, index) => (
                                        <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                                            <TableCell>{emp.first_name && emp.last_name ? `${emp.first_name} ${emp.last_name}` : emp.username}</TableCell>
                                            <TableCell>{emp.email}</TableCell>
                                            <TableCell>{emp.department || "N/A"}</TableCell>
                                            <TableCell>{emp.mobile_number || "N/A"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography sx={{ textAlign: "center", padding: "30px", color: "gray" }}>
                            No employees found for this designation.
                        </Typography>
                    )}
                </DialogContent>

                <DialogActions sx={{ padding: "16px" }}>
                    <Button onClick={handleEmployeesClose} color="inherit">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackOpen}
                autoHideDuration={3000}
                onClose={handleSnackClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleSnackClose}
                    severity={snackSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    )
}

export default AddRole
