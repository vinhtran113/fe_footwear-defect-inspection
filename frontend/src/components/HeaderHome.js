import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import './styles/HeaderHome.scss';
import logo from "../assets/logoHitek.png";
import header_background from "../assets/header_background.jpg";
import { AuthContext } from '../context/auth-context';

const title = [
  { label: 'home', value: 'HitekAI', subtile: 'PHẦN MỀM PHÁT HIỆN LỖI THÔNG MINH TRONG DÂY CHUYỀN SẢN XUẤT GIÀY DÉP' },
  { label: 'application', value: 'ỨNG DỤNG PHÁT HIỆN LỖI', sutile: '' },
  { label: 'contact', value: 'LIÊN HỆ VỚI CHÚNG TÔI', sutile: '' },
]
const HeaderHome = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname.replace('/hitek-solution/', '');
  console.log(currentPath);
  const handleLogout = () => {
    auth.logout();
    navigate('/');
  };

  const handleLoadLink = (value) => {
    navigate(`/hitek-solution/${value}`);
    window.location.reload();
  };

  const handleShowTitle = (value) => {
    console.log(title.find((item) => value.includes(item.label)));
    return title.find((item) => value.includes(item.label));
  };

  return (
    <div className="hitek-header">
      {/* Navigation Bar */}
      <div className="navbar">
        {/* Logo */}
        <div
          className="logo"
          onClick={() => handleLoadLink("home")}
        >
          <div className="logo__quote">
            <img src={logo} alt="Logo" />
          </div>
          <div className="logo__text">Hitek Solution</div>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-menu">
          <div
            className={`nav-menu__item ${currentPath === "application" ? "active" : ""}`}
            onClick={() => handleLoadLink("application")}
          >
            Ứng dụng
          </div>
          <div
            className={`nav-menu__item ${currentPath === "contact" ? "active" : ""}`}
            onClick={() => handleLoadLink("contact")}
          >
            Liên hệ
          </div>
          <div className="nav-menu__logout"
            onClick={() => handleLogout()}>
            <LogOut size={24} />
          </div>
        </div>
      </div>


      {/* Banner Section */}
      <div className="banner">
        <img src={header_background} alt="Banner Background" className="banner__background" />
        <div className="banner__pattern">
          <h1 className="banner__title">{handleShowTitle(currentPath).value}</h1>
          <div className="banner__divider"></div>
          {handleShowTitle(currentPath).subtile !== '' && <p className="banner__subtitle">{handleShowTitle(currentPath).subtile}</p>}
        </div>
      </div>
    </div>
  );
};

export default HeaderHome;