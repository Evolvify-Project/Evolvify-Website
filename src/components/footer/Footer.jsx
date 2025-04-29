//


import lightLogo from '../../assets/images/light-logo.png';

export default function Footer() {
  return (
    <footer className="bg-[#1E3353] text-white py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo + Socials */}
        <div>
          <img src={lightLogo} alt="Evolvify Logo" className="w-40 mb-4 ml-0" />
          <div className="flex space-x-4 text-[#6EC1E4] text-2xl">
            <a href="https://facebook.com">
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a href="https://instagram.com">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="https://twitter.com">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Link</h2>
          <ul className="space-y-2 text-sm ">
            <li>
              <a href="/home">Home</a>
            </li>
            <li>
              <a href="/courses">Courses</a>
            </li>
            <li>
              <a href="#">About us</a>
            </li>
            <li>
              <a href="#">Contact us</a>
            </li>
          </ul>
        </div>

        {/* Courses */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Courses</h2>
          <ul className="space-y-2 text-sm">
            <li>Time management skill</li>
            <li>Communication skill</li>
            <li>Presentation skill</li>
            <li>Teamwork skill</li>
            <li>Interview skill</li>
          </ul>
        </div>

        {/* Download App */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Download App</h2>
          <p className="text-sm mb-4">Available in any kind of ready version</p>
          <div className="space-y-3">
            <a href="#" className="block bg-[#2C4770] p-3 rounded-md text-sm">
              <i className="fa-brands fa-apple mr-2"></i> download on the{" "}
              <strong>App Store</strong>
            </a>
            <a href="#" className="block bg-[#2C4770] p-3 rounded-md text-sm">
              <i className="fa-brands fa-google-play mr-2"></i> Get it on{" "}
              <strong>Google play</strong>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
