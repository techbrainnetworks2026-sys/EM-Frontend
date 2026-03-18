import React, { lazy, Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import notificationService from './services/notificationService.js';

// Lazy load components for better performance
const SignUp = lazy(() => import('./components/employee/pages/auth/SignUp.jsx'));
const SignIn = lazy(() => import('./components/employee/pages/auth/SignIn.jsx'));
const ForgotPassword = lazy(() => import('./components/employee/pages/auth/ForgotPassword.jsx'));
const ResetPassword = lazy(() => import('./components/employee/pages/auth/ResetPassword.jsx'));
const AddEmployee = lazy(() => import('./components/manager/AddEmployee.jsx'));
const PendingEmployees = lazy(() => import('./components/manager/PendingEmployees.jsx'));
const AddRole = lazy(() => import('./components/manager/AddRole.jsx'));
const LeaveManagement = lazy(() => import('./components/manager/LeaveManagement.jsx'));
const AddTask = lazy(() => import('./components/manager/AddTask.jsx'));
const EmployeeSummary = lazy(() => import('./components/manager/EmployeeSummary.jsx'));
const Announcement = lazy(() => import('./components/manager/Announcement.jsx'));
const Profile = lazy(() => import('./components/manager/Profile.jsx'));
const Dashboard = lazy(() => import('./components/manager/Dashboard.jsx'));
const ManagerLayout = lazy(() => import('./components/manager/ManagerHome.jsx'));
const EmployeeDashboard = lazy(() => import('./components/employee/pages/employee_dashboard/EmployeeDashboard.jsx'));

// Loading fallback component
const PageLoader = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '20px' }}>
        <div className="loader"></div>
        <div style={{ color: '#0d47a1', fontWeight: 600, fontFamily: 'Work Sans' }}>Loading...</div>
    </div>
);

function App() {
    useEffect(() => {
        // Initialize notification service (service worker, etc.)
        notificationService.init();

        // Request permission after a small delay or user interaction
        // For now, we'll try to request on load if not already prompted
        const timer = setTimeout(() => {
            notificationService.requestPermission();
        }, 5000);

        return () => clearTimeout(timer);
    }, []);


    return (
        <>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path='/employee/dashboard' element={<EmployeeDashboard />} />
                    <Route path="/manager" element={<ManagerLayout />}>
                        <Route path='dashboard' element={<Dashboard />} />
                        <Route path='addemployee' element={<AddEmployee />} />
                        <Route path='pending-employees' element={<PendingEmployees />} />
                        <Route path='addRole' element={<AddRole />} />
                        <Route path='leave-management' element={<LeaveManagement />} />
                        <Route path='task-assign' element={<AddTask />} />
                        <Route path='employee-task/:id' element={<EmployeeSummary />} />
                        <Route path='announcement' element={<Announcement />} />
                        <Route path='profile' element={<Profile />} />
                    </Route>
                </Routes>
            </Suspense>
        </>
    )
}

export default App