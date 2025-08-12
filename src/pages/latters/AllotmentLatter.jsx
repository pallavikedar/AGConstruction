import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaGlobe,
  FaPhoneAlt,
} from "react-icons/fa";
import { useRef } from "react";
import html2pdf from "html2pdf.js";
import axios from "axios";
import "./Latter.css";
import { BASE_URL } from "../../config";
import Ag_logo from "../../assets/ag construction-1.png";
import AGImg from "../../assets/ag construction-1.png";

function AllotmentLatter() {
  const letterRef = useRef();
  const [ShowAllotmentLatter, setShowAllotmentLatter] = useState(false);
  const [apartmentName, setApartmentName] = useState("");
  const [khno, setKhno] = useState("");
  const [mouzeNo, setMouzeNo] = useState("");
  const [sheetNo, setSheetNo] = useState("");
  const [citySurveyNo, setCitySurveyNo] = useState("");
  const [name, setName] = useState("");
  const [totalamount, setTotalamount] = useState("");
  const [totalamountword, setTotalamountword] = useState("");
  const [agreementDate, setAgreementDate] = useState("");
  const [sqmtrs, setSqmtrs] = useState("");
  const [sqft, setSqft] = useState("");
  const [refreshKey, setrefreshkey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading
  const token = JSON.parse(localStorage.getItem("employeROyalmadeLogin"))?.token;
  const [getAllAllotment, setgetAllAllotment] = useState([]);
  const [singleAllotmentlatter, setsingleAllotmentlatter] = useState("");
  const [editId, setEditId] = useState(null);

  const currentDate = new Date().toISOString().split("T")[0];
  const myCurrentDate = new Date(currentDate).toLocaleDateString("en-GB");

  const handleDownload = () => {
    const element = letterRef.current;
    const options = {
      
      filename: `ALLOTMENT_LETTER ${singleAllotmentlatter.name}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(options).from(element).save();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set loading state

    const formData = {
      apartmentName,
      khno,
      mouzeNo,
      sheetNo,
      citySurveyNo,
      name,
      totalamount,
      totalamountword,
      agreementDate: agreementDate || new Date().toISOString().split("T")[0],
      sqmtrs,
      sqft,
    };

    try {
      if (editId) {
        await axios.put(`${BASE_URL}/updateAlotmentLetter/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        alert("Allotment Letter Updated Successfully");
      } else {
        await axios.post(`${BASE_URL}/createAlotmentLetter`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        alert("Allotment Form Successfully Submitted");
      }

      // Reset form
      setName("");
      setApartmentName("");
      setKhno("");
      setMouzeNo("");
      setSheetNo("");
      setCitySurveyNo("");
      setTotalamount("");
      setTotalamountword("");
      setAgreementDate("");
      setSqmtrs("");
      setSqft("");
      setEditId(null);
      setrefreshkey(refreshKey + 1);
    } catch (error) {
      console.log(error);
      alert("Error submitting form. Please try again.");
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  const handleEdit = (allotment) => {
    setEditId(allotment.id);
    setApartmentName(allotment.apartmentName);
    setKhno(allotment.khno);
    setMouzeNo(allotment.mouzeNo);
    setSheetNo(allotment.sheetNo);
    setCitySurveyNo(allotment.citySurveyNo);
    setName(allotment.name);
    setTotalamount(allotment.totalamount);
    setTotalamountword(allotment.totalamountword);
    setAgreementDate(allotment.agreementDate.split("T")[0]);
    setSqmtrs(allotment.sqmtrs);
    setSqft(allotment.sqft);
  };

  useEffect(() => {
    async function gettingallotment() {
      try {
        const response = await axios.get(`${BASE_URL}/getAllAlotmentLetters`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const sortedData = [...response.data].sort((a, b) => b.id - a.id);
        setgetAllAllotment(sortedData);
      } catch (error) {
        console.log(error);
      }
    }
    gettingallotment();
  }, [refreshKey]);

  async function deleteallotment(id) {
    const deleteallotment = window.confirm("Are you sure to delete ?");
    if (!deleteallotment) return;
    try {
      await axios.delete(`${BASE_URL}/deleteAlotmentLetter/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setrefreshkey(refreshKey + 1);
    } catch (error) {
      console.log(error);
    }
  }

  async function showmyallotmentlatter(id) {
    try {
      const response = await axios.get(`${BASE_URL}/AlotmentLetterById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setsingleAllotmentlatter(response.data);
      setShowAllotmentLatter(true);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Allotment Letter
      </h2>

      <div className="allotment_letter_form_wrapper">
        <form onSubmit={handleSubmit} className="alotment_latter_form">
          <div>
            <label className="alotment_latter_form_label">
              Apartment Name:
            </label>
            <input
              type="text"
              className="alotment_latter_form_input"
              value={apartmentName}
              onChange={(e) => setApartmentName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="alotment_latter_form_label">KHNO:</label>
            <input
              type="text"
              className="alotment_latter_form_input"
              value={khno}
              onChange={(e) => setKhno(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="alotment_latter_form_label">Mouze No:</label>
            <input
              type="text"
              className="alotment_latter_form_input"
              value={mouzeNo}
              onChange={(e) => setMouzeNo(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="alotment_latter_form_label">Sheet No:</label>
            <input
              type="text"
              className="alotment_latter_form_input"
              value={sheetNo}
              onChange={(e) => setSheetNo(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="alotment_latter_form_label">
              City Survey No:
            </label>
            <input
              type="text"
              className="alotment_latter_form_input"
              value={citySurveyNo}
              onChange={(e) => setCitySurveyNo(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="alotment_latter_form_label">Name:</label>
            <input
              type="text"
              className="alotment_latter_form_input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="alotment_latter_form_label">Total Amount:</label>
            <input
              type="text"
              className="alotment_latter_form_input"
              value={totalamount}
              onChange={(e) => setTotalamount(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="alotment_latter_form_label">
              Total Amount in Words:
            </label>
            <input
              type="text"
              className="alotment_latter_form_input"
              value={totalamountword}
              onChange={(e) => setTotalamountword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="alotment_latter_form_label">
              Agreement Date:
            </label>
            <input
              type="date"
              className="alotment_latter_form_input"
              value={agreementDate || new Date().toISOString().split("T")[0]}
              onChange={(e) => setAgreementDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="alotment_latter_form_label">
              Area in Square Meters:
            </label>
            <input
              type="number"
              className="alotment_latter_form_input"
              value={sqmtrs}
              onChange={(e) => setSqmtrs(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="alotment_latter_form_label">
              Area in Square Feet:
            </label>
            <input
              type="number"
              className="alotment_latter_form_input"
              value={sqft}
              onChange={(e) => setSqft(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="alotment_latter_form_button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      <div className="allotment_table_wrapper">
        <table className="allotment_table">
          <thead className="allotment_table_thead">
            <tr>
              <th>Apartment Name</th>
              <th>KHNO</th>
              <th>Mouze No</th>
              <th>Sheet No</th>
              <th>City Survey No</th>
              <th>Name</th>
              <th>Total Amount</th>
              <th>Total Amount in Words</th>
              <th>Agreement Date</th>
              <th>Area in Square Meters</th>
              <th>Area in Square Feet</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="allotment_table_tbody">
            {getAllAllotment.map((allotment, index) => (
              <tr key={index}>
                <td>{allotment.apartmentName}</td>
                <td>{allotment.khno}</td>
                <td>{allotment.mouzeNo}</td>
                <td>{allotment.sheetNo}</td>
                <td>{allotment.citySurveyNo}</td>
                <td>{allotment.name}</td>
                <td>{allotment.totalamount}</td>
                <td>{allotment.totalamountword}</td>
                <td>
                  {new Date(allotment.agreementDate).toLocaleDateString("en-GB")}
                </td>
                <td>{allotment.sqmtrs}</td>
                <td>{allotment.sqft}</td>
                <td>
                  <button
                    onClick={() => showmyallotmentlatter(allotment.id)}
                    className="latter_show_button"
                  >
                    Show
                  </button>
                  <button
                    onClick={() => deleteallotment(allotment.id)}
                    className="latter_show_delete"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEdit(allotment)}
                    className="latter_show_edit"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ShowAllotmentLatter && singleAllotmentlatter && (
        <div className="allotment_latter_main_container">
          <button
            onClick={handleDownload}
            className="allotment_latter_downlode_button"
          >
            Download
          </button>
          <button
            onClick={() => setShowAllotmentLatter(false)}
            className="allotment_latter_close_button"
          >
            Close
          </button>
          <div className="allotment_latter_container" ref={letterRef}>
            <div className="relieving_header_section">
                        <div className="relieving_company_logo_container">
                          <img style={{ height: "208px", width: "auto" }} className="relieving_company_logo" src={AGImg} alt="logo" />
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
            <div className="allotment_latter_heading">
              <h2 style={{ textAlign: "center", marginTop: "20px" }}>
                ALLOTMENT LETTER
              </h2>
              <p style={{ marginTop: "25px", lineHeight: "45px" }}>
                This is to certify that we have allotted the apartment{" "}
                <b>{singleAllotmentlatter.apartmentName}</b> situated at Kh.
                No. <b>{singleAllotmentlatter.khno}</b>, Mouza{" "}
                <b>{singleAllotmentlatter.mouzeNo}</b>, Sheet No.{" "}
                <b>{singleAllotmentlatter.sheetNo}</b>, City Survey No.{" "}
                <b>{singleAllotmentlatter.citySurveyNo}</b>, Nagpur to Mr./Mrs{" "}
                <b>{singleAllotmentlatter.name}</b> for the total consideration
                of Rs. <b>{singleAllotmentlatter.totalamount}</b> (Rupees{" "}
                <b>{singleAllotmentlatter.totalamountword}</b>) only under an
                Agreement Dt.{" "}
                <b>
                  {new Date(
                    singleAllotmentlatter.agreementDate
                  ).toLocaleDateString("en-GB")}
                </b>{" "}
                along with residential construction of about{" "}
                <b>{singleAllotmentlatter.sqmtrs}</b> Sq.mtrs (
                <b>{singleAllotmentlatter.sqft}</b> Sq.Ft). We confirm that we
                have obtained necessary permission/s / approvals / sanction for
                construction of said building from all the concerned competent
                authorities. We assure you that the said building and the land
                apartment thereto are not subject to any encumbrance charges or
                liabilities and that the entire property is free and marketable
                title of the said property and every part thereof.
              </p>
            </div>
            <p style={{ marginTop: "35px" }}>Authorized Signatory</p>
            <p>Date: {myCurrentDate}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default AllotmentLatter;