// import React, { useState } from "react";
// import "../Login/Login.css";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// // import { BASE_URL } from "../../config";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { BASE_URL } from "../config";
// function Login() {
//   const navigate = useNavigate();
//   const [loginEmail, setLoginEmail] = useState("");
//   const [loginPassword, setLoginPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   // Handle the login form submission
//   async function handleLoginForm(e) {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${BASE_URL}/auth/login`, {
//         email: loginEmail,
//         password: loginPassword,
//       });

//       console.log(response);

//       // Extract role and token from the response
//       const role =
//         response.data.employee?.role?.[0]?.roleName ||
//         response.data.admin?.role?.[0]?.roleName ||
//         response.data.appUser?.role?.[0]?.roleName;
//       const token = response.data.jwtToken;

//       console.log("Token:", token);
//       console.log("Role:", role);

//       if (role && token) {
//         const roleJwt = {
//           role,
//           token,
//         };
//         localStorage.setItem("employeROyalmadeLogin", JSON.stringify(roleJwt));

//         if (response.status === 200) {
//           alert("Login Successfull")
//           navigate("/");
//         }else{
//           alert("Check Email And Password")
//         }
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//     }
//   }

//   return (
//     <>
//    <div className="login_main_wrapper">
//       <div className="login_container">
//         <div className="login_heading">Log In</div>
//         <form className="login_form" onSubmit={handleLoginForm}>
//           <input
//             required
//             className="login_input"
//             type="email"
//             name="email"
//             id="email"
//             placeholder="E-mail"
//             value={loginEmail}
//             onChange={(e) => setLoginEmail(e.target.value)}
//           />

//           <div className="password_wrapper">
//             <input
//               required
//               className="login_input password_input"
//               type={showPassword ? "text" : "password"}
//               name="password"
//               id="password"
//               placeholder="Password"
//               value={loginPassword}
//               onChange={(e) => setLoginPassword(e.target.value)}
//             />
//             <span
//               className="eye_icon"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </span>
//           </div>

//           <input className="login-button" type="submit" value="Log In" />
//         </form>
//       </div>
//     </div>

//     </>
//   );
// }

// export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../Login/Login.css";
import { BASE_URL } from "../config";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      console.log(response);

      // Extract role and token from the response
      const role =
        response.data.employee?.role?.[0]?.roleName ||
        response.data.admin?.role?.[0]?.roleName ||
        response.data.subAdmin?.role?.[0]?.roleName ||
        response.data.superisor?.role?.[0]?.roleName;
      const token = response.data.jwtToken;

      console.log("Token:", token);
      console.log("Role:", role);

      if (role && token) {
        const roleJwt = {
          role,
          token,
        };
        localStorage.setItem("employeROyalmadeLogin", JSON.stringify(roleJwt));

        if (response.status === 200) {
          alert("Login Successful");
          navigate("/");
        } else {
          alert("Check Email And Password");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Check Email And Password");
    }
  };

  return (
    <div className="login_main_wrapper">
      <div className="loginLoginBox">
        <p className="loginLoginHead">Login</p>
        <form onSubmit={handleSubmit}>
          <div className="loginUserBox">
            <input
              required
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <label>Email</label>
          </div>
          <div className="loginUserBox">
            <input
              required
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
            />
            <label>Password</label>
            <span
              className="loginEyeIcon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className="loginSubmitButton">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
