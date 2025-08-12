import { useEffect, useState } from "react";
// import "./EmployeeForm.css";
import "./employeregister.css";
import axios from "axios";
import { BASE_URL } from "../config";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const token = JSON.parse(localStorage.getItem("employeROyalmadeLogin"))?.token;

const EmployeeForm = () => {
  const [employeeList, setEmployeList] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [refreshkey, setRefreshKey] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
    try {
      const response = await axios.post(
        `${BASE_URL}/employeeregister`,
        formData
      );
      console.log(response.data);
      if (response.status === 200) {
        alert("employe register successfully");
        setRefreshKey(refreshkey + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function getAllEmploye() {
      try {
        const response = await fetch(`${BASE_URL}/allEmployee`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data);
        setEmployeList(data);
      } catch (error) {
        console.log(error);
      }
    }
    getAllEmploye();
  }, [refreshkey]);

  async function handleDeleteEmploye(id) {
    try {
      const response = await axios.delete(`${BASE_URL}/employeeDelete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      if (response.status === 200) {
        alert("employe delete Successfully");
        setRefreshKey(refreshkey + 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="employee-form-container">
        <h2>Employee Registration</h2>
        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="loginEyeIcon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className="submit-btn">
            Register
          </button>
        </form>
      </div>

      <div className="employee_table_container">
        <h2>Employee List</h2>
        <table className="employee_table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employeeList.length > 0 ? (
              employeeList.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>
                    <button
                      className="employe_delete_btn"
                      onClick={() => handleDeleteEmploye(employee.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No employees found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EmployeeForm;
