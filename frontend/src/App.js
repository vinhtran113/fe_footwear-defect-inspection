import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from './context/auth-context';
import { decodeToken, checkExpireToken, getCookieValue } from './utils/token';


import MainLayout from './layout/MainLayout';
import HomeLayout from "./layout/HomeLayout";
import ApplicationLayout from "./layout/ApplicationLayout";

import LoginPage from './pages/LoginPage';
import HomePage from "./pages/HomePage";
import WebcamPage from "./pages/WebcamPage";
import ContactPage from "./pages/ContactPage";
import UploadImagePage from "./pages/UploadImagePage";

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
    const stored = sessionStorage.getItem("authState");
    const parsed = stored ? JSON.parse(stored) : null;

    return {
      isLoggedIn: parsed?.isLoggedIn || false,
      refreshToken: parsed?.refreshToken || null,
    };
  });


  const login = useCallback((accessToken, refreshToken) => {
    setCookie("accessToken", accessToken);
    setAuthState({ isLoggedIn: true, refreshToken });
    console.log(refreshToken);
    console.log(accessToken);
    sessionStorage.setItem('authState', JSON.stringify({ refreshToken, isLoggedIn: true }));
  }, []);


  const logout = useCallback(() => {
    removeCookie("accessToken");
    setAuthState({ isLoggedIn: false, refreshToken: null });
    sessionStorage.removeItem('authState')
  }, []);

  useEffect(() => {
    const accessToken = getCookieValue("accessToken");
    if (accessToken) {
      const { exp } = decodeToken(accessToken);
      console.log(checkExpireToken(exp));
      if (!checkExpireToken(exp)) {
        logout();
      }
    }
  }, [logout]);

  let routes;
  if (authState.isLoggedIn) {
    routes = (
      <Routes>
        <Route path="/hitek-solution" element={<HomeLayout />}>
          <Route path="home" element={<HomePage />} />
          <Route path="application" element={< ApplicationLayout />} >
            <Route path='live-detection' element={<WebcamPage />} />
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
