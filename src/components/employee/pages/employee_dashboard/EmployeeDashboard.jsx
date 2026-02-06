import React, { useState, useRef, useEffect } from "react";
import "./EmployeeDashboard.css";
import AttendanceView from "./components/AttendanceView";
import LeaveHistory from "./components/LeaveHistory";
import ApplyLeave from "./components/ApplyLeave";
import TaskManager from "./components/TaskManager";
import AnnouncementsView from "./components/AnnouncementsView";
import { useNavigate } from "react-router-dom";
import ProfileView from "./components/ProfileView";
import api  from '../../../../services/service.js';
import { useAppContext } from "../../../context/AppContext.jsx";

export default function EmployeeDashboard() {

  const { userData } = useAppContext();
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [active, setActive] = useState("dashboard");
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(); // Dynamic count
  const profileRef = useRef(null);

  // Data State
  const [editProfile, setEditProfile] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Check-in State
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);


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
      console.log(err);
    }
  };

  useEffect(() => {
    if(userData){
      fetchDashboardData();
    }

  }, [userData]);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const presentDays = attendance.filter(a => {

    if(!a.date) return false;

    const d = new Date(a.date);

    return (
      d.getMonth() === currentMonth &&
      d.getFullYear() === currentYear &&
      ["PRESENT", "ONGOING"].includes(a.status)
    );

  }).length;


  const totalLeavesTaken = leaves.reduce((total, leave) => {

    if (leave.status !== "APPROVED") return total;

    let start = new Date(leave.start_date);
    let end = new Date(leave.end_date);

    let count = 0;

    while (start <= end) {

      if (
        start.getMonth() === currentMonth &&
        start.getFullYear() === currentYear
      ){
        count++;
      }

      start.setDate(start.getDate() + 1);
    }

    return total + count;

  }, 0);


  const tasksInProgress = tasks.filter(
    t => t.status === "IN_PROGRESS" || t.status === "PENDING"
  ).length;

  const tasksCompleted = tasks.filter(
    t => t.status === "COMPLETED"
  ).length;


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
        console.log(err);
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

  const handleNotificationClick = () => {
    setNotificationCount(0);
    setActive("announcements");
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
      console.log(err.response?.data || err);
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
      console.log(err.response?.data || err);
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
          <div className={`notification ${notificationCount > 0 ? 'has-notifications' : ''}`} onClick={handleNotificationClick}>
            <svg className="notification-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {notificationCount > 0 && <span className="badge">{notificationCount}</span>}
          </div>
          <div className="profile-area" ref={profileRef}>
            <button
              className="profile-toggle"
              onClick={() => setShowProfile(!showProfile)}
              aria-label="Profile menu"
              title="Click to open profile menu"
            >
              <div className="header-avatar">
                {userData?.profilePicture ? (
                  <img src={userData.profilePicture} alt="Profile" />
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
                    <div className="working-badges">🕒 Working</div>
                    <button className="checkout-btn" onClick={handleCheckOut}>Check Out</button>
                  </div>
                ) : (
                  <div className="status-content">
                    <div className="check-time">In: {formatTime(checkInTime)}</div>
                    <div className="check-time">Out: {formatTime(checkOutTime)}</div>
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
                <p className="apply-Leave">Apply Leave</p>
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
