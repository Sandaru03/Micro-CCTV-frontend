import { FaPhone, FaEnvelope, FaVideo } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ContactPage() {
  return (
    <div className="bg-gray-50">
      {/* CONTACT SECTION */}
      <section className="py-16 bg-gradient-to-r from-gray-400 to-gray-100 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Contact Info Card */}
          <div className="bg-white text-gray-900 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col gap-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-red-500 mb-2">
              Contact Us
            </h1>
            <p className="text-gray-700 text-sm sm:text-base">
              Secure your world with trusted CCTV solutions. Contact us today!
            </p>

            {/* Phone & Email */}
            <div className="flex flex-col gap-4 mt-4">
              <a
                href="tel:+94768841006"
                className="flex items-center gap-3 font-semibold hover:text-red-600 text-sm sm:text-base"
              >
                <FaPhone className="w-5 h-5 text-red-600" /> +94 768 841 006
              </a>
              <a
                href="mailto:tharangaviii36@gmail.com"
                className="flex items-center gap-3 font-semibold hover:text-red-600 text-sm sm:text-base"
              >
                <FaEnvelope className="w-5 h-5 text-red-600" />{" "}
                tharangaviii36@gmail.com
              </a>
            </div>
          </div>

          {/* Right: Map Card */}
          <div className="rounded-3xl overflow-hidden shadow-2xl h-64 sm:h-80 md:h-[400px] w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d495.0774365366318!2d79.85037624832954!3d6.9359985855074875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2596164898031%3A0x3b37d523479ef604!2sMicro%20CCTV%20Security%20Solutions!5e0!3m2!1sen!2slk!4v1756624457012!5m2!1sen!2slk"
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-neutral-900 text-neutral-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-semibold text-white">
              <FaVideo className="w-5 h-5" /> MicroCCTV
            </div>
            <p className="mt-4 text-sm opacity-80">
              We provide advanced security solutions, offering 24/7 protection
              with high-quality systems.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white/90">
                  HOME
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white/90">
                  SHOP
                </Link>
              </li>
              <li>
                <Link to="/service" className="hover:text-white/90">
                  SERVICE
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white/90">
                  ABOUT
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white/90">
                  CONTACT
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold">Services</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>24/7 Service</li>
              <li>CCTV Installation</li>
              <li>Alarm System Installation</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold">Contact Us</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="text-gray-400">+94 768 841 006</li>
              <li className="text-gray-400">tharangaviii36@gmail.com</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs py-4 border-t border-white/10">
          Copyright © {new Date().getFullYear()} All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
