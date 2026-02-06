import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './ForgotPassword.css'; // Reuse style
import { Snackbar } from '@mui/material';
import MuiAlert from "@mui/material/Alert";
import logo from '../../../../../public/tech-logo.png';
import { validatePassword } from '../../utils/validation';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email; // Get email passed from previous page

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [loading, setLoading] = useState(false);

    // Redirect if no email (direct access prevention)
    if (!email) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <h2>Error</h2>
                    <p>Invalid access. Please initiate forgot password first.</p>
                    <Link to="/forgot-password" className="auth-button" style={{ textAlign: 'center', textDecoration: 'none' }}>Go Back</Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const passError = validatePassword(newPassword);
        if (passError) {
            setMessage(passError);
            setSeverity('error');
            setOpen(true);
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match");
            setSeverity('error');
            setOpen(true);
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://127.0.0.1:8000/api/accounts/reset-password/', {
                email,
                new_password: newPassword,
                confirm_password: confirmPassword
            });
            setMessage('Password reset successfully!');
            setSeverity('success');
            setOpen(true);
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            setMessage(err.response?.data?.error || 'Failed to reset password.');
            setSeverity('error');
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };

    return (
        <>
            <div className="auth-container">
                <img className='tech-logo' src={logo} alt="tech-logo" />
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>Reset Password</h1>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="auth-form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>

            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleClose}
                    severity={severity}
                    sx={{ width: "100%" }}
                >
                    {message}
                </MuiAlert>
            </Snackbar>
        </>
    );
};

export default ResetPassword;
