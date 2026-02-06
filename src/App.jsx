import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from './components/employee/pages/auth/SignUp.jsx';
import SignIn from './components/employee/pages/auth/SignIn.jsx';
import ForgotPassword from './components/employee/pages/auth/ForgotPassword.jsx';
import ResetPassword from './components/employee/pages/auth/ResetPassword.jsx';
import AddEmplyee from './components/manager/AddEmplyee.jsx';
import AddRole from './components/manager/AddRole.jsx';
import LeaveManagement from './components/manager/LeaveManagement.jsx';
import AddTask from './components/manager/AddTask.jsx';
import EmployeeSummary from './components/manager/EmployeeSummary.jsx';
import Announcement from './components/manager/Announcement.jsx';
import Profile from './components/manager/Profile.jsx';
import Dashboard from './components/manager/Dashboard.jsx';
import ManagerLayout from './components/manager/ManagerHome.jsx';
import EmployeeDashboard from './components/employee/pages/employee_dashboard/EmployeeDashboard.jsx';

function App() {


    return (
        <>
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path='/employee/dashboard' element={<EmployeeDashboard />} />
                <Route path="/manager" element={<ManagerLayout />}>
                    <Route path='dashboard' element={<Dashboard />} />
                    <Route path='addemployee' element={<AddEmplyee />} />
                    <Route path='addRole' element={<AddRole />} />
                    <Route path='leave-management' element={<LeaveManagement />} />
                    <Route path='task-assign' element={<AddTask />} />
                    <Route path='employee-task/:id' element={<EmployeeSummary />} />
                    <Route path='announcement' element={<Announcement />} />
                    <Route path='profile' element={<Profile />} />
                </Route>
            </Routes>
        </>
    )
}

export default App