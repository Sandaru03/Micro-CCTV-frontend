import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function TechnicianLogin() {
  const navigate = useNavigate();

  // change this if your route differs (e.g. "/auth/technician/login")
  const LOGIN_PATH = "/technicians/login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Email සහ Password දෙකම අත්‍යවශ්‍යයි");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + LOGIN_PATH,
        { email: email.trim(), password },
        { headers: { "Content-Type": "application/json" } }
      );

      const token = res?.data?.token;
      const tech =
        res?.data?.technician || res?.data?.tech || res?.data?.user || null;

      if (!token) {
        throw new Error("Token not found in response");
      }

      // keep technician auth separate from admin
      localStorage.setItem("techToken", token);
      if (tech) localStorage.setItem("technician", JSON.stringify(tech));

      // optional remember me (persist email)
      if (remember) {
        localStorage.setItem("techLastEmail", email.trim());
      } else {
        localStorage.removeItem("techLastEmail");
      }

      toast.success("Welcome back 👋");
      // ⬇️ Redirect to Technician Repair Page
      navigate("/technician/repairs");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please check your credentials.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  // preload remembered email
  useEffect(() => {
    const last = localStorage.getItem("techLastEmail");
    if (last) setEmail(last);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-stretch">
        {/* Left: Brand / Visual */}
        <div className="hidden md:flex relative rounded-3xl overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-800 to-gray-900" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, #ffffff22 0 20%, transparent 20%), radial-gradient(circle at 80% 80%, #ffffff22 0 20%, transparent 20%)",
            }}
          />
          <div className="relative z-10 p-10 text-white flex flex-col justify-end">
            <div className="mb-auto">
              <div className="inline-flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full backdrop-blur">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm">Technician Portal</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold mt-6 leading-tight">
                Sign in to manage <br /> your repair jobs
              </h1>
              <p className="text-white/80 mt-3">
                Track assigned repairs, update statuses, and view schedules.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <img
                src="/MICROCCTVLogo.png"
                alt="Logo"
                className="w-10 h-10 object-contain"
              />
              <div>
                <h2 className="text-2xl font-bold">Technician Login</h2>
                <p className="text-gray-500 text-sm">
                  Use your technician account to continue
                </p>
              </div>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <FiMail className="text-gray-400" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tech@example.com"
                  className="w-full border rounded-xl pl-10 pr-3 h-11 focus:outline-none focus:ring-2 focus:ring-gray-800"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <FiLock className="text-gray-400" />
                </span>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border rounded-xl pl-10 pr-10 h-11 focus:outline-none focus:ring-2 focus:ring-gray-800"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Remember me
              </label>
              <Link
                to="/technician/forgot-password"
                className="text-sm text-gray-900 hover:underline"
              >
            
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Helper */}
          <div className="mt-6 text-xs text-gray-500">
         
          </div>
        </div>
      </div>
    </div>
  );
}
