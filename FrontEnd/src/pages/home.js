import Header from "../components/header";
import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserDetailsPage from "../pages/userDetailsPage";
import "../styles/pages/home.css";
import Footer from "../components/footer.js";

const Home = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (userData) => {
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const user = await response.json();
        setLoggedInUser(user);
        navigate("/user-details");
      } else {
        const data = await response.json();
        console.error("Login failed:", data.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  //------------------------------------------Component----------------------------------

  return (
    <div>
      {" "}
      <Header />
      {loggedInUser ? (
        <UserDetailsPage user={loggedInUser} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
      <p className="create-account">
        Don't have an account? <Link to="/registration">Create account!</Link>
      </p>
      <Footer />
    </div>
  );
};

export default Home;
