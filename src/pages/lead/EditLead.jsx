

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Lead.css"
import { BASE_URL } from "../../config";
function EditLead() {
    const [name, setName] = useState("");
    const [lname, setlName] = useState("");
    const [email, setEmail] = useState("");
    const [job, setJob] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [date, setDate] = useState("");
    const [leadLogs, setLeadLogs] = useState([]);
    const [newLog, setNewLog] = useState({
        logDate: "",
        status: "",
    });

    const { id } = useParams();
    const token = JSON.parse(localStorage.getItem("employeROyalmadeLogin")) || [];
    const myToken = token.token;
    const navigate = useNavigate();
    const [reviewdate,setreviewDate]= useState("")
const [customerreview,setCustomerReview]= useState("")
    useEffect(() => {
        async function getAllData() {
            try {
                const response = await axios.get(`${BASE_URL}/getlead/${id}`, {
                    headers: {
                        Authorization: `Bearer ${myToken}`,
                        "Content-Type": "application/json",
                    },
                });
                console.log(response.data);
                const { name, companyName, email, foundOn, jobTitle, phoneNumber, leadLogs,remark,remarkdate } = response.data;
                setCompanyName(companyName);
                setEmail(email);
                setJob(jobTitle);
                setName(name);
                setDate(foundOn);
                setPhoneNumber(phoneNumber);
                setLeadLogs(leadLogs || []);
                setreviewDate(remarkdate)
                setCustomerReview(remark)
            } catch (error) {
                console.log(error);
            }
        }
        getAllData();
    }, [id]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const updatedLead = {
            name,
            jobTitle: job,
            email,
            phoneNumber,
            companyName,
            foundOn: date,
            leadLogs: leadLogs.length ? leadLogs : [newLog],
            remark:customerreview,
            remarkdate:reviewdate
        };

        try {
            const response = await axios.put(
                `${BASE_URL}/updateLead/${id}`,
                updatedLead,
                {
                    headers: {
                        Authorization: `Bearer ${myToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Lead updated successfully:", response.data);
            navigate("/lead");
        } catch (error) {
            console.error("Error updating lead:", error);
        }
    };

    const handleLogChange = (index, e) => {
        const { name, value } = e.target;
        const updatedLogs = [...leadLogs]; 
        updatedLogs[index] = { ...updatedLogs[index], [name]: value }; 
        setLeadLogs(updatedLogs); 
    };


    const addNewLog = () => {
        setLeadLogs([...leadLogs, { logDate: "", status: "" }]);
    };

    return (
        <div className="edit_lead_main_wrapper">
            <div className="edit_lead_form_container">
                <h2>Edit Lead</h2>
                <form onSubmit={handleFormSubmit} className="edit_lead_form">
                    <div className="edit_lead_input">
                        <input
                            type="text"
                            name="name"
                            placeholder=" "
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <label>First Name</label>
                    </div>

                    <div className="edit_lead_input">
                        <input
                            type="text"
                            name="jobTitle"
                            placeholder=" "
                            required
                            value={job}
                            onChange={(e) => setJob(e.target.value)}
                        />
                        <label>Job Title</label>
                    </div>
                    <div className="edit_lead_input">
                        <input
                            type="email"
                            name="email"
                            placeholder=" "
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label>Email</label>
                    </div>
                    <div className="edit_lead_input">
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder=" "
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <label>Phone</label>
                    </div>
                    <div className="edit_lead_input">
                        <input
                            type="text"
                            name="companyName"
                            placeholder=" "
                            required
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                        <label>Company Name</label>
                    </div>

                    <div className="edit_lead_input">
                        <input
                            type="date"
                            name="foundOn"
                            placeholder=" "
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        <label>Found On</label>
                    </div>

                    {/* Render Lead Logs Form if any logs are available */}
                    {leadLogs.length > 0 && (
                        <div>
                            {leadLogs.map((log, index) => (
                                <div key={index}>
                                    <div className="edit_lead_input">
                                        <input
                                            type="date"
                                            name="logDate"
                                            required
                                            value={log.logDate}
                                            onChange={(e) => handleLogChange(index, e)}
                                        />
                                        <label>Log Date</label>
                                    </div>

                                    <div className="edit_lead_input">
                                        <select
                                            className="editSelect"
                                            required
                                            name="status"  // Ensure the name is correctly set to "status"
                                            value={log.status}
                                            onChange={(e) => handleLogChange(index, e)} // Make sure the function updates the correct field
                                        >
                                            <option value="">Select Status</option>
                                            <option value="FOLLOW_UP">FOLLOW_UP</option>
                                            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                                            <option value="DEMO">DEMO</option>
                                            <option value="NEGOTIATION">NEGOTIATION</option>
                                            <option value="SUCCESS">SUCCESS</option>
                                            <option value="INACTIVE">INACTIVE</option>
                                        </select>

                                        {/* <label>Status</label> */}
                                    </div>
                                </div>
                            ))}
                            {/* <button type="button" onClick={addNewLog}>Add New Log</button> */}
                        </div>
                    )}
    
                 
                    <p className=" ">  Customer review</p>
                    <input type="date" className="edit_lead_customet_review_input" placeholder="review date" value={reviewdate}  onChange={(e)=>setreviewDate(e.target.value)}/>
                    <input type="text" className="edit_lead_customet_review_input" placeholder="customer review" value={customerreview}  onChange={(e)=>setCustomerReview(e.target.value)}/>

                    <button type="submit" className="edit_lead_customet_">Update Lead</button>
                </form>
            </div>
        </div>
    );
}

export default EditLead;
