import { Link } from "react-router-dom";
import { FaVideo } from "react-icons/fa";

export default function AboutUs() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* About Section with gradient background */}
      <section className="text-center py-20 bg-gradient-to-r from-gray-400 to-gray-100 text-white flex-grow px-6">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-red-500 mb-4">ABOUT US</h1>
        
        {/* Sub Heading */}
        <h2 className="text-lg text-gray-700 font-semibold leading-relaxed">
          Specialists in Security Camera Systems, Home Alarm Systems <br />
          With Warranty and Technical Support. <br />
          Unmatched Customer Support!
        </h2>

        {/* Content */}
        <div className="mt-8 max-w-4xl mx-auto text-gray-700 text-justify leading-relaxed space-y-8">
          <p>
            microcctvsecuretysolution.shop is your trusted partner in Digital Video Surveillance.
            We have a proven track record with over 04 years experience with Security
            Cameras and Security Camera Systems. Our DVR systems come standard with
            Live Remote Viewing which allows you to view your security system from
            the comfort of your home, or on the road.
          </p>

          <p>
            Every piece of security system equipment we carry has been fully tested
            to ensure our customers receive the best quality, performance and reliability.
            We are authorized dealers for all the security camera system products you see
            here, which allows us to offer the best pricing and an exceptional level of
            customer services. Our Customer support is unmatched with our 1 year warranty
            and lifetime technical support.
          </p>

          <p>
            Our specialists provide the right solution from remote video surveillance
            to HiMax DVR security camera systems for your businesses security needs and
            home protection. After listening to your needs, we will provide you with a
            Free custom quote that lies within your budget. Our goal is to make purchasing
            a security system easy!
          </p>

          <p className="text-center italic">
            Learn more about us and our products through this website….
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-neutral-900 text-neutral-300">
        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 font-semibold text-white">
              <img src="MICROCCTVLogo.png" className="w-[100px] h-[100px] "></img>
            </div>
            <p className="mt-4 text-sm opacity-80">
              We provide advanced security solutions, offering 24/7 protection with high-quality systems.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold">Quick Link</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white/90">HOME</Link></li>
              <li><Link to="/shop" className="hover:text-white/90">SHOP</Link></li>
              <li><Link to="/service" className="hover:text-white/90">SERVICE</Link></li>
              <li><Link to="/about" className="hover:text-white/90">ABOUT</Link></li>
              <li><Link to="/contact" className="hover:text-white/90">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold">Services</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>24/7 service</li>
              <li>CCTV Installation</li>
              <li>Alarm system installation</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold">Contact Us</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>+94 702216447</li>
              <li>sandarudilshan24@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs py-4 border-t border-white/10">
          Copyright © {new Date().getFullYear()} All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
