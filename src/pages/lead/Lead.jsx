import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import "../lead/Lead.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineSearch } from "react-icons/ai";
import AddLead from "./AddLead";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import { BASE_URL } from "../../config";

function Lead() {
  const [showAddlead, setShowAddlead] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [currentProcessId, setCurrentProcessId] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    date: "" || new Date().toISOString().split("T")[0],
    step: "",
  });
  const [card, setCard] = useState(null);

  const token = JSON.parse(localStorage.getItem("employeROyalmadeLogin")) || [];
  const myToken = token.token;
  const navigate = useNavigate();
  const [review, setreview] = useState(false);
  const [getLeadId, setGetleadId] = useState("");

  const [reviewdate, setReviewdate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [Addreview, setAddreview] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const [filterLead, setFilterLead] = useState("All");

  useEffect(() => {
    const getAllLeads = async () => {
      try {
        const url = `${BASE_URL}/getAllLeads`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${myToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const leads = await response.json();
        leads.sort((a, b) => b.id - a.id);

        setLeads(leads);
        setFilter(leads);

        console.log("Leads:", leads);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    getAllLeads();
  }, [isPopupOpen, showAddlead]);

  const openPopup = (id) => {
    setFormData({ ...formData, id });
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setFormData({
      id: null,
      date: "",
      step: "",
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const { id, date, step } = formData;

    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    const leadLogs = [{ logDate: date, status: step }];

    axios
      .post(`${BASE_URL}/${id}/addLogs`, leadLogs, {
        headers: {
          Authorization: `Bearer ${myToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Lead updated successfully:", response.data);

        setLeads((prevLeads) =>
          prevLeads.map((lead) =>
            lead.id === id
              ? { ...lead, step, dates: { ...lead.dates, [step]: date } }
              : lead
          )
        );

        closePopup();
      })
      .catch((error) => {
        console.error("Error updating lead:", error);
        if (error.response && error.response.status === 401) {
          console.error(
            "Unauthorized access. Please check your authentication."
          );
        }
      });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  async function handlegetNewLead(id) {
    try {
      const newLead = await axios.get(`${BASE_URL}/getlead/${id}`, {
        headers: {
          Authorization: `Bearer ${myToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log(newLead.data);
      setCard(newLead.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function handledelete(id) {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this lead? This action cannot be undone."
    );
    if (!isConfirmed) return;

    try {
      await axios.delete(`${BASE_URL}/deleteLead/${id}`, {
        headers: {
          Authorization: `Bearer ${myToken}`,
          "Content-Type": "application/json",
        },
      });

      setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== id));
      alert("Lead has been deleted successfully.");
    } catch (error) {
      console.error("Error deleting lead:", error);
      alert("There was a problem deleting the lead.");
    }
  }

  function handleEditLead(id) {
    navigate(`/editlead/ ${id}`);
  }

  async function handleAddReview(id) {
    console.log(id);
    setGetleadId(id);
    setreview(true);
  }
  function handleClosereview() {
    setreview(false);
  }

  async function handleAddreview(e) {
    e.preventDefault();
    const obj = {
      remark: Addreview,
      remarkdate: reviewdate
        ? reviewdate
        : new Date().toISOString().split("T")[0],
    };
    try {
      const reponse = await axios.post(
        `${BASE_URL}/remark/${getLeadId}/remark`,
        obj,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${myToken}`,
          },
        }
      );
      console.log(reponse);
      alert("review add");
      setAddreview("");
      setReviewdate("");
      setreview(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const searchdata = leads.filter((item, index) => {
      return item.name.toLowerCase().includes(search.toLowerCase());
    });
    setFilter(searchdata);
  }, [search, leads]);

  function closeAddLead() {
    setShowAddlead(false);
  }

  //  Pagination logic
  const offset = currentPage * itemsPerPage;
  const currentItems = filter.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filter.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  function handleNewlead(lead) {
    setFilterLead(lead);
  }

  const myfilterLead =
    filterLead === "All"
      ? currentItems
      : currentItems.filter((item, index) => item.status === filterLead);
  return (
    <>
      <div className="lead-wrapper">
        {currentProcessId && (
          <div className="steps">
            <h2>Lead Steps</h2>
            <button
              onClick={() => openPopup(currentProcessId)}
              className="btn-primary"
            >
              Open Form
            </button>
          </div>
        )}

        <div className="lead-show-table">
          <div className="won-leads">
            <h2 style={{ textAlign: "center" }}>All Leads</h2>
            <div className="lead_search_with_button">
              <button onClick={() => handleNewlead("NEW_LEAD")}>
                {" "}
                New lead{" "}
              </button>
              <button onClick={() => handleNewlead("FOLLOW_UP")}>
                {" "}
                Follow Up{" "}
              </button>
              <button onClick={() => handleNewlead("UNDER_REVIEW")}>
                Under Review{" "}
              </button>
              <button onClick={() => handleNewlead("DEMO")}>Demo </button>
              <button onClick={() => handleNewlead("NEGOTIATION")}>
                Negotiation{" "}
              </button>
              <button onClick={() => handleNewlead("SUCCESS")}>success </button>
              <button onClick={() => handleNewlead("All")}>All Leads </button>
            </div>
            <div className="search-add">
              <div className="search-bar">
                <input
                  type="search"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <AiOutlineSearch className="search-icon" />
              </div>
              <button
                className="add_lead_button"
                onClick={() => setShowAddlead(!showAddlead)}
              >
                Add Lead
              </button>
            </div>

            <div className="responsive-table-wrapper">
              {myfilterLead.length > 0 ? (
                <>
                  <table className="responsive-table">
                    <thead>
                      <tr>
                        <th>First Name</th>
                        <th>Date</th>
                        {/* <th>Job Title</th> */}
                        <th>Email</th>
                        <th>Phone</th>
                        {/* <th>Company</th> */}
                        <th>Status</th>
                        <th>Action</th>
                        <th>View</th>
                        <th>Delete</th>
                        <th>Add Review</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myfilterLead.map((lead) => (
                        <tr key={lead.id}>
                          <td data-label="First Name">{lead.name}</td>
                          <td data-label="Date">
                            {new Date(lead.foundOn).toLocaleDateString("en-GB")}
                          </td>
                          {/* <td data-label="Job Title">{lead.jobTitle}</td> */}
                          <td data-label="Email">{lead.email}</td>
                          <td data-label="Phone">{lead.phoneNumber}</td>
                          {/* <td data-label="Company">{lead.companyName}</td> */}
                          <td data-label="Status">{lead.status}</td>
                          <td data-label="Action">
                            <button
                              className="add_lead_step_button"
                              onClick={() => openPopup(lead.id)}
                            >
                              Steps
                            </button>
                          </td>
                          <td data-label="View">
                            <button
                              className="add_lead_view_button"
                              onClick={() => handlegetNewLead(lead.id)}
                            >
                              View
                            </button>
                          </td>
                          <td data-label="Delete">
                            <button
                              className="add_lead_delete_button"
                              onClick={() => handledelete(lead.id)}
                            >
                              Delete
                            </button>
                            <button
                              className="add_lead_edit_button"
                              onClick={() => handleEditLead(lead.id)}
                            >
                              Edit
                            </button>
                          </td>
                          <td data-label="Add Review">
                            <button
                              className="add_lead_review_button"
                              onClick={() => handleAddReview(lead.id)}
                            >
                              Add Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <ReactPaginate
                    pageCount={pageCount}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={2}
                    onPageChange={handlePageClick}
                    containerClassName="pagination"
                    activeClassName="active"
                    breakLabel="..."
                    previousLabel={null}
                    nextLabel={null}
                  />
                </>
              ) : (
                <p className="no-data-message">No data found</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <div className="stepform_container">
          <div className="stepForm_popup">
            <button className="StepForm_close_btn" onClick={closePopup}>
              X
            </button>
            <form className="step_from" onSubmit={handleFormSubmit}>
              <input
                type="date"
                name="date"
                value={formData.date || new Date().toISOString().split("T")[0]}
                onChange={handleFormChange}
                required
                className="stepform_container_input"
              />
              <select
                name="step"
                value={formData.step}
                onChange={handleFormChange}
                required
                className="stepform_container_select"
              >
                <option value="">Select Step</option>
                <option value="FOLLOW_UP">FOLLOW_UP</option>
                <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                <option value="DEMO">DEMO</option>
                <option value="NEGOTIATION">NEGOTIATION</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
              <button
                type="submit"
                className="stepform_container_submit_button"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="main_card_wrapper">
        {card && (
          <div className="final_card_details">
            <div className="Final_card_popup">
              <button className="finalCardClose" onClick={() => setCard(null)}>
                X
              </button>
              <h3>Lead Details</h3>
              <div className="lead_detail_wrapper">
                <p>
                  <strong>Name:</strong> {card.name}
                </p>
                <p>
                  <strong>Found On:</strong>{" "}
                  {new Date(card.foundOn).toLocaleDateString("en-GB")}
                </p>
                <p>
                  <strong>Job Title:</strong> {card.jobTitle}
                </p>
                <p>
                  <strong>Email:</strong> {card.email}
                </p>
                <p>
                  <strong>Phone:</strong> {card.phoneNumber}
                </p>
                <p>
                  <strong>Company:</strong> {card.companyName}
                </p>
                <p>
                  <strong>Status:</strong> {card.status}
                </p>
              </div>
              {/* Render Lead Logs */}
              {card.leadLogs && card.leadLogs.length > 0 && (
                <div className="lead_logs">
                  <h4>Lead Logs:</h4>
                  <ul className="lead_logs_line">
                    {card.leadLogs.map((log) => (
                      <li key={log.id}>
                        <p>
                          <strong>Log Date:</strong>{" "}
                          {new Date(log.logDate).toLocaleDateString("en-GB")}
                        </p>
                        <p>
                          <strong>Status:</strong> {log.status}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {
                <div className="rematk">
                  <h4> Customer Remark</h4>
                  <ul className="lead_logs_line">
                    <li>
                      <p>
                        <strong> Customer Remark :</strong> {card.remark}
                      </p>
                      <p>
                        <strong>Customer Remark Date:</strong>
                        {new Date().toLocaleDateString("en-GB")}
                      </p>
                    </li>
                  </ul>
                </div>
              }
            </div>
          </div>
        )}
      </div>

      {review && (
        <div className="add_deview_main_container">
          <div className="add_deview_container">
            <p>add review</p>
            <button className="addreview_close_btn" onClick={handleClosereview}>
              {" "}
              X
            </button>
            <form className="add_review_from" onSubmit={handleAddreview}>
              <input
                type="date"
                value={reviewdate || new Date().toISOString().split("T")[0]}
                onChange={(e) => setReviewdate(e.target.value)}
                className="add_review_input"
              />
              <input
                type="text"
                placeholder="Add Remark"
                value={Addreview}
                onChange={(e) => setAddreview(e.target.value)}
                className="add_review_input"
              />
              <button type="submit" className="add_review_submit_button">
                Add Review
              </button>
            </form>
          </div>
        </div>
      )}

      {showAddlead && (
        <>
          <div className="addleadformShow">
            <AddLead props={closeAddLead} />
          </div>
        </>
      )}
    </>
  );
}

export default Lead;
