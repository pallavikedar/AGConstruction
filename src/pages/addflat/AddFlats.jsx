import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../addflat/AddFlat.css";
import { BsFillBuildingsFill } from "react-icons/bs";
import { AiFillCheckCircle, AiOutlineClockCircle } from "react-icons/ai";
import { FaTrashAlt, FaPlus, FaSearch } from "react-icons/fa";
import { MdApartment, MdSquareFoot, MdLocationCity } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import Swal from "sweetalert2";
import { BASE_URL } from "../../config";

function Flat() {
  const { id } = useParams();
  const [AddScheme, setAddScheme] = useState(false);
  const [selectStatus, setSelectStatus] = useState("");
  const [Schemename, setSchemeName] = useState("");
  const token = JSON.parse(
    localStorage.getItem("employeROyalmadeLogin")
  )?.token;
  const [myLand, setMyLand] = useState([]);
  const [showCount, setShowCount] = useState("");
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [totalFlat, setTotalFlat] = useState("");
  const [buildingSize, setBuildingSize] = useState("");
  const [searchScheme, setSearchScheme] = useState("");
  const [editSchemeId, setEditSchemeId] = useState(null);

  function handlescheme(e) {
    e.preventDefault();
    setAddScheme(!AddScheme);
  }

  async function handleCreateScheme(e) {
    e.preventDefault();
    const obj = {
      name: Schemename,
      status: selectStatus,
      landId: id,
      totalflat: totalFlat,
      buildingSize,
    };
    if (!id) {
      return alert("project start from land");
    }
    try {
      const response = await axios.post(`${BASE_URL}/createProject`, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      Swal.fire({
        title: "Success!",
        text: "Scheme added successfully",
        icon: "success",
        confirmButtonColor: "#00d4aa",
      });
      setAddScheme(false);
      setSchemeName("");
      setSelectStatus("");
      setTotalFlat("");
      setBuildingSize("");
      setCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to add scheme",
        icon: "error",
        confirmButtonColor: "#ff6b6b",
      });
    }
  }

  useEffect(() => {
    async function getLand() {
      try {
        const response = await axios.get(`${BASE_URL}/getAllProjects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("API response.data:", response.data);
        const data = Array.isArray(response.data) ? response.data : [];
        setMyLand(data);
      } catch (error) {
        console.log("Error fetching projects:", error);
        setMyLand([]);
      }
    }
    getLand();
  }, [id, token, count]);

  function handleclick(id, newname) {
    console.log(id);
    if (!id) {
      return Swal.fire({
        title: "Warning!",
        text: "Project has not started yet",
        icon: "warning",
        confirmButtonColor: "#ffa726",
      });
    }
    navigate(`/flatlist/${id}`, { state: { newname } });
  }

  useEffect(() => {
    async function getingCount() {
      try {
        const response = await axios.get(`${BASE_URL}/count`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(response.data);
        setShowCount(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    getingCount();
  }, []);

  const confirmDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff6b6b",
      cancelButtonColor: "#74b9ff",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${BASE_URL}/deleteProject/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          setCount((prevCount) => prevCount + 1);

          Swal.fire({
            title: "Deleted!",
            text: "The residency has been deleted.",
            icon: "success",
            confirmButtonColor: "#00d4aa",
          });
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: "Error!",
            text: "Something went wrong while deleting the residency.",
            icon: "error",
            confirmButtonColor: "#ff6b6b",
          });
        }
      }
    });
  };
  const filterScheme = Array.isArray(myLand)
    ? myLand.filter((item) =>
        item.name.toLowerCase().includes(searchScheme.toLowerCase())
      )
    : [];

  const getStatusColor = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return "addflat-status-progress";
      case "COMPLETE":
        return "addflat-status-complete";
      case "INACTIVE":
        return "addflat-status-inactive";
      default:
        return "addflat-status-default";
    }
  };

  async function HandleUpdateScheme(id) {
    setEditSchemeId(id);
    try {
      const response = await axios.get(`${BASE_URL}/getProjectById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      if (response.data) {
        setSchemeName(response.data.name);
        setSelectStatus(response.data.status);
        setTotalFlat(response.data.totalflat);
        setBuildingSize(response.data.buildingSize);
        setAddScheme(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdateExistingScheme(e) {
    e.preventDefault();
    const obj = {
      name: Schemename,
      status: selectStatus,
      totalflat: totalFlat,
      buildingSize,
    };
    try {
      const response = await axios.put(
        `${BASE_URL}/updateProject/${editSchemeId}`,
        obj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      Swal.fire({
        title: "Success!",
        text: "Scheme updated successfully",
        icon: "success",
        confirmButtonColor: "#00d4aa",
      });
      setAddScheme(false);
      setSchemeName("");
      setSelectStatus("");
      setTotalFlat("");
      setBuildingSize("");
      setEditSchemeId(null);
      setCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update scheme",
        icon: "error",
        confirmButtonColor: "#ff6b6b",
      });
    }
  }
  return (
    <div className="addflat-main-wrapper">
      {/* Navigation Bar */}
      <nav className="addflat-navbar">
        <div className="addflat-nav-content">
          <div className="addflat-logo-section">
            <MdLocationCity className="addflat-logo-icon" />
            <span className="addflat-logo-text">FlatManager Pro</span>
          </div>
          <div className="addflat-nav-actions">
            <button onClick={handlescheme} className="addflat-primary-btn">
              <FaPlus className="addflat-btn-icon" />
              New Scheme
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="addflat-hero-section">
        <div className="addflat-hero-content">
          <h1 className="addflat-hero-title">Residential Scheme Management</h1>

          {/* Search Bar */}
          <div className="addflat-search-wrapper">
            <div className="addflat-search-container">
              <FaSearch className="addflat-search-icon" />
              <input
                type="text"
                placeholder="Search for schemes, projects, or locations..."
                value={searchScheme}
                onChange={(e) => setSearchScheme(e.target.value)}
                className="addflat-search-input"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Schemes Section */}
      <section className="addflat-schemes-section">
        

        {Array.isArray(filterScheme) && filterScheme.length > 0 ? (
          <div className="addflat-schemes-grid">
            {filterScheme.map((item, index) => {
              const countData = showCount[item.id];
              const availableCount = countData ? countData.AVAILABLE : 0;
              const bookedCount = countData ? countData.BOOKED : 0;

              return (
                <div key={index} className="addflat-scheme-card">
                  <div className="addflat-card-header">
                    <div className="addflat-card-title-section">
                      <div
                        className="addflat-building-icon-container"
                        onClick={() => handleclick(item.id, item.name)}
                      >
                        <BsFillBuildingsFill className="addflat-building-icon" />
                      </div>
                      <div className="addflat-title-info">
                        <h3
                          className="addflat-scheme-title"
                          onClick={() => handleclick(item.id, item.name)}
                        >
                          {item.name}
                        </h3>
                        <span
                          className={`addflat-status-badge ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status?.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                    <button
                      className="addflat-delete-button"
                      onClick={() => confirmDelete(item.id)}
                      title="Delete Scheme"
                    >
                      <FaTrashAlt />
                    </button>
                    <button
                      className="addflat-delete-button"
                      onClick={() => HandleUpdateScheme(item.id)}
                      title="Delete Scheme"
                      style={{
                        backgroundColor: "lightblue",
                        color: "black",
                        marginLeft: "5px",
                      }}
                    >
                      <CiEdit />
                    </button>
                  </div>

                  <div className="addflat-card-body">
                    <div className="addflat-metrics-row">
                      <div className="addflat-metric-item addflat-metric-booked">
                        <div className="addflat-metric-icon">
                          <AiFillCheckCircle />
                        </div>
                        <div className="addflat-metric-data">
                          <span className="addflat-metric-value">
                            {bookedCount || 0}
                          </span>
                          <span className="addflat-metric-label">Booked</span>
                        </div>
                      </div>

                      <div className="addflat-metric-item addflat-metric-available">
                        <div className="addflat-metric-icon">
                          <AiOutlineClockCircle />
                        </div>
                        <div className="addflat-metric-data">
                          <span className="addflat-metric-value">
                            {availableCount || 0}
                          </span>
                          <span className="addflat-metric-label">
                            Available
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="addflat-details-row">
                      <div className="addflat-detail-item">
                        <MdApartment className="addflat-detail-icon" />
                        <span className="addflat-detail-text">
                          <strong>{item.totalflat || "N/A"}</strong> Total Flats
                        </span>
                      </div>
                      <div className="addflat-detail-item">
                        <MdSquareFoot className="addflat-detail-icon" />
                        <span className="addflat-detail-text">
                          <strong>{item.buildingSize || "N/A"}</strong> Sq.ft
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="addflat-card-footer">
                    <button
                      className="addflat-view-button"
                      onClick={() => handleclick(item.id, item.name)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="addflat-empty-state">
            <div className="addflat-empty-icon">
              <MdLocationCity />
            </div>
            <h3 className="addflat-empty-title">No schemes found</h3>
            <p className="addflat-empty-description">
              {searchScheme
                ? "Try adjusting your search terms"
                : "Create your first scheme to get started"}
            </p>
            {!searchScheme && (
              <button
                onClick={handlescheme}
                className="addflat-empty-action-btn"
              >
                <FaPlus />
                Create First Scheme
              </button>
            )}
          </div>
        )}
      </section>

      {/* Add Scheme Modal */}
      {AddScheme && (
        <div className="addflat-modal-overlay">
          <div className="addflat-modal-container">
            <div className="addflat-modal-header">
              <div className="addflat-modal-title-section">
                <MdApartment className="addflat-modal-icon" />
                <h2 className="addflat-modal-title">
                  {editSchemeId ? "Edit Scheme" : "Add New Scheme"}
                </h2>
              </div>
              <button
                className="addflat-modal-close"
                onClick={() => setAddScheme(false)}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                editSchemeId ? handleUpdateExistingScheme : handleCreateScheme
              }
              className="addflat-form"
            >
              <div className="addflat-form-section">
                <div className="addflat-input-group">
                  <label htmlFor="schemeName" className="addflat-label">
                    Project Name
                  </label>
                  <input
                    id="schemeName"
                    type="text"
                    value={Schemename}
                    onChange={(e) => setSchemeName(e.target.value)}
                    placeholder="Enter project name"
                    className="addflat-input"
                    required
                  />
                </div>

                <div className="addflat-input-group">
                  <label htmlFor="status" className="addflat-label">
                    Project Status
                  </label>
                  <select
                    id="status"
                    value={selectStatus}
                    onChange={(e) => setSelectStatus(e.target.value)}
                    className="addflat-select"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETE">Complete</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>

                <div className="addflat-input-row">
                  <div className="addflat-input-group">
                    <label htmlFor="totalFlat" className="addflat-label">
                      Total Flats
                    </label>
                    <input
                      id="totalFlat"
                      type="number"
                      value={totalFlat}
                      onChange={(e) => setTotalFlat(e.target.value)}
                      placeholder="Enter total flats"
                      className="addflat-input"
                      required
                    />
                  </div>

                  <div className="addflat-input-group">
                    <label htmlFor="buildingSize" className="addflat-label">
                      Building Size (Sq.ft)
                    </label>
                    <input
                      id="buildingSize"
                      type="text"
                      value={buildingSize}
                      onChange={(e) => setBuildingSize(e.target.value)}
                      placeholder="Enter building size"
                      className="addflat-input"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="addflat-form-actions">
                <button
                  type="button"
                  onClick={() => setAddScheme(false)}
                  className="addflat-secondary-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="addflat-primary-btn">
                  <FaPlus className="addflat-btn-icon" />
                  {editSchemeId ? "Update Scheme" : "Create Scheme"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Flat;
