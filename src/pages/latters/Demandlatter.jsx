import axios from "axios";
import React, { useEffect, useState } from "react";
import logo from "../../assets/royal.png";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaGlobe,
  FaPhoneAlt,
} from "react-icons/fa";
import { useRef } from "react";
import html2pdf from "html2pdf.js";
import "../latters/Latter.css";
import { BASE_URL } from "../../config";
import Ag_logo from "../../assets/ag construction-1.png";
import AGImg from "../../assets/ag construction-1.png";


function DemandLetter() {
  const letterRef = useRef();
  const token = JSON.parse(
    localStorage.getItem("employeROyalmadeLogin")
  )?.token;
  const [showDemandlatter, setShowDemandlatter] = useState(false);
  const [singleDemadlatter, setsingleDemadlatter] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    faltno: "",
    amount: "",
    sitename: "",
    favorOf: "",
    bankName: "",
    branch: "",
    acNo: "",
  });
  const [alldemandlattertable, setalldemandlattertable] = useState([]);
  const [refreshkey, setrefreshKey] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = isEditing
        ? `${BASE_URL}/updateDemandLetter/${editId}`
        : `${BASE_URL}/createDemandLetter`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("form submit successfully");
        const data = await response.json();
        console.log("Response:", data);
        setrefreshKey(refreshkey + 1);
        setFormData({
          name: "",
          faltno: "",
          amount: "",
          sitename: "",
          favorOf: "",
          bankName: "",
          branch: "",
          acNo: "",
        });
        setIsEditing(false);
        setEditId(null);
      } else {
        console.log("Failed to submit the form");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    finally{
      setIsSubmitting(false);
    }
  };

  const handleEditDemand = (demand) => {
    setFormData({
      name: demand.name,
      faltno: demand.faltno,
      amount: demand.amount,
      sitename: demand.sitename,
      favorOf: demand.favorOf,
      bankName: demand.bankName,
      branch: demand.branch,
      acNo: demand.acNo,
    });
    setEditId(demand.id);
    setIsEditing(true);
  };

  useEffect(() => {
    async function getallDemand() {
      try {
        const response = await axios.get(`${BASE_URL}/getAllDemandLetters`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(response.data);

        const sortedData = [...response.data].sort((a, b) => b.id - a.id);
        setalldemandlattertable(sortedData);
      } catch (error) {
        console.log(error);
      }
    }
    getallDemand();
  }, [refreshkey]);

  const handleDownload = () => {
    const element = letterRef.current;

    const width = 750;
    const height = element.scrollHeight + 220;

    const options = {
      margin: [10, 10],
      filename: "Demand_lette.pdf",
      image: { type: "jpeg", quality: 0.8 },
      html2canvas: {
        scale: 2,
        useCORS: true,
      },
      jsPDF: {
        unit: "px",
        format: [width, height],
        orientation: "portrait",
      },
    };

    html2pdf().from(element).set(options).save();
  };
  async function handleDeleteDemand(id) {
    const deleteDemand = window.confirm("Are you sure to delete ?");
    if (!deleteDemand) return;
    try {
      const response = await axios.delete(
        `${BASE_URL}/deleteDemandLetter/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      setrefreshKey(refreshkey + 1);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleShowdemadlatter(id) {
    try {
      const response = await axios.get(
        `${BASE_URL}/getDemandLetterById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);

      setsingleDemadlatter(response.data);
      setShowDemandlatter(true);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div>
        <p className="demand_letter_page_heading">Demand Letter</p>
        <div className="demand_latter_form_wrapper">
          <form onSubmit={handleSubmit} className="demad_latter_form">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="demand_latter_form_input"
            />
            <input
              type="text"
              name="faltno"
              placeholder="Falt No"
              value={formData.faltno}
              onChange={handleChange}
              required
              className="demand_latter_form_input"
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="demand_latter_form_input"
            />
            <input
              type="text"
              name="sitename"
              placeholder="Site Name"
              value={formData.sitename}
              onChange={handleChange}
              required
              className="demand_latter_form_input"
            />
            <input
              type="text"
              name="favorOf"
              placeholder="Favor Of"
              value={formData.favorOf}
              onChange={handleChange}
              required
              className="demand_latter_form_input"
            />
            <input
              type="text"
              name="bankName"
              placeholder="Bank Name"
              value={formData.bankName}
              onChange={handleChange}
              required
              className="demand_latter_form_input"
            />
            <input
              type="text"
              name="branch"
              placeholder="Branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className="demand_latter_form_input"
            />
            <input
              type="text"
              name="acNo"
              placeholder="Account No"
              value={formData.acNo}
              onChange={handleChange}
              required
              className="demand_latter_form_input"
            />
            <button type="submit" className="demand_latter_form_submit_button" disabled={isSubmitting}>
             {isSubmitting?"Submitting...":"Submit"}
            </button>
          </form>
        </div>
      </div>

      {/*  demand latter table   */}
      <div className="demand_latter_table_wrapper">
        <table className="demand_latter_table">
          <thead className="demand_latter_thead">
            <tr>
              <th>Name</th>
              <th>Falt No</th>
              <th>Amount</th>
              <th>Site Name</th>
              <th>Favor Of</th>
              <th>Bank Name</th>
              <th>Branch</th>
              <th>Account No</th>
              <th> Action</th>
            </tr>
          </thead>
          <tbody className="demand_latter_tbody">
            {alldemandlattertable.map((demand, index) => (
              <tr key={index}>
                <td>{demand.name}</td>
                <td>{demand.faltno}</td>
                <td>{demand.amount}</td>
                <td>{demand.sitename}</td>
                <td>{demand.favorOf}</td>
                <td>{demand.bankName}</td>
                <td>{demand.branch}</td>
                <td>{demand.acNo}</td>
                <td>
                  <button
                    onClick={() => handleShowdemadlatter(demand.id)}
                    className="latter_show_button"
                  >
                    {" "}
                    Show
                  </button>
                  <button
                    onClick={() => handleDeleteDemand(demand.id)}
                    className="latter_show_delete"
                  >
                    {" "}
                    Delete
                  </button>
                  <button
                    onClick={() => handleEditDemand(demand)}
                    className="latter_show_button"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* demand latter end */}

      {/* //   ****************** demand latter pdf data  */}
      {showDemandlatter && singleDemadlatter && (
        <div className="demand_latter_main_wrapper">
          <button
            onClick={handleDownload}
            className="demand_latter_dowmlode_button"
          >
            {" "}
            Download
          </button>
          <button
            onClick={() => setShowDemandlatter(false)}
            className="demand_latter_close_button"
          >
            {" "}
            Close
          </button>
          <div className="demand_latter_container">
            <div
              ref={letterRef}
              style={{
                fontFamily: "Arial, sans-serif",
                width: "100%",
                margin: "auto",
                padding: "20px",
                height: "auto",
                border: "1px solid #ccc",
                pageBreakAfter: "always",
              }}
            >
              {/* Header */}
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

              <h2 style={{ textAlign: "center", marginTop: "20px" }}>
                DEMAND LETTER
              </h2>
              <p style={{ marginTop: "5px" }}> To,</p>
              <p>Mr/Mrs,</p>
              <b> {singleDemadlatter.name}</b>
              <p> Address</p>
              <p style={{ textAlign: "center" }}>
                Subject : Demand of Disbursement
              </p>
              <p style={{ marginTop: "20px" }}>
                {" "}
                Ref.Your Flat No <b>{singleDemadlatter.faltno} </b>{" "}
              </p>

              <p style={{ marginTop: "30px" }}> Dear Sir / Madam ,</p>
              <p style={{ marginTop: "10px" }}>
                You will be pleased to know that the work the stage maintained
                below has been completed within its scheduled course of time.
              </p>
              <p style={{ marginTop: "10px" }}>
                You are requested to release the payment of Rs{" "}
                <b>{singleDemadlatter.amount}</b>
              </p>
              <p style={{ marginTop: "10px" }}>
                Due, against this stage of our site
              </p>
              <p style={{ marginTop: "10px" }}>
                {" "}
                In favor of <b>{singleDemadlatter.favorOf} </b>{" "}
              </p>
              <p style={{ marginTop: "10px" }}>
                {" "}
                Bank Name <b>{singleDemadlatter.bankName} </b>{" "}
              </p>
              <p style={{ marginTop: "10px" }}>
                {" "}
                Bank Branch <b> {singleDemadlatter.branch}</b>
              </p>
              <p style={{ marginTop: "10px" }}>
                {" "}
                A/c No. <b> {singleDemadlatter.acNo}</b>{" "}
              </p>
              <p style={{ marginTop: "10px" }}>
                Kindly arrange the same and please extend your esteemed
                co-operation to achieve the target in time
              </p>
              <p style={{ marginTop: "10px" }}> Thanking you anticipation </p>
              <p style={{ marginTop: "10px" }}> Yours truly,</p>
              <p style={{ marginTop: "50px" }}> ( Authorized Signatory)</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DemandLetter;
