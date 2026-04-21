import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "../../styles/GeneralPortal.css";  // portal styles
import "../../App.css";                   // general site styles

import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import Guidelines from "./Guidelines";
import Login from "./Login";
import Register from "./Register";
import Notices from "./Notices";
import GNav from "../../components/General/GNav";
import Topbar from "../../components/General/Topbar";

export default function GeneralPortal() {
  return (
    <>

      <GNav />

      <Routes>
        {/* Default page */}
        <Route path="/" element={<Home />} />

        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="guidelines" element={<Guidelines />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="notices" element={<Notices />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}