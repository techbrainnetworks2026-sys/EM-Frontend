import React, { useState } from 'react';
import './ApplyLeave.css';
import api from '../../../../../services/service';
import { useAppContext } from '../../../../context/AppContext.jsx';
import { Snackbar } from '@mui/material';
import MuiAlert from "@mui/material/Alert";

const ApplyLeave = () => {

    const { userData } = useAppContext();
    const [type, setType] = useState("");
    const [durationType, setDurationType] = useState("FULL_DAY");
    const [reason, setReason] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [endDate, setToDate] = useState("");
    const [fromTime, setFromTime] = useState("");
    const [toTime, setToTime] = useState("");
    const [sopen, setSOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                leave_type: type,
                duration_type: durationType,
                reason: reason,
                start_date: fromDate,
                end_date: durationType === 'FULL_DAY' ? endDate : fromDate,
            };

            if (durationType === 'HOURLY') {
                payload.from_time = fromTime;
                payload.to_time = toTime;
            }

            const res = await api.post("leave/apply/", payload);
            setSOpen(true);
            setMessage("Leave application submitted successfully.");
            setSeverity("success");
            setType("");
            setDurationType("FULL_DAY");
            setReason("");
            setFromDate("");
            setToDate("");
            setFromTime("");
            setToTime("");
        } catch (err) {
            const errorMsg = err.response?.data?.error ||
                (err.response?.data && Object.values(err.response.data)[0]) ||
                "Failed to submit leave application.";
            setSOpen(true);
            setMessage(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
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
            <h2 className='apply-leave-heading'>Apply Leave</h2>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label>Duration Type</label>
                    <select
                        value={durationType}
                        onChange={(e) => {
                            setDurationType(e.target.value);
                            if (e.target.value !== 'FULL_DAY') setToDate(fromDate);
                        }}
                    >
                        <option value="FULL_DAY">Full Day</option>
                        <option value="HALF_DAY">Half Day</option>
                        <option value="HOURLY">Hourly Permission</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>{durationType === 'FULL_DAY' ? "Leave From Date" : "Leave Date"}</label>
                    <input className='date-for-leave'
                        type="date"
                        name="fromDate"
                        value={fromDate}
                        min={today}
                        onChange={(e) => {
                            setFromDate(e.target.value);
                            if (durationType !== 'FULL_DAY') setToDate(e.target.value);
                        }}
                        required
                    />
                </div>

                {durationType === 'FULL_DAY' && (
                    <div className="form-group">
                        <label>Leave To Date</label>
                        <input className='date-for-leave'
                            type="date"
                            name="toDate"
                            value={endDate}
                            min={fromDate || today}
                            onChange={(e) => setToDate(e.target.value)}
                            required
                        />
                    </div>
                )}

                {durationType === 'HOURLY' && (
                    <div className="form-row">
                        <div className="form-group">
                            <label>From Time</label>
                            <input
                                type="time"
                                value={fromTime}
                                onChange={(e) => setFromTime(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>To Time</label>
                            <input
                                type="time"
                                value={toTime}
                                onChange={(e) => setToTime(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                )}

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
                    <button type="submit" className="apply-leave-submit-btn">Submit Application</button>
                    <button type="button" className="apply-leave-reset-btn" onClick={() => {
                        setFromDate("");
                        setToDate("");
                        setFromTime("");
                        setToTime("");
                        setType("");
                        setDurationType("FULL_DAY");
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
