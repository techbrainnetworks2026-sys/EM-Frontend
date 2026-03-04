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
                <div className="lh-scroll lh-table-wrapper">
                    <table className="lh-table">
                        <thead>
                            <tr>
                                <th>From</th>
                                <th>To</th>
                                <th>Duration</th>
                                <th>Type</th>
                                <th>Reason</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leavesData.length > 0 ? (
                                leavesData.map(leave => (
                                    <tr key={leave.id}>
                                        <td data-label="From" className="lh-col-date"><span className="lh-td-value">{leave.start_date}</span></td>
                                        <td data-label="To" className="lh-col-date"><span className="lh-td-value">{leave.end_date}</span></td>
                                        <td data-label="Duration" className="lh-col-duration">
                                            <span className="lh-td-value">
                                                {leave.duration_type === 'HOURLY'
                                                    ? `${formatTime(leave.from_time)} - ${formatTime(leave.to_time)}`
                                                    : leave.duration_type === 'HALF_DAY' ? 'Half Day' : 'Full Day'}
                                            </span>
                                        </td>
                                        <td data-label="Type" className="lh-col-type"><span className="lh-td-value">{leave.leave_type}</span></td>
                                        <td data-label="Reason" className="lh-col-reason"><span className="lh-td-value">{leave.reason}</span></td>
                                        <td data-label="Status" className="lh-col-status"><span className="lh-td-value"><span className={`lh-status ${getStatusClass(leave.status)}`}>{leave.status}</span></span></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="lh-empty">No leave history found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeaveHistory;
