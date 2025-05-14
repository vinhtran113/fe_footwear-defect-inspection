import { Outlet } from "react-router-dom";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import "./styles/MainLayout.scss";

const MainLayout = () => {

  return (
    <div className="layout">
      <Header className="header" />
      <main className="content">
        <Outlet />
      </main>
      <Footer className="footer" />

    </div>
  );
};

export default MainLayout;
