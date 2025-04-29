import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom"; 
import award from "../assets/images/award_first.png";
import payment from '../pages/payment'

const PremiumSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); 

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center py-8">
      <section className="container bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl text-center transition-all duration-300">
        {/* Award Icon */}
        <div className="mb-6">
          <img src={award} alt="Premium" className="h-24 mx-auto mb-4" />
          <h2 className="text-3xl font-semibold text-blue-500 leading-tight">
            Upgrade to Premium <br />
            to start practice
          </h2>
        </div>

        {/* Upgrade Button */}
        <button
          onClick={() => navigate("/payment")}
          className="bg-gradient-to-r from-[#64B5F6] to-[#3B6A90] text-white font-semibold py-3 px-8 rounded-full mb-8 hover:scale-105 transition duration-300"
        >
          Upgrade now
        </button>

        {/* Practice Options */}
        <div className="space-y-6">
          {["Practice Interview", "Practice Presentation"].map((label, i) => (
            <div
              key={i}
              className="bg-blue-50 rounded-xl p-6 flex justify-between items-center hover:bg-blue-100 transition duration-300"
            >
              <span className="text-xl font-medium text-[#233A66]">
                {label}
              </span>
              <button
                onClick={() => navigate("/payment")}
                className="bg-gradient-to-r from-[#64B5F6] to-[#3B6A90] text-white font-medium py-3 px-6 rounded-full shadow-md hover:scale-105 transition duration-300"
              >
                Practice now
              </button>
            </div>
          ))}
        </div>

        {/* Modal */}
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-md rounded-2xl bg-white p-6">
              <Dialog.Title className="text-xl font-semibold text-blue-600 mb-2">
                Premium Benefits ✨
              </Dialog.Title>
              <Dialog.Description className="text-gray-600 mb-4">
                - Unlimited Presentation & interview practice <br />
                - AI-Powered feedback <br />- Priority support and more!
              </Dialog.Description>
              <button
                onClick={() => navigate("/payment")} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Go to Payment
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </section>
    </div>
  );
};

export default PremiumSection;
