import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const RecommendedPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userResults } = location.state || { userResults: [] };
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fallbackImage =
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80";

  const fetchRecommendedCourses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.get(
        "https://evolvify.runasp.net/api/Courses/recommended",
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.data || response.data.data.length === 0) {
        throw new Error("No recommended courses found.");
      }

      const fetchedSkills = response.data.data.map((skill) => ({
        category: `${skill.skill} Skills`,
        level: skill.level,
        courses:
          Array.isArray(skill.courses) && skill.courses.length > 0
            ? skill.courses.map((course) => ({
                id: course.id,
                name: course.title,
                level: course.level,
                image: course.imageUrl || fallbackImage,
                description: course.description,
                duration: course.duration,
              }))
            : [],
      }));

      setSkills(fetchedSkills);
      setLoading(false);
    } catch (err) {
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          fetchRecommendedCourses();
        }, 2000);
      } else {
        setError(err.message || "Failed to fetch recommended courses.");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchRecommendedCourses();
  }, []);

  const handleSkip = () => {
    navigate("/courses");
  };

  const handleRetry = () => {
    setError(null);
    setRetryCount(0);
    fetchRecommendedCourses();
  };

  const getUserLevel = (skillCategory) => {
    const skillResult = userResults.find((result) =>
      result.skill
        .toLowerCase()
        .includes(skillCategory.split(" ")[0].toLowerCase())
    );
    return skillResult ? skillResult.level : null;
  };

  const getRecommendedCourse = (skillCategory, skillLevel, courses) => {
    const userLevel = getUserLevel(skillCategory);
    if (!userLevel || userLevel === skillLevel) return courses.slice(0, 3);
    return courses.filter((course) => course.level === userLevel).slice(0, 3);
  };

  const getLevelTextColor = (level) => {
    switch (level) {
      case "Beginner":
        return "text-red-500";
      case "Intermediate":
        return "text-yellow-500";
      case "Advanced":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const redistributeSkills = (skillsArray) => {
    if (!Array.isArray(skillsArray)) return [];

    const maxPerRow = 3;
    const maxRows = 5;
    const totalToShow = maxPerRow * maxRows;

    let limitedSkills = skillsArray.slice(0, totalToShow + 3);
    let rows = [];

    for (let i = 0; i < limitedSkills.length; i += maxPerRow) {
      rows.push(limitedSkills.slice(i, i + maxPerRow));
    }

    const lastRow = rows[rows.length - 1];
    if (lastRow && lastRow.length < maxPerRow) {
      rows.pop();
      lastRow.forEach((card, index) => {
        const targetIndex = rows.length - 2 + index;
        if (rows[targetIndex]) {
          rows[targetIndex].push(card);
        }
      });
    }

    return rows.slice(0, maxRows);
  };

  const skillsGroups = redistributeSkills(skills);

  const LoadingSkeleton = () => (
    <div className="w-full max-w-6xl space-y-10">
      {Array(5)
        .fill()
        .map((_, groupIndex) => (
          <div
            key={groupIndex}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center"
          >
            {Array(3)
              .fill()
              .map((_, index) => (
                <div
                  key={index}
                  className="w-full max-w-[300px] animate-pulse mx-auto"
                >
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="bg-white rounded-2xl shadow-md w-full h-[420px]">
                    <div className="w-full h-[250px] bg-gray-200 rounded-t-xl"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}
    </div>
  );

  if (loading) {
    return (
      <section className="min-h-screen w-full bg-slate-100 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        <p className="mt-4 text-gray-500">Loading your plan...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen w-full bg-slate-100 flex flex-col items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleRetry}
              className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-600 transition"
            >
              Retry
            </button>
            <button
              onClick={handleSkip}
              className="bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-full hover:bg-gray-400 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen w-full bg-slate-100 flex flex-col">
      <div className="flex-1 flex flex-col items-center px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#233A66] mb-6 sm:mb-8 text-center">
          Your Recommended Plan
        </h1>

        <div className="w-full max-w-6xl space-y-10">
          {skillsGroups.map((skillGroup, groupIndex) => (
            <div
              key={groupIndex}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center"
            >
              {skillGroup.map((skill, index) => {
                const recommendedCourses = getRecommendedCourse(
                  skill.category,
                  skill.level,
                  skill.courses
                );
                return (
                  <div
                    key={index}
                    className="space-y-2 w-full flex justify-center"
                  >
                    <div className="w-full max-w-[300px]">
                      <h2 className="text-xl font-semibold text-[#233A66] text-center mb-4">
                        {skill.category || "Placeholder"}
                      </h2>
                      {(recommendedCourses.length > 0
                        ? recommendedCourses
                        : skill.courses || []
                      ).map((course, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-2xl shadow-md flex flex-col justify-between items-center w-full h-[420px] max-h-[420px] min-h-[420px] transform transition-transform duration-300 hover:scale-105 hover:shadow-lg mb-5"
                        >
                          <div className="w-full h-[250px] relative">
                            <img
                              src={course.image}
                              alt={course.name}
                              className="absolute top-0 left-0 w-full h-full object-cover rounded-t-xl"
                              onError={(e) => {
                                e.target.src = fallbackImage;
                              }}
                            />
                          </div>
                          <div className="flex flex-col items-center p-4">
                            <h3 className="font-semibold text-base sm:text-lg text-[#233A66] text-center mb-2 line-clamp-2">
                              {course.name}
                            </h3>
                            <span
                              className={`text-md ${getLevelTextColor(
                                course.level
                              )} font-semibold`}
                            >
                              {course.level}
                            </span>
                          </div>
                        </div>
                      ))}
                      {(!skill.courses || skill.courses.length === 0) && (
                        <div className="bg-white p-4 rounded-xl shadow-md text-center">
                          <p className="text-gray-500">
                            No courses available for this skill.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          {skills.length === 0 && (
            <div className="bg-white p-6 rounded-xl shadow-md max-w-md text-center">
              <p className="text-gray-500 mb-4">
                No recommended skills or courses found.
              </p>
              <button
                onClick={handleRetry}
                className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-600 transition"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleSkip}
          className="mt-8 bg-gradient-to-r from-[#67B4FF] to-[#1E3A5F] text-white font-semibold py-2 px-12 rounded-full transition text-sm sm:text-base hover:opacity-90"
        >
          Skip
        </button>
      </div>
    </section>
  );
};

export default RecommendedPlan;
