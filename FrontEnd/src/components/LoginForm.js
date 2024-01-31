import React, { useState } from "react";
import "../styles/LoginForm.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState();
  const [loginError, setLoginError] = useState(false);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setLoginError("Missing email or password.");
        return;
      }

      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();

        setLoggedInUser(user);
        localStorage.setItem("currentUserId", user.user_id);
        onLogin(user);
        navigate("/userDetailsPage", { replace: true });
      } else {
        setLoginError("Incorrect email or password.");
        const data = await response.json();
        console.error("Login failed:", data);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  //--------------------------------------------Component------------------------------------
  return (
    <div className={`login-box ${loginError ? "error" : ""}`}>
      <h2>Log in to an Account</h2>
      <label className="login-label">Email:</label>
      <input
        placeholder="example@gmail.com"
        className={`login-input ${loginError ? "error" : ""}`}
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <label className="login-label">Password:</label>
      <div className="password-input-container">
        <input
          placeholder="Enter Your Password"
          className={`login-input ${loginError ? "error" : ""}`}
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="eye-icon-container">
          <FontAwesomeIcon
            icon={showPassword ? faEye : faEyeSlash}
            className={`eye-icon-login ${showPassword ? "visible" : ""}`}
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>
      </div>
      {loginError && <p className="error-message">{loginError}</p>}

      <button className="login-button" onClick={handleLogin}>
        Sign in
      </button>
    </div>
  );
};
export default LoginForm;
