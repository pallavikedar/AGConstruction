import { useNavigate } from "react-router-dom";
import {
  MdOutlineBarChart,
  MdGroups,
  MdDashboard,
  MdPersonAdd,
} from "react-icons/md";
import { FaLandmark, FaRegBuilding } from "react-icons/fa";
import { GiExplosiveMaterials } from "react-icons/gi";
import { IoIosDocument } from "react-icons/io";
import { FiTrendingUp, FiUsers, FiHome } from "react-icons/fi";
import "../admin/Home.css";

function Home() {
  const navigate = useNavigate();

  const role = JSON.parse(localStorage.getItem("employeROyalmadeLogin"))?.role;
  console.log(role);

  const adminModules = [
    {
      title: "Lead Management",
      description: "Manage and track all leads",
      icon: MdOutlineBarChart,
      route: "/lead",
      color: "#3b82f6",
      bgColor: "#eff6ff",
    },
    {
      title: "Land Management",
      description: "Handle land purchases and records",
      icon: FaLandmark,
      route: "/landpurchase",
      color: "#10b981",
      bgColor: "#ecfdf5",
    },
    {
      title: "Flat Management",
      description: "Manage flat inventory and sales",
      icon: FaRegBuilding,
      route: "/flat",
      color: "#f59e0b",
      bgColor: "#fffbeb",
    },
    {
      title: "Customer Details",
      description: "View and manage customer information",
      icon: MdGroups,
      route: "/clist",
      color: "#8b5cf6",
      bgColor: "#f5f3ff",
    },
    {
      title: "Stock Management",
      description: "Track construction materials",
      icon: GiExplosiveMaterials,
      route: "/material",
      color: "#ef4444",
      bgColor: "#fef2f2",
    },
    {
      title: "Structure Details",
      description: "Manage contractor information",
      icon: MdDashboard,
      route: "/structure",
      color: "#06b6d4",
      bgColor: "#ecfeff",
    },
    {
      title: "Add Staff",
      description: "Register new staff members",
      icon: MdPersonAdd,
      route: "/employee",
      color: "#84cc16",
      bgColor: "#f7fee7",
    },
    {
      title: "Letters",
      description: "Document management system",
      icon: IoIosDocument,
      route: "/letter",
      color: "#f97316",
      bgColor: "#fff7ed",
    },
  ];

  const supervisorModules = [
    {
      title: "Stock Management",
      description: "Track construction materials",
      icon: GiExplosiveMaterials,
      route: "/material",
      color: "#ef4444",
      bgColor: "#fef2f2",
    },
  ];
  const employeeModules = [
    {
      title: "Lead Management",
      description: "Manage and track all leads",
      icon: MdOutlineBarChart,
      route: "/lead",
      color: "#3b82f6",
      bgColor: "#eff6ff",
    },
  ];

  const currentModules = role === "Admin" || role === "SubAdmin" ? adminModules : role === "Employee" ? employeeModules : supervisorModules;

  return (
    <div className="home-container">
      <div className="welcome-section">
        <div className="welcome-content">
          <h1 className="welcome-title">
            Welcome To <span className="brand-name">AG Construction </span>{" "}
            Software
          </h1>
          <p className="welcome-subtitle">
            Your comprehensive real estate management solution
          </p>
          <div className="role-badge">
            <span className={`role-indicator ${role?.toLowerCase()}`}>
              {role} Dashboard
            </span>
          </div>
        </div>
      </div>

      {role && (
        <div className="dashboard-section">
          <div className="modules-grid">
            {currentModules.map((module, index) => (
              <div
                key={index}
                className="module-card"
                onClick={() => navigate(module.route)}
                style={{
                  "--card-color": module.color,
                  "--card-bg": module.bgColor,
                }}
              >
                <div className="module-header">
                  <div className="module-icon-wrapper">
                    <module.icon className="module-icon" />
                  </div>
                  <div className="module-badge">
                    {/* <span>{index + 1}</span> */}
                  </div>
                </div>
                <div className="module-content">
                  <h3 className="module-title">{module.title}</h3>
                  <p className="module-description">{module.description}</p>
                </div>
                <div className="module-footer">
                  <span className="module-action">Access Module →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!role && (
        <div className="no-access-section">
          <div className="no-access-content">
            <FiUsers className="no-access-icon" />
            <h3>Access Required</h3>
            <p>Please log in to access the dashboard features</p>
            <button
              className="login-prompt-btn"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
