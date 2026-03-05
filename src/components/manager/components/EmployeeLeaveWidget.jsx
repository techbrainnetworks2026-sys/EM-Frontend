import React, { useEffect, useState } from 'react';
import {
    Box, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, IconButton, List, ListItem, ListItemAvatar,
    ListItemText, Avatar, Typography
} from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../../services/service.js';

// ─── Mock Data (used when API is unavailable / for UI testing) ──────────────
const MOCK_LEAVES = [
    { id: 1, employee: 5, employee_id: 5, employee_name: 'rajesh_kumar', department: 'Engineering', leave_type: 'CASUAL', start_date: '2026-02-10', end_date: '2026-02-12', reason: 'Family function', status: 'APPROVED', applied_on: '2026-02-05T09:30:00Z', action_by: 1, action_by_name: 'manager', action_date: '2026-02-06T10:00:00Z' },
    { id: 2, employee: 7, employee_id: 7, employee_name: 'priya_sharma', department: 'Design', leave_type: 'SICK', start_date: '2026-02-24', end_date: '2026-02-25', reason: 'Fever and cold', status: 'PENDING', applied_on: '2026-02-24T08:00:00Z', action_by: null, action_by_name: null, action_date: null },
    { id: 3, employee: 9, employee_id: 9, employee_name: 'arun_dev', department: 'Backend', leave_type: 'EMERGENCY', start_date: '2026-02-20', end_date: '2026-02-20', reason: 'Medical emergency', status: 'APPROVED', applied_on: '2026-02-20T07:15:00Z', action_by: 1, action_by_name: 'manager', action_date: '2026-02-20T08:00:00Z' },
    { id: 4, employee: 5, employee_id: 5, employee_name: 'rajesh_kumar', department: 'Engineering', leave_type: 'SICK', start_date: '2026-01-15', end_date: '2026-01-17', reason: 'Food poisoning', status: 'APPROVED', applied_on: '2026-01-14T18:00:00Z', action_by: 1, action_by_name: 'manager', action_date: '2026-01-15T09:00:00Z' },
    { id: 5, employee: 12, employee_id: 12, employee_name: 'meena_r', department: 'HR', leave_type: 'CASUAL', start_date: '2026-02-17', end_date: '2026-02-18', reason: 'Personal work', status: 'REJECTED', applied_on: '2026-02-15T11:00:00Z', action_by: 1, action_by_name: 'manager', action_date: '2026-02-16T09:00:00Z' },
];

const MOCK_ATTENDANCE = {
    5: [ // rajesh_kumar
        { date: '2026-02-02', check_in: '09:05:00', check_out: '18:10:00', status: 'PRESENT' },
        { date: '2026-02-03', check_in: '09:12:00', check_out: '18:00:00', status: 'PRESENT' },
        { date: '2026-02-04', check_in: '09:00:00', check_out: '18:05:00', status: 'PRESENT' },
        { date: '2026-02-05', check_in: '09:20:00', check_out: '18:15:00', status: 'PRESENT' },
        { date: '2026-02-10', check_in: null, check_out: null, status: 'LEAVE' },
        { date: '2026-02-11', check_in: null, check_out: null, status: 'LEAVE' },
        { date: '2026-02-12', check_in: null, check_out: null, status: 'LEAVE' },
        { date: '2026-02-13', check_in: '09:08:00', check_out: '18:00:00', status: 'PRESENT' },
        { date: '2026-02-17', check_in: '09:30:00', check_out: '18:00:00', status: 'PRESENT' },
        { date: '2026-02-18', check_in: '09:10:00', check_out: null, status: 'ONGOING' },
    ],
    7: [ // priya_sharma
        { date: '2026-02-02', check_in: '09:00:00', check_out: '17:55:00', status: 'PRESENT' },
        { date: '2026-02-03', check_in: '09:05:00', check_out: '18:10:00', status: 'PRESENT' },
        { date: '2026-02-04', check_in: null, check_out: null, status: 'ABSENT' },
        { date: '2026-02-17', check_in: '09:15:00', check_out: '18:00:00', status: 'PRESENT' },
        { date: '2026-02-18', check_in: '09:05:00', check_out: '18:00:00', status: 'PRESENT' },
        { date: '2026-02-24', check_in: null, check_out: null, status: 'LEAVE' },
        { date: '2026-02-25', check_in: null, check_out: null, status: 'LEAVE' },
    ],
    9: [ // arun_dev
        { date: '2026-02-02', check_in: '08:55:00', check_out: '18:00:00', status: 'PRESENT' },
        { date: '2026-02-03', check_in: '09:10:00', check_out: '18:05:00', status: 'PRESENT' },
        { date: '2026-02-17', check_in: '09:20:00', check_out: '18:00:00', status: 'PRESENT' },
        { date: '2026-02-18', check_in: '09:00:00', check_out: '18:10:00', status: 'PRESENT' },
        { date: '2026-02-20', check_in: null, check_out: null, status: 'LEAVE' },
    ],
    12: [ // meena_r
        { date: '2026-02-02', check_in: '09:05:00', check_out: '18:00:00', status: 'PRESENT' },
        { date: '2026-02-03', check_in: '09:00:00', check_out: '18:00:00', status: 'PRESENT' },
        { date: '2026-02-17', check_in: '09:10:00', check_out: '18:05:00', status: 'PRESENT' },
        { date: '2026-02-18', check_in: null, check_out: null, status: 'ABSENT' },
    ],
};

