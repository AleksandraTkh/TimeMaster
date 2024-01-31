import Header from "../components/header";
import RegistrationForm from "../components/RegistrationForm";
import { Link } from "react-router-dom";
import Footer from "../components/footer.js";

const handleRegister = (userData) => {
  fetch("http://localhost:3001/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("User registered:", data);
    })
    .catch((error) => {
      console.error("Registration failed:", error);
    });
};

//---------------------------------------------Component----------------------

const Registration = () => {
  return (
    <div>
      {" "}
      <Header />
      <RegistrationForm onRegister={handleRegister} />
      <p className="create-account">
        Already have an account? <Link to="/home">Sign in!</Link>
      </p>
      <div className="gap"></div>
      <Footer />
    </div>
  );
};
export default Registration;
