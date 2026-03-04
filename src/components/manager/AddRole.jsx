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

function AddRole() {

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
                fontFamily: "work sans",
                fontWeight: "700",
                color: "#1e293b",
                mb: 1
            }}> Designation Registry </Typography>
            <Typography sx={{ color: "#64748b", mb: 3, fontSize: "14px" }}>
                Manage team roles and monitor personnel distribution across departments.
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                <Button
                    onClick={() => setOpen(true)}
                    variant="contained"
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
                    + Add New Designation
                </Button>
            </Box>
            <div style={{ marginTop: "10px" }}>
                {designationsLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" }}>
                        <CircularProgress />
                    </Box>
                ) : designations.length === 0 ? (
                    <Typography sx={{ textAlign: "center", padding: "30px", color: "gray" }}>
                        No designations found. Add employees first.
                    </Typography>
                ) : (
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 3.5 }}>
                        {designations.map((designation, index) => (
                            <Box
                                key={index}
                                onClick={() => handleDesignationClick(designation.name)}
                                sx={{
                                    background: "#ffffff",
                                    p: 3,
                                    borderRadius: "18px",
                                    border: "1px solid #e2e8f0",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    position: "relative",
                                    cursor: "pointer",
                                    "&:hover": {
                                        transform: "translateY(-6px)",
                                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
                                        borderColor: "#3b82f6"
                                    },
                                }}>
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditDesignation(designation);
                                    }}
                                    sx={{
                                        position: "absolute",
                                        top: 12,
                                        right: 12,
                                        color: "#64748b",
                                        bgcolor: "#f1f5f9",
                                        "&:hover": { bgcolor: "#e0e7ff", color: "#3b82f6" }
                                    }}
                                    size="small"
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>

                                <Box sx={{
                                    width: 54,
                                    height: 54,
                                    borderRadius: "14px",
                                    backgroundColor: designation.color + "20",
                                    color: designation.color,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    {React.cloneElement(designation.icon || <CodeIcon />, { fontSize: "large" })}
                                </Box>

                                <Box>
                                    <Typography sx={{ fontSize: "19px", fontWeight: 800, color: "#1e293b", mb: 0.5 }} >
                                        {designation.name}
                                    </Typography>
                                    <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "#64748b", display: "flex", alignItems: "center", gap: 1 }}>
                                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#10b981" }} />
                                        {designationCounts[designation.name] || 0} Team Members
                                    </Typography>
                                </Box>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        mt: 1,
                                        textTransform: "none",
                                        fontWeight: 700,
                                        borderRadius: "8px",
                                        borderColor: "#e2e8f0",
                                        color: "#475569",
                                        "&:hover": { bgcolor: "#f8fafc", borderColor: "#cbd5e1" }
                                    }}
                                >
                                    View Members
                                </Button>
                            </Box>
                        ))}
                    </Box>
                )}
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
                    {editingDesignation ? "Modify Designation" : "New Designation"}
                </DialogTitle>

                <DialogContent sx={{ px: 3, py: 2 }}>
                    <Box sx={{ mt: 1 }}>
                        <TextField
                            label="Designation Title"
                            fullWidth
                            required
                            value={editingDesignation ? editingName : newDesignationName}
                            onChange={(e) => editingDesignation ? setEditingName(e.target.value) : setNewDesignationName(e.target.value)}
                            placeholder="e.g., Full Stack Developer, Marketing Lead..."
                        />
                        <Typography variant="caption" sx={{ color: "#94a3b8", mt: 1, display: "block" }}>
                            Enter a descriptive name for the role. This will be visible across the employee directory.
                        </Typography>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ padding: "16px 24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
                    <Button onClick={handleClose} sx={{ fontWeight: 600, color: "#64748b", textTransform: "none" }}>
                        Discard
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveDesignation}
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            background: "#0d47a1",
                            borderRadius: "8px",
                            px: 3,
                            "&:hover": { background: "#1e3a8a" }
                        }}
                    >
                        {editingDesignation ? "Update Designation" : "Create Designation"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Employees List Dialog */}
            <Dialog
                open={employeesOpen}
                onClose={handleEmployeesClose}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    sx: { borderRadius: "16px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: "#1e293b", pt: 3, px: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ width: 32, height: 32, borderRadius: "8px", bgcolor: "#e0e7ff", color: "#4338ca", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <CodeIcon fontSize="small" />
                        </Box>
                        {selectedDesignation} Team
                    </Box>
                    <Typography variant="caption" sx={{ bgcolor: "#f1f5f9", color: "#64748b", px: 1.5, py: 0.5, borderRadius: "20px", fontWeight: 700 }}>
                        {employees.length} Members
                    </Typography>
                </DialogTitle>

                <DialogContent sx={{ px: 3, py: 2 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search team member by name or email..."
                        sx={{ mb: 3 }}
                        onChange={(e) => {
                            const query = e.target.value.toLowerCase();
                            // Client side filtering for better UX in dialog
                            const rows = document.querySelectorAll('.employee-row');
                            rows.forEach(row => {
                                const text = row.textContent.toLowerCase();
                                row.style.display = text.includes(query) ? '' : 'none';
                            });
                        }}
                    />

                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
                            <CircularProgress size={32} thickness={5} />
                        </Box>
                    ) : employees.length > 0 ? (
                        <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
                            <Table>
                                <TableHead sx={{ bgcolor: "#f8fafc" }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>Member</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>Email Address</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>Department</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>Contact</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {employees.map((emp, index) => (
                                        <TableRow key={index} className="employee-row" sx={{ "&:hover": { bgcolor: "#f8fafc" } }}>
                                            <TableCell>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                    <Avatar sx={{ width: 32, height: 32, fontSize: "12px", bgcolor: "#e0e7ff", color: "#4338ca", fontWeight: 700 }}>
                                                        {(emp.first_name || emp.username || "U").charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Typography sx={{ fontWeight: 600, color: "#1e293b" }}>
                                                        {emp.first_name && emp.last_name ? `${emp.first_name} ${emp.last_name}` : (emp.username || "Unknown")}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ color: "#64748b" }}>{emp.email}</TableCell>
                                            <TableCell>
                                                <Chip label={emp.department || "Design"} size="small" sx={{ bgcolor: "#f1f5f9", color: "#475569", fontWeight: 600, fontSize: "11px" }} />
                                            </TableCell>
                                            <TableCell sx={{ color: "#64748b", fontWeight: 500 }}>{emp.mobile_number || "---"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Box sx={{ py: 8, textAlign: "center", bgcolor: "#f8fafc", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
                            <Typography sx={{ color: "#94a3b8", fontWeight: 600 }}>No members found in this category</Typography>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ padding: "16px 24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
                    <Button onClick={handleEmployeesClose} sx={{ fontWeight: 700, color: "#0d47a1", textTransform: "none" }}>
                        Close Directory
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
