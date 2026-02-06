import React, { useState } from 'react';
import './ApplyLeave.css';
import api from '../../../../../services/service';
import { useAppContext } from '../../../../context/AppContext.jsx';
import { Snackbar } from '@mui/material';
import MuiAlert from "@mui/material/Alert";

const ApplyLeave = () => {
    
    const {userData} = useAppContext();
    const [type, setType] = useState("");
    const [reason, setReason] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [endDate, setToDate] = useState("");
    const [sopen, setSOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await api.post("leave/apply/", {leave_type : type, reason: reason, start_date: fromDate, end_date: endDate});
            setSOpen(true);
            setMessage("Leave application submitted successfully.");
            setSeverity("success");
            setType("");
            setReason("");
            setFromDate("");
            setToDate("");
        }catch(err){
            console.log(err.response.data);
            setSOpen(true);
            setMessage("Failed to submit leave application. Please try again.");
            setSeverity("error");
        }
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") return;
        setSOpen(false);
    };

    const handleSClose = (event, reason) => {
        if (reason === "clickaway") return;
        setSOpen(false);
    };

    const today = new Date().toISOString().split("T")[0];


    return (
        <div className="dashboard-view apply-leave-view">
            <h2>Apply Leave</h2>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label>Leave From Date</label>
                    <input
                        type="date"
                        name="fromDate"
                        value={fromDate}
                        min={today}
                        onChange={(e) => setFromDate(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Leave To Date</label>
                    <input
                        type="date"
                        name="toDate"
                        value={endDate}
                        min={today}
                        onChange={(e) => setToDate(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Leave Type</label>
                    <select name="type" value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="SELECT">Select Leave Type</option>
                        <option value="CASUAL">Casual Leave</option>
                        <option value="SICK">Sick Leave</option>
                        <option value="EMERGENCY">Emergency Leave</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Reason</label>
                    <textarea
                        name="reason"
                        rows="4"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        placeholder="Reason for leave..."
                    ></textarea>
                </div>

                <div className="form-actions">
                    <button type="submit" className="primary-btn">Submit Application</button>
                    <button type="button" className="secondary-btn" onClick={() => {
                        setFromDate("");
                        setToDate("");
                        setType("Casual");
                        setReason("");
                    }}>Reset</button>
                </div>
            </form>
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
    );
};

export default ApplyLeave;
