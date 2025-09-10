import { Link } from "react-router-dom";
import {
  FaVideo, FaShieldAlt, FaBell, FaClock, FaTools, FaEnvelope, FaPhone, FaLaptop,
} from "react-icons/fa";
import { TbDeviceCctvFilled } from "react-icons/tb";
import { HiMiniWrenchScrewdriver } from "react-icons/hi2";
import { FaSearch } from "react-icons/fa";

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-neutral-50 text-neutral-900">

      {/* HERO */}
      <section className="relative w-full min-h-[520px] md:min-h-[640px] flex items-center overflow-hidden bg-black pt-[90px]">
        <img
          src="/Hero.jpg"
          alt="Control room"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <img
          src="/ne.png"
          alt="CCTV cameras"
          className="pointer-events-none absolute right-0 top-40 w-[520px] max-w-[85%] hidden md:block"
        />

        {/* Mobile hero */}
        <div className="z-10 mx-auto px-6 py-16 text-center md:hidden">
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight drop-shadow">
            <span className="block text-6xl">MICRO</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">CCTV</span>
          </h1>
          <p className="mt-3 text-xl font-semibold text-white">SECURITY SOLUTION</p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <FeatureBadge icon={<FaVideo className="w-5 h-5" />} title="Premium Indoor" desc="Cameras" />
            <FeatureBadge icon={<FaShieldAlt className="w-5 h-5" />} title="Amazing Security" desc="Systems" />
            <FeatureBadge icon={<FaClock className="w-5 h-5" />} title="24/7 Quick Alarms" desc="Response" />
          </div>
        </div>

        {/* Desktop hero (kept same style) */}
        <div className="hidden md:block z-10 max-w-6xl mx-auto px-6 py-16 absolute top-[130px] right-170">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight drop-shadow">
            <span className="block text-[80px]">MICRO</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">CCTV</span>
          </h1>
          <p className="mt-4 text-2xl md:text-3xl font-semibold text-white">SECURITY SOLUTION</p>

          <div className="mt-10 flex justify-center grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
            <FeatureBadge icon={<FaVideo className="w-5 h-5" />} title="Premium Indoor" desc="Cameras" />
            <FeatureBadge icon={<FaShieldAlt className="w-5 h-5" />} title="Amazing Security" desc="Systems" />
            <FeatureBadge icon={<FaClock className="w-5 h-5" />} title="24/7 Quick Alarms" desc="Response" />
          </div>
        </div>
      </section>

      {/* ABOUT — unified responsive layout (fixed desktop icon/text alignment) */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Text side */}
          <div>
            <div className="flex items-center gap-2 text-red-600 font-semibold">
              <TbDeviceCctvFilled className="text-lg" />
              <p className="text-xs tracking-widest">ABOUT US</p>
            </div>

            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold leading-tight">
              Protecting homes, <br className="hidden md:block" />
              businesses and peace
            </h2>

            <p className="mt-5 text-sm md:text-base font-semibold leading-relaxed text-neutral-700 max-w-prose">
              We specialize in providing top-quality security and CCTV solutions to safeguard your home and business.
              Our mission is to ensure peace of mind with reliable, innovative, and tailored protection systems.
            </p>

            <Link
              to="/about"
              className="inline-block mt-6 bg-red-600 hover:bg-red-700 text-white rounded-full px-5 py-2 text-sm"
            >
              ABOUT MORE
            </Link>
          </div>

          {/* Images side */}
          {/* Mobile: simple grid */}
          <div className="md:hidden">
            <div className="grid grid-cols-2 gap-4">
              <img src="/Ph1.jpg" alt="Tech installing camera" className="w-full h-40 object-cover rounded-xl shadow-lg" />
              <img src="/Ph2.jpg" alt="Monitoring" className="w-full h-40 object-cover rounded-xl shadow-lg" />
            </div>
          </div>

          {/* Desktop: tasteful overlap without absolute chaos */}
          <div className="hidden md:block">
            <div className="relative h-[420px]">
              <img
                src="/Ph1.jpg"
                alt="Tech installing camera"
                className="absolute top-0 left-0 w-[56%] h-[70%] object-cover rounded-xl shadow-lg"
              />
              <img
                src="/Ph2.jpg"
                alt="Monitoring"
                className="absolute bottom-0 right-4 w-[48%] h-[65%] object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Experience line */}
        <div className="mt-10 flex items-center gap-3 text-sm font-semibold">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600">10+</span>
          <span>We Have More Than 10+ Years of CCTV Services Experience</span>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Heading */}
          <div className="mb-8 flex items-center gap-2">
            <HiMiniWrenchScrewdriver className="text-red-600" />
            <h3 className="text-xl font-bold tracking-wide">SERVICES</h3>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            <ServiceCard img="/Ph3.jpg" title="CCTV Installation" icon={<FaTools className="w-5 h-5" />} />
            <ServiceCard img="/Ph4.jpg" title="Security Systems" icon={<FaShieldAlt className="w-5 h-5 " />} />
            <ServiceCard img="/Ph5.jpg" title="Alarm Systems Installation" icon={<FaBell className="w-5 h-5" />} />
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US — fixed image sizing on mobile */}
      <section className="py-16 md:h-[750px]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center mb-10 gap-2">
            <span className="text-red-500 text-xl">
              <i className="fas fa-user-check"></i>
            </span>
            <div className="text-red-600"><FaSearch /></div>
            <h3 className="text-xl font-bold tracking-wide text-gray-800">
              WHY CHOOSE US
            </h3>
          </div>

          <div className="grid lg:grid-cols-3 gap-10 items-center text-center">
            {/* Left */}
            <WhyItem
              icon={<FaClock className="w-6 h-6" />}
              title="24/7 Support"
              desc="We provide professional CCTV installation services offering high-quality cameras."
            />

            {/* Middle Image — scale nicely on mobile too */}
            <div className="flex justify-center">
              <img
                src="/Ph7.png"
                alt="Cameras"
                className="mx-auto w-[260px] sm:w-[320px] md:w-[380px] lg:w-[420px] h-auto object-contain"
              />
            </div>

            {/* Right */}
            <WhyItem
              icon={<FaTools className="w-6 h-6" />}
              title="Customized Solution"
              desc="We provide professional CCTV installation services offering high-quality cameras."
            />

            {/* Bottom (full width center) */}
            <div className="col-span-1 lg:col-span-3 flex justify-center mt-2 lg:mt-6">
              <WhyItem
                icon={<FaLaptop className="w-6 h-6" />}
                title="Remote Access"
                desc="We provide professional CCTV installation services offering high-quality cameras."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Decorative technician image (desktop only; left as-is) */}
      <div className="hidden md:block">
        <img
          src="/Ph6.png"
          alt="Technician"
          className="md:justify-self-end w-[360px] md:w-[420px] lg:w-[460px] absolute top-[2368px] -translate-y-20 right-10"
        />
      </div>

      {/* CONTACT CTA */}
      <section className="relative bg-red-600 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="uppercase tracking-widest text-red-100 text-xs">Contact Us</p>
            <h3 className="text-3xl md:text-4xl font-extrabold leading-tight mt-2">
              Secure your world with
              <br /> trusted solutions join
              <br /> today!
            </h3>
            <div className="flex items-center gap-6 mt-6 text-sm">
              <a href="tel:+94768841006" className="inline-flex items-center gap-2 hover:opacity-90">
                <FaPhone className="w-4 h-4" /> +94 702216447
              </a>
              <a href="mailto:tharangaviii36@gmail.com" className="inline-flex items-center gap-2 hover:opacity-90">
                <FaEnvelope className="w-4 h-4" /> sandarudilshan24@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <img
            src="/Ph6.png"
            alt="Technician"
            className="md:justify-self-end w-[360px] md:w-[420px] lg:w-[460px] absolute top-[-70px] -translate-y-20 right-10 "
          />
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

function FeatureBadge({ icon, title, desc }) {
  return (
    <div className="flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 text-white rounded-xl p-4">
      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">{icon}</div>
      <div className="leading-tight">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs opacity-80">{desc}</p>
      </div>
    </div>
  );
}

function ServiceCard({ img, title, icon }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden shadow-sm bg-white cursor-pointer">
      <div className="relative h-40">
        <img src={img} alt={title} className="w-full h-full object-cover" />
        <div className="absolute -bottom-6 left-6 inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-600 text-white shadow-lg">
          {icon}
        </div>
      </div>

      <div className="pt-8 pb-6 px-6">
        <h4 className="font-semibold">{title}</h4>
      </div>

      <div className="absolute inset-0 bg-black/70 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-lg font-bold">{title}</p>
        <p className="text-sm mt-2 px-4 text-center">
          Get the best {title} with professional installation and service.
        </p>
      </div>
    </div>
  );
}

function WhyItem({ icon, title, desc }) {
  return (
    <div className="text-center space-y-3">
      <div className="flex justify-center">
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-500 text-white text-2xl">
          {icon}
        </div>
      </div>
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="text-sm text-gray-600 max-w-[260px] mx-auto">{desc}</p>
    </div>
  );
}
