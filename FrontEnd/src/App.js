import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Registration from "./pages/registration";
import UserDetailsPage from "./pages/userDetailsPage";

const App = () => {
  const currentUrl = window.location.href;
  if (currentUrl.endsWith("/")) {
    const newUrl = `${currentUrl}home`;
    window.location.href = newUrl;
  }
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="home" element={<Home />} />
          <Route path="registration" element={<Registration />} />
          <Route path="userDetailsPage" element={<UserDetailsPage />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
