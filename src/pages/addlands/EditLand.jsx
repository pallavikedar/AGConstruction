import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./AddLand.css"
import { BASE_URL } from "../../config";
function EditLand() {
  const { id } = useParams();
  const token = JSON.parse(localStorage.getItem("employeROyalmadeLogin"))?.token;
const navigate =useNavigate()
  const [allData, setAllData] = useState({
    owner: {
      name: "",
      phoneNumber: "",
      email: "",
      aadharNumber: "",
    },
    purchaser: {
      name: "",
      phoneNumber: "",
      email: "",
      aadharNumber: "",
    },
    area: "",
    tokenAmount: "",
    agreementAmount: "",
    totalAmount: "",
    address: {
      city: "",
      landmark: "",
      pincode: "",
      country: "",
      state: "",
      muza:""
    },
    partners: [],
  });
console.log(allData)
  useEffect(() => {
    async function getData() {
      const response = await axios.get(`${BASE_URL}/land/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setAllData(response.data); // Assuming the API response is in `response.data`
    }
    getData();
  }, [id, token]);

  const handleInputChange = (e, field, section = "") => {
    const { name, value } = e.target;

    setAllData((prevData) => {
      if (section) {
        return {
          ...prevData,
          [section]: {
            ...prevData[section],
            [name]: value,
          },
        };
      } else {
        return {
          ...prevData,
          [name]: value,
        };
      }
    });
  };

  const handlePartnerChange = (e, index, field) => {
    const { value } = e.target;
    const updatedPartners = allData.partners.map((partner, i) =>
      i === index ? { ...partner, [field]: value } : partner
    );
    setAllData((prevData) => ({
      ...prevData,
      partners: updatedPartners,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { ...allData };

    try {
      const response = await axios.put(`${BASE_URL}/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      alert("changes sucessfully")
      navigate("/landpurchase")
    } catch (error) {
      console.error("Error updating land details:", error.response?.data || error);
    }
  };

  return (
    <div className="Addland_form_container">
      <h1 className="Addlandh1">Edit Property Form</h1>
      <form onSubmit={handleSubmit} className="addlandform">
        {/* Owner Details */}
        <h3>Owner Details</h3>
        <div className="Add_land_form_group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={allData.owner.name}
            onChange={(e) => handleInputChange(e, "name", "owner")}
          />
        </div>
        <div className="Add_land_form_group">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={allData.owner.phoneNumber}
            onChange={(e) => handleInputChange(e, "phoneNumber", "owner")}
          />
        </div>
        <div className="Add_land_form_group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={allData.owner.address}
            onChange={(e) => handleInputChange(e, "address", "owner")}
          />
        </div>
        <div className="Add_land_form_group">
          <label>Aadhar Number:</label>
          <input
            type="text"
            name="aadharNumber"
            value={allData.owner.aadharNumber}
            onChange={(e) => handleInputChange(e, "aadharNumber", "owner")}
          />
        </div>

        {/* Purchaser Details */}
        <h3>Purchaser Details</h3>
        <div className="Add_land_form_group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={allData.purchaser.name}
            onChange={(e) => handleInputChange(e, "name", "purchaser")}
          />
        </div>
        <div className="Add_land_form_group">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={allData.purchaser.phoneNumber}
            onChange={(e) => handleInputChange(e, "phoneNumber", "purchaser")}
          />
        </div>
        <div className="Add_land_form_group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={allData.purchaser.address}
            onChange={(e) => handleInputChange(e, "address", "purchaser")}
          />
        </div>
        <div className="Add_land_form_group">
          <label>Aadhar Number:</label>
          <input
            type="text"
            name="aadharNumber"
            value={allData.purchaser.aadharNumber}
            onChange={(e) => handleInputChange(e, "aadharNumber", "purchaser")}
          />
        </div>

        {/* Property Details */}
        <h3>Property Details</h3>
        <div className="Add_land_form_group">
          <label>Area (sq ft):</label>
          <input
            type="number"
            name="area"
            value={allData.area}
            onChange={(e) => handleInputChange(e, "area")}
          />
        </div>
        <div className="Add_land_form_group">
          <label>Token Amount:</label>
          <input
            type="number"
            name="tokenAmount"
            value={allData.tokenAmount}
            onChange={(e) => handleInputChange(e, "tokenAmount")}
          />
        </div>
        <div className="Add_land_form_group">
          <label>Agreement Amount:</label>
          <input
            type="number"
            name="agreementAmount"
            value={allData.agreementAmount}
            onChange={(e) => handleInputChange(e, "agreementAmount")}
          />
        </div>
        <div className="Add_land_form_group">
          <label>Total Amount:</label>
          <input
            type="number"
            name="totalAmount"
            value={allData.totalAmount}
            onChange={(e) => handleInputChange(e, "totalAmount")}
          />
        </div>

        {/* Address Details */}
        <h3>Address Details</h3>
        <div className="Add_land_form_group">
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={allData.address.city}
            onChange={(e) => handleInputChange(e, "city", "address")}
          />
        </div>
        <div className="Add_land_form_group">
          <label>Muza:</label>
          <input
            type="text"
            name="muza"
            value={allData.address.muza}
            onChange={(e) => handleInputChange(e, "muza", "address")}
          />
        </div>
        <div className="Add_land_form_group">
          <label>KH Number:</label>
          <input
            type="text"
            name="khno"
            value={allData.address.khno}
            onChange={(e) => handleInputChange(e, "khno", "address")}
          />
        </div>
        <div className="Add_land_form_group">
          <label>PH  Number:</label>
          <input
            type="text"
            name="phno"
            value={allData.address.phno}
            onChange={(e) => handleInputChange(e, "phno", "address")}
          />
        </div>
        <div className="Add_land_form_group">
          <label>plot Number:</label>
          <input
            type="text"
            name="plotno"
            value={allData.address.plotno}
            onChange={(e) => handleInputChange(e, "plotno", "address")}
          />
        </div>
        <div className="Add_land_form_group">
          <label>Landmark:</label>
          <input
            type="text"
            name="landmark"
            value={allData.address.landmark}
            onChange={(e) => handleInputChange(e, "landmark", "address")}
          />
        </div>
        <div className="Add_land_form_group">
          <label>Pincode:</label>
          <input
            type="text"
            name="pincode"
            value={allData.address.pincode}
            onChange={(e) => handleInputChange(e, "pincode", "address")}
          />
        </div>
        <div className="Add_land_form_group">
          <label>Country:</label>
          <input
            type="text"
            name="country"
            value={allData.address.country}
            onChange={(e) => handleInputChange(e, "country", "address")}
          />
        </div>
        <div className="Add_land_form_group">
          <label>State:</label>
          <input
            type="text"
            name="state"
            value={allData.address.state}
            onChange={(e) => handleInputChange(e, "state", "address")}
          />
        </div>

        {/* Partner Details */}
        <h3>Partner Details</h3>
        {allData.partners.map((partner, index) => (
          <div key={index} className="Addland_partner_section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4>Partner {index + 1}</h4>
            </div>
            <div className="Add_land_form_group">
              <label>Partner Name:</label>
              <input
                type="text"
                name="name"
                value={partner.name}
                onChange={(e) => handlePartnerChange(e, index, "name")}
              />
            </div>
            <div className="Add_land_form_group">
              <label>Partner Address:</label>
              <input
                type="text"
                name="city"
                value={partner.city}
                onChange={(e) => handlePartnerChange(e, index, "city")}
              />
            </div>
            <div className="Add_land_form_group">
              <label>Partner Phone Number:</label>
              <input
                type="text"
                name="phoneNumber"
                value={partner.phoneNumber}
                onChange={(e) => handlePartnerChange(e, index, "phoneNumber")}
              />
            </div>
          
            <div className="Add_land_form_group">
              <label>date:</label>
              <input
                type="date"
                name="date"
                value={partner.paymentDate || new Date().toISOString().split("T")[0]}
                onChange={(e) => handlePartnerChange(e, index, "date")}
              />
            </div>
          </div>
        ))}
        <div style={{ marginTop: "10px" }}>
          <button type="submit" className="edit_land_submitbtn">
            Submit Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditLand;
