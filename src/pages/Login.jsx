import axios from "axios";
import { useFormik } from "formik";
import { useNavigate, Link } from "react-router-dom";
import { object, string } from "yup";
import { jwtDecode } from "jwt-decode"; 
import studentLearningImg from "../../src/assets/images/Learning-rafiki.svg";
import logo from "../assets/images/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

  const validationSchema = object({
    email: string().required("Email is required").email("Email is invalid"),
    password: string()
      .required("Password is required")
      .matches(
        passwordRegex,
        "Password | Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character"
      ),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async function (values) {
      try {
        const response = await axios.post(
          "https://evolvify.runasp.net/api/Accounts/login",
          values
        );
        console.log(response.data);

        if (response.data.success) {
          const { accessToken } = response.data.data;
          
          const decoded = jwtDecode(accessToken);
          const username =
            decoded[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
            ] || "Anonymous";
          const role =
            decoded[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ] || "User"; 
          
          localStorage.setItem("userToken", accessToken);
          localStorage.setItem("username", username);
          localStorage.setItem("userRole", role); // تخزين الـ role
          navigate("/home");
        } else {
          formik.setErrors({ email: "Login failed: " + response.data.message });
        }
      } catch (error) {
        formik.setErrors({ email: "Error logging in: " + error.message });
        console.error("Error logging in:", error);
      }
    },
  });

  return (
    <section className="bg-[linear-gradient(to_right,#1E3A5F,#67B4FF)] min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Left Section & Image */}
          <div className="LeftSection w-full lg:w-1/2 bg-blue-100 flex flex-col items-center justify-center relative p-6 h-96 lg:h-auto">
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

            <div className="image flex justify-center items-center w-full">
              <img
                src={studentLearningImg}
                alt="Login Illustration"
                className="w-64 md:w-96 max-w-full"
              />
            </div>
          </div>

          {/* Right Section & Form */}
          <div className="RightSection w-full h-[650px] lg:w-1/2 py-10 px-6 lg:px-12">
            <div className="text-center my-8">
              <h1 className="text-2xl font-bold text-blue-400">
                Welcome to Evolvify
              </h1>
              <p className="text-gray-500 text-sm">
                Welcome back! please log in to your account
              </p>
            </div>

            <form
              className="space-y-4 py-6 md:py-10 h-[50vh] flex flex-col items-center justify-center"
              onSubmit={formik.handleSubmit}
            >
              {/* Email */}
              <div className="Email w-full max-w-sm">
                <input
                  type="email"
                  placeholder="User Name or Email"
                  className="form-control w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  name="email"
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
              <div className="Password w-full max-w-sm">
                <input
                  type="password"
                  placeholder="Password"
                  className="form-control w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  name="password"
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

              <div className="flex justify-between items-center w-full max-w-sm text-gray-500 text-sm">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 accent-gray-400" />
                  <span>Remember me</span>
                </label>
                <Link to="/forget-password" className="hover:underline">
                  Forget password
                </Link>
              </div>

              <div className="Button w-full flex flex-col items-center">
                <button
                  type="submit"
                  className="text-lg md:text-xl w-64 md:w-72 px-6 mt-3 py-3 text-white font-bold rounded-full bg-[linear-gradient(to_right,#67B4FF,#1E3A5F)] shadow-md"
                >
                  Login
                </button>

                <p className="text-base text-gray-800 mt-2">
                  New user?{" "}
                  <Link
                    to="/signup"
                    className="text-blue-500 font-semibold hover:underline"
                  >
                    sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}