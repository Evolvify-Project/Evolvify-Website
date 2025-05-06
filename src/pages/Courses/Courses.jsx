// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { skills } from "../Courses/Data/SkillData";
// import SkillCard from "./SkillCard";
// import studentLearningImg from "../../assets/images/Learning-rafiki.svg";

// const CoursesPage = () => {
//   const [selectedTopic, setSelectedTopic] = useState("");
//   const [selectedLevel, setSelectedLevel] = useState("");

//   const filteredSkills = skills.filter((skill) => {
//     const topicMatch = selectedTopic ? skill.id === selectedTopic : true;
//     const levelMatch = selectedLevel
//       ? skill.level.toLowerCase() === selectedLevel
//       : true;
//     return topicMatch && levelMatch;
//   });

//   return (
//     <section className="min-h-screen bg-white">
//       <div className="container mx-auto flex justify-between items-center">
//         {/* Header */}
//         <div className="header px-28 py-4">
//           <div className="flex flex-col gap-4 text-darkBlue">
//             <h1 className="text-4xl font-bold">Our Courses</h1>
//             <div className="flex items-center text-md">
//               <Link
//                 to="/home"
//                 className="flex items-center cursor-pointer text-md"
//               >
//                 <span>Home</span>
//                 <p className="mx-2">
//                   <i className="fa-solid fa-circle-arrow-right"></i>
//                 </p>
//               </Link>
//               <span>Courses</span>
//             </div>
//           </div>
//         </div>
//         <img
//           src={studentLearningImg}
//           alt="Student studying"
//           className="w-[450px] h-auto pr-14"
//         />
//       </div>

//       {/* Filtertion */}
//       <div className="Filtertion">
//         <p className="text-3xl font-bold text-center py-6 text-darkBlue">
//           Develop Your Soft Skills for Success!
//         </p>

//         <div className="flex justify-center items-center gap-4">
//           <select
//             className="px-4 py-2 border rounded-lg bg-white"
//             value={selectedTopic}
//             onChange={(e) => setSelectedTopic(e.target.value)}
//           >
//             <option value="">All</option>
//             <option value="presentation">Presentation</option>
//             <option value="interview">Interview</option>
//             <option value="communication">Communication</option>
//             <option value="teamwork">Teamwork</option>
//             <option value="time-management">Time Management</option>
//           </select>

//           <select
//             className="px-4 py-2 border rounded-lg bg-white"
//             value={selectedLevel}
//             onChange={(e) => setSelectedLevel(e.target.value)}
//           >
//             <option value="">Level</option>
//             <option value="beginner">Beginner</option>
//             <option value="intermediate">Intermediate</option>
//             <option value="advanced">Advanced</option>
//           </select>
//         </div>
//       </div>

//       {/* Cards */}
//       <div className="cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto p-6">
//         {filteredSkills.map((skill) => (
//           <SkillCard key={skill.id} skill={skill} />
//         ))}
//       </div>
//     </section>
//   );
// };

// export default CoursesPage;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SkillCard from "./SkillCard";
import studentLearningImg from "../../assets/images/Learning-rafiki.svg";

const CoursesPage = () => {
  const [skills, setSkills] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get("https://evolvify.runasp.net/api/Courses");
        setSkills(response.data.data); 
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  const filteredSkills = skills.filter((skill) => {
    const topicMatch = selectedTopic ? skill.skill.toLowerCase() === selectedTopic : true;
    const levelMatch = selectedLevel ? skill.level.toLowerCase() === selectedLevel : true;
    return topicMatch && levelMatch;
  });

  return (
    <section className="min-h-screen bg-white">
      <div className="container mx-auto flex justify-between items-center">
        {/* Header */}
        <div className="header px-28 py-4">
          <div className="flex flex-col gap-4 text-darkBlue">
            <h1 className="text-4xl font-bold">Our Courses</h1>
            <div className="flex items-center text-md">
              <Link to="/home" className="flex items-center cursor-pointer text-md">
                <span>Home</span>
                <p className="mx-2">
                  <i className="fa-solid fa-circle-arrow-right"></i>
                </p>
              </Link>
              <span>Courses</span>
            </div>
          </div>
        </div>
        <img
          src={studentLearningImg}
          alt="Student studying"
          className="w-[450px] h-auto pr-14"
        />
      </div>

      <div className="Filtertion">
        <p className="text-3xl font-bold text-center py-6 text-darkBlue">
          Develop Your Soft Skills for Success!
        </p>

        <div className="flex justify-center items-center gap-4">
          <select
            className="px-4 py-2 border rounded-lg bg-white"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            <option value="">All</option>
            <option value="presentation">Presentation</option>
            <option value="interview">Interview</option>
            <option value="communication">Communication</option>
            <option value="teamwork">Teamwork</option>
            <option value="time management">Time Management</option>
          </select>

          <select
            className="px-4 py-2 border rounded-lg bg-white"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="">Level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto p-6">
        {filteredSkills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
    </section>
  );
};

export default CoursesPage;

