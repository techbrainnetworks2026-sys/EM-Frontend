import React, { useEffect, useState } from 'react';
import './LeaveHistory.css';
import api from "../../../../../services/service.js";
import { formatTime } from "../../../../../utils/timeFormatter.js";

const LeaveHistory = ({ leaves = [] }) => {
    const [leavesData, setLeavesData] = useState([]);

    const getStatusClass = (status) => {
        if (!status) return '';
        const s = status.toUpperCase();
        if (s === 'APPROVED') return 'status-approved';
        if (s === 'PENDING') return 'status-pending';
        if (s === 'REJECTED') return 'status-rejected';
        return '';
    };

    useEffect(() => {
        const fetchLeaveHistory = async () => {
            try {
                const res = await api.get("leave/history/");
                setLeavesData(res.data);
            } catch (err) {
                // Error handled
            }
        };

        fetchLeaveHistory();
    }, []);

    return (
        <div className="lh-view">
            <h2 className="lh-heading">Leave History</h2>
            <div className="lh-container">
                <div className="lh-header-row">
                    <div className="lh-header-item">From</div>
                    <div className="lh-header-item">To</div>
                    <div className="lh-header-item">Duration</div>
                    <div className="lh-header-item">Type</div>
                    <div className="lh-header-item">Reason</div>
                    <div className="lh-header-item">Status</div>
                </div>
                <div className="lh-body">
                    {leavesData.length > 0 ? (
                        leavesData.map(leave => (
                            <div className="lh-row" key={leave.id}>
                                <div className="lh-col lh-col-date" data-label="From">
                                    <span className="lh-td-value">{leave.start_date}</span>
                                </div>
                                <div className="lh-col lh-col-date" data-label="To">
                                    <span className="lh-td-value">{leave.end_date}</span>
                                </div>
                                <div className="lh-col lh-col-duration" data-label="Duration">
                                    <span className="lh-td-value">
                                        {leave.duration_type === 'HOURLY'
                                            ? `${formatTime(leave.from_time)} - ${formatTime(leave.to_time)}`
                                            : leave.duration_type === 'HALF_DAY' ? 'Half Day' : 'Full Day'}
                                    </span>
                                </div>
                                <div className="lh-col lh-col-type" data-label="Type">
                                    <span className="lh-td-value">{leave.leave_type}</span>
                                </div>
                                <div className="lh-col lh-col-reason" data-label="Reason">
                                    <span className="lh-td-value">{leave.reason}</span>
                                </div>
                                <div className="lh-col lh-col-status" data-label="Status">
                                    <span className={`lh-status ${getStatusClass(leave.status)}`}>
                                        {leave.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="lh-empty">No leave history found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaveHistory;
