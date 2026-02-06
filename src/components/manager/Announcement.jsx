import React, { useEffect, useState } from 'react';
import CampaignIcon from "@mui/icons-material/Campaign";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, Grid, TextField, DialogActions, Divider, Snackbar } from "@mui/material";
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
        try{
            const res = await axios.get("https://tn-em-backend.onrender.com/api/announcement/announcements/");
            setAnnouncements(res.data);
        }catch(err){
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
        try{
            const res = await api.post("announcement/announcements/",{title, content});
            setOpen(false);
            setSOpen(true);
            setMessage("Announcement Published!")
            setSeverity('success');
            await fetchAnnouncements();
        }catch(err){
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
                fontFamily : "work sans",
                fontWeight : "600",
                display : "flex",
                alignItems : "center",
                columnGap : "5px",
                color : "#080808"
            }}> <CampaignIcon fontSize='large' sx={{ color : "#1e88e5"}} /> Techbrain Announcements </Typography>
            <Box sx={{ display : "flex", justifyContent : "flex-end", margin : "auto", width : "100%"}}>
                <Button onClick={() => setOpen(true)} sx={{ textTransform : "none", background : "#00838f", color : "whitesmoke"}}> Add Announcement </Button>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", marginTop : "15px" }}>
                {announcements.map((item, index) => {
                    const announcementColor = index % 2 === 0 ? "#ff7043" : "#66bb6a";

                    return (
                        <Box key={index} sx={{
                            display: "flex",
                            background: "#1e1e1e",
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                        }}>
                            
                            <Box sx={{ width: "6px", backgroundColor: announcementColor }} />
                            
                            <Box sx={{ padding: "16px", flex: 1 }}>
                                <Typography sx={{ fontSize: "18px", fontWeight: 600, mb: 0.5, color : announcementColor }}>
                                    {item.title}
                                </Typography>

                                <Typography sx={{ opacity: 0.8, mb: 1, color : "whitesmoke" }}>
                                    {item.content}
                                </Typography>

                                <Divider sx={{ my: 1, opacity: 0.2, color : "whitesmoke" }} />

                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center",}}>
                                    <Typography sx={{ fontSize: "13px", opacity: 0.6, color : "whitesmoke" }}>
                                        {formatDate(item.created_at)} • Management
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    ) 
                })}
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
                >
                <DialogTitle sx={{ fontWeight: 600 }}>
                    Add Techbrain Public Announcement
                </DialogTitle>

                <DialogContent dividers>
                    <Grid container spacing={2}>
                        
                        <Grid item size={{xs: 12, sm: 6, md: 6}}>
                            <TextField label="Title" fullWidth required value={title} onChange={(e) => setTitle(e.target.value)}/>
                        </Grid>
                        
                        <Grid item size={{xs: 12, sm: 6, md: 6}}>
                            <TextField
                                label="Description"
                                multiline
                                rows={3}
                                fullWidth
                                required
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </Grid>

                    </Grid>
                </DialogContent>

                <DialogActions sx={{ padding: "16px" }}>
                    <Button onClick={handleClose} color="inherit">
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleUploadAnnouncement} sx={{ background : "#2e7d32", textTransform: "none", fontWeight: 600 }}>
                        Publish
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
