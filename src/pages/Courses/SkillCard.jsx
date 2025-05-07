

import { Link } from "react-router-dom";

const SkillCard = ({ skill }) => {
  return (
    <Link
      to={`/courses/${skill.id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-1 block"
    >
      <img
        src={skill.imageUrl}
        alt={skill.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-5 flex flex-col gap-2">
        <h2 className="text-xl font-bold text-[#1E3A8A]">{skill.title}</h2>

        <p className="text-sm text-gray-600 line-clamp-2">
          {skill.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-2">
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
            {skill.skill}
          </span>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
            {skill.level}
          </span>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs ml-auto">
            ⏱ {skill.duration}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default SkillCard;
