import React from "react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { Outlet, useLocation } from "react-router-dom";

const basePath = import.meta.env.VITE_BASE_PATH || "";

export default function Layout() {
  const location = useLocation();
  const pathname = location.pathname.replace(basePath, "");

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
    ].some((route) => pathname.startsWith(route)) ||
    /^\/skills\/[^/]+\/assessment$/.test(pathname);

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      <Outlet />
      {!hideNavbarFooter && <Footer />}
    </>
  );
}
