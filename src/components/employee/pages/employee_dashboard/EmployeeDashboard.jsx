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

export default function EmployeeDashboard() {

  const { userData } = useAppContext();
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [active, setActive] = useState(() => {
    return sessionStorage.getItem("employee_active_view") || "dashboard";
  });
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0); // Dynamic count
  const [showNewNotificationAnimation, setShowNewNotificationAnimation] = useState(false);
  const profileRef = useRef(null);

  // Data State
  const [editProfile, setEditProfile] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Check-in State
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(null);


  // Persist active view to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("employee_active_view", active);
  }, [active]);

  // Live elapsed time timer while checked in
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
        setElapsedTime(`${hrs}h ${mins}m ${secs}s`);
      };
      calcElapsed();
      const interval = setInterval(calcElapsed, 1000);
      return () => clearInterval(interval);
    }
  }, [isCheckedIn, checkInTime]);

  // Calculate total worked hours between check-in and check-out
  const getWorkedHours = () => {
    if (!checkInTime || !checkOutTime) return null;
    const [h1, m1, s1] = checkInTime.split(':').map(Number);
    const [h2, m2, s2] = checkOutTime.split(':').map(Number);
    const inMs = (h1 * 3600 + m1 * 60 + (s1 || 0)) * 1000;
    const outMs = (h2 * 3600 + m2 * 60 + (s2 || 0)) * 1000;
    const diffMs = outMs - inMs;
    if (diffMs <= 0) return '0h 0m';
    const totalMin = Math.floor(diffMs / 60000);
    const hrs = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    return `${hrs}h ${mins}m`;
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    if (showProfile) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showProfile]);

  const fetchDashboardData = async () => {
    try {
      const [attendanceRes, leaveRes, taskRes] = await Promise.all([
        api.get("attendance/history/"),
        api.get("leave/history/"),     // your employee leave history endpoint
        api.get('task/tasks/') // employee tasks
      ]);
      setAttendance(attendanceRes.data);
      setLeaves(leaveRes.data);
      setTasks(taskRes.data);
    } catch (err) {
      // Error handled
    }
  };

  // Fetch notification count
  const fetchNotificationCount = async () => {
    try {
      const response = await api.get('notifications/unread-count/');
      const newCount = response.data.unread_count || 0;

      // Show shake animation only when count increases
      if (newCount > notificationCount) {
        setShowNewNotificationAnimation(true);
        setTimeout(() => setShowNewNotificationAnimation(false), 600);
      }

      setNotificationCount(newCount);
    } catch (err) {
      // Error handled
    }
  };

  useEffect(() => {
    if (userData) {
      fetchDashboardData();
      fetchNotificationCount();

      // Connect to WebSocket for real-time updates
      notificationService.connectWebSocket(userData.id, (data) => {
        if (data.type === 'notification_count') {
          setNotificationCount(data.unread_count);

          // Show shake animation if there's a new notification
          if (data.new_notification) {
            setShowNewNotificationAnimation(true);
            setTimeout(() => setShowNewNotificationAnimation(false), 600);

            // Trigger a browser notification if supported (optional, handled by sw if background)
            if (Notification.permission === 'granted' && document.visibilityState === 'visible') {
              new Notification(data.new_notification.title, {
                body: data.new_notification.message,
                icon: '/icon.png'
              });
            }
          }
        }
      });

      return () => {
        notificationService.disconnectWebSocket();
      };
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
    if (!leave) return null;
    return leave.duration_type;
  };

  const presentDays = useMemo(() => {
    // Generate all days in current month up to today
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = now.getDate();
    let count = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      if (date > now) continue;
      const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      const hasAttendance = attendance.some(a => a.date === dateStr && ["PRESENT", "ONGOING"].includes(a.status));
      const leaveType = getLeaveStatusForDate(dateStr);

      if (hasAttendance || leaveType === 'HOURLY' || leaveType === 'HALF_DAY') {
        count++;
      }
    }
    return count;
  }, [attendance, leaves, currentMonth, currentYear, now]);


  const totalLeavesTaken = useMemo(() => {
    let count = 0;

    // 1. Count full day approved leaves for the current year
    leaves.forEach(leave => {
      if (leave.status.toUpperCase() === "APPROVED" && leave.duration_type === 'FULL_DAY') {
        let start = new Date(leave.start_date);
        let end = new Date(leave.end_date);
        while (start <= end) {
          if (start.getFullYear() === currentYear) {
            count++;
          }
          start.setDate(start.getDate() + 1);
        }
      }
    });

    // 2. Count absent days in the current year
    const startOfYear = new Date(currentYear, 0, 1);
    let curr = new Date(startOfYear);
    const today = new Date();

    while (curr <= today) {
      const dateStr = `${curr.getFullYear()}-${(curr.getMonth() + 1).toString().padStart(2, '0')}-${curr.getDate().toString().padStart(2, '0')}`;

      const isAbsent = attendance.some(a => a.date === dateStr && a.status === "ABSENT");
      if (isAbsent) {
        count++;
      }

      curr.setDate(curr.getDate() + 1);
    }

    return count;
  }, [leaves, attendance, currentYear]);


  const tasksInProgress = useMemo(() => {
    return tasks.filter(
      t => t.status === "IN_PROGRESS" || t.status === "PENDING"
    ).length;
  }, [tasks]);

  const tasksCompleted = useMemo(() => {
    return tasks.filter(
      t => t.status === "COMPLETED"
    ).length;
  }, [tasks]);


  useEffect(() => {
    const fetchTodayAttendance = async () => {
      try {
        const res = await api.get("attendance/today/");

        if (!res.data || Object.keys(res.data).length === 0) return;

        if (res.data?.check_in && !res.data?.check_out) {
          setIsCheckedIn(true);
          setCheckInTime(res.data.check_in);
        }

        if (res.data?.check_in && res.data?.check_out) {
          setIsCheckedIn(false);
          setCheckInTime(res.data.check_in);
          setCheckOutTime(res.data.check_out);
        }

      } catch (err) {
        // Error handled
      }
    };

    fetchTodayAttendance();
  }, []);

  const formatTime = (time) => {
    if (!time) return "";

    return new Date(`1970-01-01T${time}`)
      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleApplyLeave = (newLeave) => {
    const leaveEntry = {
      id: leaves.length + 1,
      ...newLeave,
      status: 'Pending'
    };
    setLeaves([...leaves, leaveEntry]);
    setActive('leaves'); // Redirect to history
  };

  const handleTaskStatusUpdate = (taskId, newStatus) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
  };

  const handleAddTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: tasks.length + 1 }]);
  };

  const handleNotificationClick = async () => {
    try {
      await notificationService.markAsRead();
      setNotificationCount(0);
      setShowNewNotificationAnimation(false);
      setActive("announcements");
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/');
  };



  const handleCheckIn = async (e) => {
    e.stopPropagation();

    try {
      const res = await api.post("attendance/check-in/");

      setIsCheckedIn(true);
      setCheckInTime(res.data.time);   // ← TIME FROM DJANGO
      setCheckOutTime(null);
      fetchDashboardData();
    } catch (err) {
      // Error handled
    }
  };

  const handleCheckOut = async (e) => {
    e.stopPropagation();

    try {
      const res = await api.post("attendance/check-out/");

      setIsCheckedIn(false);
      setCheckOutTime(res.data.time);
      fetchDashboardData();
    } catch (err) {
      // Error handled
    }
  };



  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="layout">


      {/* Header */}
      <header className="header">
        <div className="header-left">
          <button className="hamburger-menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div className="logo">Techbrain Networks</div>
        </div>
        <div className="header-right">
          <div
            className={`notification ${notificationCount > 0 ? 'has-notifications' : ''} ${showNewNotificationAnimation ? 'new-notification' : ''}`}
            onClick={handleNotificationClick}
            title={notificationCount > 0 ? `You have ${notificationCount} new notification(s)` : 'No new notifications'}
          >
            <svg className="notification-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {notificationCount > 0 && <span className="badge" title={`${notificationCount} new`}>{notificationCount}</span>}
          </div>

          <div className="profile-area" ref={profileRef}>
            <button
              className="profile-toggle"
              onClick={() => setShowProfile(!showProfile)}
              aria-label="Profile menu"
              title="Click to open profile menu"
            >
              <div className="header-avatar">
                {userData?.profile_picture_url ? (
                  <img src={userData.profile_picture_url} alt="Profile" />
                ) : (
                  <span className="avatar-placeholder">👤</span>
                )}
              </div>
              <span className="profile-name">{userData?.username}</span>
            </button>
            {showProfile && (
              <div className="profile-dropdown">
                <button onClick={() => {
                  setActive("profile");
                  setShowProfile(false);
                }}>Profile</button>
                <button className="logout" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
          ✕
        </button>
        <button className={active === 'dashboard' ? 'active' : ''} onClick={() => { setActive("dashboard"); setSidebarOpen(false); }}>Dashboard</button>
        <button className={active === 'attendance' ? 'active' : ''} onClick={() => { setActive("attendance"); setSidebarOpen(false); }}>Attendance</button>
        <button className={active === 'leaves' ? 'active' : ''} onClick={() => { setActive("leaves"); setSidebarOpen(false); }}>Leaves</button>
        <button className={active === 'tasks' ? 'active' : ''} onClick={() => { setActive("tasks"); setSidebarOpen(false); }}>Tasks</button>
        <button className={active === 'applyLeave' ? 'active' : ''} onClick={() => { setActive("applyLeave"); setSidebarOpen(false); }}>Apply Leave</button>
        <button className={active === 'announcements' ? 'active' : ''} onClick={() => { setActive("announcements"); setSidebarOpen(false); }}>Announcements</button>
      </aside>

      {/* Main Content */}
      <main className="content">

        {/* DASHBOARD HOME */}
        {active === "dashboard" && (
          <div className="dashboard-home">
            <h2 className="welcome-user">Welcome, {userData?.username}</h2>
            <div className="cards">
              {/* Widget 1: Total Days Present */}


              {/* Widget 2: Today's Status (Interactive) */}
              <div className="card checkin-card">
                <h2>Today's Status</h2>
                <div className="date-text">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>

                {!isCheckedIn && !checkOutTime ? (
                  <div className="status-content">
                    <div className="status-text">Not Checked In</div>
                    <button className="checkin-btn" onClick={handleCheckIn}>Check In</button>
                  </div>
                ) : isCheckedIn ? (
                  <div className="status-content">
                    <div className="check-time">In: {formatTime(checkInTime)}</div>
                    {elapsedTime && <div className="hours-worked">⏱️ {elapsedTime}</div>}
                    <div className="working-badges">🕒 Working</div>
                    <button className="checkout-btn" onClick={handleCheckOut}>Check Out</button>
                  </div>
                ) : (
                  <div className="status-content">
                    <div className="check-time">In: {formatTime(checkInTime)}</div>
                    <div className="check-time">Out: {formatTime(checkOutTime)}</div>
                    {getWorkedHours() && <div className="hours-worked">⏱️ Worked: {getWorkedHours()}</div>}
                    <div className="completed-badge">✅ Day Completed</div>
                  </div>
                )}
              </div>
              <div className="card" onClick={() => setActive('attendance')}>
                <h3>Total Days Present</h3>
                <div className="card-value">{presentDays} / 22</div>
                <p>
                  {now.toLocaleString('default', { month: 'long' })} {currentYear}
                </p>
              </div>

              {/* Widget 2 */}
              <div className="card" onClick={() => setActive('leaves')}>
                <h3>Yearly Leave Taken</h3>
                <div className="card-value">{totalLeavesTaken} Days</div>
                <p>View History</p>
              </div>

              {/* Widget 3 */}
              <div className="card" onClick={() => setActive('tasks')}>
                <h3>Task Completion</h3>
                <div className="card-stat">In Progress: <b>{tasksInProgress}</b></div>
                <div className="card-stat">Completed: <b>{tasksCompleted}</b></div>
              </div>

              {/* Widget 4 */}
              <div className="card highlight-card" onClick={() => setActive('applyLeave')}>
                <h4 className="apply-Leave">Apply Leave</h4>
              </div>
            </div>
          </div>
        )}

        {/* SUB VIEWS */}
        {active === "dashboard" && (
          // ... (Dashboard widgets are above, this section conditionally renders if I extracted them, 
          // but based on current file structure, 'dashboard' view renders the cards.
          // Wait, looking at lines 122-187, the cards are rendered when active==='dashboard'.
          // Lines 195+ are for OTHER views.
          // I need to check where active === "attendance" is handled.
          // Ah, I need to see the line where AttendanceView is rendered.
          null
        )}

        {/* Render Views based on active state */}
        {active === "attendance" && <AttendanceView attendance={attendance} leaves={leaves} />}
        {active === "leaves" && <LeaveHistory leaves={leaves} />}
        {active === "applyLeave" && <ApplyLeave onApply={handleApplyLeave} />}
        {active === "tasks" && <TaskManager tasks={tasks} onUpdateStatus={handleTaskStatusUpdate} onAddTask={handleAddTask} />}
        {active === "announcements" && <AnnouncementsView />}

        {active === "profile" && (
          <ProfileView
            user={userData}
            editProfile={editProfile}
            setEditProfile={setEditProfile}
          />
        )}

      </main>
    </div>
  );
}
