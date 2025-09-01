import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaCartShopping, FaUser } from "react-icons/fa6";
import { useState, useEffect, useRef, Fragment } from "react";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // show glass only on home
  const isHome = location.pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const token = localStorage.getItem("token");

  // Header scroll style -> only on home
  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  // Header bg classes
  const headerBgClass = isHome
    ? (scrolled ? "bg-black/90 shadow-md backdrop-blur" : "bg-transparent")
    : "bg-black/95 shadow-md";

  // Logo positioning: big/absolute on home, normal on others
   const logoClass =
    "w-[200px] h-[200px] object-cover absolute left-[80px] top-[-50px] cursor-pointer";

  return (
    <Fragment>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${headerBgClass} text-white`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between h-[90px] px-6 relative">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold tracking-wide text-lg">
            <img
              src="/MICROCCTVLogo.png"
              alt="Logo"
              className={logoClass}
              onClick={() => navigate("/")}
            />
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-6 text-sm uppercase">
            <Link to="/" className="hover:text-red-500 transition">Home</Link>
            <Link to="/shop" className="hover:text-red-500 transition">Shop</Link>
            <Link to="/service" className="hover:text-red-500 transition">Service</Link>
            <Link to="/about" className="hover:text-red-500 transition">About</Link>
            <Link to="/contact" className="hover:text-red-500 transition">Contact</Link>
          </nav>

          {/* Right Side: Cart + Profile */}
          <div className="flex items-center gap-4 relative">
            <Link
              to="/cart"
              className="relative flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition"
            >
              <FaCartShopping className="w-6 h-6" />
            </Link>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="relative flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition"
                aria-label="Profile menu"
              >
                <FaUser className="w-6 h-6" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-xl shadow-lg overflow-hidden">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                    onClick={() => setProfileOpen(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 transition cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for non-home pages so content starts below the fixed header */}
      {!isHome && <div className="h-[90px] w-full" aria-hidden="true" />}
    </Fragment>
  );
}
