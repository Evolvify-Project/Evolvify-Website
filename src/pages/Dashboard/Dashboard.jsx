import logoLight from "../../assets/images/light-logo.png";
import placeholderImg from "../../assets/images/placeholder-vector.jpg";
import { useState, useRef, useEffect } from "react";
import UserProgressCard from "./UserProgressCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMediaQuery } from "react-responsive";

const Dashboard = () => {
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState(placeholderImg);
  const [assessmentResults, setAssessmentResults] = useState([]);
  const [assessmentError, setAssessmentError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  const cards = [
    { id: 1, skill: "Presentation skill", progress: 30 },
    { id: 2, skill: "Time Management skill", progress: 60 },
    { id: 3, skill: "Teamwork skill", progress: 100 },
    { id: 4, skill: "Interview skill", progress: 90 },
    { id: 5, skill: "Communication skill", progress: 70 },
  ];

  const token = localStorage.getItem("userToken");

  const cardsPerView = isMobile ? 1 : isTablet ? 2 : 3;

  const getStartIndex = () => {
    const maxStartIndex = Math.max(0, cards.length - cardsPerView);
    if (currentIndex < cardsPerView - 1) {
      return 0;
    } else if (currentIndex >= cards.length - 1) {
      return maxStartIndex;
    } else {
      return currentIndex - (cardsPerView - 1);
    }
  };

  const startIndex = getStartIndex();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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
          setPhoneNumber(userData.phoneNumber || "No Phone Number");
          setProfileImage(userData.profileImageUrl || placeholderImg);
        }

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
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      if (currentScrollPos > prevScrollPos) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const handleEditProfile = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append("Image", file);

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
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  const handleHome = () => {
    navigate("/home");
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
        className={`fixed top-0 left-0 h-full w-4/5 max-w-xs bg-[#233A66] text-white p-4 sm:p-5 flex flex-col items-center transition-transform duration-300 z-50 lg:static lg:flex lg:w-64 lg:min-h-screen lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={toggleSidebar}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-5 w-full">
          <img
            src={logoLight}
            alt="Evolvify Logo"
            className="mx-auto w-36 sm:w-48 h-16 sm:h-20"
          />
          <button className="lg:hidden text-white" onClick={toggleSidebar}>
            <i className="fa-solid fa-times hover:text-red-500 text-lg sm:text-xl transition-transform duration-500 hover:rotate-180"></i>
          </button>
        </div>
        <div className="ProfileImg text-center mb-4 sm:mb-5">
          <img
            src={profileImage}
            alt="User Profile"
            className="rounded-full mb-3 sm:mb-4 w-24 h-24 sm:w-28 sm:h-28 mx-auto object-cover"
          />
          <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 truncate max-w-full">
            {name}
          </h3>
          <button
            onClick={handleEditProfile}
            className="flex justify-between mx-auto items-center bg-blue-500 hover:bg-blue-600 text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded-md w-36 sm:w-40 mt-3 sm:mt-4 my-6 sm:my-10 text-sm sm:text-base"
          >
            <span>Edit</span>
            <i className="fa-regular fa-pen-to-square"></i>
          </button>
          <div className="UserInfo text-sm sm:text-base text-center">
            <p className="flex justify-center items-center my-1 sm:my-2 mx-auto w-full max-w-[250px] sm:max-w-[100%] sm:w-auto gap-2 sm:gap-3">
              <i className="fa-solid fa-envelope text-white shrink-0"></i>
              <span className="text-white text-start break-words w-full sm:w-auto sm:break-all">
                {email}
              </span>
            </p>
            <p className="flex justify-start items-center mx-auto w-full max-w-[250px] sm:max-w-[100%] sm:w-auto gap-2 sm:gap-3">
              <i className="fa-solid fa-phone text-white shrink-0"></i>
              <span className="text-white text-start break-words w-full sm:w-auto sm:break-all">
                {phoneNumber}
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="py-1.5 sm:py-2 w-full mt-auto bg-red-500 hover:bg-red-600 text-white border-none rounded-md cursor-pointer text-sm sm:text-base"
        >
          <i className="fa-solid fa-right-from-bracket mr-1 sm:mr-2"></i>
          Log out
        </button>
      </aside>

      {/* Overlay for mobile and tablet sidebar */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      ></div>

      {/* Hamburger Icon for Mobile and Tablet */}
      <button
        className={`lg:hidden w-9 h-9 sm:w-10 sm:h-10 text-slate-100 bg-[#233A66] rounded-lg fixed top-2 left-1 z-50 flex items-center justify-center transition-all duration-300 ${
          isVisible ? "opacity-100" : "opacity-0 -translate-y-16"
        }`}
        onClick={toggleSidebar}
      >
        <i className="fa-solid fa-bars text-lg sm:text-xl transition-transform duration-500 hover:rotate-180"></i>
      </button>

      {/* Home Icon */}
      <button
        className={`fixed top-2 right-1 z-50 w-9 h-9 sm:w-10 sm:h-10 text-slate-100 bg-[#233A66] rounded-md flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isVisible ? "opacity-100" : "opacity-0 -translate-y-16"
        }`}
        onClick={handleHome}
        title="Back to Home"
      >
        <i className="fa-solid fa-house text-lg sm:text-xl"></i>
      </button>

      {/* Main Content */}
      <main className="flex-1 p-3 sm:p-5">
        {loading ? (
          <div className="text-center text-base sm:text-lg">Loading...</div>
        ) : (
          <>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-4 sm:mb-5">
              <span className="text-[#233A66]">Welcome, </span>
              <span className="text-[#64B5F6]">{name}</span>
            </h1>

            {/* Course Progress */}
            <div className="mb-8 sm:mb-10">
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#233A66] font-semibold mb-2 sm:mb-3">
                Course in progress
              </h2>
              <div className="relative">
                <div
                  ref={sliderRef}
                  className="Cards overflow-x-hidden scrollbar-hidden w-full flex justify-center snap-x snap-mandatory"
                >
                  <div className="flex gap-6 pb-4">
                    {cards
                      .slice(startIndex, startIndex + cardsPerView)
                      .map((card) => (
                        <div
                          key={card.id}
                          className={`w-[260px] sm:w-[280px] md:w-[310px] min-h-[${
                            isMobile ? "160px" : "200px"
                          }] p-2 sm:p-3 rounded-lg flex-shrink-0 shadow-lg snap-center transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                            currentIndex === cards.indexOf(card)
                              ? "bg-gray-200 scale-105 rounded-xl"
                              : "bg-gray-100 scale-100"
                          }`}
                          style={{ minHeight: isMobile ? "160px" : "200px" }}
                        >
                          <p className="font-semibold text-[#233A66] text-center text-sm sm:text-base md:text-lg">
                            {card.skill}
                          </p>
                          <p
                            className={`text-xs sm:text-sm text-[#233A66] items-center text-center mt-1 ${
                              isMobile ? "line-clamp-2" : "line-clamp-3"
                            }`}
                          >
                            Improving your {card.skill.toLowerCase()} skills can
                            help you perform better engage your audience, and
                            leave a lasting impression.
                          </p>
                          <div
                            className={`relative w-full bg-gray-300 rounded-full h-2 sm:h-2.5 ${
                              isMobile ? "mt-1" : "mt-2 sm:mt-3"
                            }`}
                          >
                            <div
                              className="bg-[#64B5F6] h-full rounded-full relative"
                              style={{ width: `${card.progress}%` }}
                            >
                              <p
                                className={`text-xs sm:text-sm absolute ${
                                  isMobile ? "top-1.5" : "top-2 sm:top-2.5"
                                } -translate-y-1/2 whitespace-nowrap text-center text-black`}
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

                {/* Indicators */}
                <div className="flex justify-center gap-2 mt-4">
                  {cards.map((_, index) => (
                    <div
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                        currentIndex === index
                          ? "bg-[#64B5F6] w-4 h-4"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-2 border-[#64B5F6] w-full max-w-[1000px] mx-auto rounded-lg my-6 sm:my-10"></div>

            {/* User Progress and Assessment Result */}
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#233A66] font-semibold mb-2 sm:mb-3">
              User in progress
            </h2>
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-10 mb-0">
              {/* User Progress */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
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
              <div className="flex-1 mt-4 sm:mt-5 lg:mt-0 lg:ml-10">
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg border border-blue-200">
                  <h2 className="text-[#233A66] text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3">
                    Assessment Result
                  </h2>
                  {assessmentError ? (
                    <p className="text-red-500 text-sm sm:text-base">
                      {assessmentError}
                    </p>
                  ) : assessmentResults.length > 0 ? (
                    <div>
                      {assessmentResults.map((result, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center my-1 text-sm sm:text-base"
                        >
                          <p className="truncate">{result.skill}</p>
                          <span
                            className={
                              result.level === "Advanced"
                                ? "text-green-600"
                                : result.level === "Intermediate"
                                ? "text-yellow-500"
                                : "text-red-500"
                            }
                          >
                            {result.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-md text-red-500 sm:text-base">
                      No assessment results available.
                    </p>
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
