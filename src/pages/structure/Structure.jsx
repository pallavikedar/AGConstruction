import { useState, useEffect } from "react";
import "../structure/structure.css";
import { BASE_URL } from "../../config";

import { useNavigate } from "react-router-dom";
import {
  BsFillBuildingsFill,
  BsEye,
  BsSearch,
  BsList,
  BsCheckCircle,
  BsClock,
  BsXCircle,
  BsInfoCircle,
} from "react-icons/bs";
import { MdApartment } from "react-icons/md";
import axios from "axios";

function Structure() {
  const token = JSON.parse(
    localStorage.getItem("employeROyalmadeLogin")
  )?.token;
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    async function getAllProject() {
      try {
        const response = await axios.get(`${BASE_URL}/getAllProjects`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = response.data;
        console.log(data);
        if (data) {
          setFilteredProjects(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getAllProject();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return (
          <BsClock className="structure-status-icon structure-status-progress" />
        );
      case "COMPLETE":
        return (
          <BsCheckCircle className="structure-status-icon structure-status-complete" />
        );
      case "INACTIVE":
        return (
          <BsXCircle className="structure-status-icon structure-status-inactive" />
        );
      default:
        return (
          <BsInfoCircle className="structure-status-icon structure-status-default" />
        );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return "structure-status-progress";
      case "COMPLETE":
        return "structure-status-complete";
      case "INACTIVE":
        return "structure-status-inactive";
      default:
        return "structure-status-default";
    }
  };

  const getProgressPercentage = (completed, total) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const searchBar = filteredProjects.filter((item) => {
    return item.name.toLowerCase().includes(searchTerm.toLocaleLowerCase());
  });

  function handleAddStructure(id, name) {
    navigate(`/structureDetail/${id}/${name}`);
  }
  return (
    <div className="structure-main-container">
      {/* Header Section */}
      <div className="structure-header">
        <div className="structure-header-content">
          <div className="structure-title-section">
            <div>
              <h1 className="structure-title">Structure Management</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="structure-controls">
        <div className="structure-controls-left">
          {/* Search Bar */}
          <div className="structure-search-container">
            <BsSearch className="structure-search-icon" />
            <input
              type="text"
              placeholder="Search projects by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="structure-search-input"
            />
          </div>
        </div>

        <div className="structure-controls-right">
          {/* View Mode Toggle */}
          <div className="structure-view-toggle">
            <button
              className={`structure-view-btn ${
                viewMode === "grid" ? "structure-view-active" : ""
              }`}
              onClick={() => setViewMode("grid")}
            >
              <BsList />
            </button>
            <button
              className={`structure-view-btn ${
                viewMode === "list" ? "structure-view-active" : ""
              }`}
              onClick={() => setViewMode("list")}
            >
              <BsList />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="structure-projects-section">
        {searchBar.length > 0 ? (
          <div
            className={`structure-projects-container ${
              viewMode === "list" ? "structure-list-view" : ""
            }`}
          >
            {searchBar.map((item, index) => {
              const progressPercentage = getProgressPercentage(
                item.completedFlats,
                item.totalFlats
              );

              return (
                <div key={index} className="structure-project-card">
                  <div className="structure-card-header">
                    <div className="structure-building-icon-container">
                      <BsFillBuildingsFill className="structure-building-icon" />
                    </div>
                    <div className="structure-project-info">
                      <h3 className="structure-project-name">{item.name}</h3>
                    </div>
                    <div className="structure-status-container">
                      {getStatusIcon(item.status)}
                      <span
                        className={`structure-status-badge ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="structure-card-body">
                    <div className="structure-project-details">
                      <div className="structure-detail-item">
                        <span className="structure-detail-label">
                          Building Size:
                        </span>
                        <span className="structure-detail-value">
                          {item.buildingSize}
                        </span>
                      </div>
                      <div className="structure-detail-item">
                        <span className="structure-detail-label">
                          Total Flats:
                        </span>
                        <span className="structure-detail-value">
                          {item.totalflat}
                        </span>
                      </div>
                      <div className="structure-detail-item">
                        <span className="structure-detail-label">Status:</span>
                        <span className="structure-detail-value">
                          {item.status}
                        </span>
                      </div>
                      <div className="structure-detail-item">
                        <span className="structure-detail-label">Facing:</span>
                        <span className="structure-detail-value">
                          {item.facing}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="structure-card-footer">
                    <button
                      className="structure-view-details-btn"
                      onClick={() => handleAddStructure(item.id, item.name)}
                    >
                      <BsEye className="structure-btn-icon" />
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="structure-empty-state">
            <div className="structure-empty-icon">
              <MdApartment />
            </div>
            <h3 className="structure-empty-title">No Projects Found</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Structure;
