import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../src/Registration/appuserregistration.css";
import { BASE_URL } from "../config";
function AppUserRegistration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const token = JSON.parse(
    localStorage.getItem("employeROyalmadeLogin")
  )?.token;
  const [supervisorTable, SetSupervisortable] = useState([]);
  const [SuperVisorid, setSuperVisorId] = useState("");
  const [showSiteDropdown, setshowSiteDropdown] = useState(false);
  const [siteName, setSiteName] = useState([]);
  const [residencyId, setresidencyId] = useState("");
  const [refreshKey, setRefreshkey] = useState(0);
  const [removesiteDropdown, setremovesiteDropdown] = useState(false);
  const [removeSuperVisorId, setremoveSuperVisorId] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const formData = {
      name,
      email,
      password,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/registerSuperisor`,
        formData
      );
      console.log(response.data);
      if (response.data) {
        alert("SuperVisor Added Successfully");
        setRefreshkey(refreshKey + 1);
      }
    } catch (error) {
      console.error(error);
      setIsSubmitted(false);
    }

    setName("");
    setEmail("");
    setPassword("");
  };

  useEffect(() => {
    async function getAllSupervisor() {
      try {
        const response = await axios.get(`${BASE_URL}/AllSuperisor`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(response.data);
        SetSupervisortable(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getAllSupervisor();
  }, [refreshKey]);

  

  function getSuperVisorId(id) {
    setSuperVisorId(id);
    setshowSiteDropdown(true);
  }

  useEffect(() => {
    async function getSiteName() {
      try {
        const response = await axios.get(`${BASE_URL}/getAllProjects`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(response.data);
        setSiteName(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getSiteName();
  }, []);

  async function handleAddSite() {
    try {
      const response = await axios.put(
        `${BASE_URL}/allowedSiteSupervisor/${SuperVisorid}/${residencyId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        alert("add site successful");
        setshowSiteDropdown(false);
      }
      setRefreshkey(refreshKey + 1);
    } catch (error) {
      console.log(error);
    }
  }

  function removeSuperVisor(id) {
    setremoveSuperVisorId(id);
    setremovesiteDropdown(true);
  }

  async function handleRemoveSite() {
    try {
      const response = await axios.put(
        `${BASE_URL}/releaseSiteSupervisor/${removeSuperVisorId}/${residencyId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        alert("remove site successful");
        setremovesiteDropdown(false);
      }
      setRefreshkey(refreshKey + 1);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Supervisor Registration
      </h2>
      
      <div className="app_user_registration_form_wrapper">
        <form onSubmit={handleSubmit} className="app_user_registration_form">
          <div>
            <label htmlFor="name" className="app_user_registration_form_label">
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="app_user_registration_form_input"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="app_user_registration_form_label">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="app_user_registration_form_input"
               required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="app_user_registration_form_label"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="app_user_registration_form_input"
              required
            />
          </div>

          <button
            type="submit"
            className="app_user_registration_form_submit_button"
            disabled={isSubmitted}
          >
            {isSubmitted ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      <div className="supervisor_table_wrapper">
        <table className="supervisor_table">
          <thead className="supervisor_table_thead">
            <tr>
              <th>Supervisor Name</th>
              <th>Supervisor Email</th>
              <th>Allotted Sites</th>
              <td> Action</td>
            </tr>
          </thead>
          <tbody className="supervisor_table_tbody">
            {supervisorTable.map((supervisor) => (
              <tr key={supervisor.id}>
                <td>{supervisor.name}</td>
                <td>{supervisor.email}</td>
                <td>
                  {supervisor.allowedSite.map((item, index) => {
                    return (
                      <div key={index}>
                        <p> {item.name} </p>
                      </div>
                    );
                  })}{" "}
                </td>
                <td>
                  <button
                    onClick={() => getSuperVisorId(supervisor.id)}
                    className="alloted_site_button"
                  >
                    AllotSite
                  </button>
                  <button
                    onClick={() => removeSuperVisor(supervisor.id)}
                    className="remove_site_button"
                  >
                    {" "}
                    Remove Site
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showSiteDropdown && (
        <div className="selct_site_dropdown_conatiner">
          <button
            onClick={() => setshowSiteDropdown(false)}
            className="selct_site_dropdown_conatiner_close_button"
          >
            {" "}
            X
          </button>
          <p className="selct_site_dropdown_heading">Add Supervisor To Site</p>
          <select
            value={residencyId}
            onChange={(e) => setresidencyId(e.target.value)}
            className="selct_site_dropdown_select"
          >
            <option value=""> Select Site</option>
            {siteName.map((item, index) => {
              return (
                <>
                  <option key={item.id} value={item.id}>
                    {" "}
                    {item.name}
                  </option>
                </>
              );
            })}
          </select>
          <button
            onClick={handleAddSite}
            className="selct_site_dropdown_submit_button"
          >
            {" "}
            Submit
          </button>
        </div>
      )}

      {removesiteDropdown && (
        <div className="selct_site_dropdown_conatiner">
          <button
            onClick={() => setremovesiteDropdown(false)}
            className="selct_site_dropdown_conatiner_close_button"
          >
            {" "}
            X
          </button>
          <p className="selct_site_dropdown_heading">
            remove Supervisor To Site
          </p>
          <select
            value={residencyId}
            onChange={(e) => setresidencyId(e.target.value)}
            className="selct_site_dropdown_select"
          >
            <option value=""> Select Site</option>
            {siteName.map((item, index) => {
              return (
                <>
                  <option key={item.id} value={item.id}>
                    {" "}
                    {item.name}
                  </option>
                </>
              );
            })}
          </select>
          <button
            onClick={handleRemoveSite}
            className="selct_site_dropdown_submit_button"
          >
            Remove Site{" "}
          </button>
        </div>
      )}
    </>
  );
}

export default AppUserRegistration;
