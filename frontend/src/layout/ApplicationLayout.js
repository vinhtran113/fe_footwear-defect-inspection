import { Outlet } from "react-router-dom";
import MenuApp from "../components/MenuApp";
import "./styles/ApplicationLayout.scss";

const AccountSettingLayout = () => {
  return (
    <div className="layout-account">
      <MenuApp className="menu-bar" />
      <main className="content-account">
        <Outlet />
      </main>
    </div>
  );
}

export default AccountSettingLayout;
