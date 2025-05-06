// import { Link } from "react-router-dom";

// const SkillCard = ({ skill }) => {
//   return (
//     <Link
//       to={`/skills/${skill.id}`}
//       className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 block"
//     >
//       <img
//         src={skill.image}
//         alt={skill.title}
//         className="w-full h-48 object-cover"
//       />
//       <div className="p-4">
//         <h2 className="text-xl font-semibold text-[#233A66] mb-2">
//           {skill.title}
//         </h2>
//         <p className="text-sm text-gray-600 mb-4">{skill.description}</p>
//         <div className="flex justify-between text-sm text-gray-400">
//           <span>Learning path : {skill.coursesCount} courses</span>
//           <span>{skill.level}</span>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default SkillCard;



import { Link } from "react-router-dom";

const SkillCard = ({ skill }) => {
  return (
    <Link
      to={`/skills/${skill.id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 block"
    >
      <img
        src={skill.imageUrl}
        alt={skill.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-[#233A66] mb-2">
          {skill.title}
        </h2>
        <p className="text-sm text-gray-600 mb-4">{skill.description}</p>
        <div className="flex justify-between text-sm text-gray-400">
          <span>{skill.skill}</span> 
          <span>{skill.level}</span>
        </div>
      </div>
    </Link>
  );
};

export default SkillCard;
