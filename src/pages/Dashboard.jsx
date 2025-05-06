import logoLighte from "../assets/images/light-logo.png";
import placeholderImg from "../assets/images/placeholder-vector.jpg";
import { useState, useRef } from "react";

const Dashboard = () => {
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cards = [1, 2, 3, 4, 5];
  const cardsPerView = 3; // Show exactly 3 cards per view
  const cardWidth = 256; // 256px = card width (256px)
  const gap = 20; // Gap between cards (20px)
  const totalWidth = (cardWidth + gap) * cardsPerView - gap; // Total width for 3 cards: (256 + 20) * 3 - 20

  const handleNext = () => {
    if (currentIndex < cards.length - cardsPerView) {
      setCurrentIndex(currentIndex + 1);
      sliderRef.current.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      sliderRef.current.scrollBy({
        left: -(cardWidth + gap),
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="dashboard flex h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-[#233A66] text-white p-5 flex flex-col items-center">
        <div className="flex items-center mb-5">
          <img src={logoLighte} alt="Evolvify Logo" className="mr-2" />
        </div>
        <div className="ProfileImg text-center mb-5">
          <img
            src={placeholderImg}
            alt="User Profile"
            className="rounded-full mb-4 w-32 h-32 mx-auto"
          />
          <h3 className="text-lg font-semibold mb-2">Mira Ali</h3>
          <button className="flex justify-between items-center bg-blue-500 text-white py-2 px-2 rounded-md w-40 mt-4 my-10">
            <span>Edit</span>
            <i className="fa-regular fa-pen-to-square"></i>
          </button>
          <div className="UserInfo">
            <p className="flex items-center  my-2">
              <i className="fa-solid fa-envelope mr-2 text-white"></i>
              Miraali@gmail.com
            </p>
            <p className="flex items-center">
              <i className="fa-solid fa-phone mr-2 text-white"></i>
              0123478900
            </p>
          </div>
        </div>
        <button className="py-2 w-full mt-auto bg-red-500 hover:bg-red-600 text-white border-none rounded-md cursor-pointer">
          <i className="fa-solid fa-right-from-bracket mr-2"></i>
          Log out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5">
        <h1 className="text-2xl text-[#233A66] font-bold text-center mb-5">
          Welcome. Mira
        </h1>

        {/* Course Progress */}
        <div className="mb-10">
          <h2 className="text-xl text-[#233A66] font-semibold mb-3">
            Course in progress
          </h2>
          <div className="relative">
            <div
              ref={sliderRef}
              className="Cards flex justify-center gap-5 overflow-x-hidden scrollbar-hide snap-x"
              style={{ width: `${totalWidth}px`, margin: "0 auto" }} // Ensure exactly 3 cards visible
            >
              <div className="flex gap-5 pb-4">
                {cards.map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-4 rounded-lg w-64 flex-shrink-0 snap-center"
                  >
                    <p className="font-medium">interview skill</p>
                    <p className="text-sm text-gray-600">
                      Improving your presentation skills can help you
                      communicate effectively, engage your audience, and leave a
                      lasting impression.
                    </p>
                    <div className="w-full bg-gray-300 rounded h-2 mt-2">
                      <div
                        className="bg-blue-500 h-full rounded"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                    <p className="text-sm mt-1">75% completed</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Navigation Buttons */}
            <button
              onClick={handlePrev}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-300 text-gray-800 p-2 rounded-full ${
                currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentIndex === 0}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              onClick={handleNext}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-100 text-gray-800 p-2 rounded-full ${
                currentIndex >= cards.length - cardsPerView
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={currentIndex >= cards.length - cardsPerView}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* User Progress and Assessment Result */}
        <div className="flex gap-10 mb-0">
          {/* User Progress */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-3">User Progress</h2>
            <div className="flex gap-5">
              <div className="bg-gray-100 p-4 rounded-lg text-center flex-1 flex items-center justify-center h-40">
                <div>
                  <p className="text-sm">Starting Level (intermediate)</p>
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
              <div className="bg-gray-100 p-4 rounded-lg text-center flex-1 flex items-center justify-center h-40">
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
              <div className="bg-gray-100 p-4 rounded-lg text-center flex-1 flex items-center justify-center h-40">
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
          <div className="flex-1 ml-20">
            <h2 className="text-xl font-semibold mb-3">Assessment result</h2>
            <div>
              <p className="my-1">
                Interview Skill <span className="text-green-600">Advanced</span>
              </p>
              <p className="my-1">
                Presentation Skill{" "}
                <span className="text-green-600">Advanced</span>
              </p>
              <p className="my-1">
                Communication Skill{" "}
                <span className="text-yellow-500">Intermediate</span>
              </p>
              <p className="my-1">
                Time management Skill{" "}
                <span className="text-gray-500">Beginner</span>
              </p>
              <p className="my-1">
                Teamwork Skill{" "}
                <span className="text-yellow-500">Intermediate</span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Dashboard;
