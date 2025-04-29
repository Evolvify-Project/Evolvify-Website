import React from "react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();

  const hideNavbarFooter = [
    "/login",
    "/signup",
    "/forget-password",
    "/Chatbot",
    "/Quiz",
    "/result",
    "/recommended-plan",
    "/payment",
  ].some((route) => location.pathname.startsWith(route));

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      <Outlet />
      {!hideNavbarFooter && <Footer />}
    </>
  );
}
