import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../addEmployes/employee.css";
import Subadmin from "./Subadmin";
import AppUserRegistration from "../../Registration/AppUserRegistration";

function Employee() {
  const [open, setOpen] = useState(false);
  const [opensupervisor, setOpenSupervisor] = useState(false);

  const navigate = useNavigate();

  function handleSuperVisor() {
    setOpen(false);
    setOpenSupervisor(true);
  }

  function handleAddEmploye() {
    setOpenSupervisor(false);
    setOpen(true);
  }

  return (
    <>
      <div className="admin_registration_button">
        <button onClick={handleSuperVisor} className="add_supervisor">
          Add SuperVisor
        </button>
        <button
          style={{ marginLeft: "10px" }}
          className="add_supervisor"
          onClick={handleAddEmploye}
        >
          Add Employee and SubAdmin
        </button>
      </div>

      {open && <div><Subadmin /></div>}
      {opensupervisor && <AppUserRegistration />}
    </>
  );
}


export default Employee;
