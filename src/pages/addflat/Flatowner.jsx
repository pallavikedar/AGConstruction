import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import html2pdf from "html2pdf.js/dist/html2pdf";
import "../addflat/FlatOwner.css";
import AGImg from "../../assets/ag construction-1.png";
import { FaMapMarkerAlt, FaGlobe, FaPhoneAlt } from "react-icons/fa";

import {
  BsBuilding,
  BsBank,
  BsCreditCard,
  BsFileText,
  BsPrinter,
  BsDownload,
  BsX,
  BsPlus,
  BsEye,
  BsPencil,
  BsTrash,
} from "react-icons/bs";
import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaAddressCard,
  FaHandshake,
  FaBuilding,
  FaCalendarAlt,
  FaBook,
} from "react-icons/fa";
import {
  MdOutlineAttachMoney,
  MdConfirmationNumber,
  MdEdit,
  MdClose,
  MdSave,
} from "react-icons/md";
import { RiFilePaper2Fill, RiMoneyDollarCircleFill } from "react-icons/ri";
import { LuFileType } from "react-icons/lu";
import { SiFlathub } from "react-icons/si";
import { GrStatusUnknown } from "react-icons/gr";
import { CiBank } from "react-icons/ci";

import { BASE_URL } from "../../config";

function Flatowner() {
  const letterref = useRef();
  const { id } = useParams();
  const navigate = useNavigate();
  const token = JSON.parse(
    localStorage.getItem("employeROyalmadeLogin")
  )?.token;
 const user = JSON.parse(localStorage.getItem("employeROyalmadeLogin"));
 
  const role = user?.role;
  // State management
  const [customerDetail, setCustomerDetail] = useState(null);
  const [bankName, setbankName] = useState("");
  const [LoanAmount, setLoanAmount] = useState("");
  const [customerid, setCustomerId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showBankDetailForm, setshowBankDetailForm] = useState(false);
  const [showInstallmentForm, setShowInstallmentForm] = useState(false);
  const [installmentData, setInstallmentDate] = useState("");
  const [installmentAmount, setInstallMentAmount] = useState("");
  const [selectinstallmentType, setselectinstallmentType] = useState("");
  const [showCustomerInstallMentcard, setshowCustomerInstallMentcard] =
    useState(false);
  const [customerInstallMentDeta, setcustomerInstallMentDeta] = useState("");
  const [customerSlip, setcustomerSlip] = useState(false);
  const [note, setNote] = useState("");
  const [showCustomerInstallmentEditForm, setshowCustomerInstallmentEditForm] =
    useState(false);
  const [installmentId, setinstallmentId] = useState("");
  const [InstallmentEditFormDate, setInstallmentEditFormDate] = useState("");
  const [InstallmentEditFormAmount, setInstallmentEditFormAmount] =
    useState("");
  const [
    InstallmentEditFormPaymentMethod,
    setInstallmentEditFormPaymentMethod,
  ] = useState("");
  const [InstallmentEditFormRemark, setInstallmentEditFormRemark] =
    useState("");
  const [ShowEditCustomerForm, setShowEditCustomerForm] = useState(false);
  const [customerBookingUpdateId, setcustomerBookingUpdateId] = useState("");
  const [dealPrice, setDealPrice] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [agreementAmount, setAgreementAmount] = useState("");
  const [stampDutyAmount, setStampDutyAmount] = useState("");
  const [registrationAmount, setRegistrationAmount] = useState("");
  const [gstAmount, setGstAmount] = useState("");
  const [electricWaterAmmount, setElectricWaterAmmount] = useState("");
  const [legalChargesAmmout, setLegalChargesAmmout] = useState("");
  const [bookedOn, setBookedOn] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [address, setAddress] = useState("");
  const [panCard, setPanCard] = useState("");
  const [agentName, setAgentName] = useState("");
  const [brokerage, setBrokerage] = useState("");
  const [customerBookingId, setcustomerBookingId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API calls and handlers (keeping the same logic)
  useEffect(() => {
    async function customerProfile() {
      try {
        const response = await axios.get(`${BASE_URL}/booking/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(response.data);
        setCustomerId(response?.data?.customer?.id);
        setCustomerDetail(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    customerProfile();
  }, [id, token, refreshKey]);

  async function handleSubmitloan(e) {
    e.preventDefault();
    setIsSubmitting(true);
    const formdata = {
      bankName: bankName,
      loanAmount: LoanAmount.replace(/,/g, ""),
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/addLoanDetails/${customerid}`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Bank details added successfully");
        setbankName("");
        setLoanAmount("");
        setRefreshKey((prev) => prev + 1);
        setshowBankDetailForm(false);
      }
    } catch (error) {
      setIsSubmitting(false);
      console.log(error);
    }
  }

  async function handleCancleBooking() {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel the booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.put(
          `${BASE_URL}/cancelBooking/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        Swal.fire("Cancelled!", "Booking has been cancelled.", "success");
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function handleAddflatinstallment(e) {
    e.preventDefault();
    setIsSubmitting(true);
    const formdata = [
      {
        installmentDate:
          installmentData || new Date().toISOString().split("T")[0],
        installmentAmount: installmentAmount.replace(/,/g, ""),
        installmentStatus: selectinstallmentType,
        remark: note,
      },
    ];
    try {
      await axios.post(`${BASE_URL}/${id}/addInstallment`, formdata, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      Swal.fire("Success!", "Payment added successfully", "success");
      setShowInstallmentForm(false);
      setInstallmentDate("");
      setInstallMentAmount("");
      setselectinstallmentType("");
      setNote("");
      setRefreshKey(refreshKey + 1);
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  }

  async function handleShowInstallment() {
    setshowCustomerInstallMentcard(true);
    try {
      const response = await axios.get(`${BASE_URL}/BookingSummary/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setcustomerInstallMentDeta(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleDownload = () => {
    const element = letterref.current;
    const options = {
     
      filename: "Final Booking Slip.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(options).from(element).save();
  };

  async function handleEditInstallment(installmentId) {
    setinstallmentId(installmentId);
    setshowCustomerInstallmentEditForm(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/getBookingInstallmentById/${installmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setInstallmentEditFormAmount(response.data.installmentAmount);
      setInstallmentEditFormDate(response.data.installmentDate);
      setInstallmentEditFormPaymentMethod(response.data.installmentStatus);
      setInstallmentEditFormRemark(response.data.remark);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = {
      installmentDate: InstallmentEditFormDate,
      installmentAmount: String(InstallmentEditFormAmount)?.replace(/,/g, ""),
      remark: InstallmentEditFormRemark,
      installmentStatus: InstallmentEditFormPaymentMethod,
    };
    try {
      const response = await axios.put(
        `${BASE_URL}/updateBookingInstallment/${installmentId}`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        Swal.fire("Success!", "Installment updated successfully", "success");
        handleShowInstallment();
        setshowCustomerInstallmentEditForm(false);
        setInstallmentEditFormDate("");
        setInstallmentEditFormAmount("");
        setInstallmentEditFormRemark("");
        setInstallmentEditFormPaymentMethod("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function handleDeleteInstallment(id) {
    const result = window.confirm("Are you sure To Delete ?");

    if (result) {
      try {
        await axios.delete(`${BASE_URL}/deleteBookingInstallment/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        Swal.fire("Deleted!", "Installment has been deleted.", "success");
        setRefreshKey(refreshKey + 1);
        setcustomerInstallMentDeta((prev) => ({
          ...prev,
          bookingInstallments: prev.bookingInstallments.filter(
            (installment) => installment.id !== id
          ),
        }));
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handlePrintInstallment = () => {
    const element = document
      .getElementById("customerInstallmentCard")
      .cloneNode(true);
    element
      .querySelectorAll(".flatowner-action-btn, .flatowner-action-column")
      .forEach((btn) => btn.remove());
    element.style.padding = "20px";
    html2pdf()
      .from(element)
      .save(`Customer_Installment_${customerInstallMentDeta.identifier}.pdf`);
  };

  async function handleEditCustomerDetail(customerId, bookingId) {
    setcustomerBookingUpdateId(customerId);
    setcustomerBookingId(bookingId);
    setShowEditCustomerForm(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/getBookingCoustomerId/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Set all form values from response
      setAgreementAmount(response.data.agreementAmount);
      setDealPrice(response.data.dealPrice);
      setTokenAmount(response.data.tokenAmount);
      setStampDutyAmount(response.data.stampDutyAmount);
      setRegistrationAmount(response.data.registrationAmount);
      setGstAmount(response.data.gstAmount);
      setElectricWaterAmmount(response.data.electricWaterAmmount);
      setLegalChargesAmmout(response.data.legalChargesAmmout);
      setBookedOn(response.data.bookedOn);
      setBookingStatus(response.data.bookingStatus);
      setName(response.data?.customer?.name);
      setPhoneNumber(response.data?.customer?.phoneNumber);
      setEmail(response.data?.customer?.email);
      setAadharNumber(response.data?.customer?.aadharNumber);
      setAddress(response.data?.customer?.address);
      setPanCard(response.data?.customer?.panCard);
      setAgentName(response.data?.customer?.agentName);
      setBrokerage(response.data?.customer?.brokerage);
      setbankName(response.data?.customer?.bankName || "");
      setLoanAmount(response.data?.customer?.loanAmount || "");
    } catch (error) {
      console.log(error);
    }
  }

  const handleUpdateCustomerDetail = async (e) => {
    e.preventDefault();
    const payload = {
      dealPrice,
      tokenAmount,
      agreementAmount,
      stampDutyAmount,
      registrationAmount,
      gstAmount,
      electricWaterAmmount,
      legalChargesAmmout,
      bookedOn,
      bookingStatus,
      customerDto: {
        name,
        phoneNumber,
        email,
        aadharNumber,
        address,
        panCard,
        agentName,
        brokerage,
        bankName,
        loanAmount: LoanAmount.replace(/,/g, ""),
      },
    };
    try {
      const response = await axios.put(
        `${BASE_URL}/updateBooking/${customerBookingId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        Swal.fire(
          "Success!",
          "Customer details updated successfully",
          "success"
        );
        setRefreshKey((prev) => prev + 1);
        setShowEditCustomerForm(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flatowner-main-container">
      {/* Header Section */}
      <div className="flatowner-header">
        <div className="flatowner-header-content">
          <h1 className="flatowner-title">
            <BsBuilding className="flatowner-title-icon" />
            Flat Owner Management
          </h1>
          <p className="flatowner-subtitle">
            Comprehensive property and customer management system
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flatowner-action-bar">
        <button
          className="flatowner-btn flatowner-btn-primary"
          onClick={() => setcustomerSlip(!customerSlip)}
        >
          <BsFileText />
          Customer Slip
        </button>
        <button
          className="flatowner-btn flatowner-btn-secondary"
          onClick={() => setshowBankDetailForm(true)}
        >
          <BsBank />
          Add Bank Details
        </button>
        <button
          className="flatowner-btn flatowner-btn-success"
          onClick={() => setShowInstallmentForm(true)}
        >
          <BsPlus />
          Add Installment
        </button>
        <button
          className="flatowner-btn flatowner-btn-info"
          onClick={handleShowInstallment}
        >
          <BsEye />
          View Installments
        </button>
        <button
          className="flatowner-btn flatowner-btn-danger"
          onClick={handleCancleBooking}
        >
          <BsX />
          Cancel Booking
        </button>
      </div>

      {/* Customer Details Card */}
      {customerDetail ? (
        <div className="flatowner-customer-card">
          <div className="flatowner-card-header">
            <div className="flatowner-flat-info">
              <h2 className="flatowner-flat-number">
                <BsBuilding className="flatowner-icon" />
                Flat No: {customerDetail.residency?.identifier || "N/A"}
              </h2>
              <button
                className="flatowner-edit-btn"
                onClick={() =>
                  handleEditCustomerDetail(
                    customerDetail.customer?.id,
                    customerDetail.id
                  )
                }
              >
                <MdEdit />
                Edit Details
              </button>
            </div>
            <div className="flatowner-customer-name">
              <h3>{customerDetail.customer?.name || "N/A"}</h3>
              <p>{customerDetail.customer?.phoneNumber || "N/A"}</p>
            </div>
          </div>
              <div > {role === "Admin" && <span >This Flat Detail Updated By</span>} {role === "Admin" && (<span style={{color:"red"}}>{customerDetail?.updatedBy || "-"}</span> // Conditional rendering of updatedBy
                    )}</div>
          <div className="flatowner-details-grid">
            {/* Customer Information */}
            <div className="flatowner-info-section">
              <h4 className="flatowner-section-title">
                <FaUser className="flatowner-section-icon" />
                Customer Information
              </h4>
              <div className="flatowner-info-list">
                <div className="flatowner-info-item">
                  <FaEnvelope className="flatowner-item-icon" />
                  <span className="flatowner-label">Email:</span>
                  <span className="flatowner-value">
                    {customerDetail.customer?.email || "N/A"}
                  </span>
                </div>
                <div className="flatowner-info-item">
                  <FaIdCard className="flatowner-item-icon" />
                  <span className="flatowner-label">PAN Card:</span>
                  <span className="flatowner-value">
                    {customerDetail.customer?.panCard || "N/A"}
                  </span>
                </div>
                <div className="flatowner-info-item">
                  <BsCreditCard className="flatowner-item-icon" />
                  <span className="flatowner-label">Aadhar:</span>
                  <span className="flatowner-value">
                    {customerDetail.customer?.aadharNumber || "N/A"}
                  </span>
                </div>
                <div className="flatowner-info-item">
                  <FaAddressCard className="flatowner-item-icon" />
                  <span className="flatowner-label">Address:</span>
                  <span className="flatowner-value">
                    {customerDetail.customer?.address || "N/A"}
                  </span>
                </div>
                <div className="flatowner-info-item">
                  <FaHandshake className="flatowner-item-icon" />
                  <span className="flatowner-label">Agent:</span>
                  <span className="flatowner-value">
                    {customerDetail.customer?.agentName || "N/A"}
                  </span>
                </div>
                <div className="flatowner-info-item">
                  <MdOutlineAttachMoney className="flatowner-item-icon" />
                  <span className="flatowner-label">Brokerage:</span>
                  <span className="flatowner-value">
                    {customerDetail.customer?.brokerage
                      ? Number(
                          customerDetail.customer.brokerage
                        ).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Residency Information */}
            <div className="flatowner-info-section">
              <h4 className="flatowner-section-title">
                <FaBuilding className="flatowner-section-icon" />
                Property Details
              </h4>
              <div className="flatowner-info-list">
                <div className="flatowner-info-item">
                  <BsBuilding className="flatowner-item-icon" />
                  <span className="flatowner-label">Project:</span>
                  <span className="flatowner-value">
                    {customerDetail.residency?.name || "N/A"}
                  </span>
                </div>
                <div className="flatowner-info-item">
                  <LuFileType className="flatowner-item-icon" />
                  <span className="flatowner-label">Flat Type:</span>
                  <span className="flatowner-value">
                    {customerDetail.residency?.flatType || "N/A"}
                  </span>
                </div>
                <div className="flatowner-info-item">
                  <SiFlathub className="flatowner-item-icon" />
                  <span className="flatowner-label">Type:</span>
                  <span className="flatowner-value">
                    {customerDetail.residency?.residencyType || "N/A"}
                  </span>
                </div>
                <div className="flatowner-info-item">
                  <MdConfirmationNumber className="flatowner-item-icon" />
                  <span className="flatowner-label">Floor:</span>
                  <span className="flatowner-value">
                    {customerDetail.residency?.floorNumber || "N/A"}
                  </span>
                </div>
                <div className="flatowner-info-item">
                  <RiMoneyDollarCircleFill className="flatowner-item-icon" />
                  <span className="flatowner-label">Price:</span>
                  <span className="flatowner-value">
                    {customerDetail.residency?.price?.toLocaleString() || "N/A"}
                  </span>
                </div>
                <div className="flatowner-info-item">
                  <GrStatusUnknown className="flatowner-item-icon" />
                  <span className="flatowner-label">Status:</span>
                  <span className="flatowner-value">
                    {customerDetail.residency?.availabilityStatus || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Deal Information */}
            <div className="flatowner-info-section">
              <h4 className="flatowner-section-title">
                <RiFilePaper2Fill className="flatowner-section-icon" />
                Deal Information
              </h4>
              <div className="flatowner-info-list">
                <div className="flatowner-info-item">
                  <FaCalendarAlt className="flatowner-item-icon" />
                  <span className="flatowner-label">Booked On:</span>
                  <span className="flatowner-value">
                    {customerDetail.bookedOn
                      ? new Date(customerDetail.bookedOn).toLocaleDateString(
                          "en-GB"
                        )
                      : "N/A"}
                  </span>
                </div>
                <div className="flatowner-info-item">
                  <FaBook className="flatowner-item-icon" />
                  <span className="flatowner-label">Status:</span>
                  <span className="flatowner-value">
                    {customerDetail.bookingStatus || "N/A"}
                  </span>
                </div>
                <div className="flatowner-info-item">
                  <MdOutlineAttachMoney className="flatowner-item-icon" />
                  <span className="flatowner-label">Deal Price:</span>
                  <span className="flatowner-value">
                    {customerDetail.dealPrice?.toLocaleString() || "N/A"}
                  </span>
                </div>
                <div className="flatowner-info-item">
                  <MdOutlineAttachMoney className="flatowner-item-icon" />
                  <span className="flatowner-label">Token:</span>
                  <span className="flatowner-value">
                    {customerDetail.tokenAmount?.toLocaleString() || "N/A"}
                  </span>
                </div>
                <div className="flatowner-info-item">
                  <RiFilePaper2Fill className="flatowner-item-icon" />
                  <span className="flatowner-label">Agreement:</span>
                  <span className="flatowner-value">
                    {customerDetail.agreementAmount?.toLocaleString() || "N/A"}
                  </span>
                </div>
                <div className="flatowner-info-item">
                  <RiFilePaper2Fill className="flatowner-item-icon" />
                  <span className="flatowner-label">Stamp DutyAmount:</span>
                  <span className="flatowner-value">
                    {customerDetail.stampDutyAmount?.toLocaleString() || "N/A"}
                  </span>
                </div>
                <div className="flatowner-info-item">
                  <RiFilePaper2Fill className="flatowner-item-icon" />
                  <span className="flatowner-label">
                    Electric Water Ammount:
                  </span>
                  <span className="flatowner-value">
                    {customerDetail.electricWaterAmmount?.toLocaleString() ||
                      "N/A"}
                  </span>
                </div>
                <div className="flatowner-info-item">
                  <RiFilePaper2Fill className="flatowner-item-icon" />
                  <span className="flatowner-label">GST Amount:</span>
                  <span className="flatowner-value">
                    {customerDetail.gstAmount?.toLocaleString() || "N/A"}
                  </span>
                </div>
                <div className="flatowner-info-item">
                  <RiFilePaper2Fill className="flatowner-item-icon" />
                  <span className="flatowner-label">Legal Charges Ammout:</span>
                  <span className="flatowner-value">
                    {customerDetail.legalChargesAmmout?.toLocaleString() ||
                      "N/A"}
                  </span>
                </div>
                <div className="flatowner-info-item">
                  <RiFilePaper2Fill className="flatowner-item-icon" />
                  <span className="flatowner-label">Registration Amount:</span>
                  <span className="flatowner-value">
                    {customerDetail.registrationAmount?.toLocaleString() ||
                      "N/A"}
                  </span>
                </div>
                <div className="flatowner-info-item">
                  <CiBank className="flatowner-item-icon" />
                  <span className="flatowner-label">Bank:</span>
                  <span className="flatowner-value">
                    {customerDetail.customer?.bankName || "N/A"}
                  </span>
                </div>
                <div className="flatowner-info-item">
                  <CiBank className="flatowner-item-icon" />
                  <span className="flatowner-label">Bank Amount:</span>
                  <span className="flatowner-value">
                    {customerDetail.customer?.loanAmount?.toLocaleString() ||
                      "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flatowner-loading">
          <div className="flatowner-spinner"></div>
          <p>Loading customer details...</p>
        </div>
      )}

      {/* Bank Details Form Modal */}
      {showBankDetailForm && (
        <div className="flatowner-modal-overlay">
          <div className="flatowner-modal">
            <div className="flatowner-modal-header">
              <h3>Add Bank Details</h3>
              <button
                className="flatowner-close-btn"
                onClick={() => setshowBankDetailForm(false)}
              >
                <MdClose />
              </button>
            </div>
            <form onSubmit={handleSubmitloan} className="flatowner-form">
              <div className="flatowner-form-group">
                <label>Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setbankName(e.target.value)}
                  className="flatowner-input"
                  required
                />
              </div>
              <div className="flatowner-form-group">
                <label>Loan Amount</label>
                <input
                  type="text"
                  value={LoanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="flatowner-input"
                  required
                />
              </div>
              <div className="flatowner-form-actions">
                <button
                  type="button"
                  onClick={() => setshowBankDetailForm(false)}
                  className="flatowner-btn flatowner-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flatowner-btn flatowner-btn-primary"
                  disabled={isSubmitting}
                >
                  <MdSave />
                  {isSubmitting ? "Submitting..." : "Save Details"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Installment Form Modal */}
      {showInstallmentForm && (
        <div className="flatowner-modal-overlay">
          <div className="flatowner-modal">
            <div className="flatowner-modal-header">
              <h3>Add Installment</h3>
              <button
                className="flatowner-close-btn"
                onClick={() => setShowInstallmentForm(false)}
              >
                <MdClose />
              </button>
            </div>
            <form
              onSubmit={handleAddflatinstallment}
              className="flatowner-form"
            >
              <div className="flatowner-form-group">
                <label>Installment Date</label>
                <input
                  type="date"
                  value={
                    installmentData || new Date().toISOString().split("T")[0]
                  }
                  onChange={(e) => setInstallmentDate(e.target.value)}
                  className="flatowner-input"
                />
              </div>
              <div className="flatowner-form-group">
                <label>Amount</label>
                <input
                  type="text"
                  placeholder="Enter installment amount"
                  value={installmentAmount}
                  onChange={(e) => setInstallMentAmount(e.target.value)}
                  className="flatowner-input"
                  required
                />
              </div>
              <div className="flatowner-form-group">
                <label>Payment Method</label>
                <select
                  value={selectinstallmentType}
                  onChange={(e) => setselectinstallmentType(e.target.value)}
                  className="flatowner-select"
                  required
                >
                  <option value="">Select Payment Method</option>
                  <option value="CASH">Cash</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="UPI">UPI</option>
                  <option value="RTGS">RTGS</option>
                  <option value="NEFT">NEFT</option>
                </select>
              </div>
              <div className="flatowner-form-group">
                <label>Note</label>
                <textarea
                  placeholder="Add a note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="flatowner-textarea"
                  rows="3"
                />
              </div>
              <div className="flatowner-form-actions">
                <button
                  type="button"
                  onClick={() => setShowInstallmentForm(false)}
                  className="flatowner-btn flatowner-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flatowner-btn flatowner-btn-success"
                  disabled={isSubmitting}
                >
                  <BsPlus />
                  {isSubmitting ? "Adding..." : "Add Installment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Installment Details Modal */}
      {showCustomerInstallMentcard && customerInstallMentDeta && (
        <div className="flatowner-modal-overlay">
          <div className="flatowner-modal flatowner-modal-large">
            <div className="flatowner-modal-header">
              <h3>Customer Installments</h3>
              <div className="flatowner-header-actions">
                <button
                  className="flatowner-btn flatowner-btn-success"
                  onClick={handlePrintInstallment}
                >
                  <BsPrinter />
                  Print
                </button>
                <button
                  className="flatowner-close-btn"
                  onClick={() => setshowCustomerInstallMentcard(false)}
                >
                  <MdClose />
                </button>
              </div>
            </div>

            <div
              id="customerInstallmentCard"
              className="flatowner-installment-content"
            >
              <div className="flatowner-residency-details">
                <h4>Property Summary</h4>
                <div className="flatowner-summary-grid">
                  <div className="flatowner-summary-item">
                    <span className="flatowner-summary-label">Project:</span>
                    <span className="flatowner-summary-value">
                      {customerInstallMentDeta.residencyName}
                    </span>
                  </div>
                  <div className="flatowner-summary-item">
                    <span className="flatowner-summary-label">Customer:</span>
                    <span className="flatowner-summary-value">
                      {customerInstallMentDeta?.customerName}
                    </span>
                  </div>
                  <div className="flatowner-summary-item">
                    <span className="flatowner-summary-label">Plot No:</span>
                    <span className="flatowner-summary-value">
                      {customerInstallMentDeta.identifier}
                    </span>
                  </div>
                  <div className="flatowner-summary-item">
                    <span className="flatowner-summary-label">Deal Price:</span>
                    <span className="flatowner-summary-value">
                      ₹
                      {customerInstallMentDeta.dealPrice
                        ? customerInstallMentDeta.dealPrice.toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flatowner-summary-item">
                    <span className="flatowner-summary-label">
                      Agreement Price:
                    </span>
                    <span className="flatowner-summary-value">
                      ₹
                      {customerInstallMentDeta.agreementAmount
                        ? customerInstallMentDeta.agreementAmount.toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flatowner-summary-item">
                    <span className="flatowner-summary-label">
                      Token Amount:
                    </span>
                    <span className="flatowner-summary-value">
                      ₹{customerInstallMentDeta.tokenAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flatowner-summary-item">
                    <span className="flatowner-summary-label">Remaining:</span>
                    <span className="flatowner-summary-value">
                      ₹
                      {customerInstallMentDeta.remainingAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flatowner-table-container">
                <table className="flatowner-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Note</th>
                      <th className="flatowner-action-column">Actions</th>
                      {role === "Admin" && <th colSpan={1}>Updated By</th>}

                    </tr>
                  </thead>
                  <tbody>
                    {customerInstallMentDeta.bookingInstallments.map((item) => (
                      <tr key={item.id}>
                        <td>
                          {new Date(item.installmentDate).toLocaleDateString(
                            "en-GB"
                          )}
                        </td>
                        <td>₹{item.installmentAmount.toLocaleString()}</td>
                        <td>
                          <span className="flatowner-payment-method">
                            {item.installmentStatus}
                          </span>
                        </td>
                        <td>{item.remark}</td>
                        <td className="flatowner-action-column">
                          <button
                            className="flatowner-action-btn flatowner-btn-edit"
                            onClick={() => handleEditInstallment(item.id)}
                          >
                            <BsPencil />
                          </button>
                          <button
                            className="flatowner-action-btn flatowner-btn-delete"
                            onClick={() => handleDeleteInstallment(item.id)}
                          >
                            <BsTrash />
                          </button>
                        </td>
                        {role === "Admin" && (
                      <td>{item.updatedBy || "-"}</td> // Conditional rendering of updatedBy
                    )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Installment Modal */}
      {showCustomerInstallmentEditForm && (
        <div className="flatowner-modal-overlay">
          <div className="flatowner-modal">
            <div className="flatowner-modal-header">
              <h3>Edit Installment</h3>
              <button
                className="flatowner-close-btn"
                onClick={() => setshowCustomerInstallmentEditForm(false)}
              >
                <MdClose />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flatowner-form">
              <div className="flatowner-form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={
                    InstallmentEditFormDate ||
                    new Date().toISOString().split("T")[0]
                  }
                  onChange={(e) => setInstallmentEditFormDate(e.target.value)}
                  className="flatowner-input"
                />
              </div>
              <div className="flatowner-form-group">
                <label>Amount</label>
                <input
                  type="text"
                  value={InstallmentEditFormAmount}
                  onChange={(e) => setInstallmentEditFormAmount(e.target.value)}
                  className="flatowner-input"
                />
              </div>
              <div className="flatowner-form-group">
                <label>Payment Method</label>
                <select
                  value={InstallmentEditFormPaymentMethod}
                  onChange={(e) =>
                    setInstallmentEditFormPaymentMethod(e.target.value)
                  }
                  className="flatowner-select"
                >
                  <option value="">Select Payment Method</option>
                  <option value="CASH">Cash</option>
                  <option value="CHECK">Cheque</option>
                  <option value="UPI">UPI</option>
                  <option value="RTGS">RTGS</option>
                  <option value="NEFT">NEFT</option>
                </select>
              </div>
              <div className="flatowner-form-group">
                <label>Remark</label>
                <textarea
                  value={InstallmentEditFormRemark}
                  onChange={(e) => setInstallmentEditFormRemark(e.target.value)}
                  className="flatowner-textarea"
                  rows="3"
                />
              </div>
              <div className="flatowner-form-actions">
                <button
                  type="button"
                  onClick={() => setshowCustomerInstallmentEditForm(false)}
                  className="flatowner-btn flatowner-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flatowner-btn flatowner-btn-primary"
                >
                  <MdSave />
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Form Modal */}
      {ShowEditCustomerForm && (
        <div className="flatowner-modal-overlay">
          <div className="flatowner-modal flatowner-modal-large">
            <div className="flatowner-modal-header">
              <h3>Edit Customer Details</h3>
              <button
                className="flatowner-close-btn"
                onClick={() => setShowEditCustomerForm(false)}
              >
                <MdClose />
              </button>
            </div>
            <form
              onSubmit={handleUpdateCustomerDetail}
              className="flatowner-form"
            >
              <div className="flatowner-form-section">
                <h4>Booking Details</h4>
                <div className="flatowner-form-grid">
                  <div className="flatowner-form-group">
                    <label>Deal Price</label>
                    <input
                      type="number"
                      value={dealPrice}
                      onChange={(e) => setDealPrice(e.target.value)}
                      className="flatowner-input"
                    />
                  </div>
                  <div className="flatowner-form-group">
                    <label>Token Amount</label>
                    <input
                      type="number"
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                      className="flatowner-input"
                    />
                  </div>
                  <div className="flatowner-form-group">
                    <label>Agreement Amount</label>
                    <input
                      type="number"
                      value={agreementAmount}
                      onChange={(e) => setAgreementAmount(e.target.value)}
                      className="flatowner-input"
                    />
                  </div>
                  <div className="flatowner-form-group">
                    <label>Stamp Duty</label>
                    <input
                      type="number"
                      value={stampDutyAmount}
                      onChange={(e) => setStampDutyAmount(e.target.value)}
                      className="flatowner-input"
                    />
                  </div>
                  <div className="flatowner-form-group">
                    <label>Registration Amount</label>
                    <input
                      type="number"
                      value={registrationAmount}
                      onChange={(e) => setRegistrationAmount(e.target.value)}
                      className="flatowner-input"
                    />
                  </div>
                  <div className="flatowner-form-group">
                    <label>GST Amount</label>
                    <input
                      type="number"
                      value={gstAmount}
                      onChange={(e) => setGstAmount(e.target.value)}
                      className="flatowner-input"
                    />
                  </div>
                  <div className="flatowner-form-group">
                    <label>Electric Water Amount</label>
                    <input
                      type="number"
                      value={electricWaterAmmount}
                      onChange={(e) => setElectricWaterAmmount(e.target.value)}
                      className="flatowner-input"
                    />
                  </div>
                  <div className="flatowner-form-group">
                    <label>Legal Charges Amount</label>
                    <input
                      type="number"
                      value={legalChargesAmmout}
                      onChange={(e) => setLegalChargesAmmout(e.target.value)}
                      className="flatowner-input"
                    />
                  </div>
                  <div className="flatowner-form-group">
                    <label>Booked On</label>
                    <input
                      type="date"
                      value={bookedOn}
                      onChange={(e) => setBookedOn(e.target.value)}
                      className="flatowner-input"
                    />
                  </div>
                  <div className="flatowner-form-group">
                    <label>Booking Status</label>
                    <select
                      value={bookingStatus}
                      onChange={(e) => setBookingStatus(e.target.value)}
                      className="flatowner-input"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="COMPLETE">COMPLETE</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flatowner-form-section">
                <h4>Customer Information</h4>
                <div className="flatowner-form-grid">
                  <div className="flatowner-form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flatowner-input"
                    />
                  </div>
                  <div className="flatowner-form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flatowner-input"
                    />
                  </div>
                  <div className="flatowner-form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flatowner-input"
                    />
                  </div>
                  <div className="flatowner-form-group">
                    <label>Aadhar Number</label>
                    <input
                      type="text"
                      value={aadharNumber}
                      onChange={(e) => setAadharNumber(e.target.value)}
                      className="flatowner-input"
                    />
                  </div>
                  <div className="flatowner-form-group">
                    <label>PAN Number</label>
                    <input
                      type="text"
                      value={panCard}
                      onChange={(e) => setPanCard(e.target.value)}
                      className="flatowner-input"
                    />
                  </div>
                  <div className="flatowner-form-group">
                    <label>Agent Name</label>
                    <input
                      type="text"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      className="flatowner-input"
                    />
                  </div>
                  <div className="flatowner-form-group">
                    <label>Brokerage</label>
                    <input
                      type="text"
                      value={brokerage}
                      onChange={(e) => setBrokerage(e.target.value)}
                      className="flatowner-input"
                    />
                  </div>

                  <div className="flatowner-form-group">
                    <label>Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setbankName(e.target.value)}
                      className="flatowner-input"
                    />
                  </div>
                  <div className="flatowner-form-group">
                    <label>Loan Amount</label>
                    <input
                      type="text"
                      value={LoanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      className="flatowner-input"
                    />
                  </div>
                  <div className="flatowner-form-group flatowner-form-group-full">
                    <label>Address</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="flatowner-textarea"
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              <div className="flatowner-form-actions">
                <button
                  type="button"
                  onClick={() => setShowEditCustomerForm(false)}
                  className="flatowner-btn flatowner-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flatowner-btn flatowner-btn-primary"
                >
                  <MdSave />
                  Update Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Slip Modal */}
      {customerSlip && customerDetail && (
  <div className="flatowner-modal-overlay">
    <div className="flatowner-modal flatowner-modal-large">
      <div className="flatowner-modal-header">
        <h3>Customer Slip</h3>
        <div className="flatowner-header-actions">
          <button
            className="flatowner-btn flatowner-btn-success"
            onClick={handleDownload}
          >
            <BsDownload />
            Download PDF
          </button>
          <button
            className="flatowner-close-btn"
            onClick={() => setcustomerSlip(false)}
          >
            <MdClose />
          </button>
        </div>
      </div>

      <div className="flatowner-slip-content" ref={letterref}>
        <div className="relieving_header_section">
          <div className="relieving_company_logo_container">
            <img
              className="relieving_company_logo"
              src={AGImg}
              alt="logo"
            />
          </div>
          <div className="relieving_company_details">
            <h3>Address</h3>
            <div className="relieving_detail_row">
              <div className="relieving_detail_text">
                <p>
                  Plot 62, Hudkeshwar Rd, near Rakshak Fresh Mart, Ingole Nagar
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
        <p
          style={{
            marginTop: "10px",
            marginLeft: "25px",
            fontSize: "12px",
          }}
        >
          Date: {new Date().toLocaleDateString("en-GB")}
        </p>

        <div
          className="payment_slip_first_table_wrapper"
          style={{ marginLeft: "25px", marginTop: "10px" }}
        >
          <table
            style={{
              border: "1px solid gray",
              borderCollapse: "collapse",
              width: "400px",
            }}
            className="payment_slip_first_table"
          >
            <tr>
              <td style={{ border: "1px solid gray" }}>
                <b style={{ fontSize: "12px", padding: "2px 10px" }}>
                  Flat No / Plot No{" "}
                </b>
              </td>
              <td style={{ border: "1px solid gray" }}>
                <b style={{ fontSize: "12px", padding: "2px 10px" }}>
                  {customerDetail.residency?.identifier || "N/A"}
                </b>
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid gray" }}>
                <b style={{ fontSize: "12px", padding: "2px 10px" }}>
                  Area
                </b>
              </td>
              <td style={{ border: "1px solid gray" }}>
                <b style={{ fontSize: "12px", padding: "2px 10px" }}>
                  {customerDetail.customer?.address || "N/A"}
                </b>
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid gray" }}>
                <b style={{ fontSize: "12px", padding: "2px 10px" }}>
                  Location
                </b>
              </td>
              <td style={{ border: "1px solid gray" }}>
                <b style={{ fontSize: "12px", padding: "2px 10px" }}>
                  {customerDetail.residency?.name || "N/A"}
                </b>
              </td>
            </tr>
          </table>
        </div>
        <p
          style={{
            marginLeft: "25px",
            marginTop: "25px",
            textAlign: "center",
            fontSize: "15px",
          }}
        >
          RECEIVED with thanks from{" "}
          <b>{customerDetail.customer?.name || "N/A"} </b>
          the sum of Rupees{" "}
          <b>{customerDetail.dealPrice?.toLocaleString() || "N/A"} </b>
          by Cheque / Cash / Draft No.{" "}
          <b>{customerDetail.residency?.identifier || "N/A"}</b> flat / plot
          address <b>{customerDetail.customer?.address || "N/A"} </b> in part
          / full / advance payment.
        </p>

        <div
          className="payment_slip_container"
          style={{
            border: "2px solid black",
            width: "150px",
            borderRadius: "50px",
            marginLeft: "25px",
            marginTop: "15px",
          }}
        >
          <p style={{ fontSize: "15px", marginLeft: "5px" }}>
            ₹ : <b>{customerDetail.dealPrice?.toLocaleString() || "N/A"}</b>
          </p>
        </div>
        <p
          style={{
            marginLeft: "25px",
            marginTop: "5px",
            fontSize: "15px",
          }}
        >
          <b>
            Balance Amount :{" "}
            {customerDetail.dealPrice &&
            customerDetail.agreementAmount &&
            customerDetail.tokenAmount
              ? (
                  customerDetail.dealPrice -
                  (customerDetail.agreementAmount +
                    customerDetail.tokenAmount)
                ).toLocaleString()
              : "N/A"}
          </b>
        </p>
        <p
          style={{
            marginLeft: "25px",
            marginTop: "5px",
            fontSize: "15px",
          }}
        >
          <b>
            Total Payable:{" "}
            {customerDetail.agreementAmount && customerDetail.tokenAmount
              ? (
                  customerDetail.agreementAmount + customerDetail.tokenAmount
                ).toLocaleString()
              : "N/A"}
          </b>
        </p>

        <div
          className="payment_slip_signature_wrapper"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "30px",
          }}
        >
          <b style={{ marginLeft: "25px", fontSize: "15px" }}>
            Customer Signature
          </b>
          <b style={{ marginRight: "30px", fontSize: "15px" }}>
            Authorised Signature
          </b>
        </div>

        <hr style={{ border: "2px solid green" }} />

        <div
          className="payment_slip_secound_slip"
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            marginLeft: "25px",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              margin: "20px 0",
              fontFamily: "Arial, sans-serif",
              fontSize: "13px",
            }}
          >
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "2px 10px",
                  backgroundColor: "#f2f2f2",
                  color: "black",
                }}
              >
                S.No.
              </th>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "2px 10px",
                  backgroundColor: "#f2f2f2",
                  color: "black",
                }}
              >
                Other Charges
              </th>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "2px 10px",
                  backgroundColor: "#f2f2f2",
                  color: "black",
                }}
              >
                Percentage
              </th>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "2px 10px",
                  backgroundColor: "#f2f2f2",
                  color: "black",
                }}
              >
                Amount
              </th>

            </tr>
            </thead>

            <tbody>
            <tr>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                1
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                Total Price
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                -
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                {customerDetail.dealPrice?.toLocaleString() || "N/A"}
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                2
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                Stamp Duty
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                -
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                {customerDetail.stampDutyAmount?.toLocaleString() || "N/A"}
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                3
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                Registration
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                -
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                {customerDetail.registrationAmount?.toLocaleString() || "N/A"}
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                4
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                GST
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                -
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                {customerDetail.gstAmount?.toLocaleString() || "N/A"}
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                5
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                Electric Meter and Water Charges
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                -
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                {customerDetail.electricWaterAmmount?.toLocaleString() ||
                  "N/A"}
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                6
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                Legal Charges / Documentation Charges
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                -
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                {customerDetail.legalChargesAmmout?.toLocaleString() || "N/A"}
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                7
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                Maintenance Charges for 5 Years
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                -
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                -
              </td>
            </tr>
            <tr>
              <td
                colSpan="2"
                style={{
                  border: "1px solid #000",
                  padding: "2px 10px",
                  fontWeight: "bold",
                }}
              >
                Total of Overhead Charges:
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                -
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                -
              </td>
            </tr>
            <tr>
              <td
                colSpan="2"
                style={{
                  border: "1px solid #000",
                  padding: "2px 10px",
                  fontWeight: "bold",
                }}
              >
                Basic Cost of Flat:
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                -
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                {customerDetail.dealPrice?.toLocaleString() || "N/A"}
              </td>
            </tr>
            <tr>
              <td
                colSpan="2"
                style={{
                  border: "1px solid #000",
                  padding: "2px 10px",
                  fontWeight: "bold",
                }}
              >
                Grand Total:
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                -
              </td>
              <td style={{ border: "1px solid #000", padding: "2px 10px" }}>
                {customerDetail.dealPrice &&
                customerDetail.stampDutyAmount &&
                customerDetail.registrationAmount &&
                customerDetail.gstAmount &&
                customerDetail.electricWaterAmmount &&
                customerDetail.legalChargesAmmout
                  ? (
                      customerDetail.dealPrice +
                      customerDetail.stampDutyAmount +
                      customerDetail.registrationAmount +
                      customerDetail.gstAmount +
                      customerDetail.electricWaterAmmount +
                      customerDetail.legalChargesAmmout
                    ).toLocaleString()
                  : "N/A"}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default Flatowner;
