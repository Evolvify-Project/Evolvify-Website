import logoLight from "../../assets/images/light-logo.png";
import placeholderImg from "../../assets/images/placeholder-vector.jpg";
import { useState, useRef, useEffect } from "react";
import UserProgressCard from "./UserProgressCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMediaQuery } from "react-responsive"; // إضافة استيراد useMediaQuery

const Dashboard = () => {
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(placeholderImg);
  const [assessmentResults, setAssessmentResults] = useState([]);
  const [assessmentError, setAssessmentError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 }); // تعريف isMobile باستخدام useMediaQuery

  const cards = [
    { id: 1, skill: "Presentation skill", progress: 30 },
    { id: 2, skill: "Time Management skill", progress: 60 },
    { id: 3, skill: "Teamwork skill", progress: 100 },
    { id: 4, skill: "Interview skill", progress: 90 },
    { id: 5, skill: "Communication skill", progress: 70 },
  ];

  // جلب الـ token من localStorage
  const token = localStorage.getItem("userToken");

  // جلب الـ user profile و assessment results من الـ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // جلب الـ user profile
        const profileResponse = await axios.get(
          "https://evolvify.runasp.net/api/Accounts/userProfile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "*/*",
            },
          }
        );

        if (profileResponse.data.success) {
          const userData = profileResponse.data.data;
          setName(userData.userName || "Unknown User");
          setEmail(userData.email || "No Email");
          setProfileImage(userData.profileImageUrl || placeholderImg);
        }

        // جلب الـ assessment results
        const assessmentResponse = await axios.get(
          "https://evolvify.runasp.net/api/Assessments/Result",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "*/*",
            },
          }
        );

        if (assessmentResponse.data.success) {
          setAssessmentResults(assessmentResponse.data.data.results);
        } else if (assessmentResponse.data.statusCode === 404) {
          setAssessmentError("Please complete an assessment first.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setAssessmentError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      navigate("/login"); // لو مافيش token، يروح لصفحة اللوجين
    }
  }, [token, navigate]);

  const handleNext = () => {
    const cardWidth = 310; // عرض الكارد الثابت
    const gap = 16; // قيمة gap-4 في Tailwind = 16px
    const maxIndex = isMobile ? cards.length - 1 : cards.length - 3;
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
      const cardsToMove = isMobile ? 1 : 3;
      const scrollAmount = (cardWidth + gap) * cardsToMove;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handlePrev = () => {
    const cardWidth = 310; // عرض الكارد الثابت
    const gap = 16; // قيمة gap-4 في Tailwind = 16px
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const cardsToMove = isMobile ? 1 : 3;
      const scrollAmount = (cardWidth + gap) * cardsToMove;
      sliderRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleEditProfile = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          // إنشاء FormData لإرسال الصورة
          const formData = new FormData();
          formData.append("Image", file);

          // إرسال الصورة للـ API
          const response = await axios.put(
            "https://evolvify.runasp.net/api/Accounts/UpdateProfileImage",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                accept: "*/*",
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.data.success) {
            // تحديث الصورة في الـ state باستخدام الـ URL اللي رجع من الـ API
            setProfileImage(`https://evolvify.runasp.net${response.data.data}`);
          } else {
            console.error(
              "Failed to update profile image:",
              response.data.message
            );
            alert("Failed to update profile image. Please try again.");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Error uploading image. Please try again.");
        }
      }
    };
    input.click();
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken"); // نمسح الـ token
    navigate("/login");
  };

  const progressData = [
    {
      label: "Starting Level",
      percentage: 88,
      subtitle: "Intermediate",
      subtitleColor: "text-yellow-500",
    },
    {
      label: "Current Level",
      percentage: 70,
      subtitle: "Advanced",
      subtitleColor: "text-green-600",
    },
    {
      label: "Knowledge Gain",
      percentage: 34,
      subtitle: "",
      subtitleColor: "",
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <section className="dashboard flex flex-col min-h-screen md:flex-row">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-4/5 max-w-xs bg-[#233A66] text-white p-5 flex flex-col items-center transition-transform duration-300 z-50 md:static md:flex md:w-72 md:min-h-screen md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-5 w-full">
          <img src={logoLight} alt="Evolvify Logo" className="mr-2 w-48 h-20" />
          <button className="md:hidden text-white" onClick={toggleSidebar}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        <div className="ProfileImg text-center mb-5">
          <img
            src={profileImage}
            alt="User Profile"
            className="rounded-full mb-4 w-28 h-28 mx-auto"
          />
          <h3 className="text-lg font-semibold mb-2">{name}</h3>
          <button
            onClick={handleEditProfile}
            className="flex justify-between items-center bg-blue-500 text-white py-2 px-2 rounded-md w-40 mt-4 my-10"
          >
            <span>Edit</span>
            <i className="fa-regular fa-pen-to-square"></i>
          </button>
          <div className="UserInfo">
            <p className="flex items-center my-2">
              <i className="fa-solid fa-envelope mr-2 text-white"></i>
              {email}
            </p>
            <p className="flex items-center">
              <i className="fa-solid fa-phone mr-2 text-white"></i>
              0123478900
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="py-2 w-full mt-auto bg-red-500 hover:bg-red-600 text-white border-none rounded-md cursor-pointer"
        >
          <i className="fa-solid fa-right-from-bracket mr-2"></i>
          Log out
        </button>
      </aside>

      {/* Overlay for mobile sidebar */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      ></div>

      {/* Hamburger Icon for Mobile */}
      <button
        className={`md:hidden p-4 text-white bg-gray-500 rounded-full fixed top-5 left-5 z-50 ${
          isSidebarOpen ? "hidden" : ""
        }`}
        onClick={toggleSidebar}
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      {/* Main Content */}
      <main className="flex-1 p-5">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            <h1 className="text-xl md:text-2xl text-[#233A66] font-bold text-center mb-5">
              Welcome, {name}
            </h1>

            {/* Course Progress */}
            <div className="mb-10">
              <h2 className="text-lg sm:text-xl lg:text-2xl text-[#233A66] font-semibold mb-3">
                Course in progress
              </h2>
              <div className="relative">
                <div
                  ref={sliderRef}
                  className="Cards overflow-x-hidden scrollbar-hidden w-full flex justify-center snap-x snap-mandatory"
                >
                  <div className="flex gap-4 pb-4">
                    {cards
                      .slice(currentIndex, currentIndex + (isMobile ? 1 : 3))
                      .map((card) => (
                        <div
                          key={card.id}
                          className="bg-white w-[310px] h-[210px] p-4 rounded-lg flex-shrink-0 shadow-md snap-center"
                        >
                          <p className="font-semibold text-[#233A66] text-center text-base sm:text-lg">
                            {card.skill}
                          </p>
                          <p className="text-xs sm:text-sm text-[#233A66] text-center mt-2">
                            Improving your {card.skill.toLowerCase()} skills can
                            help you perform better engage your audience, and
                            leave a lasting impression.
                          </p>
                          <div className="relative w-full bg-gray-300 rounded-full h-3 mt-6">
                            <div
                              className="bg-[#64B5F6] h-full rounded-full relative"
                              style={{ width: `${card.progress}%` }}
                            >
                              <p
                                className="text-sm absolute top-4 -translate-y-1/2 whitespace-nowrap text-center text-black"
                                style={{
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                }}
                              >
                                {card.progress}% completed
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <button
                  onClick={handlePrev}
                  className={`absolute w-10 h-10 sm:w-12 sm:h-12 top-1/2 -translate-y-1/2 bg-blue-400 text-white rounded-full -left-4 sm:left-8 ${
                    currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={currentIndex === 0}
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button
                  onClick={handleNext}
                  className={`absolute w-10 h-10 sm:w-12 sm:h-12 top-1/2 -translate-y-1/2 bg-blue-400 text-white rounded-full -right-4 sm:right-8 ${
                    currentIndex >=
                    (isMobile ? cards.length - 1 : cards.length - 3)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={
                    currentIndex >=
                    (isMobile ? cards.length - 1 : cards.length - 3)
                  }
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>

            <div className="border-2 border-[#64B5F6] w-[1000px] mx-auto rounded-lg my-10"></div>

            {/* User Progress and Assessment Result */}
            <h2 className="text-lg sm:text-xl lg:text-2xl text-[#233A66] font-semibold mb-3">
              User in progress
            </h2>
            <div className="flex flex-col lg:flex-row gap-5 lg:gap-10 mb-0">
              {/* User Progress */}
              <div className="flex flex-col sm:flex-row gap-5">
                {progressData.map((progress, index) => (
                  <UserProgressCard
                    key={index}
                    label={progress.label}
                    subtitle={progress.subtitle}
                    percentage={progress.percentage}
                    color={progress.color}
                    subtitleColor={progress.subtitleColor}
                  />
                ))}
              </div>

              {/* Assessment Result */}
              <div className="flex-1 mt-5 sm:mt-0 sm:ml-10">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h2 className="text-lg md:text-xl font-semibold mb-3">
                    Assessment Result
                  </h2>
                  {assessmentError ? (
                    <p className="text-red-500">{assessmentError}</p>
                  ) : assessmentResults.length > 0 ? (
                    <div>
                      {assessmentResults.map((result, index) => (
                        <p key={index} className="my-1">
                          {result.skill}{" "}
                          <span
                            className={
                              result.level === "Advanced"
                                ? "text-green-600"
                                : result.level === "Intermediate"
                                ? "text-yellow-500"
                                : "text-gray-500"
                            }
                          >
                            {result.level}
                          </span>
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p>No assessment results available.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </section>
  );
};

export default Dashboard;
