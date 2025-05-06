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

  // صورة احتياطية خارجية
  const fallbackImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80";

  // دالة لجلب البيانات من الـ API مع retry logic
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

      // التحقق من وجود بيانات
      if (!response.data.data || response.data.data.length === 0) {
        throw new Error("No recommended courses found.");
      }

      // تحويل البيانات لتناسب الكومبوننت
      const fetchedSkills = response.data.data.map((skill) => ({
        category: `${skill.skill} Skills`,
        level: skill.level, // إضافة مستوى المهارة
        courses: skill.courses.length > 0
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
          setRetryCount(retryCount + 1);
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
    navigate("/");
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
    return skillResult ? skillResult.level : null; // تعديل من skillLevel لـ level
  };

  const getRecommendedCourse = (skillCategory, skillLevel, courses) => {
    const userLevel = getUserLevel(skillCategory);
    if (!userLevel || userLevel === skillLevel) return courses.slice(0, 3); // نرجع أول 3 كورسات لو المستوى متطابق
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

  // تقسيم المهارات إلى مجموعات مع ضمان التناسق
  const firstRowSkills = skills.slice(0, 2);
  const secondRowSkills = skills.slice(2, 4);
  const thirdRowSkills = skills.slice(4, 6);
  const allSkillsGroups = [
    firstRowSkills,
    secondRowSkills,
    thirdRowSkills.filter(Boolean),
  ].filter((group) => group.length > 0);

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="w-full max-w-5xl space-y-10">
      {Array(2)
        .fill()
        .map((_, groupIndex) => (
          <div
            key={groupIndex}
            className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {Array(2)
              .fill()
              .map((_, index) => (
                <div
                  key={index}
                  className="w-full max-w-md animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="bg-white rounded-2xl shadow-md w-full h-[350px]">
                    <div className="w-full h-[200px] bg-gray-200 rounded-t-xl"></div>
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
        <h1 className="text-2xl sm:text-3xl font-bold text-black mb-6 sm:mb-8 text-center">
          Your Recommended Plan
        </h1>

        <div className="w-full max-w-5xl space-y-10">
          {allSkillsGroups.map((skillGroup, groupIndex) => (
            <div
              key={groupIndex}
              className={`grid grid-cols-1 ${
                skillGroup.length === 1 ? "sm:grid-cols-1" : "sm:grid-cols-2"
              } gap-8 max-w-4xl mx-auto`}
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
                    <div className="w-full max-w-md">
                      <h2 className="text-xl font-semibold text-[#233A66] text-center mb-4">
                        {skill.category}
                      </h2>
                      {(recommendedCourses.length > 0
                        ? recommendedCourses
                        : skill.courses
                      ).map((course, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-2xl shadow-md flex flex-col justify-between items-center w-full h-[350px] max-h-[350px] transform transition-transform duration-300 hover:scale-105 hover:shadow-lg mb-4"
                        >
                          <div className="w-full h-[200px] relative">
                            <img
                              src={course.image}
                              alt={course.name}
                              className="absolute top-0 left-0 w-full h-full object-cover rounded-t-xl"
                              onError={(e) => {
                                console.log(`Failed to load image: ${course.image}`);
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
                              )}`}
                            >
                              {course.level}
                            </span>
                          </div>
                        </div>
                      ))}
                      {skill.courses.length === 0 && (
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