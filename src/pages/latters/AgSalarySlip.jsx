import { useState, useRef, useEffect } from "react";
import html2pdf from "html2pdf.js";
import "./AgSalary.css";
import { BASE_URL } from "../../config";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaGlobe,
  FaPhoneAlt,
} from "react-icons/fa";
import AGImg from "../../assets/ag construction-1.png";

function AgSalarySlip() {
  const token = JSON.parse(
    localStorage.getItem("employeROyalmadeLogin")
  )?.token;
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    designation: "",
    department: "",
    monthYear: "",
    paidDays: "",
    uanNo: "",
    bankAccountNo: "",
    dateOfJoining: "",
    basic: "",
    hra: "",
    bonus: "",
    allowance: "",
    pfAmount: "",
    professionalTax: "",
    otherDeductions: "",
    loan: "",
  });

  const [submittedData, setSubmittedData] = useState(null);
  const [salarySlips, setSalarySlips] = useState([]);
  const slipRef = useRef(null);
  const [ShowSlip, setShowSlip] = useState(false);
  const [editId, setEditId] = useState(null);
   const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchSalarySlips = async () => {
    try {
      const response = await fetch(`${BASE_URL}/salary-slips`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setSalarySlips(data);
    } catch (err) {
      console.error("Failed to fetch salary slips:", err);
      alert("Failed to load salary slips.");
    }
  };

  useEffect(() => {
    fetchSalarySlips();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = {
      ...formData,
      basic: parseFloat(formData.basic) || 0,
      hra: parseFloat(formData.hra) || 0,
      bonus: parseFloat(formData.bonus) || 0,
      allowance: parseFloat(formData.allowance) || 0,
      pfAmount: parseFloat(formData.pfAmount) || 0,
      professionalTax: parseFloat(formData.professionalTax) || 0,
      otherDeductions: parseFloat(formData.otherDeductions) || 0,
      loan: parseFloat(formData.loan) || 0,
      paidDays: parseInt(formData.paidDays) || 0,
    };

    const payload = {
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      designation: data.designation,
      department: data.department,
      month: formatMonthYear(data.monthYear).split(" ")[0],
      year: parseInt(data.monthYear.split("-")[0]),
      paidDays: data.paidDays,
      uanNo: data.uanNo,
      bankAccountNo: data.bankAccountNo,
      dateOfJoining: data.dateOfJoining,
      basic: data.basic,
      hra: data.hra,
      bonus: data.bonus,
      allowance: data.allowance,
      pfAmount: data.pfAmount,
      professionalTax: data.professionalTax,
      otherDeductions: data.otherDeductions,
      loan: data.loan,
    };

    try {
      if (editId) {
        // UPDATE
        const response = await axios.put(
          `${BASE_URL}/salary-slips/${editId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Salary slip updated successfully!");
        setEditId(null);
      } else {
        // CREATE
        const response = await fetch(`${BASE_URL}/salary-slips`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        await response.json();
        alert("Salary slip successfully submitted!");
      }

      setFormData({
        employeeId: "",
        employeeName: "",
        designation: "",
        department: "",
        monthYear: "",
        paidDays: "",
        uanNo: "",
        bankAccountNo: "",
        dateOfJoining: "",
        basic: "",
        hra: "",
        bonus: "",
        allowance: "",
        pfAmount: "",
        professionalTax: "",
        otherDeductions: "",
        loan: "",
      });

      fetchSalarySlips();
      setSubmittedData(null);
    } catch (err) {
      console.error("Failed to submit/update salary slip:", err);
      alert("Operation failed. Please try again.");
     
    }
    finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  const handleEditSlip = (slip) => {
    console.log(slip);
    setEditId(slip.id);
    setFormData({
      employeeId: slip.employeeId,
      employeeName: slip.employeeName,
      designation: slip.designation,
      department: slip.department,
      monthYear: `${slip.year}-${String(
        new Date(`${slip.month} 1, ${slip.year}`).getMonth() + 1
      ).padStart(2, "0")}`,
      paidDays: slip.paidDays,
      uanNo: slip.uanNo,
      bankAccountNo: slip.bankAccountNo,
      dateOfJoining: slip.dateOfJoining ? slip.dateOfJoining.slice(0, 10) : "",
      basic: slip.basic,
      hra: slip.hra,
      bonus: slip.bonus,
      allowance: slip.allowance,
      pfAmount: slip.pfAmount,
      professionalTax: slip.professionalTax,
      otherDeductions: slip.otherDeductions,
      loan: slip.loan,
    });
  };

  const handleDownloadPDF = () => {
    if (!slipRef.current) {
      alert("Salary slip not found.");
      return;
    }
    const opt = {
      margin: 0.3,
      filename: `AG_Construction_Salary_Slip_${submittedData.employeeId}_${submittedData.month}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(slipRef.current).save();
  };

  const calculateTotalAddition = (data) =>
    data ? data.basic + data.hra + data.bonus + data.allowance : 0;
  const calculateTotalDeductions = (data) =>
    data
      ? data.pfAmount + data.professionalTax + data.otherDeductions + data.loan
      : 0;
  const calculateNetSalary = (data) =>
    data ? calculateTotalAddition(data) - calculateTotalDeductions(data) : 0;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  const formatMonthYear = (monthYear) => {
    if (!monthYear) return "N/A";
    const [year, month] = monthYear.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleString("en-IN", { month: "long", year: "numeric" });
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN") : "N/A";

  async function handleDeleteSlip(id) {
    const confirmDelete = window.confirm("Are you sure to delete?");
    if (!confirmDelete) return;
    try {
      const response = await axios.delete(`${BASE_URL}/salary-slips/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 204) {
        alert("Deleted successfully");
        fetchSalarySlips();
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="AgSalarySlip-container">
      <div className="AgSalarySlip-form-container">
        <h2>AG Construction Salary Slip Form</h2>
        <form onSubmit={handleSubmit} className="AgSalarySlip-form">
          <div className="AgSalarySlip-grid">
            <div className="AgSalarySlip-form-group">
              <label className="AgSalarySlip-label">Employee ID</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="AgSalarySlip-input"
                required
              />
            </div>
            <div className="AgSalarySlip-form-group">
              <label className="AgSalarySlip-label">Employee Name</label>
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
                className="AgSalarySlip-input"
                required
              />
            </div>
            <div className="AgSalarySlip-form-group">
              <label className="AgSalarySlip-label">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="AgSalarySlip-input"
                required
              />
            </div>
            <div className="AgSalarySlip-form-group">
              <label className="AgSalarySlip-label">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="AgSalarySlip-input"
                required
              />
            </div>
            <div className="AgSalarySlip-form-group">
              <label className="AgSalarySlip-label">Month & Year</label>
              <input
                type="month"
                name="monthYear"
                value={formData.monthYear}
                onChange={handleChange}
                className="AgSalarySlip-input"
                required
              />
            </div>
            <div className="AgSalarySlip-form-group">
              <label className="AgSalarySlip-label">Paid Days</label>
              <input
                type="number"
                name="paidDays"
                value={formData.paidDays}
                onChange={handleChange}
                className="AgSalarySlip-input"
                required
                min="0"
              />
            </div>
            <div className="AgSalarySlip-form-group">
              <label className="AgSalarySlip-label">UAN No.</label>
              <input
                type="text"
                name="uanNo"
                value={formData.uanNo}
                onChange={handleChange}
                className="AgSalarySlip-input"
              />
            </div>
            <div className="AgSalarySlip-form-group">
              <label className="AgSalarySlip-label">Bank Account No.</label>
              <input
                type="text"
                name="bankAccountNo"
                value={formData.bankAccountNo}
                onChange={handleChange}
                className="AgSalarySlip-input"
              />
            </div>
            <div className="AgSalarySlip-form-group">
              <label className="AgSalarySlip-label">Date of Joining</label>
              <input
                type="date"
                name="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={handleChange}
                className="AgSalarySlip-input"
              />
            </div>
            <div className="AgSalarySlip-form-group">
              <label className="AgSalarySlip-label">Basic Salary (₹)</label>
              <input
                type="number"
                name="basic"
                value={formData.basic}
                onChange={handleChange}
                className="AgSalarySlip-input"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="AgSalarySlip-form-group">
              <label className="AgSalarySlip-label">HRA (₹)</label>
              <input
                type="number"
                name="hra"
                value={formData.hra}
                onChange={handleChange}
                className="AgSalarySlip-input"
                min="0"
                step="0.01"
              />
            </div>
            <div className="AgSalarySlip-form-group">
              <label className="AgSalarySlip-label">Bonus (₹)</label>
              <input
                type="number"
                name="bonus"
                value={formData.bonus}
                onChange={handleChange}
                className="AgSalarySlip-input"
                min="0"
                step="0.01"
              />
            </div>
            <div className="AgSalarySlip-form-group">
              <label className="AgSalarySlip-label">
                Conveyance Allowance (₹)
              </label>
              <input
                type="number"
                name="allowance"
                value={formData.allowance}
                onChange={handleChange}
                className="AgSalarySlip-input"
                min="0"
                step="0.01"
              />
            </div>
            <div className="AgSalarySlip-form-group">
              <label className="AgSalarySlip-label">Provident Fund (₹)</label>
              <input
                type="number"
                name="pfAmount"
                value={formData.pfAmount}
                onChange={handleChange}
                className="AgSalarySlip-input"
                min="0"
                step="0.01"
              />
            </div>
            <div className="AgSalarySlip-form-group">
              <label className="AgSalarySlip-label">Professional Tax (₹)</label>
              <input
                type="number"
                name="professionalTax"
                value={formData.professionalTax}
                onChange={handleChange}
                className="AgSalarySlip-input"
                min="0"
                step="0.01"
              />
            </div>
            <div className="AgSalarySlip-form-group">
              <label className="AgSalarySlip-label">Other Deductions (₹)</label>
              <input
                type="number"
                name="otherDeductions"
                value={formData.otherDeductions}
                onChange={handleChange}
                className="AgSalarySlip-input"
                min="0"
                step="0.01"
              />
            </div>
            <div className="AgSalarySlip-form-group">
              <label className="AgSalarySlip-label">Loan (₹)</label>
              <input
                type="number"
                name="loan"
                value={formData.loan}
                onChange={handleChange}
                className="AgSalarySlip-input"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <button type="submit" className="AgSalarySlip-submit-button" disabled={isSubmitting}>
            {isSubmitting ? "generating..." : editId ? "Update Salary Slip" : "Generate Salary Slip"}
          </button>
        </form>
      </div>
      <div className="AgSalarySlip-table-container">
        <h2>All Salary Slips</h2>
        <table className="AgSalarySlip-salary-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Month</th>
              <th>Year</th>
              <th>Paid Days</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {salarySlips.length === 0 ? (
              <tr>
                <td colSpan="6">No salary slips found.</td>
              </tr>
            ) : (
              salarySlips.map((slip) => (
                <tr key={slip.id}>
                  <td>{slip.employeeId}</td>
                  <td>{slip.employeeName}</td>
                  <td>{slip.month}</td>
                  <td>{slip.year}</td>
                  <td>{slip.paidDays}</td>
                  <td>
                    <button
                      className="AgSalarySlip-action-button show"
                      onClick={() => setSubmittedData(slip)}
                    >
                      Show
                    </button>
                    <button
                      className="AgSalarySlip-action-button show"
                      onClick={() => handleEditSlip(slip)}
                    >
                      Edit
                    </button>
                    <button
                      className="AgSalarySlip-action-button delete"
                      onClick={() => handleDeleteSlip(slip.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>{" "}
      {submittedData && (
        <div className="AgSalarySlip-slip-container">
          <div className="Print_section" ref={slipRef}>
            <div className="AgSalarySlip-slip-header">
               <div className="relieving_header_section">
                          <div className="relieving_company_logo_container">
                            <img className="relieving_company_logo" src={AGImg} alt="logo" style={{height: "215px"}} />
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
              <h3 className="AgSalarySlip-slip-month">
                Month: {submittedData.month}
              </h3>
            </div>
            <div className="AgSalarySlip-slip-details">
              <div className="AgSalarySlip-employee-info">
                <p>
                  <strong>Employee Name:</strong> {submittedData.employeeName}
                </p>
                <p>
                  <strong>Employee ID:</strong> {submittedData.employeeId}
                </p>
                <p>
                  <strong>Designation:</strong> {submittedData.designation}
                </p>
                <p>
                  <strong>Department:</strong> {submittedData.department}
                </p>
                <p>
                  <strong>Paid Days:</strong> {submittedData.paidDays}
                </p>
                <p>
                  <strong>UAN No.:</strong> {submittedData.uanNo || "N/A"}
                </p>
                <p>
                  <strong>Bank Account No.:</strong>{" "}
                  {submittedData.bankAccountNo || "N/A"}
                </p>
                <p>
                  <strong>Date of Joining:</strong>{" "}
                  {formatDate(submittedData.dateOfJoining)}
                </p>
              </div>
              <div className="AgSalarySlip-slip-tables">
                <div className="AgSalarySlip-earnings">
                  <h3 className="AgSalarySlip-section-title">Earnings</h3>
                  <table className="AgSalarySlip-table">
                    <tbody>
                      <tr>
                        <td>Basic Salary</td>
                        <td>{formatCurrency(submittedData.basic)}</td>
                      </tr>
                      <tr>
                        <td>HRA</td>
                        <td>{formatCurrency(submittedData.hra)}</td>
                      </tr>
                      <tr>
                        <td>Conveyance</td>
                        <td>{formatCurrency(submittedData.allowance)}</td>
                      </tr>
                      <tr>
                        <td>Bonus</td>
                        <td>{formatCurrency(submittedData.bonus)}</td>
                      </tr>
                      <tr className="AgSalarySlip-total">
                        <td>
                          <strong>Total Earnings</strong>
                        </td>
                        <td>
                          <strong>
                            {formatCurrency(
                              calculateTotalAddition(submittedData)
                            )}
                          </strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="AgSalarySlip-deductions">
                  <h3 className="AgSalarySlip-section-title">Deductions</h3>
                  <table className="AgSalarySlip-table">
                    <tbody>
                      <tr>
                        <td>Provident Fund</td>
                        <td>{formatCurrency(submittedData.pfAmount)}</td>
                      </tr>
                      <tr>
                        <td>Professional Tax</td>
                        <td>{formatCurrency(submittedData.professionalTax)}</td>
                      </tr>
                      <tr>
                        <td>Other Deductions</td>
                        <td>{formatCurrency(submittedData.otherDeductions)}</td>
                      </tr>
                      <tr>
                        <td>Loan</td>
                        <td>{formatCurrency(submittedData.loan)}</td>
                      </tr>
                      <tr className="AgSalarySlip-total">
                        <td>
                          <strong>Total Deductions</strong>
                        </td>
                        <td>
                          <strong>
                            {formatCurrency(
                              calculateTotalDeductions(submittedData)
                            )}
                          </strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="AgSalarySlip-net-salary">
                <p>
                  <strong>Net Salary:</strong>{" "}
                  {formatCurrency(calculateNetSalary(submittedData))}
                </p>
              </div>
            </div>
           
          </div>

          <button
            onClick={handleDownloadPDF}
            className="AgSalarySlip-download-button"
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default AgSalarySlip;
