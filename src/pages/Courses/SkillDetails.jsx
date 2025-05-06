// import { useParams, Link } from "react-router-dom";
// import { skills } from "./Data/SkillData";
// import { useState } from "react";

// export default function SkillPage() {
//   const { id } = useParams();
// const skillContent = skills.find((s) => s.id === Number(id));
//   const [activeUnit, setActiveUnit] = useState(1);

//   if (!skillContent) {
//     return (
//       <div className="text-center py-10 text-red-600">Skill not found</div>
//     );
//   }

//   const filteredArticles =
//     skillContent.unitsContent?.[activeUnit - 1]?.articles ||
//     skillContent.articles ||
//     [];
//   const filteredVideos =
//     skillContent.unitsContent?.[activeUnit - 1]?.videos ||
//     skillContent.videos ||
//     [];

//   return (
//     <section className="min-h-screen bg-white">
//       <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Sidebar */}
//           <aside className="LeftSidebar bg-slate-100 rounded-lg shadow w-full p-4 lg:p-6  h-fit lg:sticky lg:top-8">
//             <h2 className="text-xl font-bold text-[#233A66] mb-4">
//               {skillContent.title}
//             </h2>
//             <div className="flex items-center gap-6">
//               <div className="text-sm text-gray-600 mb-2">
//                 {skillContent.units} units
//               </div>
//               <div className="text-sm text-gray-600 mb-2">
//                 {skillContent.level}
//               </div>
//             </div>

//             <div className="UnitSidebar space-y-3">
//               {[...Array(skillContent.units)].map((_, index) => {
//                 const unitNumber = index + 1;
//                 if (unitNumber === 5) {
//                   return (
//                     <Link
//                       key={index}
//                       to={`/skills/${id}/assessment`}
//                       className={`p-3 rounded-lg cursor-pointer transition block ${
//                         activeUnit === unitNumber
//                           ? "bg-blue-100 text-blue-700"
//                           : "hover:bg-gray-50"
//                       }`}
//                     >
//                       <div className="font-medium">Unit {unitNumber}</div>
//                       <div className="text-sm mt-1">Assessment</div>
//                     </Link>
//                   );
//                 }

//                 return (
//                   <div
//                     key={index}
//                     onClick={() => setActiveUnit(unitNumber)}
//                     className={`p-3 rounded-lg cursor-pointer transition ${
//                       activeUnit === unitNumber
//                         ? "bg-blue-100 text-blue-700"
//                         : "hover:bg-gray-50"
//                     }`}
//                   >
//                     <div className="font-medium">Unit {unitNumber}</div>
//                     <div className="text-sm mt-1">
//                       {`${
//                         skillContent.unitsContent[index]?.articles?.length || 0
//                       } article${
//                         skillContent.unitsContent[index]?.articles?.length === 1
//                           ? ""
//                           : "s"
//                       } • ${
//                         skillContent.unitsContent[index]?.videos?.length || 0
//                       } video${
//                         skillContent.unitsContent[index]?.videos?.length === 1
//                           ? ""
//                           : "s"
//                       }`}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </aside>

//           {/* Main Content */}
//           <main className="MainContent lg:col-span-3 space-y-8">
//             {/* Header */}
//             <section className="Header bg-white rounded-lg shadow p-6">
//               <h1 className="text-3xl font-bold text-[#233A66] mb-4">
//                 {skillContent.title}
//               </h1>
//               <p className="text-gray-600">{skillContent.descriptionPage}</p>
//             </section>

//             {/* Articles */}
//             <section className="Articles bg-white rounded-lg shadow p-6">
//               <h2 className="text-2xl font-bold text-[#233A66] mb-6">
//                 Articles
//               </h2>
//               <div className="space-y-4">
//                 {filteredArticles.length > 0 ? (
//                   filteredArticles.map((article) => (
//                     <Link
//                       key={article.id}
//                       to={`/learning-unit/${skillContent.id}`}
//                       className="flex items-start space-x-3 text-gray-700 hover:text-blue-600 cursor-pointer"
//                     >
//                       <div>
//                         <i className="fa-solid fa-newspaper mr-2"></i>
//                         {article.title}
//                       </div>
//                     </Link>
//                   ))
//                 ) : (
//                   <div className="text-gray-600">No articles available.</div>
//                 )}
//               </div>
//             </section>

//             {/* Videos */}
//             <section className="Videos bg-white rounded-lg shadow p-6">
//               <h2 className="text-2xl font-bold text-[#233A66] mb-6">Videos</h2>
//               <div className="space-y-4">
//                 {filteredVideos.length > 0 ? (
//                   filteredVideos.map((video) => (
//                     <Link
//                       key={video.id}
//                       to={`/learning-unit/${skillContent.id}`}
//                       className="flex items-start space-x-3 text-gray-700 hover:text-blue-600 cursor-pointer"
//                     >
//                       <div>
//                         <i className="fa-solid fa-circle-play mr-2"></i>
//                         {video.title}
//                       </div>
//                     </Link>
//                   ))
//                 ) : (
//                   <div className="text-gray-600">No videos available.</div>
//                 )}
//               </div>
//             </section>
//           </main>
//         </div>
//       </div>
//     </section>
//   );
// }



// ===========================================================================


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
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!skillContent) {
    return <div className="text-center py-10 text-red-600">Skill not found</div>;
  }

  return (
    <section className="min-h-screen bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="bg-slate-100 rounded-lg shadow w-full p-4 lg:p-6 h-fit lg:sticky lg:top-8">
            <h2 className="text-xl font-bold text-[#233A66] mb-4">
              {skillContent.title}
            </h2>
            <div className="text-sm text-gray-600 mb-2">
              Level: {skillContent.level}
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Modules: {skillContent.numberOfModules}
            </div>

            <div className="space-y-3">
              {skillContent.modules.map((module, index) => (
                <div
                  key={module.id}
                  onClick={() => setActiveModule(module)}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    activeModule?.id === module.id
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium">{module.title}</div>
                </div>
              ))}
            </div>
          </aside>
              
          <main className="lg:col-span-3 space-y-8">
            <section className="bg-white rounded-lg shadow p-6">
              <h1 className="text-3xl font-bold text-[#233A66] mb-4">
                {skillContent.title}
              </h1>
              <p className="text-gray-600">{skillContent.description}</p>
              <p className="text-gray-500 mt-2">Duration: {skillContent.duration}</p>
            </section>

            {activeModule && (
              <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-[#233A66] mb-4">
                  {activeModule.title}
                </h2>
                <p className="text-gray-600">The content of this module will appear here soon</p>
              </section>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}

