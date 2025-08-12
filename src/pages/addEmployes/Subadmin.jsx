// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { BASE_URL } from "../../config";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const Subadmin = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [employees, setEmployees] = useState([]);
//   const [subAdmins, setSubAdmins] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const token = JSON.parse(
//     localStorage.getItem("employeROyalmadeLogin")
//   )?.token;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleRegister = async (e, type) => {
//     e.preventDefault();

//     // Validate fields before submitting
//     const { name, email, password } = formData;
//     if (!name.trim() || !email.trim() || !password.trim()) {
//       alert("Please fill all the fields before submitting.");
//       return;
//     }

//     setIsSubmitting(true);

//     const confirmMsg = `Are you sure you want to register this as a ${
//       type === "employee" ? "Employee" : "SubAdmin"
//     }?`;
//     const confirmed = window.confirm(confirmMsg);

//     if (!confirmed) {
//       setIsSubmitting(false); // reset here on cancel
//       return;
//     }

//     const url =
//       type === "employee"
//         ? `${BASE_URL}/registerEmployee`
//         : `${BASE_URL}/registerSubAdmin`;

//     try {
//       const response = await axios.post(url, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       alert(
//         `${
//           type === "employee" ? "Employee" : "SubAdmin"
//         } registered successfully!`
//       );
//       setFormData({ name: "", email: "", password: "" });
//       fetchData(); // refresh list
//     } catch (error) {
//       console.error("Registration error:", error);
//       alert("Registration failed. Please check the console.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const fetchData = async () => {
//     try {
//       const [empRes, subRes] = await Promise.all([
//         axios.get(`${BASE_URL}/GetAllEmployee`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get(`${BASE_URL}/GetAllSubAdmin`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       setEmployees(empRes.data);
//       setSubAdmins(subRes.data);
//     } catch (err) {
//       console.error("Error fetching data:", err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <div style={styles.container}>
//       <h2>User Registration</h2>
//       <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
//         <input
//           type="text"
//           name="name"
//           placeholder="Full Name"
//           value={formData.name}
//           onChange={handleChange}
//           style={styles.input}
//           required
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email Address"
//           value={formData.email}
//           onChange={handleChange}
//           style={styles.input}
//           required
//         />
//         <input
//           type={showPassword ? "text" : "password"}
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           style={styles.input}
//           required
//         />
//         <span style={{color:"red"}}  >
//         Note: <ol>
//         <li>Password add carefully and remember that password because password is not show in list</li>
//         <li>Password set in same format for remember</li>
//         </ol>
//         </span>
//         <div style={styles.buttonGroup}>
//           <button
//             type="button"
//             style={styles.button}
//             onClick={(e) => handleRegister(e, "employee")}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Registering..." : "Register Employee"}
//           </button>
//           <button
//             type="button"
//             style={styles.button}
//             onClick={(e) => handleRegister(e, "subadmin")}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Registering..." : "Register SubAdmin"}
//           </button>
//         </div>
//       </form>

