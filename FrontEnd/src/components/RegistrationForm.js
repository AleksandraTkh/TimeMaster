import React, { useState } from "react";
import "../styles/RegistrationForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const RegistrationForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleRegister = async () => {
    try {
      if (password.length < 8) {
        setRegistrationError("Password should be at least 8 characters long.");
        return;
      } else {
        setRegistrationError(null);
      }

      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        setRegistrationSuccess("Registered successfully!");
        console.log("User registered successfully!");
        setRegistrationError(null);
      } else {
        const data = await response.json();
        if (data.error && data.error.includes("already exists")) {
          setRegistrationError(
            "Email already exists. Please choose a different one."
          );
        } else {
          setRegistrationError("Registration failed. Please try again.");
        }
        console.error("Registration failed:", data.error);
      }
    } catch (error) {
      setRegistrationError("Error during registration.");
      console.error("Error during registration:", error);
    }
  };

  //----------------------------------------------Component-------------------------------------

  return (
    <div className="registration-box">
      <h2>Create Account</h2>
      <label className="registration-label"> Your Name:</label>
      <input
        placeholder="John Doe"
        className="registration-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <label className="registration-label"> Email:</label>
      <input
        placeholder="example@gmail.com"
        className="registration-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <label className="registration-label">Password:</label>
      <div className="password-input-container">
        <input
          placeholder="Create Your Password"
          className="registration-input"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="eye-icon-container">
          <FontAwesomeIcon
            icon={showPassword ? faEye : faEyeSlash}
            className={`eye-icon-reg ${showPassword ? "visible" : ""}`}
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>
      </div>
      {registrationError && (
        <p className="error-message">{registrationError}</p>
      )}

      <button className="registration-button" onClick={handleRegister}>
        Sign up
      </button>

      {registrationSuccess && (
        <p className="success-message">{registrationSuccess}</p>
      )}
    </div>
  );
};

export default RegistrationForm;
