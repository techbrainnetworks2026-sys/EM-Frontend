import React, { useEffect, useState } from 'react';
import './LeaveHistory.css';
import api from '../../../../../services/service.js';

const LeaveHistory = ({ leaves = [] }) => {
    const [leavesData, setLeavesData] = useState([]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Approved': return 'status-approved';
            case 'Pending': return 'status-pending';
            case 'Rejected': return 'status-rejected';
            default: return '';
        }
    };

    useEffect(() => {
        const fetchLeaveHistory = async () => {
            try {
                const res = await api.get("leave/history/");
                setLeavesData(res.data);
            } catch (err) {
                console.log(err);
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
                                <th>From Date</th>
                                <th>To Date</th>
                                <th>Type</th>
                                <th>Reason</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leavesData.length > 0 ? (
                                leavesData.map(leave => (
                                    <tr key={leave.id}>
                                        <td data-label="From Date" className="lh-col-date"><span className="lh-td-value">{leave.start_date}</span></td>
                                        <td data-label="To Date" className="lh-col-date"><span className="lh-td-value">{leave.end_date}</span></td>
                                        <td data-label="Type" className="lh-col-type"><span className="lh-td-value">{leave.leave_type}</span></td>
                                        <td data-label="Reason" className="lh-col-reason"><span className="lh-td-value">{leave.reason}</span></td>
                                        <td data-label="Status" className="lh-col-status"><span className="lh-td-value"><span className={`lh-status ${getStatusClass(leave.status)}`}>{leave.status}</span></span></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="lh-empty">No leave history found.</td>
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
