import React, { useState } from "react";
import "./AddLand.css";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";

function AddLand() {
  const navigate = useNavigate();
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerAadhar, setOwnerAadhar] = useState("");
  const [purchaserName, setPurchaserName] = useState("");
  const [purchaserPhone, setPurchaserPhone] = useState("");
  const [purchaserEmail, setPurchaserEmail] = useState("");
  const [purchaserAadhar, setPurchaserAadhar] = useState("");
  const [area, setArea] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [agreementAmount, setAgreementAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [city, setCity] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [khNumber, setkhNumber] = useState("");
  const [PhNumber, setPhNumber] = useState("");
  const [plotNumber, setPlotNumber] = useState("");
  const [mauzaNumber, setMauzaNumber] = useState("");
  const [date, setDate] = useState("");
  const [partners, setPartners] = useState([]);
  const [errors, setErrors] = useState({});

  function handleAddPartner(e) {
    e.preventDefault();
    setPartners([
      ...partners,
      { name: "", email: "", phoneNumber: "", city: "" },
    ]);
  }

  function handlePartnerChange(index, field, value) {
    const updatedPartners = partners.map((partner, i) =>
      i === index ? { ...partner, [field]: value } : partner
    );
    setPartners(updatedPartners);
    // Clear partner-specific error when user starts typing
    setErrors((prev) => ({ ...prev, [`partner${index}_${field}`]: "" }));
  }

  function handleRemovePartner(index) {
    const updatedPartners = partners.filter((_, i) => i !== index);
    setPartners(updatedPartners);
    // Clear errors for removed partner
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`partner${index}_`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  }

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const aadharRegex = /^\d{12}$/;
    const numberRegex = /^\d+(\.\d+)?$/;

    // Owner validations
    if (!ownerName.trim()) newErrors.ownerName = "Owner name is required";
    if (!ownerPhone.match(phoneRegex)) newErrors.ownerPhone = "Must be a valid 10-digit number starting with 6-9";
    if (!ownerEmail.trim()) newErrors.ownerEmail = "Owner address is invalid";
    if (!ownerAadhar.match(aadharRegex)) newErrors.ownerAadhar = "Must be 12 digits";

    // Purchaser validations
    if (!purchaserName.trim()) newErrors.purchaserName = "Purchaser name is required";
    if (!purchaserPhone.match(phoneRegex)) newErrors.purchaserPhone = "Must be a valid 10-digit number starting with 6-9";
    if (!purchaserEmail.trim()) newErrors.purchaserEmail = "Purchaser address is invalid";
    if (!purchaserAadhar.match(aadharRegex)) newErrors.purchaserAadhar = "Must be 12 digits";

    // Property validations
    if (!area.match(numberRegex)) newErrors.area = "Area must be a valid number";
    if (!tokenAmount.match(numberRegex)) newErrors.tokenAmount = "Token amount must be a valid number";
    if (!agreementAmount.match(numberRegex)) newErrors.agreementAmount = "Agreement amount must be a valid number";
    if (!totalAmount.match(numberRegex)) newErrors.totalAmount = "Total amount must be a valid number";
    if (!date) newErrors.date = "Date is required";

    // Address validations
    if (!city.trim()) newErrors.city = "City is required";
    if (!landmark.trim()) newErrors.landmark = "Landmark is required";
    if (!pincode.match(/^\d{6}$/)) newErrors.pincode = "Pincode must be 6 digits";
    if (!country.trim()) newErrors.country = "Country is required";
    if (!state.trim()) newErrors.state = "State is required";
    if (!khNumber.trim()) newErrors.khNumber = "KH Number is required";
    if (!PhNumber.trim()) newErrors.PhNumber = "PH Number is required";
    if (!plotNumber.trim()) newErrors.plotNumber = "Plot Number is required";
    if (!mauzaNumber.trim()) newErrors.mauzaNumber = "Mauza Number is required";

    // Partner validations
    partners.forEach((partner, index) => {
      if (!partner.name.trim()) newErrors[`partner${index}_name`] = `Partner ${index + 1} name is required`;
      if (!partner.phoneNumber.match(phoneRegex)) newErrors[`partner${index}_phoneNumber`] = `Partner ${index + 1} phone must be a valid 10-digit number starting with 6-9`;
      if (partner.email && !partner.email.match(emailRegex)) newErrors[`partner${index}_email`] = `Partner ${index + 1} email is invalid`;
      if (!partner.city?.trim()) newErrors[`partner${index}_city`] = `Partner ${index + 1} city is required`;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = {
      area: area.replace(/,/g, ""),
      tokenAmount: tokenAmount.replace(/,/g, ""),
      agreementAmount: agreementAmount.replace(/,/g, ""),
      totalAmount: totalAmount.replace(/,/g, ""),
      landAddOnDate: date || new Date().toISOString().split("T")[0],
      address: {
        city,
        landmark,
        pincode,
        country,
        state,
        muza: mauzaNumber,
        khno: khNumber,
        phno: PhNumber,
        plotno: plotNumber,
      },
      owner: {
        name: ownerName,
        phoneNumber: ownerPhone,
        address: ownerEmail,
        aadharNumber: ownerAadhar,
      },
      purchaser: {
        name: purchaserName,
        phoneNumber: purchaserPhone,
        address: purchaserEmail,
        aadharNumber: purchaserAadhar,
      },
      partners: partners.map((partner) => ({
        ...partner,
        amount: partner.amount.replace(/,/g, ""),
      })),
    };

    const token = JSON.parse(localStorage.getItem("employeROyalmadeLogin"))?.token;

    if (!token) {
      setErrors((prev) => ({ ...prev, general: "Token is missing" }));
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        setErrors({});
        navigate("/landpurchase");
        setOwnerName("");
        setOwnerPhone("");
        setOwnerEmail("");
        setOwnerAadhar("");
        setPurchaserName("");
        setPurchaserPhone("");
        setPurchaserEmail("");
        setPurchaserAadhar("");
        setArea("");
        setTokenAmount("");
        setAgreementAmount("");
        setTotalAmount("");
        setCity("");
        setLandmark("");
        setPincode("");
        setCountry("");
        setState("");
        setkhNumber("");
        setPhNumber("");
        setPlotNumber("");
        setMauzaNumber("");
        setPartners([]);
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: "Error submitting form: " + (error.response?.data?.message || error.message),
      }));
    }
  };

  const ErrorMessage = ({ error }) => (
    error ? <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>{error}</div> : null
  );

  return (
    <>
      <div className="Addland_form_container">
        <h1 className="Addlandh1">Property Form</h1>
        {errors.general && <div style={{ color: "red", marginBottom: "10px" }}>{errors.general}</div>}
        <form onSubmit={handleSubmit} className="addlandform">
          {/* Owner Details */}
          <h3>Owner Details</h3>
          <div className="Add_land_form_group">
            <label>Name:</label>
            <input
              type="text"
              placeholder="Enter owner name"
              value={ownerName}
              onChange={(e) => {
                setOwnerName(e.target.value);
                setErrors((prev) => ({ ...prev, ownerName: "" }));
              }}
            />
            <ErrorMessage error={errors.ownerName} />
          </div>
          <div className="Add_land_form_group">
            <label>Phone Number:</label>
            <input
              type="text"
              placeholder="Enter phone number"
              value={ownerPhone}
              onChange={(e) => {
                setOwnerPhone(e.target.value);
                setErrors((prev) => ({ ...prev, ownerPhone: "" }));
              }}
            />
            <ErrorMessage error={errors.ownerPhone} />
          </div>
          <div className="Add_land_form_group">
            <label>Address:</label>
            <input
              type="text"
              placeholder="Enter Address"
              value={ownerEmail}
              onChange={(e) => {
                setOwnerEmail(e.target.value);
                setErrors((prev) => ({ ...prev, ownerEmail: "" }));
              }}
            />
            <ErrorMessage error={errors.ownerEmail} />
          </div>
          <div className="Add_land_form_group">
            <label>Aadhar Number:</label>
            <input
              type="text"
              placeholder="Enter Aadhar number"
              value={ownerAadhar}
              onChange={(e) => {
                setOwnerAadhar(e.target.value);
                setErrors((prev) => ({ ...prev, ownerAadhar: "" }));
              }}
            />
            <ErrorMessage error={errors.ownerAadhar} />
          </div>

          {/* Purchaser Details */}
          <h3>Purchaser Details</h3>
          <div className="Add_land_form_group">
            <label>Name:</label>
            <input
              type="text"
              placeholder="Enter purchaser name"
              value={purchaserName}
              onChange={(e) => {
                setPurchaserName(e.target.value);
                setErrors((prev) => ({ ...prev, purchaserName: "" }));
              }}
            />
            <ErrorMessage error={errors.purchaserName} />
          </div>
          <div className="Add_land_form_group">
            <label>Phone Number:</label>
            <input
              type="text"
              placeholder="Enter phone number"
              value={purchaserPhone}
              onChange={(e) => {
                setPurchaserPhone(e.target.value);
                setErrors((prev) => ({ ...prev, purchaserPhone: "" }));
              }}
            />
            <ErrorMessage error={errors.purchaserPhone} />
          </div>
          <div className="Add_land_form_group">
            <label>Address:</label>
            <input
              type="text"
              placeholder="Enter Address"
              value={purchaserEmail}
              onChange={(e) => {
                setPurchaserEmail(e.target.value);
                setErrors((prev) => ({ ...prev, purchaserEmail: "" }));
              }}
            />
            <ErrorMessage error={errors.purchaserEmail} />
          </div>
          <div className="Add_land_form_group">
            <label>Aadhar Number:</label>
            <input
              type="text"
              placeholder="Enter Aadhar number"
              value={purchaserAadhar}
              onChange={(e) => {
                setPurchaserAadhar(e.target.value);
                setErrors((prev) => ({ ...prev, purchaserAadhar: "" }));
              }}
            />
            <ErrorMessage error={errors.purchaserAadhar} />
          </div>

          {/* Property Details */}
          <h3>Property Details</h3>
          <div className="Add_land_form_group">
            <label>Area (sq ft):</label>
            <input
              type="text"
              placeholder="Enter area"
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                setErrors((prev) => ({ ...prev, area: "" }));
              }}
            />
            <ErrorMessage error={errors.area} />
          </div>
          <div className="Add_land_form_group">
            <label>Token Amount:</label>
            <input
              type="text"
              placeholder="Enter token amount"
              value={tokenAmount}
              onChange={(e) => {
                setTokenAmount(e.target.value);
                setErrors((prev) => ({ ...prev, tokenAmount: "" }));
              }}
            />
            <ErrorMessage error={errors.tokenAmount} />
          </div>
          <div className="Add_land_form_group">
            <label>Agreement Amount:</label>
            <input
              type="text"
              placeholder="Enter agreement amount"
              value={agreementAmount}
              onChange={(e) => {
                setAgreementAmount(e.target.value);
                setErrors((prev) => ({ ...prev, agreementAmount: "" }));
              }}
            />
            <ErrorMessage error={errors.agreementAmount} />
          </div>
          <div className="Add_land_form_group">
            <label>Total Amount:</label>
            <input
              type="text"
              placeholder="Enter total amount"
              value={totalAmount}
              onChange={(e) => {
                setTotalAmount(e.target.value);
                setErrors((prev) => ({ ...prev, totalAmount: "" }));
              }}
            />
            <ErrorMessage error={errors.totalAmount} />
          </div>
          <div className="Add_land_form_group">
            <label>Date:</label>
            <input
              type="date"
              value={date || new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                setDate(e.target.value);
                setErrors((prev) => ({ ...prev, date: "" }));
              }}
            />
            <ErrorMessage error={errors.date} />
          </div>

          {/* Address Details */}
          <h3>Address Details</h3>
          <div className="Add_land_form_group">
            <label>City:</label>
            <input
              type="text"
              placeholder="Enter city"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setErrors((prev) => ({ ...prev, city: "" }));
              }}
            />
            <ErrorMessage error={errors.city} />
          </div>
          <div className="Add_land_form_group">
            <label>Mauza:</label>
            <input
              type="text"
              placeholder="Enter Mauza"
              value={mauzaNumber}
              onChange={(e) => {
                setMauzaNumber(e.target.value);
                setErrors((prev) => ({ ...prev, mauzaNumber: "" }));
              }}
            />
            <ErrorMessage error={errors.mauzaNumber} />
          </div>
          <div className="Add_land_form_group">
            <label>KH no:</label>
            <input
              type="text"
              placeholder="Enter KH Number"
              value={khNumber}
              onChange={(e) => {
                setkhNumber(e.target.value);
                setErrors((prev) => ({ ...prev, khNumber: "" }));
              }}
            />
            <ErrorMessage error={errors.khNumber} />
          </div>
          <div className="Add_land_form_group">
            <label>PH No:</label>
            <input
              type="text"
              placeholder="Enter PH Number"
              value={PhNumber}
              onChange={(e) => {
                setPhNumber(e.target.value);
                setErrors((prev) => ({ ...prev, PhNumber: "" }));
              }}
            />
            <ErrorMessage error={errors.PhNumber} />
          </div>
          <div className="Add_land_form_group">
            <label>Plot No:</label>
            <input
              type="text"
              placeholder="Enter Plot No"
              value={plotNumber}
              onChange={(e) => {
                setPlotNumber(e.target.value);
                setErrors((prev) => ({ ...prev, plotNumber: "" }));
              }}
            />
            <ErrorMessage error={errors.plotNumber} />
          </div>
          <div className="Add_land_form_group">
            <label>Landmark:</label>
            <input
              type="text"
              placeholder="Enter landmark"
              value={landmark}
              onChange={(e) => {
                setLandmark(e.target.value);
                setErrors((prev) => ({ ...prev, landmark: "" }));
              }}
            />
            <ErrorMessage error={errors.landmark} />
          </div>
          <div className="Add_land_form_group">
            <label>Pincode:</label>
            <input
              type="text"
              placeholder="Enter pincode"
              value={pincode}
              onChange={(e) => {
                setPincode(e.target.value);
                setErrors((prev) => ({ ...prev, pincode: "" }));
              }}
            />
            <ErrorMessage error={errors.pincode} />
          </div>
          <div className="Add_land_form_group">
            <label>Country:</label>
            <input
              type="text"
              placeholder="Enter country"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setErrors((prev) => ({ ...prev, country: "" }));
              }}
            />
            <ErrorMessage error={errors.country} />
          </div>
          <div className="Add_land_form_group">
            <label>State:</label>
            <input
              type="text"
              placeholder="Enter state"
              value={state} 
              onChange={(e) => {
                setState(e.target.value);
                setErrors((prev) => ({ ...prev, state: "" }));
              }}
            />
            <ErrorMessage error={errors.state} />
          </div>

          {/* Partner Details */}
          
          <button className="Add_land_submit_button" type="submit">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default AddLand;