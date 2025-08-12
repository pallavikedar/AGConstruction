import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import "./Latter.css"
import {
    FaMapMarkerAlt,
    FaEnvelope,
    FaGlobe,
    FaPhoneAlt,
} from "react-icons/fa";
import logo from "../../assets/royal.png"
import { useRef } from "react";
import html2pdf from "html2pdf.js";
import "@fontsource/roboto"; // Default weight
import { BASE_URL } from '../../config';
function Offerlatter() {
    const letterRef = useRef();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [cureentDate, setCurrentDate] = useState("");
    const [joiningDate, setJoiningDate] = useState("");
    const [position, setPosition] = useState("");
    const [ctc, setCtc] = useState("");
    const [offerData, setOfferdata] = useState([])
    const token = JSON.parse(
        localStorage.getItem("employeROyalmadeLogin")
    )?.token;
    const [singleOffer, setSingleOffer] = useState("")
    const [showMyofferLatter, setShowMyOfferlatter] = useState(false)
    const [refreshKey, setRefreshKey] = useState("")
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
      const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        const formdata = {
            name,
            email,
            address,
            phoneNumber,
            cureentDate: cureentDate || new Date().toISOString().split("T")[0],
            joiningDate: joiningDate || new Date().toISOString().split("T")[0],
            position,
            ctc,
        };

        try {
            if (isEditing) {
                await axios.put(`${BASE_URL}/updateOfferlatter/${editId}`, formdata, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                alert("Offer letter updated successfully!");
            } else {
                await axios.post(`${BASE_URL}/createOfferLatter`, formdata, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                alert("Form submitted successfully!");
            }

            setIsEditing(false);
            setEditId(null);
            setRefreshKey(refreshKey + 1); // refresh table

            // Reset form
            setAddress("");
            setName("");
            setEmail("");
            setPhoneNumber("");
            setCurrentDate("");
            setJoiningDate("");
            setPosition("");
            setCtc("");
        } catch (error) {
            console.log(error);
        }
        finally{
            setIsSubmitting(false);
        }
    };

    const handleEdit = (offer) => {
        setName(offer.name);
        setEmail(offer.email);
        setAddress(offer.address);
        setPhoneNumber(offer.phoneNumber);
        setCurrentDate(offer.cureentDate.split("T")[0]);
        setJoiningDate(offer.joiningDate.split("T")[0]);
        setPosition(offer.position);
        setCtc(offer.ctc);
        setEditId(offer.id);
        setIsEditing(true);
    };


    useEffect(() => {
        async function getoffer() {
            try {
                const response = await axios.get(`${BASE_URL}/getOfferlatter`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                })

                const sortData = [...response.data].sort((a, b) => b.id - a.id)
                setOfferdata(sortData)
            } catch (error) {
                console.log(error)
            }
        }
        getoffer()
    }, [refreshKey])

    async function ShowofferLatter(id) {
        try {
            const response = await axios.get(`${BASE_URL}/singleOfferlatter/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
            console.log(response.data)

            setSingleOffer(response.data)
            setShowMyOfferlatter(true)
        } catch (error) {
            console.log(error)
        }

    }

    async function deleteofferLatter(id) {
        const deleteoffer = window.confirm("Are you sure to delete ? ")
        if (!deleteoffer) return
        try {
            const response = await axios.delete(`${BASE_URL}/deleteOfferlatter/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
            console.log(response)
            setRefreshKey(refreshKey + 1)
        } catch (error) {
            console.log(error)
        }

    }
    const handleDownload = () => {
        const element = letterRef.current;
        const options = {
            margin: 0.5,
            filename: `offer_letter_${singleOffer.name}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        };

        html2pdf().set(options).from(element).save();
    };

    return (
        <>
            <h1 style={{ textAlign: "center", marginTop: "50px" }} className='offer_letter_heading'>
                Offerlatter
            </h1>

            <div className="offer_latter_form_wrapper">
                <form onSubmit={handleSubmit} className="offer_latter_form">
                    <div className="offer_latter_div">
                        <label className="offer_latter_lable">Name:</label>
                        <input
                            type="text"
                            className="offer_latter_input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="offer_latter_div">
                        <label className="offer_latter_lable">Email:</label>
                        <input
                            type="email"
                            className="offer_latter_input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="offer_latter_div">
                        <label className="offer_latter_lable">Address:</label>
                        <input
                            type="text"
                            className="offer_latter_input"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>

                    <div className="offer_latter_div">
                        <label className="offer_latter_lable">Phone Number:</label>
                        <input
                            type="text"
                            className="offer_latter_input"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>

                    <div className="offer_latter_div">
                        <label className="offer_latter_lable">Current Date:</label>
                        <input
                            type="date"
                            className="offer_latter_input"
                            value={cureentDate || new Date().toISOString().split("T")[0]}
                            onChange={(e) => setCurrentDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="offer_latter_div">
                        <label className="offer_latter_lable">Joining Date:</label>
                        <input
                            type="date"
                            className="offer_latter_input"
                            value={joiningDate || new Date().toISOString().split("T")[0]}
                            onChange={(e) => setJoiningDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="offer_latter_div">
                        <label className="offer_latter_lable">Position:</label>
                        <input
                            type="text"
                            className="offer_latter_input"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            required
                        />
                    </div>

                    <div className="offer_latter_div">
                        <label className="offer_latter_lable">CTC:</label>
                        <input
                            type="text"
                            className="offer_latter_input"
                            value={ctc}
                            onChange={(e) => setCtc(e.target.value)}
                            
                            required
                        />
                    </div>

                    <div className="offer_latter_div">
                        <button type="submit" className="offer_latter_button" disabled={isSubmitting}>
                            {isSubmitting ? "isSubmitting..." : isEditing ? "Update" : "Submit"}
                        </button>

                    </div>
                </form>
            </div>


            <h1 style={{ textAlign: "center", marginTop: "50px" }}>   Offer Table</h1>
            <div className="offer_table_wrapper">
                <table className='offer_table'>
                    <thead className='offer_thead'>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Phone Number</th>
                            <th>Current Date</th>
                            <th>Joining Date</th>
                            <th>Position</th>
                            <th>CTC</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className='offer_tbody'>
                        {offerData.map((offer, index) => (
                            <tr key={offer.id}>
                                <td>{index}</td>
                                <td>{offer.name}</td>
                                <td>{offer.email}</td>
                                <td>{offer.address}</td>
                                <td>{offer.phoneNumber}</td>
                                <td>{new Date(offer.cureentDate).toLocaleDateString("en-GB")}</td>
                                <td>{new Date(offer.joiningDate).toLocaleDateString("en-GB")}</td>
                                <td>{offer.position}</td>
                                <td>{offer.ctc}</td>
                                <td>
                                    <button onClick={() => ShowofferLatter(offer.id)} className='latter_show_button'> Show</button>
                                    <button onClick={() => deleteofferLatter(offer.id)} className='latter_show_delete'> Delete</button>
                                    <button onClick={() => handleEdit(offer)} className='latter_show_button'> Edit</button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {
                showMyofferLatter && singleOffer && (
                    <div className='offer_latter_main_wrapper'>

                        <button onClick={handleDownload} className='offer_latter_downlode'>Download</button>
                        <button onClick={() => setShowMyOfferlatter(false)} className='offer_latter_close'>Close</button>
                        <div
                            ref={letterRef}
                            style={{
                                fontFamily: "Roboto",
                                width: "100%",
                                margin: "auto",
                                padding: "20px",
                                height: "auto",
                                border: "1px solid #ccc",
                                pageBreakAfter: "always",
                                color: "#000",
                            }}>
                            {/* Header */}
                            <div
                                style={{
                                    textAlign: "right",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                    color: "#000",
                                    marginLeft: "50px",
                                    marginTop: "20px"

                                }}
                            >
                                <img
                                    style={{
                                        height: "80px",
                                        width: "auto",
                                        objectFit: "contain",
                                    }}
                                    src={logo}
                                    alt=""
                                />


                                <div className="relieving_company_details">
                                    <div className="relieving_detail_row">
                                        <div className="relieving_detail_text">
                                            <p>Plot No. 28, 1st Floor, Govind Prabhau Nagar,</p>
                                            <p>Hudkeshwar Road, Nagpur - 440034</p>
                                        </div>
                                        <div className="relieving_icon_box"><FaMapMarkerAlt size={15} color="#fff" /></div>
                                    </div>
                                    <div className="relieving_detail_row">
                                        <p className="relieving_detail_text">royaalmede@gmail.com</p>
                                        <div className="relieving_icon_box"><FaEnvelope size={15} color="#fff" /></div>
                                    </div>
                                    <div className="relieving_detail_row">
                                        <p className="relieving_detail_text">www.royaalmede.co.in</p>
                                        <div className="relieving_icon_box"><FaGlobe size={15} color="#fff" /></div>
                                    </div>
                                    <div className="relieving_detail_row">
                                        <p className="relieving_detail_text">9028999253 | 9373450092</p>
                                        <div className="relieving_icon_box"><FaPhoneAlt size={15} color="#fff" /></div>
                                    </div>
                                </div>
                            </div>

                            <hr style={{ border: "1px solid rgb(167, 5, 86)", marginBottom: "2px" }} />
                            <hr style={{ border: "3px solid rgb(167, 5, 86)" }} />
                            <div style={{ lineHeight: "30px" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        flex: "row",
                                        justifyContent: "space-between",
                                        padding: "30px",
                                    }}
                                >
                                    <div>
                                        <p>
                                            Address: <strong>{singleOffer.address}</strong>
                                        </p>
                                        <p>
                                            Contact No.: <strong>{singleOffer.phoneNumber}</strong>
                                        </p>
                                        <p>
                                            Email: <strong>{singleOffer.email}</strong>
                                        </p>
                                    </div>
                                    <p>Date: {new Date(singleOffer.cureentDate).toLocaleDateString("en-GB")}</p>
                                </div>

                                {/* Offer Letter Content */}
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <h2 className='offer_letter_heading'>OFFER LETTER</h2>
                                </div>

                                <p>
                                    Dear <strong>{singleOffer.name}</strong>,
                                </p>
                                <p>
                                    We are pleased to inform you that you have been selected for a position in
                                    our company. We are offering you the following role in ROYAALMEDE JAN DHAN MULTIURBAN NIDHI LIMITED under the terms and conditions specified below:
                                </p>

                                <ol style={{ marginLeft: "22px", listStyleType: "decimal" }}>
                                    <li>
                                        Your designation/position will be: <strong>{singleOffer.position}</strong>
                                    </li>
                                    <li>
                                        Joining Date: You may join on <strong>{new Date(singleOffer.joiningDate).toLocaleDateString("en-GB")}</strong>
                                    </li>
                                    <li>
                                        Compensation & Benefits: Your annual salary will be{" "}
                                        <strong>{singleOffer.ctc}</strong>
                                    </li>
                                </ol>

                                <p>Kindly submit the following documents at the time of joining: </p>
                                <ol style={{ marginLeft: "22px", listStyleType: "decimal" }}>
                                    <li>Self-attested PAN Card copy.</li>
                                    <li>Self-attested copy of Address Proof.</li>
                                    <li>
                                        Self-attested certificates in support of your educational
                                        professional qualifications.
                                    </li>
                                    <li>2 copies of your recent passport-size photographs.</li>
                                    <li>Bank Details (Copy of Passbook/Cancelled Cheque).</li>
                                </ol>

                                <p>
                                    Your position is a whole-time employment with the Company, and you shall devote yourself exclusively to the business and interests of the company. You need to provide a 30-day notice prior to your resignation during your probation period. You will not take up any other work for remuneration or be interested directly or indirectly in any other trade or business during your employment without permission in writing from the company.
                                </p>
                                <p>
                                    We look forward to an exciting journey in the growth of the Company and a successful and rewarding association.
                                </p>
                                <p>Sincerely Yours,</p>

                                {/* Signature Section */}
                                <div style={{ marginTop: "40px" }}>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <strong>ACKNOWLEDGEMENT AND ACCEPTANCE</strong>
                                    </div>
                                    <p>
                                        I have carefully read, considered, and understand the terms and
                                        conditions under which this position is being offered to me and
                                        I hereby signify my acceptance of all the terms and conditions
                                        by returning the duplicate copy of this offer letter.
                                    </p>
                                    <br />
                                    {singleOffer.name}
                                    <p>Signature</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }




        </>

    )
}

export default Offerlatter