import notFoundImg from "../../assets/images/nootFound-4004.jpg";

export default function NotFound() {
  return (
    <div className="h-screen py-20 px-4 flex flex-col gap-8 justify-center items-center text-center">
      <img
        className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl transition-all duration-300"
        src={notFoundImg}
        alt="Not Found"
      />
      <a
        href="/home"
        className=" inline-block px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
      >
        Back to Home
      </a>
    </div>
  );
}
