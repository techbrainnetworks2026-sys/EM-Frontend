import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Navbar from "./components/Navbar.jsx";
import '../../App.css'
import { useAppContext } from "../context/AppContext.jsx";

function ManagerLayout() {

    const { sidebarOpen, isMobile } = useAppContext();

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-section" style={{ marginLeft : isMobile ? "0px" : (sidebarOpen ? "300px" : "80px"), transition: "margin 0.3s ease",}}>
                <Navbar />
                <div className="dashboard-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default ManagerLayout