//       <div style={styles.listSection}>
//         <h3>All Employees</h3>
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr>
//               <th style={styles.tableHeader}>#</th>
//               <th style={styles.tableHeader}>Name</th>
//               <th style={styles.tableHeader}>Email</th>
//             </tr>
//           </thead>
//           <tbody>
//             {employees.map((emp, index) => (
//               <tr key={index}>
//                 <td style={styles.tableCell}>{index + 1}</td>
//                 <td style={styles.tableCell}>{emp.name}</td>
//                 <td style={styles.tableCell}>{emp.email}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <h3 style={{ marginTop: "40px" }}>All SubAdmins</h3>
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr>
//               <th style={styles.tableHeader}>#</th>
//               <th style={styles.tableHeader}>Name</th>
//               <th style={styles.tableHeader}>Email</th>
//             </tr>
//           </thead>
//           <tbody>
//             {subAdmins.map((admin, index) => (
//               <tr key={index}>
//                 <td style={styles.tableCell}>{index + 1}</td>
//                 <td style={styles.tableCell}>{admin.name}</td>
//                 <td style={styles.tableCell}>{admin.email}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: "700px",
//     margin: "50px auto",
//     padding: "30px",
//     borderRadius: "10px",
//     backgroundColor: "#f9f9f9",
//     boxShadow: "0 0 12px rgba(0,0,0,0.1)",
//     textAlign: "center",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "15px",
//     marginBottom: "30px",
//   },
//   input: {
//     padding: "10px",
//     fontSize: "16px",
//     borderRadius: "5px",
//     border: "1px solid #ccc",
//   },
//   buttonGroup: {
//     display: "flex",
//     justifyContent: "space-between",
//     gap: "10px",
//     marginTop: "10px",
//   },
//   button: {
//     flex: 1,
//     padding: "10px",
//     fontSize: "16px",
//     cursor: "pointer",
//     backgroundColor: "#de3806ff",
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//   },
//   listSection: {
//     textAlign: "left",
//     marginTop: "40px",
//   },
//   tableHeader: {
//     padding: "10px",
//     borderBottom: "2px solid #ccc",
//     backgroundColor: "#eee",
//     textAlign: "left",
//   },
//   tableCell: {
//     padding: "10px",
//     borderBottom: "1px solid #ddd",
//   },
// };
// export default Subadmin;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Subadmin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [employees, setEmployees] = useState([]);
  const [subAdmins, setSubAdmins] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = JSON.parse(
    localStorage.getItem("employeROyalmadeLogin")
  )?.token;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRegister = async (e, type) => {
    e.preventDefault();

    // Validate fields before submitting
    const { name, email, password } = formData;
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please fill all the fields before submitting.");
      return;
    }

    setIsSubmitting(true);

    const confirmMsg = `Are you sure you want to register this as a ${
      type === "employee" ? "Employee" : "SubAdmin"
    }?`;
    const confirmed = window.confirm(confirmMsg);

    if (!confirmed) {
      setIsSubmitting(false); // reset here on cancel
      return;
    }

    const url =
      type === "employee"
        ? `${BASE_URL}/registerEmployee`
        : `${BASE_URL}/registerSubAdmin`;

    try {
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert(
        `${
          type === "employee" ? "Employee" : "SubAdmin"
        } registered successfully!`
      );
      setFormData({ name: "", email: "", password: "" });
      fetchData(); // refresh list
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please check the console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchData = async () => {
    try {
      const [empRes, subRes] = await Promise.all([
        axios.get(`${BASE_URL}/GetAllEmployee`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/GetAllSubAdmin`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setEmployees(empRes.data);
      setSubAdmins(subRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={styles.container}>
      <h2>User Registration</h2>
      <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <div style={styles.passwordContainer}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <span
            onClick={togglePasswordVisibility}
            style={styles.eyeIcon}
            role="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <span style={{ color: "red" }}>
          Note:
          <ol>
            <li>
              Password add carefully and remember that password because password
              is not show in below list
            </li>
            <li>Password set in same format for remember</li>
          </ol>
        </span>
        <div style={styles.buttonGroup}>
          <button
            type="button"
            style={styles.button}
            onClick={(e) => handleRegister(e, "employee")}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register Employee"}
          </button>
          <button
            type="button"
            style={styles.button}
            onClick={(e) => handleRegister(e, "subadmin")}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register SubAdmin"}
          </button>
        </div>
      </form>

      <div style={styles.listSection}>
        <h3>All Employees</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>#</th>
              <th style={styles.tableHeader}>Name</th>
              <th style={styles.tableHeader}>Email</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={index}>
                <td style={styles.tableCell}>{index + 1}</td>
                <td style={styles.tableCell}>{emp.name}</td>
                <td style={styles.tableCell}>{emp.email}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 style={{ marginTop: "40px" }}>All SubAdmins</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>#</th>
              <th style={styles.tableHeader}>Name</th>
              <th style={styles.tableHeader}>Email</th>
            </tr>
          </thead>
          <tbody>
            {subAdmins.map((admin, index) => (
              <tr key={index}>
                <td style={styles.tableCell}>{index + 1}</td>
                <td style={styles.tableCell}>{admin.name}</td>
                <td style={styles.tableCell}>{admin.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "700px",
    margin: "50px auto",
    padding: "30px",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 0 12px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "30px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
 
  passwordContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      width: "100%",
    },
    input: {
      padding: "10px 40px 10px 10px", // Adjusted padding to accommodate icon
      fontSize: "16px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      width: "100%",
      boxSizing: "border-box", // Ensures padding doesn't increase width
    },
    eyeIcon: {
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)", // Vertically centers the icon
      cursor: "pointer",
      fontSize: "18px", // Slightly smaller for better fit
      color: "#666",
      display: "flex",
      alignItems: "center",
      padding: "5px", // Adds clickable area
    },
 
  
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    marginTop: "10px",
  },
  button: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#de3806ff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
  },
  listSection: {
    textAlign: "left",
    marginTop: "40px",
  },
  tableHeader: {
    padding: "10px",
    borderBottom: "2px solid #ccc",
    backgroundColor: "#eee",
    textAlign: "left",
  },
  tableCell: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
};

export default Subadmin;
