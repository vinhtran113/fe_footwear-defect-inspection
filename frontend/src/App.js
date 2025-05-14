import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from './context/auth-context';

import MainLayout from './layout/MainLayout';
import HomeLayout from "./layout/HomeLayout";
import ApplicationLayout from "./layout/ApplicationLayout";

import LoginPage from './pages/LoginPage';
import HomePage from "./pages/HomePage";
import WebcamPage from "./pages/WebcamPage";
import ContactPage from "./pages/ContactPage";
import UploadImagePage from "./pages/UploadImagePage";

const getCookieValue = (name) => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
};

const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

const removeCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

const App = () => {
  const [authState, setAuthState] = useState(() => {
    const stored = getCookieValue("isLoggedIn");
    return {
      isLoggedIn: stored === "true" ? true : false,
    };
  });

  // Hàm đăng nhập - đặt cookie với thời hạn 7 ngày
  const login = useCallback(() => {
    setCookie("isLoggedIn", "true", 7); // Lưu cookie trong 7 ngày
    setAuthState({ isLoggedIn: true });
  }, []);

  // Hàm đăng xuất - xóa cookie
  const logout = useCallback(() => {
    removeCookie("isLoggedIn");
    setAuthState({ isLoggedIn: false });
  }, []);

  let routes;
  if (authState.isLoggedIn) {
    routes = (
      <Routes>
        <Route path="/hitek-solution" element={<HomeLayout />}>
          <Route path="home" element={<HomePage />} />
          <Route path="application" element={< ApplicationLayout />} >
            <Route path='webcam' element={<WebcamPage />} />
            <Route path='upload-image' element={<UploadImagePage />} />
          </Route>
          <Route path="contact" element={<ContactPage />} />
        </Route>
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/login" element={<MainLayout />}>
          <Route index element={<LoginPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
      }}
    >
      <Router>
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
