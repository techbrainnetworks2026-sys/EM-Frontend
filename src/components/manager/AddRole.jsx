import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import CodeIcon from "@mui/icons-material/Code";
import StorageIcon from "@mui/icons-material/Storage";
import AndroidIcon from "@mui/icons-material/Android";
import BrushIcon from "@mui/icons-material/Brush";
import CampaignIcon from "@mui/icons-material/Campaign";

function AddRole(){

    const [open, setOpen] = useState(false);
    
    const handleClose = () => setOpen(false);

    const roles = [
        {
            name: "MERN Stack",
            icon: <CodeIcon /> ,
            color: "#90caf9",
            count: 2,
        },
        {
            name: "Backend Development",
            icon: <StorageIcon />,
            color: "#ce93d8",
            count: 1,
        },
        {
            name: "Digital Marketing",
            icon: <CampaignIcon />,
            color: "#ffcc80",
            count: 1,
        },
        {
            name: "Android Development",
            icon: <AndroidIcon />,
            color: "#81c784",
            count: 1,
        },
        {
            name: "Graphic Designing",
            icon: <BrushIcon />,
            color: "#f48fb1",
            count: 1,
        },
    ];
 

    return (
        <div>
            <Typography variant='h5' component='p' sx={{
                fontFamily : "work sans",
                fontWeight : "600",
                color : "#080808"
            }}> Techbrain Role List </Typography>
            <Box sx={{ display : "flex", justifyContent : "flex-end", margin : "auto", width : "100%"}}>
                <Button onClick={() => setOpen(true)} sx={{ textTransform : "none", background : "#00838f", color : "whitesmoke"}}> + Add Role </Button>
            </Box>
            <div style={{ marginTop : "10px" }}>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
                {roles.map((role, index) => (
                    <Box key={index} sx={{ background: "#1e1e1e", padding: "20px",
                        borderRadius: "14px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px",
                        transition: "0.2s ease",
                        "&:hover": { 
                            transform: "translateY(-5px)" 
                        },
                    }}>
                        
                        <Box sx={{ width: 48, height: 48, borderRadius: "10px", backgroundColor: role.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#000",}}>
                            {role.icon ? role.icon : <CodeIcon />} 
                        </Box>
                        <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "whitesmoke",}} >
                            {role.name}
                        </Typography>
                        <Typography sx={{ opacity: 0.7, color : "gray" }}>
                            {role.count} Employees
                        </Typography>
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
                    Add New Role
                </DialogTitle>

                <DialogContent dividers>
                    <Grid container spacing={2}>
                        {/* Name */}
                        <Grid item size={{xs: 12, sm: 6, md: 6}}>
                            <TextField label="Role" fullWidth required/>
                        </Grid>

                    </Grid>
                </DialogContent>

                <DialogActions sx={{ padding: "16px" }}>
                    <Button onClick={handleClose} color="inherit">
                        Cancel
                    </Button>
                    <Button variant="contained" sx={{ textTransform: "none", fontWeight: 600 }}>
                        Save Role
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AddRole
