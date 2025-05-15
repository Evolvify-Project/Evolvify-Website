// استيراد الأدوات والمكتبات الضرورية
import React, { useState, useEffect, useRef } from "react";
import logoDark from "../../assets/images/logo.png";
import logoLight from "../../assets/images/light-logo.png";
import placeHolderImg from "../../assets/images/placeholder-vector.jpg";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react"; // أيقونات
import axios from "axios";

// تعريف كمبوننت Navbar
export default function Navbar() {
  // حالات (States) للتحكم في عرض المكونات المختلفة
  const [isOpen, setIsOpen] = useState(false); // للقائمة الجانبية في الموبايل
  const [isLoggedIn, setIsLoggedIn] = useState(false); // حالة تسجيل الدخول
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // القائمة المنسدلة للبروفايل
  const [profileImage, setProfileImage] = useState(placeHolderImg); // صورة البروفايل
  const [isScrolled, setIsScrolled] = useState(false); // هل المستخدم عمل scroll
  const [navbarColor, setNavbarColor] = useState(false); // تغيير لون الخلفية عند السكروول
  const navigate = useNavigate(); // للتنقل بين الصفحات
  const dropdownRef = useRef(null); // مرجع للقائمة المنسدلة عشان نقدر نقفلها لما نضغط براها

  // دالة لتبديل عرض القائمة الجانبية في الموبايل
  const toggleMenu = () => setIsOpen(!isOpen);

  // دالة لتبديل فتح/غلق القائمة المنسدلة للبروفايل
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // التحقق إذا كان الرابط صحيح
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
    setIsLoggedIn(!!token); // إذا فيه توكن، المستخدم مسجل دخول

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
          // إذا الرابط مش كامل نضيف رابط السيرفر
          if (imageUrl && !isValidUrl(imageUrl)) {
            imageUrl = `https://evolvify.runasp.net${imageUrl}`;
          }
          // لو الرابط سليم نحط الصورة، غير كده نرجع للصورة الافتراضية
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

  // التحكم في لون الخلفية عند التمرير (scroll)
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

  // دالة تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
    setProfileImage(placeHolderImg);
    setIsDropdownOpen(false);
    navigate("./login");
  };

  // إغلاق القائمة المنسدلة إذا المستخدم ضغط براها
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
      {/* شريط التنقل */}
      <nav
        className={`p-5 shadow-md transition-all duration-300 ${
          navbarColor ? "bg-darkBlue text-white" : "bg-slate-100 text-gray-800"
        } ${
          isScrolled ? "md:fixed md:top-0 md:w-full md:z-50 md:shadow-lg" : ""
        }`}
      >
        <div className="container mx-auto flex items-center justify-between gap-4">
          {/* شعار الموقع */}
          <Link to="./">
            <img
              src={navbarColor ? logoLight : logoDark}
              alt="evolvify logo"
              className="w-36 sm:w-48 h-auto"
            />
          </Link>

          {/* روابط الصفحات (في الشاشات الكبيرة) */}
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
                    `inline-block pb-2 relative before:content-[''] before:absolute before:w-0 before:h-0.5 before:bg-[#64B5F6] before:rounded-md before:left-0 before:-bottom-1 before:transition-[width] before:duration-300 hover:before:w-full ${
                      isActive ? "before:w-full" : ""
                    } ${navbarColor ? "text-white" : "text-[#233A66]"}`
                  }
                >
                  {item}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* زر البروفايل أو التسجيل (في الشاشات الكبيرة) */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                {/* صورة البروفايل والسهم */}
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

                {/* القائمة المنسدلة */}
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

          {/* زر فتح القائمة الجانبية في الموبايل */}
          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* القائمة الجانبية في الموبايل */}
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

              {/* خيارات تسجيل أو تسجيل خروج حسب الحالة */}
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

      {/* عنصر وهمي عشان يعمل padding لما الـ navbar يبقى ثابت */}
      <div className={`${isScrolled ? "md:pt-20 hidden md:block" : ""}`}></div>
    </>
  );
}
