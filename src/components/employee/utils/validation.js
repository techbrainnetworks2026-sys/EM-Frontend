export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!re.test(email)) return "Invalid email format";
    return "";
};

export const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (!/[A-Za-z]/.test(password)) return "Password must contain at least one letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    return "";
};

export const validateMobile = (mobile) => {
    const re = /^[0-9]{10}$/;
    if (!mobile) return "Mobile number is required";
    if (!re.test(mobile)) return "Mobile number must be 10 digits";
    return "";
};

export const validateRequired = (name, value) => {
    if (!value || value.trim() === "") return `${name} is required`;
    return "";
};
