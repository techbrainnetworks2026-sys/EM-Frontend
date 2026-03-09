import React, { useState, useRef, useEffect, useMemo } from "react";
import "./EmployeeDashboard.css";
import AttendanceView from "./components/AttendanceView";
import LeaveHistory from "./components/LeaveHistory";
import ApplyLeave from "./components/ApplyLeave";
import TaskManager from "./components/TaskManager";
import AnnouncementsView from "./components/AnnouncementsView";
import { useNavigate } from "react-router-dom";
import ProfileView from "./components/ProfileView";
import api from '../../../../services/service.js';
import { useAppContext } from "../../../context/AppContext.jsx";
import notificationService from "../../../../services/notificationService.js";

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CampaignIcon from '@mui/icons-material/Campaign';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import HistoryIcon from '@mui/icons-material/History';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LoginIcon from '@mui/icons-material/Login';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import TimerIcon from '@mui/icons-material/Timer';

export default function EmployeeDashboard() {

  const { userData } = useAppContext();
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [active, setActive] = useState(() => {
    return sessionStorage.getItem("employee_active_view") || "dashboard";
  });
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNewNotificationAnimation, setShowNewNotificationAnimation] = useState(false);
  const profileRef = useRef(null);

  const [editProfile, setEditProfile] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    sessionStorage.setItem("employee_active_view", active);
  }, [active]);

  useEffect(() => {
    if (isCheckedIn && checkInTime) {
      const calcElapsed = () => {
        const now = new Date();
        const [h, m, s] = checkInTime.split(':').map(Number);
        const checkIn = new Date();
        checkIn.setHours(h, m, s, 0);
        const diffMs = now - checkIn;
        if (diffMs < 0) return;
        const totalSec = Math.floor(diffMs / 1000);
        const hrs = Math.floor(totalSec / 3600);
        const mins = Math.floor((totalSec % 3600) / 60);
        const secs = totalSec % 60;
        setElapsedTime(`${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      };
      calcElapsed();
      const interval = setInterval(calcElapsed, 1000);
      return () => clearInterval(interval);
    }
  }, [isCheckedIn, checkInTime]);

  const getWorkedHours = () => {
    if (!checkInTime || !checkOutTime) return "--:--:--";
    const [h1, m1, s1] = checkInTime.split(':').map(Number);
    const [h2, m2, s2] = checkOutTime.split(':').map(Number);
    const inMs = (h1 * 3600 + m1 * 60 + (s1 || 0)) * 1000;
    const outMs = (h2 * 3600 + m2 * 60 + (s2 || 0)) * 1000;
    const diffMs = outMs - inMs;
    if (diffMs <= 0) return '00:00:00';
    const totalSec = Math.floor(diffMs / 1000);
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    if (showProfile) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showProfile]);

  const fetchDashboardData = async () => {
    try {
      const [attendanceRes, leaveRes, taskRes] = await Promise.all([
        api.get("attendance/history/"),
        api.get("leave/history/"),
        api.get('task/tasks/')
      ]);
      setAttendance(attendanceRes.data);
      setLeaves(leaveRes.data);
      setTasks(taskRes.data);
    } catch (err) { 
      console.log("Error marking notifications as read:", err);
     }
  };

  const fetchNotificationCount = async () => {
    try {
      const response = await api.get('notifications/unread-count/');
      const newCount = response.data.unread_count || 0;
      if (newCount > notificationCount) {
        setShowNewNotificationAnimation(true);
        setTimeout(() => setShowNewNotificationAnimation(false), 600);
      }
      setNotificationCount(newCount);
    } catch (err) { 
      console.log("Error marking notifications as read:", err);
     }
  };

  useEffect(() => {
    if (userData) {
      fetchDashboardData();
      fetchNotificationCount();
      notificationService.connectWebSocket(userData.id, (data) => {
        if (data.type === 'notification_count') {
          setNotificationCount(data.unread_count);
          if (data.new_notification) {
            setShowNewNotificationAnimation(true);
            setTimeout(() => setShowNewNotificationAnimation(false), 600);
            if (Notification.permission === 'granted' && document.visibilityState === 'visible') {
              new Notification(data.new_notification.title, {
                body: data.new_notification.message,
                icon: '/icon.png'
              });
            }
          }
        }
      });
      return () => notificationService.disconnectWebSocket();
    }
  }, [userData]);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const getLeaveStatusForDate = (dateStr) => {
    const leave = leaves.find(l => {
      if (l.status.toUpperCase() !== "APPROVED") return false;
      return dateStr >= l.start_date && dateStr <= l.end_date;
    });
    return leave ? leave.duration_type : null;
  };

  const presentDays = useMemo(() => {
    const today = now.getDate();
    let count = 0;
    for (let day = 1; day <= today; day++) {
      const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const hasAttendance = attendance.some(a => a.date === dateStr && ["PRESENT", "ONGOING"].includes(a.status));
      const leaveType = getLeaveStatusForDate(dateStr);
      if (hasAttendance || leaveType === 'HOURLY' || leaveType === 'HALF_DAY') count++;
    }
    return count;
  }, [attendance, leaves, currentMonth, currentYear]);

  const totalLeavesTaken = useMemo(() => {
    let count = 0;
    leaves.forEach(leave => {
      if (leave.status.toUpperCase() === "APPROVED" && leave.duration_type === 'FULL_DAY') {
        let start = new Date(leave.start_date);
        let end = new Date(leave.end_date);
        while (start <= end) {
          if (start.getFullYear() === currentYear) count++;
          start.setDate(start.getDate() + 1);
        }
      }
    });
    attendance.forEach(a => {
      if (a.status === "ABSENT" && new Date(a.date).getFullYear() === currentYear) count++;
    });
    return count;
  }, [leaves, attendance, currentYear]);

  const tasksInProgress = useMemo(() => tasks.filter(t => t.status === "IN_PROGRESS" || t.status === "PENDING").length, [tasks]);
  const tasksCompleted = useMemo(() => tasks.filter(t => t.status === "COMPLETED").length, [tasks]);

  useEffect(() => {
    const fetchTodayAttendance = async () => {
      try {
        const res = await api.get("attendance/today/");
        if (!res.data || Object.keys(res.data).length === 0) return;
        if (res.data?.check_in) {
          setCheckInTime(res.data.check_in);
          if (!res.data?.check_out) setIsCheckedIn(true);
          else {
            setIsCheckedIn(false);
            setCheckOutTime(res.data.check_out);
          }
        }
      } catch (err) { 
        console.log("Error marking notifications as read:", err);
       }
    };
    fetchTodayAttendance();
  }, []);

  const formatTimeDisplay = (time) => {
    if (!time) return "--:--:--";
    const [h, m, s] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, s || 0);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  const dayProgress = Math.round((presentDays / 22) * 100);

  const handleApplyLeave = (newLeave) => {
    setLeaves([...leaves, { id: leaves.length + 1, ...newLeave, status: 'Pending' }]);
    setActive('leaves');
  };

  const handleTaskStatusUpdate = (taskId, newStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleAddTask = (newTask) => setTasks([...tasks, { ...newTask, id: tasks.length + 1 }]);

  const handleNotificationClick = async () => {
    try {
      await notificationService.markAsRead();
      setNotificationCount(0);
      setShowNewNotificationAnimation(false);
      setActive("announcements");
    } catch (err) { 
      console.log("Error marking notifications as read:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/');
  };

  const handleCheckAction = async (e) => {
    e.stopPropagation();
    try {
      if (!isCheckedIn) {
        const res = await api.post("attendance/check-in/");
        setIsCheckedIn(true);
        setCheckInTime(res.data.time);
        setCheckOutTime(null);
      } else {
        const res = await api.post("attendance/check-out/");
        setIsCheckedIn(false);
        setCheckOutTime(res.data.time);
      }
      fetchDashboardData();
    } catch (err) { 
      console.log("Error marking notifications as read:", err);
     }
  };

  return (
    <div className="layout">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="logo">Techbrain Networks</div>
        </div>
        <nav className="sidebar-nav">
          <button className={active === 'dashboard' ? 'active' : ''} onClick={() => { setActive("dashboard"); setSidebarOpen(false); }}>
            <DashboardIcon /> Dashboard
          </button>
          <button className={active === 'attendance' ? 'active' : ''} onClick={() => { setActive("attendance"); setSidebarOpen(false); }}>
            <AccessTimeIcon /> Attendance
          </button>
          <button className={active === 'leaves' ? 'active' : ''} onClick={() => { setActive("leaves"); setSidebarOpen(false); }}>
            <EventNoteIcon /> Leaves
          </button>
          <button className={active === 'tasks' ? 'active' : ''} onClick={() => { setActive("tasks"); setSidebarOpen(false); }}>
            <AssignmentIcon /> Tasks
          </button>
          <button className={active === 'applyLeave' ? 'active' : ''} onClick={() => { setActive("applyLeave"); setSidebarOpen(false); }}>
            <AddCircleOutlineIcon /> Apply Leave
          </button>
          <button className={active === 'announcements' ? 'active' : ''} onClick={() => { setActive("announcements"); setSidebarOpen(false); }}>
            <CampaignIcon /> Announcements
          </button>
        </nav>
        <div className="sidebar-footer">
          © {new Date().getFullYear()} Techbrain Networks
        </div>
      </aside>

      <div className="main-container">
        <header className="header">
          <div className="header-left">
            <button className="hamburger-menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div className="welcome-text">
              <h1>Welcome back, <span className="user-name">{userData?.username || 'User'}</span></h1>
              <p>Here's your daily overview</p>
            </div>
          </div>
          <div className="header-right">
            <div className={`notification ${notificationCount > 0 ? 'has-notifications' : ''} ${showNewNotificationAnimation ? 'new-notification' : ''}`} onClick={handleNotificationClick}>
              <NotificationsNoneIcon />
              {notificationCount > 0 && <span className="badge">{notificationCount}</span>}
            </div>
            <div className="profile-area" ref={profileRef}>
              <button className="header-avatar" onClick={() => setShowProfile(!showProfile)}>
                {userData?.profile_picture_url ? <img src={userData.profile_picture_url} alt="Profile" /> : <PersonOutlineIcon />}
              </button>
              {showProfile && (
                <div className="profile-dropdown">
                  <button className="profile-btn" onClick={() => { setActive("profile"); setShowProfile(false); }}><PersonOutlineIcon /> Profile</button>
                  <button onClick={handleLogout} className="logout-btn"><LogoutIcon /> Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="content">
          {active === "dashboard" && (
            <div className="dashboard-grid">
              <div className="card status-card">
                <div className="card-header">
                  <div className="header-title">
                    <h2>Today's Status</h2>
                    <p className="date-display">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div className="digital-clock">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                  </div>
                </div>
                <div className="status-stats-grid">
                  <div className="stat-item">
                    <div className="stat-label"><LoginIcon /> CHECK IN</div>
                    <div className="stat-value">{checkInTime ? formatTimeDisplay(checkInTime).split(' ')[0] : "--:--:--"}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label"><LogoutOutlinedIcon /> CHECK OUT</div>
                    <div className="stat-value">{checkOutTime ? formatTimeDisplay(checkOutTime).split(' ')[0] : "--:--:--"}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label"><TimerIcon /> TOTAL HOURS</div>
                    <div className="stat-value">{isCheckedIn ? elapsedTime : getWorkedHours()}</div>
                  </div>
                </div>
                <button className={`action-btn ${isCheckedIn ? 'checkout-style' : 'checkin-style'}`} onClick={handleCheckAction}>
                  {isCheckedIn ? 'Check Out' : 'Check In'}
                </button>
              </div>

              <div className="card mini-card" onClick={() => setActive('attendance')}>
                <div className="icon-wrapper blue"><CalendarMonthIcon /></div>
                <span className="card-label">DAYS PRESENT</span>
                <div className="main-value">
                  <span className="current">{presentDays}</span><span className="separator">/</span><span className="total">22</span>
                </div>
                <p className="sub-value">{currentTime.toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${dayProgress}%` }}></div></div>
                <div className="progress-text">Progress <span>{dayProgress}%</span></div>
              </div>

              <div className="card mini-card" onClick={() => setActive('leaves')}>
                <div className="icon-wrapper orange"><EventNoteIcon /></div>
                <span className="card-label">YEARLY LEAVES</span>
                <div className="main-value">
                  <span className="current">{totalLeavesTaken}</span><span className="unit">Days taken</span>
                </div>
                <p className="sub-value">24 remaining</p>
                <button className="footer-link"><HistoryIcon /> View History</button>
              </div>

              <div className="card middle-card">
                <span className="card-label">QUICK ACTIONS</span>
                <div className="quick-actions-grid">
                  <button className="quick-btn" onClick={() => setActive('applyLeave')}>
                    <AddCircleOutlineIcon /><span>Apply Leave</span>
                  </button>
                </div>
              </div>

              <div className="card mini-card" onClick={() => setActive('tasks')}>
                <div className="icon-wrapper red"><AssignmentIcon /></div>
                <span className="card-label">TASKS</span>
                <div className="main-value"><span className="current">{tasksInProgress}</span><span className="unit">In Progress</span></div>
                <div className="main-value"><span className="current">{tasksCompleted}</span><span className="unit">Completed</span></div>
                <button className="footer-link">View All Tasks ↗</button>
              </div>
            </div>
          )}

          {active === "attendance" && <AttendanceView attendance={attendance} leaves={leaves} />}
          {active === "leaves" && <LeaveHistory leaves={leaves} />}
          {active === "applyLeave" && <ApplyLeave onApply={handleApplyLeave} />}
          {active === "tasks" && <TaskManager tasks={tasks} onUpdateStatus={handleTaskStatusUpdate} onAddTask={handleAddTask} />}
          {active === "announcements" && <AnnouncementsView />}
          {active === "profile" && <ProfileView user={userData} editProfile={editProfile} setEditProfile={setEditProfile} />}
        </main>
      </div>
    </div>
  );
}
