import { useNavigate } from "react-router-dom";
import "./styles/Header.scss";
import logo from "../assets/logoHitek2.png";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="header">
      <div className="logo-container" onClick={() => navigate("/")}>
        <img src={logo} alt="Logo" className="logo" />
      </div>
    </div>
  );
};

export default Header;
