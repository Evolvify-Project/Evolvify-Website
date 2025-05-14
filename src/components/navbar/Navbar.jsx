import React, { useState, useEffect, useRef } from "react";
import logo from "../../assets/images/logo.png";
import placeHolderImg from "../../assets/images/placeholder-vector.jpg";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import axios from "axios";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State للدروب داون
  const [profileImage, setProfileImage] = useState(placeHolderImg); // صورة ديفولت
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Ref للـ dropdown والزرار

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // دالة للتحقق من صحة الرابط
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // التحقق من تسجيل الدخول وجلب صورة البروفايل
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsLoggedIn(!!token);

    // جلب صورة البروفايل من الـ API
    if (token) {
      axios
        .get("https://evolvify.runasp.net/api/Accounts/userProfile", {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // افتراضي إن الـ API بيرجّع الصورة في حقل imageUrl
          let imageUrl = response.data?.imageUrl;
          // لو الرابط مش كامل (relative)، نضيف الـ base URL
          if (imageUrl && !isValidUrl(imageUrl)) {
            imageUrl = `https://evolvify.runasp.net${imageUrl}`; // إضافة الـ base URL
          }
          // لو الرابط صحيح، نستخدمه، وإلا نستخدم الصورة الديفولت
          if (imageUrl && isValidUrl(imageUrl)) {
            setProfileImage(imageUrl);
          } else {
            setProfileImage(placeHolderImg);
          }
        })
        .catch((error) => {
          console.error("Error fetching profile image:", error);
          setProfileImage(placeHolderImg); // لو حصل خطأ، نستخدم الصورة الديفولت
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
    setProfileImage(placeHolderImg); // إعادة الصورة للديفولت بعد الـ Logout
    setIsDropdownOpen(false); // إغلاق الدروب داون بعد الـ Logout
    navigate("./login");
  };

  // إغلاق الدروب داون عند الضغط خارج المنطقة
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // إضافة event listener عند فتح الدروب داون
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // إزالة event listener عند إغلاق الدروب داون
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <nav className="p-5 shadow-md bg-slate-100">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <Link to="./">
          <img src={logo} alt="evolvify logo" className="w-36 sm:w-48" />
        </Link>

        {/* Desktop Menu */}
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
                  isActive
                    ? "text-primary-600 relative inline-block pb-2 before:content-[''] before:absolute before:w-full before:h-0.5 before:bg-sky-500 before:left-0 before:-bottom-1 hover:before:w-full before:transition-[width] before:duration-300"
                    : "text-primary-600 inline-block pb-2 before:w-0"
                }
              >
                {item}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Side: User Icon or Dashboard and Logout */}
        <div className="hidden md:block">
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center gap-2">
                <button
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-sky-500 focus:outline-none"
                  onClick={toggleDropdown}
                >
                  <img
                    src={profileImage}
                    alt="User profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = placeHolderImg; // صورة ديفولت لو الصورة فشلت في التحميل
                    }}
                  />
                </button>
                <ChevronDown
                  size={23}
                  className={`text-[#233A66] cursor-pointer transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  onClick={toggleDropdown}
                />
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#233A66] border border-gray-200 rounded-md shadow-lg z-10">
                  <ul className="py-1">
                    <li>
                      <NavLink
                        to="./dashboard"
                        className="block px-4 py-2 rounded-md text-md text-white hover:bg-sky-950"
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
                        className="w-full text-left px-4 py-2 rounded-md text-md text-white hover:bg-red-500"
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
                <button className="w-24 h-10 bg-gradient-to-r from-sky-900 to-blue-500 rounded-3xl text-white hover:opacity-90 transition">
                  Register
                </button>
              </Link>

              <Link to="./login">
                <button className="w-24 h-10 bg-gradient-to-r from-sky-900 to-blue-500 rounded-3xl text-white hover:opacity-90 transition">
                  Login
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Hamburger Menu (Mobile) */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
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
                    isActive
                      ? "text-sky-600 block pb-1 border-b border-sky-500"
                      : "text-gray-800 block pb-1"
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </NavLink>
              </li>
            ))}

            {/* Auth Buttons in Mobile */}
            {!isLoggedIn && (
              <>
                <li>
                  <Link to="./signup" onClick={() => setIsOpen(false)}>
                    <button className="w-full h-10 bg-gradient-to-r from-sky-900 to-blue-500 rounded-3xl text-white">
                      Register
                    </button>
                  </Link>
                </li>
                <li>
                  <Link to="./login" onClick={() => setIsOpen(false)}>
                    <button className="w-full h-10 bg-gradient-to-r from-sky-900 to-blue-500 rounded-3xl text-white">
                      Login
                    </button>
                  </Link>
                </li>
              </>
            )}
            {isLoggedIn && (
              <>
                <li>
                  <NavLink
                    to="./dashboard"
                    className={({ isActive }) =>
                      isActive
                        ? "text-sky-600 block pb-1 border-b border-sky-500"
                        : "text-gray-800 block pb-1"
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-gray-800 block pb-1"
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
  );
}
