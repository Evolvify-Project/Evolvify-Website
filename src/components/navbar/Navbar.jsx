// Import necessary tools and libraries
import React, { useState, useEffect, useRef } from "react";
import logoDark from "../../assets/images/logo.png";
import logoLight from "../../assets/images/light-logo.png";
import placeHolderImg from "../../assets/images/placeholder-vector.jpg";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react"; // Icons
import axios from "axios";

// Define Navbar component
export default function Navbar() {
  // States for controlling component visibility
  const [isOpen, setIsOpen] = useState(false); // Mobile menu
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Login status
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Profile dropdown
  const [profileImage, setProfileImage] = useState(placeHolderImg); // Profile image
  const [isScrolled, setIsScrolled] = useState(false); // Scroll status
  const [navbarColor, setNavbarColor] = useState(false); // Background color on scroll
  const navigate = useNavigate(); // For navigation
  const dropdownRef = useRef(null); // Reference for dropdown to close on outside click

  // Toggle mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);

  // Toggle profile dropdown
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Validate URL
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Check login status and fetch profile image
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsLoggedIn(!!token); // Set login status based on token

    if (token) {
      axios
        .get("https://evolvify.runasp.net/api/Accounts/userProfile", {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          let imageUrl = response.data?.imageUrl;
          // Add server URL if the link is not complete
          if (imageUrl && !isValidUrl(imageUrl)) {
            imageUrl = `https://evolvify.runasp.net${imageUrl}`;
          }
          // Set profile image if URL is valid, else use placeholder
          if (imageUrl && isValidUrl(imageUrl)) {
            setProfileImage(imageUrl);
          } else {
            setProfileImage(placeHolderImg);
          }
        })
        .catch((error) => {
          console.error("Error fetching profile image:", error);
          setProfileImage(placeHolderImg);
        });
    }
  }, []);

  // Control background color on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
      setNavbarColor(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
    setProfileImage(placeHolderImg);
    setIsDropdownOpen(false);
    navigate("./login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      {/* Navbar */}
      <nav
        className={`p-5 shadow-md transition-all duration-300 ${
          navbarColor ? "bg-darkBlue text-white" : "bg-slate-100 text-gray-800"
        } ${
          isScrolled ? "md:fixed md:top-0 md:w-full md:z-50 md:shadow-lg" : ""
        }`}
      >
        <div className="container mx-auto flex items-center justify-between gap-4">
          {/* Website logo */}
          <Link to="./">
            <img
              src={navbarColor ? logoLight : logoDark}
              alt="evolvify logo"
              className="w-36 sm:w-48 h-auto"
            />
          </Link>

          {/* Page links (desktop view) */}
          <ul className="hidden md:flex gap-8 items-center">
            {[
              "Home",
              "Courses",
              "Practice",
              "Community",
              "Chatbot",
              "EvolviSense",
            ].map((item) => (
              <li key={item}>
                <NavLink
                  to={
                    item === "EvolviSense"
                      ? "./presentation-test"
                      : `./${item.toLowerCase()}`
                  }
                  className={({ isActive }) =>
                    `inline-block pb-2 relative before:content-[''] before:absolute before:w-0 before:h-0.5 before:rounded-md before:left-0 before:-bottom-1 before:transition-[width] before:duration-300 ${
                      isActive
                        ? "before:w-full before:bg-[#64B5F6]" // Green underline for active link
                        : "hover:before:w-full hover:before:bg-[#64B5F6]" // Blue underline on hover for non-active links
                    } ${navbarColor ? "text-white" : "text-[#233A66]"}`
                  }
                >
                  {item}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Profile or register button (desktop view) */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile image and arrow */}
                <div className="flex items-center gap-2">
                  <button
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#64B5F6] focus:outline-none"
                    onClick={toggleDropdown}
                  >
                    <img
                      src={profileImage}
                      alt="User profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = placeHolderImg;
                      }}
                    />
                  </button>
                  <ChevronDown
                    size={23}
                    className={`cursor-pointer transition-transform duration-200 ${
                      navbarColor ? "text-white" : "text-[#233A66]"
                    } ${isDropdownOpen ? "rotate-180" : ""}`}
                    onClick={toggleDropdown}
                  />
                </div>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-48 border border-gray-200 rounded-md shadow-lg z-10 ${
                      navbarColor
                        ? "bg-slate-100 text-[#233A66]"
                        : "bg-[#233A66] text-white"
                    }`}
                  >
                    <ul className="py-1">
                      <li>
                        <NavLink
                          to="./dashboard"
                          className={`block px-4 py-2 rounded-md text-md ${
                            navbarColor
                              ? "hover:bg-gray-300"
                              : "hover:bg-sky-950"
                          }`}
                          onClick={() => {
                            setIsOpen(false);
                            setIsDropdownOpen(false);
                          }}
                        >
                          Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className={`w-full text-left px-4 py-2 rounded-md text-md ${
                            navbarColor
                              ? "hover:bg-red-500"
                              : "hover:bg-red-500"
                          }`}
                        >
                          <i className="fa-solid fa-right-from-bracket mr-4 sm:mr-2"></i>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="./signup">
                  <button className="w-32 h-10 bg-gradient-to-r from-[#233A66] to-blue-500 rounded-3xl text-white hover:opacity-75 transition">
                    Register
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle button */}
          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {isOpen ? (
                <i className="fas fa-times text-2xl sm:text-xl text-darkBlue hover:text-red-500 transition-all duration-500 hover:rotate-180" />
              ) : (
                <i className="fas fa-bars text-2xl text-darkBlue sm:text-xl transition-transform duration-300 hover:rotate-180" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-4 px-4">
            <ul className="flex flex-col gap-4">
              {[
                "Home",
                "Courses",
                "Practice",
                "Community",
                "Chatbot",
                "EvolviSense",
              ].map((item) => (
                <li key={item}>
                  <NavLink
                    to={
                      item === "EvolviSense"
                        ? "./presentation-test"
                        : `./${item.toLowerCase()}`
                    }
                    className={({ isActive }) =>
                      `block pb-1 border-b  ${
                        isActive
                          ? "border-[#64B5F6]" // Green underline for active link
                          : `border-transparent ${
                              navbarColor ? "text-white" : "text-gray-800"
                            } hover:border-[#64B5F6]` // Blue underline on hover, white text when scrolled
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </NavLink>
                </li>
              ))}

              {/* Register or logout options based on login status */}
              {!isLoggedIn ? (
                <li>
                  <Link to="./signup" onClick={() => setIsOpen(false)}>
                    <button className="w-full h-10 bg-gradient-to-r from-[#233A66] to-blue-500 rounded-3xl text-white">
                      Register
                    </button>
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <NavLink
                      to="./dashboard"
                      className={({ isActive }) =>
                        `block pb-1 border-b ${
                          isActive
                            ? "border-[#64B5F6]"
                            : `border-transparent ${
                                navbarColor ? "text-white" : "text-gray-800"
                              } hover:border-[#64B5F6]`
                        }`
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className={`w-full text-left pb-1 border-b border-transparent ${
                        navbarColor ? "text-white" : "text-gray-800"
                      } hover:border-[#64B5F6]`}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>

      {/* Placeholder div for padding when navbar is fixed */}
      <div className={`${isScrolled ? "md:pt-20 hidden md:block" : ""}`}></div>
    </>
  );
}
