import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';
import { useAppContext } from '../../../context/AppContext.jsx';
import { Snackbar } from '@mui/material';
import MuiAlert from "@mui/material/Alert";
import { validateEmail, validateMobile, validatePassword, validateRequired } from '../../utils/validation.js';
import logo from '../../../../../public/tech-logo.png';

const SignUp = () => {
    const { Register } = useAppContext();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [bloodgrp, setBloodgrp] = useState("")
    const [dept, setDept] = useState("")
    const [design, setDesign] = useState("")
    const [pass, setPass] = useState("")
    const [cpass, setCPass] = useState("")
    const [role, setRole] = useState("")
    const [errors, setErrors] = useState({});

    const handleClose = (event, reason) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };

    const validate = () => {
        let tempErrors = {};
        let isValid = true;

        const nameError = validateRequired("Username", name);
        if (nameError) { tempErrors.name = nameError; isValid = false; }

        const emailError = validateEmail(email);
        if (emailError) { tempErrors.email = emailError; isValid = false; }

        const mobileError = validateMobile(mobile);
        if (mobileError) { tempErrors.mobile = mobileError; isValid = false; }

        const bloodError = validateRequired("Blood group", bloodgrp);
        if (bloodError) { tempErrors.bloodgrp = bloodError; isValid = false; }

        const deptError = validateRequired("Department", dept);
        if (deptError) { tempErrors.dept = deptError; isValid = false; }

        const designError = validateRequired("Designation", design);
        if (designError) { tempErrors.design = designError; isValid = false; }

        const roleError = validateRequired("Role", role);
        if (roleError) { tempErrors.role = roleError; isValid = false; }

        const passError = validatePassword(pass);
        if (passError) { tempErrors.pass = passError; isValid = false; }

        const cpassError = validateRequired("Confirm password", cpass);
        if (cpassError) {
            tempErrors.cpass = cpassError;
            isValid = false;
        } else if (pass !== cpass) {
            tempErrors.cpass = "Passwords do not match";
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const res = await Register(name, email, pass, role, dept, design, bloodgrp, mobile,);
                setOpen(true);
                setMessage("User Data sent to Manager Approval, Successfully!")
                setSeverity('success');
                setTimeout(() => navigate("/"), 2500);
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

    return (
        <>
            <div className="signup-container">
                <img className='tech-logo' src={logo} alt="techlogo" /> 
                <div className="signup-card">
                    <div className="signup-header">
                        <h1>Create Account</h1>
                    </div>

                    <form className="signup-form" onSubmit={handleSubmit} noValidate>
                        <div className="signup-form-row">
                            <div className="signup-form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Enter your username"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (errors.name) setErrors({ ...errors, name: null });
                                    }}
                                    className={errors.name ? 'input-error' : ''}
                                />
                                {errors.name && <span className="error-message">{errors.name}</span>}
                            </div>
                            <div className="signup-form-group">
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
                        </div>

                        <div className="signup-form-row">
                            <div className="signup-form-group">
                                <label>Mobile Number</label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    placeholder="Enter your mobile number"
                                    value={mobile}
                                    onChange={(e) => {
                                        setMobile(e.target.value);
                                        if (errors.mobile) setErrors({ ...errors, mobile: null });
                                    }}
                                    className={errors.mobile ? 'input-error' : ''}
                                />
                                {errors.mobile && <span className="error-message">{errors.mobile}</span>}
                            </div>
                            {/* <div className="signup-form-group">
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className={errors.dob ? 'input-error' : ''}
                            />
                            {errors.dob && <span className="error-message">{errors.dob}</span>}
                        </div> */}
                        </div>

                        <div className="signup-form-row">
                            <div className="signup-form-group">
                                <label>Blood Group</label>
                                <select
                                    name="bloodGroup"
                                    value={bloodgrp}
                                    onChange={(e) => {
                                        setBloodgrp(e.target.value);
                                        if (errors.bloodgrp) setErrors({ ...errors, bloodgrp: null });
                                    }}
                                    className={errors.bloodgrp ? 'input-error' : ''}
                                >
                                    <option value="">Select</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                                {errors.bloodgrp && <span className="error-message">{errors.bloodgrp}</span>}
                            </div>
                            <div className="signup-form-group">
                                <label>Department</label>
                                <input
                                    type="text"
                                    name="department"
                                    placeholder="Enter your department"
                                    value={dept}
                                    onChange={(e) => {
                                        setDept(e.target.value);
                                        if (errors.dept) setErrors({ ...errors, dept: null });
                                    }}
                                    className={errors.dept ? 'input-error' : ''}
                                />
                                {errors.dept && <span className="error-message">{errors.dept}</span>}
                            </div>
                        </div>

                        <div className="signup-form-row">
                            <div className="signup-form-group">
                                <label>Designation</label>
                                <input
                                    type="text"
                                    name="designation"
                                    placeholder="Enter your designation"
                                    value={design}
                                    onChange={(e) => {
                                        setDesign(e.target.value);
                                        if (errors.design) setErrors({ ...errors, design: null });
                                    }}
                                    className={errors.design ? 'input-error' : ''}
                                />
                                {errors.design && <span className="error-message">{errors.design}</span>}
                            </div>
                            <div className="signup-form-group">
                                <label>Role</label>
                                <select
                                    name="role"
                                    value={role}
                                    onChange={(e) => {
                                        setRole(e.target.value);
                                        if (errors.role) setErrors({ ...errors, role: null });
                                    }}
                                    className={errors.role ? 'input-error' : ''}
                                >
                                    <option value="">Select Role</option>
                                    <option value="EMPLOYEE">Employee</option>
                                    <option value="MANAGER">Manager</option>
                                </select>
                                {errors.role && <span className="error-message">{errors.role}</span>}
                            </div>
                        </div>

                        {/* <div className="signup-form-group">
                        <label>Address</label>
                        <textarea
                            name="address"
                            placeholder="Enter your address"
                            rows="2"
                            value={formData.address}
                            onChange={handleChange}
                            className={errors.address ? 'input-error' : ''}
                            style={{ resize: 'none' }}
                        ></textarea>
                        {errors.address && <span className="error-message">{errors.address}</span>}
                    </div> */}

                        <div className="signup-form-row">
                            <div className="signup-form-group">
                                <label>Create Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={pass}
                                    onChange={(e) => {
                                        setPass(e.target.value);
                                        if (errors.pass) setErrors({ ...errors, pass: null });
                                    }}
                                    className={errors.pass ? 'input-error' : ''}
                                />
                                {errors.pass && <span className="error-message">{errors.pass}</span>}
                            </div>
                            <div className="signup-form-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Enter your confirm password"
                                    value={cpass}
                                    onChange={(e) => {
                                        setCPass(e.target.value);
                                        if (errors.cpass) setErrors({ ...errors, cpass: null });
                                    }}
                                    className={errors.cpass ? 'input-error' : ''}
                                />
                                {errors.cpass && <span className="error-message">{errors.cpass}</span>}
                            </div>
                        </div>

                        <button type="submit" className="signup-auth-button">Sign Up</button>
                        <div className="signup-auth-footer">
                            Already have an account? <Link to="/">Sign In</Link>
                        </div>
                    </form>

                </div>
            </div>
            <Snackbar
                open={open}
                autoHideDuration={2000}
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

export default SignUp;
