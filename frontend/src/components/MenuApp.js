import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/MenuApp.scss"; // Import SCSS

import { Webcam, ImagePlus, FileClock } from "lucide-react";


const menuItems = [
    { path: "/hitek-solution/application/webcam", label: " Sử dụng webcam", icon: <Webcam /> },
    { path: "/hitek-solution/application/upload-image", label: "Tải lên hình ảnh", icon: <ImagePlus /> },
    { path: "/hitek-solution/application/history", label: "Lịch sử ảnh", icon: <FileClock /> },
];
const MenuApp = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = (item) => {
        navigate(item.path);
    }

    return (
        <div className="app-menu">

            <ul className="menu-list">
                {menuItems.map((item) => (
                    <li
                        key={item.label}
                        className={location.pathname === item.path ? "active" : ""}
                        onClick={() => handleClick(item)}
                    >
                        {item.icon} {item.label}
                    </li>
                ))}
            </ul>
        </div >
    );
};

export default MenuApp;
