import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SkillsSection = () => {
  const [apiResult, setApiResult] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const scores = location.state?.scores || {};

  useEffect(() => {
    if (scores.results && Array.isArray(scores.results)) {
      setApiResult(scores.results);
    } else {
      console.error("No valid results found in scores:", scores);
      setApiResult([]); 
    }
  }, [scores]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#233A66] px-4 py-6">
      <div className="bg-white border border-blue-100 rounded-2xl p-4 sm:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg shadow-xl">
        <h1 className="text-xl sm:text-2xl font-bold text-[#67B4FF] mb-4 sm:mb-6 text-center">
          Your Result
        </h1>
        <div className="space-y-3 sm:space-y-6">
          {apiResult && apiResult.length > 0 ? (
            apiResult.map((skill, index) => (
              <div
                key={index}
                className="bg-white border border-blue-400 rounded-lg p-4 flex justify-between items-center shadow-sm"
              >
                <span className="text-[#233A66] font-semibold text-sm sm:text-base">
                  {skill.skill} Skills
                </span>
                <span
                  className={`text-xs sm:text-sm font-semibold px-2 py-1 rounded ${
                    skill.level === "Advanced"
                      ? "bg-green-200 text-green-800"
                      : skill.level === "Intermediate"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {skill.level}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-lg text-red-500">
              {apiResult ? "No results available" : "Loading..."}
            </p>
          )}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
            <button
              onClick={() => {
                if (apiResult && apiResult.length > 0) {
                  navigate("/recommended-plan", {
                    state: { userResults: apiResult },
                  });
                }
              }}
              disabled={!apiResult || apiResult.length === 0}
              className={`${
                !apiResult || apiResult.length === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[linear-gradient(to_right,#67B4FF,#1E3A5F)] hover:opacity-90"
              } text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all duration-300 active:scale-95`}
            >
              Start your learning plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;



