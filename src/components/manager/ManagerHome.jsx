import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Navbar from "./components/Navbar.jsx";
import '../../App.css'
import { useAppContext } from "../context/AppContext.jsx";

function ManagerLayout() {

    const { sidebarOpen } = useAppContext();

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-section" style={{ marginLeft : sidebarOpen ? "300px" : "80px"}}>
                <Navbar />
                <div className="dashboard-content" >
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default ManagerLayout