import React, { useState } from 'react';
import "../lead/Lead.css";
import { BASE_URL } from '../../config';

function AddLead({ props }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]); 

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const newLead = {
      name: form.name.value,
      jobTitle: form.jobTitle.value,
      companyName: form.companyName.value,
      email: form.email.value,
      phoneNumber: form.phoneNumber.value,
      foundOn: form.foundOn.value, 
      status: "NEW_LEAD", 
    };

    try {
      const response = await fetch(`${BASE_URL}/createNewLead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      });

      if (response.ok) {
        alert("Lead created successfully");
        form.reset();
        setCurrentDate(new Date().toISOString().split("T")[0]); 
        closePopup();
      } else {
        console.error('Failed to create lead');
      }
    } catch (error) {
      console.error('Error creating lead:', error);
    }
  };

  return (
    <>
      <div className="popup">
        <div className="add_lead_popup_container">
          <h2>Add New Lead</h2>
          <div className="closeAddlead" onClick={props}>
            <button style={{ color: "red" }}>X</button>
          </div>
          <form onSubmit={handleSubmit} className='add_lead_form'>
            <div className="input-containerr">
              <input type="text" name="name" placeholder=" " required />
              <label>First Name</label>
            </div>
            <div className="input-containerr">
              <input type="text" name="jobTitle" placeholder=" " required />
              <label>Job Title</label>
            </div>
            <div className="input-containerr">
              <input type="email" name="email" placeholder=" " required />
              <label>Email</label>
            </div>
            <div className="input-containerr">
              <input type="text" name="phoneNumber" placeholder=" " required />
              <label>Phone</label>
            </div>
            <div className="input-containerr">
              <input type="text" name="companyName" placeholder=" " required />
              <label>Company Name</label>
            </div>
            <div className="input-containerr">
              <input type="date" name="foundOn" value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} required />
              <label>Found On</label>
            </div>
            <button type="submit" className='lead_button'>Submit Lead</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddLead;
