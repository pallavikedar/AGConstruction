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
import "./Noc.css";
import axios from "axios";
import { BASE_URL } from "../../config";
import numberToWords from "number-to-words";
import AGImg from "../../assets/ag construction-1.png";
const currentDate = new Date().toISOString().split("T")[0];
const myCurrentDate = new Date(currentDate).toLocaleDateString("en-GB");
function NocLetter() {
  const [ShowNocLetter, setShowNocLetter] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [bankName, setBankName] = useState("");
  const [address, setAddress] = useState("");
  const [blank, setBlank] = useState("");
  const [coustomername, setCoustomerName] = useState("");
  const [aggrementDate, setAggrementDate] = useState("");
  const [flatNo, setFlatNo] = useState("");
  const [buildingNo, setBuildingNo] = useState("");
  const [streetNo, setStreetNo] = useState("");
  const [localityName, setLocalityName] = useState("");
  const [areaName, setAreaName] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionAmountWords, setTransactionAmountWords] = useState("");
  const [facvoringName, setFacvoringName] = useState("");
  const [reciverBankName, setReciverBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [acNO, setAcNO] = useState("");
  const [ifsc, setIfsc] = useState("");
  const loanref = useRef();
  const token = JSON.parse(
    localStorage.getItem("employeROyalmadeLogin")
  )?.token;
  const [refreshkey, setrefreshkey] = useState();
  const [nocLatterTable, setnocLatterTable] = useState([]);
  const [nocSingleLetter, setnocSingleLetter] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTransactionAmountChange = (e) => {
    let value = e.target.value.replace(/,/g, ""); // Remove commas
    if (!isNaN(value) && value !== "") {
      setTransactionAmount(value);
      setTransactionAmountWords(
        numberToWords.toWords(parseInt(value)) + " only"
      );
    } else {
      setTransactionAmount("");
      setTransactionAmountWords("");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = {
      bankName,
      address,
      blank,
      coustomername,
      aggrementDate: aggrementDate || new Date().toISOString().split("T")[0],
      flatNo,
      buildingNo,
      streetNo,
      localityName,
      areaName,
      pincode,
      city,
      transactionAmount,
      transactionAmountWords,
      facvoringName,
      reciverBankName,
      branchName,
      acNO,
      ifsc,
    };

    try {
      if (isEditMode && editId) {
        const response = await axios.put(
          `${BASE_URL}/bankNoc/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          alert("NOC Letter Updated Successfully");
        }
      } else {
        const response = await axios.post(
          `${BASE_URL}/createBankNoc`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          alert("Form submit Successfully");
        }
      }

      setrefreshkey((prevKey) => (prevKey || 0) + 1);
      resetForm();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
    finally{
      setIsSubmitting(false);
    }
  };

  function handleEditNoc(item) {
    setIsEditMode(true);
    setEditId(item.id);

    setBankName(item.bankName || "");
    setAddress(item.address || "");
    setBlank(item.blank || "");
    setCoustomerName(item.coustomername || "");
    setAggrementDate(item.aggrementDate || "");
    setFlatNo(item.flatNo || "");
    setBuildingNo(item.buildingNo || "");
    setStreetNo(item.streetNo || "");
    setLocalityName(item.localityName || "");
    setAreaName(item.areaName || "");
    setPincode(item.pincode || "");
    setCity(item.city || "");
    setTransactionAmount(item.transactionAmount || "");
    setTransactionAmountWords(item.transactionAmountWords || "");
    setFacvoringName(item.facvoringName || "");
    setReciverBankName(item.reciverBankName || "");
    setBranchName(item.branchName || "");
    setAcNO(item.acNO || "");
    setIfsc(item.ifsc || "");
  }
  function resetForm() {
    setBankName("");
    setAddress("");
    setBlank("");
    setCoustomerName("");
    setAggrementDate("");
    setFlatNo("");
    setBuildingNo("");
    setStreetNo("");
    setLocalityName("");
    setAreaName("");
    setPincode("");
    setCity("");
    setTransactionAmount("");
    setTransactionAmountWords("");
    setFacvoringName("");
    setReciverBankName("");
    setBranchName("");
    setAcNO("");
    setIfsc("");
    setIsEditMode(false);
    setEditId(null);
  }

  useEffect(() => {
    async function getAllNocLatter() {
      try {
        const response = await axios.get(`${BASE_URL}/bankNoc`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(response.data);
        const sortedData = [...response.data].sort((a, b) => b.id - a.id);
        setnocLatterTable(sortedData);
      } catch (error) {
        console.log(error);
      }
    }
    getAllNocLatter();
  }, [refreshkey]);

  async function handleViewNoc(id) {
    setShowNocLetter(true);
    try {
      const response = await axios.get(`${BASE_URL}/bankNoc/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      setnocSingleLetter(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteNoc(id) {
    const nocDelete = window.confirm("Are you sure to delete ?");
    if (!nocDelete) return;
    try {
      const response = await axios.delete(`${BASE_URL}/bankNoc/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      if (response.status === 200) {
        alert("Latter Delete Successfully");
        setrefreshkey((prevKey) => (prevKey || 0) + 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleDownlodeNoc() {
    const element = loanref.current;
    const options = {
     
      filename: "Noc_letter.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(options).from(element).save();
  }
  return (
    <>
      <form className="nocform" onSubmit={handleSubmit}>
        <h2>NOC Form</h2>
        <input
          className="nocinput"
          type="text"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          placeholder="Bank Name"
          required
        />
        <input
          className="nocinput"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          required
        />
        <input
          className="nocinput"
          type="text"
          value={blank}
          onChange={(e) => setBlank(e.target.value)}
          placeholder="Blank"
          required
        />
        <input
          className="nocinput"
          type="text"
          value={coustomername}
          onChange={(e) => setCoustomerName(e.target.value)}
          placeholder="Customer Name"
          required
        />
        <input
          className="nocinput"
          type="date"
          value={aggrementDate || new Date().toISOString().split("T")[0]}
          onChange={(e) => setAggrementDate(e.target.value)}
          placeholder="Agreement Date"
          required
        />
        <input
          className="nocinput"
          type="text"
          value={flatNo}
          onChange={(e) => setFlatNo(e.target.value)}
          placeholder="Flat No"
          required
        />
        <input
          className="nocinput"
          type="text"
          value={buildingNo}
          onChange={(e) => setBuildingNo(e.target.value)}
          placeholder="Building No"
          required
        />
        <input
          className="nocinput"
          type="text"
          value={streetNo}
          onChange={(e) => setStreetNo(e.target.value)}
          placeholder="Street No"
          required
        />
        <input
          className="nocinput"
          type="text"
          value={localityName}
          onChange={(e) => setLocalityName(e.target.value)}
          placeholder="Locality Name"
          required
        />
        <input
          className="nocinput"
          type="text"
          value={areaName}
          onChange={(e) => setAreaName(e.target.value)}
          placeholder="Area Name"
          required
        />
        <input
          className="nocinput"
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Pincode"
          required
        />
        <input
          className="nocinput"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          required
        />
        <input
          className="nocinput"
          type="text"
          value={transactionAmount}
          onChange={handleTransactionAmountChange}
          placeholder="Transaction Amount"
          required
        />

        <input
          className="nocinput"
          type="text"
          value={facvoringName}
          onChange={(e) => setFacvoringName(e.target.value)}
          placeholder="Favouring Name"
          required
        />
        <input
          className="nocinput"
          type="text"
          value={reciverBankName}
          onChange={(e) => setReciverBankName(e.target.value)}
          placeholder="Receiver Bank Name"
          required
        />
        <input
          className="nocinput"
          type="text"
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
          placeholder="Branch Name"
          required
        />
        <input
          className="nocinput"
          type="text"
          value={acNO}
          onChange={(e) => setAcNO(e.target.value)}
          placeholder="Account No"
          required
        />
        <input
          className="nocinput"
          type="text"
          value={ifsc}
          onChange={(e) => setIfsc(e.target.value)}
          placeholder="IFSC Code"
          required
        />
        <button type="submit" className="nocbutton" disabled={isSubmitting}>
          
          {isSubmitting ? "Submitting..." : isEditMode ? "Update" : "Submit"}
        </button>
      </form>

      {/* noc table */}
      <div className="noc_table_container">
        <table className="noctable">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Account No</th>
              <th>Bank Name</th>
              <th>Branch Name</th>
              <th>IFSC</th>
              <th>Transaction Amount</th>
              <th>City</th>
              <th>Pincode</th>
              <th> Action</th>
            </tr>
          </thead>
          <tbody>
            {nocLatterTable.map((item) => (
              <tr key={item.id}>
                <td>{item.coustomername}</td>
                <td>{item.acNO}</td>
                <td>{item.bankName}</td>
                <td>{item.branchName}</td>
                <td>{item.ifsc}</td>
                <td>{item.transactionAmount}</td>
                <td>{item.city}</td>
                <td>{item.pincode}</td>
                <td>
                  <button
                    onClick={() => handleViewNoc(item.id)}
                    className="noc_view_button"
                  >
                    {" "}
                    View
                  </button>
                  <button
                    className="noc_delete_button"
                    onClick={() => handleDeleteNoc(item.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="noc_view_button"
                    onClick={() => handleEditNoc(item)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ShowNocLetter && nocSingleLetter && (
        <>
          <div className="noc_letter_main_wrapper">
            <div className="noc_downlode_buttons">
              <button
                onClick={handleDownlodeNoc}
                className="noc_downlode_button"
              >
                {" "}
                Download
              </button>
              <button
                onClick={() => setShowNocLetter(false)}
                className="noc_close_button"
              >
                {" "}
                Close
              </button>
            </div>
            <div className="noc_letter_wrapper" ref={loanref}>
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
              <p
                style={{
                  marginTop: "25px",
                  marginRight: "150px",
                  textAlign: "end",
                }}
              >
                Date : {myCurrentDate}{" "}
              </p>
              <p style={{ marginLeft: "40px" }}>
                {" "}
                The Assistant General Manager{" "}
              </p>
              <p style={{ marginLeft: "40px" }}> {nocSingleLetter.bankName} </p>
              <p style={{ marginLeft: "40px" }}>{nocSingleLetter.city}</p>
              <p style={{ marginTop: "30px", marginLeft: "40px" }}> TO,</p>
              <p style={{ marginLeft: "40px" }}>
                {" "}
                I/We, <b>{nocSingleLetter.coustomername}</b> , here by certify
                that :
              </p>

              <p
                style={{
                  marginLeft: "40px",
                  marginTop: "10px",
                  marginRight: "10px",
                }}
              >
                1. I/We have transferable rights to the property described
                below, which has been allotted by me/us to Mr.{" "}
                {nocSingleLetter.coustomername} herein after referred to as “the
                purchasers”, subject to the due and proper performance and
                compliances of all the terms and conditions of the Allotment
                Letter/Sale Agreement dated{" "}
                {new Date(nocSingleLetter.aggrementDate).toLocaleDateString(
                  "en-GB"
                )}{" "}
                (herein after referred to as the “Sale document”)
              </p>

              <p style={{ marginLeft: "40px", marginTop: "20px" }}>
                {" "}
                <b>Description of the property: </b>{" "}
              </p>

              <p style={{ marginLeft: "40px" }}>
                {" "}
                Flat No./ House No. {nocSingleLetter.flatNo}
              </p>
              <p style={{ marginLeft: "40px" }}>
                {" "}
                Building No./Name: {nocSingleLetter.buildingNo}
              </p>
              <p style={{ marginLeft: "40px" }}>
                {" "}
                Street No./Name: {nocSingleLetter.streetNo}{" "}
              </p>
              <p style={{ marginLeft: "40px" }}>
                {" "}
                Locality Name: {nocSingleLetter.localityName}{" "}
              </p>
              <p style={{ marginLeft: "40px" }}>
                {" "}
                Area Name: {nocSingleLetter.areaName}
              </p>
              <p style={{ marginLeft: "40px" }}>
                City Name: {nocSingleLetter.city}
              </p>
              <p style={{ marginLeft: "40px" }}>
                Pin Code: {nocSingleLetter.pincode}
              </p>
              <p style={{ marginLeft: "40px", marginTop: "10px", marginRight:"10px" }}>
                2. That the total consideration for this transaction is Rs.
                {nocSingleLetter.transactionAmount}/- (
                {nocSingleLetter.transactionAmountWords}) towards sale document.{" "}
              </p>
              <p style={{ marginLeft: "40px",marginRight:"10px"  }}>
                3. The title of the property described above is clear,
                marketable and free from all encumbrances and doubts.
              </p>
              <p style={{ marginLeft: "40px",marginRight:"10px"  }}>
                4. I/We confirm that I/we have no objection whatsoever to the
                said purchasers, at their own costs, charges, risks and
                consequences mortgaging the said property to{" "}
                {nocSingleLetter.bankName}( herein after referred to as “the
                Bank”) as security for the amount advanced by the Bank to them
                subject to the due and proper performance and compliances of all
                the terms and conditions of the sale document by the said
                purchasers.
              </p>
              <p style={{ marginLeft: "40px",marginRight:"10px" }}>
                5. We have borrowed from {nocSingleLetter.bankName} (name of the
                financial institution) whose NOC for this transaction is
                enclosed herewith / We have not borrowed from any financial
                institution for the purchase /development of the property and
                have not created and will not create any encumbrances on the
                property allotted to the said purchasers during the currency of
                the loan sanctioned/to be sanctioned by the Bank to them subject
                to the due and proper performance and compliances of all the
                terms and conditions of the sale document by the said
                purchasers.
              </p>
              <p style={{ marginTop:"50px", marginLeft: "40px",marginRight:"10px"  }}>
                6. After creation of proper charge/mortgage and after receipt of
                the copies there of and after receipt of proper nomination in
                favor of the Bank, from the said purchasers, we are agreeable to
                accept {nocSingleLetter.bankName} as a nominee of the above
                named purchaser for the property described above and once the
                nomination favoring the Bank has been registered and advice sent
                to the Bank of having done so, I/We note not to change the same
                without the written NOC of the Bank.
              </p>
              <p style={{ marginLeft: "40px",marginRight:"10px"  }}>
                7. After creation of charge/mortgage and after receipt of the
                copies thereof and after receipt of the proper nomination in
                favor of the Bank, from the above named purchaser, I/We
                undertake to inform the society about the Bank’s charge on the
                said flat as and when the society is formed.
              </p>
              <p style={{ marginLeft: "40px",marginRight:"10px"  }}>
                8. Please note that the payment for this transaction should be
                made by crossed cheque/Transfer of funds favoring “{" "}
                {nocSingleLetter.facvoringName} (Name) ,{" "}
                {nocSingleLetter.reciverBankName} (Bank Name){" "}
                {nocSingleLetter.branchName} Branch , Account No.
                {nocSingleLetter.acNO} ”.
              </p>
              {/* <p style={{ marginLeft: "40px" }}>
                                    9. In case of cancellation of the sale-agreement for any reason, I/We shall refund the amount by crossed cheque favoring the Bank A/C “Cheenkesh Suresh Arora (name of the purchaser)”, and forward the same to you directly.
                                </p>
                                <p style={{ marginLeft: "40px" }}>
                                    10. The signatory to this letter draws authority to sign this undertaking on behalf of the
                                </p> */}
              <br />
              <p style={{ marginLeft: "40px" }}>
                company/firm vide ____________________ (description of document
                of delegation of authority to the signatory.)
              </p>
              <p style={{ marginLeft: "40px", marginTop: "60px" }}>
                {" "}
                Yours faithfully,
              </p>
              <p style={{ marginLeft: "40px", marginTop: "90px" }}>
                Authorized Signatory.
              </p>
              <p style={{ marginLeft: "40px" }}>Name – </p>
              <p style={{ marginLeft: "40px" }}>Place – – </p>
              <p style={{ marginLeft: "40px" }}>Date : {myCurrentDate} – </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default NocLetter;