// ─── Holidays (mirrors employee AttendanceView) ───────────────────────────────
const HOLIDAYS = [
    { date: '2026-01-01', name: 'New Year' },
    { date: '2026-01-14', name: 'Bhogi' },
    { date: '2026-01-15', name: 'Pongal' },
    { date: '2026-01-16', name: 'Thiruvalluvar Day' },
    { date: '2026-01-17', name: 'Uzhavar Thirunal' },
    { date: '2026-01-26', name: 'Republic Day' },
    { date: '2026-03-30', name: 'Ramzan' },
    { date: '2026-04-14', name: 'Tamil New Year' },
    { date: '2026-05-01', name: 'May Day' },
    { date: '2026-08-15', name: 'Independence Day' },
    { date: '2026-08-26', name: 'Milad-un-Nabi' },
    { date: '2026-10-02', name: 'Gandhi Jayanti' },
    { date: '2026-10-20', name: 'Ayutha Pooja' },
    { date: '2026-10-21', name: 'Vijaya Dasami' },
    { date: '2026-11-08', name: 'Diwali' },
    { date: '2026-12-25', name: 'Christmas' },
];

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];
const YEARS = Array.from({ length: 5 }, (_, i) => 2026 + i);

// ─── Mini Attendance Calendar (shown after clicking employee username) ─────────
function EmployeeAttendanceCalendar({ employeeId, employeeName, onBack }) {
    const [attendance, setAttendance] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);
    const [loading, setLoading] = useState(true);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [attRes, leaveRes] = await Promise.all([
                    api.get(`attendance/manager/employee/${employeeId}/history/`),
                    api.get(`leave/manager/employee/${employeeId}/leaves/`),
                ]);
                setAttendance(attRes.data);
                setLeaves(leaveRes.data);
            } catch (err) {
                // API not ready yet — fall back to mock data for UI testing
                console.warn('API unavailable, using mock data for employee', employeeId);
                setAttendance(MOCK_ATTENDANCE[employeeId] || []);
                setLeaves(MOCK_LEAVES.filter(l => l.employee_id === employeeId));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [employeeId]);

    const formatTime = (timeStr) => {
        if (!timeStr) return '--';
        const [hour, minute] = timeStr.split(':');
        const h = Number(hour);
        const period = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 === 0 ? 12 : h % 12;
        return `${displayHour.toString().padStart(2, '0')}:${minute} ${period}`;
    };

    const calculateTotalHours = (checkIn, checkOut) => {
        if (!checkIn || !checkOut || checkIn === '-' || checkOut === '-') return "--";

        const [inH, inM] = checkIn.split(':').map(Number);
        const [outH, outM] = checkOut.split(':').map(Number);

        let diffMinutes = (outH * 60 + outM) - (inH * 60 + inM);
        if (diffMinutes < 0) diffMinutes += 24 * 60; // Handle over-midnight shifts

        const hours = Math.floor(diffMinutes / 60);
        const mins = diffMinutes % 60;
        return `${hours}h ${mins}m`;
    };

    const isLeaveDay = (dateStr) =>
        leaves.some((leave) => {
            if (leave.status !== 'APPROVED') return false;
            const start = new Date(leave.start_date);
            const end = new Date(leave.end_date);
            const current = new Date(dateStr);
            return current >= start && current <= end;
        });

    const normalizeStatus = (status) => {
        if (!status) return 'ABSENT';
        switch (status.toUpperCase()) {
            case 'PRESENT':
            case 'ONGOING':
                return 'PRESENT';
            case 'LEAVE':
                return 'LEAVE';
            default:
                return 'ABSENT';
        }
    };

    const getStatus = (day) => {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const holiday = HOLIDAYS.find((h) => h.date === dateStr);
        if (holiday) return 'HOLIDAY';
        if (isLeaveDay(dateStr)) return 'LEAVE';
        const record = attendance.find((a) => a.date === dateStr);
        if (record) return normalizeStatus(record.status);
        const date = new Date(year, month, day);
        if (date.getDay() === 0) return 'WEEKEND';
        if (date > new Date()) return '-';
        return 'ABSENT';
    };

    const statusColor = {
        PRESENT: { border: '#22c55e', bg: '#fff' },
        LEAVE: { border: '#ef4444', bg: '#fff1f2' },
        ABSENT: { border: '#ef4444', bg: '#fff1f2' },
        WEEKEND: { border: '#cbd5e1', bg: '#f8fafc' },
        HOLIDAY: { border: '#8b5cf6', bg: '#f5f3ff' },
        '-': { border: '#e2e8f0', bg: '#fff' },
    };

    const filteredAttendance = attendance.filter((a) => {
        const d = new Date(a.date);
        return d.getMonth() === month && d.getFullYear() === year;
    });
    const totalPresent = filteredAttendance.filter(
        (a) => normalizeStatus(a.status) === 'PRESENT'
    ).length;
    const totalLeave = daysArray.filter((day) => {
        const s = getStatus(day);
        return s === 'LEAVE' || s === 'ABSENT';
    }).length;

    let monthlyTotalMins = 0;
    filteredAttendance.forEach((a) => {
        if (normalizeStatus(a.status) === 'PRESENT' && a.check_in && a.check_out) {
            const [inH, inM] = a.check_in.split(':').map(Number);
            const [outH, outM] = a.check_out.split(':').map(Number);
            let diffMins = (outH * 60 + outM) - (inH * 60 + inM);
            if (diffMins < 0) diffMins += 24 * 60;
            monthlyTotalMins += diffMins;
        }
    });
    const totalHoursStr = monthlyTotalMins > 0
        ? `${Math.floor(monthlyTotalMins / 60)}h ${monthlyTotalMins % 60}m`
        : '0h 0m';

    const handleDayClick = (day) => {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const status = getStatus(day);
        if (['-', 'WEEKEND'].includes(status)) return;

        let details = {
            date: new Date(year, month, day).toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            }),
            status,
            info: null,
            times: null,
        };

        if (status === 'LEAVE') {
            const leaveRecord = leaves.find(
                (l) => l.start_date <= dateStr && l.end_date >= dateStr
            );
            details.info = { label: 'Reason', value: leaveRecord?.reason || 'Not Specified' };
        } else if (status === 'HOLIDAY') {
            const holiday = HOLIDAYS.find((h) => h.date === dateStr);
            details.info = { label: 'Holiday', value: holiday?.name };
        } else if (status === 'ABSENT') {
            details.info = { label: 'Note', value: 'Unplanned Absence' };
        } else if (status === 'PRESENT') {
            const record = attendance.find((a) => a.date === dateStr);
            details.times = {
                checkIn: record?.check_in || '-',
                checkOut: record?.check_out || '-',
            };
            if (record?.check_in && record?.check_out) {
                details.times.totalHours = calculateTotalHours(record.check_in, record.check_out);
            }
        }
        setSelectedDay(details);
    };

    // ── Export all days of current month as CSV ───────────────
    const exportCSV = () => {
        generateCSV(daysArray, `${employeeName}_attendance_${MONTHS[month]}_${year}.csv`);
    };

    const exportYearlyCSV = () => {
        const allDaysOfYear = [];
        for (let m = 0; m < 12; m++) {
            const daysInM = new Date(year, m + 1, 0).getDate();
            for (let d = 1; d <= daysInM; d++) {
                allDaysOfYear.push({ day: d, month: m });
            }
        }

        const rows = [['Date', 'Day', 'Status', 'Check-In', 'Check-Out', 'Total Hours', 'Notes']];
        allDaysOfYear.forEach(({ day, month: m }) => {
            const dateStr = `${year}-${(m + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

            // Re-implement getStatus logic for arbitrary month
            const getStatusForValue = (d, mon, yr) => {
                const dStr = `${yr}-${(mon + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
                const holiday = HOLIDAYS.find((h) => h.date === dStr);
                if (holiday) return 'HOLIDAY';

                const isLeave = leaves.some((leave) => {
                    if (leave.status !== 'APPROVED') return false;
                    const start = new Date(leave.start_date);
                    const end = new Date(leave.end_date);
                    const current = new Date(dStr);
                    return current >= start && current <= end;
                });
                if (isLeave) return 'LEAVE';

                const record = attendance.find((a) => a.date === dStr);
                if (record) return normalizeStatus(record.status);

                const dt = new Date(yr, mon, d);
                if (dt.getDay() === 0) return 'WEEKEND';
                if (dt > new Date()) return '-';
                return 'ABSENT';
            };

            const status = getStatusForValue(day, m, year);
            const dayName = new Date(year, m, day).toLocaleDateString('en-US', { weekday: 'short' });
            let checkIn = '-', checkOut = '-', totalHrs = '-', notes = '';

            if (status === 'PRESENT') {
                const rec = attendance.find((a) => a.date === dateStr);
                checkIn = rec?.check_in ? formatTime(rec.check_in) : '-';
                checkOut = rec?.check_out ? formatTime(rec.check_out) : '-';
                if (rec?.check_in && rec?.check_out) totalHrs = calculateTotalHours(rec.check_in, rec.check_out);
            } else if (status === 'LEAVE') {
                const lr = leaves.find((l) => l.start_date <= dateStr && l.end_date >= dateStr);
                notes = lr?.reason || 'Leave';
            } else if (status === 'HOLIDAY') {
                const h = HOLIDAYS.find((h) => h.date === dateStr);
                notes = h?.name || 'Holiday';
            } else if (status === 'WEEKEND') {
                notes = 'Weekend';
            } else if (status === '-') {
                notes = 'Future';
            }

            rows.push([dateStr, dayName, status, checkIn, checkOut, totalHrs, notes]);
        });

        const csvContent = rows.map((r) => r.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${employeeName}_attendance_yearly_${year}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const generateCSV = (days, filename) => {
        const rows = [['Date', 'Day', 'Status', 'Check-In', 'Check-Out', 'Total Hours', 'Notes']];
        days.forEach((day) => {
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const status = getStatus(day);
            const dayName = new Date(year, month, day).toLocaleDateString('en-US', { weekday: 'short' });
            let checkIn = '-', checkOut = '-', totalHrs = '-', notes = '';

            if (status === 'PRESENT') {
                const rec = attendance.find((a) => a.date === dateStr);
                checkIn = rec?.check_in ? formatTime(rec.check_in) : '-';
                checkOut = rec?.check_out ? formatTime(rec.check_out) : '-';
                if (rec?.check_in && rec?.check_out) totalHrs = calculateTotalHours(rec.check_in, rec.check_out);
            } else if (status === 'LEAVE') {
                const lr = leaves.find((l) => l.start_date <= dateStr && l.end_date >= dateStr);
                notes = lr?.reason || 'Leave';
            } else if (status === 'HOLIDAY') {
                const h = HOLIDAYS.find((h) => h.date === dateStr);
                notes = h?.name || 'Holiday';
            } else if (status === 'WEEKEND') {
                notes = 'Weekend';
            } else if (status === '-') {
                notes = 'Future';
            }

            rows.push([dateStr, dayName, status, checkIn, checkOut, totalHrs, notes]);
        });

        const csvContent = rows.map((r) => r.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <IconButton size="small" onClick={onBack} sx={{ color: '#0d47a1', background: '#f1f5f9', mr: 1 }}>
                    <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Avatar sx={{ bgcolor: '#0d47a1', width: 36, height: 36, fontWeight: 700, fontSize: 16 }}>
                    {employeeName?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 700, color: 'black', fontSize: '16px' }}>
                        {employeeName}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', opacity: 0.8, color: 'black' }}>
                        Monthly Attendance
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: '8px' }}>
                    <Button
                        size="small"
                        onClick={exportCSV}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '11px',
                            border: '1px solid #4e7259ff',
                            color: '#000000ff',
                            borderRadius: '8px',
                            px: 1,
                            '&:hover': { backgroundColor: '#55a2ebff', color: '#000' },
                        }}
                    >
                        Monthly CSV
                    </Button>
                    <Button
                        size="small"
                        onClick={exportYearlyCSV}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '11px',
                            border: '1px solid #4e7259ff',
                            color: '#000000ff',
                            borderRadius: '8px',
                            px: 1,
                            '&:hover': { backgroundColor: '#55a2ebff', color: '#000' },
                        }}
                    >
                        Yearly CSV
                    </Button>
                </Box>
            </Box>

            {/* Month / Year Controls */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <select
                    value={month}
                    onChange={(e) => setCurrentDate(new Date(year, parseInt(e.target.value), 1))}
                    style={{
                        padding: '6px 10px', borderRadius: '6px', border: '1px solid #444',
                        background: 'whitesmoke', color: 'black', fontSize: '13px', cursor: 'pointer',
                    }}
                >
                    {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
                </select>
                <select
                    value={year}
                    onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), month, 1))}
                    style={{
                        padding: '6px 10px', borderRadius: '6px', border: '1px solid #444',
                        background: 'whitesmoke', color: 'black', fontSize: '13px', cursor: 'pointer',
                    }}
                >
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
            </Box>

            {/* Summary Pills */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                {[
                    { label: 'Present', value: totalPresent, color: '#22c55e' },
                    { label: 'Leave', value: totalLeave, color: '#ef4444' },
                    { label: 'Total Hours', value: totalHoursStr, color: '#0ea5e9' },
                ].map((s) => (
                    <Box key={s.label} sx={{
                        background: 'whitesmoke', border: `1px solid ${s.color}40`,
                        borderRadius: '8px', px: 2, py: 0.8, textAlign: 'center',
                        minWidth: '90px'
                    }}>
                        <Typography sx={{ fontSize: '11px', opacity: 1, color: 'black' }}>{s.label}</Typography>
                        <Typography sx={{ fontWeight: 700, color: s.color, fontSize: '18px' }}>{s.value}</Typography>
                    </Box>
                ))}
            </Box>

            {/* Loading */}
            {loading ? (
                <Typography sx={{ color: 'whitesmoke', opacity: 0.6, textAlign: 'center', py: 4 }}>
                    Loading attendance...
                </Typography>
            ) : (
                /* Calendar Grid */
                <Box sx={{
                    display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '6px', maxHeight: '340px', overflowY: 'auto', pr: 0.5,
                }}>
                    {daysArray.map((day) => {
                        const status = getStatus(day);
                        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                        const dayName = new Date(year, month, day).toLocaleDateString('en-US', { weekday: 'short' });
                        const colors = statusColor[status] || statusColor['-'];
                        const clickable = ['PRESENT', 'ABSENT', 'LEAVE', 'HOLIDAY'].includes(status);

                        let dayTotalHours = null;
                        if (status === 'PRESENT') {
                            const record = attendance.find((a) => a.date === dateStr);
                            if (record?.check_in && record?.check_out) {
                                dayTotalHours = calculateTotalHours(record.check_in, record.check_out);
                            }
                        }

                        return (
                            <Box
                                key={day}
                                onClick={() => handleDayClick(day)}
                                sx={{
                                    minHeight: '64px', background: colors.bg,
                                    borderRadius: '6px', p: '6px',
                                    borderTop: `3px solid ${colors.border}`,
                                    border: `1px solid #e2e8f0`,
                                    borderTopWidth: '3px',
                                    borderTopColor: colors.border,
                                    cursor: clickable ? 'pointer' : 'default',
                                    display: 'flex', flexDirection: 'column',
                                    transition: 'transform .15s, box-shadow .15s',
                                    '&:hover': clickable ? {
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
                                    } : {},
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '4px' }}>
                                    <Typography sx={{ fontWeight: 700, fontSize: '12px', color: '#1e293b' }}>{day}</Typography>
                                    <Typography sx={{ fontSize: '9px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>{dayName}</Typography>
                                </Box>
                                <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <Typography sx={{ fontSize: '9px', fontWeight: 700, color: '#475569' }}>
                                        {status === '-' ? '' : status}
                                    </Typography>
                                    {dayTotalHours && (
                                        <Typography sx={{ fontSize: '9px', fontWeight: 700, color: '#0ea5e9' }}>
                                            {dayTotalHours}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            )}

            {/* Day Detail Mini Modal */}
            {selectedDay && (
                <Box sx={{
                    mt: 3,
                    background: '#f8fafc',
                    borderRadius: '12px',
                    p: 2.5,
                    border: '1px solid #e2e8f0',
                    position: 'relative',
                    boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)'
                }}>
                    <IconButton
                        size="small"
                        onClick={() => setSelectedDay(null)}
                        sx={{ position: 'absolute', top: 12, right: 12, color: '#64748b' }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 2, fontSize: '15px' }}>
                        Attendance Details
                    </Typography>
                    {[
                        { label: 'Date', value: selectedDay.date },
                        { label: 'Status', value: selectedDay.status },
                        ...(selectedDay.info ? [{ label: selectedDay.info.label, value: selectedDay.info.value }] : []),
                        ...(selectedDay.times ? [
                            { label: 'Check-In', value: formatTime(selectedDay.times.checkIn) },
                            { label: 'Check-Out', value: formatTime(selectedDay.times.checkOut) },
                            ...(selectedDay.times.totalHours ? [{ label: 'Total Hours', value: selectedDay.times.totalHours }] : []),
                        ] : []),
                    ].map((row) => (
                        <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.2, borderBottom: '1px solid #e2e8f0' }}>
                            <Typography sx={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{row.label}</Typography>
                            <Typography sx={{ fontSize: '13px', color: '#1e293b', fontWeight: 600 }}>{row.value}</Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}

// ─── Employee List (shown first when widget is clicked) ────────────────────────
function EmployeeList({ employees, onSelectEmployee }) {
    if (employees.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 6 }}>
                <EventNoteIcon sx={{ fontSize: 48, color: '#555', mb: 1 }} />
                <Typography sx={{ color: 'whitesmoke', opacity: 0.6 }}>
                    No employees found.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography sx={{ fontSize: '13px', opacity: 2, color: 'black', mb: 2 }}>
                Click a name to view their full attendance history
            </Typography>
            <List disablePadding>
                {employees.map((row, index) => (
                    <ListItem
                        key={row.id ?? index}
                        sx={{
                            borderRadius: '10px', mb: 1,
                            background: 'white',
                            cursor: 'pointer',
                            transition: 'background 0.2s, transform 0.15s',
                            '&:hover': { background: '#cbd4e0ff', transform: 'translateX(4px)' },
                            border: '1px solid #f1f5f9'
                        }}
                        onClick={() => onSelectEmployee({ id: row.id, name: row.username })}
                    >
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: '#0ea5e9', fontWeight: 700, width: 42, height: 42 }}>
                                {row.username?.charAt(0)?.toUpperCase()}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>
                                    {row.username}
                                </Typography>
                            }
                            secondary={
                                <Typography sx={{ fontSize: '12px', color: '#64748b' }}>
                                    Employee ID: {row.id}
                                </Typography>
                            }
                        />
                        <Typography sx={{ fontSize: '12px', color: '#0ea5e9', fontWeight: 600 }}>
                            View Attendance →
                        </Typography>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}

// ─── Main Widget ──────────────────────────────────────────────────────────────
const EmployeeAttendanceWidget = () => {
    const [open, setOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null); // { id, name }

    // Fetch all employees for the list (using same api endpoint as Dashboard approved users)
    const fetchAllEmployees = async () => {
        try {
            const res = await api.get('accounts/manager/approved-users/');
            setEmployees(res.data);
        } catch (err) {
            // API not ready yet — fall back to mock data for UI testing
            console.warn('API unavailable, using mock employee data');
            const uniqueMockEmployees = Array.from(
                new Set(MOCK_LEAVES.map(l => l.employee_id))
            ).map(id => {
                const e = MOCK_LEAVES.find(l => l.employee_id === id);
                return { id: e.employee_id, username: e.employee_name };
            });
            setEmployees(uniqueMockEmployees);
        }
    };

    useEffect(() => {
        if (open) fetchAllEmployees();
    }, [open]);

    const handleClose = () => {
        setOpen(false);
        setSelectedEmployee(null);
    };

    // Calculate count from the dashboard passing it down, or fetch it. For now, we will fetch it.
    useEffect(() => {
        fetchAllEmployees();
    }, [])

    const allEmployeesCount = employees.length;

    const dialogPaperProps = {
        sx: {
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0'
        }
    };

    return (
        <>
            {/* ── Widget Card ── */}
            <div className="manager-widget-card widget-cyan" style={{ cursor: 'pointer' }} onClick={() => setOpen(true)}>
                <Box className="manager-widget-header">
                    <Box className="manager-widget-info">
                        <Typography className="manager-widget-title"> Employee Attendance </Typography>
                        <Typography className="manager-widget-value"> {allEmployeesCount} </Typography>
                    </Box>
                    <Box className="manager-widget-icon-box">
                        <EventNoteIcon />
                    </Box>
                </Box>
                <Button className="manager-widget-action">
                    View
                </Button>
            </div>

            {/* ── Dialog ── */}
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
                PaperProps={dialogPaperProps}
            >
                <DialogTitle sx={{
                    fontWeight: 700,
                    color: '#1e293b',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2.5
                }}>
                    {selectedEmployee
                        ? `Attendance — ${selectedEmployee.name}`
                        : '📋 Employee Attendance Directory'}
                    <IconButton size="small" onClick={handleClose} sx={{ color: '#64748b' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ background: '#ffffff', borderColor: '#e2e8f0', py: 3 }}>
                    {selectedEmployee ? (
                        <EmployeeAttendanceCalendar
                            employeeId={selectedEmployee.id}
                            employeeName={selectedEmployee.name}
                            onBack={() => setSelectedEmployee(null)}
                        />
                    ) : (
                        <EmployeeList
                            employees={employees}
                            onSelectEmployee={setSelectedEmployee}
                        />
                    )}
                </DialogContent>

                <DialogActions sx={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', p: 2 }}>
                    {selectedEmployee && (
                        <Button
                            variant="outlined"
                            onClick={() => setSelectedEmployee(null)}
                            sx={{
                                color: '#0d47a1',
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: '8px',
                                borderColor: '#e2e8f0'
                            }}
                        >
                            ← Back to List
                        </Button>
                    )}
                    <Button
                        onClick={handleClose}
                        sx={{
                            color: '#e53935',
                            textTransform: 'none',
                            fontWeight: 600
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EmployeeAttendanceWidget;
