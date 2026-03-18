import React, { useState, useMemo, useCallback } from 'react';
import './AttendanceView.css';
import { formatTime } from '../../../../../utils/timeFormatter.js';

// Tamil Nadu Government Holidays 2026 (Mock/Approximate)
const HOLIDAYS = [
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

const getLeaveStatusForDate = (dateStr, leaves) => {
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

const getStatus = (day, month, year, attendance, leaves) => {
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    const holiday = HOLIDAYS.find(h => h.date === dateStr);
    if (holiday) return "HOLIDAY";

    const leaveStatus = getLeaveStatusForDate(dateStr, leaves);
    if (leaveStatus === "LEAVE") return "LEAVE";
    if (leaveStatus === "HALF DAY") return "HALF DAY";
    if (leaveStatus === "PERMISSION") return "PERMISSION";

    const record = attendance.find(a => a.date === dateStr);
    if (record) return normalizeStatus(record.status);

    const date = new Date(year, month, day);
    if (date.getDay() === 0) return "WEEKEND";

    if (date > new Date()) return "-";

    return "ABSENT";
};

const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return null;
    const [h1, m1, s1] = checkIn.split(':').map(Number);
    const [h2, m2, s2] = checkOut.split(':').map(Number);
    const inSecs = h1 * 3600 + m1 * 60 + (s1 || 0);
    const outSecs = h2 * 3600 + m2 * 60 + (s2 || 0);
    const diffSecs = outSecs - inSecs;
    if (diffSecs <= 0) return null;
    const hrs = Math.floor(diffSecs / 3600);
    const mins = Math.floor((diffSecs % 3600) / 60);
    return `${hrs}h ${mins}m`;
};

const generateCSV = (days, year, month, attendance, leaves, filename) => {
    const headers = ["Date", "Day", "Status", "Check-In", "Check-Out", "Details"];
    const rows = days.map(day => {
        const dateObj = new Date(year, month, day);
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        const status = getStatus(day, month, year, attendance, leaves);
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
            const holiday = HOLIDAYS.find(h => h.date === dateStr);
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

const AttendanceView = ({ attendance = [], leaves = [] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month]);
    const daysArray = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

    const months = useMemo(() => [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ], []);

    const years = useMemo(() => Array.from({ length: 5 }, (_, i) => 2026 + i), []);

    const handleMonthChange = useCallback((e) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), parseInt(e.target.value), 1));
    }, []);

    const handleYearChange = useCallback((e) => {
        setCurrentDate(prev => new Date(parseInt(e.target.value), prev.getMonth(), 1));
    }, []);

    const totalPresent = useMemo(() => daysArray.filter(day => {
        const s = getStatus(day, month, year, attendance, leaves);
        return s === "PRESENT" || s === "PERMISSION" || s === "HALF DAY";
    }).length, [daysArray, month, year, attendance, leaves]);

    const totalLeave = useMemo(() => daysArray.filter(day => {
        const s = getStatus(day, month, year, attendance, leaves);
        return s === "LEAVE" || s === "ABSENT";
    }).length, [daysArray, month, year, attendance, leaves]);

    const workingDays = useMemo(() => {
        let count = 0;
        for (let i = 1; i <= daysInMonth; i++) {
            const d = new Date(year, month, i);
            const dayStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
            const isHoliday = HOLIDAYS.some(h => h.date === dayStr);
            if (d.getDay() !== 0 && !isHoliday) count++;
        }
        return count;
    }, [daysInMonth, month, year]);

    const [selectedDayDetails, setSelectedDayDetails] = useState(null);

    const handleDayClick = useCallback((day) => {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const status = getStatus(day, month, year, attendance, leaves);

        let details = {
            date: new Date(year, month, day).toLocaleDateString('en-US', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
            }),
            status: status,
            info: null
        };

        const record = attendance.find(a => a.date === dateStr);

        if (status === 'LEAVE' || status === 'HALF DAY' || status === 'PERMISSION') {
            const leaveRecord = leaves.find(l => l.start_date <= dateStr && l.end_date >= dateStr);
            details.info = leaveRecord ? { label: 'Reason', value: leaveRecord.reason } : { label: 'Reason', value: 'Not Specified' };
            if (record) {
                details.times = { checkIn: record.check_in || '-', checkOut: record.check_out || '-' };
            } else if (status === 'PERMISSION' && leaveRecord) {
                details.times = { checkIn: leaveRecord.from_time || '-', checkOut: leaveRecord.to_time || '-' };
            }
        } else if (status === 'HOLIDAY') {
            const holiday = HOLIDAYS.find(h => h.date === dateStr);
            details.info = { label: 'Holiday', value: holiday?.name };
        } else if (status === 'ABSENT') {
            details.info = { label: 'Note', value: 'Unplanned Absence' };
        } else if (status === 'PRESENT' || status === 'ONGOING') {
            details.times = { checkIn: record?.check_in || '-', checkOut: record?.check_out || '-' };
        }

        if (status !== '-' && status !== 'Weekend') {
            setSelectedDayDetails(details);
        }
    }, [year, month, attendance, leaves]);

    const downloadCSV = useCallback(() => {
        generateCSV(daysArray, year, month, attendance, leaves, `attendance_${months[month]}_${year}.csv`);
    }, [daysArray, year, month, attendance, leaves, months]);

    const downloadYearlyCSV = useCallback(() => {
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
            const status = getStatus(day, m, year, attendance, leaves);
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
                const holiday = HOLIDAYS.find(h => h.date === dateStr);
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
    }, [year, attendance, leaves]);

    const isClickable = useCallback((status) => ['PRESENT', 'ABSENT', 'LEAVE', 'HOLIDAY', 'HALF DAY', 'PERMISSION'].includes(status), []);

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
                        <button className="attendance-close-btn" onClick={() => setSelectedDayDetails(null)}>Close</button>
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
                    const status = getStatus(day, month, year, attendance, leaves);
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
                                {status === 'HOLIDAY' && (
                                    <div className="holiday-note">
                                        {HOLIDAYS.find(h => h.date === dateStr)?.name}
                                    </div>
                                )}
                                {status === 'PRESENT' && record?.check_in && record?.check_out && (
                                    <div className="day-times">
                                        <span style={{ textAlign: "center", fontWeight: "bold" }}>⏱️ {calculateHours(record.check_in, record.check_out)}</span>
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

export default React.memo(AttendanceView);
