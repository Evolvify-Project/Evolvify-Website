import React from "react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();

  const hideNavbarFooter =
    [
      "/login",
      "/signup",
      "/forget-password",
      "/chatbot",
      "/Quiz",
      "/result",
      "/recommended-plan",
      "/payment",
      "/dashboard",
    ].some((route) => location.pathname.startsWith(route)) ||
    /^\/skills\/[^/]+\/assessment$/.test(location.pathname); ;

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      <Outlet />
      {!hideNavbarFooter && <Footer />}
    </>
  );
}
