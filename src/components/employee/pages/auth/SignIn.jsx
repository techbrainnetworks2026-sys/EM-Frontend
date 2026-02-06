import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignIn.css';
import { Snackbar } from '@mui/material';
import MuiAlert from "@mui/material/Alert";
import { useAppContext } from '../../../context/AppContext.jsx';
import { validateEmail, validateRequired } from '../../utils/validation';
import logo from '../../../../../public/tech-logo.png';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const { Login, navigate } = useAppContext();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    const validate = () => {
        let tempErrors = {};
        let isValid = true;

        const emailError = validateEmail(email);
        if (emailError) {
            tempErrors.email = emailError;
            isValid = false;
        }

        const passwordError = validateRequired("Password", password);
        if (passwordError) {
            tempErrors.password = passwordError;
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const res = await Login(email, password);
                setOpen(true);
                setMessage("User Logged in Successfully!")
                setSeverity('success');
                if (res.role === 'MANAGER') {
                    setTimeout(() => navigate("/manager/dashboard"), 2000);
                } else {
                    setTimeout(() => navigate("/employee/dashboard"), 2000);
                }
            } catch (err) {
                if (err.response?.data?.error) {
                    const errorMsg = err.response?.data?.error;
                    setMessage(errorMsg);
                    setSeverity("error");
                    setOpen(true);
                } else {
                    setMessage("Something went wrong, Please try again later.");
                    setSeverity("error");
                    setOpen(true);
                }
            }
        }
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };

    return (
        <>
            <div className="signin-container">
                <img className='tech-logo' style={{ width: '600px', height: '600px' }} src={logo} alt="tech-logo" />
                <div className="signin-card">
                    <div className="signin-header">
                        <h1>Sign in</h1>
                    </div>

                    <form className="signin-form" onSubmit={handleSubmit} noValidate>
                        <div className="signin-form-group">
                            <label>Email ID</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors({ ...errors, email: null });
                                }}
                                className={errors.email ? 'input-error' : ''}
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        <div className="signin-form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) setErrors({ ...errors, password: null });
                                }}
                                className={errors.password ? 'input-error' : ''}
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>

                        <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
                            <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Forgot password?</Link>
                        </div>

                        <button type="submit" className="signin-auth-button">Sign In</button>
                    </form>

                    <div className="signin-auth-footer">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </div>
                </div>
            </div>
            <Snackbar
                open={open}
                autoHideDuration={1800}
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

export default SignIn;
