import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FaEye,
  FaTrashAlt,
  FaHome,
  FaHashtag,
  FaBuilding,
  FaLayerGroup,
  FaMoneyBillWave,
  FaTag,
  FaUserPlus,
  FaPlus,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaMapMarkerAlt,
  FaCreditCard,
  FaHandshake,
  FaPercentage,
  FaUniversity,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaFilter,
} from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { BiBuildings } from "react-icons/bi";
import "../addflat/Flatlist.css";
import axios from "axios";
import { BASE_URL } from "../../config";

function FlatList() {
  const { id } = useParams();

  const location = useLocation();
  const { newname } = location.state || {};
  const navigate = useNavigate();

  // State management
  const [bookingId, setBookindId] = useState("");
  const [showFlat, setShowFlat] = useState(false);
  const [name, setName] = useState("");
  const [flatType, setFlatType] = useState("");
  const [Residency, setResidency] = useState("");
  const [Availability, setAvailability] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [FlatNumber, setflatNumber] = useState("");
  const [flatPrice, setFlatprice] = useState("");
  const [showflatNumber, setShowFlatNumber] = useState([]);
  const [flatDetailpopUp, setflatDetailpopUp] = useState(false);
  const [singledata, setsingledata] = useState([]);
  const [Showcustomer, setShowCustomer] = useState(false);
  const [flatid, setFlatId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Customer and booking states
  const [dealPrice, setDealPrice] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [agreementAmount, setAgreementAmount] = useState("");
  const [stampDutyAmount, setStampDutyAmount] = useState("");
  const [registrationAmount, setRegistrationAmount] = useState("");
  const [gstAmount, setGstAmount] = useState("");
  const [electricWaterAmmount, setElectricWaterAmount] = useState("");
  const [legalChargesAmmout, setLegalChargesAmount] = useState("");
  const [bookedOn, setBookedOn] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [address, setAddress] = useState("");
  const [panCard, setPanCard] = useState("");
  const [agentName, setAgentName] = useState("");
  const [brokerage, setBrokerage] = useState("");
  const [loan, setloan] = useState("");
  // const [customerId, setCustomerId] = useState("");
  const [ShowEditPlotDetail, setShowEditPlotDetail] = useState(false);
  const [EditPlotId, setEditPlotId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = JSON.parse(
    localStorage.getItem("employeROyalmadeLogin")
  )?.token;

  useEffect(() => {
    async function gettingFlat() {
      try {
        const resonse = await axios.get(`${BASE_URL}/project/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(resonse.data);
        setShowFlatNumber(resonse.data);
      } catch (error) {
        console.log(error);
      }
    }
    gettingFlat();
  }, [id, refreshKey]);

  // Filter flats based on status
  const filteredFlats = showflatNumber.filter(
    (flat) => filterStatus === "ALL" || flat.availabilityStatus === filterStatus
  );

  // Group flats by floor
  const groupedFlats = filteredFlats.reduce((acc, flat) => {
    if (!acc[flat.floorNumber]) acc[flat.floorNumber] = [];
    acc[flat.floorNumber].push(flat);
    return acc;
  }, {});

  const sortedFloors = Object.keys(groupedFlats).sort((a, b) => b - a);

  // Event handlers
  function handleAddFlat() {
    setShowFlat(!showFlat);
  }

  function closeAddflat() {
    setShowFlat(false);
  }

  async function handleNewFlat(e) {
    e.preventDefault();
    setIsSubmitting(true);

    if (
      !Residency ||
      !flatType ||
      !Availability ||
      !floorNumber ||
      !FlatNumber ||
      !flatPrice
    ) {
      return alert("Please fill in all fields before submitting!");
    }

    const obj = {
      name: newname,
      residencyType: Residency,
      flatType: flatType,
      availabilityStatus: Availability,
      floorNumber: floorNumber,
      identifier: FlatNumber,
      price: flatPrice.replace(/,/g, ""),
      projectId: id,
    };

    try {
      const response = await axios.post(`${BASE_URL}/createResidency`, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("flat list created successfully");
      setFlatType("");
      setResidency("");
      setAvailability("");
      setFloorNumber("");
      setflatNumber("");
      setFlatprice("");
      setRefreshKey(refreshKey + 1);
      closeAddflat();
    } catch (error) {
      console.error("Error creating residency:", error);
      alert("Failed to create residency. Please try again.");
    } finally {
      setIsSubmitting(false); // Re-enable the button after submission completes
    }
  }

  async function handlepassId(id) {
    try {
      const response = await axios.get(`${BASE_URL}/booking/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const ids = response?.data?.customer?.id || response?.data?.booking?.id;

      console.log(ids);
      if (response.status === 200) {
        navigate(`/flatowner/${bookingId}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleShowflatDetail(id) {
    try {
      const response = await axios.get(`${BASE_URL}/allResidencybyid/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      setBookindId(response?.data?.booking?.id);
      setsingledata(response.data);
      setFlatId(id);
      setflatDetailpopUp(true);
    } catch (error) {
      console.log(error);
    }
  }

  function handlecloseflat() {
    setflatDetailpopUp(false);
  }

  function handleShowCustomerForm() {
    setflatDetailpopUp(false);
    setShowCustomer(true);
  }

  function handleCloseCustomer() {
    setShowCustomer(false);
  }

  async function handleAddCustomer(e) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = {
      dealPrice: dealPrice.replace(/,/g, ""),
      tokenAmount: tokenAmount.replace(/,/g, ""),
      agreementAmount: agreementAmount.replace(/,/g, ""),
      stampDutyAmount: stampDutyAmount.replace(/,/g, ""),
      registrationAmount: registrationAmount.replace(/,/g, ""),
      gstAmount: gstAmount.replace(/,/g, ""),
      electricWaterAmmount: electricWaterAmmount.replace(/,/g, ""),
      legalChargesAmmout: legalChargesAmmout.replace(/,/g, ""),
      bookedOn,
      bookingStatus,
      customerDto: {
        name: customerName,
        phoneNumber,
        email,
        aadharNumber,
        address,
        panCard,
        agentName,
        brokerage,
        loan,
      },
      residencyDto: { id: flatid },
    };
    try {
      const response = await axios.post(`${BASE_URL}/createBooking`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      const myId = response.data.id;
      navigate(`/flatowner/${myId}`);
      alert("customer Added Successfully");
      setDealPrice("");
      setTokenAmount("");
      setAgreementAmount("");
      setStampDutyAmount("");
      setRegistrationAmount("");
      setGstAmount("");
      setElectricWaterAmount("");
      setLegalChargesAmount("");
      setBookedOn("");
      setBookingStatus("");
      setName("");
      setPhoneNumber("");
      setEmail("");
      setAadharNumber("");
      setAddress("");
      setPanCard("");
      setAgentName("");
      setBrokerage("");
      setloan("");
      setShowCustomer(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  }

  async function handleflatdelete(id) {
    const flatdelete = window.confirm("Are you sure to delete ?");
    if (!flatdelete) return;
    try {
      const response = await axios.delete(`${BASE_URL}/deleteResidency/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      alert("flat deleted");
      setRefreshKey(refreshKey + 1);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleEditPlotInfo(id) {
    setEditPlotId(id);
    try {
      const response = await axios.get(`${BASE_URL}/allResidencybyid/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      setShowEditPlotDetail(true);
      setflatDetailpopUp(false);
      setFlatType(response.data.flatType);
      setResidency(response.data.residencyType);
      setAvailability(response.data.availabilityStatus);
      setFloorNumber(response.data.floorNumber);
      setflatNumber(response.data.identifier);

      setFlatprice(response.data.price);
    } catch (error) {
      console.log(error);
    }
  }

  async function hanldeUpdateFlat(e) {
    e.preventDefault();
    setIsSubmitting(true)
    if (
      !Residency ||
      !flatType ||
      !Availability ||
      !floorNumber ||
      !FlatNumber ||
      !flatPrice
    ) {
      return alert("Please fill in all fields before submitting!");
    }
   const obj = {
  name: newname,
  residencyType: Residency,
  flatType: flatType,
  availabilityStatus: Availability,
  floorNumber: floorNumber,
  identifier: FlatNumber,
  price: String(flatPrice).replace(/,/g, ""),
};
    try {
      const response = await axios.put(
        `${BASE_URL}/updateresidency/${EditPlotId}`,
        obj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        alert("Flat updated successfully");
        setFlatType("");
        setResidency("");
        setAvailability("");
        setFloorNumber("");
        setflatNumber("");
        setFlatprice("");
        setShowEditPlotDetail(false);
        setRefreshKey(refreshKey + 1);
      }
    } catch (error) {
      console.log(error);
    }
    finally{
       setIsSubmitting(false);
    }
  }
  return (
    <>
      <div className="flat-list-container">
        {/* Header Section */}
        <div className="flat-list-header">
          <div className="flatlistheader-content">
            <div className="header-left">
              <div className="header-icon">
                <BiBuildings />
              </div>
              <div className="header-text">
                <h1>{newname || "Flat Management"}</h1>
                <p>Manage and track all apartment units</p>
              </div>
            </div>

            <div className="header-actions">
              <button className="add-flat-btn" onClick={handleAddFlat}>
                <FaPlus />
                <span>Add New Flat</span>
              </button>
            </div>
          </div>

          {/* Filter Section */}
          <div className="filter-section">
            <div className="filter-group">
              <FaFilter className="filter-icon" />
              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All Units</option>
                <option value="AVAILABLE">Available Only</option>
                <option value="BOOKED">Booked Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Floors Container */}
        <div className="floors-container">
          {sortedFloors.map((floor) => (
            <div key={floor} className="floor-section">
              <div className="floor-header">
                <div className="floor-title">
                  <FaBuilding className="floor-icon" />
                  <h2>Floor {floor}</h2>
                  <span className="floor-badge">
                    {groupedFlats[floor].length} Flats
                  </span>
                </div>

                <div className="floor-stats">
                  <div className="floor-stat available">
                    <span className="stat-dot available"></span>
                    <span>
                      {
                        groupedFlats[floor].filter(
                          (f) => f.availabilityStatus === "AVAILABLE"
                        ).length
                      }{" "}
                      Available
                    </span>
                  </div>
                  <div className="floor-stat booked">
                    <span className="stat-dot booked"></span>
                    <span>
                      {
                        groupedFlats[floor].filter(
                          (f) => f.availabilityStatus === "BOOKED"
                        ).length
                      }{" "}
                      Booked
                    </span>
                  </div>
                </div>
              </div>

              <div className="flats-grid">
                {groupedFlats[floor].map((item) => (
                  <div key={item.id} className="flat-card">
                    <div
                      className={`flat-status-indicator ${item.availabilityStatus.toLowerCase()}`}
                    >
                      {item.availabilityStatus === "AVAILABLE" ? (
                        <FaCheckCircle className="status-icon" />
                      ) : (
                        <FaClock className="status-icon" />
                      )}
                    </div>

                    <button
                      onClick={() => handleShowflatDetail(item.id)}
                      className={`flat-button ${item.availabilityStatus.toLowerCase()}`}
                    >
                      <div className="flat-content">
                        <FaHome className="flat-icon" />
                        <div className="flat-info">
                          <span className="flat-identifier">
                            {item.identifier}
                          </span>
                          <span className="flat-type">
                            {item.flatType?.replace("_", " ")}
                          </span>
                          <span className="flat-price">
                            ₹{item.price?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => handleflatdelete(item.id)}
                      title="Delete Flat"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Flat Detail Modal */}
        {flatDetailpopUp && (
          <div className="modal-overlay">
            <div className="flat-detail-modal">
              <div className="modal-header">
                <h3>
                  <FaEye className="modal-icon" />
                  Flat Details
                </h3>
                <button className="close-button" onClick={handlecloseflat}>
                  <MdClose />
                </button>
              </div>

              <div className="modal-content">
                <div className="detail-grid">
                  <div className="detail-item">
                    <FaHome className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Scheme Name</span>
                      <span className="detail-value">{newname}</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <FaHashtag className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Flat Number</span>
                      <span className="detail-value">
                        {singledata.identifier}
                      </span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <FaTag className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Status</span>
                      <span
                        className={`detail-value status ${singledata.availabilityStatus?.toLowerCase()}`}
                      >
                        {singledata.availabilityStatus}
                      </span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <FaBuilding className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Type</span>
                      <span className="detail-value">
                        {singledata.flatType?.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <FaLayerGroup className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Floor Number</span>
                      <span className="detail-value">
                        {singledata.floorNumber}
                      </span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <FaMoneyBillWave className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Price</span>
                      <span className="detail-value price">
                        ₹{singledata.price?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="view-customer-btn"
                  onClick={() => handleEditPlotInfo(singledata.id)}
                >
                  {" "}
                  Edit
                </button>
                {singledata.availabilityStatus === "BOOKED" ? (
                  <button
                    className="view-customer-btn"
                    onClick={() => handlepassId(singledata?.booking.id)}
                  >
                    <FaEye />
                    View Customer
                  </button>
                ) : (
                  <button
                    className="add-customer-btn"
                    onClick={handleShowCustomerForm}
                  >
                    <FaUserPlus />
                    Add Customer
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Flat Modal */}
        {showFlat && (
          <div className="modal-overlay">
            <div className="add-flat-modal">
              <div className="modal-header">
                <h3>
                  <FaPlus className="modal-icon" />
                  Add New Flat
                </h3>
                <button className="close-button" onClick={closeAddflat}>
                  <MdClose />
                </button>
              </div>

              <form className="add-flat-form" onSubmit={handleNewFlat}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Scheme Name</label>
                    <input
                      type="text"
                      value={newname}
                      readOnly
                      className="form-input readonly"
                    />
                  </div>

                  <div className="form-group">
                    <label>Residency Type</label>
                    <select
                      className="form-select"
                      value={Residency}
                      onChange={(e) => setResidency(e.target.value)}
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="FLAT">Flat</option>
                      <option value="HOUSE">House</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Flat Type</label>
                    <select
                      className="form-select"
                      value={flatType}
                      onChange={(e) => setFlatType(e.target.value)}
                      required
                    >
                      <option value="">Select Flat Type</option>
                      <option value="ONE_BHK">1 BHK</option>
                      <option value="TWO_BHK">2 BHK</option>
                      <option value="THREE_BHK">3 BHK</option>
                      <option value="FOUR_BHK">4 BHK</option>
                      <option value="FIVE_BHK">5 BHK</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Availability Status</label>
                    <select
                      className="form-select"
                      value={Availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="AVAILABLE">Available</option>
                      {/* <option value="BOOKED">Booked</option> */}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Floor Number</label>
                    <input
                      type="number"
                      className="form-input"
                      value={floorNumber}
                      onChange={(e) => setFloorNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Flat Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={FlatNumber}
                      onChange={(e) => setflatNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Price (₹)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={flatPrice}
                      onChange={(e) => setFlatprice(e.target.value)}
                      placeholder="Enter price in rupees"
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={closeAddflat}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting} // Disable button based on isSubmitting state
                  >
                    <FaPlus />
                    {isSubmitting ? "Submitting..." : "Add Flat"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Customer Form Modal */}
        {Showcustomer && (
          <div className="modal-overlay">
            <div className="customer-modal">
              <div className="modal-header">
                <h3>
                  <FaUserPlus className="modal-icon" />
                  Add Customer & Booking Details
                </h3>
                <button className="close-button" onClick={handleCloseCustomer}>
                  <MdClose />
                </button>
              </div>

              <form className="customer-form" onSubmit={handleAddCustomer}>
                {/* Booking Details Section */}
                <div className="form-section">
                  <h4 className="section-title">
                    <FaHandshake className="section-icon" />
                    Booking Details
                  </h4>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>
                        <FaMoneyBillWave /> Deal Price
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={dealPrice}
                        onChange={(e) => setDealPrice(e.target.value)}
                        placeholder="Enter deal price"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <FaCreditCard /> Token Amount
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={tokenAmount}
                        onChange={(e) => setTokenAmount(e.target.value)}
                        placeholder="Enter token amount"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <FaHandshake /> Agreement Amount
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={agreementAmount}
                        onChange={(e) => setAgreementAmount(e.target.value)}
                        placeholder="Enter agreement amount"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <FaTag /> Stamp Duty Amount
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={stampDutyAmount}
                        onChange={(e) => setStampDutyAmount(e.target.value)}
                        placeholder="Enter stamp duty"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <FaUniversity /> Registration Amount
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={registrationAmount}
                        onChange={(e) => setRegistrationAmount(e.target.value)}
                        placeholder="Enter registration amount"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <FaPercentage /> GST Amount
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={gstAmount}
                        onChange={(e) => setGstAmount(e.target.value)}
                        placeholder="Enter GST amount"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Electric & Water Amount</label>
                      <input
                        type="text"
                        className="form-input"
                        value={electricWaterAmmount}
                        onChange={(e) => setElectricWaterAmount(e.target.value)}
                        placeholder="Enter utility charges"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Legal Charges Amount</label>
                      <input
                        type="text"
                        className="form-input"
                        value={legalChargesAmmout}
                        onChange={(e) => setLegalChargesAmount(e.target.value)}
                        placeholder="Enter legal charges"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <FaCalendarAlt /> Booked On
                      </label>
                      <input
                        type="date"
                        className="form-input"
                        value={
                          bookedOn || new Date().toISOString().split("T")[0]
                        }
                        onChange={(e) => setBookedOn(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Booking Status</label>
                      <select
                        className="form-select"
                        value={bookingStatus}
                        onChange={(e) => setBookingStatus(e.target.value)}
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="COMPLETE">Complete</option>
                        <option value="PENDING">Pending</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Customer Details Section */}
                <div className="form-section">
                  <h4 className="section-title">
                    <FaUser className="section-icon" />
                    Customer Details
                  </h4>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>
                        <FaUser /> Customer Name
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter customer name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <FaPhone /> Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-input"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <FaEnvelope /> Email
                      </label>
                      <input
                        type="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <FaIdCard /> Aadhar Number
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={aadharNumber}
                        onChange={(e) => setAadharNumber(e.target.value)}
                        placeholder="Enter Aadhar number"
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <FaCreditCard /> PAN Card
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={panCard}
                        onChange={(e) => setPanCard(e.target.value)}
                        placeholder="Enter PAN number"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>
                        <FaMapMarkerAlt /> Address
                      </label>
                      <textarea
                        className="form-textarea"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter complete address"
                        rows="3"
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <FaHandshake /> Agent Name
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                        placeholder="Enter agent name"
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <FaPercentage /> Brokerage
                      </label>
                      <input
                        type="number"
                        className="form-input"
                        value={brokerage}
                        onChange={(e) => setBrokerage(e.target.value)}
                        placeholder="Enter brokerage amount"
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <FaUniversity /> Loan Status
                      </label>
                      <select
                        className="form-select"
                        value={loan}
                        onChange={(e) => setloan(e.target.value)}
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="YES">Yes</option>
                        <option value="NO">No</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={handleCloseCustomer}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    <FaUserPlus />
                    {isSubmitting ? "Adding..." : "Add Customer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {ShowEditPlotDetail && (
        <>
          <div className="modal-overlay">
            <div className="add-flat-modal">
              <div className="modal-header">
                <h3>
                  <FaPlus className="modal-icon" />
                  Edit Flat Details
                </h3>
                <button
                  className="close-button"
                  onClick={() => setShowEditPlotDetail(false)}
                >
                  <MdClose />
                </button>
              </div>

              <form className="add-flat-form" onSubmit={hanldeUpdateFlat}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Scheme Name</label>
                    <input
                      type="text"
                      value={newname}
                      readOnly
                      className="form-input readonly"
                    />
                  </div>

                  <div className="form-group">
                    <label>Residency Type</label>
                    <select
                      className="form-select"
                      value={Residency}
                      onChange={(e) => setResidency(e.target.value)}
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="FLAT">Flat</option>
                      <option value="HOUSE">House</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Flat Type</label>
                    <select
                      className="form-select"
                      value={flatType}
                      onChange={(e) => setFlatType(e.target.value)}
                      required
                    >
                      <option value="">Select Flat Type</option>
                      <option value="ONE_BHK">1 BHK</option>
                      <option value="TWO_BHK">2 BHK</option>
                      <option value="THREE_BHK">3 BHK</option>
                      <option value="FOUR_BHK">4 BHK</option>
                      <option value="FIVE_BHK">5 BHK</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Availability Status</label>
                    <div>{Availability}</div>
                  </div>

                  <div className="form-group">
                    <label>Floor Number</label>
                    <input
                      type="number"
                      className="form-input"
                      value={floorNumber}
                      onChange={(e) => setFloorNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Flat Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={FlatNumber}
                      onChange={(e) => setflatNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Price (₹)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={flatPrice}
                      onChange={(e) => setFlatprice(e.target.value)}
                      placeholder="Enter price in rupees"
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowEditPlotDetail(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    <FaPlus />
                   {isSubmitting ? " Updating..." : " Update Flat"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default FlatList;
