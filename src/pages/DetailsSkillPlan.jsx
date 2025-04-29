import React from "react";

const SkillSection = ({ category, courses }) => {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-[#233A66] mb-2">
        {category}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {courses.map((course, idx) => (
          <div
            key={idx}
            className="bg-white border border-blue-100 shadow-xl rounded-lg flex flex-col items-start h-72 w-full"
          >
            <div className="w-full h-56 rounded-lg mb-2 rounded-br-none rounded-bl-none overflow-hidden flex-shrink-0">
              <img
                src={course.image}
                alt={course.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 w-full px-3">
              <p className="text-gray-700 font-semibold text-sm sm:text-base truncate w-full">
                {course.name}
              </p>
              <p className="text-green-600 text-xs sm:text-sm">
                {course.level}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillSection;