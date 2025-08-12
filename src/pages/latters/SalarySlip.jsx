import axios from "axios";
import React, { useState } from "react";
import "./Latter.css";
import { BASE_URL } from "../../config";
import logo from "../../assets/royal.png";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaGlobe,
  FaPhoneAlt,
} from "react-icons/fa";
function SalarySlip() {
  const [employeeName, setEmployeeName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [todayDate, setTodayDate] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = JSON.parse(
    localStorage.getItem("employeROyalmadeLogin")
  )?.token;

  const [showSalarySlip, setShowSalarySlip] = useState(true);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formdata = {
      employeeName,
      branchName,
      todayDate,
      salaryFrom,
      salaryTo,
      amount,
      status,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/createsalarySlip`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      alert("Form submitted successfully!");

      setEmployeeName("");
      setBranchName("");
      setTodayDate("");
      setSalaryFrom("");
      setSalaryTo("");
      setAmount("");
      setStatus("");
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
    finally {
      setIsSubmitting(false);
    
    }
  };

  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "50px" }}>Salary Slip</h1>

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
            <label className="offer_latter_lable">Branch Name:</label>
            <input
              type="text"
              className="offer_latter_input"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              required
            />
          </div>

          <div className="offer_latter_div">
            <label className="offer_latter_lable">Today's Date:</label>
            <input
              type="date"
              className="offer_latter_input"
              value={todayDate || new Date().toISOString().split("T")[0]}
              onChange={(e) => setTodayDate(e.target.value)}
              required
            />
          </div>

          <div className="offer_latter_div">
            <label className="offer_latter_lable">Salary From:</label>
            <input
              type="date"
              className="offer_latter_input"
              value={salaryFrom || new Date().toISOString().split("T")[0]}
              onChange={(e) => setSalaryFrom(e.target.value)}
              required
            />
          </div>

          <div className="offer_latter_div">
            <label className="offer_latter_lable">Salary To:</label>
            <input
              type="date"
              className="offer_latter_input"
              value={salaryTo || new Date().toISOString().split("T")[0]}
              onChange={(e) => setSalaryTo(e.target.value)}
              required
            />
          </div>

          <div className="offer_latter_div">
            <label className="offer_latter_lable">Amount:</label>
            <input
              type="text"
              className="offer_latter_input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="offer_latter_div">
            <label className="offer_latter_lable">Status:</label>
            <input
              type="text"
              className="offer_latter_input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            />
          </div>

          <div className="offer_latter_div">
            <button type="submit" className="offer_latter_button" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {showSalarySlip && (
        <>
          <p> salary slip</p>

          <div
            style={{
              textAlign: "right",
              marginBottom: "20px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              color: "#000",
              alignItems: "center",
            }}
          >
            <div className="reliveling_logo_wrapper">
              <img
                style={{
                  height: "100px", // Set desired height
                  width: "auto", // Auto to maintain aspect ratio
                  objectFit: "contain", // Prevent distortion
                }}
                src={logo}
                alt=""
              />
            </div>

            <div
              style={{
                fontFamily: "Arial, sans-serif",
                lineHeight: "20px",
                width: "100%",
                margin: "auto",
                padding: "20px",
                color: "#000",
              }}
            >
              {/* Address Section */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "right",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <div
                  style={{
                    lineHeight: "30px",
                    marginRight: "30px",
                    width: "100%",
                  }}
                >
                  <p>Plot No. 28, 1st Floor, Govind Prabhau Nagar,</p>
                  <p>Hudkeshwar Road, Nagpur - 440034</p>
                </div>
                <div
                  style={{
                    backgroundColor: "#d34508",
                    padding: "10px",
                    borderRadius: "1px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FaMapMarkerAlt size={18} color="#ffff" />
                </div>
              </div>

              {/* Email */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "right",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <p style={{ marginRight: "30px" }}>royaalmede@gmail.com</p>
                <div
                  style={{
                    backgroundColor: "#d34508",
                    padding: "10px",
                    borderRadius: "1px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FaEnvelope size={18} color="#ffff" />
                </div>
              </div>

              {/* Website */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "right",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <p style={{ marginRight: "30px" }}>www.royaalmede.co.in</p>
                <div
                  style={{
                    backgroundColor: "#d34508",
                    padding: "10px",
                    borderRadius: "1px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FaGlobe size={18} color="#ffff" />
                </div>
              </div>

              {/* Phone */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "right",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <p style={{ marginRight: "30px" }}>9028999253 | 9373450092</p>
                <div
                  style={{
                    backgroundColor: "#d34508",
                    padding: "10px",
                    borderRadius: "1px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FaPhoneAlt size={18} color="#ffff" />
                </div>
              </div>
            </div>
          </div>
          <hr
            style={{ border: "1px solid rgb(167, 5, 86)", marginBottom: "2px" }}
          />
          <hr style={{ border: "3px solid rgb(167, 5, 86)" }} />
          <h2
            style={{ marginTop: "10px", textAlign: "center" }}
            className="reliveing_letter_heading"
          >
            {" "}
            Salary Slip
          </h2>
        </>
      )}
    </>
  );
}

export default SalarySlip;
