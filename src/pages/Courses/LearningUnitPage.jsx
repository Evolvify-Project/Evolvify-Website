import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { skills } from "./Data/SkillData";

export default function LessonPage() {
  const { id } = useParams();

  const skill = skills.find((skill) => skill.id === id);

  if (!skill) {
    return <div className="p-6 text-red-600">Skill not found!</div>;
  }

  const {
    title,
    level,
    unit,
    descriptionPage: description,
    learnings,
    sidebarLinks,
    articles,
    videos,
    unitsContent,
    videoUrl,
  } = skill;

  const [activeUnit, setActiveUnit] = useState(1);

  return (
    <div className=" p-4 mt-16 flex flex-col lg:grid lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <aside className="bg-slate-100 rounded-lg shadow w-full p-4 lg:p-6 h-fit lg:sticky lg:top-8 flex flex-col">
        
        <h2 className="text-xl font-bold text-[#233A66] mb-2">{title}</h2>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
          <div>unit {unit}</div>
          <div>{level}</div>
        </div>

        <div className="space-y-6 flex-1">
          {sidebarLinks.map((link, index) => {
            const unitNumber = index + 1;
            return (
              <div
                key={index}
                onClick={() => setActiveUnit(unitNumber)}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeUnit === unitNumber
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div className="text-base">{link}</div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main content */}
      <div className="md:col-span-3 space-y-6">
        <div className="text-xl font-bold text-center text-[#233A66]">
          {skill.subtitle}
        </div>
        <div className="relative overflow-hidden rounded-2xl shadow-md h-64 bg-gray-100 flex items-center justify-center">
          {videoUrl ? (
            <video
              className="w-full h-full object-cover"
              controls
              src={videoUrl}
              alt={`${title} video`}
            />
          ) : (
            <span className="text-gray-400">Video placeholder</span>
          )}
        </div>

        <div className="p-6 border rounded-xl shadow-lg bg-gray-50">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">
            <i className="fa-solid fa-microphone"></i> Mastering {title} for
            Personal and Professional Success
          </h2>
          <p className="text-sm text-gray-600 mb-4">{description}</p>

          <h3 className="text-md font-semibold text-blue-700 mb-2">
            <i className="fa-solid fa-magnifying-glass"></i> What you’ll learn
            in this video:
          </h3>
          <ul className="list-decimal list-inside text-sm text-gray-700 space-y-1">
            {learnings?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
