import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaGlobe,
  FaPhoneAlt,
} from "react-icons/fa";
import { useRef } from "react";
import html2pdf from "html2pdf.js";
import Ag_logo from "../../assets/ag construction-1.png";

import "./Latter.css";
import axios from "axios";
import { BASE_URL } from "../../config";
import AGImg from "../../assets/ag construction-1.png";
function Possession() {
  const token = JSON.parse(
    localStorage.getItem("employeROyalmadeLogin")
  )?.token;
  const [showPossession, setshowPossession] = useState(false);
 const letterRef = useRef();
  const [from, setFrom] = useState("");
  const [date, setDate] = useState("");
  const [yourName, setYourName] = useState("");
  const [firstName, setFirstName] = useState("");

  const [flatNumber, setFlatNumber] = useState("");
  const [residencyName, setResidencyName] = useState("");
  const [address, setAddress] = useState("");
  const [possesionTable, setpossesionTable] = useState([]);
  const [refreshKey, setrefreshKey] = useState(0);
  const [letterdata, setLetterData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleDownlodepossession() {
    const element = letterRef.current;
    const options = {
      
      filename: `${letterdata.name} possession_letter.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(options).from(element).save();
  }

  async function handlepossessionSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const formdata = {
      // fromName: from,
      date: date || new Date().toISOString().split("T")[0],
      toName: yourName,
      name: firstName,
      flatNo: flatNumber,
      residencyName: residencyName,
      address,
    };

    try {
      if (isEditMode && editId) {
        const response = await axios.put(
          `${BASE_URL}/PossessionLetter/${editId}`,
          formdata,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          alert("Possession letter updated successfully");
        }
      } else {
        const response = await axios.post(
          `${BASE_URL}/createPossessionLetter`,
          formdata,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          alert("Form submitted successfully");
        }
      }
      resetForm();
      setrefreshKey((prev) => prev + 1);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }
  function resetForm() {
    // setFrom("");
    setDate("");
    setYourName("");
    setFirstName("");
    setFlatNumber("");
    setResidencyName("");
    setAddress("");
    setIsEditMode(false);
    setEditId(null);
  }
  function handleEditPossession(item) {
    setIsEditMode(true);
    setEditId(item.id);
    // setFrom(item.fromName);
    setDate(item.date?.split("T")[0] || "");
    setYourName(item.toName);
    setFirstName(item.name);
    setFlatNumber(item.flatNo);
    setResidencyName(item.residencyName);
    setAddress(item.address);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    async function getPossessionLetter() {
      try {
        const response = await axios.get(`${BASE_URL}/PossessionLetter`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(response.data);
        const sortedData = [...response.data].sort((a, b) => b.id - a.id);
        setpossesionTable(sortedData);
      } catch (error) {
        console.log(error);
      }
    }
    getPossessionLetter();
  }, [refreshKey]);

  async function handlepossionDelete(id) {
    const deletepaossioson = window.confirm("Are you sure to delete ?");
    if (!deletepaossioson) return;
    try {
      const response = await axios.delete(
        `${BASE_URL}/PossessionLetter/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("letter delete Successfully");
      }
      setpossesionTable((prev) => prev.filter((item) => item.id !== id));
      setrefreshKey((prev) => prev + 1);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleShowPossessionletter(id) {
    setshowPossession(true);
    try {
      const response = await axios.get(`${BASE_URL}/PossessionLetter/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      setLetterData(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "50px", fontSize: "25px" }}>
        {" "}
        Possession Letter
      </h1>

      <div className="possession_letter_form_wrapper">
        <form className="possession_letter" onSubmit={handlepossessionSubmit}>
          {/* <input
                        type="text"
                        placeholder="From"
                        className="possession_letter_input"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                    /> */}
          <input
            type="date"
            className="possession_letter_input"
            value={date || new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter Your Name"
            className="possession_letter_input"
            value={yourName}
            onChange={(e) => setYourName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="First Name"
            className="possession_letter_input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Flat Number"
            className="possession_letter_input"
            value={flatNumber}
            onChange={(e) => setFlatNumber(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Residency Name"
            className="possession_letter_input"
            value={residencyName}
            onChange={(e) => setResidencyName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter Address"
            className="possession_letter_input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <button
            className="possession_letter_submit_button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : isEditMode ? "Update" : "Submit"}
          </button>
        </form>
      </div>

      <div className="possession_letter_wrapper">
        <table className="possession_table">
          <thead>
            <tr>
              <th>ID</th>
              {/* <th>From Name</th> */}
              <th>Date</th>
              <th>To Name</th>
              <th>Name</th>
              <th>Flat No</th>
              <th>Residency Name</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {possesionTable.length > 0 ? (
              possesionTable.map((item, index) => (
                <tr key={item.id}>
                  <td>{index}</td>
                  {/* <td>{item.fromName}</td> */}
                  <td>{new Date(item.date).toLocaleDateString("en-GB")}</td>
                  <td>{item.toName}</td>
                  <td>{item.name}</td>
                  <td>{item.flatNo}</td>
                  <td>{item.residencyName}</td>
                  <td>{item.address}</td>
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5px",
                      flexDirection: "column",
                    }}
                  >
                    <button
                      onClick={() => handleEditPossession(item)}
                      className="possession_show"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handlepossionDelete(item.id)}
                      className="possession_delete"
                    >
                      {" "}
                      Delete
                    </button>
                    <button
                      onClick={() => handleShowPossessionletter(item.id)}
                      className="possession_show"
                    >
                      Show
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showPossession && letterdata && (
        <>
          <div className="infra_letter_head_main_wrapper">
            <div className="downlode_button">
              <button
                onClick={handleDownlodepossession}
                className="royalinfra_downlode_button"
              >
                {" "}
                Download
              </button>
              <button
                onClick={() => setshowPossession(false)}
                className="possion_close"
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

            {/* <p style={{ marginTop: "25px", marginLeft: "80px" }}>From:- <b>{letterdata.fromName}   </b>      </p> */}
            <p style={{ marginTop: "25px", marginLeft: "80px" }}>
              {" "}
              Date:{" "}
              <b>
                {" "}
                {new Date(letterdata.date).toLocaleDateString("en-GB")}{" "}
              </b>{" "}
            </p>
            <p style={{ marginLeft: "80px" }}>To, </p>
            <p style={{ marginLeft: "80px" }}> Mr./Mrs./Ms. </p>
            <p style={{ marginLeft: "80px" }}>
              {" "}
              <b> {letterdata.name} </b>
            </p>
            <p style={{ marginTop: "25px", marginLeft: "80px" }}>
              Sub: - Handing over possession of{" "}
            </p>

            <p
              style={{
                marginTop: "25px",
                marginLeft: "80px",
                marginRight: "10px",
              }}
            >
              Dear Sir/Madam, I, the undersigned, Mr./Mrs./Ms.{" "}
              <b>{letterdata.name}</b> state that I have transferred my above
              flat to you, Mr./Mrs./Ms.{letterdata.name} and have since received
              full payment towards the transfer of above Flat{" "}
              <b>{letterdata.flatNo} </b>and Shares of Society. Since,{" "}
              <b>{letterdata.address} </b> , <b> {letterdata.residencyName} </b>
              I have received full payment from you, I relinquish my rights for
              the above flat and hand over possession of the same, and you are
              at liberty to use and/or to sell, transfer, sublet at your will as
              you may wish within the rules and regulations of the society and I
              will have no objection or rights for the said flat.
            </p>

            <p style={{ marginLeft: "80px", marginTop: "60px" }}>faithfully,</p>
            <p style={{ marginLeft: "80px", marginTop: "50px" }}>
              (AG Construction)
            </p>
          </div>
          </div>
        </>
      )}
    </>
  );
}

export default Possession;
