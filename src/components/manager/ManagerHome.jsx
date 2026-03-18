import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Navbar from "./components/Navbar.jsx";
import '../../App.css'
import { useAppContext } from "../context/AppContext.jsx";
import './ManagerLayout.css';

function ManagerLayout() {

    const { sidebarOpen } = useAppContext();

    return (
        <div className={`manager-app-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <Sidebar />
            <div className="manager-main-section">
                <Navbar />
                <div className="manager-dashboard-content" >
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default ManagerLayout