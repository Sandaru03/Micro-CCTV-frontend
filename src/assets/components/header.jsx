import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaCartShopping, FaUser } from "react-icons/fa6";
import { HiMenu, HiX } from "react-icons/hi";
import { useState, useEffect, Fragment } from "react";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const token = localStorage.getItem("token");

  // scroll effect only on home
  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const headerBgClass = isHome
    ? scrolled
      ? "bg-black/90 shadow-md backdrop-blur"
      : "bg-transparent"
    : "bg-black/95 shadow-md";

  return (
    <Fragment>
      <header
        className={`fixed top-0 left-0 w-full z-[60] transition-all duration-300 ${headerBgClass} text-white`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between h-[90px] px-6 relative">
          {/* Logo Left */}
          <div
            className="flex items-center gap-2 font-bold tracking-wide text-lg cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="/MICROCCTVLogo.png"
              alt="Logo"
              className="w-[120px] h-auto object-contain"
            />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm uppercase">
            <Link to="/" className="hover:text-red-500 transition">Home</Link>
            <Link to="/shop" className="hover:text-red-500 transition">Shop</Link>
            <Link to="/service" className="hover:text-red-500 transition">Service</Link>
            <Link to="/about" className="hover:text-red-500 transition">About</Link>
            <Link to="/contact" className="hover:text-red-500 transition">Contact</Link>
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-4 relative">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition"
            >
              <FaCartShopping className="w-6 h-6" />
            </Link>

            {/* Profile Icon */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition cursor-pointer"
              >
                <FaUser className="w-6 h-6" />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-black/95 shadow-lg rounded-md overflow-hidden z-50">
                  <div className="flex flex-col text-sm">
                    {token ? (
                      <>
                        <Link
                          to="/profile"
                          className="px-4 py-2 hover:bg-white/10"
                          onClick={() => setProfileOpen(false)}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setProfileOpen(false);
                          }}
                          className="text-left px-4 py-2 hover:bg-red-600 hover:text-white"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/login"
                        className="px-4 py-2 hover:bg-white/10"
                        onClick={() => setProfileOpen(false)}
                      >
                        Login
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <HiX className="w-7 h-7" /> : <HiMenu className="w-7 h-7" />}
          </button>
        </div>
      </header>

      {/* ✅ Mobile Dropdown full width */}
      {menuOpen && (
        <div className="md:hidden fixed top-[90px] left-0 w-full bg-black/95 text-white uppercase text-sm shadow-lg z-[70]">
          <div className="flex flex-col px-6 py-4 space-y-4">
            <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-red-500">Home</Link>
            <Link to="/shop" onClick={() => setMenuOpen(false)} className="hover:text-red-500">Shop</Link>
            <Link to="/service" onClick={() => setMenuOpen(false)} className="hover:text-red-500">Service</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)} className="hover:text-red-500">About</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:text-red-500">Contact</Link>

            <div className="border-t border-gray-700 my-2" />

            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 hover:text-red-500"
            >
              <FaCartShopping className="w-5 h-5" />
              <span>Cart</span>
            </Link>

            {token ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 hover:text-red-500"
                >
                  <FaUser className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-left text-red-400 hover:text-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 hover:text-red-500"
              >
                <FaUser className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Spacer for non-home pages */}
      {!isHome && <div className="h-[90px] w-full" aria-hidden="true" />}
    </Fragment>
  );
}
