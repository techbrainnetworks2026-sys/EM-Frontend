import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ForgotPassword.css';
import { Snackbar } from '@mui/material';
import MuiAlert from "@mui/material/Alert";
import logo from '../../../../../public/tech-logo.png';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [timer, setTimer] = useState(0);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://127.0.0.1:8000/api/accounts/forgot-password/', { email });
            setStep(2);
            setTimer(30);
            setMessage('OTP sent successfully to your email.');
            setSeverity('success');
            setOpen(true);
        } catch (err) {
            setMessage(err.response?.data?.error || 'Failed to send OTP. Please try again.');
            setSeverity('error');
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (timer > 0) return;
        setLoading(true);
        try {
            await axios.post('http://127.0.0.1:8000/api/accounts/forgot-password/', { email });
            setTimer(30);
            setMessage('OTP resent successfully.');
            setSeverity('success');
            setOpen(true);
        } catch (err) {
            setMessage(err.response?.data?.error || 'Failed to resend OTP.');
            setSeverity('error');
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://127.0.0.1:8000/api/accounts/verify-otp/', { email, otp });
            setMessage('OTP verified successfully.');
            setSeverity('success');
            setOpen(true);
            setTimeout(() => {
                navigate('/reset-password', { state: { email } });
            }, 1000);
        } catch (err) {
            setMessage(err.response?.data?.error || 'Invalid OTP.');
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
                        <h1>Forgot Password</h1>
                    </div>

                    {step === 1 ? (
                        <form className="auth-form" onSubmit={handleSendOtp}>
                            <div className="auth-form-group">
                                <label>Email ID</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="auth-button" disabled={loading}>
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </form>
                    ) : (
                        <form className="auth-form" onSubmit={handleVerifyOtp}>
                            <div className="auth-form-group">
                                <label>Enter OTP</label>
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    maxLength="6"
                                />
                            </div>
                            <button type="submit" className="auth-button" disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>

                            <div className="resend-container">
                                {timer > 0 ? (
                                    <span className="timer-text">Resend OTP in {timer}s</span>
                                ) : (
                                    <button
                                        type="button"
                                        className="resend-button"
                                        onClick={handleResendOtp}
                                        disabled={loading}
                                    >
                                        Resend OTP
                                    </button>
                                )}
                            </div>
                        </form>
                    )}

                    <div className="auth-footer">
                        Back to <Link to="/">Sign In</Link>
                    </div>
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

export default ForgotPassword;
