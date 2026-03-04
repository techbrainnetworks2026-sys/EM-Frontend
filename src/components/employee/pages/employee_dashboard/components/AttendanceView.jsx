import React, { useState } from 'react';
import './AttendanceView.css';
import { formatTime } from '../../../../../utils/timeFormatter.js';

const AttendanceView = ({ attendance = [], leaves = [] }) => {
    // State for selected month/year (default to Jan 2026 for mock data alignment)
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Navigation handlers removed in favor of dropdowns

    const handleMonthChange = (e) => {
        setCurrentDate(new Date(year, parseInt(e.target.value), 1));
    };

    const handleYearChange = (e) => {
        setCurrentDate(new Date(parseInt(e.target.value), month, 1));
    };

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const years = Array.from({ length: 5 }, (_, i) => 2026 + i); // 2026 to 2030

    // Tamil Nadu Government Holidays 2026 (Mock/Approximate)
    const holidays = [
        { date: '2026-01-01', name: 'New Year' },
        { date: '2026-01-14', name: 'Bhogi' },
        { date: '2026-01-15', name: 'Pongal' },
        { date: '2026-01-16', name: 'Thiruvalluvar Day' },
        { date: '2026-01-17', name: 'Uzhavar Thirunal' },
        { date: '2026-01-26', name: 'Republic Day' },
        { date: '2026-03-20', name: 'Ramzan' },
        { date: '2026-04-14', name: 'Tamil New Year' },
        { date: '2026-05-01', name: 'May Day' },
        { date: '2026-08-15', name: 'Independence Day' },
        { date: '2026-08-26', name: 'Milad-un-Nabi' },
        { date: '2026-10-02', name: 'Gandhi Jayanti' },
        { date: '2026-10-20', name: 'Ayutha Pooja' },
        { date: '2026-10-21', name: 'Vijaya Dasami' },
        { date: '2026-11-08', name: 'Diwali' },
        { date: '2026-12-25', name: 'Christmas' }
    ];

    const normalizeStatus = (status) => {
        if (!status) return "ABSENT";

        switch (status.toUpperCase()) {
            case "PRESENT":
            case "ONGOING":
                return "PRESENT";

            case "LEAVE":
                return "LEAVE";
            case "HALF-DAY":
            case "HALF DAY":
                return "HALF-DAY";
            case "PERMISSION":
                return "PERMISSION";

            default:
                return "ABSENT";
        }
    };

    const getLeaveStatusForDate = (dateStr) => {
        const leave = leaves.find(l => {
            if (l.status !== "APPROVED") return false;
            const start = new Date(l.start_date);
            const end = new Date(l.end_date);
            const current = new Date(dateStr);
            return current >= start && current <= end;
        });

        if (!leave) return null;

        if (leave.duration_type === 'HOURLY') return "PERMISSION";
        if (leave.duration_type === 'HALF_DAY') return "HALF DAY";
        return "LEAVE";
    };

    const isLeaveDay = (dateStr) => {
        return getLeaveStatusForDate(dateStr) === "LEAVE";
    };

    const getStatus = (day) => {

        const dateStr = `${year}-${(month + 1)
            .toString()
            .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        // 1️⃣ Holiday (highest priority)
        const holiday = holidays.find(h => h.date === dateStr);
        if (holiday) return "HOLIDAY";

        // 2️⃣ Leave / Permission
        const leaveStatus = getLeaveStatusForDate(dateStr);
        if (leaveStatus === "LEAVE") return "LEAVE";
        if (leaveStatus === "HALF DAY") return "HALF DAY";
        if (leaveStatus === "PERMISSION") return "PERMISSION";

        // 3️⃣ Attendance
        const record = attendance.find(a => a.date === dateStr);
        if (record) return normalizeStatus(record.status);

        // 4️⃣ Weekend
        const date = new Date(year, month, day);
        if (date.getDay() === 0) return "WEEKEND";

        // 5️⃣ Future date
        if (date > new Date()) return "-";

        // 6️⃣ Default
        return "ABSENT";
    };


    const filteredAttendance = attendance.filter(a => {
        const d = new Date(a.date);
        return d.getMonth() === month && d.getFullYear() === year;
    });

    const totalPresent = daysArray.filter(day => {
        const s = getStatus(day);
        return s === "PRESENT" || s === "PERMISSION" || s === "HALF DAY";
    }).length;

    const totalLeave = daysArray.filter(day => {
        const s = getStatus(day);
        return s === "LEAVE" || s === "ABSENT";
    }).length;



    // Calculate working days (excluding Sundays and Holidays)
    let workingDays = 0;
    for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(year, month, i);
        const dayStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
        const isHoliday = holidays.some(h => h.date === dayStr);

        // Count if NOT Sunday AND NOT Holiday
        if (d.getDay() !== 0 && !isHoliday) {
            workingDays++;
        }
    }

    // State for selected day details modal
    const [selectedDayDetails, setSelectedDayDetails] = useState(null);

    const handleDayClick = (day) => {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const status = getStatus(day);

        let details = {
            date: new Date(year, month, day).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            status: status,
            info: null
        };

        const record = attendance.find(a => a.date === dateStr);

        if (status === 'LEAVE' || status === 'HALF DAY' || status === 'PERMISSION') {
            const leaveRecord = leaves.find(l => l.start_date <= dateStr && l.end_date >= dateStr);
            details.info = leaveRecord ? { label: 'Reason', value: leaveRecord.reason } : { label: 'Reason', value: 'Not Specified' };

            // Prioritize attendance record times if they exist, otherwise use permission times
            if (record) {
                details.times = {
                    checkIn: record.check_in || '-',
                    checkOut: record.check_out || '-'
                };
            } else if (status === 'PERMISSION' && leaveRecord) {
                details.times = {
                    checkIn: leaveRecord.from_time || '-',
                    checkOut: leaveRecord.to_time || '-'
                };
            }
        } else if (status === 'HOLIDAY') {
            const holiday = holidays.find(h => h.date === dateStr);
            details.info = { label: 'Holiday', value: holiday?.name };
        } else if (status === 'ABSENT') {
            details.info = { label: 'Note', value: 'Unplanned Absence' };
        } else if (status === 'PRESENT' || status === 'ONGOING') {
            details.times = {
                checkIn: record?.check_in || '-',
                checkOut: record?.check_out || '-'
            };
        }

        if (status !== '-' && status !== 'Weekend') {
            setSelectedDayDetails(details);
        }
    };

    const isClickable = (status) => ['PRESENT', 'ABSENT', 'LEAVE', 'HOLIDAY', 'HALF DAY', 'PERMISSION'].includes(status);

    const downloadCSV = () => {
        generateCSV(daysArray, `attendance_${months[month]}_${year}.csv`);
    };

    const downloadYearlyCSV = () => {
        const allDaysOfYear = [];
        for (let m = 0; m < 12; m++) {
            const daysInM = new Date(year, m + 1, 0).getDate();
            for (let d = 1; d <= daysInM; d++) {
                allDaysOfYear.push({ day: d, month: m });
            }
        }

        const headers = ["Date", "Day", "Status", "Check-In", "Check-Out", "Details"];
        const rows = allDaysOfYear.map(({ day, month: m }) => {
            const dateObj = new Date(year, m, day);
            const dateStr = `${year}-${(m + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

            // Re-implement getStatus logic for arbitrary month
            const getStatusForValue = (d, mon, yr) => {
                const dStr = `${yr}-${(mon + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
                const holiday = holidays.find(h => h.date === dStr);
                if (holiday) return "HOLIDAY";

                const getLeaveStatus = (ds) => {
                    const leave = leaves.find(l => {
                        if (l.status !== "APPROVED") return false;
                        const start = new Date(l.start_date);
                        const end = new Date(l.end_date);
                        const current = new Date(ds);
                        return current >= start && current <= end;
                    });
                    if (!leave) return null;
                    if (leave.duration_type === 'HOURLY') return "PERMISSION";
                    if (leave.duration_type === 'HALF_DAY') return "HALF DAY";
                    return "LEAVE";
                };

                const leaveStatus = getLeaveStatus(dStr);
                if (leaveStatus === "LEAVE") return "LEAVE";
                if (leaveStatus === "HALF DAY") return "HALF DAY";
                if (leaveStatus === "PERMISSION") return "PERMISSION";

                const record = attendance.find(a => a.date === dStr);
                if (record) return normalizeStatus(record.status);

                const dt = new Date(yr, mon, d);
                if (dt.getDay() === 0) return "WEEKEND";
                if (dt > new Date()) return "-";
                return "ABSENT";
            };

            const status = getStatusForValue(day, m, year);
            const record = attendance.find(a => a.date === dateStr);
            let checkIn = record?.check_in || '-';
            let checkOut = record?.check_out || '-';

            let details = '';
            const leave = leaves.find(l => l.start_date <= dateStr && l.end_date >= dateStr);

            if (status === 'LEAVE' || status === 'HALF DAY' || status === 'PERMISSION') {
                details = leave ? leave.reason : '';
                if (status === 'PERMISSION' && record === undefined && leave) {
                    checkIn = leave.from_time || '-';
                    checkOut = leave.to_time || '-';
                }
            } else if (status === 'HOLIDAY') {
                const holiday = holidays.find(h => h.date === dateStr);
                details = holiday ? holiday.name : '';
            }

            return [
                `"${dateStr}"`,
                `"${dayName}"`,
                `"${status}"`,
                `"${formatTime(checkIn)}"`,
                `"${formatTime(checkOut)}"`,
                `"${details.replace(/"/g, '""')}"`
            ].join(",");
        });

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `attendance_yearly_${year}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const generateCSV = (days, filename) => {
        const headers = ["Date", "Day", "Status", "Check-In", "Check-Out", "Details"];
        const rows = days.map(day => {
            const dateObj = new Date(year, month, day);
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            const status = getStatus(day);
            const record = attendance.find(a => a.date === dateStr);
            let checkIn = record?.check_in || '-';
            let checkOut = record?.check_out || '-';

            let details = '';
            const leave = leaves.find(l => l.start_date <= dateStr && l.end_date >= dateStr);

            if (status === 'LEAVE' || status === 'HALF DAY' || status === 'PERMISSION') {
                details = leave ? leave.reason : '';
                if (status === 'PERMISSION' && record === undefined && leave) {
                    checkIn = leave.from_time || '-';
                    checkOut = leave.to_time || '-';
                }
            } else if (status === 'HOLIDAY') {
                const holiday = holidays.find(h => h.date === dateStr);
                details = holiday ? holiday.name : '';
            }

            return [
                `"${dateStr}"`,
                `"${dayName}"`,
                `"${status}"`,
                `"${formatTime(checkIn)}"`,
                `"${formatTime(checkOut)}"`,
                `"${details.replace(/"/g, '""')}"`
            ].join(",");
        });

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div className="dashboard-view attendance-view">
            {/* Modal */}
            {selectedDayDetails && (
                <div className="modal-overlay" onClick={() => setSelectedDayDetails(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Attendance Details</h3>
                            <button className="close-btn" onClick={() => setSelectedDayDetails(null)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-row">
                                <span className="detail-label">Date</span>
                                <span className="detail-value">{selectedDayDetails.date}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Status</span>
                                <span className={`detail-value ${selectedDayDetails.status ? ('status-' + selectedDayDetails.status.toLowerCase().replace(/\s+/g, '-').replace('/', '-')) : ''}`}>
                                    {selectedDayDetails.status}
                                </span>
                            </div>
                            {selectedDayDetails.info && (
                                <div className="detail-row">
                                    <span className="detail-label">{selectedDayDetails.info.label}</span>
                                    <span className="detail-value">{selectedDayDetails.info.value}</span>
                                </div>
                            )}
                            {selectedDayDetails.times && (
                                <>
                                    <div className="detail-row">
                                        <span className="detail-label">Check-In</span>
                                        <span className="detail-value">{formatTime(selectedDayDetails.times.checkIn)}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Check-Out</span>
                                        <span className="detail-value">{formatTime(selectedDayDetails.times.checkOut)}</span>
                                    </div>
                                </>
                            )}
                        </div>
                        <button className="primary-btn fullwidth" onClick={() => setSelectedDayDetails(null)}>Close</button>
                    </div>
                </div>
            )}

            <div className="view-header">
                <div className="left">
                    <h2 className='Monthly-Attendance'>Monthly Attendance</h2>
                    <div className="export-buttons" style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={downloadCSV} className="secondary-btn small">
                            📥 Monthly CSV
                        </button>
                        <button onClick={downloadYearlyCSV} className="secondary-btn small">
                            📅 Yearly CSV
                        </button>
                    </div>
                </div>

                <div className="month-controls">
                    <select
                        value={month}
                        onChange={handleMonthChange}
                    >
                        {months.map((m, index) => (
                            <option key={index} value={index}>{m}</option>
                        ))}
                    </select>

                    <select
                        value={year}
                        onChange={handleYearChange}
                    >
                        {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="attendance-summary">
                <div className="Total-Present">Total Present: <b>{totalPresent}</b></div>
                <div className="Total-Leave">Total Leave: <b>{totalLeave}</b></div>
                <div className="Working-Days">Working Days: <b>{workingDays}</b></div>
            </div>

            <div className="calendar-grid">
                {daysArray.map(day => {
                    const status = getStatus(day);
                    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    const dayName = new Date(year, month, day).toLocaleDateString('en-US', { weekday: 'short' });
                    const record = attendance.find(a => a.date === dateStr);
                    const clickable = isClickable(status);

                    return (
                        <div
                            key={day}
                            className={`calendar-day status-${status.toLowerCase().replace('/', '-')} ${clickable ? 'clickable' : ''}`}
                            onClick={() => handleDayClick(day)}
                        >
                            <div className="day-header">
                                <span className="day-number">{day}</span>
                                <span className="day-name">{dayName}</span>
                            </div>

                            <div className="day-body">
                                <span className="day-status-label">{status}</span>
                                {status === 'Holiday' && (
                                    <div className="holiday-note">
                                        {holidays.find(h => h.date === dateStr)?.name}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AttendanceView;
