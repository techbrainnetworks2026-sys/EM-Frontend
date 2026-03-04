import React, { useEffect, useState } from 'react';
import CampaignIcon from "@mui/icons-material/Campaign";
import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Snackbar, TextField, Typography } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import StorageIcon from "@mui/icons-material/Storage";
import AndroidIcon from "@mui/icons-material/Android";
import BrushIcon from "@mui/icons-material/Brush";
import axios from 'axios';
import MuiAlert from "@mui/material/Alert";
import api from '../../services/service.js';


const Announcement = () => {

    const [open, setOpen] = useState(false);

    const handleClose = () => setOpen(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [announcements, setAnnouncements] = useState([]);
    const [sopen, setSOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    const fetchAnnouncements = async () => {
        try {
            const res = await api.get("announcement/announcements/");
            setAnnouncements(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAnnouncements();

    }, []);

    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", }).format(new Date(dateString));
    };

    const handleUploadAnnouncement = async () => {
        try {
            const res = await api.post("announcement/announcements/", { title, content });
            setOpen(false);
            setSOpen(true);
            setMessage("Announcement Published!")
            setSeverity('success');
            await fetchAnnouncements();
        } catch (err) {
            console.log(err);
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
                display: "flex",
                alignItems: "center",
                columnGap: "12px",
                color: "#1e293b",
                mb: 1
            }}> <CampaignIcon fontSize='medium' sx={{ color: "#3b82f6" }} /> Announcements </Typography>
            <Typography sx={{ color: "#64748b", mb: 3, fontSize: "14px" }}>
                Broadcast important updates and news to the entire organization.
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
                    + New Announcement
                </Button>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {announcements.length > 0 ? (
                    announcements.map((item, index) => {
                        const announcementColor = index % 2 === 0 ? "#3b82f6" : "#10b981";

                        return (
                            <Box key={index} sx={{
                                display: "flex",
                                background: "#ffffff",
                                borderRadius: "16px",
                                overflow: "hidden",
                                border: "1px solid #e2e8f0",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                }
                            }}>

                                <Box sx={{ width: "6px", backgroundColor: announcementColor }} />

                                <Box sx={{ p: 2.5, flex: 1 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                                        <Typography sx={{ fontSize: "18px", fontWeight: 700, color: "#1e293b" }}>
                                            {item.title}
                                        </Typography>
                                        <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
                                            {formatDate(item.created_at)}
                                        </Typography>
                                    </Box>

                                    <Typography sx={{ color: "#475569", mb: 2, lineHeight: 1.6 }}>
                                        {item.content}
                                    </Typography>

                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 1.5, borderTop: "1px solid #f1f5f9" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Avatar sx={{ width: 24, height: 24, bgcolor: "#f1f5f9", color: "#475569", fontSize: "10px", fontWeight: 700 }}>M</Avatar>
                                            <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#64748b" }}>
                                                Management Team
                                            </Typography>
                                        </Box>
                                        <Chip label="Published" size="small" variant="outlined" sx={{ height: "20px", fontSize: "10px", fontWeight: 700, color: "#64748b" }} />
                                    </Box>
                                </Box>
                            </Box>
                        )
                    })
                ) : (
                    <Box sx={{ py: 8, textAlign: "center", bgcolor: "#f8fafc", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
                        <CampaignIcon sx={{ fontSize: "48px", color: "#cbd5e1", mb: 2 }} />
                        <Typography sx={{ color: "#94a3b8", fontWeight: 600 }}>No announcements yet</Typography>
                    </Box>
                )}
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
                    Create Announcement
                </DialogTitle>

                <DialogContent sx={{ px: 3, py: 2 }}>
                    <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Announcement Title"
                                fullWidth
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Upcoming Office Trip, Policy Update..."
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Announcement Details"
                                multiline
                                rows={6}
                                fullWidth
                                required
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Provide clear and concise details for the team..."
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ padding: "16px 24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
                    <Button onClick={handleClose} sx={{ fontWeight: 600, color: "#64748b", textTransform: "none" }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleUploadAnnouncement}
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            background: "#0d47a1",
                            borderRadius: "8px",
                            px: 3,
                            "&:hover": { background: "#1e3a8a" }
                        }}
                    >
                        Publish Announcement
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

export default Announcement

// const announcements = [
//     {
//         title: "Office Holiday",
//         description: "Office will remain closed on Jan 26 due to Republic Day.",
//         date: "Jan 26, 2026",
//     },
//     {
//         title: "New Project Kickoff",
//         description: "MERN Stack project kickoff meeting at 10 AM tomorrow.",
//         date: "Jan 15, 2026",
//     },
//     {
//         title: "Policy Update",
//         description: "Updated work-from-home policy has been released.",
//         date: "Jan 10, 2026",
//     },
// ];
