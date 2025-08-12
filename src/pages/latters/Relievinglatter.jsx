import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import "./Latter.css";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaGlobe,
  FaPhoneAlt,
} from "react-icons/fa";
import logo from "../../assets/royal.png";
import html2pdf from "html2pdf.js";
import { BASE_URL } from "../../config";
import "../latters/relievinglatter.css";
import AGImg from "../../assets/ag construction-1.png";
function Relievinglatter() {
  const letterRef = useRef();
  const [employeeName, setEmployeeName] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [dateofjoining, setdateofjoining] = useState("");
  const [resignationDate, setResignationDate] = useState("");
  const [lastWorkingDate, setLastWorkingDate] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [Revilingtabledata, setRevilingtabledata] = useState("");
  const [refreshKey, setrefreshKey] = useState("");
  const [showrelivinglatter, setShowRelivinglatter] = useState(false);
  const [myrelivinglatter, setMyrelivinglatter] = useState([]);
  const token = JSON.parse(
    localStorage.getItem("employeROyalmadeLogin")
  )?.token;
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
   const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formdata = {
      employeeName,
      dateOfjoing: dateofjoining || new Date().toISOString().split("T")[0],
      currentDate: currentDate || new Date().toISOString().split("T")[0],
      resignationDate:
        resignationDate || new Date().toISOString().split("T")[0],
      lastworkingdate:
        lastWorkingDate || new Date().toISOString().split("T")[0],
      designation,
      department,
      location,
    };

    try {
      if (isEditMode && editId) {
        const response = await axios.put(
          `${BASE_URL}/updateRelievingLatter/${editId}`,
          formdata,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Updated:", response.data);
        alert("Letter updated successfully!");
      } else {
        const response = await axios.post(
          `${BASE_URL}/createRelievinglatter`,
          formdata,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Created:", response.data);
        alert("Form submitted successfully!");
      }

      // Reset all
      setEmployeeName("");
      setCurrentDate("");
      setdateofjoining("");
      setResignationDate("");
      setLastWorkingDate("");
      setDesignation("");
      setDepartment("");
      setLocation("");
      setrefreshKey(refreshKey + 1);
      setIsEditMode(false);
      setEditId(null);
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const handleEditRelievingLatter = (item) => {
    setIsEditMode(true);
    setEditId(item.id);
    setEmployeeName(item.employeeName);
    setCurrentDate(item.currentDate);
    setdateofjoining(item.dateofjoining); // Corrected here
    setResignationDate(item.resignationDate);
    setLastWorkingDate(item.lastworkingdate);
    setDesignation(item.designation);
    setDepartment(item.department);
    setLocation(item.location);
  };

  useEffect(() => {
    async function getrileving() {
      try {
        const response = await axios.get(`${BASE_URL}/getAllRelievingLatter`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(response.data);
        const sorteddata = [...response.data].sort((a, b) => b.id - a.id);
        setRevilingtabledata(sorteddata);
      } catch (error) {
        console.log(error);
      }
    }
    getrileving();
  }, [refreshKey]);

  async function handleshowrevilingletter(id) {
    try {
      const response = await axios.get(
        `${BASE_URL}/getAllRelievingLatterbyid/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      setMyrelivinglatter(response.data);
      setShowRelivinglatter(true);
    } catch (error) {
      console.log(error);
    }
  }
  async function handledeleteRelivingLatter(id) {
    const deletereliving = window.confirm("Are you sure to delete ?");
    if (!deletereliving) return;
    try {
      const response = await axios.delete(
        `${BASE_URL}/deleteRelievingLatter/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      setrefreshKey(refreshKey + 1);
    } catch (error) {
      console.log(error);
    }
  }

  const handleDownload = () => {
    const element = letterRef.current;
    const options = {
      
      filename: `Relieving_letter_ ${myrelivinglatter.employeeName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(options).from(element).save();
  };

  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "50px" }}>
        Relieving Letter
      </h1>

      <div className="offer_latter_form_wrapper">
        <form onSubmit={handleSubmit} className="offer_latter_form">
          <div className="offer_latter_div">
            <label className="offer_latter_lable">Employee Name:</label>
            <input
              type="text"
              className="offer_latter_input"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              required
            />
          </div>

          <div className="offer_latter_div">
            <label className="offer_latter_lable">Current Date:</label>
            <input
              type="date"
              className="offer_latter_input"
              value={currentDate || new Date().toISOString().split("T")[0]}
              onChange={(e) => setCurrentDate(e.target.value)}
              required
            />
          </div>
          <div className="offer_latter_div">
            <label className="offer_latter_lable">Date Of Joining:</label>
            <input
              type="date"
              className="offer_latter_input"
              value={dateofjoining || new Date().toISOString().split("T")[0]}
              onChange={(e) => setdateofjoining(e.target.value)}
              required
            />
          </div>

          <div className="offer_latter_div">
            <label className="offer_latter_lable">Resignation Date:</label>
            <input
              type="date"
              className="offer_latter_input"
              value={resignationDate || new Date().toISOString().split("T")[0]}
              onChange={(e) => setResignationDate(e.target.value)}
              required
            />
          </div>

          <div className="offer_latter_div">
            <label className="offer_latter_lable">Last Working Date:</label>
            <input
              type="date"
              className="offer_latter_input"
              value={lastWorkingDate || new Date().toISOString().split("T")[0]}
              onChange={(e) => setLastWorkingDate(e.target.value)}
              required
            />
          </div>

          <div className="offer_latter_div">
            <label className="offer_latter_lable">Designation:</label>
            <input
              type="text"
              className="offer_latter_input"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              required
            />
          </div>

          <div className="offer_latter_div">
            <label className="offer_latter_lable">Department:</label>
            <input
              type="text"
              className="offer_latter_input"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </div>

          <div className="offer_latter_div">
            <label className="offer_latter_lable">Location:</label>
            <input
              type="text"
              className="offer_latter_input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="offer_latter_div">
            <button type="submit" className="offer_latter_button" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : isEditMode ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {
        <div className="reveling_table_wrapper">
          <table className="reveling_table">
            <thead className="reveling_table_thead">
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Current Date</th>
                <th>Date of Joining</th>
                <th>Resignation Date</th>
                <th>Last Working Date</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Location</th>
                <th> Action</th>
              </tr>
            </thead>
            <tbody className="reveling_table_tbody">
              {Revilingtabledata && Revilingtabledata.length > 0 ? (
                Revilingtabledata.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index}</td>
                    <td>{item.employeeName}</td>
                    <td>
                      {new Date(item.currentDate).toLocaleDateString("en-GB")}
                    </td>
                    <td>
                      {new Date(item.dateOfjoing).toLocaleDateString("en-GB")}
                    </td>{" "}
                    {/* Corrected here */}
                    <td>
                      {new Date(item.resignationDate).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>
                    <td>
                      {item.lastworkingdate
                        ? new Date(item.lastworkingdate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </td>
                    <td>{item.designation}</td>
                    <td>{item.department}</td>
                    <td>{item.location}</td>
                    <td>
                      <button
                        onClick={() => handleshowrevilingletter(item.id)}
                        className="latter_show_button"
                      >
                        {" "}
                        Show
                      </button>
                      <button
                        onClick={() => handledeleteRelivingLatter(item.id)}
                        className="latter_show_delete"
                      >
                        {" "}
                        Delete
                      </button>
                      <button
                        onClick={() => handleEditRelievingLatter(item)}
                        className="latter_show_button"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      }

      {showrelivinglatter && myrelivinglatter && (
        <div className="relieving_main_container">
          <div className="relieving_button_group">
            <button
              className="relieving_download_button"
              onClick={handleDownload}
            >
              Download
            </button>
            <button
              className="relieving_close_button"
              onClick={() => setShowRelivinglatter(false)}
            >
              Close
            </button>
          </div>

          <div className="relieving_letter_container" ref={letterRef}>
            <div className="relieving_header_section">
            <div className="relieving_company_logo_container">
              <img className="relieving_company_logo" src={AGImg} alt="logo" />
              </div>
              <div className="relieving_company_details">
               <h3>Address</h3>
                <div className="relieving_detail_row">
                
                  <div className="relieving_detail_text">
                   
                    <p>
                      Plot 62, Hudkeshwar Rd, near Rakshak Fresh Mart, Ingole
                      Nagar
                    </p>
                    <p>Hudkeshwar Road, Nagpur - 440034</p>
                  </div>
                 
                </div>
                <div className="relieving_detail_row">
                  <div className="relieving_icon_box">
                    <FaEnvelope size={20} color="#000" />
                  </div>
                  <p className="relieving_detail_text">
                    agconstructions220@gmail.com
                  </p>
                
                </div>
                <div className="relieving_detail_row">
                 <div className="relieving_icon_box">
                    <FaGlobe size={20} color="#000" />
                  </div>
                  <p className="relieving_detail_text">
                    www.agconstructionnagpur.in
                  </p>
                 
                </div>
                <div className="relieving_detail_row">
                <div className="relieving_icon_box">
                    <FaPhoneAlt size={20} color="#000" />
                  </div>

                  <p className="relieving_detail_text">+91 7620 419 075</p>
                  
                </div>
              </div>
            </div>

            <hr className="relieving_line_thick" />

            <h2 className="relieving_letter_heading">
              Subject - Relieving Letter Cum Experience Letter
            </h2>

            <div className="relieving_employee_info">
              <p>
                Date:{" "}
                <strong>
                  {new Date(myrelivinglatter.currentDate).toLocaleDateString(
                    "en-GB"
                  )}
                </strong>
              </p>
              <p>
                Name: <strong>{myrelivinglatter.employeeName}</strong>
              </p>
            </div>

            <p className="relieving_paragraph">
              Dear <span>{myrelivinglatter.employeeName}</span>,
            </p>

            <p className="relieving_paragraph">
              With reference to your resignation dated{" "}
              <b>
                {new Date(myrelivinglatter.resignationDate).toLocaleDateString(
                  "en-GB"
                )}
              </b>
              , the same has been accepted, and you are relieved from your
              services w.e.f the close of business hours of
              <b> {myrelivinglatter.lastworkingdate || "N/A"} </b>
            </p>

            <p className="relieving_paragraph">
              The details of your employment with AG Construction are as below:
            </p>

            <ul className="relieving_employment_details">
              <li>
                <span>Date of Joining:</span>{" "}
                <span>
                  {new Date(
                    myrelivinglatter.dateOfjoing || "N/A"
                  ).toLocaleDateString("en-GB")}
                </span>
              </li>
              <li>
                <span>Last Working Date:</span>{" "}
                <span>
                  {new Date(
                    myrelivinglatter.lastworkingdate || "N/A"
                  ).toLocaleDateString("en-GB")}
                </span>
              </li>
              <li>
                <span>Designation:</span>{" "}
                <span>{myrelivinglatter.designation}</span>
              </li>
              <li>
                <span>Department:</span>{" "}
                <span>{myrelivinglatter.department}</span>
              </li>
              <li>
                <span>Location:</span> <span>{myrelivinglatter.location}</span>
              </li>
            </ul>

            <p className="relieving_paragraph">
              We wish you all the best for your future endeavors.
            </p>
            <p className="relieving_paragraph">Thank you.</p>
            <p className="relieving_paragraph">
              For AG Construction
            </p>

            <div className="relieving_signature">
              <p>Chief Executive Officer</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Relievinglatter;
