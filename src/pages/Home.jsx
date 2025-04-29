import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import heroImg from '../assets/images/hero.png';
import whoWeAreImg from '../assets/images/who.png';
import elevateLifeImg from '../assets/images/enhance.png';
import mobileImg from '../assets/images/mobile.png';
// import qize from '../pages/Quiz'

function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <main className="bg-white text-darkBlue2">

      {/* Hero Section */}
      <section className="py-16" data-aos="fade-up">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              GROW UP <span className="text-blue-500">YOUR</span><br />
              SKILL IN MINUTES
            </h1>
            <Link to="/Quiz">
              <button className="bg-gradient-to-r from-sky-900 to-blue-500 text-white py-3 px-6 mt-10 rounded-full text-sm shadow-md hover:opacity-90 transition">
                Get started
              </button>
            </Link>
          </div>
          <div className="mt-10 md:mt-0 md:w-1/2" data-aos="zoom-in">
            <img src={heroImg} alt="Hero illustration" className="w-full max-w-md mx-auto" />
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-[#F9FBFC]" data-aos="fade-right">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <img src={whoWeAreImg} alt="Who We Are" className="w-full max-w-sm mx-auto" />
          </div>
          <div className="md:w-1/2 text-center md:text-left space-y-4">
            <h2 className="text-2xl font-bold text-[#4094C3]">Who We Are</h2>
            <p className="text-base leading-relaxed">
              We are a dedicated team of experts passionate about personal development, communication,
              leadership, and emotional intelligence. We provide valuable resources, training, and insights
              to help individuals unlock their full potential.
            </p>
          </div>
        </div>
      </section>

      {/* Enhance Your Skills Section */}
      <section className="py-20" data-aos="fade-left">
        <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center gap-8">
          <div className="md:w-1/2 text-center md:text-left space-y-4">
            <h2 className="text-2xl font-bold text-[#5BBEF1]">
              Enhance Your Skills, Elevate Your Life!
            </h2>
            <p className="text-base leading-relaxed">
              Unlock your full potential by developing essential soft skills that drive success in both
              your personal and professional life. We provide expert insights, practical exercises, and
              tailored content to help you grow.
            </p>
            <Link to="/Quiz">
              <button className="bg-gradient-to-r from-sky-900 to-blue-500 text-white py-3 px-6 mt-10 rounded-full text-sm shadow-md hover:opacity-90 transition">
                Get started
              </button>
            </Link>
          </div>
          <div className="md:w-1/2" data-aos="zoom-in">
            <img src={elevateLifeImg} alt="Elevate Your Life" className="w-full max-w-sm mx-auto" />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-[#F9FBFC]" data-aos="fade-up">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2" data-aos="zoom-in">
            <img src={whoWeAreImg} alt="Why Choose Us" className="w-full max-w-sm mx-auto" />
          </div>
          <div className="lg:w-1/2 space-y-3 text-center lg:text-left ">
            <h2 className="text-2xl font-bold text-[#5BBEF1]">Why Choose Us?</h2>
            <p className="text-base">
              At <span className="text-[#6EC1E4] font-medium">Evolvify</span>, we empower you with essential soft skills
              to excel in your personal and professional life. Here’s why we’re your best choice:
            </p>
            <ul className="list-decimal list-inside space-y-1 mt-4 font-medium">
              <li>Practical & Actionable Approach</li>
              <li>AI-Powered Chatbot for 24/7 Support</li>
              <li>Personalized Learning Experience</li>
              <li>Community & Networking Opportunities</li>
              <li>Proven Success & Results</li>
            </ul>
          </div>
          
        </div>
      </section>

      {/* Available Skills Section */}
      <section className="py-20" data-aos="fade-up">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-darkBlue2 mb-10">Available skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {["Presentation skill", "Interview skill", "Communication skill", "Time management skill", "Team work skill"].map((skill, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-sky-900 to-blue-500 text-white py-6 px-4 rounded-full shadow-md flex items-center justify-center text-sm font-medium"
                data-aos="zoom-in"
                data-aos-delay={idx * 100}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="py-20 bg-[#F9FBFC] text-center" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-darkBlue2 mb-6">Download our app now!</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10">
            <a href="#" className="bg-[#2769A2] text-white py-2 px-6 rounded-full text-sm hover:bg-darkBlue2 transition">
              <i className="fab fa-apple mr-2"></i>Download on the App Store
            </a>
            <a href="#" className="bg-[#2769A2] text-white py-2 px-6 rounded-full text-sm hover:bg-darkBlue2 transition">
              <i className="fab fa-google-play mr-2"></i>Get it on Google Play
            </a>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <img src={mobileImg} alt="Community App Preview" className="w-full -mb-20" data-aos="zoom-in" />
          </div>
        </div>
      </section>

    </main>
  );
}

export default Home;

