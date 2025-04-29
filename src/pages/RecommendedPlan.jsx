import React from "react";
import timeManagementImg from "../assets/images/timeManagement_5.jpg";
import communicationImg from "../assets/images/communication_3.jpg";
import TeamworkImg from "../assets/images/Teamwork_4.jpg";
import interviewImg from "../assets/images/Interview_2jpg.jpg";
import presentationImg from "../assets/images/Presentation_1.jpg";
import { useLocation, useNavigate } from "react-router-dom";

const RecommendedPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userResults } = location.state || { userResults: [] };

  const skills = [
    {
      category: "Time Management Skills",
      courses: [
        {
          name: "Time Management Basics",
          level: "Beginner",
          image: timeManagementImg,
        },
      ],
    },
    {
      category: "Communication Skills",
      courses: [
        {
          name: "Communication Basics",
          level: "Beginner",
          image: communicationImg,
        },
      ],
    },
    {
      category: "Teamwork Skills",
      courses: [
        { name: "Teamwork Basics", level: "Beginner", image: TeamworkImg },
      ],
    },
    {
      category: "Interview Skills",
      courses: [
        { name: "Interview Basics", level: "Beginner", image: interviewImg },
      ],
    },
    {
      category: "Presentation Skills",
      courses: [
        {
          name: "Presentation Basics",
          level: "Beginner",
          image: presentationImg,
        },
      ],
    },
  ];

  const handleSkip = () => {
    navigate("/");
  };

  const getUserLevel = (skillCategory) => {
    const skillResult = userResults.find((result) =>
      result.skill
        .toLowerCase()
        .includes(skillCategory.split(" ")[0].toLowerCase())
    );
    return skillResult ? skillResult.level : null;
  };

  const getRecommendedCourse = (skillCategory, courses) => {
    const userLevel = getUserLevel(skillCategory);
    if (!userLevel) return [];
    return courses.filter((course) => course.level === userLevel);
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

  // Split skills into three groups
  const firstRowSkills = skills.slice(0, 2); // Time Management, Communication
  const secondRowSkills = skills.slice(2, 4); // Teamwork, Interview
  const thirdRowSkill = skills[4]; // Presentation
  const allSkillsGroups = [
    firstRowSkills,
    secondRowSkills,
    thirdRowSkill ? [thirdRowSkill] : [],
  ];

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
              className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto"
            >
              {skillGroup.map((skill, index) => {
                const recommendedCourses = getRecommendedCourse(
                  skill.category,
                  skill.courses
                );
                return (
                  <div
                    key={index}
                    className="space-y-2 w-full flex justify-center"
                  >
                    <div className="w-full max-w-md">
                      <h2 className="text-xl font-semibold text-[#233A66] text-center">
                        {skill.category}
                      </h2>
                      {(recommendedCourses.length > 0
                        ? recommendedCourses
                        : skill.courses
                      ).map((course, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-2xl shadow-md flex flex-col justify-between items-center w-full h-[350px] transform transition-transform duration-300 hover:scale-105 hover:shadow-lg mt-4"
                        >
                          <div className="w-full h-[200px] relative">
                            <img
                              src={course.image}
                              alt={course.name}
                              className="absolute top-0 left-0 w-full h-full object-cover rounded-t-xl"
                            />
                          </div>
                          <div className="flex flex-col items-center p-4">
                            <h3 className="font-semibold text-base sm:text-lg text-[#233A66] text-center mb-2">
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
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <button
          onClick={handleSkip}
          className="mt-8 bg-[linear-gradient(to_right,#67B4FF,#1E3A5F)] text-white font-semibold py-2 px-12 rounded-full transition text-sm sm:text-base"
        >
          Skip
        </button>
      </div>
    </section>
  );
};

export default RecommendedPlan;
