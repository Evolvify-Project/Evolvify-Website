
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function SkillPage() {
  const { id } = useParams();
  const [skillContent, setSkillContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(null);

  useEffect(() => {
    const fetchSkill = async () => {
      try {
const response = await axios.get(`https://evolvify.runasp.net/api/Courses/${id}`);
        setSkillContent(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching skill:", error);
        setLoading(false);
      }
    };

    fetchSkill();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10 text-gray-500 text-lg">Loading...</div>;
  }

  if (!skillContent) {
    return <div className="text-center py-10 text-red-600 text-lg">Skill not found</div>;
  }

  return (
    <section className="min-h-screen bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Modules List */}
          <aside className="bg-slate-50 rounded-xl shadow p-5 h-fit lg:sticky lg:top-8">
            <h2 className="text-2xl font-bold text-[#233A66] mb-4">
              {skillContent.title}
            </h2>

            <div className="text-sm text-gray-600 mb-1">
              <strong>Level:</strong> {skillContent.level}
            </div>
            <div className="text-sm text-gray-600 mb-4">
              <strong>Duration:</strong> {skillContent.duration}
            </div>
            <div className="text-sm text-gray-600 mb-4">
              <strong>Modules:</strong> {skillContent.numberOfModules}
            </div>

            <div className="space-y-2">
              {skillContent.modules && skillContent.modules.length > 0 ? (
                skillContent.modules.map((module) => (
                  <div
                    key={module.id}
                    onClick={() => setActiveModule(module)}
                    className={`p-3 rounded-lg cursor-pointer transition text-sm font-medium ${
                      activeModule?.id === module.id
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {module.title}
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No modules available.</p>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-8">
            <section className="bg-white rounded-xl shadow p-6">
              <h1 className="text-3xl font-bold text-[#233A66] mb-3">
                {skillContent.title}
              </h1>
              <p className="text-gray-700 leading-relaxed">
                {skillContent.description}
              </p>
              <div className="mt-4 flex gap-4 text-sm text-gray-600">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  {skillContent.skill}
                </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  {skillContent.level}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full ml-auto">
                  ⏱ {skillContent.duration}
                </span>
              </div>
            </section>

            {/* Module Details */}
            <section className="bg-white rounded-xl shadow p-6">
              {activeModule ? (
                <>
                  <h2 className="text-2xl font-bold text-[#233A66] mb-3">
                    {activeModule.title}
                  </h2>
                  <p className="text-gray-600">
                    The content of this module will appear here soon.
                  </p>
                </>
              ) : (
                <p className="text-gray-400 italic text-center">
                  Select a module to see its details.
                </p>
              )}
            </section>
          </main>
        </div>
      </div>
    </section>
  );
}
