import React, { useState, useEffect } from 'react';
import logo from '../../assets/images/logo.png';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsLoggedIn(!!token); // true لو فيه توكن
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className='p-5 shadow-md bg-slate-100'>
      <div className='container mx-auto flex items-center justify-between gap-4'>
        <Link to="/">
          <img src={logo} alt="evolvify logo" className='w-36 sm:w-48' />
        </Link>

        {/* Desktop Menu */}
        <ul className='hidden md:flex gap-8 items-center'>
          {["Home", "Courses", "Practice", "Community", "Chatbot"].map((item) => (
            <li key={item}>
              <NavLink
                to={`/${item}`}
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

        {/* Right Side: Register or User Icon */}
        <div className='hidden md:block'>
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <button onClick={handleLogout} className='text-sm text-gray-600 hover:underline'>Logout</button>
              <User className='text-sky-600 cursor-pointer' />
            </div>
          ) : (
            <Link to="/signup">
              <button className='w-32 h-10 bg-gradient-to-r from-sky-900 to-blue-500 rounded-3xl text-white hover:opacity-90 transition'>
                Register
              </button>
            </Link>
          )}
        </div>

        {/* Hamburger Menu (Mobile) */}
        <div className='md:hidden'>
          <button onClick={toggleMenu}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className='md:hidden mt-4 px-4'>
          <ul className='flex flex-col gap-4'>
            {["Home", "Courses", "Practice", "Community", "Chatbot"].map((item) => (
              <li key={item}>
                <NavLink
                  to={`/${item}`}
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
            <li>
              {isLoggedIn ? (
                <button onClick={handleLogout} className='w-full text-left text-sm text-gray-600'>
                  Logout
                </button>
              ) : (
                <Link to="/signup" onClick={() => setIsOpen(false)}>
                  <button className='w-full h-10 bg-gradient-to-r from-sky-900 to-blue-500 rounded-3xl text-white'>
                    Register
                  </button>
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
