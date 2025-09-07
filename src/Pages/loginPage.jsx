import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/users/googlelogin`, {
          token: response.access_token,
        })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          toast.success("Login Successful");
          if (res.data.role === "admin") navigate("/admin");
          else navigate("/");
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || "Google Login Failed");
        });
    },
    onError: () => toast.error("Google Login Failed"),
  });

  function login(e) {
    e?.preventDefault();
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/users/login`, { email, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        toast.success("Login Successful");
        if (res.data.role === "admin") navigate("/admin");
        else navigate("/");
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Login Failed");
      });
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[url(./loginbg.jpg)] bg-cover bg-center bg-no-repeat" />
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/50 md:bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center md:justify-end px-4 sm:px-6">
        <div
          className="
            w-full max-w-md sm:max-w-lg lg:max-w-xl
            rounded-[30px] border border-white/20 bg-white/10 backdrop-blur-2xl
            shadow-2xl text-white
            p-6 sm:p-8 md:mr-10
            flex flex-col
          "
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">Login</h1>

          <form onSubmit={login} className="space-y-4">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm sm:text-base">Email</label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  h-11 w-full rounded-md border border-white/40 px-3
                  bg-white/20 placeholder-white/60
                  focus:outline-none focus:ring-2 focus:ring-white/30
                "
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm sm:text-base">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  h-11 w-full rounded-md border border-white/40 px-3
                  bg-white/20 placeholder-white/60
                  focus:outline-none focus:ring-2 focus:ring-white/30
                "
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="
                mt-2 h-11 w-full rounded-xl bg-red-600 text-white text-base sm:text-lg font-medium
                hover:bg-red-700 active:scale-[0.99] transition-all duration-300 cursor-pointer
              "
            >
              Login
            </button>
          </form>

          {/* Google Login */}
          <button
            type="button"
            onClick={googleLogin}
            className="
              mt-3 h-11 w-full rounded-xl border border-white/30 bg-white/10
              hover:bg-white/20 active:scale-[0.99] transition-all duration-300
              inline-flex items-center justify-center gap-2
            "
          >
            <img
              src="/GoogleLogo.png"
              alt="Google"
              className="h-5 w-5"
              loading="lazy"
            />
            <span className="font-medium cursor-pointer">Continue with Google</span>
          </button>

          {/* Links */}
          <div className="mt-5 space-y-2 text-center text-sm">
            <p>
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-red-300 underline hover:text-red-200">
                Sign Up
              </Link>
            </p>
            <p>
              <Link to="/forget" className="text-red-300 underline hover:text-red-200">
                Forgot Password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
