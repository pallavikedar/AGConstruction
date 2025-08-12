import { useState, useEffect } from "react";
import "../admin/Admin.css";
import { Link, Outlet, useNavigate, NavLink } from "react-router-dom";
import {
  FaBoxes,
  FaBuilding,
  FaFileAlt,
  FaLandmark,
  FaTachometerAlt,
  FaUsers,
  FaUserFriends,
  FaSignOutAlt,
  FaSignInAlt,
} from "react-icons/fa";
import { RiFilePaper2Fill } from "react-icons/ri";
import { MdClose } from "react-icons/md";
import { FiMenu, FiX, FiChevronRight } from "react-icons/fi";
import { Bell } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../config";

function Admin() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState("");
  const token = JSON.parse(
    localStorage.getItem("employeROyalmadeLogin") || "{}"
  )?.token;

  const [count, setCount] = useState(0);
  useEffect(() => {
    const gettingRole =
      JSON.parse(localStorage.getItem("employeROyalmadeLogin")) || {};
    setRole(gettingRole.role);
  }, []);

  function handleLogIn() {
    navigate("/login");
  }

  function handleLogOut() {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;
    localStorage.removeItem("employeROyalmadeLogin");
    navigate("/login");
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const adminMenuItems = [
    { icon: FaTachometerAlt, label: "Dashboard", path: "/" },
    { icon: FaFileAlt, label: "Lead Management", path: "/lead" },
    { icon: FaLandmark, label: "Land Management", path: "/landpurchase" },
    { icon: FaBuilding, label: "Flat Management", path: "/flat" },
    { icon: FaUsers, label: "Customer Details", path: "/clist" },
    { icon: FaBoxes, label: "Stock Management", path: "/material" },
    { icon: FaUsers, label: "Office Management", path: "/office" },
    { icon: FaUserFriends, label: "Add Staff", path: "/employee" },
    { icon: FaUsers, label: "Structure", path: "/structure" },

    { icon: RiFilePaper2Fill, label: "Letter", path: "/letter" },
  ];
  const subAdminMenuItems = [
    { icon: FaTachometerAlt, label: "Dashboard", path: "/" },
    { icon: FaFileAlt, label: "Lead Management", path: "/lead" },
    { icon: FaLandmark, label: "Land Management", path: "/landpurchase" },
    { icon: FaBuilding, label: "Flat Management", path: "/flat" },
    { icon: FaUsers, label: "Customer Details", path: "/clist" },
    { icon: FaBoxes, label: "Stock Management", path: "/material" },
    { icon: FaUsers, label: "Office Management", path: "/office" },
    { icon: FaUserFriends, label: "Add Staff", path: "/employee" },
    { icon: FaUsers, label: "Structure", path: "/structure" },

    { icon: RiFilePaper2Fill, label: "Letter", path: "/letter" },
  ];

  const supervisorMenuItems = [
    { icon: FaBoxes, label: "Stock Management", path: "/material" },
  ];

  const employeeMenuItems = [
    { icon: FaFileAlt, label: "Lead Management", path: "/lead" },
  ];

  const appUserMenuItems = [
    { icon: FaBoxes, label: "Material Management", path: "/material" },
  ];

  const getMenuItems = () => {
    switch (role) {
      case "Admin":
        return adminMenuItems;
      case "SubAdmin":
        return subAdminMenuItems;
      case "Supervisor": // Handle potential typo in response data
        return supervisorMenuItems;

      case "Employee":
        return employeeMenuItems;
      default:
        return [];
    }
  };

  useEffect(() => {
    async function getNotificationCount() {
      try {
        const response = await axios.get(`${BASE_URL}/lead/alerts`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setCount(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getNotificationCount();
  }, []);

  return (
    <div className="admin-layout">
      {/* Header */}
      <header className="modern-header">
        <div className="header-content">
          <div className="header-left">
            <button
              className="sidebar-toggle"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>

          <div className="header-right">
            {role === "Admin" && (
              <div onClick={() => navigate("/notification")}>
                <button className="notification-button">
                  <Bell />
                  {count?.length > 0 && (
                    <span className="notification-count">
                      {count.length || 0}
                    </span>
                  )}
                </button>
              </div>
            )}

            {role && (
              <div className="user-info">
                <span className="user-role">{role}</span>
              </div>
            )}

            {role ? (
              <button onClick={handleLogOut} className="auth-button logout">
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            ) : (
              <button className="auth-button login" onClick={handleLogIn}>
                <FaSignInAlt />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside className={`modern-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <h2 className="SideLogo_name">
              <div className="AG_name">AG</div> Construction
            </h2>
          </div>
          <button className="sidebar-close" onClick={closeSidebar}>
            <MdClose />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3 className="nav-section-title">Navigation</h3>
            <ul className="nav-menu">
              {getMenuItems().map((item, index) => (
                <li key={index} className="nav-item">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    onClick={closeSidebar}
                  >
                    <div className="nav-icon">
                      <item.icon />
                    </div>
                    <span className="nav-label">{item.label}</span>
                    <FiChevronRight className="nav-arrow" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">
              {role ? role.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="user-details">
              <span className="user-name">{role || "Guest"}</span>
              <span className="user-status">Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarOpen ? "content-shifted" : ""}`}>
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Admin;
