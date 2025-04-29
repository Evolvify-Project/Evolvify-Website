import Login from "./pages/Login";
import Sign from "./pages/Signup";
import ForgetPassword from './pages/ForgetPassword/ForgetPassword'
import Home from "./pages/Home";
import Courses from "./pages/Courses/Courses";
import SkillDetailsPage from "./pages/Courses/SkillDetails";
import LearningUnitPage from "./pages/Courses/LearningUnitPage";
import AssessmentSection from "./pages/Courses/AssessmentSection";
import NotFound from "./pages/NotFound/NotFound";
import PremiumSection from "./pages/Practice";
import Community from "./pages/Community";
import Chatbot from "./pages/Chatbot"
import Quiz from "./pages/Quiz";
import ResultPage from "./pages/Result";
import RecommendedPlan from "./pages/RecommendedPlan";
import Payment from "./pages/payment";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import { SiChatbot } from "react-icons/si";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Navigate to="/home" /> },
        { path: "login", element: <Login /> },
        { path: "signup", element: <Sign /> },
        { path: "forget-password", element: <ForgetPassword /> },
        { path: "home", element: <Home /> },
        { path: "courses", element: <Courses /> },
        { path: "skills/:id", element: <SkillDetailsPage /> },
        { path: "learning-unit/:id", element: <LearningUnitPage /> },
        { path: "skills/:id/assessment", element: <AssessmentSection /> },
        { path: "practice", element: <PremiumSection /> },
        { path: "community", element: <Community /> },
        { path: "chatbot", element: <Chatbot /> },
        { path: "quiz", element: <Quiz /> },
        { path: "result", element: <ResultPage /> },
        { path: "recommended-plan", element: <RecommendedPlan /> },
        { path: "payment", element: <Payment /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
