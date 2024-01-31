import { Link } from "react-router-dom";
import "../styles/header.css";

const Header = () => {
  return (
    <header>
      <Link to="/home" className="header-link">
        <h1>Time Master</h1>
      </Link>
      <nav>
        <ul>
          <li>
            <Link to="/home">Log In</Link>
          </li>
          <li>
            <Link to="/registration">Registration</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
