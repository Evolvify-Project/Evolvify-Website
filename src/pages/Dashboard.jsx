import logoLighte from "../assets/images/light-logo.png";
import placeholderImg from "../assets/images/placeholder-vector.jpg";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const [name, setName] = useState("Mira Ali"); // قيمة افتراضية
  const [email, setEmail] = useState("Miraali@gmail.com"); // قيمة افتراضية
  const cards = [
    { id: 1, skill: "Presentation skill", progress: 30 },
    { id: 2, skill: "Time Management skill", progress: 60 },
    { id: 3, skill: "Teamwork skill", progress: 100 },
    { id: 4, skill: "Interview skill", progress: 90 },
    { id: 5, skill: "Communication skill", progress: 70 },
  ];

  // جلب الاسم والإيميل من localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setName(parsedData.name || "Mira Ali"); // لو مافيش اسم، نستخدم القيمة الافتراضية
        setEmail(parsedData.email || "Miraali@gmail.com"); // لو مافيش إيميل، نستخدم القيمة الافتراضية
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const handleNext = () => {
    if (currentIndex < cards.length - 3) {
      setCurrentIndex(currentIndex + 1);
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth / 3,
        behavior: "smooth",
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth / 3,
        behavior: "smooth",
      });
    }
  };

  const handleEditProfile = () => {
    // يفتح متصفح الملفات لاختيار صورة
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newProfileImg = event.target.result;
          // هنا ممكن تحط الكود بتاعك لتحديث الصورة في الـ state أو الـ API
          console.log("New profile image selected:", newProfileImg);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleLogout = () => {
    // ينقلك لصفحة اللوجين باستخدام useNavigate
    navigate("/login");
  };

  

  return (
    <section className="dashboard flex flex-col min-h-screen md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-[#233A66] text-white p-5 flex-col items-center md:min-h-screen hidden md:flex">
        <div className="flex items-center mb-5">
          <img
            src={logoLighte}
            alt="Evolvify Logo"
            className="mr-2 w-48 h-20"
          />
        </div>
        <div className="ProfileImg text-center mb-5">
          <img
            src={placeholderImg}
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

      {/* Main Content */}
      <main className="flex-1 p-5">
        <h1 className="text-xl md:text-2xl text-[#233A66] font-bold text-center mb-5">
          Welcome, {name}
        </h1>

        {/* Course Progress */}
        <div className="mb-10">
          <h2 className="text-lg md:text-xl text-[#233A66] font-semibold mb-3">
            Course in progress
          </h2>
          <div className="relative">
            <div
              ref={sliderRef}
              className="Cards overflow-x-hidden scrollbar-hidden snap-x w-full flex justify-center"
            >
              <div className="flex gap-4 pb-4">
                {cards.slice(currentIndex, currentIndex + 3).map((card) => (
                  <div
                    key={card.id}
                    className="bg-gray-100 w-[310px] h-[210px] p-4 rounded-lg flex-shrink-0 snap-center shadow-md"
                  >
                    <p className="font-semibold text-[#233A66] text-center">
                      {card.skill}
                    </p>
                    <p className="text-sm text-[#233A66] text-center mt-2">
                      Improving your {card.skill.toLowerCase()} skills can help
                      you perform better engage your audience, and leave a
                      lasting impression.
                    </p>
                    <div className="relative w-full bg-gray-300 rounded-full h-3 mt-6 ">
                      <div
                        className="bg-[#64B5F6] h-full rounded-full"
                        style={{ width: `${card.progress}%` }}
                      ></div>
                      <p
                        className="text-sm absolute top-4 whitespace-nowrap text-center"
                        style={{ left: card.progress }}
                      >
                        {card.progress}% completed
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={handlePrev}
              className={`absolute w-12 h-12 left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 bg-blue-400 text-white rounded-full ${
                currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentIndex === 0}
              style={{ left: "5%" }}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              onClick={handleNext}
              className={`absolute w-12 h-12 right-1/2 transform translate-x-1/2 top-1/2 -translate-y-1/2 bg-blue-400 text-white rounded-full ${
                currentIndex >= cards.length - 3
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={currentIndex >= cards.length - 3}
              style={{ right: "5%" }}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div className="border-2 border-[#64B5F6] w-[1000px] mx-auto rounded-lg my-10"></div>

        {/* User Progress and Assessment Result */}
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-10 mb-0">
          {/* User Progress */}
          <div className="flex-1">
            <h2 className="text-lg md:text-xl text-[#233A66] font-semibold mb-3">
              User Progress
            </h2>
            <div className="flex flex-row gap-5">
              <div className="bg-white p-4 rounded-lg text-center flex-1 min-w-[200px] h-48 flex items-center justify-center shadow-md">
                <div>
                  <p className="text-sm">Starting Level (Intermediate)</p>
                  <div className="relative h-24 w-24 mx-auto my-2">
                    <svg className="absolute inset-0" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e0e0e0"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeDasharray="88, 100"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-green-600">
                      88%
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center flex-1 min-w-[200px] h-48 flex items-center justify-center shadow-md">
                <div>
                  <p className="text-sm">Current Level (Advanced)</p>
                  <div className="relative h-24 w-24 mx-auto my-2">
                    <svg className="absolute inset-0" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e0e0e0"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeDasharray="86, 100"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-green-600">
                      86%
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center flex-1 min-w-[200px] h-48 flex items-center justify-center shadow-md">
                <div>
                  <p className="text-sm">Knowledge Gain</p>
                  <div className="relative h-24 w-24 mx-auto my-2">
                    <svg className="absolute inset-0" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e0e0e0"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeDasharray="34, 100"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                      +34%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Result */}
          <div className="flex-1 mt-5 sm:mt-0 sm:ml-10">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-lg md:text-xl font-semibold mb-3">
                Assessment Result
              </h2>
              <div>
                <p className="my-1">
                  Presentation <span className="text-green-600">Advanced</span>
                </p>
                <p className="my-1">
                  Time Management{" "}
                  <span className="text-gray-500">Beginner</span>
                </p>
                <p className="my-1">
                  Teamwork <span className="text-yellow-500">Intermediate</span>
                </p>
                <p className="my-1">
                  Interview <span className="text-green-600">Advanced</span>
                </p>
                <p className="my-1">
                  Communication{" "}
                  <span className="text-yellow-500">Intermediate</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Dashboard;