import axios from "axios";
import { useFormik } from "formik";
import { object, ref, string } from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import studentLearningImg from "../../src/assets/images/Learning-rafiki.svg";
import logo from "../assets/images/logo.png";
import googleLogo from "../assets/images/google-logo.png";
import faceboogLogo from "../assets/images/facebook-logo.png";

export default function Signup() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");

  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

  const validationSchema = object({
    name: string()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(20, "Name cannot be more than 20 characters"),

    email: string().required("Email is required").email("Email is invalid"),

    password: string()
      .required("Password is required")
      .matches(
        passwordRegex,
        "Password must have at least 8 characters, one uppercase, one lowercase, one number, and one special character"
      ),

    rePassword: string()
      .required("Confirm Password is required")
      .oneOf([ref("password")], "Password and confirm password should match"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
    },

    validationSchema,

    onSubmit: async function (values) {
      try {
        setApiError("");
        const response = await axios.post(
          "https://evolvify.runasp.net/api/Accounts/register",
          {
            username: values.name,
            email: values.email,
            password: values.password,
            confirmPassword: values.rePassword,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API Response:", response.data);

        if (response.data.success) {
          navigate("/home");
        } else {
          setApiError(
            response.data.message || "Signup failed. Please try again."
          );
        }
      } catch (error) {
        setApiError(
          error.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      }
    },
  });

  return (
    <section className="bg-[linear-gradient(to_right,#1E3A5F,#67B4FF)] min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 flex">
        <div className="flex flex-col lg:flex-row w-full">
          {/* Left Section */}
          <div className="LeftSection w-full lg:w-1/2 rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none bg-blue-100 flex flex-col items-start justify-start p-4 md:p-6 relative">
            <button
              onClick={() => navigate(-1)}
              className="arrow-left text-gray-500 hover:text-gray-900 absolute top-4 left-4 text-2xl"
            >
              <i className="fa-solid fa-arrow-left-long"></i>
            </button>

            <div className="EvolvifyLogo absolute top-6 left-1/2 transform -translate-x-1/2">
              <img
                src={logo}
                alt="Evolvify Logo"
                className="w-28 md:w-40 pt-8"
              />
            </div>

            <div className="image flex justify-center items-center w-full h-[90vh]">
              <img
                src={studentLearningImg}
                alt="Login Illustration"
                className="w-64 md:w-96 max-w-full"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="RightSection w-full lg:w-1/2 lg:h-[730px] rounded-b-3xl lg:rounded-r-3xl lg:rounded-bl-none bg-white shadow-lg py-6 md:py-9 px-4 md:px-6">
            <div className="header text-center py-3">
              <h1 className="text-xl md:text-2xl font-bold text-blue-400">
                Welcome to Evolvify
              </h1>
              <p className="text-gray-500 text-sm md:text-base">
                Let's create your profile
              </p>
            </div>

            <form
              className="space-y-4 py-6 md:py-10 flex flex-col items-center justify-center"
              onSubmit={formik.handleSubmit}
            >
              {/* Username */}
              <div className="username w-full max-w-sm">
                <input
                  type="text"
                  placeholder="Username"
                  name="name"
                  className="form-control w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.name && formik.touched.name && (
                  <p className="text-red-500 font-medium text-sm mt-1">
                    *{formik.errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="email w-full max-w-sm">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  className="form-control w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.email && formik.touched.email && (
                  <p className="text-red-500 font-medium text-sm mt-1">
                    *{formik.errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="password w-full max-w-sm">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  className="form-control w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.password && formik.touched.password && (
                  <p className="text-red-500 font-medium text-sm mt-1">
                    *{formik.errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="re-password w-full max-w-sm">
                <input
                  type="password"
                  placeholder="Confirm password"
                  name="rePassword"
                  className="form-control w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formik.values.rePassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.rePassword && formik.touched.rePassword && (
                  <p className="text-red-500 font-medium text-sm mt-1">
                    *{formik.errors.rePassword}
                  </p>
                )}
              </div>

              {/* API Error */}
              {apiError && (
                <p className="text-red-600 font-medium text-sm mt-2">
                  {apiError}
                </p>
              )}

              {/* Submit Button */}
              <div className="button flex flex-col space-y-2 justify-center items-center">
                <button
                  type="submit"
                  className="px-6 mt-3 py-3 text-lg md:text-xl w-64 md:w-72 text-white font-bold rounded-full bg-[linear-gradient(to_right,#67B4FF,#1E3A5F)] shadow-md"
                >
                  Sign Up
                </button>
              </div>
            </form>

            {/* Social Login */}
            <div className="icons flex flex-col items-center gap-4">
              <p className="text-gray-600 text-sm md:text-lg font-medium">
                Or sign up with other account
              </p>

              <div className="SocialLoginButtons flex gap-4 md:gap-6">
                <a
                  href="https://www.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-500 p-2 border rounded-lg hover:bg-gray-100 text-sm md:text-base"
                >
                  <img src={googleLogo} alt="logo google" className="w-7 h-7" />
                  Sign up with Google
                </a>

                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-500 p-2 border rounded-lg hover:bg-gray-100 text-sm md:text-base"
                >
                  <img
                    src={faceboogLogo}
                    alt="logo facebook"
                    className="w-6 h-6"
                  />
                  Sign up with Facebook
                </a>
              </div>

              <p className="text-black text-sm md:text-lg">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 font-bold">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
