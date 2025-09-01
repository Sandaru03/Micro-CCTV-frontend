import { Link } from "react-router-dom";
import { FaVideo, FaShieldAlt, FaBell, FaClock, FaCog, FaTools, FaEnvelope, FaPhone, FaLaptop } from "react-icons/fa";
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

        <div className="z-10 max-w-6xl mx-auto px-6 py-16 absolute top-[130px] right-170">
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

      {/* ABOUT */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="absolute left-[275px] top-[745px] text-red-600"><TbDeviceCctvFilled/></div>
            <p className="text-sm tracking-widest text-red-600 font-semibold absolute">ABOUT US</p>
            <div>
              <p className="text-sm tracking-widest md:text-4xl text-red-600 font-extrabold absolute top-195 ">Protecting homes,</p>
            </div>
            <div>
              <h2 className="mt-2 text-3xl md:text-4xl font-extrabold leading-tight relative left-40 top-5 ">
                <br /> businesses and
              </h2>
            </div>
            <div>
              <h2 className="mt-2 text-3xl md:text-4xl font-extrabold leading-tight relative left-100 top-[-35px]">
                <br /> peace
              </h2>
            </div>

            <p className="mt-5 text-sm font-semibold leading-relaxed text-neutral-700 max-w-[520px]">
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

          <div className="relative w-full h-[420px]">
            <img
              src="/Ph1.jpg"
              alt="Tech installing camera"
              className="absolute top-0 left-50 w-72 h-70 object-cover rounded-xl shadow-lg"
            />

            <img
              src="/Ph2.jpg"
              alt="Monitoring"
              className="absolute bottom-0 top-[250px] left-10 w-72 h-70 object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>

        <div className="mt-10 flex items-center gap-3 text-sm font-semibold">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600">10+</span>
          <span>We Have More Than 10+ Years of CCTV Services Experience</span>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="text-red-600 absolute left-[750px]"><HiMiniWrenchScrewdriver /></div>

            <h3 className="text-xl font-bold tracking-wide absolute left-195">SERVICES</h3>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            <ServiceCard img="/Ph3.jpg" title="CCTV Installation" icon={<FaTools className="w-5 h-5" />} />
            <ServiceCard img="/Ph4.jpg" title="Security Systems" icon={<FaShieldAlt className="w-5 h-5 " />} />
            <ServiceCard img="/Ph5.jpg" title="Alarm Systems Installation" icon={<FaBell className="w-5 h-5" />} />
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 h-[750px]">
        <div className="max-w-6xl mx-auto px-6" >
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

            {/* Middle Image */}
            <div>
              <img src="/Ph7.png" alt="Cameras" className="mx-auto max-h-[220px]" />
            </div>

            {/* Right */}
            <WhyItem 
              icon={<FaTools className="w-6 h-6" />} 
              title="Customized Solution" 
              desc="We provide professional CCTV installation services offering high-quality cameras." 
            />

            {/* Bottom (full width center) */}
            <div className="col-span-3 flex justify-center mt-6">
              <WhyItem 
                icon={<FaLaptop className="w-6 h-6" />} 
                title="Remote Access" 
                desc="We provide professional CCTV installation services offering high-quality cameras." 
              />
            </div>
          </div>
        </div>
      </section>

      <div>
            <img src="/Ph6.png" alt="Technician" className="md:justify-self-end w-[360px] md:w-[420px] lg:w-[460px] absolute top-[2342px] -translate-y-20 right-10" />
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
                <FaPhone className="w-4 h-4" /> +94 768 841 006
              </a>
              <a href="mailto:tharangaviii36@gmail.com" className="inline-flex items-center gap-2 hover:opacity-90">
                <FaEnvelope className="w-4 h-4" /> tharangaviii36@gmail.com
              </a>
            </div>
          </div>
          

        </div>  
        <div>
            <img src="/Ph6.png" alt="Technician" className="md:justify-self-end w-[360px] md:w-[420px] lg:w-[460px] absolute top-[-70px] -translate-y-20 right-10 " />
          </div>
        
      </section>

      {/* FOOTER */}
      <footer className="bg-neutral-900 text-neutral-300">
        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 font-semibold text-white">
              <FaVideo className="w-5 h-5" /> MicroCCTV
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
              <li>+94 768 841 006</li>
              <li>tharangaviii36@gmail.com</li>
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
      {/* Image section */}
      <div className="relative h-40">
        <img src={img} alt={title} className="w-full h-full object-cover" />
        <div className="absolute -bottom-6 left-6 inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-600 text-white shadow-lg">
          {icon}
        </div>
      </div>

      {/* Title */}
      <div className="pt-8 pb-6 px-6">
        <h4 className="font-semibold">{title}</h4>
      </div>

      {/* Popup on hover */}
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
