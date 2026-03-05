import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Navbar from "./components/Navbar.jsx";
import '../../App.css'
import { useAppContext } from "../context/AppContext.jsx";
import './ManagerLayout.css';

function ManagerLayout() {

    const { sidebarOpen } = useAppContext();

    return (
        <div className="manager-app-layout">
            <Sidebar />
            <div className="manager-main-section" style={{ marginLeft: sidebarOpen ? "300px" : "80px" }}>
                <Navbar />
                <div className="manager-dashboard-content" >
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default ManagerLayout