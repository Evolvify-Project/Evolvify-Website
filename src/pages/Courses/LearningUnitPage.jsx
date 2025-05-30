
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function LessonPage() {
  const { id } = useParams();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeUnit, setActiveUnit] = useState(1);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const response = await axios.get(`https://evolvify.runasp.net/api/Course/{CouresId}/Modules/{ModuleId}`);
        setModule(response.data.data); 
        setLoading(false);
      } catch (err) {
        setError("Module not found!");
        setLoading(false);
      }
    };

    fetchModule();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error || !module) return <div className="p-6 text-red-600">{error}</div>;

  const {
    title,
    contents = [],
  } = module;

  const description = contents[0]?.descriptionPage || "No description available.";
  const learnings = contents[0]?.learnings || [];
  const sidebarLinks = contents.map((item, index) => item.title || `Unit ${index + 1}`);
  const videoUrl = contents[0]?.videoUrl || "";

  return (
    <div className="p-4 mt-16 flex flex-col lg:grid lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <aside className="bg-slate-100 rounded-lg shadow w-full p-4 lg:p-6 h-fit lg:sticky lg:top-8 flex flex-col">
        <h2 className="text-xl font-bold text-[#233A66] mb-2">{title}</h2>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
          <div>unit {activeUnit}</div>
          <div>Course ID: {module.courseId}</div>
        </div>

        <div className="space-y-6 flex-1">
          {sidebarLinks?.map((link, index) => {
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
          Unit {activeUnit}
        </div>

        <div className="relative overflow-hidden rounded-2xl shadow-md h-64 bg-gray-100 flex items-center justify-center">
          {videoUrl ? (
            <video
              className="w-full h-full object-cover"
              controls
              src={videoUrl}
            />
          ) : (
            <span className="text-gray-400">Video placeholder</span>
          )}
        </div>

        <div className="p-6 border rounded-xl shadow-lg bg-gray-50">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">
            <i className="fa-solid fa-microphone"></i> Mastering {title}
          </h2>
          <p className="text-sm text-gray-600 mb-4">{description}</p>

          <h3 className="text-md font-semibold text-blue-700 mb-2">
            <i className="fa-solid fa-magnifying-glass"></i> What you’ll learn
          </h3>
          {learnings.length > 0 ? (
            <ul className="list-decimal list-inside text-sm text-gray-700 space-y-1">
              {learnings.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No learning points available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
