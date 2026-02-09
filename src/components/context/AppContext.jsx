import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
import api from "../../services/service.js";
import axios from "axios";

const AppContext = createContext();

export const AppContextProvider = ({children}) => {

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    const Register = async (username,email,password,role,department,designation,blood_group,mobile_number) => {
        try {
            const res = await axios.post("https://tn-em-backend.onrender.com/api/accounts/register/",  {username,email,password,role,department,designation,blood_group,mobile_number});
            return res.data;
        }catch(err){
            throw err;
        }
    }

    const Login = async (email, password) => {
        try{
            const res = await axios.post("https://tn-em-backend.onrender.com/api/accounts/login/", {email, password});
            localStorage.setItem("token", res.data.token);
            setUserData(res.data);
            return res.data;
        }catch(err){
            throw err;
        }
    }

    useEffect(() => {
        const fetchUserDetails = async () => {
            try{
                const res =  await api.get("accounts/me/");
                setUserData(res.data);
            }catch(err){
                console.log(err);
            }
        }
        fetchUserDetails();
    }, []);


    const value = {
        sidebarOpen,
        setSidebarOpen,
        isMobile,
        Register,
        Login,
        navigate,
        userData,
        setUserData,
    }

    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)